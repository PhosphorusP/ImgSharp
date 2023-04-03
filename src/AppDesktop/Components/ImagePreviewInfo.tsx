import {
  ArrowDownOutlined,
  ArrowRightOutlined,
  ArrowUpOutlined,
  CopyOutlined,
  ProfileFilled,
  ProfileOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  App,
  Button,
  Descriptions,
  Space,
  Table,
  Tag,
  theme,
  Typography,
} from "antd";
import { copyImageToClipboard } from "copy-image-clipboard";
import copy from "copy-to-clipboard";
import exifr from "exifr";
import saveAs from "file-saver";
import { filesize } from "filesize";
import React, { memo } from "react";
import { useSelector } from "react-redux";

const formatExtensions = { jpeg: "jpg", png: "png", webp: "webp" };

const { useToken } = theme;

type Props = {
  selectedImgPreview: Img;
};

const _ImagePreviewInfo: React.FC<Props> = ({ selectedImgPreview }: Props) => {
  const { message, modal } = App.useApp();
  const { token } = useToken();
  const operationsAvailable =
    selectedImgPreview &&
    selectedImgPreview.processedSize &&
    !selectedImgPreview.error &&
    !selectedImgPreview.busy;
  const isSafari =
    /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  return (
    <div
      style={{
        backgroundColor: token.colorBgContainer,
        boxShadow: token.boxShadowSecondary,
        borderTop: `1px solid ${token.colorBorderSecondary}`,
        transitionDuration: ".25s",
      }}
    >
      <div
        style={{
          padding: "8px",
          opacity: selectedImgPreview ? 1 : 0.5,
          userSelect: "text",
          WebkitUserSelect: "text",
        }}
      >
        <Descriptions layout="vertical" size="small" colon={false}>
          <Descriptions.Item
            label={
              <>
                文件名
                <Button
                  type="link"
                  icon={<CopyOutlined />}
                  disabled={!operationsAvailable}
                  size="small"
                  onClick={() => {
                    try {
                      copy(
                        selectedImgPreview
                          ? selectedImgPreview?.fileInfo?.name
                          : ("-" as any)
                      );
                      message.success("复制文件名成功");
                    } catch {
                      message.error("复制文件名失败");
                    }
                  }}
                />
              </>
            }
            contentStyle={{
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            <abbr
              style={{
                flex: 1,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
              title={
                selectedImgPreview ? selectedImgPreview?.fileInfo?.name : "-"
              }
            >
              <Typography.Text ellipsis>
                {selectedImgPreview ? selectedImgPreview?.fileInfo?.name : "-"}
              </Typography.Text>
            </abbr>
          </Descriptions.Item>
          <Descriptions.Item label="原始尺寸">
            {selectedImgPreview && selectedImgPreview?.rawDimensions
              ? selectedImgPreview.rawDimensions[0] +
                "×" +
                selectedImgPreview.rawDimensions[1]
              : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="原始大小">
            {selectedImgPreview
              ? "" + filesize(selectedImgPreview.rawSize)
              : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="操作">
            <Space id="imgsharp_desktop_image_operations">
              <abbr title="保存">
                <Button
                  type="text"
                  size="small"
                  icon={<SaveOutlined />}
                  disabled={!operationsAvailable}
                  onClick={() => {
                    try {
                      saveAs(
                        selectedImgPreview.processed!.src,
                        selectedImgPreview
                          .fileInfo!.name.split(".")
                          .slice(0, -1)
                          .join(".") +
                          "." +
                          (formatExtensions as any)[
                            selectedImgPreview!.preset!.formatExtension as any
                          ]
                      );
                      message.success("保存成功");
                    } catch {
                      message.error("保存失败");
                    }
                  }}
                />
              </abbr>
              <abbr
                title={
                  "复制到剪贴板" + (isSafari ? "（当前浏览器不支持）" : "")
                }
              >
                <Button
                  type="text"
                  size="small"
                  icon={<CopyOutlined />}
                  disabled={!operationsAvailable || isSafari}
                  onClick={() => {
                    try {
                      copyImageToClipboard(selectedImgPreview.processed!.src);
                      message.success("复制成功");
                    } catch {
                      message.error("复制失败");
                    }
                  }}
                />
              </abbr>
              <abbr title="查看EXIF信息">
                <Button
                  type="text"
                  size="small"
                  icon={<ProfileOutlined />}
                  disabled={!operationsAvailable}
                  onClick={async () => {
                    let exif = await exifr.parse(
                      selectedImgPreview.rawImageObj!.src
                    );
                    modal.info({
                      title: "EXIF信息",
                      okText: "关闭",
                      maskClosable: true,
                      icon: <ProfileFilled />,
                      content: exif ? (
                        <Table
                          size="small"
                          pagination={false}
                          scroll={{ y: "50vh" }}
                          columns={[
                            {
                              title: "键",
                              dataIndex: "key",
                            },
                            {
                              title: "值",
                              dataIndex: "value",
                            },
                          ]}
                          dataSource={Object.keys(exif).map((k) => ({
                            key: k,
                            value: exif[k],
                          }))}
                        />
                      ) : (
                        <Typography.Text type="secondary">
                          当前图片无EXIF信息。
                        </Typography.Text>
                      ),
                    });
                  }}
                />
              </abbr>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="导出规格">
            {selectedImgPreview &&
            selectedImgPreview?.processedDimensions &&
            !selectedImgPreview.error
              ? selectedImgPreview.processedDimensions[0] +
                "×" +
                selectedImgPreview.processedDimensions[1]
              : "-"}
            {selectedImgPreview &&
            selectedImgPreview?.preset &&
            !selectedImgPreview.error ? (
              <>
                <Typography.Text type="secondary" style={{ marginLeft: "4px" }}>
                  <ArrowRightOutlined />
                  {selectedImgPreview.preset.formatExtension.toUpperCase() +
                    (["jpeg", "webp"].indexOf(
                      selectedImgPreview.preset.formatExtension as string
                    ) >= 0
                      ? " @" +
                        (selectedImgPreview.preset.imageQuality as number) / 100
                      : "")}
                </Typography.Text>
              </>
            ) : undefined}
          </Descriptions.Item>
          <Descriptions.Item label="导出大小">
            {selectedImgPreview &&
            selectedImgPreview.processedSize &&
            !selectedImgPreview.error
              ? "" + filesize(selectedImgPreview.processedSize)
              : "-"}
            {selectedImgPreview &&
            selectedImgPreview.processedSize &&
            !selectedImgPreview.error ? (
              <>
                <Tag
                  color={
                    (selectedImgPreview.rawSize as number) <
                    (selectedImgPreview.processedSize as number)
                      ? "error"
                      : "processing"
                  }
                  style={{ marginLeft: "8px" }}
                >
                  {(selectedImgPreview.rawSize as number) <
                  (selectedImgPreview.processedSize as number) ? (
                    <ArrowUpOutlined />
                  ) : (
                    <ArrowDownOutlined />
                  )}
                  {Math.abs(
                    (((selectedImgPreview.rawSize as number) -
                      (selectedImgPreview.processedSize as number)) /
                      (selectedImgPreview.rawSize as number)) *
                      100
                  ).toFixed(2)}
                  %
                </Tag>
              </>
            ) : undefined}
          </Descriptions.Item>
        </Descriptions>
      </div>
    </div>
  );
};
const eq = (prevProps: any, nextProps: any) => {
  if (!prevProps.selectedImgPreview || !nextProps.selectedImgPreview)
    return false;
  if (prevProps.selectedImgPreview.hash != nextProps.selectedImgPreview.hash)
    return false;
  return true;
};
const _ImagePreviewInfoWrapper = memo(_ImagePreviewInfo, eq);
const ImagePreviewInfo: React.FC = () => {
  const imgs = useSelector((state: any) => state.reducer.imgs);
  const selectedImgIndex = useSelector(
    (state: any) => state.reducer.selectedImgIndex
  );
  return (
    <_ImagePreviewInfoWrapper selectedImgPreview={imgs[selectedImgIndex]} />
  );
};
export default ImagePreviewInfo;
