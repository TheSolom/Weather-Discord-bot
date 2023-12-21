import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import config from "../config.json" assert { type: "json" };

import pingCommand from "./commands/utility/ping.js";

const { token } = config;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

// client.commands.set(pingCommand.data.name, pingCommand);

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

client.login(token);
