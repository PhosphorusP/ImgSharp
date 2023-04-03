import {
  CheckCircleOutlined,
  ContainerOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EllipsisOutlined,
  FolderOpenOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  App,
  Badge,
  Button,
  ConfigProvider,
  Input,
  InputRef,
  Modal,
  Popconfirm,
  Popover,
  Space,
  theme,
  Tooltip,
} from "antd";
import { cloneDeep } from "lodash-es";
import { useRef, useState } from "react";
import { usePresetList } from "../../hooks/usePresetList";

const { useToken } = theme;

const PresetList: React.FC = () => {
  const { token } = useToken();
  const { message } = App.useApp();
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renameItem, setRenameItem] = useState({
    name: "",
    id: "",
    default: false,
    preset: {},
  } as unknown as PresetListItem);
  const renameHandler = () => {
    renamePresetItem(renameItem.id, renameItem.name);
    setRenameModalOpen(false);
    message.success("重命名成功: " + renameItem.name);
  };
  const renameInputRef = useRef<InputRef>(null);
  const {
    preset,
    presetList,
    selected,
    setSelected,
    newPreset,
    updatePresetListItem,
    removePresetListItem,
    updatePresetListDefault,
    renamePresetItem,
    exportPreset,
    importPresets,
    updatePreset,
  } = usePresetList();

  return (
    <>
      <Popover
        arrow={false}
        placement="topLeft"
        children={
          <Button
            id="imgsharp_desktop_presetlistbutton"
            type="text"
            children={
              <>
                {(() => {
                  let pItem = presetList.find((p) => p.id == selected);
                  if (pItem && pItem.preset!.hash != preset.hash)
                    return (
                      <Badge
                        color="blue"
                        style={{ marginRight: token.marginXS }}
                      />
                    );
                  return undefined;
                })()}
                {presetList.find((p) => p.id == selected)?.name || ""}
              </>
            }
            icon={<ContainerOutlined />}
          />
        }
        overlayInnerStyle={{ padding: `${token.padding}px 0` }}
        content={
          <div
            style={{
              height: "calc(var(--app-height) * 0.4)",
              width: "224px",
              overflowY: "auto",
              overflowX: "hidden",
            }}
            onMouseMove={() => {}}
            onMouseEnter={() => {}}
            onMouseOut={() => {}}
          >
            {presetList.map((pItem, pIndex) => (
              <div
                key={pItem.id as any}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  cursor: "default",
                  backgroundColor:
                    pItem.id == selected ? token.colorPrimaryBg : undefined,
                  padding: `${token.paddingXS}px ${token.padding}px`,
                }}
                onClick={() => {
                  setSelected(pItem.id);
                  updatePreset(pItem.preset);
                }}
              >
                <div
                  style={{
                    flex: 1,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    margin: "4px 0",
                  }}
                >
                  {pItem.default ? (
                    <Tooltip title="默认配置文件">
                      <CheckCircleOutlined
                        style={{
                          color:
                            pItem.id == selected
                              ? token.colorPrimary
                              : token.colorTextDisabled,
                          marginRight: "4px",
                        }}
                      />
                    </Tooltip>
                  ) : undefined}
                  {pItem.name}
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  {pItem.id == selected &&
                  (pItem as any).preset.hash != preset.hash ? (
                    <Button
                      type="link"
                      size="small"
                      icon={<SaveOutlined />}
                      onClick={() =>
                        updatePresetListItem(pItem.id, {
                          preset,
                        })
                      }
                    />
                  ) : undefined}
                  <Popover
                    arrow={false}
                    placement="rightTop"
                    children={
                      <Button
                        type="link"
                        size="small"
                        icon={<EllipsisOutlined />}
                      />
                    }
                    content={
                      <ConfigProvider
                        theme={{
                          components: { Button: { borderRadius: 0 } },
                        }}
                      >
                        <Space direction="vertical" size={0}>
                          <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => {
                              setRenameItem(cloneDeep(pItem));
                              setRenameModalOpen(true);
                              setTimeout(
                                () =>
                                  renameInputRef.current!.focus({
                                    cursor: "all",
                                  }),
                                200
                              );
                            }}
                          >
                            重新命名
                          </Button>
                          <Button
                            type="text"
                            icon={<CheckCircleOutlined />}
                            onClick={() => updatePresetListDefault(pItem.id)}
                          >
                            设为默认
                          </Button>
                          <Button
                            type="text"
                            icon={<DownloadOutlined />}
                            style={{ color: token.colorPrimary }}
                            onClick={() => exportPreset(pItem)}
                          >
                            导出配置
                          </Button>
                          <Popconfirm
                            disabled={presetList.length == 1}
                            placement="right"
                            title="确定删除配置文件？"
                            onConfirm={() => {
                              removePresetListItem(pItem.id);
                            }}
                          >
                            <Button
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                              disabled={presetList.length == 1}
                            >
                              删除配置
                            </Button>
                          </Popconfirm>
                        </Space>
                      </ConfigProvider>
                    }
                    overlayInnerStyle={{ padding: 0, overflow: "hidden" }}
                  />
                </div>
              </div>
            ))}
          </div>
        }
        title={
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              padding: `0 ${token.padding}px`,
            }}
          >
            <div style={{ flex: 1 }}>配置文件</div>
            <div>
              <abbr title="导入配置文件">
                <Button
                  type="link"
                  size="small"
                  icon={<FolderOpenOutlined />}
                  onClick={() =>
                    importPresets(
                      (s: string) => message.success(s),
                      (s: string) => message.error(s)
                    )
                  }
                />
              </abbr>
              <abbr title="新建配置文件">
                <Button
                  type="link"
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={newPreset}
                />
              </abbr>
            </div>
          </div>
        }
      />
      <Modal
        forceRender
        maskClosable={false}
        title={"重新命名配置文件"}
        open={renameModalOpen}
        onOk={renameHandler}
        onCancel={() => setRenameModalOpen(false)}
        okButtonProps={{ disabled: !renameItem.name.length }}
        destroyOnClose
        width={320}
      >
        <Input
          ref={renameInputRef}
          onPressEnter={renameHandler}
          value={renameItem.name}
          onChange={(e) =>
            setRenameItem({ ...renameItem, name: e.target.value })
          }
        />
      </Modal>
    </>
  );
};
export default PresetList;
