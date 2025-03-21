import { TagField } from "@refinedev/antd";
import { Tag } from "antd";

const getStatusTagColor = (value: string) => {
  switch (value) {
    case "Pending":
      return "blue";
    case "Resolved":
      return "green";
    case "Cancelled":
      return "red";

    default:
      return "default";
  }
};

const getStatusTagValue = (value: string) => {
  switch (value) {
    case "Pending":
      return "Đợi xác nhận";
    case "Resolved":
      return "Hoàn thành";
    case "Cancelled":
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
