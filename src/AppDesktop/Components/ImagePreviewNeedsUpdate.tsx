import { useSelector } from "react-redux";
const ImagePreviewNeedsUpdate: React.FC = () => {
  const imgs = useSelector((state: any) => state.reducer.imgs);
  const selectedImgIndex = useSelector(
    (state: any) => state.reducer.selectedImgIndex
  );
  const selectedImgPreview = imgs[selectedImgIndex];
  const preset = useSelector((state: any) => state.reducer.preset);
  if (!selectedImgPreview) return <></>;
  if (!selectedImgPreview.rawImageObj) return <>（导入中）</>;
  if (!selectedImgPreview.preset) return <>（准备中）</>;
  if (selectedImgPreview.preset.hash != preset.hash) return <>（需要更新）</>;
  return <></>;
};
export default ImagePreviewNeedsUpdate;
