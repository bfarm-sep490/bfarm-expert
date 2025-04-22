import { Tag } from "antd";

const getTypeTagValue = (value: string) => {
  switch (value) {
    case "Setup":
      return "Chuẩn bị đất";
    case "Planting":
      return "Trồng cây";
    case "Nurturing":
      return "Chăm sóc";
    case "Watering":
      return "Tưới nước";
    case "Fertilizing":
      return "Bón phân";
    case "Pesticide":
      return "Phòng trừ sâu bệnh";
    case "Weeding":
      return "Làm cỏ";
    case "Pruning":
      return "Cắt tỉa";
    default:
      return "Không xác định";
  }
};

const getTypeTagColor = (type: string) => {
  const colors: Record<string, string> = {
    Setup: "blue",
    Planting: "green",
    Nurturing: "orange",
    Watering: "cyan",
    Fertilizing: "purple",
    Pesticide: "red",
    Weeding: "lime",
    Pruning: "gold",
  };
  return colors[type] || "default";
};

type TypeTagProps = {
  status:
    | "Setup"
    | "Planting"
    | "Nurturing"
    | "Watering"
    | "Fertilizing"
    | "Pesticide"
    | "Weeding"
    | "Pruning";
};

export const TypeTag: React.FC<TypeTagProps> = ({ status }) => {
  return <Tag color={getTypeTagColor(status)}>{getTypeTagValue(status)}</Tag>;
};
