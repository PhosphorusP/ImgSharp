import { SettingOutlined, SyncOutlined } from "@ant-design/icons";
import { App, Button, Form, Popover, Radio, Space, Switch } from "antd";
import { CSSProperties, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { updateState } from "../../store/action";

const Settings: React.FC = () => {
  const { modal } = App.useApp();
  const storedSettings = useSelector((state: any) => state.reducer.settings);
  const [settings, setSettings] = useState({
    appMode: "desktop",
    simplifiedPreview: false,
  });
  const updateSettings = (values: any) => {
    localStorage.setItem("imgsharp_settings", JSON.stringify(values));
    setSettings(values);
  };
  useEffect(() => {
    if (localStorage.getItem("imgsharp_settings") == null) {
      localStorage.setItem("imgsharp_settings", JSON.stringify(settings));
    } else {
      let loadedSettings = JSON.parse(
        localStorage.getItem("imgsharp_settings") as unknown as string
      );
      setSettings(loadedSettings);
      updateState({
        settings: loadedSettings,
      });
    }
  }, []);
  let [form] = Form.useForm();
  const changeHandler = (changed: any, all: any) => {
    updateSettings(all);
    updateState({ settings: all });
  };
  const reloadApp = () => {
    modal.confirm({
      zIndex: 5000,
      title: "重新加载应用程序",
      content: "将清除缓存并重新联网加载应用程序。请确认文件已保存。",
      onOk: async () => {
        let cacheNames = await caches.keys();
        cacheNames.forEach(async (cacheName) => {
          await caches.delete(cacheName);
        });
        location.reload();
      },
    });
  };
  const restore = () => {
    modal.confirm({
      zIndex: 5000,
      title: "重置",
      content: "将清除所有配置文件和应用程序缓存，并还原所有设置。",
      okButtonProps: { danger: true },
      onOk: async () => {
        let cacheNames = await caches.keys();
        cacheNames.forEach(async (cacheName) => {
          await caches.delete(cacheName);
        });
        localStorage.removeItem("imgsharp_presetlist");
        localStorage.removeItem("imgsharp_settings");
        location.reload();
      },
    });
  };
  const formItemStyle: CSSProperties = { textAlign: "right" };
  return (
    <Popover
      placement="bottomRight"
      title="设置"
      content={
        <Form
          form={form}
          colon={false}
          onValuesChange={changeHandler}
          initialValues={settings}
        >
          <Form.Item label="应用模式" name="appMode" style={formItemStyle}>
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="desktop">桌面</Radio.Button>
              <Radio.Button value="mobile" disabled>
                移动
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="简化缩略图"
            name="simplifiedPreview"
            style={formItemStyle}
          >
            <Switch checked={storedSettings.simplifiedPreview} />
          </Form.Item>
          <Form.Item noStyle>
            <Space>
              <Button
                type="primary"
                icon={<SyncOutlined />}
                onClick={reloadApp}
              >
                重新加载应用程序
              </Button>
              <Button type="primary" danger onClick={restore}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      }
      children={<Button size="large" type="text" icon={<SettingOutlined />} />}
    />
  );
};

export default Settings;