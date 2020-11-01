import * as React from "react";
import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Fog,
  Color,
  HemisphereLight,
  Light,
  PCFSoftShadowMap,
  AmbientLight,
  SpotLight
} from "three";
import { IModel } from "../dto";

export interface IModelViewerProps {
  model?: IModel;
  backgroundColor: string;
  width: string;
  height: string;
}

export default class ModelViewer extends React.Component<IModelViewerProps> {
  private container: HTMLElement | null;
  private scene: Scene;
  private model: IModel;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  private frameId: number | null;

  public constructor(props: IModelViewerProps) {
    super(props);
    this.reload = this.reload.bind(this);
  }

  public componentDidMount() {
    this.createDrawContext();
    this.start();
  }

  private createDrawContext() {
    if (!this.container) {
      throw new Error("[DemoView] Ref to div is undefined");
    }
    this.scene = new Scene();
    this.scene.background = new Color(this.props.backgroundColor);

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera = new PerspectiveCamera(60, width / height);
    this.camera.position.set(0, 40, 0);
    // add lights for scene

    const spotLight = new SpotLight(0xaaaaaa, 0.15);
    spotLight.castShadow = true;
    spotLight.position.set(0, 100, 0);

    const lights: Light[] = [
      new HemisphereLight(0xaaaaaa, 0x000000, 0.8),
      spotLight,
      new AmbientLight(0xdddddd, 0.4)
    ];

    lights.forEach(light => this.scene.add(light));

    this.scene.fog = new Fog(0xf7d9aa, 100, 950);

    this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize(width, height);

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // Add a axesHelper to scene can view object axes
    // For debugging
    //this.scene.add(new AxesHelper(99999999));

    // reload scene
    this.reload();
  }

  public componentWillUnmount() {
    this.stop();
    if (this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }

  stop = () => {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
  };

  renderScene = () => {
    this.renderer.render(this.scene, this.camera);
  };

  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  };

  private angle: number = 0;

  animate = () => {
    const radius = 40; // rotation radius
    const speed = 0.005;
    this.camera.position.x = radius * Math.cos(this.angle);
    this.camera.position.z = radius * Math.sin(this.angle);
    this.angle += speed;
    this.camera.lookAt(0, 0, 0);
    this.renderScene();
    this.frameId = requestAnimationFrame(this.animate);
  };

  setRef = (container: HTMLElement | null) => {
    this.container = container;
  };

  clear = () => {
    if (this.model && this.model.meshes) {
      this.model.meshes.forEach(mesh => this.scene.remove(mesh));
    }
  };

  public reload = () => {
    this.clear();
    if (this.props.model) {
      this.model = this.props.model;
      if (this.model.meshes) {
        this.model.meshes.forEach(mesh => this.scene.add(mesh));
      }
    }
  };

  public render() {
    const { width, height, backgroundColor } = this.props;
    return <div ref={this.setRef} style={{ width, height, backgroundColor }} />;
  }
}
