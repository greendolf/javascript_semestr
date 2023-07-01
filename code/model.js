const conditions = {
  clear: "ясно",
  "partly-cloudy": "малооблачно",
  cloudy: "облачно с прояснениями",
  overcast: "пасмурно",
  "light-rain": "небольшой дождь",
  rain: "дождь",
  "heavy-rain": "сильный дождь",
  showers: "ливень",
  "wet-snow": "дождь со снегом",
  "light-snow": "небольшой снег",
  snow: "снег",
  "snow-showers": "снегопад",
  hail: "град",
  thunderstorm: "гроза",
  "thunderstorm-with-rain": "дождь с грозой",
  "thunderstorm-with-hail": "гроза с градом",
};

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

export async function getForecast(city, limit) {
  let cords = await fetchCords(city);
  let data = await fetchWeatherForecast(cords[0], cords[1], limit);
  const forecast = data.forecasts.map((forecast) => [
    forecast.date,
    forecast.parts.day.temp_avg + " градусов",
    forecast.parts.day.feels_like + " градусов",
    conditions[forecast.parts.day.condition],
    forecast.parts.day.wind_speed + " м/с",
    forecast.parts.day.humidity + "%",
  ]);
  console.log("forecast: ", forecast);
  return forecast;
  // if (time.getDate() < 10) {
  //   date = "0" + time.getDate() + ".";
  // } else {
  //   date = time.getDate() + ".";
  // }
  // if (time.getMonth() < 10) {
  //   date += "0" + (time.getMonth() + 1);
  // } else {
  //   date += time.getMonth();
  // }
}

export async function getCurrentWeather(city) {
  let cords = await fetchCords(city);
  let data = await fetchWeatherForecast(cords[0], cords[1], 1);
  let time = new Date(data.now * 1000);
  let date = time.getHours() + ":";
  if (time.getMinutes() < 10) {
    date += "0" + time.getMinutes();
  } else {
    date += time.getMinutes();
  }
  const current = [
    date,
    data.fact.temp + " градусов",
    data.fact.feels_like + " градусов",
    conditions[data.fact.condition],
    data.fact.wind_speed + " м/с",
    data.fact.humidity + "%",
  ];
  console.log("current: ", current);
  return current;
}

// getForecast("12rfar");
