import "normalize.css/normalize.css";
import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";

const render = () => ReactDOM.render(<App />, document.getElementById("app"));

render();

if (module.hot) {
  module.hot.accept(() => {
    render();
  });
}
