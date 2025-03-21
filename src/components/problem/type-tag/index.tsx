import { TagField } from "@refinedev/antd";
import { Tag } from "antd/lib";

const getTypeTagColor = (value: string) => {
  switch (value) {
    case "Weather":
      return "green";
    case "Fungus":
      return "#CC33FF";
    case "Nutrients":
      return "#550000";
    case "Light":
      return "yellow";
    case "Water":
      return "blue";
    case "Fertilizing":
      return "orange";
    case "Pest":
      return "yellow";
    default:
      return "default";
  }
};

const getTypeTagValue = (value: string) => {
  switch (value) {
    case "Weather":
      return "Thời tiết";
    case "Nutrients":
      return "Dinh dưỡng";
    case "Fungus":
      return "Nấm mốc";
    case "Light":
      return "Ánh sáng";
    case "Water":
      return "Thiếu nước";
    case "Fertilizing":
      return "Bón phân";
    case "Pest":
      return "Sâu bệnh";
    default:
      return "Không xác định";
  }
};
type Props = {
  status: string;
};

export const ProblemTypeTag = ({ status }: Props) => {
  return <TagField value={getTypeTagValue(status)} color={getTypeTagColor(status)}></TagField>;
};
