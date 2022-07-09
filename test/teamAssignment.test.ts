import { suite, test } from "@testdeck/mocha";
import { assert, expect } from "chai";

import {
    initialFruit, buildTree, findMinLeaf, backtrack, createTeams,
    Fruit, TreeNode
} from "../lib/teamAssignment"


@suite
class TeamAssignmentTest {

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