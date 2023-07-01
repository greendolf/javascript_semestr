// Вывод чего-либо в консоль
log = (element) => console.log(element);

// Получение объекта с тегом main
getMain = () => {
  let main = document.getElementsByTagName("main")[0];
  return main;
};

// Упрощение создания узлов
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

// Очистка рабочей области
clear = () => {
  let main = getMain();
  for (let child of Array.from(main.children)) {
    main.removeChild(child);
  }
};

// Активация и деактивация чекбоксов
function changeCheckboxes(condition) {
  Array.from(document.querySelectorAll(".filters")).forEach((elem) => {
    elem.disabled = !condition;
  });
}

// Приветственное сообщение
welcome = (username) => {
  user_welcome = create("section", header, [["class", "user_welcome"]]);
  user = create("h1", user_welcome, [["id", "user"]]);
  user.innerHTML = `Добро пожаловать, ${username}`;
};

// Сохранение города
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
      cityChoice();
    }
  });

  resume_btn.addEventListener("click", () => {
    welcome(user.value);
    cityChoice();
  });
};

// Инициализация чекбоксов
function setCheckboxes() {
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
    Array.from(document.querySelectorAll(`#weather-${name}`)).forEach(
      (elem) => {
        elem.hidden = !event.target.checked;
      }
    );
  });
}

// Выбор города
function cityChoice() {
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
          setCheckboxes();
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
        setCheckboxes();
        mainPage();
      } else {
        alert("Город введён неверно");
      }
    });
  });
}

// Заголовки для понятного отображения
const filters = [
  "Дата",
  "Температура",
  "Ощущается как",
  "Погодное описание",
  "Скорость ветра",
  "Влажность",
];

// Получение текущей погоды
async function getCurrent(city) {
  clear();
  (await import("./model.js")).getCurrentWeather(city).then((res) => {
    forecasts = create("section", main, [["class", "forecasts"]]);
    forecast = create("section", forecasts);
    time = create("p", forecast, [["id", `weather-${0}`]]);
    time.innerHTML = `Время: ${res[0]}`;
    for (let i = 1; i < 6; i++) {
      p = create("p", forecast, [["id", `weather-${i}`]]);
      p.innerHTML = `${filters[i]}: ${res[i]}`;
    }
    changeCheckboxes(true);
    back = create("input", main, [
      ["class", "back"],
      ["type", "button"],
      ["value", "Вернуться"],
    ]);
    back.addEventListener("click", () => {
      mainPage();
    });
  });
}

// Получение прогноза погоды
async function getForecast(city, limit) {
  clear();
  (await import("./model.js")).getForecast(city, limit).then((res) => {
    forecasts = create("section", main, [["class", "forecasts"]]);
    for (let i = 0; i < res.length; i++) {
      forecast = create("section", forecasts);
      for (let j = 0; j < 6; j++) {
        p = create("p", forecast, [["id", `weather-${j}`]]);
        p.innerHTML = `${filters[j]}: ${res[i][j]}`;
      }
    }
    changeCheckboxes(true);
    back = create("input", main, [
      ["class", "back"],
      ["type", "button"],
      ["value", "Вернуться"],
    ]);
    back.addEventListener("click", () => {
      mainPage();
    });
  });
}

// Основная страница
function mainPage() {
  clear();
  main = getMain();
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
  forecast3.addEventListener("click", () => {
    getForecast(document.getElementById("city_name").innerHTML, 3).then(() => {
      changeCheckboxes(true);
      console.log("forecast3 success");
    });
  });
  forecast7 = create("input", choice, [
    ["type", "button"],
    ["value", "Прогноз на неделю"],
    ["style", "display: flex"],
  ]);
  forecast7.addEventListener("click", () => {
    getForecast(document.getElementById("city_name").innerHTML, 7).then(() => {
      changeCheckboxes(true);
      console.log("forecast7 success");
    });
  });
}
