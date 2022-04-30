import {
    Channel,
    ChannelManager,
    Collection, Guild, GuildChannel, GuildChannelManager, GuildMember, GuildMemberRoleManager, 
    Message, MessageManager, MessageReaction, ReactionManager, ReactionUserManager, Role, RoleManager, TextChannel, User
} from "discord.js";

class MockRoleManager extends RoleManager {
    cache: Collection<string, Role>;
    
    public override add(data: Role, id){
        this.cache.set(id, data);
        return data;
    }
}

class MockTextChannelManager extends GuildChannelManager {
    cache: Collection<string, MockTextChannel>;
}

export class MockGuild extends Guild {
    public roles: MockRoleManager;
    public channels: MockTextChannelManager;

    constructor(client, data){
        super(client, data);
        this.roles = new MockRoleManager(this);
    }

    public override addMember(user): any {
        if (!user) throw new TypeError('INVALID_TYPE');
        if (this.members.cache.has(user)) return this.members.cache.get(user);
        this.members.cache.set(user.id, user);
    }
}

class MockMemberRolemanager extends GuildMemberRoleManager {
    cache: Collection<string, Role>;
}

export class MockMember extends GuildMember {
    public roles: MockMemberRolemanager;
    public id: string;

    constructor(client, data, guild){
        super(client, data, guild);
        Object.defineProperty(this, "roles", {
            value: undefined,
            writable: true
        });
        this.roles = new MockMemberRolemanager(this);
    }
}

export class MockReactionUserManager extends ReactionUserManager {
    public cache: Collection<string, User>
}

export class MockMessageReaction extends MessageReaction { 
    public users: MockReactionUserManager;

    constructor(client, data, message){
        super(client, data, message);
        Object.defineProperty(this, "users", {
            value: undefined,
            writable: true
        });
        this.users = new MockReactionUserManager(client, [], this);
    }
}

export class MockReactionManager extends ReactionManager {
    public cache: Collection<string, MessageReaction>
}

export class MockMessage extends Message {
    public reactions: MockReactionManager;
    public member: MockMember;

    constructor(client, data, channel){
        super(client, data, channel);
        Object.defineProperty(this, "member", {
            value: undefined,
            writable: true
        });
    }
}


export class MockMessageManager extends MessageManager {
    public cache: Collection<string, Message>;
}

export class MockTextChannel extends TextChannel {
    public messages: MockMessageManager;
    public id: string;

    constructor(guild, data){
        super(guild, data);
        Object.defineProperty(this, "messages", {
            value: undefined,
            writable: true
        });
        this.messages = new MockMessageManager(this);
    }
}

export class MockUser extends User { 
    public id: string;
}
