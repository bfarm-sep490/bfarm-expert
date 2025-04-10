import React from "react";
import { Tag } from "antd";

interface InspectionStatusTagProps {
  value?: string;
}

export const InspectionStatusTag: React.FC<InspectionStatusTagProps> = ({ value }) => {
  const normalizedValue = value === "Complete" ? "Completed" : value;

  let color = "default";
  let text = normalizedValue || "Unknown";

  switch (normalizedValue) {
    case "Draft":
      color = "gray";
      break;
    case "Pending":
      color = "gold";
      break;
    case "Ongoing":
      color = "blue";
      break;
    case "Completed":
      color = "green";
      break;
    case "Cancel":
      color = "red";
      break;
    default:
      color = "gray";
      text = "Unknown";
  }

  return <Tag color={color}>{text}</Tag>;
};
