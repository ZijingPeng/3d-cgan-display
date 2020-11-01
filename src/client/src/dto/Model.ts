import { Mesh } from "three";
import { List } from "antd";

export interface IModel {
  width: number;
  height: number;
  depth: number;
  dataStr: string;
  color: List;
  meshes?: Mesh[];
}
