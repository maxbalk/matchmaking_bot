import { User } from "discord.js";
import { RatedPlayer } from "./rated_player";
import { Role } from "./role";

export {
    roleAllocation, teamAllocation, invertReactionMap, ratedPlayerMap, 
    initialFruit, createFruit, assignRoles, buildTree, findMinLeaf, backtrack, 
    createTeams, Fruit, TreeNode
}

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
 * Create pairs of role assigned players
 * 
 * Construct CKK tree of pairs (fruits)
 * 
 * Find minimum leaf node and backtrack to find teams.
 */
function teamAllocation(roleAssignmentMap: Map<Role, RatedPlayer[]>){
    const firstFruit = initialFruit(roleAssignmentMap)
    const root = new TreeNode(firstFruit)
    const tree: TreeNode = buildTree(root)
    const minLeaf: TreeNode = findMinLeaf(tree)
    const leftFruit = minLeaf.subset.shift()
    const rightFruit = minLeaf.subset

    const leftPairs: Fruit[] = backtrack(leftFruit, [])
    const rightPairs: Fruit[] = rightFruit.flatMap( fruit => backtrack(fruit, []))

    return createTeams(leftPairs, rightPairs)
}

/**
 * Go through role assigment players by two or one and create fruit 
 */
function initialFruit(roleAssignmentMap: Map<Role, RatedPlayer[]>): Fruit[] {
    return Array.from(roleAssignmentMap).flatMap( ([role, players]) => createFruit(players, []))
}
function createFruit(unpaired: RatedPlayer[], fruits: Fruit[]): Fruit[] {
    if(unpaired.length < 1) return fruits;

    let curr = unpaired.shift()
    if (unpaired.length > 0) {
        let partner = unpaired.shift()
        fruits.push(new Fruit(curr.elo - partner.elo, curr, partner))
    } else {
        fruits.push(new Fruit(curr.elo, curr, null))
    }
    return createFruit(unpaired, fruits);
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


/**
 * Each tree node has an array of fruit representing the current subset.
 * 
 * Fruit can have 'parents' of either another fruit or a rated player
 * 
 * Each leaf-level fruit is a tree itself
 * 
 * MOM PLAYER SHOULD HAVE GREATER ELO THAN DAD PLAYER
 */
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

/**
 * Find the difference between the leftmost fruit val and the sum of other fruit vals
 */
function subsetDiff(subset: Fruit[]): number {
    const greatestDiff = subset.shift()
    const rightSum = subset.reduce((accum, elem) => {
        return accum + elem.val
    }, 0)
    return greatestDiff.val - rightSum
}

/**
 * Combine the two greatest fruit into one with val of their val difference.
 * 
 * Insert the new fruit into the subset in sorted order
 */
function getLeftSub(localSub: Fruit[]): Fruit[] {
    let first = localSub.shift()
    let second = localSub.shift()
    let newDiff = first.val - second.val
    localSub.push(new Fruit(newDiff, first, second))
    localSub.sort((a, b) => a.val > b.val ? -1 : 1)
    return localSub;
}

/** Combine the two greatest fruit into one with val of their val sum.
 *  
 * Insert the new fruit into the subset in sorted order
 */
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

/**
 * Nodes whose leftmost value is greater than the sum of others become leaves
 * 
 * Otherwise, create a right child with getRightSub and left child with getLeftSub
 */
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

/**
 * Visit nodes in preorder to find leaf with least difference
 */
function findMinLeaf(node: TreeNode): TreeNode {
    if(!node.left && !node.right){
        return node
    }
    let left = findMinLeaf(node.left)
    let right = findMinLeaf(node.right)
    return left.diff < right.diff ? left : right
}

/**
 * Find all fruits who have no fruit as parents
 */
function backtrack(fruit: Fruit, fruits: Fruit[]): Fruit[] {
    if(fruit.mom.hasOwnProperty('elo') || fruit.dad.hasOwnProperty('elo')) {
        fruits.push(fruit)
    } else {
        if(fruit.mom) fruits.concat(backtrack(<Fruit>fruit.mom, fruits))
        if(fruit.dad) fruits.concat(backtrack(<Fruit>fruit.dad, fruits))
    }
    return fruits;
}

/**
 * All left pair moms go to left team, dads to right team
 * 
 * All right pair moms go to right team, dads to left team
 */
function createTeams(leftPairs: Fruit[], rightPairs: Fruit[]) {
    let teams = new Map<number, RatedPlayer[]>()
    let leftTeam: RatedPlayer[]
    let rightTeam: RatedPlayer[]

    leftPairs.forEach(fruit => {
        leftTeam.push(<RatedPlayer>fruit.mom)
        rightTeam.push(<RatedPlayer>fruit.dad)
    })
    rightPairs.forEach(fruit => {
        leftTeam.push(<RatedPlayer>fruit.dad)
        rightTeam.push(<RatedPlayer>fruit.mom)
    })

    teams.set(0, leftTeam)
    teams.set(1, rightTeam)
    return teams
}
