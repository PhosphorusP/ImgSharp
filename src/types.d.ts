type Preset = {
  crop: Boolean;
  cropRatio: "4_3" | "3_4" | "16_9" | "9_16" | "1_1" | "custom";
  cropRatioCustomX: Number;
  cropRatioCustomY: Number;
  cropOriginHorizontal: "left" | "center" | "right";
  cropOriginVertical: "top" | "center" | "bottom";
  scale: Boolean;
  scaleMethod: "width" | "height" | "longer" | "shorter";
  scaleSize: Number;
  watermarks: Array<any>;
  formatExtension: String;
  imageQuality: Number;
  preserveAlpha: Boolean;
  imageSmoothingQuality: "low" | "medium" | "high";
  hash: String;
};
type Watermark = {
  marginX: Number;
  marginY: Number;
  opacity: Number;
  placement: "lt" | "lb" | "rt" | "rb" | "center" | "pattern" | "repeat";
  image: HTMLImageElement;
  id: String;
};
type Img = {
  id: string;
  fileInfo: {
    name: string;
    lastModified: number;
  } | null;
  raw: File | null;
  rawImageObj: HTMLImageElement | null;
  rawDimensions: Array<number> | null;
  rawSize: Number | null;
  thumb: HTMLImageElement | null;
  processed: HTMLImageElement | null;
  processedDimensions: Array<Number> | null;
  processedSize: Number | null;
  preset: Preset | null;
  needUpdate: Boolean;
  hash: String;
  busy: Boolean;
  error: Boolean;
  renamed: Boolean;
};
type ProcessResult = {
  img: HTMLImageElement;
  preset: Preset;
  error: boolean;
};

interface PresetListItem {
  id: string;
  name: string;
  preset?: Preset;
  default: Boolean;
}

declare module "nodupes";

declare module "local-forage-hooks";
