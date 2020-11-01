import * as React from "react";
import { Anchor } from "antd";
const {Link} = Anchor;

export default class AboutView extends React.Component {
  public render() {
    return (
      <div>
        <p>It is a page to display the results of 3d-cgan which can translate images to related models.</p>
        <p>View codes <a href='https://github.com/ZijingPeng/3d-cgan'>here</a>.</p>
        <p>Author: <a href='https://zijingpeng.github.io/'>Zijing Peng</a></p>
      </div>
    );
  }
}
