import { saveAs } from "file-saver";
import { cloneDeep } from "lodash-es";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { updatePreset } from "../store/action";
import { getFiles } from "../utils/file";

const preset2storage = (item: PresetListItem): PresetListItem => {
  let _item = cloneDeep(item);
  for (let w of _item!.preset!.watermarks) {
    w.image = w.image.src;
  }
  return _item;
};

const storage2preset = async (
  item: PresetListItem
): Promise<PresetListItem> => {
  let _item = cloneDeep(item);
  let watermarks = await Promise.all(
    _item!.preset!.watermarks.map(async (w) => {
      return {
        ...w,
        image: await new Promise((res) => {
          let img = new Image();
          img.onload = () => {
            res(img);
          };
          img.src = w.image;
        }),
      };
    })
  );
  return { ..._item, preset: { ..._item.preset, watermarks } as any };
};

export function usePresetList() {
  const preset = useSelector((state: any) => state.reducer.preset);
  const [presetList, setPresetList] = useState([] as Array<PresetListItem>);
  const [selected, setSelected] = useState("");
  const updatePresetListStorage = async (
    presetListValue: Array<PresetListItem>
  ) => {
    setPresetList(cloneDeep(presetListValue));
    localStorage.setItem(
      "imgsharp_presetlist",
      JSON.stringify(cloneDeep(presetListValue).map(preset2storage))
    );
  };
  const newPreset = () => {
    let list = presetList!.slice();
    let id = nanoid();
    list!.push({
      id: id,
      name: "未命名 " + id.substring(0, 4),
      preset: cloneDeep(preset),
      default: false,
    });
    setSelected(id);
    updatePresetListStorage(list);
  };
  const updatePresetListItem = (id: string, assignments: any) => {
    let tmpPresetList = cloneDeep(presetList);
    let index = tmpPresetList.findIndex((p) => p.id == id);
    tmpPresetList[index] = {
      ...tmpPresetList[index],
      ...assignments,
    };
    updatePresetListStorage(tmpPresetList);
  };
  const removePresetListItem = (id: string) => {
    let tmpPresetList = cloneDeep(presetList);
    let index = tmpPresetList.findIndex((p) => p.id == id);
    tmpPresetList.splice(index, 1);
    if (!tmpPresetList.find((p) => p.default)) tmpPresetList[0].default = true;
    if (!tmpPresetList.find((p) => p.id == selected)) {
      setSelected(tmpPresetList[0].id);
      updatePreset(tmpPresetList[0].preset);
    }
    updatePresetListStorage(tmpPresetList);
  };
  const updatePresetListDefault = (id: string) => {
    let tmpPresetList = cloneDeep(presetList);
    for (let p of tmpPresetList) p.default = p.id == id;
    updatePresetListStorage(tmpPresetList);
  };
  const renamePresetItem = (id: string, name: string) => {
    updatePresetListItem(id, { name: name });
  };
  const exportPreset = (pItem: PresetListItem) => {
    let exported = {
      type: "preset",
      data: preset2storage(pItem),
    };
    exported.data.id = nanoid();
    saveAs(
      new Blob([JSON.stringify(exported)], {
        type: "application.json;charset=utf-8",
      }),
      exported.data.name + ".imgsharp.json"
    );
  };
  const importPresets = async (successApi?: Function, errorApi?: Function) => {
    let files = await getFiles("application/json", true);
    for (let i of files) {
      try {
        let presetStr: string = await new Promise((res) => {
          let reader = new FileReader();
          reader.readAsText(i, "UTF-8");
          reader.onload = (e) => res(e.target!.result as any);
        });
        let parsed = JSON.parse(presetStr);
        if (parsed.type == "preset") {
          let toImport = await storage2preset(parsed.data);
          let tmpPresetList = cloneDeep(presetList);
          updatePresetListStorage([...tmpPresetList, toImport]);
          if (successApi) successApi("导入成功: " + toImport.name);
        }
      } catch (e: any) {
        if (errorApi) errorApi("导入失败: " + i.name);
      }
    }
  };
  useEffect(() => {
    if (localStorage.getItem("imgsharp_presetlist") == null) {
      if (
        preset.watermarks.filter((w: Watermark) => {
          return !w.image;
        }).length == 0
      ) {
        let newPreset = {
          name: "未命名",
          id: nanoid(),
          preset: preset,
          default: true,
        };
        updatePresetListStorage([newPreset]);
        setSelected(newPreset.id);
        updatePreset(newPreset.preset);
      }
    } else
      (async () => {
        let res = await Promise.all(
          JSON.parse(localStorage.getItem("imgsharp_presetlist") as any).map(
            storage2preset
          )
        );
        let defaultPreset = res.find((p) => p.default);
        setPresetList(res);
        updatePreset(defaultPreset.preset);
        setSelected(defaultPreset.id);
      })();
  }, []);
  return {
    preset,
    presetList,
    setPresetList,
    selected,
    setSelected,
    updatePresetListStorage,
    newPreset,
    updatePresetListItem,
    removePresetListItem,
    updatePresetListDefault,
    renamePresetItem,
    exportPreset,
    importPresets,
    updatePreset,
  };
}
