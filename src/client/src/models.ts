import * as pako from "pako";
import {
  MeshPhongMaterial,
  Mesh,
  BoxGeometry,
  PlaneBufferGeometry,
  DoubleSide,
  Color,
} from "three";
import { IModel } from "./dto";

const cubeMaterial = new MeshPhongMaterial({
  color: "#F48FB1",
  opacity: 0.9,
  transparent: true
});

export function extractModel(model?: IModel): IModel | undefined {
  if (!model) {
    return;
  }

  const { dataStr, color, depth, width, height } = model;

  // decode base64
  const bytes = atob(dataStr);

  // uncompress gzip5
  const boolstr = pako.inflate(bytes, { to: "string" });

  // convert to mesh
  const cube = new Mesh();
  for (let i = 0; i < width; i += 1) {
    for (let j = 0; j < height; j += 1) {
      for (let k = 0; k < depth; k += 1) {
        if (boolstr[k + (i + j * width) * depth] === "1") {
          const voxel = new BoxGeometry(1, 1, 1);
          voxel.translate(i - 16, j - 16, k - 16);
          voxel.rotateZ(-Math.PI / 2);
          var shade = `rgb(${color[j][i][k][0]},` +
            `${color[j][i][k][1]},` +
            `${color[j][i][k][2]})`;
          cube.add(new Mesh(voxel, new MeshPhongMaterial({
            color: new Color(shade),
            opacity: 0.9,
            transparent: true
          })));
        }
      }
    }
  }

  cube.castShadow = true;
  cube.receiveShadow = true;

  const plane = new Mesh(
    new PlaneBufferGeometry(999999, 999999, 8, 8),
    new MeshPhongMaterial({ color: "#F8F8FF", side: DoubleSide })
  );
  plane.rotation.set(Math.PI / 2, 0, 0);
  plane.position.y -= 20;
  plane.receiveShadow = true;
  cube.castShadow = true;

  return { ...model, meshes: [cube, plane] };
}
