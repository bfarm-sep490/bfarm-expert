import React from "react";
import { Tag } from "antd";

interface InspectionResultTagProps {
  value?: "Pass" | "Fail" | string;
}

export const InspectionResultTag: React.FC<InspectionResultTagProps> = ({ value }) => {
  let color = "default";
  let text = value || "Unknown";

  switch (value) {
    case "Grade 1":
      color = "green";
      text = "Grade 1";
      break;
    case "Grade 2":
      color = "yellow";
      text = "Grade 2";
      break;
    case "Grade 3":
      color = "red";
      text = "Grade 3";
      break;
    default:
      color = "gray";
      text = "Unknown";
  }

  return <Tag color={color}>{text}</Tag>;
};
