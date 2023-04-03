import { PlusOutlined } from "@ant-design/icons";
import { App, theme } from "antd";
import { useEffect, useState } from "react";
import { importFiles, selectImg } from "../../store/action";
import store from "../../store/store";

const { useToken } = theme;

const DOMHandler: React.FC = () => {
  const [mask, setMask] = useState(false);
  const { token } = useToken();
  const { message, modal } = App.useApp();
  useEffect(() => {
    const defaultHandler: EventListener = (e: Event) => e.preventDefault();
    document.addEventListener("dragleave", defaultHandler);
    document.addEventListener("drop", defaultHandler);
    document.addEventListener("dragenter", defaultHandler);
    document.addEventListener("dragover", defaultHandler);
    const dragEnterHandler: EventListener = () => {
      setMask(true);
    };
    document.addEventListener("dragenter", dragEnterHandler);
    const dragLeaveListener: EventListener = (e: any) => {
      if (
        e.target.nodeName === "HTML" ||
        e.target === e.explicitOriginalTarget ||
        (!e.fromElement &&
          (e.clientX <= 0 ||
            e.clientY <= 0 ||
            e.clientX >= window.innerWidth ||
            e.clientY >= window.innerHeight))
      ) {
        setMask(false);
      }
    };
    document.addEventListener("dragleave", dragLeaveListener);
    const dropHandler: any = async (e: DragEvent) => {
      setMask(false);
      e.preventDefault();
      let fileCnt =
        e.dataTransfer && e.dataTransfer.files
          ? await importFiles(e.dataTransfer.files)
          : 0;
      if (fileCnt) message.success(`已导入${fileCnt}个文件`);
      else message.error("没有拖入可供导入的文件");
      e.preventDefault();
      e.stopPropagation();
    };
    document.addEventListener("drop", dropHandler);
    // handle document paste
    const pasteHandler: any = async (e: ClipboardEvent) => {
      let fileCnt = e.clipboardData
        ? await importFiles(e.clipboardData.files)
        : 0;
      if (fileCnt) message.success(`已导入${fileCnt}个文件`);
      else message.error("剪贴板中没有可供导入的文件");
      e.preventDefault();
      e.stopPropagation();
    };
    document.addEventListener("paste", pasteHandler);
    const keyHandler: any = (e: KeyboardEvent) => {
      let state = store.getState().reducer;
      if (document.querySelector("*:focus")) return;
      if (
        (e.key == "ArrowUp" || e.key == "ArrowLeft") &&
        state.selectedImgIndex > 0
      ) {
        selectImg(state.selectedImgIndex - 1);
        e.preventDefault();
      }
      if (
        (e.key == "ArrowDown" || e.key == "ArrowRight") &&
        state.selectedImgIndex != state.imgs.length - 1 &&
        state.selectedImgIndex >= 0
      ) {
        selectImg(state.selectedImgIndex + 1);
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", keyHandler);
    const appInstalledHandler = () =>
      modal.success({
        title: " PWA 安装成功",
        content: "现在你可以直接使用 ImgSharp# 打开本地图片了。",
      });
    window.addEventListener("appinstalled", appInstalledHandler);

    // unmount
    return () => {
      document.removeEventListener("dragleave", defaultHandler);
      document.removeEventListener("drop", defaultHandler);
      document.removeEventListener("dragenter", defaultHandler);
      document.removeEventListener("dragover", defaultHandler);
      document.removeEventListener("dragenter", dragEnterHandler);
      document.removeEventListener("dragleave", dragLeaveListener);
      document.removeEventListener("drop", dropHandler);
      document.removeEventListener("paste", pasteHandler);
      document.removeEventListener("keydown", keyHandler);
      document.removeEventListener("appinstalled", appInstalledHandler);
    };
  }, []);

  return (
    <div
      style={{
        display: mask ? "flex" : "none",
        zIndex: 1,
        position: "fixed",
        left: 0,
        top: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: token.colorBgMask,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <PlusOutlined
        style={{
          color: token.colorTextLightSolid,
          fontSize: "56px",
          marginBottom: "16px",
        }}
      />
      <div style={{ color: token.colorTextLightSolid, fontSize: "24px" }}>
        导入
      </div>
    </div>
  );
};
export default DOMHandler;
