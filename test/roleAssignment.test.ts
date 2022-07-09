import { suite, test } from "@testdeck/mocha";
import { assert, expect } from "chai";
import { MockUser } from "./mockDiscordStructures";
import { User } from "discord.js";


import { 
    invertReactionMap, ratedPlayerMap, assignRoles,
    getPlayersWithSharedRoles, initialRoleAssignmentMap
} from "../lib/roleAssignment"

@suite
class RoleAssignmentTest {
    @test
    'invert reaction map'() {
        invertReactionMap
    }

    @test
    'rated player map'() {
        ratedPlayerMap
    }

    @test
    'initial role assignment map'() {
        initialRoleAssignmentMap
    }

    @test
    'get players with shared roles'() {
        getPlayersWithSharedRoles
    }

    @test
    'assign roles'() {
        assignRoles
    }

}