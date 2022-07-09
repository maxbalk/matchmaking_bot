import { User } from "discord.js";
import { RatedPlayer } from "./rated_player";
import { Role } from "./role";

export {
    teamAllocation, initialFruit, createFruit, buildTree, 
    findMinLeaf, backtrack, createTeams, Fruit, TreeNode
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
