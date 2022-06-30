import { Message } from 'discord.js';
import { CommandClient } from '../app';
import matchRole from './setup'

export = {
	name: 'member-role',
	description: `Sets the member role name for the current league.\n
                    usage: !member-role <role name>`,
    admin: true,
	async execute(message: Message, client: CommandClient, args: Array<string>) {
        let league = client.leagues.get(message.guild.id);
        const roleName = args.join(' ');
        
        const newRole = await matchRole.findMatchingRole(message, roleName);
        const affectedRows = await league.findMemberRoleID(newRole, message.guild.id);

       league.member_role_id = newRole;
       client.leagues.set(message.guild.id, league)

        if (Number(affectedRows) > 0) {
            message.channel.send(`League member role set to: **${newRole}**`);
        } else {
            message.channel.send('There was a problem updating the league member role, please read the above message.'); 
        }
    },
};