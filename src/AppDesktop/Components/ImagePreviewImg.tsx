import { LoadingOutlined } from "@ant-design/icons";
import { GlobalToken, Image, theme } from "antd";
import Color from "color";
import { debounce } from "lodash-es";
import { memo, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { processAndUpdateImg, updateImg } from "../../store/action";
import Guide from "./Guide";

const { useToken } = theme;

type Props = {
  selectedImgPreview: Img;
  preset: Preset;
  previewVisible: Boolean;
  setPreviewVisible: any;
  token: GlobalToken;
};

const _ImagePreviewImg: React.FC<Props> = ({
  selectedImgPreview,
  preset,
  previewVisible,
  setPreviewVisible,
  token,
}: Props) => {
  if (!selectedImgPreview) return <Guide />;
  if (!selectedImgPreview.rawImageObj) return <></>;
  const getDebouncedUpdate = (delay: number) => () => {
    updateImg(selectedImgPreview.id, { busy: true });
    useCallback(
      debounce(() => {
        processAndUpdateImg(selectedImgPreview);
      }, delay),
      []
    )();
  };
  if (selectedImgPreview.rawImageObj && !selectedImgPreview.processed) {
    if (!selectedImgPreview.busy) {
      getDebouncedUpdate(500)();
    }
  }
  if (
    selectedImgPreview.processed &&
    selectedImgPreview.preset!.hash != preset.hash
  ) {
    if (!selectedImgPreview.busy) getDebouncedUpdate(250)();
  }
  const imgSrc = selectedImgPreview.processed
    ? selectedImgPreview.processed.src
    : selectedImgPreview.rawImageObj
    ? selectedImgPreview.rawImageObj.src
    : undefined;
  return (
    <>
      <img
        id="imgsharp_desktop_preview"
        style={{
          boxSizing: "border-box",
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
          filter:
            !selectedImgPreview.preset ||
            !selectedImgPreview.preset.preserveAlpha
              ? "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))"
              : undefined,
          opacity: selectedImgPreview.processed ? 1 : 0.75,
          cursor: "zoom-in",
        }}
        src={imgSrc}
        onClick={() => setPreviewVisible(true)}
      />
      <Image
        style={{ display: "none" }}
        preview={{
          visible: previewVisible as any,
          scaleStep: 0.5,
          src: imgSrc,
          onVisibleChange: setPreviewVisible,
        }}
      />
      <div
        style={{
          display:
            selectedImgPreview.processed &&
            selectedImgPreview.preset!.hash == preset.hash
              ? "none"
              : "flex",

          transitionDuration: ".25s",
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "48px",
          height: "48px",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Color(token.colorBgBase).alpha(0.6) as any,
          color: token.colorText,
          fontSize: "18px",
          borderRadius: token.borderRadius,
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <LoadingOutlined />
      </div>
    </>
  );
};
const eq = (prevProps: any, nextProps: any) => {
  if (!prevProps.token || !nextProps.token) return false;
  if (!prevProps.selectedImgPreview || !nextProps.selectedImgPreview)
    return false;
  if (!prevProps.rawImageObj || !nextProps.rawImageObj) return false;
  if (!prevProps.processed || !nextProps.processed) return false;
  if (prevProps.selectedImgPreview.hash != nextProps.selectedImgPreview.hash)
    return false;
  if (
    prevProps.selectedImgPreview.processed &&
    nextProps.selectedImgPreview.processed &&
    (prevProps.selectedImgPreview.preset.hash == prevProps.preset.hash) !=
      (nextProps.selectedImgPreview.preset.hash == nextProps.preset.hash)
  )
    return false;
  return true;
};
const _ImagePreviewImgWrapper = memo(_ImagePreviewImg, eq);
const ImagePreviewImg: React.FC = () => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const imgs = useSelector((state: any) => state.reducer.imgs);
  const selectedImgIndex = useSelector(
    (state: any) => state.reducer.selectedImgIndex
  );
  const preset = useSelector((state: any) => state.reducer.preset);
  const { token } = useToken();
  return (
    <_ImagePreviewImgWrapper
      previewVisible={previewVisible}
      setPreviewVisible={setPreviewVisible}
      selectedImgPreview={imgs[selectedImgIndex]}
      preset={preset}
      token={token}
    />
  );
};
export default ImagePreviewImg;
