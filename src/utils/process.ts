const cropRatios = {
  "4_3": { rw: 4, rh: 3 },
  "3_4": { rw: 3, rh: 4 },
  "16_9": { rw: 16, rh: 9 },
  "9_16": { rw: 9, rh: 16 },
  "1_1": { rw: 1, rh: 1 },
};
const formats = {
  jpeg: { name: "JPEG", ext: ".jpg", mime: "image/jpeg" },
  png: { name: "PNG", ext: ".png", mime: "image/png" },
  webp: { name: "WebP", ext: ".webp", mime: "image/webp" },
};
const releaseCanvas = (canvas: HTMLCanvasElement) => {
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d");
  ctx && ctx.clearRect(0, 0, 1, 1);
  canvas.remove();
};
const process = async function (
  rawImg: HTMLImageElement,
  preset: Preset
): Promise<ProcessResult> {
  let imgWidth = rawImg.width as number;
  let imgHeight = rawImg.height as number;
  let sx = 0,
    sy = 0,
    sw = imgWidth,
    sh = imgHeight;
  let canvas = document.createElement("canvas");
  let ctx: CanvasRenderingContext2D = canvas.getContext("2d", {
    alpha: preset.preserveAlpha,
  }) as CanvasRenderingContext2D;
  // resize: crop
  if (preset.crop) {
    let rw: number, rh: number;
    if (
      typeof cropRatios[preset.cropRatio as keyof typeof cropRatios] !=
      "undefined"
    ) {
      rw = cropRatios[preset.cropRatio as keyof typeof cropRatios].rw;
      rh = cropRatios[preset.cropRatio as keyof typeof cropRatios].rh;
    } else {
      rw = preset.cropRatioCustomX as number;
      rh = preset.cropRatioCustomY as number;
    }
    let imgRatio = imgWidth / imgHeight;
    let resRatio = rw / rh;
    if (imgRatio <= resRatio) {
      sw = imgWidth;
      sh = sw / resRatio;
      sx = 0;
      switch (preset.cropOriginVertical) {
        case "top":
          sy = 0;
          break;
        case "center":
          sy = (imgHeight - sh) / 2;
          break;
        case "bottom":
          sy = imgHeight - sh;
          break;
      }
    } else {
      sh = imgHeight;
      sw = sh * resRatio;
      sx = (imgWidth - sw) / 2;
      switch (preset.cropOriginHorizontal) {
        case "left":
          sx = 0;
          break;
        case "center":
          sx = (imgWidth - sw) / 2;
          break;
        case "right":
          sx = imgWidth - sw;
          break;
      }
      sy = 0;
    }
    imgWidth = sw;
    imgHeight = sh;
  }
  // resize: scale
  if (preset.scale) {
    let m;
    if (preset.scaleMethod == "width") m = "w";
    else if (preset.scaleMethod == "height") m = "h";
    else if (preset.scaleMethod == "longer" && imgWidth >= imgHeight) m = "w";
    else if (preset.scaleMethod == "shorter" && imgWidth < imgHeight) m = "w";
    else if (preset.scaleMethod == "longer" && imgHeight >= imgWidth) m = "h";
    else if (preset.scaleMethod == "shorter" && imgHeight < imgWidth) m = "h";
    let w, h;
    if (m == "w") {
      w = Math.min(preset.scaleSize as number, rawImg.width);
      h = (w * imgHeight) / imgWidth;
    } else {
      h = Math.min(preset.scaleSize as number, rawImg.height);
      w = (h * imgWidth) / imgHeight;
    }
    imgWidth = w;
    imgHeight = h;
  }
  // draw image to the canvas
  imgWidth = Math.max(1, Math.trunc(imgWidth));
  imgHeight = Math.max(1, Math.trunc(imgHeight));
  canvas.width = imgWidth;
  canvas.height = imgHeight;
  // preserveAlpha
  if (!preset.preserveAlpha && preset.formatExtension != "jpeg") {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, imgWidth, imgHeight);
  }
  ctx.imageSmoothingQuality = preset.imageSmoothingQuality;
  (ctx as any).mozImageSmoothingEnabled = true;
  (ctx as any).webkitImageSmoothingEnabled = true;
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(rawImg, sx, sy, sw, sh, 0, 0, imgWidth, imgHeight);
  // draw watermark
  for (let i in preset.watermarks) {
    let watermark = preset.watermarks[i];
    ctx.globalAlpha = watermark.opacity / 100;
    let watermarkWidth = watermark.image.width,
      watermarkHeight = watermark.image.height;
    if (watermark.placement == "pattern" || watermark.placement == "repeat") {
      let watermarkStartX = 0,
        watermarkStartY = watermark.marginY,
        offset = 0,
        firstLine = true;
      while (watermarkStartY - watermarkHeight <= imgHeight) {
        watermarkStartX = firstLine ? watermark.marginX : 0 - offset;
        firstLine = false;
        while (watermarkStartX - watermarkWidth <= imgWidth) {
          ctx.drawImage(
            watermark.image,
            0,
            0,
            watermarkWidth,
            watermarkHeight,
            watermarkStartX,
            watermarkStartY,
            watermarkWidth,
            watermarkHeight
          );
          watermarkStartX += watermarkWidth + watermark.marginX;
        }
        offset =
          watermark.placement == "repeat"
            ? (watermarkWidth + watermark.marginX) * 2 -
              watermarkStartX +
              imgWidth
            : 0;
        watermarkStartY += watermarkHeight + watermark.marginY;
      }
    } else if (watermark.placement == "center") {
      let watermarkStartX = (imgWidth - watermarkWidth) / 2,
        watermarkStartY = (imgHeight - watermarkHeight) / 2;
      ctx.drawImage(
        watermark.image,
        0,
        0,
        watermarkWidth,
        watermarkHeight,
        watermarkStartX,
        watermarkStartY,
        watermarkWidth,
        watermarkHeight
      );
    } else {
      let watermarkStartX =
          watermark.placement[0] == "l"
            ? watermark.marginX
            : imgWidth - watermark.marginX - watermarkWidth,
        watermarkStartY =
          watermark.placement[1] == "t"
            ? watermark.marginY
            : imgHeight - watermark.marginY - watermarkHeight;
      ctx.drawImage(
        watermark.image,
        0,
        0,
        watermarkWidth,
        watermarkHeight,
        watermarkStartX,
        watermarkStartY,
        watermarkWidth,
        watermarkHeight
      );
    }
    ctx.globalAlpha = 1;
  }
  // export
  if (true) {
    let processResult: ProcessResult = await new Promise((resolve, reject) => {
      try {
        let imageObj: HTMLImageElement = document.createElement(
          "img"
        ) as HTMLImageElement;
        let error = false;
        imageObj.src = canvas!.toDataURL(
          formats[preset.formatExtension as keyof typeof formats]["mime"],
          preset.formatExtension != "png"
            ? (preset.imageQuality as number) / 100
            : "undefined"
        );
        imageObj.addEventListener("load", () => {
          resolve({
            img: imageObj,
            preset: preset,
            error: error,
          });
        });
        imageObj.addEventListener("error", async (e) => {
          let errMsgs = [" 由于浏览器限制, 转换失败 ", " 尝试限制图片尺寸 "];
          let errCanvas = document.createElement("canvas");
          let errCtx = errCanvas.getContext("2d");
          errCtx!.font = "56px sans-serif";
          errCtx!.textBaseline = "top";
          let metrics = errMsgs.map((m) => errCtx!.measureText(m));
          errCanvas.width = Math.max(...metrics.map((m) => m.width));
          errCanvas.height =
            (metrics[0].actualBoundingBoxAscent +
              metrics[0].actualBoundingBoxDescent) *
            metrics.length * 1.5;
          errCtx!.font = "56px sans-serif";
          errCtx!.textBaseline = "top";
          errCtx!.fillStyle = "#dc4446";
          errCtx?.fillRect(0, 0, errCanvas.width, errCanvas.height);

          errCtx!.fillStyle = "#fff";
          for (let i = 0; i < errMsgs.length; i++)
            errCtx!.fillText(
              errMsgs[i],
              (errCanvas.width - metrics[i].width) / 2,
              (errCanvas.height / errMsgs.length) * i
            );
          imageObj.src = errCanvas.toDataURL(
            formats[preset.formatExtension as keyof typeof formats]["mime"],
            preset.formatExtension != "png"
              ? (preset.imageQuality as number) / 100
              : "undefined"
          );
          releaseCanvas(errCanvas);
          error = true;
        });
      } catch (error) {
        reject(error);
      }
    });
    releaseCanvas(canvas);
    return processResult;
  } else {
    let processResult: ProcessResult = await new Promise((resolve, reject) => {
      resolve({
        img: document.createElement("img"),
        preset: preset,
        error: false,
      });
    });
    return processResult;
  }
};
export { process };
