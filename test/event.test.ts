import { suite, test } from "@testdeck/mocha";
import { expect } from "chai";
import { Event, events } from "../lib/event";
import MockDiscord from "./mockDiscord";

@suite 
class MatchMakingTests {

    private md: MockDiscord;
    private SUT: Event;

    before () {
        this.md = new MockDiscord();
        this.SUT = events().build({guild_id: this.md.getGuild().id})
    }

    @test 
    'gather unique member reactions on event announcement as participants' () {

    }

    @test
    'create (num participants / teamsize) teams. first come first serve' () {

    }

    @test
    'create (num teams nCr 2) matches as children of the given event' () {

    }


}