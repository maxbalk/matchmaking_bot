import { suite, test } from "@testdeck/mocha";
import { assert, expect } from "chai";
import { MockUser } from "./mockDiscordStructures";
import { User } from "discord.js";
import {
    invertReactionMap, ratedPlayerMap, assignRoles,
    initialFruit, buildTree, findMinLeaf, backtrack, createTeams,
    Fruit, TreeNode
} from "../lib/matchmaking"


@suite
class MatchmakingTest {

    @test
    'invert reaction map'() {
        invertReactionMap
    }

    @test
    'rated player map'() {
        ratedPlayerMap
    }

    @test
    'assign roles'() {
        assignRoles
    }

    @test
    'initial fruit'() {
        initialFruit
    }

    @test
    'build tree'(){
        buildTree
    }

    @test
    'find min leaf'(){
        findMinLeaf
    }

    @test
    'backtrack'(){
        backtrack
    }

    @test
    'create teams'(){
        createTeams
    }

}