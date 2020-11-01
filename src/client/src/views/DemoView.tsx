import * as React from "react";
import styled from "styled-components";
import { Spin } from "antd";
import { extractModel } from "../models";
import ModelViewer from "../components/ModelViewer";
import ImageList from "../components/ImageList";
import UploadButton from "../components/UploadButton";
import * as Services from "../services";
import { IModel } from "../dto";

interface IDemoViewProps {
  className?: string;
}

interface IDemoViewState {
  selectedInputIndex: number;
  isLoading: boolean;
  outputModel?: IModel;
  realModel?: IModel;
}

class DemoView extends React.Component<IDemoViewProps, IDemoViewState> {
  private modelViewerOutput: ModelViewer | null;
  private modelViewerReal: ModelViewer | null;
  private inputImages: string[];

  constructor(props: IDemoViewProps) {
    super(props);
    this.inputImages = [];
    this.state = {
      selectedInputIndex: 0,
      isLoading: true
    };
  }

  changeSelectedInput = async (
    index: number,
    input_name: string,
    input_base64: string
  ) => {
    this.setState({
      selectedInputIndex: index,
      isLoading: true
    });

    const { output, real } = await Services.processImage(input_name, input_base64);

    this.setState(
      {
        outputModel: extractModel(output),
        realModel: extractModel(real)
      },
      () => {
        // reload viewers
        if (this.modelViewerOutput) {
          this.modelViewerOutput.reload();
        }
        if (this.modelViewerReal) {
          this.modelViewerReal.reload();
        }
        this.setState({
          isLoading: false
        });
      }
    );
  };

  generateModelsByInput = async (imageUrl : string) => {
    const {output, real} = await Services.generateModel(imageUrl);
    this.setState({
      outputModel: extractModel(output),
      realModel: extractModel(real)
    },
    () => {
      // reload viewers
      if (this.modelViewerOutput) {
        this.modelViewerOutput.reload();
      }
      if (this.modelViewerReal) {
        this.modelViewerReal.reload();
      }
      this.setState({
        isLoading: false
      });
    })
  }

  setModelViewerRealRef = (instance: ModelViewer | null) => {
    this.modelViewerReal = instance;
  };

  setModelViewerOutputRef = (instance: ModelViewer | null) => {
    this.modelViewerOutput = instance;
  };

  public async componentDidMount() {
    // fetch preset input images
    this.inputImages = await Services.getPresets();

    await this.changeSelectedInput(0, "presets/demo-chair-0-input.png", "");

    this.setState({
      isLoading: false
    });
  }

  public render() {
    return (
      <Spin spinning={this.state.isLoading} tip="Restoring the network">
        <div className={this.props.className}>
          <div className="side-bar">
            <h2>Input image</h2>
            <ImageList
              images={this.inputImages}
              changeInputIndex={this.changeSelectedInput}
              selectedInputIndex={this.state.selectedInputIndex}
            />
          </div>
          <div className="model-view">
            <div>
              <h2>3d-cgan result</h2>
              <ModelViewer
                model={this.state.outputModel}
                backgroundColor="#F8F8FF"
                width="430px"
                height="430px"
                ref={this.setModelViewerOutputRef}
              />
            </div>
          </div>
          <UploadButton generateModelsByInput={this.generateModelsByInput}/>
        </div>
      </Spin>
    );
  }
}

export default styled(DemoView)`
  display: flex;

  .side-bar {
    padding-right: 80px;
  }

  .model-view {
    display: flex;
  }

  .model-view > div {
    margin-right: 20px;
  }
`;
