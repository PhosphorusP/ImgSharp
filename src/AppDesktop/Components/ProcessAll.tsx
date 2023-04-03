import { DoubleRightOutlined } from "@ant-design/icons";
import {
  App,
  Badge,
  Button,
  Divider,
  Modal,
  Progress,
  Space,
  Tooltip,
} from "antd";
import { useProcessAll } from "../../hooks/useProcessAll";

const ProcessAll = (props: any) => {
  const { message } = App.useApp();
  const {
    cancel,
    progress,
    percent,
    processedPercent,
    modalOpen,
    startProcessAll,
  } = useProcessAll();
  return (
    <>
      <Tooltip
        color="blue"
        title={
          <div style={{ textAlign: "center" }}>
            预处理所有图片以加速预览
            <br />
            <span style={{ opacity: 0.5 }}>全部导出不需要预处理</span>
          </div>
        }
      >
        <Button
          id="imgsharp_desktop_processall"
          type="dashed"
          icon={<DoubleRightOutlined />}
          onClick={() =>
            startProcessAll((proc) =>
              proc.canceled
                ? message.info("已取消")
                : message.success(
                    `${proc.count}个文件处理完成，共耗时${proc.duration}秒`
                  )
            )
          }
          {...props}
        >
          预处理
        </Button>
      </Tooltip>
      <Modal
        title="处理中"
        closable={false}
        open={modalOpen}
        width={320}
        footer={cancel ? <Button onClick={cancel.func}>取消</Button> : null}
        zIndex={2000}
      >
        <Progress
          percent={percent}
          success={{ percent: processedPercent }}
          showInfo={false}
          status="active"
        />
        <Space>
          <Badge status="success" text="已缓存" />
          <Badge color="blue" text="已处理" />
          <Badge status="default" text="队列中" />
        </Space>
        <Divider />
        <div>
          {progress.progress + progress.processed} / {progress.size}
        </div>
        <div
          style={{
            whiteSpace: "nowrap",
            wordBreak: "keep-all",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {progress.current}
        </div>
      </Modal>
    </>
  );
};
export default ProcessAll;
