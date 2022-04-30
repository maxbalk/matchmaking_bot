import {
    Channel, Emoji, Guild, GuildChannel, Message,
    Role, TextChannel, User
} from "discord.js";

import { CommandClient } from '../app';
import { MockGuild, MockMember, MockMessage, MockTextChannel, MockUser } from './mockDiscordStructures'


export default class MockDiscord {
    private client!: CommandClient;
    private guild!: MockGuild;
    private channel!: Channel;
    private guildChannel!: GuildChannel;
    private textChannel!: TextChannel;
    private user!: MockUser;
    private role!: Role;
    private member!: MockMember;

    constructor() {
        this.mockClient();
        this.mockGuild();
        this.mockChannel();
        this.mockGuildChannel();
        this.mockTextChannel();
        this.user = this.mockUser();
        this.mockMember();
        this.role = this.mockRole();
        this.guild.roles.add(this.mockRole(), this.guild.id)        
    }

    public getRole(): Role {
        return this.role;
    }

    public getClient(): CommandClient {
        return this.client;
    }

    public getGuild(): MockGuild {
        return this.guild;
    }

    public getChannel(): Channel {
        return this.channel;
    }

    public getGuildChannel(): GuildChannel {
        return this.guildChannel;
    }

    public getTextChannel(): MockTextChannel {
        return this.textChannel;
    }

    public getUser(): MockUser {
        return this.user;
    }

    public getMember(): MockMember {
        return this.member;
    }

    public getMessage(): MockMessage {
        return this.mockMessage();
    }

    public mockEmoji(name: string) {
        return new Emoji(this.client,{
            animated: false,
            name: name,
            id: name,
            deleted: false
        })
    }

    private mockClient(): void {
        this.client = new CommandClient();
    }

    private mockGuild(): void {
        let guild = new MockGuild(this.client, {
            unavailable: false,
            id: "guild-id",
            name: "mocked js guild",
            icon: "mocked guild icon url",
            splash: "mocked guild splash url",
            region: "eu-west",
            member_count: 42,
            large: false,
            features: [],
            application_id: "application-id",
            afkTimeout: 1000,
            afk_channel_id: "afk-channel-id",
            system_channel_id: "system-channel-id",
            embed_enabled: true,
            verification_level: 2,
            explicit_content_filter: 3,
            mfa_level: 8,
            joined_at: new Date("2018-01-01").getTime(),
            owner_id: "owner-id",
            channels: [],
            presences: [],
            voice_states: [],
            emojis: [],
        });
        this.guild = guild;
    }

    private mockChannel(): void {
        this.channel = new Channel(this.client, {
            id: "channel-id",
        });
    }

    private mockGuildChannel(): void {
        this.guildChannel = new GuildChannel(this.guild, {
            ...this.channel,

            name: "guild-channel",
            position: 1,
            parent_id: "123456789",
            permission_overwrites: [],
        });
    }

    private mockTextChannel(): void {
        this.textChannel = new MockTextChannel(this.guild, {
            ...this.guildChannel,

            topic: "topic",
            nsfw: false,
            last_message_id: "123456789",
            lastPinTimestamp: new Date("2019-01-01").getTime(),
            rate_limit_per_user: 0,
        });
    }

    public mockUser(id="user-id"): MockUser {
        return new MockUser(this.client, {
            id: id,
            username: "user username",
            discriminator: "user#0000",
            avatar: "user avatar url",
            bot: false,
        });
    }

    public mockMember(): void {
        let mm = new MockMember(
            this.client,
            {
                deaf: false,
                mute: false,
                self_mute: false,
                self_deaf: false,
                session_id: "session-id",
                channel_id: "channel-id",
                nick: "nick",
                joined_at: new Date("2020-01-01").getTime(),
                user: this.user,
            },
            this.guild
        );
        this.member = mm;
    }

    private mockMessage (): MockMessage {
        return new MockMessage(
            this.client,
            {
                id: "message-id",
                type: "DEFAULT",
                content: "this is the message content",
                author: this.user,
                webhook_id: null,
                pinned: false,
                tts: false,
                nonce: "nonce",
                embeds: [],
                attachments: [],
                edited_timestamp: null,
                reactions: [],
                mentions: [],
                mention_roles: [],
                mention_everyone: [],
                hit: false,
            },
            this.textChannel
        );
    }

    private mockRole(id: string = "role-id"): Role {
        return new Role(
            this.client, {
                id: id
            }, 
            this.guild 
        );
    }

}