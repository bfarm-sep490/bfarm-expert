import { Tag } from "antd";

// Component will set the tag color to match its content
const PlantKitTag = ({ color }: { color?: string }) => {
  if (!color) return <Tag color="default">N/A</Tag>;

  // Convert the color name to lowercase for consistency
  const colorLower = color.toLowerCase();

  // Map of color names to Ant Design tag colors
  const colorMap: Record<string, string> = {
    blue: "blue",
    yellow: "gold",
    red: "red",
    orange: "orange",
  };

  // Use the mapped color if available, otherwise try to use the color name directly
  const tagColor = colorMap[colorLower] || colorLower;

  return <Tag color={tagColor}>{color}</Tag>;
};

export default PlantKitTag;
