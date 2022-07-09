import { suite, test } from "@testdeck/mocha";
import { assert, expect } from "chai";
import { MockGuild, MockMessage, MockMessageReaction, MockTextChannel } from "./mockDiscordStructures";
import { User, Collection } from "discord.js";
import { Event, events } from "../lib/event";
import { League, leagues } from "../lib/league";
import MockDiscord from "./mockDiscord";

@suite
class EventTest {

    private SUT: Event;
    private league: League;
    private md: MockDiscord;
    private guild: MockGuild;
    private announcement: MockMessage;
    private eventChannel: MockTextChannel;

    before() {
        this.md = new MockDiscord();
        this.guild = this.md.getGuild();
        this.announcement = this.md.getMessage();

        this.SUT = events().build({
            guild_id: this.guild.id,
            announcement_id: this.announcement.id
        });

        this.eventChannel = this.md.getTextChannel();
        this.guild.channels.cache.set(this.eventChannel.id, this.eventChannel);
        this.eventChannel.messages.cache.set(this.announcement.id, this.announcement);

        this.league = leagues().build({
            guild_id: this.guild.id,
            event_channel_id: this.eventChannel.id
        });
    }

    @test
    'locate event announcement message'() {
        assert(this.SUT.locateAnnouncement(
            this.SUT, this.guild, this.league) == this.announcement);
    }

    @test
    'gather all reactions on event announcement as a Map'() {
        const emojiA = this.md.mockEmoji("A");
        const emojiB = this.md.mockEmoji("B");
        const reactionA = new MockMessageReaction(this.md.getClient(), {emoji: emojiA}, this.announcement);
        const reactionB = new MockMessageReaction(this.md.getClient(), {emoji: emojiB}, this.announcement);
        for (let i = 0; i < 10; i++) {
            let user = this.md.mockUser(String(i));
            reactionA.users.cache.set(user.id, user);
            reactionB.users.cache.set(user.id, user);
        }
        this.announcement.reactions.cache.set('reactionA', reactionA);
        this.announcement.reactions.cache.set('reactionB', reactionB);
        let expectation = new Map<string, User[]>()
        expectation.set("A", Array.from(reactionA.users.cache.map(u => u)))
        expectation.set("B", Array.from(reactionB.users.cache.map(u => u)))

        let result = this.SUT.getReactions(this.announcement);

        result.forEach( (v, k) => assert(v.toString() == expectation.get(k).toString()))
    }

    @test
    'identify correct number of unique reactors'() {
        const emojiA = this.md.mockEmoji("A");
        const emojiB = this.md.mockEmoji("B");
        const reactionA = new MockMessageReaction(this.md.getClient(), {emoji: emojiA}, this.announcement);
        const reactionB = new MockMessageReaction(this.md.getClient(), {emoji: emojiB}, this.announcement);
        // total 10 
        for (let i = 0; i < 20; i += 2) {
            let user = this.md.mockUser(String(i));
            reactionA.users.cache.set(user.id, user);
        }
        // total 7
        for (let i = 0; i < 20; i += 3) {
            let user = this.md.mockUser(String(i));
            reactionB.users.cache.set(user.id, user);
        }
        const mockReactions = new Map<string, User[]>()
        mockReactions.set("A", reactionA.users.cache.map((user) => user))
        mockReactions.set("B", reactionB.users.cache.map((user) => user))
        // 0,6,12,18 make 4 reactors to both
        const result = this.SUT.getUniqueUsers(mockReactions)
        assert (result.size == 13)
    }

    @test
    'create (num participants / teamsize) teams. first come first serve'() {
        const emojiA = this.md.mockEmoji("A");
        const reactionA = new MockMessageReaction(this.md.getClient(), {emoji: emojiA}, this.announcement);
        for (let i = 0; i < 40; i++) {
            let user = this.md.mockUser(String(i));
            reactionA.users.cache.set(user.id, user);
        }
        const teamsize = 15;

    }

    @test
    'create (num teams nCr 2) matches as children of the given event'() {

    }


}