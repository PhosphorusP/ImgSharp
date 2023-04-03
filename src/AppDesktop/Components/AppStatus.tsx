import {
  AppstoreOutlined,
  CheckCircleFilled,
  GlobalOutlined,
  InfoCircleFilled,
} from "@ant-design/icons";
import { Badge, Button, Popover, theme } from "antd";
import { useMediaQuery } from "react-responsive";

const { useToken } = theme;

const AppStatus: React.FC = () => {
  const { token } = useToken();
  const standaloneMode = useMediaQuery(
    {
      query: "(display-mode: standalone)",
    },
    undefined
  );
  const fileHandler = "launchQueue" in window;
  return (
    <Popover
      content={
        <div>
          {standaloneMode ? (
            <div>
              <CheckCircleFilled
                style={{
                  color: token.colorSuccess,
                  marginRight: token.marginXS,
                }}
              />
              ImgSharp# 正在以PWA模式运行。
            </div>
          ) : (
            <div>
              <InfoCircleFilled
                style={{
                  color: token.colorPrimary,
                  marginRight: token.marginXS,
                }}
              />
              ImgSharp# 正在以网页模式运行。
            </div>
          )}
          {fileHandler ? (
            <div>
              <CheckCircleFilled
                style={{
                  color: token.colorSuccess,
                  marginRight: token.marginXS,
                }}
              />
              当前浏览器支持注册为文件打开方式。
              {!standaloneMode ? "安装为PWA以使用该特性。" : undefined}
            </div>
          ) : (
            <div>
              <InfoCircleFilled
                style={{
                  color: token.colorPrimary,
                  marginRight: token.marginXS,
                }}
              />
              当前浏览器不支持注册为文件打开方式。
            </div>
          )}
        </div>
      }
      children={
        <Badge
          color="blue"
          size="small"
          dot={!standaloneMode && fileHandler}
          offset={!standaloneMode && fileHandler ? [-8, 10] : [-6, 8]}
          count={
            standaloneMode && fileHandler ? (
              <CheckCircleFilled style={{ color: token.colorSuccess }} />
            ) : undefined
          }
        >
          <Button
            type="text"
            size="large"
            icon={
              standaloneMode ? (
                <AppstoreOutlined
                  style={{
                    color: !fileHandler ? token.colorTextDisabled : undefined,
                  }}
                />
              ) : (
                <GlobalOutlined style={{ color: token.colorTextDisabled }} />
              )
            }
          />
        </Badge>
      }
    />
  );
};

export default AppStatus;
