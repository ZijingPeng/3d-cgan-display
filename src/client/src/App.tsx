import * as React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import AboutView from "./views/AboutView";
import DemoView from "./views/DemoView";
import MenuBar, { IMenuBarRoute } from "./components/MenuBar";
import "./App.style.css";

const routes: IMenuBarRoute[] = [
  { name: "Demo", path: "/demo" },
  { name: "About", path: "/about" }
];

export default class App extends React.Component {
  public render(): JSX.Element {
    const RedirectToDemo = () => <Redirect to="/demo" />;
    const aboutView = () => <AboutView />;
    const demoView = () => <DemoView />;
    return (
      <BrowserRouter>
        <div>
          <h1>3d-cgan</h1>
          <MenuBar routes={routes} style={{ marginBottom: "20px" }} />
          <Switch>
            <Route path="/" exact={true} component={RedirectToDemo} />
            <Route path="/about" component={aboutView} />
            <Route path="/demo" component={demoView} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}
