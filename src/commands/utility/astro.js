import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

import getForecasting from "../../requests/forecasting.js";

export default {
  data: new SlashCommandBuilder()
    .setName("astro")
    .setDescription("Replies with the astronomical information for the day!")
    .addStringOption((option) => {
      return option
        .setName("location")
        .setDescription(
          "The location can be a city, zip/postal code, or a latitude and longitude."
        )
        .setRequired(true);
    }),
  async execute(interaction) {
    await interaction.deferReply();

    // or interaction.options.getString("location");
    const location = interaction.options.get("location").value;

    try {
      const { city, region, country, weatherData } = await getForecasting(
        location
      );

      const embed = new EmbedBuilder()
        .setColor(0x3f704d)
        .setTitle(`Astronomical forecast for ${city}, ${region}, ${country}...`)
        .setTimestamp()
        .setFooter({
          text: "Powered by the weatherapi.com API",
        });

      for (const day of weatherData) {
        embed.addFields({
          name: day.date,
          value: `🌅 Sunrise: ${day.sunriseTime}\n🌇 Sunset: ${day.sunsetTime}\n🌔 Moonrise: ${day.moonriseTime}\n🌘 Moonset: ${day.moonsetTime}`,
        });
      }

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.log(err);
      await interaction.editReply(
        "An error has occurred. Please try again later."
      );
    }
  },
};
