import {
  BorderOuterOutlined,
  HolderOutlined,
  InfoCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
import { Button, theme } from "antd";
import Color from "color";
import { CSSProperties } from "react";
import {
  ReflexContainer,
  ReflexElement,
  ReflexHandle,
  ReflexSplitter,
} from "react-reflex";
import "react-reflex/styles.css";
import { useToggle } from "react-use";
import { importImage } from "../store/action";
import ImagePreviewInfo from "./Components/ImagePreviewInfo";
import ImagePreviewPlate from "./Components/ImagePreviewPlate";
import PasteCmd from "./Components/PasteCmd";
import StatusBar from "./Components/StatusBar";
import { ImageList } from "./Panels/ImageList";
import ImagePreview from "./Panels/ImagePreview";
import Preset from "./Panels/Preset";

const { useToken } = theme;

const ImageListCollapsed: React.FC<{ extras: any }> = ({ extras }: any) => {
  const { token } = useToken();
  return (
    <div
      style={{
        padding: "6px",
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
      }}
    >
      {extras}
      <abbr title="选取">
        <Button
          size="middle"
          type="text"
          icon={<PlusOutlined style={{ color: token.colorPrimary }} />}
          onClick={importImage}
          style={{ marginBottom: "4px" }}
        />
      </abbr>
      <abbr title="粘贴">
        <PasteCmd
          size="middle"
          type="text"
          icon={<SnippetsOutlined style={{ color: token.colorPrimary }} />}
          style={{ marginBottom: "4px" }}
          children={null}
        />
      </abbr>
    </div>
  );
};

const PresetCollapsed: React.FC<{ extras: any }> = ({ extras }: any) => {
  return (
    <div
      id="imgsharp_desktop_preset"
      style={{
        padding: "6px",
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
      }}
    >
      {extras}
    </div>
  );
};

const AppLayout: React.FC<any> = () => {
  const { token } = useToken();
  const [imageListCollapsed, toggleImageListCollapsed] = useToggle(false);
  const [presetCollapsed, togglePresetCollapsed] = useToggle(false);
  const [showInfo, toggleShowInfo] = useToggle(true);
  const [resize, toggleResize] = useToggle(false);
  const splitterStyle: CSSProperties = {
    width: "1px",
    border: "none",
    backgroundColor: token.colorBorderSecondary,
    transitionDuration: ".25s",
  };
  const handleStyle: CSSProperties = {
    position: "absolute",
    top: "calc(50% + 14px)",
    backgroundColor: token.colorPrimary,
    borderRadius: "0 6px 6px 0",
    width: "18px",
    height: "48px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transform: "translate(0, -50%)",
    zIndex: 3,
    transitionDuration: ".25s",
  };
  const resizeHintStyle: CSSProperties = {
    backdropFilter: "blur(4px)",
    WebkitBackdropFilter: "blur(4px)",
    position: "absolute",
    top: "38px",
    left: 0,
    width: "100%",
    height: "calc(100% - 38px)",
    backgroundColor: Color(token.colorBgBase).alpha(0.7) as any,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    transitionDuration: ".25s",
  };
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "var(--app-height)",
        backgroundColor: token.colorBgContainer,
        display: "flex",
        overflow: "hidden",
        transitionDuration: ".25s",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflowY: "hidden",
        }}
      >
        <ReflexContainer
          windowResizeAware
          orientation="vertical"
          style={{ flex: "1", overflow: "hidden" }}
        >
          {imageListCollapsed ? (
            <ReflexElement
              flex={0}
              minSize={40}
              maxSize={40}
              style={{ width: "40px" }}
            >
              <ImageListCollapsed
                extras={
                  <span id="imgsharp_desktop_imagelist">
                    <abbr title="展开图片列表">
                      <Button
                        size="middle"
                        type="text"
                        onClick={toggleImageListCollapsed}
                        icon={
                          <MenuUnfoldOutlined
                            style={{
                              color: token.colorText,
                            }}
                          />
                        }
                        style={{ marginBottom: "4px" }}
                      />
                    </abbr>
                  </span>
                }
              />
            </ReflexElement>
          ) : (
            <ReflexElement
              flex={0.2}
              minSize={200}
              maxSize={500}
              style={{
                width: "300px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <ImageList
                extras={
                  <abbr title="折叠">
                    <Button
                      size="middle"
                      type="text"
                      onClick={toggleImageListCollapsed}
                      icon={
                        <MenuFoldOutlined
                          style={{
                            color: token.colorText,
                          }}
                        />
                      }
                    />
                  </abbr>
                }
              />
              {resize ? <div style={resizeHintStyle} /> : undefined}
            </ReflexElement>
          )}
          <ReflexSplitter
            style={{
              ...splitterStyle,
              backgroundColor:
                resize && !imageListCollapsed
                  ? token.colorPrimary
                  : token.colorBorderSecondary,
            }}
          />
          <ReflexElement
            style={{
              display: "flex",
              flexDirection: "column",
              overflowY: "hidden",
            }}
          >
            <ImagePreviewPlate
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflowY: "hidden",
              }}
            >
              <ImagePreview inResize={resize} />
              {showInfo ? <ImagePreviewInfo /> : undefined}
            </ImagePreviewPlate>
            {resize && !imageListCollapsed ? (
              <ReflexHandle
                style={handleStyle}
                children={
                  <HolderOutlined
                    style={{
                      fontSize: "12px",
                      color: token.colorTextLightSolid,
                    }}
                  />
                }
              />
            ) : undefined}
            {resize ? (
              <div style={resizeHintStyle}>
                <span
                  style={{
                    backgroundColor: token.colorBgContainer,
                    padding: "8px 16px",
                    borderRadius: token.borderRadius,
                    fontSize: token.fontSizeHeading3,
                    color: token.colorText,
                  }}
                >
                  拖动手柄以调整布局
                </span>
                <Button
                  type="primary"
                  size="large"
                  style={{ marginTop: "16px" }}
                  onClick={toggleResize}
                >
                  完成
                </Button>
              </div>
            ) : undefined}
          </ReflexElement>
          <ReflexSplitter
            style={{
              ...splitterStyle,
              backgroundColor:
                resize && !presetCollapsed
                  ? token.colorPrimary
                  : token.colorBorderSecondary,
            }}
          />
          {presetCollapsed ? (
            <ReflexElement
              flex={0}
              minSize={40}
              maxSize={40}
              style={{ width: "40px" }}
            >
              <PresetCollapsed
                extras={
                  <span id="imgsharp_desktop_resize">
                    <span id="imgsharp_desktop_watermark">
                      <abbr title="展开预设">
                        <Button
                          size="middle"
                          type="text"
                          onClick={togglePresetCollapsed}
                          icon={
                            <MenuUnfoldOutlined
                              style={{
                                color: token.colorText,
                                transform: "scaleX(-1)",
                              }}
                            />
                          }
                        />
                      </abbr>
                    </span>
                  </span>
                }
              />
            </ReflexElement>
          ) : (
            <ReflexElement flex={0.3} minSize={320} maxSize={500}>
              <Preset
                extras={
                  <abbr title="折叠">
                    <Button
                      size="middle"
                      type="text"
                      onClick={togglePresetCollapsed}
                      style={{ marginRight: "2px" }}
                      icon={
                        <MenuFoldOutlined
                          style={{
                            color: token.colorText,
                            transform: "scaleX(-1)",
                          }}
                        />
                      }
                    />
                  </abbr>
                }
              />
              {resize ? <div style={resizeHintStyle} /> : undefined}
              {resize ? (
                <ReflexHandle
                  style={handleStyle}
                  children={
                    <HolderOutlined
                      style={{
                        fontSize: "12px",
                        color: token.colorTextLightSolid,
                      }}
                    />
                  }
                />
              ) : undefined}
            </ReflexElement>
          )}
        </ReflexContainer>
        <StatusBar
          extras={
            <>
              <span
                id={showInfo ? undefined : "imgsharp_desktop_image_operations"}
              >
                <abbr title={(showInfo ? "隐藏" : "显示") + "详细信息"}>
                  <Button
                    size="middle"
                    type="text"
                    onClick={toggleShowInfo}
                    icon={
                      <InfoCircleOutlined
                        style={{
                          color: showInfo
                            ? token.colorPrimary
                            : token.colorText,
                        }}
                      />
                    }
                  />
                </abbr>
              </span>
              <span id="imgsharp_desktop_ui">
                <abbr title={(resize ? "退出" : "进入") + "布局调整模式"}>
                  <Button
                    size="middle"
                    type="text"
                    onClick={toggleResize}
                    icon={
                      <BorderOuterOutlined
                        style={{
                          color: resize ? token.colorPrimary : token.colorText,
                        }}
                      />
                    }
                  />
                </abbr>
              </span>
            </>
          }
        />
      </div>
    </div>
  );
};
export default AppLayout;
