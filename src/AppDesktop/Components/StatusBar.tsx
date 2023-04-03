import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Button, Space, Tag, theme } from "antd";
import React, { memo } from "react";
import { useSelector } from "react-redux";
import { selectImg } from "../../store/action";
import PresetList from "../Panels/PresetList";
import ExportAll from "./ExportAll";
import ProcessAll from "./ProcessAll";

const { useToken } = theme;

type Props = {
  toImport: any;
  imgs: Array<any>;
  selectedImgIndex: number;
  extras: any;
};

const _StatusBar: React.FC<Props> = ({
  toImport,
  imgs,
  selectedImgIndex,
  extras,
}) => {
  const { token } = useToken();
  return (
    <div
      style={{
        height: "28px",
        borderTop: `1px solid ${token.colorBorderSecondary}`,
        padding: "8px",
        display: "flex",
        transitionDuration: ".25s",
      }}
    >
      <div style={{ flex: 1 }}>
        <Space size={token.marginXXS}>
          <abbr
            title="上一个"
            children={
              <Button
                type="text"
                disabled={selectedImgIndex <= 0}
                icon={<ArrowLeftOutlined />}
                onClick={() => {
                  selectImg(selectedImgIndex - 1);
                }}
              />
            }
          />
          <abbr
            title="下一个"
            children={
              <Button
                type="text"
                disabled={
                  selectedImgIndex == imgs.length - 1 || selectedImgIndex < 0
                }
                icon={<ArrowRightOutlined />}
                onClick={() => {
                  selectImg(selectedImgIndex + 1);
                }}
              />
            }
          />
          {selectedImgIndex > -1 && (
            <Tag color="default" style={{ marginLeft: "8px" }}>
              {selectedImgIndex + 1} / {imgs.length}
            </Tag>
          )}
          <abbr title="配置文件" children={<PresetList />} />
          {extras}
        </Space>
      </div>
      <Space>
        <ProcessAll disabled={toImport} />
        <ExportAll disabled={toImport} />
      </Space>
    </div>
  );
};
const eq = (prevProps: any, nextProps: any) => {
  if (prevProps.extras != nextProps.extras) return false;
  if (prevProps.toImport != nextProps.toImport) return false;
  if (prevProps.imgs.length != nextProps.imgs.length) return false;
  if (prevProps.selectedImgIndex != nextProps.selectedImgIndex) return false;
  return true;
};
const _StatusBarWrapper = memo(_StatusBar, eq);
type OuterProps = {
  extras: any;
};
const StatusBar: React.FC<OuterProps> = ({ extras }: OuterProps) => {
  const imgs = useSelector((state: any) => state.reducer.imgs);
  const toImport =
    imgs.length == 0 ? 1 : imgs.filter((i: Img) => !i.rawImageObj).length;
  const selectedImgIndex = useSelector(
    (state: any) => state.reducer.selectedImgIndex
  );
  return (
    <_StatusBarWrapper
      toImport={toImport}
      imgs={imgs}
      selectedImgIndex={selectedImgIndex}
      extras={extras}
    />
  );
};
export default StatusBar;
