import { Tag } from "antd";

const getTypeTagColor = (value: string) => {
  switch (value) {
    case "Planting":
      return "green";
    case "Nurturing":
      return "#550000";
    case "Watering":
      return "blue";
    case "Fertilizing":
      return "orange";
    case "Pesticide":
      return "yellow";
    case "Setup":
      return "gray";
    case "Weeding":
      return "brown";
    case "Pruning":
      return "purple";
    default:
      return "default";
  }
};

const getTypeTagValue = (value: string) => {
  switch (value) {
    case "Planting":
      return "Gieo hạt";
    case "Nurturing":
      return "Chăm sóc";
    case "Watering":
      return "Tưới nước";
    case "Fertilizing":
      return "Bón phân";
    case "Setup":
      return "Lắp đặt";
    case "Pesticide":
      return "Phun thuốc";
    case "Weeding":
      return "Làm cỏ";
    case "Pruning":
      return "Cắt tỉa";
    default:
      return "Không xác định";
  }
};

type TypeTagProps = {
  status:
    | "Planting"
    | "Nurturing"
    | "Watering"
    | "Fertilizing"
    | "Setup"
    | "Pesticide"
    | "Weeding"
    | "Pruning";
};

export const CaringTypeTag = (props: TypeTagProps) => {
  return <Tag color={getTypeTagColor(props.status)}>{getTypeTagValue(props.status)}</Tag>;
};
