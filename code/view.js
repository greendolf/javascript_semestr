log = (element) => console.log(element);

getBody = () => {
  body = document.getElementsByTagName("body")[0];
  return body;
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

function clear() {
  body = getBody();
  for (let child of Array.from(body.children)) {
    if (!Array.from(arguments).includes(child)) {
      body.removeChild(child);
    }
  }
}

welcome = (username) => {

};

window.onload = () => {
  body = getBody();

  auth = create("div", body, [["class", "auth"]]);
  authForm = create("form", auth);

  auth_top = create("div", authForm);
  user = create("input", auth_top, [
    ["id", "name"],
    ["type", "text"],
    ["placeholder", "Ваше имя"],
  ]);

  auth_bot = create("div", authForm);

  resume_btn = create("input", auth_bot, [
    ["type", "button"],
    ["value", "Продолжить"],
    ["style", "font-size: 0.8em"],
  ]);

  resume_btn.addEventListener("click", () => {
    welcome(user.value);
    main();
  });
};

function main() {
  clear(header);
  body = getBody();
  forecasts = create("div", body);
  castsForm = create("form", forecasts, [["class", "casts"]]);
}
