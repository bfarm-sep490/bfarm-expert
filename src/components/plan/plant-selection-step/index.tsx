import { PaginationTotal } from "@/components/paginationTotal";
import { Flex, Form, List, Select, Empty, Input, Spin } from "antd";
import { useState, useEffect } from "react";
import { IPlant } from "@/interfaces";
import { PlantCard } from "./PlantCard";
import { SearchOutlined } from "@ant-design/icons";

export const PlantSelectionStep = ({
  t,
  plants,
  loading,
  total,
}: {
  t: (key: string) => string;
  plants: IPlant[];
  loading: boolean;
  total: number;
}) => {
  const [selectedPlantId, setSelectedPlantId] = useState<number | null>(null);
  const [filteredPlants, setFilteredPlants] = useState<IPlant[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;
  const form = Form.useFormInstance();

  useEffect(() => {
    setFilteredPlants(plants);
  }, [plants]);

  useEffect(() => {
    if (selectedPlantId) {
      form.setFieldValue("plant_id", selectedPlantId);
    }
  }, [selectedPlantId, form]);

  useEffect(() => {
    const checkFormValue = () => {
      const currentValue = form.getFieldValue("plant_id");
      if (currentValue && currentValue !== selectedPlantId) {
        setSelectedPlantId(currentValue);

        if (plants.length > 0) {
          const plantIndex = plants.findIndex((plant) => plant.id === currentValue);
          if (plantIndex !== -1) {
            // Tính toán trang dựa trên index và pageSize
            // Ant Design pagination bắt đầu từ trang 1
            const targetPage = Math.floor(plantIndex / pageSize) + 1;
            setCurrentPage(targetPage);
          }
        }
      }
    };

    checkFormValue();

    const intervalId = setInterval(checkFormValue, 500);

    const unsubscribe = form
      .getFieldInstance("plant_id")
      ?.props?.onChange?.subscribe?.(checkFormValue);

    return () => {
      clearInterval(intervalId);
      if (unsubscribe) unsubscribe();
    };
  }, [form, selectedPlantId, plants, pageSize]);

  const handleCardSelect = (plantId: number) => {
    setSelectedPlantId(plantId);
  };

  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredPlants(plants);
    } else {
      const filtered = plants.filter(
        (plant) =>
          plant.plant_name.toLowerCase().includes(searchText.toLowerCase()) ||
          (plant.description && plant.description.toLowerCase().includes(searchText.toLowerCase())),
      );
      setFilteredPlants(filtered);
    }
  }, [searchText, plants]);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  return (
    <>
      <Flex gap={16} style={{ marginBottom: 16 }}>
        <Input
          placeholder={t("plants.search")}
          prefix={<SearchOutlined />}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
      </Flex>

      {loading ? (
        <Flex justify="center" align="center" style={{ height: 300 }}>
          <Spin size="large" tip={t("plants.loading")} />
        </Flex>
      ) : filteredPlants.length === 0 ? (
        <Empty description={t("plants.noData")} style={{ margin: "48px 0" }} />
      ) : (
        <List
          pagination={{
            pageSize,
            current: currentPage,
            onChange: (page) => setCurrentPage(page),
            total,
            showTotal: (total) => <PaginationTotal total={total} entityName={"plant"} />,
            position: "bottom",
          }}
          grid={{
            gutter: [24, 24],
            column: 4,
            xxl: 4,
            xl: 4,
            lg: 3,
            md: 2,
            sm: 1,
            xs: 1,
          }}
          dataSource={filteredPlants}
          renderItem={(plant) => (
            <List.Item>
              <PlantCard
                plant={plant}
                isSelected={selectedPlantId === plant.id}
                onSelect={handleCardSelect}
                t={t}
              />
            </List.Item>
          )}
        />
      )}

      <Form.Item
        style={{ display: "none" }}
        label={t("plans.fields.plant.label")}
        name="plant_id"
        rules={[{ required: true, message: t("plans.fields.plant.required") }]}
      >
        <Select
          options={plants.map((plant) => ({ value: plant.id, label: plant.plant_name }))}
          placeholder={t("plans.fields.plant.placeholder")}
        />
      </Form.Item>

      {!selectedPlantId && (
        <div style={{ color: "#ff4d4f", marginTop: 8 }}>{t("plans.fields.plant.required")}</div>
      )}
    </>
  );
};
