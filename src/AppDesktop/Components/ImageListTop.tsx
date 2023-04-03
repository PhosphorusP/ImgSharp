import { CameraOutlined, ClearOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Button, Tabs, theme } from "antd";
import { memo, ReactElement } from "react";
import { useSelector } from "react-redux";
import { clearImgs, importImage } from "../../store/action";
import PasteCmd from "./PasteCmd";

const { useToken } = theme;

type Props = {
  toImport: any;
  imgs: Array<any>;
  extras: ReactElement;
};

type OuterProps = {
  extras: ReactElement;
};

const _ImageListTop: React.FC<Props> = ({ toImport, imgs, extras }: Props) => {
  const { token } = useToken();
  const { modal } = App.useApp();
  return (
    <Tabs
      activeKey="null"
      size="large"
      items={[
        {
          label: (
            <div style={{ display: "flex", alignItems: "center" }}>
              <span>
                <CameraOutlined />
                图片列表
              </span>
            </div>
          ),
          key: "imagelist",
        },
      ]}
      tabBarStyle={{
        marginBottom: 0,
        padding: "0 8px",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        boxShadow: `0 0 72px ${token.colorBgContainer} inset`,
        transitionDuration: ".25s",
        zIndex: 10,
      }}
      tabBarExtraContent={
        <>
          {extras}

          {imgs.length == 0 ? undefined : (
            <>
              <abbr title="清空图片列表">
                <Button
                  size="middle"
                  type="text"
                  icon={
                    <ClearOutlined
                      style={{
                        color:
                          imgs.length == 0 || toImport
                            ? token.colorTextDisabled
                            : token.colorError,
                      }}
                    />
                  }
                  disabled={toImport}
                  onClick={() => {
                    modal.confirm({
                      title: "确定清空图片列表？",
                      okType: "danger",
                      onOk: clearImgs,
                    });
                  }}
                />
              </abbr>
              <abbr title="粘贴图片">
                <PasteCmd size="middle" type="link" children={null} />
              </abbr>
              <abbr title="添加图片">
                <Button
                  size="middle"
                  type="text"
                  icon={<PlusOutlined style={{ color: token.colorPrimary }} />}
                  onClick={importImage}
                  style={{ marginRight: "-3px" }}
                />
              </abbr>
            </>
          )}
        </>
      }
    />
  );
};
const eq = (prevProps: any, nextProps: any) => {
  if (prevProps.extras != nextProps.extras) return false;
  if (prevProps.toImport != nextProps.toImport) return false;
  if (prevProps.imgs.length != nextProps.imgs.length) return false;
  return true;
};
const _ImageListTopWrapper = memo(_ImageListTop, eq);
const ImageListTop: React.FC<OuterProps> = ({ extras }: OuterProps) => {
  const imgs = useSelector((state: any) => state.reducer.imgs);
  const toImport = imgs.filter((i: Img) => !i.rawImageObj).length > 0;
  return (
    <_ImageListTopWrapper imgs={imgs} toImport={toImport} extras={extras} />
  );
};
export default ImageListTop;
