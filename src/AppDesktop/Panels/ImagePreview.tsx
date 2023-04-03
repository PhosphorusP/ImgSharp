import { BulbOutlined, EyeOutlined, MobileOutlined } from "@ant-design/icons";
import { Badge, Button, Divider, Tabs, theme } from "antd";
import React from "react";
import { setAppMode, toggleDarkMode } from "../../store/action";
import AppStatus from "../Components/AppStatus";
import ImagePreviewImg from "../Components/ImagePreviewImg";
import ImagePreviewNeedsUpdate from "../Components/ImagePreviewNeedsUpdate";
import ThumbGallery from "../Components/ThumbGallery";
import Settings from "../Panels/Settings";
import Help from "./Help";

const { useToken } = theme;

type ImagePreviewProps = {
  inResize: boolean;
};

const ImagePreview: React.FC<ImagePreviewProps> = ({
  inResize,
}: ImagePreviewProps) => {
  const { token } = useToken();
  return (
    <>
      <Tabs
        activeKey="null"
        size="large"
        items={[
          {
            label: (
              <div style={{ display: "flex", alignItems: "center" }}>
                <EyeOutlined />
                预览
                <ImagePreviewNeedsUpdate />
              </div>
            ),
            key: "preview",
          },
        ]}
        tabBarStyle={{
          marginBottom: 0,
          padding: "0 2px 0 8px",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          boxShadow: `0 0 72px ${token.colorBgContainer} inset`,
          transitionDuration: ".25s",
          zIndex: 10,
        }}
        tabBarExtraContent={
          <>
            <AppStatus />
            {inResize ? undefined : (
              <>
                {undefined && (
                  <Badge dot color="blue" offset={[-10, 8]}>
                    <Button
                      size="large"
                      type="text"
                      onClick={() => {
                        setAppMode("mobile");
                      }}
                      icon={<MobileOutlined />}
                    />
                  </Badge>
                )}
                <Help />
                <Divider type="vertical" />
              </>
            )}

            <abbr
              title={"切换深/浅色"}
              children={
                <Button
                  size="large"
                  type="text"
                  onClick={toggleDarkMode}
                  icon={<BulbOutlined />}
                />
              }
            />
            {1 && <abbr title="设置" children={<Settings />} />}
          </>
        }
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          overflowY: "hidden",
        }}
        id="preview-area"
      >
        <div
          children={<ImagePreviewImg />}
          style={{
            boxSizing: "border-box",
            flex: 1,
            padding: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            position: "relative",
          }}
        />
        <div
          style={{
            height: "40px",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            boxShadow: `0 0 96px ${token.colorBgContainer} inset`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: token.colorText,
            fontSize: "12px",
            fontFamily: token.fontFamily,
            transitionDuration: ".25s",
          }}
        >
          <ThumbGallery />
        </div>
      </div>
    </>
  );
};
export default ImagePreview;
