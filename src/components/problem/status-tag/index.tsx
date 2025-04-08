import { TagField } from "@refinedev/antd";
import { Tag } from "antd";

const getStatusTagColor = (value: string) => {
  switch (value) {
    case "Pending":
      return "blue";
    case "Resolve":
      return "green";
    case "Cancel":
      return "red";

    default:
      return "default";
  }
};

const getStatusTagValue = (value: string) => {
  switch (value) {
    case "Pending":
      return "Đợi xác nhận";
    case "Resolve":
      return "Hoàn thành";
    case "Cancel":
      return "Hủy bỏ";

    default:
      return "Không xác định";
  }
};
type Props = {
  status: string;
};
export const ProblemStatusTag = ({ status }: Props) => {
  return <TagField value={getStatusTagValue(status)} color={getStatusTagColor(status)}></TagField>;
};
