import {
  BorderInnerOutlined,
  BuildOutlined,
  DeleteOutlined,
  RadiusBottomleftOutlined,
  RadiusBottomrightOutlined,
  RadiusUpleftOutlined,
  RadiusUprightOutlined,
  TableOutlined,
} from "@ant-design/icons";
import {
  Button,
  Collapse,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Slider,
  theme,
  Tooltip,
  Typography,
} from "antd";
import { Key, memo, useEffect } from "react";
import {
  removeWatermark,
  updateWatermark,
  updateWatermarkImage,
} from "../../store/action";
import { file2image, getFiles } from "../../utils/file";
import ImagePreviewPlate from "../Components/ImagePreviewPlate";

const { useToken } = theme;

type Props = {
  watermark: Watermark;
  index: number;
};

const _WatermarkItem: React.FC<Props> = ({ watermark, index }: Props) => {
  const { token } = useToken();
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue(watermark);
  }, [watermark]);
  return (
    <Collapse defaultActiveKey={[watermark.id as Key]} ghost>
      <Collapse.Panel
        key={watermark.id as Key}
        header={
          <>
            <Tooltip
              placement="right"
              color={token.colorPrimary}
              title={
                <div
                  style={{
                    backgroundColor: token.colorBgContainer,
                    borderRadius: token.borderRadiusOuter,
                  }}
                >
                  <ImagePreviewPlate>
                    <img
                      style={{
                        maxWidth: "160px",
                        maxHeight: "72px",
                        display: "block",
                        opacity: (watermark.opacity as number) / 100,
                      }}
                      src={watermark.image.src}
                      onLoad={() => {
                        if (!watermark.image.complete)
                          updateWatermark(watermark, index);
                      }}
                    />
                  </ImagePreviewPlate>
                </div>
              }
            >
              <Typography.Text strong children="水印 " />
              <Typography.Link children={`#${(index as number) + 1}`} />
            </Tooltip>
          </>
        }
        extra={
          <abbr title="删除">
            <Button
              type="text"
              danger
              size="small"
              onClick={() => {
                removeWatermark(index);
              }}
            >
              <DeleteOutlined />
            </Button>
          </abbr>
        }
      >
        <Form
          colon={false}
          key={watermark.id as Key}
          form={form}
          initialValues={watermark}
          onValuesChange={(changed, full) => {
            updateWatermark(full, index);
          }}
        >
          <Form.Item name="id" style={{ display: "none" }}>
            <Input />
          </Form.Item>
          <Form.Item label="水印预览" name="image">
            <>
              <div style={{ display: "flex", alignItems: "center" }}>
                <ImagePreviewPlate>
                  <img
                    style={{
                      maxWidth: "160px",
                      maxHeight: "72px",
                      display: "block",
                      opacity: (watermark.opacity as number) / 100,
                    }}
                    src={watermark.image.src}
                    onLoad={() => {
                      if (!watermark.image.complete)
                        updateWatermark(watermark, index);
                    }}
                  />
                </ImagePreviewPlate>
                <div
                  style={{
                    marginLeft: "8px",
                    whiteSpace: "nowrap",
                    wordBreak: "keep-all",
                  }}
                >
                  <Typography.Text type="secondary">
                    @ {watermark.image.width}×{watermark.image.height}
                  </Typography.Text>
                </div>
              </div>
              <div style={{ marginTop: "8px" }}>
                <Button
                  onClick={async () => {
                    let img = await file2image(
                      (
                        await getFiles("image/jpeg, image/png, image/webp", false)
                      )[0]
                    );
                    updateWatermarkImage(img, index);
                  }}
                >
                  更换…
                </Button>
              </div>
            </>
          </Form.Item>
          <Form.Item label="水印布局" name="placement">
            <Radio.Group buttonStyle="solid">
              <Tooltip title="左上角">
                <Radio.Button value="lt">
                  <RadiusUpleftOutlined />
                </Radio.Button>
              </Tooltip>
              <Tooltip title="右上角">
                <Radio.Button value="rt">
                  <RadiusUprightOutlined />
                </Radio.Button>
              </Tooltip>
              <Tooltip title="左下角">
                <Radio.Button value="lb">
                  <RadiusBottomleftOutlined />
                </Radio.Button>
              </Tooltip>
              <Tooltip title="右下角">
                <Radio.Button value="rb">
                  <RadiusBottomrightOutlined />
                </Radio.Button>
              </Tooltip>
              <Tooltip title="居中">
                <Radio.Button value="center">
                  <BorderInnerOutlined />
                </Radio.Button>
              </Tooltip>
              <Tooltip title="纹理">
                <Radio.Button value="pattern">
                  <TableOutlined />
                </Radio.Button>
              </Tooltip>
              <Tooltip title="重复">
                <Radio.Button value="repeat">
                  <BuildOutlined />
                </Radio.Button>
              </Tooltip>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="不透明度" name="opacity">
            <Row style={{ display: "flex", alignItems: "center" }}>
              <Form.Item style={{ margin: 0, flex: 1 }} name="opacity">
                <Slider
                  min={1}
                  max={100}
                  step={1}
                  tooltip={{
                    open: false,
                    placement: "bottom",
                  }}
                />
              </Form.Item>
              <Form.Item style={{ margin: 0 }} name="opacity">
                <InputNumber
                  keyboard={false}
                  bordered={false}
                  controls={false}
                  min={0}
                  max={100}
                  style={{ width: "40px" }}
                />
              </Form.Item>
            </Row>
          </Form.Item>
          <Form.Item
            label="水印边距"
            style={{
              opacity: watermark.placement == "center" ? "0.5" : undefined,
            }}
          >
            <Form.Item name="marginX" noStyle>
              <InputNumber
                keyboard={false}
                controls={false}
                addonAfter="像素"
                disabled={watermark.placement == "center"}
                style={{ width: "80px", marginRight: "8px" }}
              />
            </Form.Item>
            <Form.Item name="marginY" noStyle>
              <InputNumber
                keyboard={false}
                controls={false}
                addonAfter="像素"
                disabled={watermark.placement == "center"}
                style={{ width: "80px" }}
              />
            </Form.Item>
          </Form.Item>
        </Form>
      </Collapse.Panel>
    </Collapse>
  );
};
const WatermarkItem = memo(_WatermarkItem);
export default WatermarkItem;
