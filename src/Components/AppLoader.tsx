import { LoadingOutlined } from "@ant-design/icons";

const AppLoader: React.FC<any> = (props: any) => {
  return (
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <span style={{ marginBottom: "16px" }}>
        <LoadingOutlined style={{ fontSize: "22px", color: "#1668DC" }} />
      </span>
      <span style={{ fontSize: "14px", fontFamily: "sans-serif" }}>
        正在加载{props.msg ? props.msg : ""}
      </span>
    </div>
  );
};

export default AppLoader;
