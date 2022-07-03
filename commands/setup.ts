import { channel } from "diagnostics_channel";
import { Message, Role } from "discord.js";
import { CommandClient } from "../app";

class abortSetup extends Error {}

export = {
  name: "setup",
  description: `Give the bot all the required information for optimal usage.\n
                    usage: !setup`,
  admin: true,
  async execute(message: Message, client: CommandClient, args: Array<string>) {
    await this.adminSetup(message, client);
  },

  async findMatchingRole(message: Message, roleName: String) {
    const match = message.guild.roles.cache.filter(
      (role) => role.name == roleName
    );
    if (!match.size) {
      message.channel.send(`Could not find role ${roleName}`);
      return;
    }
    const role = match.array()[0];
    return role;
  },

  async adminSetup(message: Message, client: CommandClient) {
    const guildID = message.guild.id;
    let league = client.leagues.get(message.guild.id);
    message.channel.send("Please enter the name of the admin role");
    try {
      const adminRoleCollection = await this.collectResponse(message);
      const match = await this.findMatchingRole(
        message,
        adminRoleCollection.content
      );
      const affectedRows = await league.updateAdminRoleID(match.id, guildID);

      league.admin_role_id = match;
      client.leagues.set(message.guild.id, league);

      if (Number(affectedRows) > 0) {
        message.channel.send(`League admin role set to: **${match.name}**`);
      } else {
        message.channel.send(
          "There was a problem updating the league admin role"
        );
      }
    } catch (e) {
      if (e instanceof abortSetup) {
        return;
      }
      this.adminSetup(message, client);
    }
  },

  async collectResponse(message: Message) {
    const filter = (m) => m.author.id === message.author.id;
    const collectedMessage = await message.channel
      .awaitMessages(filter, { max: 1, time: 60000, errors: ["time"] })
      .then((collection) => {
        return collection.first();
      })
      .catch();
    if (collectedMessage.content == "abort") {
      message.channel.send("Aborted setup!");
      throw new abortSetup();
    }
    return collectedMessage;
  },
};
