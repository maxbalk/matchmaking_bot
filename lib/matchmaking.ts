import { User } from "discord.js";
import { findPlayer, RatedPlayer } from "./rated_player";
import { findRole, Role } from "./role";

export { allocatePlayers };

async function allocatePlayers(reactions: Map<string, User[]>, uniqueUsers: Set<User>, nTeams: number, guildId: string): Promise<Map<number, RatedPlayer>> {
    const ratedPlayers: RatedPlayer[] = await Promise.all(
        Array.from(uniqueUsers).map(async user => {
            return findPlayer(user, guildId)
        })
    )
    const eventRoles: Role[] = await Promise.all(
        Array.from(reactions).map(([k, v]) => k).map(async emojiName => {
            return findRole(emojiName, guildId)
        })
    )
    ratedPlayers.sort((a, b) => a.elo > b.elo ? -1 : 1)

    const userRoleMap: Map<User, Role[]> = invertReactionMap(reactions, uniqueUsers, eventRoles)
    const playerRoleMap: Map<RatedPlayer, Role[]> = ratedPlayerMap(userRoleMap, ratedPlayers)
    const initialRoleMap: Map<Role, Fruit[]> = initialRoleAssignmentMap(eventRoles)
    const roleAssignmentMap: Map<Role, Fruit[]> = assignRoles(ratedPlayers, playerRoleMap, initialRoleMap, new Array<RatedPlayer>())

    const firstFruit = Array.from(roleAssignmentMap).flatMap( ([role, fruit]) => fruit)

    const root = new TreeNode(firstFruit)
    const tree = buildTree(root)

    return new Promise<Map<number, RatedPlayer>>(() => { });
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
function initialRoleAssignmentMap(eventRoles: Role[]): Map<Role, Fruit[]> {
    return new Map<Role, Fruit[]>(eventRoles.map((er) => [er, new Array<Fruit>()]));
}

/**
 * 
 * @param players rated players sorted by decreasing elo
 * @param playerRoleMap rated players mapped to their potential roles
 * @param roleAssignmentMap roles mapped to empty array of players
 * @param assigned empty rated player array to keep track 
 * @returns role assignmentMap with player arrays populated
 */
function assignRoles(players: RatedPlayer[], playerRoleMap: Map<RatedPlayer, Role[]>, roleAssignmentMap: Map<Role, Fruit[]>, assigned: Array<RatedPlayer>): Map<Role, Fruit[]> {
    let assignedSize = Array.from(roleAssignmentMap).reduce( (accum, [role, rolePlayers]) => accum + rolePlayers.length, 0)
    if(assignedSize == players.length) return roleAssignmentMap; // number of assigned players equal to number of players
    
    let unassigned = players.filter(player => !assigned.includes(player))
    let currPlayer = unassigned.shift()                                        

    let playersWithSharedRoles = getPlayersWithSharedRoles(currPlayer, unassigned, playerRoleMap, roleAssignmentMap);

    if(playersWithSharedRoles.length > 0){
        let partner = playersWithSharedRoles[0]
        let sharedRoles = playerRoleMap.get(partner).filter(role => playerRoleMap.get(currPlayer).includes(role))
        sharedRoles.sort((a, b) => a.param_min - roleAssignmentMap.get(a).length > b.param_min - roleAssignmentMap.get(b).length ? -1 : 1)
        roleAssignmentMap.get(sharedRoles[0]).push(new Fruit(currPlayer.elo - partner.elo, currPlayer, partner))
        assigned.push(currPlayer, partner)
    } else {
        playerRoleMap.get(currPlayer).sort((a,b) => a.param_min - roleAssignmentMap.get(a).length > b.param_min - roleAssignmentMap.get(b).length ? -1 : 1)
        roleAssignmentMap.get(playerRoleMap.get(currPlayer)[0]).push(new Fruit(currPlayer.elo, currPlayer, null))
        assigned.push(currPlayer)
    }
    return assignRoles(unassigned, playerRoleMap, roleAssignmentMap, assigned);
}

function getPlayersWithSharedRoles(currPlayer: RatedPlayer, unpairedPlayers: RatedPlayer[], playerRoleMap: Map<RatedPlayer, Role[]>, roleAssignmentMap: Map<Role, Fruit[]>): RatedPlayer[] {
    return unpairedPlayers.filter(unpaired => {               
        let unpairedRoles = playerRoleMap.get(unpaired)                       
        unpairedRoles.filter(role =>                                          
            playerRoleMap.get(currPlayer).includes(role)                                          
            && (roleAssignmentMap.get(role).length * 2) <= role.param_max
        ).length > 0
    })
}


class Fruit {
    val: number;
    mom: Fruit | RatedPlayer;
    dad: Fruit | RatedPlayer;

    constructor(val: number, mom: Fruit | RatedPlayer = null, dad: Fruit | RatedPlayer = null) {
        this.val = val
        this.mom = mom
        this.dad = dad
    }
}

function subsetDiff(subset: Fruit[]): number {
    const greatestDiff = subset.shift()
    const rightSum = subset.reduce((accum, elem) => {
        return accum + elem.val
    }, 0)
    return greatestDiff.val - rightSum
}

function getLeftSub(localSub: Fruit[]): Fruit[] {
    let first = localSub.shift()
    let second = localSub.shift()
    let newDiff = first.val - second.val
    localSub.push(new Fruit(newDiff, first, second))
    localSub.sort((a, b) => a.val > b.val ? -1 : 1)
    return localSub;
}

function getRightSub(localSub: Fruit[]): Fruit[] {
    let first = localSub.shift()
    let second = localSub.shift()
    let newSum = first.val + second.val
    localSub.push(new Fruit(newSum, first, second))
    localSub.sort((a, b) => a.val > b.val ? -1 : 1)
    return localSub;
}

class TreeNode {
    subset: Fruit[]
    left: TreeNode
    right: TreeNode
    diff: number

    constructor(subset: Fruit[]) {
        this.subset = subset
        this.diff = subsetDiff(subset)
    }
}


function buildTree(node: TreeNode): TreeNode {
    if (node.diff > 0) {
        return node;
    }
    const leftSub = getLeftSub(node.subset)
    node.left = buildTree(new TreeNode(leftSub))
    const rightSub = getRightSub(node.subset)
    node.right = buildTree(new TreeNode(rightSub))
    return node;
}

