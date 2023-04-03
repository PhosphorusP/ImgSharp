import { EditOutlined, ExpandOutlined } from "@ant-design/icons";
import { Affix, Tabs, theme } from "antd";
import React, { useState } from "react";
import Resize from "./Resize";
import Watermark from "./Watermark";

const { useToken } = theme;

type Props = {
  extras: any;
};

const Preset: React.FC<Props> = ({ extras }: Props) => {
  const { token } = useToken();
  const [tag, setTag] = useState("resize");
  return (
    <div
      id="imgsharp_desktop_preset"
      style={{
        padding: "0px",
        overflowY: "auto",
        flex: 1,
      }}
    >
      <Affix offsetTop={0.000001}>
        <Tabs
          activeKey={tag}
          onChange={setTag}
          size="large"
          items={[
            {
              label: (
                <span id="imgsharp_desktop_resize">
                  <ExpandOutlined />
                  调整
                </span>
              ),
              key: "resize",
            },
            {
              label: (
                <span id="imgsharp_desktop_watermark">
                  <EditOutlined />
                  水印
                </span>
              ),
              key: "watermark",
            },
          ]}
          tabBarStyle={{
            marginBottom: 0,
            padding: "0 4px 0 8px",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            boxShadow: `0 0 72px ${token.colorBgContainer} inset`,
            transitionDuration: ".25s",
            zIndex: 4,
          }}
          tabBarExtraContent={<>{extras}</>}
        />
      </Affix>
      <div>
        {
          {
            resize: <Resize />,
            watermark: <Watermark />,
          }[tag]
        }
      </div>
    </div>
  );
};
export default Preset;
