import { PaginationTotal } from "@/components/paginationTotal";
import {
  Flex,
  Form,
  List,
  Select,
  Empty,
  Input,
  Spin,
  Button,
  Space,
  Alert,
  Tag,
  Tooltip,
} from "antd";
import { useState, useEffect, useCallback } from "react";
import { IPlant } from "@/interfaces";
import { PlantCard } from "./PlantCard";
import {
  SearchOutlined,
  FilterOutlined,
  ClearOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

export const PlantSelectionStep = ({
  t,
  plants,
  loading,
  total,
  canEdit = true,
}: {
  t: (key: string) => string;
  plants: IPlant[];
  loading: boolean;
  total: number;
  canEdit?: boolean;
}) => {
  const [selectedPlantId, setSelectedPlantId] = useState<number | null>(null);
  const [filteredPlants, setFilteredPlants] = useState<IPlant[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const pageSize = 4;
  const form = Form.useFormInstance();

  const orderIds = form.getFieldValue("order_ids") || [];

  const orderPlantId = form.getFieldValue("order_plant_id");

  const availableStatuses = [...new Set(plants.map((item) => item.status))].filter(Boolean);
  const availableTypes = [...new Set(plants.map((item) => item.type))].filter(Boolean);

  // Sử dụng useCallback để memoize hàm applyFilters
  const applyFilters = useCallback(() => {
    let filtered = [...plants];

    // Áp dụng bộ lọc văn bản
    if (searchText.trim() !== "") {
      filtered = filtered.filter(
        (plant) =>
          plant.plant_name.toLowerCase().includes(searchText.toLowerCase()) ||
          (plant.description && plant.description.toLowerCase().includes(searchText.toLowerCase())),
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(
        (plant) => plant.status?.toLowerCase() === statusFilter.toLowerCase(),
      );
    }

    if (typeFilter) {
      filtered = filtered.filter((plant) => plant.type?.toLowerCase() === typeFilter.toLowerCase());
    }

    setFilteredPlants(filtered);
  }, [plants, searchText, statusFilter, typeFilter]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Set plant_id từ order khi component mount
  useEffect(() => {
    if (orderPlantId && !selectedPlantId) {
      setSelectedPlantId(orderPlantId);
      form.setFieldValue("plant_id", orderPlantId);
    }
  }, [orderPlantId, selectedPlantId, form]);

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
            const targetPage = Math.floor(plantIndex / pageSize) + 1;
            setCurrentPage(targetPage);
          }
        }
      }
    };

    checkFormValue();

    const intervalId = setInterval(checkFormValue, 500);

    return () => {
      clearInterval(intervalId);
    };
  }, [form, selectedPlantId, plants, pageSize]);

  const handleCardSelect = (plantId: number) => {
    if (!canEdit) return;
    setSelectedPlantId(plantId);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleStatusFilterChange = (value: string | null) => {
    setStatusFilter(value);
  };

  const handleTypeFilterChange = (value: string | null) => {
    setTypeFilter(value);
  };

  const handleClearAllFilters = () => {
    setSearchText("");
    setStatusFilter(null);
    setTypeFilter(null);
    setFilteredPlants(plants);
  };

  const renderOrderInfo = () => {
    if (!form.getFieldValue("order_plant_name")) return null;

    return (
      <Tooltip
        title={
          <Space direction="vertical" size={4}>
            <div>Cây: {form.getFieldValue("order_plant_name")}</div>
            <div>Không thể thay đổi cây vì đã liên kết với đơn hàng.</div>
          </Space>
        }
      >
        <Tag color="blue" style={{ cursor: "help" }}>
          <InfoCircleOutlined /> Cây từ đơn hàng
        </Tag>
      </Tooltip>
    );
  };

  return (
    <>
      <Flex gap={16} style={{ marginBottom: 16 }} wrap="wrap" align="center">
        <Input
          placeholder={t("plants.search")}
          prefix={<SearchOutlined />}
          onChange={(e) => handleSearch(e.target.value)}
          value={searchText}
          style={{ width: 250 }}
          allowClear
        />

        <Select
          placeholder={t("plants.filterByStatus")}
          style={{ width: 180 }}
          allowClear
          onChange={handleStatusFilterChange}
          value={statusFilter}
          options={availableStatuses.map((status) => ({
            value: status,
            label: status,
          }))}
          suffixIcon={<FilterOutlined />}
        />

        <Select
          placeholder={t("plants.filterByType")}
          style={{ width: 180 }}
          allowClear
          onChange={handleTypeFilterChange}
          value={typeFilter}
          options={availableTypes.map((type) => ({
            value: type,
            label: type,
          }))}
          suffixIcon={<FilterOutlined />}
        />

        {(searchText || statusFilter || typeFilter) && (
          <Button icon={<ClearOutlined />} onClick={handleClearAllFilters}>
            {t("plants.clearAllFilters")}
          </Button>
        )}

        {renderOrderInfo()}
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
            total: filteredPlants.length,
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
                isFromOrder={orderPlantId === plant.id}
                disabled={!canEdit}
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
          disabled={!canEdit}
        />
      </Form.Item>

      {!selectedPlantId && (
        <div style={{ color: "#ff4d4f", marginTop: 8 }}>{t("plans.fields.plant.required")}</div>
      )}
    </>
  );
};
