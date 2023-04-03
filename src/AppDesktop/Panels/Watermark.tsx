import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useSelector } from "react-redux";
import { appendWatermark } from "../../store/action";
import WatermarkItem from "../Components/WatermarkItem";

const Watermark: React.FC = () => {
  const preset = useSelector((state: any) => state.reducer.preset);
  return (
    <>
      <div style={{ padding: "8px", overflowY: "auto" }}>
        {preset.watermarks.map((watermark: Watermark, index: number) => (
          <WatermarkItem
            watermark={watermark}
            index={index}
            key={watermark.id as React.Key}
          />
        ))}
        <div style={{ textAlign: "center" }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={appendWatermark}
          >
            添加水印
          </Button>
        </div>
      </div>
    </>
  );
};
export default Watermark;
