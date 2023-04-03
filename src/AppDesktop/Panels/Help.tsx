import {
  AppstoreAddOutlined,
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ArrowUpOutlined,
  BorderOuterOutlined,
  BuildOutlined,
  CheckCircleOutlined,
  ChromeFilled,
  ContainerOutlined,
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EllipsisOutlined,
  ExclamationCircleOutlined,
  ExpandOutlined,
  EyeOutlined,
  FileImageOutlined,
  FolderOpenOutlined,
  PlusOutlined,
  ProfileOutlined,
  QuestionCircleOutlined,
  SaveOutlined,
  SnippetsOutlined,
  TableOutlined,
} from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Col,
  Popover,
  Row,
  theme,
  Tour,
  TourProps,
} from "antd";
import { nanoid } from "nanoid";
import { CSSProperties, ReactNode, useState } from "react";

import imageDragAndDrop from "../../assets/help/desktop/image-drag-and-drop.webp";
import ImageOpenWith from "../../assets/help/desktop/image-open-with.webp";
import imageSelect from "../../assets/help/desktop/image-select.webp";
import PWAInstall from "../../assets/help/desktop/pwa-install.webp";
import WatermarkFullscreen from "../../assets/help/desktop/watermark-fullscreen.webp";

const { useToken } = theme;

type HelpItemProps = {
  icon: ReactNode;
  name: ReactNode;
  helpAvailable: boolean;
  setHelpAvailable: Function;
  setTourOpen: Function;
  setTourSteps: Function;
  setTourCurrent: Function;
  tourSteps: TourProps["steps"];
};

const HelpItem: React.FC<HelpItemProps> = ({
  icon,
  name,
  helpAvailable,
  setHelpAvailable,
  setTourOpen,
  setTourCurrent,
  tourSteps,
  setTourSteps,
}: HelpItemProps) => {
  const { token } = useToken();
  const { message } = App.useApp();
  return (
    <>
      <Col span={8}>
        <Card
          hoverable
          size="small"
          bordered={false}
          bodyStyle={{ padding: token.paddingSM }}
          onClick={() => {
            if (!helpAvailable) {
              message.info("请先结束当前教程");
              return;
            }
            setHelpAvailable(false);
            setTourCurrent(0);
            setTourSteps(tourSteps);
            setTourOpen(true);
          }}
        >
          <div
            style={{
              color: token.colorPrimary,
              fontSize: "18px",
              lineHeight: 0,
            }}
          >
            {icon}
          </div>
          <div style={{ marginTop: token.margin, fontSize: token.fontSizeSM }}>
            {name}
          </div>
        </Card>
      </Col>
    </>
  );
};

let iconHintStyle: CSSProperties = {
  margin: "0 4px",
  fontWeight: "bold",
};

let imagesHorizontalStyle: CSSProperties = {
  display: "flex",
  flexDirection: "row",
};

let imageStyle: CSSProperties = { maxHeight: "25vh", objectFit: "contain" };

const helpItems = [
  {
    id: nanoid(),
    icon: <PlusOutlined />,
    name: "导入图片",
    zIndex: 2000,
    tourSteps: [
      {
        title: "导入图片：浏览器导入",
        type: "primary",
        description: (
          <>
            在图片列表中点击
            <span style={iconHintStyle}>
              <PlusOutlined />
              选取
            </span>
            或
            <span style={iconHintStyle}>
              <SnippetsOutlined />
              粘贴
            </span>
            ，可以分别通过本地文件选择器和剪贴板导入图片。
          </>
        ),
        placement: "right",
        target: () =>
          document.getElementById("imgsharp_desktop_imagelist") as any,
      },
      {
        title: "导入图片：拖拽导入",
        type: "primary",
        description: (
          <>在其他软件中选择图片文件，直接拖入窗口内并松开鼠标即可导入。</>
        ),
        cover: (
          <div style={imagesHorizontalStyle}>
            <img src={imageSelect} style={imageStyle} />
            <img src={imageDragAndDrop} style={imageStyle} />
          </div>
        ),
        placement: "right",
        target: () =>
          document.getElementById("imgsharp_desktop_imagelist") as any,
      },
      {
        title: "导入图片：文件打开方式（PWA）",
        type: "primary",
        description: (
          <>
            在系统文件管理器中直接使用 ImgSharp# 打开图片文件。
            <b>（需要安装PWA）</b>
          </>
        ),
        cover: (
          <div style={imagesHorizontalStyle}>
            <img src={ImageOpenWith} style={imageStyle} />
          </div>
        ),
        placement: "right",
        target: () =>
          document.getElementById("imgsharp_desktop_imagelist") as any,
      },
    ],
  },
  {
    id: nanoid(),
    icon: <ContainerOutlined />,
    name: "使用配置文件",
    tourSteps: [
      {
        title: "打开配置文件列表",
        type: "primary",
        description: (
          <>
            鼠标悬浮
            <span style={iconHintStyle}>
              <ContainerOutlined />
            </span>
            图标即可打开配置文件列表。
          </>
        ),
        placement: "topRight",
        target: () =>
          document.getElementById("imgsharp_desktop_presetlistbutton") as any,
      },
      {
        title: "切换配置文件",
        type: "primary",
        description: <>在列表中点击配置文件，即可切换并即时查看效果。</>,
        mask: false,
      },
      {
        title: "新建配置文件",
        type: "primary",
        description: (
          <>
            点击
            <span style={iconHintStyle}>
              <PlusOutlined />
            </span>
            图标，将以当前配置文件为基础新建一个配置文件。
          </>
        ),
        mask: false,
      },
      {
        title: "导入配置文件",
        type: "primary",
        description: (
          <>
            点击
            <span style={iconHintStyle}>
              <FolderOpenOutlined />
            </span>
            图标即可从本地文件选择器导入配置文件。
          </>
        ),
        mask: false,
      },
      {
        title: "默认配置文件",
        type: "primary",
        description: (
          <>
            配置文件列表中，带有
            <span style={iconHintStyle}>
              <CheckCircleOutlined />
            </span>
            图标的是默认配置文件。ImgSharp# 在启动时，会自动切换到默认配置文件。管理配置文件时，可以将所需的配置文件设为默认。
          </>
        ),
        mask: false,
      },
      {
        title: "导出/管理配置文件",
        type: "primary",
        description: (
          <>
            鼠标悬浮配置文件右侧的
            <span style={iconHintStyle}>
              <EllipsisOutlined />
            </span>
            图标以打开菜单。可以对配置文件进行
            <span style={iconHintStyle}>
              <EditOutlined />
              重新命名
            </span>
            、
            <span style={iconHintStyle}>
              <CheckCircleOutlined />
              设为默认
            </span>
            、
            <span style={iconHintStyle}>
              <DownloadOutlined />
              导出
            </span>
            和
            <span style={iconHintStyle}>
              <DeleteOutlined />
              删除
            </span>
            操作。
          </>
        ),
        mask: false,
      },
    ],
  },
  {
    id: nanoid(),
    icon: <AppstoreAddOutlined />,
    name: "安装为PWA",
    tourSteps: [
      {
        title: "安装为PWA（渐进式Web应用）",
        type: "primary",
        description: (
          <>
            点击浏览器地址栏的安装图标以安装PWA。（建议使用高版本
            <span style={iconHintStyle}>
              <ChromeFilled />
              Google Chrome
            </span>
            浏览器）
          </>
        ),
        cover: (
          <div style={imagesHorizontalStyle}>
            <img src={PWAInstall} style={imageStyle} />
          </div>
        ),
        placement: "top",
      },
    ],
  },
  {
    id: nanoid(),
    icon: <ExpandOutlined />,
    name: "调整图片大小",
    tourSteps: [
      {
        title: "裁切图片",
        type: "primary",
        description: (
          <>
            可以统一图片的比例。
            <br />
            调整溢出处理设置，可以保留图片中需要的部分。
          </>
        ),
        placement: "left",
        target: () => {
          document.getElementById("imgsharp_desktop_resize")!.click();
          return document.getElementById("imgsharp_desktop_preset");
        },
      },
      {
        title: "缩放图片",
        type: "primary",
        description: (
          <>
            控制图片的大小。
            <br />
            注意：不同浏览器对导出图片的大小有不同的限制，不缩放图片可能导致图片导出失败。
          </>
        ),
        placement: "left",
        target: () => {
          document.getElementById("imgsharp_desktop_resize")!.click();
          return document.getElementById("imgsharp_desktop_preset");
        },
      },
      {
        title: "导出选项",
        type: "primary",
        description: (
          <>
            调整导出图片的格式和质量。
            <br />
            部分浏览器可能不支持以WebP格式导出图片。
            <br />
            部分浏览器中图片缩小程度较大时，将平滑质量设置为“中”可能会得到更清晰的结果。
          </>
        ),
        placement: "left",
        target: () => {
          document.getElementById("imgsharp_desktop_resize")!.click();
          return document.getElementById("imgsharp_desktop_preset");
        },
      },
    ],
  },
  {
    id: nanoid(),
    icon: <EditOutlined />,
    name: "使用水印",
    tourSteps: [
      {
        title: "水印面板",
        type: "primary",
        description: <>可以在水印面板中添加、调整并实时预览水印。</>,
        placement: "left",
        target: () => {
          document.getElementById("imgsharp_desktop_watermark")!.click();
          return document.getElementById("imgsharp_desktop_preset");
        },
      },
      {
        title: "全屏水印",
        type: "primary",
        description: (
          <>
            ImgSharp#提供
            <span style={iconHintStyle}>
              <TableOutlined />
              平铺
            </span>
            和
            <span style={iconHintStyle}>
              <BuildOutlined />
              重复
            </span>
            两种全屏水印，可以根据使用场景按需选择。
          </>
        ),
        cover: (
          <div style={imagesHorizontalStyle}>
            <img style={imageStyle} src={WatermarkFullscreen} />
          </div>
        ),
        placement: "left",
        target: () => {
          document.getElementById("imgsharp_desktop_watermark")!.click();
          return document.getElementById("imgsharp_desktop_preset");
        },
      },
    ],
  },
  {
    id: nanoid(),
    icon: <BorderOuterOutlined />,
    name: "调整用户界面",
    tourSteps: [
      {
        title: "调整面板大小",
        type: "primary",
        description: (
          <>
            点击
            <span style={iconHintStyle}>
              <BorderOuterOutlined />
              进入布局调整模式
            </span>
            ，拖动手柄调整各面板大小。
            <br />
            也可以直接拖动面板边缘调整大小。
          </>
        ),
        placement: "topRight",
        target: () => {
          return document.getElementById("imgsharp_desktop_ui");
        },
      },
    ],
  },
  {
    id: nanoid(),
    icon: <EyeOutlined />,
    name: "浏览图片",
    tourSteps: [
      {
        title: "放大查看图片",
        type: "primary",
        description: <>点击图片，即可放大查看。</>,
        placement: "bottom",
        target: () => {
          return document.getElementById("imgsharp_desktop_preview");
        },
      },
      {
        title: "使用键盘导航",
        type: "primary",
        description: (
          <>
            按下键盘上的
            <span style={iconHintStyle}>
              <ArrowUpOutlined />
            </span>
            <span style={iconHintStyle}>
              <ArrowDownOutlined />
            </span>
            、
            <span style={iconHintStyle}>
              <ArrowLeftOutlined />
            </span>
            <span style={iconHintStyle}>
              <ArrowRightOutlined />
            </span>
            键，可以在图片之间快速切换。
          </>
        ),
      },
      {
        title: "使用滚动导航",
        type: "primary",
        description: (
          <>在预览区域内使用鼠标或触控板滚动，可以在图片之间快速切换。</>
        ),
        placement: "bottom",
        target: () => {
          return document.getElementById("imgsharp_desktop_preview");
        },
      },
    ],
  },
  {
    id: nanoid(),
    icon: <FileImageOutlined />,
    name: "处理图片",
    tourSteps: [
      {
        title: "图片操作",
        type: "primary",
        description: (
          <>
            可以对当前图片进行
            <span style={iconHintStyle}>
              <SaveOutlined />
              保存
            </span>
            、
            <span style={iconHintStyle}>
              <CopyOutlined />
              复制到剪贴板
            </span>
            （部分浏览器不支持）和
            <span style={iconHintStyle}>
              <ProfileOutlined />
              查看EXIF信息
            </span>
            操作。
          </>
        ),
        placement: "top",
        target: () => {
          return document.getElementById("imgsharp_desktop_image_operations");
        },
      },
      {
        title: "预处理",
        type: "primary",
        description: <>预处理全部图片可以加速图片预览和导出的速度。</>,
        placement: "topLeft",
        target: () => {
          return document.getElementById("imgsharp_desktop_processall");
        },
      },
      {
        title: "全部导出",
        type: "primary",
        description: <>一切就绪后，将全部图片导出（可选择打包为zip）。</>,
        placement: "topLeft",
        target: () => {
          return document.getElementById("imgsharp_desktop_exportall");
        },
      },
    ],
  },
  {
    id: nanoid(),
    icon: <ExclamationCircleOutlined />,
    name: "已知问题",
    tourSteps: [
      {
        title: "已知问题",
        type: "primary",
        description: (
          <>
            <ul>
              <li>Firefox浏览器不支持从剪贴板粘贴文件。</li>
              <li>
                Google Chrome浏览器中，平滑质量设置为“高”可能会产生更多锯齿。
              </li>
              <li>Safari浏览器不支持将图片导出为WebP格式。</li>
              <li>Safari浏览器不支持将图片导出为多个文件。</li>
              <li>Safari浏览器不支持复制当前图片到剪贴板。</li>
            </ul>
          </>
        ),
        placement: "top",
      },
    ],
  },
];

helpItems.map((i) => {
  (i.tourSteps.at(-1) as any).nextButtonProps = { children: "完成" };
});

const Help: React.FC = () => {
  const { token } = useToken();
  let [helpAvailable, setHelpAvailable] = useState(true);
  const [tourOpen, setTourOpen] = useState<boolean>(false);
  let [tourSteps, setTourSteps] = useState<TourProps["steps"]>([]);
  let [tourCurrent, setTourCurrent] = useState<number>(0);
  return (
    <>
      <Popover
        overlayInnerStyle={{ width: "320px", padding: token.paddingSM }}
        children={
          <abbr
            title="帮助"
            children={
              <Button
                size="large"
                type="text"
                icon={
                  <QuestionCircleOutlined
                    style={{
                      color: token.colorWarning,
                    }}
                  />
                }
              />
            }
          />
        }
        content={
          <Row gutter={[token.paddingSM, token.paddingSM]}>
            {helpItems.map((i) => (
              <HelpItem
                key={i.id}
                icon={i.icon}
                name={i.name}
                helpAvailable={helpAvailable}
                setHelpAvailable={setHelpAvailable}
                setTourOpen={setTourOpen}
                tourSteps={i.tourSteps as any}
                setTourSteps={setTourSteps}
                setTourCurrent={setTourCurrent}
              />
            ))}
          </Row>
        }
      />
      <Tour
        open={tourOpen}
        current={tourCurrent}
        onChange={setTourCurrent}
        onClose={() => {
          setTourOpen(false);
          setHelpAvailable(true);
        }}
        steps={tourSteps}
      />
    </>
  );
};
export default Help;
