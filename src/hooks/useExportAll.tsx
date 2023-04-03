import { keyBy, throttle } from "lodash-es";
import nodupes from "nodupes";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { processAll } from "../store/action";

const formatExtensions = { jpeg: "jpg", png: "png", webp: "webp" };

export function useExportAll() {
  const [openExportDrawer, setOpenExportDrawer] = useState(false);
  const [openProgressDrawer, setOpenProgressDrawer] = useState(false);
  const [progress, setProgress] = useState({
    progress: 1,
    processed: 0,
    size: 1,
    current: "",
  });
  const [percent, setPercent] = useState(0);
  const [processedPercent, setProcessedPercent] = useState(0);
  const [zip, setZip] = useState(false);
  const [cancel, setCancel] = useState<any>(null);
  const [canceled, setCanceled] = useState<any>(false);
  let updatePercent = (progress: any) => {
    if (progress.canceled) setCanceled(true);
    setPercent(
      progress.size == 0
        ? 0
        : ((progress.processed + progress.progress) / progress.size) * 100
    );
    setProcessedPercent((progress.processed / progress.size) * 100);
  };
  const progressHandler = async (progress: any) => {
    if (progress.cancel) {
      setCancel(progress.cancel);
      return;
    }
    setProgress(progress);
    updatePercent(progress);
  };
  const imgsStored = useSelector((state: any) => state.reducer.imgs);
  const preset = useSelector((state: any) => state.reducer.preset) as Preset;
  const [imgs, setImgs] = useState([] as Array<Img>);
  const onOpenExportDrawer = () => {
    setOpenExportDrawer(true);
    let _nodupes = nodupes();
    let tmpImgs = imgsStored.slice().map((img: Img) => ({
      ...img,
      fileInfo: {
        ...img.fileInfo,
      },
    }));
    for (let img of tmpImgs) {
      let filename = img.fileInfo!.name.split(".").slice(0, -1).join(".");
      let n = _nodupes(filename);
      if (n != filename) img.renamed = true;
      img.fileInfo!.name =
        n + "." + (formatExtensions as any)[preset.formatExtension as any];
    }
    tmpImgs.sort((a: Img, b: Img) => (b.error ? 1 : 0) - (a.error ? 1 : 0));
    setImgs(tmpImgs as any);
  };
  const onExport = async (zip: boolean) => {
    setOpenProgressDrawer(true);
    setCanceled(false);
    setZip(zip);
    let filenames = keyBy(
      imgs.map((img: Img) => ({ id: img.id, name: img!.fileInfo!.name })),
      "id"
    );
    processAll(progressHandler, zip ? "zip" : "files", filenames);
  };
  const onClose = () => {
    setOpenProgressDrawer(false);
    if (!canceled) setTimeout(() => setOpenExportDrawer(false), 250);
  };
  const isSafari =
    /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  return {
    openExportDrawer,
    setOpenExportDrawer,
    openProgressDrawer,
    setOpenProgressDrawer,
    cancel,
    canceled,
    progress,
    percent,
    processedPercent,
    zip,
    imgsStored,
    imgs,
    onOpenExportDrawer,
    onExport,
    onClose,
    isSafari,
  };
}
