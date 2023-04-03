import {
  SwapOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignMiddleOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";
import {
  Button,
  Divider,
  Form,
  InputNumber,
  Radio,
  Row,
  Slider,
  Space,
  Switch,
  Tooltip,
} from "antd";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { updatePreset } from "../../store/action";

const Resize: React.FC = () => {
  let [form] = Form.useForm();
  const preset = useSelector((state: any) => state.reducer.preset);
  useEffect(() => {
    form.setFieldsValue(preset);
  }, [preset]);
  return (
    <div style={{ padding: "8px" }}>
      <Form
        form={form}
        colon={false}
        onValuesChange={(e) => updatePreset(e)}
        initialValues={preset}
      >
        <Form.Item label="裁切图片" name="crop">
          <Switch checked={preset.crop} />
        </Form.Item>
        <Form.Item
          label="裁切比例"
          name="cropRatio"
          style={{ opacity: preset.crop ? undefined : 0.5 }}
        >
          <Radio.Group disabled={!preset.crop}>
            <Radio value="4_3">4:3</Radio>
            <Radio value="3_4">3:4</Radio>
            <Radio value="16_9">16:9</Radio>
            <Radio value="9_16">9:16</Radio>
            <Radio value="1_1">1:1</Radio>
            <Radio value="custom">自定</Radio>
          </Radio.Group>
        </Form.Item>
        {!(preset.cropRatio != "custom") && (
          <Form.Item
            label="自定比例"
            style={{ opacity: preset.crop ? undefined : 0.5 }}
          >
            <Space.Compact>
              <Form.Item noStyle name="cropRatioCustomX">
                <InputNumber
                  controls={false}
                  keyboard={false}
                  style={{ width: "48px", textAlign: "center" }}
                />
              </Form.Item>
              <Form.Item noStyle>
                <Tooltip title="交换宽高">
                  <Button
                    icon={<SwapOutlined />}
                    onClick={() => {
                      let x = preset.cropRatioCustomY;
                      let y = preset.cropRatioCustomX;
                      form.setFieldsValue({
                        cropRatioCustomX: x,
                        cropRatioCustomY: y,
                      });
                      updatePreset({
                        cropRatioCustomX: x,
                        cropRatioCustomY: y,
                      });
                    }}
                    style={{ zIndex: 1 }}
                  />
                </Tooltip>
              </Form.Item>
              <Form.Item noStyle name="cropRatioCustomY">
                <InputNumber
                  controls={false}
                  keyboard={false}
                  style={{ width: "48px", textAlign: "center" }}
                />
              </Form.Item>
            </Space.Compact>
          </Form.Item>
        )}
        <Form.Item
          label="溢出处理"
          style={{ opacity: preset.crop ? undefined : 0.5 }}
        >
          <Form.Item
            name="cropOriginHorizontal"
            style={{ display: "inline-block", marginRight: "8px" }}
          >
            <Radio.Group buttonStyle="solid" disabled={!preset.crop}>
              <Tooltip title="保留左侧">
                <Radio.Button value="left">
                  <VerticalAlignTopOutlined rotate={-90} />
                </Radio.Button>
              </Tooltip>
              <Tooltip title="水平居中">
                <Radio.Button value="center">
                  <VerticalAlignMiddleOutlined rotate={-90} />
                </Radio.Button>
              </Tooltip>
              <Tooltip title="保留右侧">
                <Radio.Button value="right">
                  <VerticalAlignBottomOutlined rotate={-90} />
                </Radio.Button>
              </Tooltip>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="cropOriginVertical"
            style={{ display: "inline-block" }}
          >
            <Radio.Group buttonStyle="solid" disabled={!preset.crop}>
              <Tooltip title="保留顶部">
                <Radio.Button value="top">
                  <VerticalAlignTopOutlined />
                </Radio.Button>
              </Tooltip>
              <Tooltip title="垂直居中">
                <Radio.Button value="center">
                  <VerticalAlignMiddleOutlined />
                </Radio.Button>
              </Tooltip>
              <Tooltip title="保留底部">
                <Radio.Button value="bottom">
                  <VerticalAlignBottomOutlined />
                </Radio.Button>
              </Tooltip>
            </Radio.Group>
          </Form.Item>
        </Form.Item>
        <Divider />
        <Form.Item label="缩放图片" name="scale">
          <Switch checked={preset.scale} />
        </Form.Item>
        <Form.Item
          label="缩放模式"
          name="scaleMethod"
          style={{ opacity: preset.scale ? undefined : 0.5 }}
        >
          <Radio.Group buttonStyle="solid" disabled={!preset.scale}>
            <Radio.Button value="width">宽度</Radio.Button>
            <Radio.Button value="height">高度</Radio.Button>
            <Radio.Button value="longer">长边</Radio.Button>
            <Radio.Button value="shorter">短边</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="限制尺寸"
          name="scaleSize"
          style={{ opacity: preset.scale ? undefined : 0.5 }}
        >
          <InputNumber
            keyboard={false}
            controls={false}
            style={{ width: "96px" }}
            addonAfter="像素"
            disabled={!preset.scale}
          />
        </Form.Item>
        <Divider />
        <Form.Item label="导出格式" name="formatExtension">
          <Radio.Group buttonStyle="solid">
            <Radio.Button value="jpeg">JPEG</Radio.Button>
            <Radio.Button value="png">PNG</Radio.Button>
            <Radio.Button
              value="webp"
              disabled={
                /Safari/.test(navigator.userAgent) &&
                !/Chrome/.test(navigator.userAgent)
              }
            >
              WebP
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="图像质量"
          extra={
            preset.formatExtension == "png" ? (
              <span style={{ marginLeft: "8px" }}>
                使用JPEG或WebP格式以自定图像质量。
              </span>
            ) : null
          }
        >
          <Row style={{ display: "flex", alignItems: "center" }}>
            <Form.Item style={{ margin: 0, flex: 1 }} name="imageQuality">
              <Slider
                min={10}
                max={100}
                step={5}
                tooltip={{
                  open: false,
                  placement: "bottom",
                  formatter: (value) => `${value} / 100`,
                }}
                disabled={preset.formatExtension == "png"}
              />
            </Form.Item>
            <Form.Item style={{ margin: 0 }} name="imageQuality">
              <InputNumber
                keyboard={false}
                bordered={false}
                controls={false}
                min={10}
                max={100}
                style={{ width: "40px" }}
                disabled={preset.formatExtension == "png"}
              />
            </Form.Item>
          </Row>
        </Form.Item>
        <Form.Item label="平滑质量" name="imageSmoothingQuality">
          <Radio.Group buttonStyle="solid">
            <Radio.Button value="low">低</Radio.Button>
            <Radio.Button value="medium">中</Radio.Button>
            <Radio.Button value="high">高</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Divider />
        <Form.Item label="清除元数据">
          <Switch checked disabled />
        </Form.Item>
        <Form.Item
          label="保留透明度"
          extra={
            preset.formatExtension == "jpeg" ? (
              <span>使用PNG或WebP格式以保留透明度。</span>
            ) : null
          }
          name="preserveAlpha"
        >
          <Switch
            checked={preset.preserveAlpha}
            disabled={preset.formatExtension == "jpeg"}
          />
        </Form.Item>
      </Form>
    </div>
  );
};
export default Resize;
