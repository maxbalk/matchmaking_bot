import { User } from "discord.js";
import { RatedPlayer } from "./rated_player";
import { Role } from "./role";

export { roleAllocation, invertReactionMap, ratedPlayerMap, assignRoles, getPlayersWithSharedRoles, initialRoleAssignmentMap }

/**
 * Pair players by role and elo to assign role
 */
 async function roleAllocation(reactions: Map<string, User[]>, uniqueUsers: Set<User>, ratedPlayers: RatedPlayer[], eventRoles: Role[]): Promise<Map<Role, RatedPlayer[]>> {
    ratedPlayers.sort((a, b) => a.elo > b.elo ? -1 : 1)
    const userRoleMap: Map<User, Role[]> = invertReactionMap(reactions, uniqueUsers, eventRoles)
    const playerRoleMap: Map<RatedPlayer, Role[]> = ratedPlayerMap(userRoleMap, ratedPlayers)
    const initialRoleMap: Map<Role, RatedPlayer[]> = initialRoleAssignmentMap(eventRoles)
    const roleAssignmentMap: Map<Role, RatedPlayer[]> = assignRoles(ratedPlayers, playerRoleMap, initialRoleMap, new Array<RatedPlayer>())
    return roleAssignmentMap;
}

/**
 *  Map users to their Role(s)
 */
 function invertReactionMap(reactions: Map<string, User[]>, uniqueUsers: Set<User>, eventRoles: Role[]): Map<User, Role[]> {
    const res = new Map<User, Role[]>()
    uniqueUsers.forEach(uu => res.set(uu, []))
    Array.from(reactions).forEach(([roleName, users]) => {
        users.forEach(user => {
            res.get(user).push(eventRoles.find(er => er.name = roleName))
        })
    })
    return res;
}

/**
 * Replace the keys of userRoleMap with their RatedPlayer Equivalent
 */
function ratedPlayerMap(userRoleMap: Map<User, Role[]>, ratedPlayers: RatedPlayer[]): Map<RatedPlayer, Role[]> {
    const mapping: Array<[RatedPlayer, Role[]]> = Array.from(userRoleMap, ([user, roles]) => 
        [ratedPlayers.find(rp => rp.user_id == user.id), roles]
    )
    return new Map(mapping);
}

/**
 * To keep track of role assignments as players are paired up
 */
function initialRoleAssignmentMap(eventRoles: Role[]): Map<Role, RatedPlayer[]> {
    return new Map<Role, RatedPlayer[]>(eventRoles.map((er) => [er, new Array<RatedPlayer>()]));
}

/**
 * 
 * @param players rated players sorted by decreasing elo
 * @param playerRoleMap rated players mapped to their potential roles
 * @param roleAssignmentMap roles mapped to empty array of players
 * @param assigned empty rated player array to keep track 
 * @returns role assignmentMap with player arrays populated
 */
function assignRoles(players: RatedPlayer[], playerRoleMap: Map<RatedPlayer, Role[]>, roleAssignmentMap: Map<Role, RatedPlayer[]>, assigned: Array<RatedPlayer>): Map<Role, RatedPlayer[]> {
    let assignedSize = Array.from(roleAssignmentMap).reduce( (accum, [role, rolePlayers]) => accum + rolePlayers.length, 0)
    if(assignedSize == players.length) return roleAssignmentMap; // number of assigned players equal to number of players
    
    let unassigned = players.filter(player => !assigned.includes(player))
    let currPlayer = unassigned.shift()                                        

    let playersWithSharedRoles = getPlayersWithSharedRoles(currPlayer, unassigned, playerRoleMap, roleAssignmentMap);

    if(playersWithSharedRoles.length > 0){
        let partner = playersWithSharedRoles[0]
        let sharedRoles = playerRoleMap.get(partner).filter(role => playerRoleMap.get(currPlayer).includes(role))
        sharedRoles.sort((a, b) => a.param_min - roleAssignmentMap.get(a).length > b.param_min - roleAssignmentMap.get(b).length ? -1 : 1)
        roleAssignmentMap.get(sharedRoles[0]).push(currPlayer, partner)
        assigned.push(currPlayer, partner)
    } else {
        playerRoleMap.get(currPlayer).sort((a,b) => a.param_min - roleAssignmentMap.get(a).length > b.param_min - roleAssignmentMap.get(b).length ? -1 : 1)
        roleAssignmentMap.get(playerRoleMap.get(currPlayer)[0]).push(currPlayer)
        assigned.push(currPlayer)
    }
    return assignRoles(unassigned, playerRoleMap, roleAssignmentMap, assigned);
}

/**
 * Filter unpaired players to those that share a role yet to be assingned its max_param times
 */
function getPlayersWithSharedRoles(currPlayer: RatedPlayer, unpairedPlayers: RatedPlayer[], playerRoleMap: Map<RatedPlayer, Role[]>, roleAssignmentMap: Map<Role, RatedPlayer[]>): RatedPlayer[] {
    return unpairedPlayers.filter(unpaired => {               
        let unpairedRoles = playerRoleMap.get(unpaired)                       
        unpairedRoles.filter(role =>                                          
            playerRoleMap.get(currPlayer).includes(role)                                          
            && (roleAssignmentMap.get(role).length * 2) <= role.param_max
        ).length > 0
    })
}