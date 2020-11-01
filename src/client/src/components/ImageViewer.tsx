import * as React from "react";
import styled from "styled-components";

const Container = styled.div``;
const Overlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  opacity: 0;
  transition: 0.5s ease;
  background-color: #008cba;
`;
const OverlayText = styled.div``;
const Image = styled.img`
  display: block;
  width: 100%;
  height: auto;
`;

export interface IImageViewerProps {
  src: string;
}

export default class ImageViewer extends React.Component<IImageViewerProps> {
  public render() {
    return (
      <Container>
        <Image src={this.props.src} />
        <Overlay>
          <OverlayText>{this.props.children}</OverlayText>
        </Overlay>
      </Container>
    );
  }
}
