import { nanoid } from "nanoid";
import { combineReducers } from "redux";
import { getDefaultWatermark } from "../utils/file";
const initialState = {
  darkMode: false,
  toImport: 0,
  preset: {
    crop: true,
    cropRatio: "4_3",
    cropRatioCustomX: 2.35,
    cropRatioCustomY: 1,
    cropOriginHorizontal: "center",
    cropOriginVertical: "center",
    scale: true,
    scaleMethod: "longer",
    scaleSize: 1200,
    watermarks: [getDefaultWatermark()],
    formatExtension: "jpeg",
    imageQuality: 85,
    preserveAlpha: false,
    imageSmoothingQuality: "medium",
    hash: nanoid(),
  },
  imgs: [],
  selectedImg: "",
  selectedImgIndex: -1,
  settings: {
    appMode: "desktop",
    simplifiedPreview: false,
  },
};
const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "updateState":
      return {
        ...state,
        ...action.assignments,
      };
    case "updatePreset":
      return {
        ...state,
        preset: action.preset,
      };
    case "updateImgs":
      return {
        ...state,
        imgs: action.imgs,
      };
    case "selectImg":
      return {
        ...state,
        selectedImg:
          action.index >= 0 ? (state.imgs[action.index] as Img).id : null,
        selectedImgIndex: action.index,
      };
    default:
      return state;
  }
};
export default combineReducers({ reducer });
