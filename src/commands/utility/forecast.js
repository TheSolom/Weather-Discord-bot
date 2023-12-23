import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

import getForecasting from "../../requests/forecasting.js";

export default {
  data: new SlashCommandBuilder()
    .setName("forecast")
    .setDescription("Replies with the weather forecast!")
    .addStringOption((option) => {
      return option
        .setName("location")
        .setDescription(
          "The location can be a city, zip/postal code, or a latitude and longitude."
        )
        .setRequired(true);
    })
    .addStringOption((option) => {
      return option
        .setName("units")
        .setDescription(
          'The unit system of the results: either "metric" or "imperial".'
        )
        .setRequired(false)
        .addChoices(
          { name: "metric", value: "metric" },
          { name: "imperial", value: "imperial" }
        );
    }),
  async execute(interaction) {
    await interaction.deferReply();

    // or interaction.options.getString("location");
    const location = interaction.options.get("location").value;
    const units = interaction.options.get("units")?.value || "metric";

    try {
      const { city, region, country, weatherData } = await getForecasting(
        location
      );

      const embed = new EmbedBuilder()
        .setColor(0x3f704d)
        .setTitle(`Weather forecast for ${city}, ${region}, ${country}...`)
        .setDescription(`Using the ${units} system.`)
        .setTimestamp()
        .setFooter({
          text: "Powered by the weatherapi.com API",
        });

      for (const day of weatherData) {
        const temperatureMin =
          units === "metric" ? day.temperatureMinC : day.temperatureMinF;
        const temperatureMax =
          units === "metric" ? day.temperatureMaxC : day.temperatureMaxF;

        embed.addFields({
          name: day.date,
          value: `⬇️ Low: ${temperatureMin}°, ⬆️ High: ${temperatureMax}°`,
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
