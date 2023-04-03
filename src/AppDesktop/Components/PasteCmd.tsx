import { SnippetsOutlined } from "@ant-design/icons";
import { App, Button, Modal, Typography } from "antd";
import { useState } from "react";
import { importFiles } from "../../store/action";

const PasteCmd: React.FC<any> = (props: any) => {
  const { message } = App.useApp();
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Button
        onClick={() => {
          setShowModal(true);
        }}
        icon={<SnippetsOutlined />}
        children="粘贴"
        {...props}
      />
      <Modal
        open={showModal}
        closable={false}
        onCancel={() => {
          setShowModal(false);
        }}
        destroyOnClose
        footer={null}
      >
        <div
          style={{ border: "none", outline: "none" }}
          contentEditable
          children={
            <>
              <Typography.Paragraph>在此处粘贴…</Typography.Paragraph>
              <Typography.Paragraph>
                如果此设备有实体键盘，可以直接按下
                <Typography.Text keyboard>Ctrl</Typography.Text>/
                <Typography.Text keyboard>Cmd</Typography.Text> +{" "}
                <Typography.Text keyboard>V</Typography.Text>
                粘贴。（无需打开此面板）
              </Typography.Paragraph>
            </>
          }
          onPaste={
            (async (e: ClipboardEvent) => {
              let fileCnt = e.clipboardData
                ? await importFiles(e.clipboardData.files)
                : 0;
              if (fileCnt) {
                message.success(`已导入${fileCnt}个文件`);
                setShowModal(false);
              } else message.error("剪贴板中没有可供导入的文件");
              e.preventDefault();
              e.stopPropagation();
            }) as any
          }
          onInput={(e: any) => {
            e.preventDefault();
          }}
        />
      </Modal>
    </>
  );
};
export default PasteCmd;
