import React    from "react";
import ReactDOM from "react-dom";
import cookies  from "js-cookie";

import "./index.scss";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import * as util from "./lib/util";

const CLIENT_ID_COOKIE = "wb2020_id";

if (!cookies.get(CLIENT_ID_COOKIE)) {
  cookies.set(CLIENT_ID_COOKIE, util.uuidv4_compact().toUpperCase(), {
    secure:   false,
    path:     "/",
    // domain:   ".example.com",
    sameSite: "strict",
    expires: 365
  });
}

ReactDOM.render(
  <React.StrictMode>
    <App clientId={cookies.get(CLIENT_ID_COOKIE)}/>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
