import { Card, Badge, Button, Flex, Tag, Tooltip, Space } from "antd";
import { IPlant } from "@/interfaces";
import { DashboardOutlined } from "@ant-design/icons";

interface PlantCardProps {
  plant: IPlant;
  isSelected: boolean;
  onSelect: (id: number) => void;
  t: (key: string) => string;
}

export const PlantCard: React.FC<PlantCardProps> = ({ plant, isSelected, onSelect, t }) => {
  return (
    <Badge.Ribbon
      text={t("plants.selected")}
      color="green"
      style={{ display: isSelected ? "block" : "none" }}
    >
      <Card
        hoverable
        style={{
          borderColor: isSelected ? "#52c41a" : undefined,
          transition: "all 0.3s",
          transform: isSelected ? "translateY(-5px)" : undefined,
          height: "100%",
        }}
        onClick={() => onSelect(plant.id)}
        cover={
          <div
            style={{
              height: 180,
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              alt={plant.plant_name}
              src={
                plant.image_url ||
                "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
              }
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        }
      >
        <Card.Meta
          title={
            <Flex justify="space-between" align="center">
              <span>{plant.plant_name}</span>
              <Tag color={plant.is_available ? "success" : "error"}>
                {plant.is_available ? t("plants.available") : t("plants.unavailable")}
              </Tag>
            </Flex>
          }
          description={
            <Space direction="vertical" style={{ width: "100%", marginTop: 8 }}>
              <div style={{ height: 60, overflow: "hidden", marginBottom: 8 }}>
                {plant.description || t("plants.noDescription")}
              </div>

              <Space size="small">
                <Tooltip title={t("plants.temperature")}>
                  <Tag icon={<DashboardOutlined />} color="blue">
                    {plant.min_temp}°C - {plant.max_temp}°C
                  </Tag>
                </Tooltip>

                <Tooltip title={t("plants.humidity")}>
                  <Tag icon={<DashboardOutlined />} color="cyan">
                    {plant.min_humid}% - {plant.max_humid}%
                  </Tag>
                </Tooltip>
              </Space>

              {plant.quantity > 0 && (
                <div style={{ marginTop: 8 }}>
                  <span>{t("plants.quantity")}: </span>
                  <strong>
                    {plant.quantity} {plant.unit}
                  </strong>
                </div>
              )}
            </Space>
          }
        />
        <Flex justify="center" style={{ marginTop: 16 }}>
          <Button
            type={isSelected ? "primary" : "default"}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(plant.id);
            }}
            style={{ width: "100%" }}
          >
            {isSelected ? t("plants.selected") : t("plants.select")}
          </Button>
        </Flex>
      </Card>
    </Badge.Ribbon>
  );
};
