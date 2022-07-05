import { User } from "discord.js";
import { findPlayer, RatedPlayer } from "./rated_player";
import { findRole, Role } from "./role";

export { allocatePlayers, createPairs };


async function allocatePlayers(reactions: Map<string, User[]>, uniqueUsers: Set<User>, nTeams: number): Promise<Map<number, RatedPlayer>> {
    const ratedPlayers: RatedPlayer[] = await Promise.all(
        Array.from(uniqueUsers).map( async user => {
            return findPlayer(user, this.guild_id)
        })
    )
    const eventRoles: Role[] = await Promise.all(
        Array.from(reactions).map(kv => kv[0]).map( async emojiName => {
            return findRole(emojiName, this.guild_id)
        })
    )
    
    ratedPlayers.sort( (a,b) => a.elo > b.elo ? 1 : -1) // sort players by descending elo
    const playerPairs = createPairs(ratedPlayers)
    playerPairs.sort( (a, b) => (a[0].elo - a[1].elo) > (b[0].elo - b[1].elo) ? -1 : 1)

    return new Promise<Map<number, RatedPlayer>>(() => {});
}

// pair each item with that above and below
function createPairs(items: RatedPlayer[]): Set<RatedPlayer>[] {
    return items.flatMap( (item, idx) => {
        const res =  []
        if (idx > 0) res.push( [item, item[idx - 1]])
        if (idx < items.length - 1) res.push( [item, item[idx + 1]])
        return res;
    })
}

class TreeNode {
    subset: RatedPlayer[]
    left: TreeNode
    right: TreeNode
    diff: number

}

function createTree(players: RatedPlayer[]) {}

