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
  const form = Form.useFormInstance();

  // Cập nhật danh sách plants đã lọc khi plants thay đổi
  useEffect(() => {
    setFilteredPlants(plants);
  }, [plants]);

  // Cập nhật form khi chọn plant
  useEffect(() => {
    if (selectedPlantId) {
      form.setFieldValue("plant_id", selectedPlantId);
    }
  }, [selectedPlantId, form]);

  // Lấy giá trị từ form nếu đã có giá trị (trường hợp edit)
  useEffect(() => {
    const currentValue = form.getFieldValue("plant_id");
    if (currentValue) {
      setSelectedPlantId(currentValue);
    }
  }, [form]);

  // Xử lý khi chọn card
  const handleCardSelect = (plantId: number) => {
    setSelectedPlantId(plantId);
  };

  // Lọc plants dựa trên từ khóa tìm kiếm
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

  // Xử lý tìm kiếm
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
            pageSize: 4,
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
