import { Tag } from "antd";

interface Props {
  value?: string | boolean;
}

export const PlantAvailabilityTag: React.FC<Props> = ({ value }) => {
  const status = value === true || value === "Available" ? "Available" : "Unavailable";

  switch (status) {
    case "Available":
      return <Tag color="green">Available</Tag>;
    case "Unavailable":
      return <Tag color="red">Unavailable</Tag>;
    default:
      return <Tag color="gray">Unknown</Tag>;
  }
};
