import chalk from "chalk";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import { nanoid } from "nanoid";
import watermarkPNG from "../assets/watermark.png";

dayjs.extend(duration);
dayjs.extend(relativeTime);

export const getFiles = (
  accept: String = "*",
  multiple: Boolean = false
): Promise<FileList> =>
  new Promise((resolve) => {
    const fileInput: HTMLInputElement = document.createElement("input");
    Object.assign(fileInput, {
      type: "file",
      accept: accept,
      multiple: multiple,
    });
    let destroyed = false;
    const destroy = () => {
      if (destroyed) return;
      fileInput.remove();
      window.removeEventListener("focus", destroy);
      destroyed = true;
    };
    window.addEventListener("focus", () => {
      destroy();
    });
    fileInput.addEventListener("input", () => {
      let files = fileInput.files;
      destroy();
      if (files) resolve(files);
    });
    fileInput.click();
  });
export const file2image = async (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve) => {
    let imageObj: HTMLImageElement = new Image() as HTMLImageElement;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      imageObj.src = e.target?.result as string;
    };
    imageObj.addEventListener("load", () => {
      resolve(imageObj);
    });
  });
export const getInitialImg = async (rawFile: File): Promise<Img> => {
  let img: Img = {
    id: nanoid(),
    fileInfo: {
      name: rawFile.name,
      lastModified: rawFile.lastModified,
    },
    raw: rawFile,
    rawImageObj: null,
    rawDimensions: null,
    rawSize: rawFile.size,
    thumb: document.createElement("img"),
    processed: null,
    processedDimensions: null,
    processedSize: null,
    preset: null,
    needUpdate: true,
    hash: nanoid(),
    busy: false,
    error: false,
    renamed: false,
  };
  return img;
};
export const getDefaultWatermark = () => {
  let defaultWatermarkImage = new Image();
  defaultWatermarkImage.src = watermarkPNG;
  return {
    marginX: 8,
    marginY: 8,
    opacity: 80,
    placement: "lt",
    image: defaultWatermarkImage,
    id: nanoid(),
  };
};

export const getDefaultWatermarkAsync = async () => {
  return await new Promise((res) => {
    let defaultWatermarkImage = new Image();
    defaultWatermarkImage.onload = () => {
      res({
        marginX: 8,
        marginY: 8,
        opacity: 80,
        placement: "lt",
        image: defaultWatermarkImage,
        id: nanoid(),
      });
    };
    defaultWatermarkImage.src = watermarkPNG;
  });
};

export const printBuildInfo = () => {
  console.group(chalk.bold("✨Build Info"));
  console.log(`🏠Environment: ${chalk.blue(import.meta.env.MODE)}`);
  console.log(
    `🕝Build Timestamp: ${chalk.blue(__BUILD_TIMESTAMP__)} (${dayjs
      .duration(
        -(
          Math.round(new Date().getTime() / 1000) -
          parseInt(__BUILD_TIMESTAMP__)
        ),
        "seconds"
      )
      .humanize(true)})`
  );
  console.groupEnd();
};
