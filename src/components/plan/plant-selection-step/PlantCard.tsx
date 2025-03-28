import { Card, Badge, Button, Flex, Tag, Space } from "antd";
import { IPlant } from "@/interfaces";

interface PlantCardProps {
  plant: IPlant;
  isSelected: boolean;
  onSelect: (id: number) => void;
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
  const isAvailable = plant.status?.toLowerCase() === "available" && !disabled;

  return (
    <Badge.Ribbon
      text={isFromOrder ? t("plants.fromOrder") : t("plants.selected")}
      color={isFromOrder ? "blue" : "green"}
      style={{ display: isSelected ? "block" : "none" }}
    >
      <Card
        hoverable={isAvailable}
        style={{
          borderColor: getBorderColor(isSelected, isFromOrder),
          transition: "all 0.3s",
          transform: isSelected ? "translateY(-5px)" : undefined,
          height: "100%",
          opacity: isAvailable ? 1 : 0.7,
          cursor: isAvailable ? "pointer" : "not-allowed",
        }}
        onClick={() => {
          if (isAvailable) {
            onSelect(plant.id);
          }
        }}
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
              <Tag color={getStatusColor(plant.status)}>{plant.status || t("plants.noStatus")}</Tag>
            </Flex>
          }
          description={
            <Space direction="vertical" style={{ width: "100%", marginTop: 8 }}>
              <div style={{ height: 60, overflow: "hidden", marginBottom: 8 }}>
                {plant.description || t("plants.noDescription")}
              </div>

              {/* Không hiển thị temperature và humidity vì không có trong API */}

              <div style={{ marginTop: 8 }}>
                <span>{t("plants.type")}: </span>
                <strong>{plant.type || t("plants.noType")}</strong>
              </div>

              {plant.quantity > 0 && (
                <div>
                  <span>{t("plants.quantity")}: </span>
                  <strong>{plant.quantity}</strong>
                </div>
              )}

              <div>
                <span>{t("plants.basePrice")}: </span>
                <strong>
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                    plant.base_price,
                  )}
                </strong>
              </div>

              <div>
                <span>{t("plants.preservationDays")}: </span>
                <strong>
                  {plant.preservation_day} {t("plants.days")}
                </strong>
              </div>
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
            disabled={!isAvailable}
          >
            {isSelected ? t("plants.selected") : t("plants.select")}
          </Button>
        </Flex>
      </Card>
    </Badge.Ribbon>
  );
};

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "available":
      return "success";
    case "in-use":
      return "processing";
    case "maintenance":
      return "warning";
    default:
      return "default";
  }
};

const getBorderColor = (isSelected: boolean, isFromOrder: boolean | undefined) => {
  if (isSelected) {
    return isFromOrder ? "#1890ff" : "#52c41a";
  }
  return undefined;
};
