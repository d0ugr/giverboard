import React    from "react";
import ReactDOM from "react-dom";
import cookies  from "js-cookie";

import * as c    from "./constants";
import * as util from "./lib/util";

import "./index.scss";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

JSON.stringifyPretty = (object) => JSON.stringify(object, null, 2);

const setCookie = (name, value) => {
  console.log("setCookie", name, value)
  cookies.set(name, value, {
    secure:   false,
    // domain:   ".example.com",
    path:     "/",
    sameSite: "strict",
    expires:  365
  });
};

if (!cookies.get(c.COOKIE_CLIENT_ID)) {
  setCookie(c.COOKIE_CLIENT_ID, util.uuidv4_compact().toUpperCase());
}

ReactDOM.render(
  <React.StrictMode>
    <App
      setCookie={setCookie}
      clientId={cookies.get(c.COOKIE_CLIENT_ID)}/>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
