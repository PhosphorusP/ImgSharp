import {
  FileImageOutlined,
  FileZipOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Badge,
  Button,
  Card,
  Divider,
  Drawer,
  Progress,
  Result,
  Space,
  theme,
  Typography,
} from "antd";
import { useSelector } from "react-redux";
import { useExportAll } from "../../hooks/useExportAll";

const { useToken } = theme;

const ExportAll: React.FC<any> = (props: any) => {
  const simplifiedPreview = useSelector(
    (state: any) => state.reducer.settings.simplifiedPreview
  );
  const { token } = useToken();
  const {
    openExportDrawer,
    setOpenExportDrawer,
    openProgressDrawer,
    setOpenProgressDrawer,
    cancel,
    canceled,
    progress,
    percent,
    processedPercent,
    zip,
    imgsStored,
    imgs,
    onOpenExportDrawer,
    onExport,
    onClose,
    isSafari,
  } = useExportAll();
  return (
    <>
      <Button
        id="imgsharp_desktop_exportall"
        type="primary"
        onClick={onOpenExportDrawer}
        icon={<SaveOutlined />}
        {...props}
      >
        全部导出
      </Button>
      <Drawer
        width={400}
        onClose={() => {
          setOpenExportDrawer(false);
        }}
        open={openExportDrawer}
        title="全部导出"
        destroyOnClose
        bodyStyle={{
          overflowX: "hidden",
        }}
      >
        {imgs.filter((i) => i.error).length ? (
          <Alert
            type="error"
            showIcon
            message={`${imgs.filter((i) => i.error).length} 个文件处理失败。`}
            description="请检查图片尺寸，以防止导出错误。"
            style={{ marginBottom: token.marginSM }}
          />
        ) : undefined}

        {imgs.filter(
          (i) => i.rawSize && i.processedSize && i.rawSize < i.processedSize
        ).length ? (
          <Alert
            type="warning"
            showIcon
            message={`${
              imgs.filter(
                (i) =>
                  i.rawSize && i.processedSize && i.rawSize < i.processedSize
              ).length
            } 个文件在预处理中体积增加。`}
            description="请检查导出设置。"
            style={{ marginBottom: token.marginSM }}
          />
        ) : undefined}
        <Card
          title="文件列表"
          bodyStyle={{
            maxHeight: "30vh",
            overflowY: "scroll",
            overflowX: "hidden",
            padding: "8px 16px",
          }}
        >
          {imgs.map((img: Img) => (
            <abbr
              title={img.fileInfo!.name}
              style={{ textDecoration: "none" }}
              key={img.id}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  height: "28px",
                  overflowX: "hidden",
                }}
              >
                <div
                  style={{
                    boxSizing: "border-box",
                    width: "28px",
                    height: "28px",
                    overflow: "visible",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 4px",
                  }}
                >
                  {simplifiedPreview ? (
                    <div
                      style={{
                        boxSizing: "border-box",
                        width: "28px",
                        height: "28px",
                        backgroundImage: `url(${img.thumb!.src})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center center",
                      }}
                    />
                  ) : (
                    <img
                      style={{
                        boxSizing: "border-box",
                        maxWidth: "28px",
                        maxHeight: "28px",
                      }}
                      src={img.thumb!.src}
                    />
                  )}
                </div>
                {img.error ? (
                  <Badge color="red" style={{ marginRight: "4px" }} />
                ) : undefined}
                {img.rawSize &&
                img.processedSize &&
                img.rawSize < img.processedSize ? (
                  <Badge color="yellow" style={{ marginRight: "4px" }} />
                ) : undefined}
                {img.renamed ? (
                  <Badge color="blue" style={{ marginRight: "4px" }} />
                ) : undefined}
                <div
                  style={{
                    flex: 1,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    color: img.error ? token.colorError : undefined,
                  }}
                >
                  {img.fileInfo!.name}
                </div>
              </div>
            </abbr>
          ))}
        </Card>
        <div style={{ marginTop: "16px", display: "flex" }}>
          {imgs.filter((img: Img) => img.error).length ? (
            <Badge
              style={{ marginRight: token.marginXS }}
              color="red"
              text={
                <>
                  处理失败
                  <Typography.Text type="secondary">
                    ({imgs.filter((img: Img) => img.error).length})
                  </Typography.Text>
                </>
              }
            />
          ) : undefined}

          {imgs.filter(
            (img: Img) =>
              img.rawSize &&
              img.processedSize &&
              img.rawSize < img.processedSize
          ).length ? (
            <Badge
              style={{ marginRight: token.marginXS }}
              color="yellow"
              text={
                <>
                  体积增加
                  <Typography.Text type="secondary">
                    (
                    {
                      imgs.filter(
                        (img: Img) =>
                          img.rawSize &&
                          img.processedSize &&
                          img.rawSize < img.processedSize
                      ).length
                    }
                    )
                  </Typography.Text>
                </>
              }
            />
          ) : undefined}
          {imgs.filter((img: Img) => img.renamed).length ? (
            <Badge
              style={{ marginRight: token.marginXS }}
              color="blue"
              text={
                <>
                  已重命名
                  <Typography.Text type="secondary">
                    ({imgs.filter((img: Img) => img.renamed).length})
                  </Typography.Text>
                </>
              }
            />
          ) : undefined}
          <Typography.Text
            type="secondary"
            style={{ flex: 1, textAlign: "right" }}
          >
            共 {imgs.length} 个文件
          </Typography.Text>
        </div>
        <Divider />
        <div style={{ textAlign: "center" }}>
          <Space>
            <Button
              type="primary"
              icon={<FileImageOutlined />}
              disabled={isSafari}
              onClick={() => onExport(false)}
            >
              导出为多个文件
            </Button>
            <Button
              type="primary"
              icon={<FileZipOutlined />}
              onClick={() => onExport(true)}
            >
              导出为Zip
            </Button>
          </Space>
        </div>
        {isSafari ? (
          <div style={{ textAlign: "center", marginTop: "8px" }}>
            <Typography.Text type="secondary">
              Safari浏览器不支持导出为多个文件。
            </Typography.Text>
          </div>
        ) : undefined}
        <Drawer
          onClose={onClose}
          open={openProgressDrawer}
          title="正在导出"
          destroyOnClose
          closable={false}
          maskClosable={percent == 100 || canceled}
          bodyStyle={{
            overflowX: "hidden",
          }}
        >
          {!canceled ? (
            <>
              <Progress
                percent={percent}
                success={{ percent: processedPercent }}
                showInfo={false}
                status={percent == 100 ? "normal" : "active"}
              />
              <Space>
                <Badge status="success" text="已缓存" />
                <Badge color="blue" text="已处理" />
                <Badge status="default" text="队列中" />
              </Space>
              <Divider />
              {percent == 100 ? undefined : (
                <>
                  <div>
                    {progress.progress + progress.processed} / {progress.size}
                  </div>
                  <div
                    style={{
                      marginTop: "8px",
                      whiteSpace: "nowrap",
                      wordBreak: "keep-all",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {progress.current}
                  </div>
                </>
              )}
            </>
          ) : undefined}
          {cancel && !canceled && percent != 100 ? (
            <div style={{ textAlign: "right", marginTop: token.marginMD }}>
              <Button onClick={cancel.func}>取消</Button>
            </div>
          ) : undefined}
          {canceled ? (
            <Result
              status="info"
              title="导出已取消"
              extra={
                <Button
                  size="large"
                  onClick={() => {
                    setOpenProgressDrawer(false);
                    onOpenExportDrawer();
                  }}
                  children="返回"
                />
              }
            />
          ) : percent == 100 ? (
            <Result
              status={
                imgsStored.filter((i: any) => i.error).length
                  ? "error"
                  : "success"
              }
              title={
                imgsStored.filter((i: any) => i.error).length
                  ? "发生错误"
                  : "导出完成"
              }
              subTitle={
                imgsStored.filter((i: any) => i.error).length
                  ? `${
                      imgsStored.filter((i: any) => i.error).length
                    } 个文件处理失败。`
                  : zip
                  ? undefined
                  : "允许“下载多个文件”以保存文件。"
              }
              extra={
                <Button
                  type="primary"
                  size="large"
                  onClick={() => {
                    if (imgsStored.filter((i: any) => i.error).length) {
                      setOpenProgressDrawer(false);
                      onOpenExportDrawer();
                    } else onClose();
                  }}
                  danger={imgsStored.filter((i: any) => i.error).length}
                  children={
                    imgsStored.filter((i: any) => i.error).length
                      ? "查看错误"
                      : "返回"
                  }
                />
              }
            />
          ) : undefined}
        </Drawer>
      </Drawer>
    </>
  );
};
export default ExportAll;
