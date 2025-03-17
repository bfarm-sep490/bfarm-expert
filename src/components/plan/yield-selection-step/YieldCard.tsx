import { Card, Tag, Flex, Button } from "antd";
import { IYield } from "@/interfaces";

interface YieldCardProps {
  yieldItem: IYield;
  isSelected: boolean;
  onSelect: (id: number) => void;
  t: (key: string) => string;
}

export const YieldCard: React.FC<YieldCardProps> = ({ yieldItem, isSelected, onSelect, t }) => {
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

  const isAvailable = yieldItem.status?.toLowerCase() === "available";

  return (
    <Card
      hoverable={isAvailable}
      style={{
        borderColor: isSelected ? "#52c41a" : undefined,
        transition: "all 0.3s",
        transform: isSelected ? "translateY(-5px)" : undefined,
        height: "100%",
        opacity: isAvailable ? 1 : 0.7,
        cursor: isAvailable ? "pointer" : "not-allowed",
      }}
      onClick={() => {
        if (isAvailable) {
          onSelect(yieldItem.id);
        }
      }}
    >
      <Card.Meta
        title={
          <Flex justify="space-between" align="center">
            <span>{yieldItem.yield_name}</span>
            <Tag color={getStatusColor(yieldItem.status)}>
              {yieldItem.status || t("yields.noStatus")}
            </Tag>
          </Flex>
        }
        description={
          <div style={{ marginTop: 8 }}>
            <div style={{ height: 60, overflow: "hidden", marginBottom: 8 }}>
              {yieldItem.description || t("yields.noDescription")}
            </div>

            <div style={{ marginTop: 8 }}>
              <span>{t("yields.type")}: </span>
              <strong>{yieldItem.type || t("yields.noType")}</strong>
            </div>

            <div>
              <span>{t("yields.size")}: </span>
              <strong>{yieldItem.size || t("yields.noSize")}</strong>
            </div>

            <div>
              <span>{t("yields.area")}: </span>
              <strong>
                {yieldItem.area} {yieldItem.area_unit}
              </strong>
            </div>
          </div>
        }
      />
      <Flex justify="center" style={{ marginTop: 16 }}>
        <Button
          type={isSelected ? "primary" : "default"}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(yieldItem.id);
          }}
          style={{ width: "100%" }}
          disabled={!isAvailable}
        >
          {isSelected ? t("yields.selected") : t("yields.select")}
        </Button>
      </Flex>
    </Card>
  );
};
