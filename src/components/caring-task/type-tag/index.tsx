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

    case "Pesticiding":
      return "yellow";
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
    case "Pesticiding":
      return "Phun thuốc";
    default:
      return "Không xác định";
  }
};

type TypeTagProps = {
  status: "Planting" | "Nurturing" | "Watering" | "Fertilizing" | "Setup" | "Pesticiding";
};

export const CaringTypeTag = (props: TypeTagProps) => {
  return <Tag color={getTypeTagColor(props.status)}>{getTypeTagValue(props.status)}</Tag>;
};
