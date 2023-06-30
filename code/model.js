async function fetchWeatherForecast(lat, lon, limit) {
  const key = "04cf65d7-2c90-4407-970d-056087074c02";
  const url = `https://api.weather.yandex.ru/v2/forecast?lat=${lat}&lon=${lon}&limit=${limit}&lang=ru_RU`;
  const response = await fetch(url, {
    headers: {
      "X-Yandex-API-Key": key,
    },
  });

  const data = await response.json();
  return data;
}

export async function fetchCords(location) {
  const key = "207d1eac-e0df-419b-bcb3-c84b2f36c0b0";
  const url = `https://geocode-maps.yandex.ru/1.x?apikey=${key}&geocode=${location}&kind=locality&format=json&lang=ru_RU`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    let [lon, lat] =
      data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(
        " "
      );
    let city =
      data.response.GeoObjectCollection.featureMember[0].GeoObject
        .metaDataProperty.GeocoderMetaData.text;
    console.log(`fetchCords(${location}) success, returning ${city}`);
    return [lat, lon, city];
  } catch {
    console.log(`fetchCords(${location}) error`);
    return false;
  }
}

export async function getForecast(city) {
  fetchCords(city).then((cords) => {
    fetchWeatherForecast(cords[0], cords[1])
      .then((data) => {
        const forecast = data.forecasts.map((forecast) => ({
          date: forecast.date,
          temperature: forecast.parts.day_short.temp,
          condition: forecast.parts.day_short.condition,
        }));
        for (let i = 0; i < 7; i++) {
          console.log(forecast[i]);
        }
        return forecast;
      })
      .catch((error) => {
        console.error(error);
      });
  });
}

export async function getCurrentWeather(city) {
  await fetchCords(city).then((cords) => {
    fetchWeatherForecast(cords[0], cords[1], 1)
      .then((data) => {
        const current = [
          data.now_dt,
          data.fact.temp,
          data.fact.feels_like,
          data.fact.condition,
          data.fact.wind_speed,
          data.fact.humidity,
        ];
        console.log("current: ", current);
        return current;
      })
      .catch((error) => {
        console.error(error);
      });
  });
}

// getForecast("12rfar");
