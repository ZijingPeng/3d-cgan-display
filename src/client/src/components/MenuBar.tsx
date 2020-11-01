import * as React from "react";
import { Menu } from "antd";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";

export interface IMenuBarRoute {
  name: string;
  path: string;
}

export interface IMenuBarProps {
  style: React.CSSProperties;
  routes: IMenuBarRoute[];
}

class MenuBar extends React.Component<IMenuBarProps & RouteComponentProps> {
  public render() {
    const { routes, style, location } = this.props;
    const links = routes.map(({ name, path }) => (
      <Menu.Item key={path}>
        <Link to={path}>{name}</Link>
      </Menu.Item>
    ));
    const pathname = location.pathname == "/" ? "/demo" : location.pathname;

    return (
      <Menu style={style} defaultSelectedKeys={[pathname]} mode="horizontal">
        {links}
      </Menu>
    );
  }
}

export default withRouter(MenuBar);
