import { Message, Role } from "discord.js";
import { CommandClient } from "../app";
import { findGuildLeague } from "../lib/league";

class abortSetup extends Error {}

export = {
  name: "setup",
  description: `Give the bot all the required information for optimal usage.\n
                    usage: !setup`,
  admin: true,
  async execute(message: Message, client: CommandClient, args: Array<string>) {
    await this.adminSetup(message, client);
    await this.memberSetup(message, client);
    await this.eventNameSetup(message, client);
    await this.setupMaxteamSize(message, client);
  },

  async findMatchingRole(message: Message, roleName: String) {
    const match = message.guild.roles.cache.values();
    for (let i in match){
      if (match[i] === roleName){
        console.log(match[i].name)
        return match[i].id
      }
      else{
        return
      }
    }
  },
  async findMatchingChannel(
    message: Message,
    client: CommandClient,
    channel: String
  ) {
    const match = message.guild.channels.cache.filter(
      (chan) => chan.type.toString() == "text" && chan.name == channel
    );
    if (!match.size) {
      message.channel.send(`Could not find text channel ${channel}`);
      return;
    }
    const matchedChannel = match.values()[0];
    return matchedChannel;
  },

  async adminSetup(message: Message, client: CommandClient) {
    const result = await this.trueAdminSetup(message, client)
    console.log(result)
  },

  async trueAdminSetup(message: Message, client: CommandClient) {
    const guildID = message.guild.id;
    let league = await findGuildLeague(message.guild.id)
     message.channel.send("Please enter the name of the admin role");
    try {
      const adminRoleCollection = await this.collectResponse(message);
      const match = await this.findMatchingRole(
        message,
        adminRoleCollection.content
      );
      const affectedRows = await league.updateAdminRoleID(match.id, guildID);
      console.log(match.id)
      league.admin_role_id = match;


      if (Number(affectedRows) > 0) {
        message.channel.send(`League admin role set to: **${match.name}**`);
        } else {
        message.channel.send(
          "There was a problem updating the league admin role"
        );
      }
    } catch (e) {
      if (e instanceof abortSetup) {
        return 'fail';
      }
    return 'success'
    }
  },

  async eventNameSetup(message: Message, client: CommandClient) {
    let league = await findGuildLeague(message.guild.id)
    message.channel.send("Enter the event text channels name");
    try {
      const eventChannelColl = await this.collectResponse(message);
      const channels = await this.findMatchingChannel(
        message,
        client,
        eventChannelColl.content
      );
      const affectedRows = await league.updateEventChannel(
        channels.id,
        channels.guild.id
      );

      if (Number(affectedRows) > 0) {
        message.channel.send(`Event channel set to: **${channels.name}**`);
      } else {
        message.channel.send("There was a problem updating the event channel");
      }
    } catch (e) {
      if (e instanceof abortSetup) {
        return;
      }
      this.eventNameSetup(message, client);
    }
  },

  async memberSetup(message: Message, client: CommandClient) {
    let league = await findGuildLeague(message.guild.id)
    message.channel.send("Please enter the name of the member role");
    try {
      const memberRoleCollection = await this.collectResponse(message);
      const newRole = await this.findMatchingRole(
        message,
        memberRoleCollection.content
      );
      const affectedRows = await league.updateMemberRoleID(
        newRole.id,
        message.guild.id
      );

      if (Number(affectedRows) > 0) {
        message.channel.send(`League member role set to: **${newRole.name}**`);
      } else {
        message.channel.send(
          "There was a problem updating the league member role, please read the above message."
        );
      }
    } catch (e) {
      if (e instanceof abortSetup) {
        return;
      }
      this.memberSetup(message, client);
    }
  },
  async setupMaxteamSize(message: Message, client: CommandClient) {
    let league = await findGuildLeague(message.guild.id)
    message.channel.send('Please input the maximum team size. (For 5v5s the max teamsize would be 5)')
    try {
      const teamsizeCollection = await this.collectResponse(message);
      if(isNaN(Number(teamsizeCollection.content))){
        message.channel.send('Please input a valid number!')
        this.setupMaxteamSize(message, client)
      } else {
        const affectedRows = await league.updateMaxTeamSize(Number(teamsizeCollection.content), message.guild.id)
        if (Number(affectedRows) > 0) {
          message.channel.send(`Max teamsize set to: **${teamsizeCollection.content}**`);
        } else {
          message.channel.send(
            "There was a problem updating the max teamsize, please read the above message."
          );
        }
      }
    } catch (e) {
      if (e instanceof abortSetup) {
        return;
      }
      this.setupMaxteamSize(message, client);
    }
  },

  async collectResponse(message: Message) {
   
    const msg_filter = (m) => m.author.id === message.author.id
    console.log(message.author.id)
    const collectedMessage = await message.channel
      .awaitMessages({filter: msg_filter, time: 2000000, max: 1, errors: ['time'] })
      .then((collection) => {
        return collection.first();
      })
      .catch();
    if (collectedMessage.content == "abort") {
      message.channel.send("Aborted!");
      throw new abortSetup();
    }
    return collectedMessage;
  },
};

