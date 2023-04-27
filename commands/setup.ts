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
    const roles = message.guild.roles.cache.values();
    for (const role of roles) {
      if (role.name === roleName) {
        console.log(role.name);
        console.log(role.id);
        return role;
      }
    }
    return "fail";
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
    const result = await this.trueAdminSetup(message, client);
    console.log(result);
    if (result === "success") {
      return;
    } else {
      await this.adminSetup(message, client);
    }
  },

  async trueAdminSetup(message: Message, client: CommandClient) {
    const guildID = message.guild.id;
    let league = await findGuildLeague(message.guild.id);
    message.channel.send("Please enter the name of the admin role");
    try {
      const adminRoleCollection = await this.collectResponse(message);
      const match = await this.findMatchingRole(
        message,
        adminRoleCollection.content
      );

      if (match !== "fail") {
        const affectedRows = await league.updateAdminRoleID(match.id, guildID);
        console.log(match.id);
        league.admin_role_id = match;

        if (Number(affectedRows) > 0) {
          message.channel.send(`League admin role set to: **${match.name}**`);
          return "success";
        }
      } else {
        message.channel.send(
          "There was a problem updating the league admin role, please use a role within in the server."
        );
      }
    } catch (e) {
      if (e instanceof abortSetup) {
      }
    }
  },

  async eventNameSetup(message: Message, client: CommandClient) {
    let league = await findGuildLeague(message.guild.id);
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
    const result = await this.trueMemberSetup(message, client);
    if (result === "success") {
      return;
    } else {
      await this.memberSetup(message, client);
    }
  },

  async trueMemberSetup(message: Message, client: CommandClient) {
    let league = await findGuildLeague(message.guild.id);
    message.channel.send("Please enter the name of the member role");
    try {
      const memberRoleCollection = await this.collectResponse(message);
      const match = await this.findMatchingRole(
        message,
        memberRoleCollection.content
      );

      if (match !== "fail") {
        const affectedRows = await league.updateMemberRoleID(
          match.id,
          message.guild.id
        );
        if (Number(affectedRows) > 0) {
          message.channel.send(`League member role set to: **${match.name}**`);
          return "success";
        }
      } else {
        message.channel.send(
          "There was a problem updating the league member role, please use a role within in the server."
        );
        return "fail";
      }
    } catch (e) {
      if (e instanceof abortSetup) {
        return;
      }
    }
  },

  async setupMaxteamSize(message: Message, client: CommandClient) {
    let league = await findGuildLeague(message.guild.id);
    message.channel.send(
      "Please input the maximum team size. (For 5v5s the max teamsize would be 5)"
    );
    try {
      const teamsizeCollection = await this.collectResponse(message);
      if (isNaN(Number(teamsizeCollection.content))) {
        message.channel.send("Please input a valid number!");
        this.setupMaxteamSize(message, client);
      } else {
        const affectedRows = await league.updateMaxTeamSize(
          Number(teamsizeCollection.content),
          message.guild.id
        );
        if (Number(affectedRows) > 0) {
          message.channel.send(
            `Max teamsize set to: **${teamsizeCollection.content}**`
          );
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
    const msg_filter = (m) => m.author.id === message.author.id;
    console.log(message.author.id);
    const collectedMessage = await message.channel
      .awaitMessages({
        filter: msg_filter,
        time: 2000000,
        max: 1,
        errors: ["time"],
      })
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
