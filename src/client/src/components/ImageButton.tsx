import * as React from "react";
import styled from "styled-components";
import { Button } from "antd";

interface IImageButton {
  className?: string;
  image: string;
  index: number;
  selectedInputIndex: number;
  changeSelectedInput: (
    index: number,
    input_name: string,
    input_base64: string
  ) => void;
}

class ImageButton extends React.Component<IImageButton> {
  private imgEl: HTMLImageElement | null;

  onClick = async () => {
    const { index, image, changeSelectedInput } = this.props;

    console.log(this.imgEl)

    if (this.imgEl) {
      // get img and convert to base64
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }
      ctx.drawImage(this.imgEl, 0, 0);
      const imageBase64 = canvas.toDataURL();
      await changeSelectedInput(index, image, imageBase64);
    }
  };

  setImgRef = (instance: HTMLImageElement | null) => {
    this.imgEl = instance;
  };

  public render() {
    const { image, index, selectedInputIndex } = this.props;
    const className =
      index === selectedInputIndex ? " ant-btn-image-button-selected" : "";
    return (
      <Button
        className={this.props.className + className}
        style={{ height: "100%", marginRight: "10px" }}
        onClick={this.onClick}
      >
        <img
          ref={this.setImgRef}
          className="img-button"
          width="137"
          style={{ display: "block", margin: "0 auto" }}
          src={image}
        />
      </Button>
    );
  }
}

export default styled(ImageButton)``;
