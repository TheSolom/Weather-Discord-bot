import { REST, Routes } from "discord.js";

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

export const clientReadyHandler = async (client) => {
  console.log(`Logged in as ${client.user.tag}!`);

  try {
    console.log(`Started refreshing ${client.commands.size} commands!`);

    const data = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      {
        body: client.commands.map((command) => command.data.toJSON()),
      }
    );

    console.log(`Successfully reloaded ${data.length} commands!`);
  } catch (error) {
    console.error(error);
  }
};
