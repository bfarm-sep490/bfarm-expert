import { IPlant } from "@/interfaces";
import { Tag } from "antd";

interface Props {
  value: "Available" | "Unavailable";
}

export const PlantStatusTag: React.FC<Props> = ({ value }) => {
  switch (value) {
    case "Available":
      return <Tag color="green">Hoạt động</Tag>;
    case "Unavailable":
      return <Tag color="red">Không hoạt động</Tag>;

      return null;
  }
};
