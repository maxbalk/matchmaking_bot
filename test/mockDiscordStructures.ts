import {
    Collection, Guild, GuildMember, GuildMemberRoleManager, 
    Message, Role, RoleManager
} from "discord.js";

class MockRoleManager extends RoleManager {

    cache: Collection<string, Role>;
    
    public override add(data: Role, id){
        this.cache.set(id, data);
        return data;
    }
}

export class MockGuild extends Guild {
    public roles: MockRoleManager;

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

    constructor(client, data, guild){
        super(client, data, guild);
        Object.defineProperty(this, "roles", {
            value: undefined,
            writable: true
        });
        this.roles = new MockMemberRolemanager(this);
    }

    public putRole(role: Role){
        this.roles.cache.set(role.id, role);
    }
}

export class MockMessage extends Message {

    public member: MockMember;

    constructor(client, member, data, channel){
        super(client, data, channel);
        Object.defineProperty(this, "member", {
            value: undefined,
            writable: true
        });
        this.member = member;
    }
}