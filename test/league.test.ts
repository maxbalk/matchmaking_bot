import { suite, test } from "@testdeck/mocha";
import { assert, expect } from "chai";
import { Guild } from "discord.js";
import { League, leagues } from "../lib/league";
import MockDiscord from "./mockDiscord";


@suite class leagueTests {

    private md: MockDiscord;
    private SUT: League;
    private guild: Guild;

    before(){
        this.md = new MockDiscord();
        this.guild = this.md.getGuild();
        this.SUT = leagues().build({guild_id: this.guild.id})
    }

    @test 'league admin message passes perm check' () {

        let leagueAdminRole = this.md.getRole();
        let leagueAdmin = this.md.getMember();
        this.SUT.admin_role_id = leagueAdminRole.id;

        leagueAdmin.roles.cache.set(leagueAdminRole.id, leagueAdminRole);
        let message = this.md.getAuthoredMessage(leagueAdmin);
        expect(this.SUT.permCheck(message)).to.be.true
    }

    @test 'message from league member fails perm check' () {
        let leagueMemberRole = this.md.getRole();
        let leagueMember = this.md.getMember();
        this.SUT.admin_role_id = "not a matching role id";
        
        leagueMember.roles.cache.set(leagueMemberRole.id, leagueMemberRole);
        let message = this.md.getAuthoredMessage(leagueMember);
        expect(this.SUT.permCheck(message)).to.be.false
    }


}
