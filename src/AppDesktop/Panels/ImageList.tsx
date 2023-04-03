import { PlusOutlined } from "@ant-design/icons";
import { Button, Empty, Space } from "antd";
import React, { ReactElement, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList } from "react-window";
import { importImage } from "../../store/action";
import ImageListItem from "../Components/ImageListItem";
import ImageListTop from "../Components/ImageListTop";
import PasteCmd from "../Components/PasteCmd";

type Props = {
  extras: ReactElement;
};

const ImageList: React.FC<Props> = ({ extras }: Props) => {
  const toImport = useSelector((state: any) => state.reducer.toImport);
  const selectedImg = useSelector((state: any) => state.reducer.selectedImg);
  const selectedImgIndex = useSelector(
    (state: any) => state.reducer.selectedImgIndex
  );
  const imgs = useSelector((state: any) => state.reducer.imgs);
  const listRef = useRef(null);
  const indexRef = useRef(-1);
  useEffect(() => {
    if (listRef.current && selectedImgIndex > -1) {
      (listRef.current as any).scrollToItem(
        selectedImgIndex + (indexRef.current > selectedImgIndex ? 0 : 1),
        "smart"
      );
    }
    indexRef.current = selectedImgIndex;
  }, [selectedImgIndex]);
  return (
    <div
      id="imgsharp_desktop_imagelist"
      style={{
        padding: "0px",
        overflowY: "hidden",
        overflowX: "hidden",
        flex: 1,
        cursor: toImport > 0 ? "wait" : "unset",
      }}
    >
      <ImageListTop extras={extras} />
      {imgs.length ? (
        <AutoSizer style={{ flex: 1 }}>
          {({ width, height }) => {
            return (
              <VariableSizeList
                itemSize={() => 40}
                width={width as any}
                height={height as any}
                itemCount={imgs.length + 2}
                style={{ marginTop: "-40px" }}
                overscanCount={8}
                itemData={{
                  item: [{ hash: "header" }, ...imgs, { hash: "footer" }],
                  selectedImg: selectedImg,
                  toImport: toImport,
                }}
                ref={listRef}
              >
                {ImageListItem as any}
              </VariableSizeList>
            );
          }}
        </AutoSizer>
      ) : (
        <AutoSizer style={{ flex: 1 }}>
          {({ width, height }) => {
            return (
              <div
                style={{
                  width: width,
                  height: (height as any) - 40,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Empty description={false} style={{ margin: "16px 0" }} />
                <Space>
                  <Button
                    type="primary"
                    size="large"
                    icon={<PlusOutlined />}
                    style={{ margin: "0 0" }}
                    onClick={importImage}
                  >
                    选取
                  </Button>
                  <PasteCmd size="large" />
                </Space>
              </div>
            );
          }}
        </AutoSizer>
      )}
    </div>
  );
};

export { ImageList };
