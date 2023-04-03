import dayjs from "dayjs";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { cloneDeep } from "lodash-es";
import { nanoid } from "nanoid";
import PQueue from "p-queue";
import {
  file2image,
  getDefaultWatermarkAsync,
  getFiles,
  getInitialImg,
} from "../utils/file";
import { process } from "../utils/process";
import store from "./store";
export const updateState = (assignments: any) => {
  store.dispatch({
    type: "updateState",
    assignments: assignments,
  });
};
export const setAppMode = (mode: String) => {
  updateState({
    appMode: mode,
  });
};
export const toggleDarkMode = () => {
  let state = store.getState().reducer;
  updateState({
    darkMode: !state.darkMode,
  });
};
export const updatePreset = (assignments: any) => {
  let state = store.getState().reducer;
  let preset = {
    ...state.preset,
    ...assignments,
    hash: assignments.hash ? assignments.hash : nanoid(),
  };
  preset.preserveAlpha =
    assignments?.formatExtension == "jpeg" ? false : preset.preserveAlpha;
  store.dispatch({
    type: "updatePreset",
    preset: preset,
  });
  updateImgs(
    state.imgs.map((img: any) => ({
      ...img,
      needUpdate: !(img.preset && img.preset.hash == preset.hash),
      error: false,
      hash: nanoid(),
    }))
  );
};
export const appendWatermark = async () => {
  let state = store.getState().reducer;
  updatePreset({
    ...state.preset,
    watermarks: (state.preset as any).watermarks
      .slice()
      .concat([await getDefaultWatermarkAsync()]),
    hash: nanoid(),
  });
};
export const updateWatermark = (watermark: any, index: any) => {
  let state = store.getState().reducer;
  let watermarks = (state.preset as any).watermarks.slice();
  watermarks[index] = watermark;
  updatePreset({
    ...state.preset,
    watermarks: watermarks,
    hash: nanoid(),
  });
};
export const updateWatermarkImage = (
  image: HTMLImageElement,
  index: number
) => {
  let state = store.getState().reducer;
  let watermarks = state.preset.watermarks.slice();
  watermarks[index].image = image;
  watermarks[index].id = nanoid();
  updatePreset({
    ...state.preset,
    watermarks: watermarks,
    hash: nanoid(),
  });
};
export const removeWatermark = (index: number) => {
  let state = store.getState().reducer;
  let watermarks = state.preset.watermarks.slice();
  watermarks.splice(index, 1);
  updatePreset({ ...state.preset, watermarks: watermarks, hash: nanoid() });
};
export const updateImgs = (imgs: any) => {
  store.dispatch({
    type: "updateImgs",
    imgs: imgs,
  });
};
export const importImgs = (imgs: any) => {
  let state = store.getState().reducer;
  updateImgs(state.imgs.concat(imgs));
  if (imgs.length && state.selectedImgIndex < 0) selectImg(0);
  for (let i of imgs) {
    processQueue.add(
      async () => {
        await new Promise(async (resolve, reject) => {
          let imgObj = await file2image(i.raw as unknown as File);
          updateImg(i.id, {
            rawImageObj: imgObj,
            rawDimensions: [imgObj.width, imgObj.height],
          });
          let thumb = (
            await process(imgObj as unknown as HTMLImageElement, {
              crop: false,
              cropRatio: "4_3",
              cropRatioCustomX: 1,
              cropRatioCustomY: 1,
              cropOriginHorizontal: "center",
              cropOriginVertical: "center",
              scale: true,
              scaleMethod: "shorter",
              scaleSize: 40 * window.devicePixelRatio,
              watermarks: [],
              formatExtension: "jpeg",
              imageQuality: 70,
              preserveAlpha: true,
              imageSmoothingQuality: "medium",
              hash: "THUMB",
            })
          ).img;
          updateImg(i.id, {
            thumb,
          });
          resolve({});
        });
      },
      { priority: 1 }
    );
  }
};
export const importFiles = async (files: any) => {
  let imgs_: Array<Img> = [];
  for (let i of files) {
    if (["image/png", "image/jpeg", "image/webp"].indexOf(i.type) < 0) continue;
    let img = await getInitialImg(i);
    imgs_.push(img);
  }
  importImgs(imgs_);
  return imgs_.length;
};
export const importImage = async () => {
  let files: FileList = await getFiles(
    "image/jpeg, image/png, image/webp",
    true
  );
  importFiles(files);
};
export const handleImage = async () => {
  if (
    "launchQueue" in window &&
    "files" in (window as any).LaunchParams.prototype
  ) {
    (window!.launchQueue as any).setConsumer(async (launchParams: any) => {
      if (!launchParams.files.length) return;
      let files = [];
      for (const fileHandle of launchParams.files)
        files.push(await fileHandle.getFile());
      importFiles(files);
    });
  }
};
export const shareImage = async () => {
  let db: any;
  let request = window.indexedDB.open("imgsharp");
  request.onerror = function () {
    alert("错误: 无法读取IndexedDB");
  };
  let load = async () => {
    let transaction = db.transaction(["share-target-cache"], "readwrite");
    transaction.objectStore("share-target-cache").getAll().onsuccess = async (
      event: any
    ) => {
      transaction.objectStore("share-target-cache").clear();
      if (event.target.result.length > 0) {
        let files = event.target.result;
        importFiles(files);
      }
    };
  };
  request.onsuccess = function (event: any) {
    db = event.target.result;
    if (db.setVersion) {
      if (db.version != (window as any).dbVersion) {
        let setVersion = db.setVersion((window as any).dbVersion);
        setVersion.onsuccess = function () {
          db.createObjectStore("share-target-cache");
          load();
        };
      } else {
        load();
      }
    } else {
      load();
    }
  };
  request.onupgradeneeded = function (event: any) {
    let db = event.target.result;
    db.createObjectStore("share-target-cache");
  };
};
export const updateImg = (id: String, assignments: any) => {
  let state = store.getState().reducer;
  let imgs = cloneDeep(state.imgs);
  let index = imgs.findIndex((i: Img) => i.id == id);
  imgs[index] = { ...imgs[index], ...assignments, hash: nanoid() };
  updateImgs(imgs);
};
export const removeImg = (id: String) => {
  let state = store.getState().reducer;
  let selectedIndex = state.selectedImgIndex;
  let i = state.imgs.findIndex((i: Img) => i.id == id);
  let imgs = cloneDeep(state.imgs);
  imgs.splice(i, 1);
  updateImgs(imgs);
  if (i == selectedIndex) {
    if (i < state.imgs.length - 1) {
      selectImg(i);
    } else if (i > 0) {
      selectImg(i - 1);
    } else {
      selectImg(-1);
    }
  }
};
export const clearImgs = () => {
  updateState({
    imgs: [],
    selectedImg: null,
    selectedImgIndex: -1,
  });
};
export const selectImg = (index: number) => {
  store.dispatch({
    type: "selectImg",
    index: index,
  });
};
export const processAndUpdateImg = (img: any, processOnly?: boolean) =>
  new Promise<any>((res) => {
    let state = store.getState().reducer;
    let preset = state.preset;
    processQueue.add(
      async () => {
        let imgObj = img.rawImageObj;
        if (!processOnly)
          updateImg(img.id, {
            busy: true,
          });
        let result = await process(
          imgObj as unknown as HTMLImageElement,
          preset
        );
        let processed = result.img;
        let src = processed.src;
        let base64Length = src.length - (src.indexOf(",") + 1);
        let padding =
          src.charAt(src.length - 2) === "="
            ? 2
            : src.charAt(src.length - 1) === "="
            ? 1
            : 0;
        let fileSize = base64Length * 0.75 - padding;
        let processResult = {
          id: img.id,
          result: {
            processed,
            processedDimensions: [processed.width, processed.height],
            processedSize: fileSize,
            preset: preset,
            needUpdate: false,
            busy: false,
            error: result.error,
          },
        };
        if (!processOnly) updateImg(img.id, processResult.result);
        res(processResult);
      },
      { priority: img.id == state.selectedImg ? 5 : 2 }
    );
  });
export const processAll = (
  handler?: Function,
  target?: "zip" | "files",
  names?: any
) => {
  let state = store.getState().reducer;
  let imgs = cloneDeep(state.imgs);
  let progress = new Set();
  let cnt = 0;
  let startTime = new Date().getTime();
  let canceled = false;
  return new Promise<any>(async (resolve) => {
    let toProcess = imgs.filter(
      (img: Img) =>
        !img.preset || img.preset.hash != state.preset.hash || img.needUpdate
    );
    let processed = imgs.length - toProcess.length;
    if (handler) {
      handler.call(undefined, {
        progress: 0,
        size: imgs.length,
        current: "-",
        processed: processed,
        cancel: {
          func: () => {
            canceled = true;
          },
        },
      });
    }
    if ((navigator as any).setAppBadge)
      (navigator as any).setAppBadge(toProcess.length);
    for (let i in toProcess) progress.add(toProcess[i].id);
    for (let i in toProcess) {
      if (canceled) {
        break;
      }
      await new Promise<void>(async (res) => {
        let img = toProcess[i];
        cnt++;
        let result = (await processAndUpdateImg(img, true)).result;
        Object.assign(
          imgs[imgs.findIndex((item: Img) => item.id == img.id)],
          result
        );
        if (handler) {
          handler.call(undefined, {
            progress: parseInt(i) + 1,
            size: imgs.length,
            current: toProcess[i]!.fileInfo!.name,
            processed: processed,
          });
        }
        if ((navigator as any).setAppBadge)
          (navigator as any).setAppBadge(toProcess.length - parseInt(i) - 1);
        progress.delete(img.id);
        res();
      });
    }

    if (handler) {
      handler.call(undefined, {
        progress: toProcess.length,
        size: imgs.length,
        current: "-",
        processed: processed,
        canceled: canceled,
      });
    }
    if ((navigator as any).clearAppBadge) (navigator as any).clearAppBadge();
    if (!canceled) updateImgs(imgs);
    if (target) {
      let imgs_exp = cloneDeep(imgs);
      if (names)
        for (let img of imgs_exp) {
          img!.fileInfo!.name = names[img.id]!.name;
        }
      if (target == "zip") {
        let jszip = new JSZip();
        for (let img of imgs_exp) {
          let content = img.processed.src.substring(
            img.processed.src.indexOf("base64,") + "base64,".length
          );
          jszip.file(img!.fileInfo!.name, content, { base64: true });
        }
        let zipContent = await jszip.generateAsync({ type: "blob" });
        saveAs(
          zipContent,
          "ImgSharp导出 " + dayjs().format("YYYYMMDD-HH-mm-ss") + ".zip"
        );
      } else if (target == "files")
        for (let img of imgs_exp)
          saveAs(img.processed.src, img!.fileInfo!.name);
    }
    resolve({
      duration: cnt ? (new Date().getTime() - startTime) / 1000 : 0,
      count: cnt,
      canceled: canceled,
    });
  });
};
const processQueue: PQueue = new PQueue({
  concurrency: 1,
});
