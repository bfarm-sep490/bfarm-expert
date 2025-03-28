import { Card, Space, Tag } from "antd";
import { IPlant } from "../../../interfaces";

interface PlantCardProps {
  plant: IPlant;
  isSelected: boolean;
  onSelect: (plantId: number) => void;
  t: (key: string) => string;
  isFromOrder?: boolean;
  disabled?: boolean;
}

export const PlantCard: React.FC<PlantCardProps> = ({
  plant,
  isSelected,
  onSelect,
  t,
  isFromOrder,
  disabled = false,
}) => {
  const handleClick = () => {
    if (disabled) return;
    onSelect(plant.id);
  };

  return (
    <Card
      hoverable
      onClick={handleClick}
      style={{
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        border: isSelected ? "2px solid #1890ff" : "1px solid #d9d9d9",
        position: "relative",
      }}
    >
      {isFromOrder && (
        <Tag color="blue" style={{ position: "absolute", top: 8, right: 8 }}>
          {t("plants.fromOrder")}
        </Tag>
      )}
      <Card.Meta
        title={plant.plant_name}
        description={
          <Space direction="vertical" size={0}>
            <div>{plant.description}</div>
            <div>
              <Tag color="blue">{plant.type}</Tag>
              <Tag color="green">{plant.status}</Tag>
            </div>
          </Space>
        }
      />
    </Card>
  );
};
