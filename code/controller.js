// import { fetchCords } from "./model.js";

log = (element) => console.log(element);
getBody = () => {
  let body = document.getElementsByTagName("body")[0];
  return body;
};

getMain = () => {
  let main = document.getElementsByTagName("main")[0];
  return main;
};

create = (elem, parent, attrs) => {
  node = document.createElement(elem);
  if (attrs) {
    for (let attr of attrs) {
      node.setAttribute(attr[0], attr[1]);
    }
  }
  parent.appendChild(node);
  return node;
};

clear = () => {
  let main = getMain();
  for (let child of Array.from(main.children)) {
    main.removeChild(child);
  }
};

function changeCheckboxes(condition) {
  Array.from(document.querySelectorAll(".filters")).forEach((elem) => {
    elem.disabled = !condition;
  });
}

function clear() {
  body = getBody();
  for (let child of Array.from(body.children)) {
    if (!Array.from(arguments).includes(child)) {
      body.removeChild(child);
    }
  }
}

welcome = (username) => {
  user_welcome = create("section", header, [["class", "user_welcome"]]);
  user = create("h1", user_welcome, [["id", "user"]]);
  user.innerHTML = `Добро пожаловать, ${username}`;
};

async function setCity(city) {
  res = await (await import("./model.js")).fetchCords(city);
  if (res) {
    city_section = create("section", header, [["class", "city_section"]]);
    city_name = create("h1", city_section, [["id", "city_name"]]);
    city_name.innerHTML = res[2];
    log(`setCity(${city}) success`);
    return true;
  } else {
    log(`setCity(${city}) error`);
    return false;
  }
}

// При открытии страницы
window.onload = () => {
  main = getMain();

  //auth = create("section", body, [["class", "auth"]]);
  authForm = create("section", main, [["class", "auth"]]);

  user = create("input", authForm, [
    ["id", "name"],
    ["type", "text"],
    ["placeholder", "Ваше имя"],
  ]);

  resume_btn = create("input", authForm, [
    ["type", "button"],
    ["value", "Продолжить"],
    ["style", "font-size: 0.8em"],
  ]);

  authForm.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      welcome(user.value);
      firstCityChoice();
    }
  });

  resume_btn.addEventListener("click", () => {
    welcome(user.value);
    firstCityChoice();
  });
};

// Выбор города в первый раз
function firstCityChoice() {
  clear();
  main = getMain();
  cityForm = create("section", main, [["class", "auth"]]);

  city = create("input", cityForm, [
    ["id", "city_name"],
    ["type", "text"],
    ["placeholder", "Введите город"],
  ]);

  resume_btn = create("input", cityForm, [
    ["type", "button"],
    ["value", "Продолжить"],
    ["style", "font-size: 0.8em"],
  ]);

  cityForm.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      setCity(city.value).then((res) => {
        if (res) {
          mainPage();
        } else {
          alert("Город введён неверно");
        }
      });
    }
  });
  resume_btn.addEventListener("click", () => {
    setCity(city.value).then((res) => {
      if (res) {
        mainPage();
      } else {
        alert("Город введён неверно");
      }
    });
  });
}

const filters = [
  "Дата: ",
  "Температура",
  "Ощущается как",
  "Погодное описание",
  "Скорость ветра",
  "Влажность",
];

async function getCurrent(city) {
  clear();
  res = await (await import("./model.js")).getCurrentWeather(city).then(() => {
    forecasts = create("section", main, [["class", "forecasts"]]);
    forecast = create("section", forecasts);
    for (let j = 0; j < 6; j++) {
      p = create("p", forecast, [["id", `weather-${j}`]]);
      p.innerHTML = `${res[j]}`;
    }
    changeCheckboxes(true);
  });
}

function fillForecastsPage() {
  clear();
  main = getMain();
  log(arguments);
  forecasts = create("section", main, [["class", "forecasts"]]);
  for (let i = 0; i < arguments.length; i++) {
    forecast = create("section", forecasts);
    for (let j = 0; j < 5; j++) {
      p = create("p", forecast, [["id", `weather-${j}`]]);
      p.innerHTML = `${arguments[i][j]}`;
    }
  }
}

// Основная страница
function mainPage() {
  clear();
  main = getMain();
  list = create("ul", header, [["class", "list"]]);
  temp_label = create("label", list);
  temp = create("input", temp_label, [
    ["class", "filters"],
    ["type", "checkbox"],
    ["id", "checkbox-1"],
    ["value", "Температура"],
    ["checked", "true"],
  ]);
  temp_label.insertAdjacentHTML("beforeend", "Температура");
  feels_like_label = create("label", list);
  feels_like = create("input", feels_like_label, [
    ["class", "filters"],
    ["type", "checkbox"],
    ["id", "checkbox-2"],
    ["value", "Ощущается как"],
    ["checked", "true"],
  ]);
  feels_like_label.insertAdjacentHTML("beforeend", "Ощущается как");
  condition_label = create("label", list);
  condition = create("input", condition_label, [
    ["class", "filters"],
    ["type", "checkbox"],
    ["id", "checkbox-3"],
    ["value", "Погодное описание"],
    ["checked", "true"],
  ]);
  condition_label.insertAdjacentHTML("beforeend", "Погодное описание");
  wind_speed_label = create("label", list);
  wind_speed = create("input", wind_speed_label, [
    ["class", "filters"],
    ["type", "checkbox"],
    ["id", "checkbox-4"],
    ["checked", "true"],
  ]);
  wind_speed_label.insertAdjacentHTML("beforeend", "Скорость ветра");
  humidity_label = create("label", list);
  humidity = create("input", humidity_label, [
    ["class", "filters"],
    ["type", "checkbox"],
    ["id", "checkbox-5"],
    ["checked", "true"],
  ]);
  humidity_label.insertAdjacentHTML("beforeend", "Влажность");
  list.addEventListener("change", (event) => {
    const name = event.target.id.split("-")[1];
    document.querySelector(`#weather-${name}`).hidden = !event.target.checked;
  });
  changeCheckboxes(false);
  choice = create("section", main, [["class", "choice"]]);
  current = create("input", choice, [
    ["type", "button"],
    ["value", "Погода в данный момент"],
    ["style", "display: flex"],
  ]);
  current.addEventListener("click", () => {
    getCurrent(document.getElementById("city_name").innerHTML).then(() => {
      changeCheckboxes(true);
      console.log("current success");
    });
  });
  forecast3 = create("input", choice, [
    ["type", "button"],
    ["value", "Прогноз на 3 дня"],
    ["style", "display: flex"],
  ]);
  forecast3.addEventListener("click", () => {});
  forecast7 = create("input", choice, [
    ["type", "button"],
    ["value", "Прогноз на неделю"],
    ["style", "display: flex"],
  ]);
  forecast7.addEventListener("click", () => {});
}
