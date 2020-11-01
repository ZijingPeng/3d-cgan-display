import * as React from "react";
import { List, Button } from "antd";
import styled from "styled-components";
import ImageButton from './ImageButton';

export interface IImageListProps {
  images: string[];
  selectedInputIndex: number;
  changeInputIndex: (
    index: number,
    input_name: string,
    input_base64: string
  ) => void;
  className?: string;
}

export interface IImageListState {
  isLoading: boolean;
}

class ImageList extends React.Component<IImageListProps, IImageListState> {
  public constructor(props: IImageListProps) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  public componentDidMount() {
    this.setState({ isLoading: false });
  }

  public render() {
    const renderItem: (
      item: { image: string; index: number }
    ) => JSX.Element = item => {
      const { image, index } = item;
      return (
        <ImageButton
          image={image}
          index={index}
          changeSelectedInput={this.props.changeInputIndex}
          selectedInputIndex={this.props.selectedInputIndex}
        />
      );
    };

    let dataSource = this.props.images.map((image, index) => ({
      image,
      index
    }));

    return (
      <div className={this.props.className}>
        <List
          renderItem={renderItem}
          dataSource={dataSource}
          loading={this.state.isLoading}
        />
      </div>
    );
  }
}

export default styled(ImageList)`
  max-width: 180px;
  max-height: 428px;
  overflow-y: scroll;
  overflow-x: hidden;

  /* scrollbar */
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 3px;
    background-color: #fafafa;
  }

  ::-webkit-scrollbar {
    width: 6px;
    background-color: #fafafa;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #bdbdbd;
  }
`;
