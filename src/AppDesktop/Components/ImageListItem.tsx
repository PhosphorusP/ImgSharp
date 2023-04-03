import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  FileImageOutlined,
  PlusOutlined,
  SaveOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Button, Space, theme } from "antd";
import { CSSProperties, memo } from "react";
import { useSelector } from "react-redux";
import { importImage, removeImg, selectImg } from "../../store/action";
import PasteCmd from "./PasteCmd";

const { useToken } = theme;

type Props = {
  data: any;
  index: number;
  style: CSSProperties;
  i: Img;
};

const _ImageListItem: React.FC<Props> = ({ data, index, style }: Props) => {
  const simplifiedPreview = useSelector(
    (state: any) => state.reducer.settings.simplifiedPreview
  );
  const { token } = useToken();
  let imgs_ = data.item;
  let i0 = index,
    i: any;
  let s = {
    ...style,
    borderBottom: `1px solid ${token.colorFillSecondary}`,
    boxSizing: "border-box",
    padding: "0 4px",
  } as CSSProperties;
  if (i0 == 0) return <div style={s}></div>;
  else if (i0 == imgs_.length + 1 - 2)
    return (
      <div
        style={{
          ...style,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "40px",
        }}
      >
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ margin: "0 0" }}
            onClick={importImage}
          >
            选取
          </Button>
          <PasteCmd style={{ margin: "0 0" }} />
        </Space>
      </div>
    );
  else i = i0 - 1;
  imgs_ = imgs_.slice(1, imgs_.length - 1);
  let imgNotImported = !imgs_[i].rawImageObj || !imgs_[i].thumb.src;
  let items = ["", <></>];
  if (imgNotImported || imgs_[i].needUpdate)
    items = [
      "待处理",
      <ClockCircleOutlined
        style={{ fontSize: "12px", color: token.colorTextDisabled }}
      />,
    ];
  else if (
    imgs_[i].rawSize &&
    imgs_[i].processedSize &&
    imgs_[i].rawSize < imgs_[i].processedSize
  )
    items = [
      "处理后文件大小增加",
      <WarningOutlined
        style={{ fontSize: "12px", color: token.colorWarning }}
      />,
    ];
  else if (imgs_[i].error)
    items = [
      "处理失败",
      <ExclamationCircleOutlined
        style={{ fontSize: "12px", color: token.colorError }}
      />,
    ];
  else
    items = [
      "已就绪",
      <CheckCircleOutlined
        style={{ fontSize: "12px", color: token.colorSuccess }}
      />,
    ];
  return (
    <div
      style={{
        ...s,
        display: "flex",
        alignItems: "center",
        backgroundColor:
          data.selectedImg == imgs_[i].id ? token.colorPrimaryBg : "unset",
      }}
      onClick={() => {
        selectImg(i);
      }}
    >
      {i == imgs_.length ? (
        <button style={{ visibility: "hidden" }} />
      ) : (
        <>
          <abbr title={items[0] as string}>
            <div
              style={{
                width: "12px",
                height: "14px",
                margin: "0 0 0 4px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <>{items[1]}</>
            </div>
          </abbr>
          <div
            style={{
              boxSizing: "border-box",
              width: "32px",
              height: "40px",
              overflow: "visible",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "4px",
            }}
          >
            {imgNotImported ? (
              <FileImageOutlined
                style={{ fontSize: "14px", color: token.colorTextDisabled }}
              />
            ) : simplifiedPreview ? (
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  backgroundImage: `url(${imgs_[i].thumb!.src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center center",
                }}
              />
            ) : (
              <img
                style={{
                  boxSizing: "border-box",
                  maxWidth: "28px",
                  maxHeight: "28px",
                  border: "1.5px solid #fff",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
                }}
                src={imgs_[i].thumb!.src}
              />
            )}
          </div>
          <div
            style={{
              flex: 1,
              overflowX: "hidden",
              marginLeft: "4px",
            }}
          >
            <abbr
              title={imgs_[i].fileInfo!.name as string}
              style={{ textDecoration: "none", display: "block" }}
            >
              <div
                style={{
                  cursor: data.toImport > 0 ? "wait" : "default",
                  color: imgNotImported
                    ? token.colorTextDisabled
                    : token.colorText,
                  whiteSpace: "nowrap",
                  wordBreak: "keep-all",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontSize: token.fontSizeSM,
                  fontFamily: token.fontFamily,
                }}
              >
                {imgNotImported ? "等待导入…" : imgs_[i].fileInfo!.name}
              </div>
            </abbr>
          </div>
          <div style={{ margin: "0 4px" }}>
            <abbr title="从图片列表中删除">
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={(e) => {
                  removeImg(imgs_[i].id);
                  e.stopPropagation();
                }}
                disabled={imgNotImported || data.toImport}
              />
            </abbr>
          </div>
          <div style={{ margin: "0 4px", display: "none" }}>
            <abbr title="保存处理后的图片">
              <Button
                type="text"
                size="small"
                icon={
                  <SaveOutlined
                    style={{
                      color:
                        imgNotImported || data.toImport
                          ? token.colorTextDisabled
                          : token.colorPrimary,
                    }}
                  />
                }
                onClick={(e) => {
                  e.stopPropagation();
                }}
                disabled={imgNotImported || data.toImport}
              />
            </abbr>
          </div>
        </>
      )}
    </div>
  );
};

const eq = function (prevProps: any, nextProps: any) {
  let selectedPrev = false,
    selectedNext = false;
  if (
    prevProps.data.item[prevProps.index].id &&
    nextProps.data.item[nextProps.index].id
  ) {
    selectedPrev =
      prevProps.data.item[prevProps.index].id == prevProps.data.selectedImg;
    selectedNext =
      nextProps.data.item[nextProps.index].id == nextProps.data.selectedImg;
    if (!((selectedPrev && selectedNext) || (!selectedPrev && !selectedNext)))
      return false;
  }
  if (
    prevProps.data.item[prevProps.index].hash !=
    nextProps.data.item[nextProps.index].hash
  )
    return false;
  if (
    prevProps.data.item[prevProps.index].needUpdate !=
    nextProps.data.item[nextProps.index].needUpdate
  )
    return false;
  if ((prevProps.data.toImport == 0) != (nextProps.data.toImport == 0))
    return false;
  return true;
};

const ImageListItem = memo(_ImageListItem, eq);
export default ImageListItem;
