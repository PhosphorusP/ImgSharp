import { App as AntdApp, ConfigProvider, theme } from "antd";
import zhCN from "antd/locale/zh_CN";
import { debounce } from "lodash-es";
import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { handleImage, shareImage } from "../store/action";
import AppLayout from "./AppLayout";
import DOMHandler from "./Components/DOMHandler";
const { defaultAlgorithm, darkAlgorithm, compactAlgorithm } = theme;

const AppDesktop: React.FC = () => {
  const systemPrefersDark = useMediaQuery(
    {
      query: "(prefers-color-scheme: dark)",
    },
    undefined
  )
    ? 1
    : 0;
  const darkMode = useSelector((state: any) => state.reducer.darkMode);
  const appHeight = useCallback(
    debounce(() => {
      document.documentElement.style.setProperty(
        "--app-height",
        `${window.innerHeight}px`
      );
    }, 0),
    []
  );
  window.addEventListener("resize", appHeight);
  window.document.body.style.colorScheme =
    systemPrefersDark ^ darkMode ? "dark" : "light";
  window.document.body.style.color =
    systemPrefersDark ^ darkMode ? "#FFF" : "#000";
  appHeight();
  shareImage();
  handleImage();
  return (
    <ConfigProvider
      theme={{
        algorithm: [
          systemPrefersDark ^ darkMode ? darkAlgorithm : defaultAlgorithm,
          compactAlgorithm,
        ],
      }}
      locale={zhCN}
      autoInsertSpaceInButton={false}
    >
      <AntdApp>
        <AppLayout />
        <DOMHandler />
      </AntdApp>
    </ConfigProvider>
  );
};

export default AppDesktop;
