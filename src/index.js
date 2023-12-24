import { Client, Collection, Events, GatewayIntentBits } from "discord.js";

import { clientReadyHandler } from "./events/clientReady.js";
import { interactionCreateHandler } from "./events/interactionCreate.js";
import pingCommand from "./commands/utility/ping.js";
import serverCommand from "./commands/utility/server.js";
import userCommand from "./commands/utility/user.js";
import forecastCommand from "./commands/utility/forecast.js";
import astroCommand from "./commands/utility/astro.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

client.commands.set(pingCommand.data.name, pingCommand);
client.commands.set(serverCommand.data.name, serverCommand);
client.commands.set(userCommand.data.name, userCommand);
client.commands.set(forecastCommand.data.name, forecastCommand);
client.commands.set(astroCommand.data.name, astroCommand);

client.once(Events.ClientReady, clientReadyHandler);

client.on(Events.InteractionCreate, interactionCreateHandler);

client.login(process.env.DISCORD_TOKEN);
