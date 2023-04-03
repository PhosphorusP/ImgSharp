import { theme } from "antd";
import React from "react";
const { useToken } = theme;

type Props = {
  children: React.ReactNode;
  style?: React.CSSProperties;
};

const ImagePreviewPlate: React.FC<Props> = ({ children, style }: Props) => {
  const { token } = useToken();
  const colorBackground = token.colorFillQuaternary;
  const colorFill = token.colorFillTertiary;
  return (
    <div
      style={{
        backgroundColor: colorBackground,
        backgroundImage: `linear-gradient(45deg, ${colorFill} 25%, transparent 0),
        linear-gradient(45deg, transparent 75%, ${colorFill} 0),
        linear-gradient(45deg, ${colorFill} 25%, transparent 0),
        linear-gradient(45deg, transparent 75%, ${colorFill} 0)`,
        backgroundSize: `30px 30px`,
        backgroundPosition: `0 0, 15px 15px, 15px 15px, 30px 30px`,
        transitionDuration: ".25s",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
export default ImagePreviewPlate;
