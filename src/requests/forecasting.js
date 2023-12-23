const FORECAST_DAYS = 5;

export default async (location) => {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API_KEY}&q=${location}&days=${FORECAST_DAYS}`
    );
    const data = await response.json();

    if (data.error) throw new Error(data.error.message);

    const city = data.location.name;
    const region = data.location.region;
    const country = data.location.country;
    const weatherData = data.forecast.forecastday.map((forecastDay) => {
      return {
        date: forecastDay.date,

        temperatureMinC: forecastDay.day.mintemp_c,
        temperatureMinF: forecastDay.day.mintemp_f,
        
        temperatureMaxC: forecastDay.day.maxtemp_c,
        temperatureMaxF: forecastDay.day.maxtemp_f,

        sunriseTime: forecastDay.astro.sunrise,
        sunsetTime: forecastDay.astro.sunset,
        moonriseTime: forecastDay.astro.moonrise,
        moonsetTime: forecastDay.astro.moonset,
      };
    });

    return { city, region, country, weatherData };
  } catch (err) {
    throw err;
  }
};
