import * as React from "react";
import { Upload, Icon, message, Button } from "antd";
import styled from "styled-components";
import * as Services from "../services";
import { UploadFile } from "antd/lib/upload/interface";

interface IUploadButtonProps {
  generateModelsByInput: (
    imageUrl : string
  ) => void;
}

export interface IUploadButtonState {
  isLoading: boolean;
  imageUrl: string;
}

async function readFileBase64(image: Blob): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    if (!image) {
      reject(new Error("Argument image must be a non-falsy value"));
      return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      } else {
        reject(new Error("Unknown image type: " + typeof reader.result));
        return;
      }
    });
    reader.readAsDataURL(image);
  });
}

class UploadButton extends React.Component<
  IUploadButtonProps,
  IUploadButtonState
> {
  public constructor(props: IUploadButtonProps) {
    super(props);
    this.state = {
      isLoading: false,
      imageUrl: ""
    };
  }

  handleChange = async (info: any) => {
    if (info.file.status === "uploading") {
      this.setState({ isLoading: true });
      return;
    }
    if (info.file.status === "done") {
      const imageUrl = await readFileBase64(info.file.originFileObj);
      this.setState({
        imageUrl,
        isLoading: false
      });
    }
  };

  beforeUpload = (file: UploadFile) => {
    const isImage = file.type.indexOf("image/") === 0;
    if (!isImage) {
      message.error("You can only upload image file!");
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Image must smaller than 5MB!");
    }
    return isImage && isLt5M;
  };

  customRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;
    try {
      const imageUrl = await readFileBase64(file);
      //const response = await Services.generateModel(imageUrl);
      await this.props.generateModelsByInput(imageUrl);
      onSuccess(imageUrl, file);
    } catch (ex) {
      onError(ex);
    }
  };

  public render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.isLoading ? "loading" : "plus"} />
        <div>Upload</div>
      </div>
    );
    const imageUrl = this.state.imageUrl;
    const imgOrButton = imageUrl ? (
      <img src={imageUrl} alt="avatar" width="100px" />
    ) : (
      uploadButton
    );
    return (
      <Upload
        listType="picture-card"
        showUploadList={false}
        action="../api/generate"
        beforeUpload={this.beforeUpload}
        onChange={this.handleChange}
        customRequest={this.customRequest}
      >
        {imgOrButton}
      </Upload>
    );
  }
}

export default UploadButton;
