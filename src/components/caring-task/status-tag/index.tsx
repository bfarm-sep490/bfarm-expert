import { Tag } from "antd";
const getStatusTagColor = (value: string) => {
  switch (value) {
    case "Pending":
      return "orange";
    case "Complete":
      return "green";
    case "Cancel":
      return "red";
    case "Ongoing":
      return "blue";
    default:
      return "default";
  }
};

const getStatusTagValue = (value: string) => {
  switch (value) {
    case "Pending":
      return "Đợi xác nhận";
    case "Complete":
      return "Hoàn thành";
    case "Cancel":
      return "Hủy bỏ";
    case "Ongoing":
      return "Trong quá trình";
    case "Draft":
      return "Bản nháp";
    default:
      return "Không xác định";
  }
};

type StatusTagProps = {
  status: string;
};

export const StatusTag = ({ status }: StatusTagProps) => {
  return (
    <Tag color={getStatusTagColor(status)}> {getStatusTagValue(status)}</Tag>
  );
};
