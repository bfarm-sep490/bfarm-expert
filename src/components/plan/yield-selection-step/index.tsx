import { PaginationTotal } from "@/components/paginationTotal";
import { Flex, Form, List, Select, Empty, Input, Spin, Button, Space, Badge } from "antd";
import { useState, useEffect, useCallback } from "react";
import { IYield } from "@/interfaces";
import { YieldCard } from "./YieldCard";
import { SearchOutlined, BulbOutlined, ClearOutlined, FilterOutlined } from "@ant-design/icons";
import { useApiUrl, useNotification } from "@refinedev/core";
import axios from "axios";

export const YieldSelectionStep = ({
  t,
  yields,
  loading,
}: {
  t: (key: string) => string;
  yields: IYield[];
  loading: boolean;
}) => {
  const [selectedYieldId, setSelectedYieldId] = useState<number | null>(null);
  const [filteredYields, setFilteredYields] = useState<IYield[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [isSuggestActive, setIsSuggestActive] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const pageSize = 4;
  const form = Form.useFormInstance();
  const apiUrl = useApiUrl();
  const { open } = useNotification();

  const availableStatuses = [...new Set(yields.map((item) => item.status))].filter(Boolean);

  const applyFilters = useCallback(() => {
    if (isSuggestActive) return;

    let filtered = [...yields];

    if (searchText.trim() !== "") {
      filtered = filtered.filter(
        (yieldItem) =>
          yieldItem.yield_name.toLowerCase().includes(searchText.toLowerCase()) ||
          (yieldItem.description &&
            yieldItem.description.toLowerCase().includes(searchText.toLowerCase())),
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(
        (yieldItem) => yieldItem.status?.toLowerCase() === statusFilter.toLowerCase(),
      );
    }

    setFilteredYields(filtered);
  }, [yields, searchText, statusFilter, isSuggestActive]);

  // Cập nhật useEffect với dependency đầy đủ
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  useEffect(() => {
    if (selectedYieldId) {
      form.setFieldValue("yield_id", selectedYieldId);
    }
  }, [selectedYieldId, form]);

  useEffect(() => {
    const checkFormValue = () => {
      const currentValue = form.getFieldValue("yield_id");
      if (currentValue && currentValue !== selectedYieldId) {
        setSelectedYieldId(currentValue);

        if (yields.length > 0) {
          const yieldIndex = yields.findIndex((yieldItem) => yieldItem.id === currentValue);
          if (yieldIndex !== -1) {
            const targetPage = Math.floor(yieldIndex / pageSize) + 1;
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
  }, [form, selectedYieldId, yields, pageSize]);

  const handleCardSelect = (yieldId: number) => {
    setSelectedYieldId(yieldId);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleStatusFilterChange = (value: string | null) => {
    setStatusFilter(value);
  };

  const handleSuggestYields = async () => {
    const plantId = form.getFieldValue("plant_id");

    if (!plantId) {
      open?.({
        // @ts-expect-error type
        type: "warning",
        message: t("yields.selectPlantFirst"),
        description: t("yields.selectPlantFirstDescription"),
      });
      return;
    }

    setSuggestLoading(true);

    try {
      const response = await axios.get(`${apiUrl}/plants/${plantId}/suggest-yields`);

      if (response.data && response.data.data && response.data.data.length > 0) {
        const suggestedYieldIds = response.data.data.map((item: { id: number }) => item.id);

        const suggestedYields = yields.filter(
          (item) =>
            suggestedYieldIds.includes(item.id) && item.status?.toLowerCase() === "available",
        );

        setFilteredYields(suggestedYields.length > 0 ? suggestedYields : []);
        setIsSuggestActive(suggestedYields.length > 0);

        setSearchText("");
        setStatusFilter(null);

        if (suggestedYields.length > 0) {
          open?.({
            type: "success",
            message: t("yields.suggestedSuccess"),
            description: t("yields.suggestedSuccessDescription"),
          });
        } else {
          open?.({
            // @ts-expect-error type
            type: "warning",
            message: t("yields.noSuggestedYields"),
            description: t("yields.noSuggestedYieldsDescription"),
          });
        }
      } else {
        open?.({
          // @ts-expect-error type
          type: "warning",
          message: t("yields.noSuggestedYields"),
          description: t("yields.noSuggestedYieldsDescription"),
        });
      }
    } catch (error) {
      console.error("Error suggesting yields:", error);
      open?.({
        type: "error",
        message: t("yields.suggestError"),
        description: t("yields.suggestErrorDescription"),
      });
    } finally {
      setSuggestLoading(false);
    }
  };

  const handleClearSuggest = () => {
    setIsSuggestActive(false);
    applyFilters();
  };

  const handleClearAllFilters = () => {
    setSearchText("");
    setStatusFilter(null);
    setIsSuggestActive(false);
    setFilteredYields(yields);
  };

  return (
    <>
      <Flex gap={16} style={{ marginBottom: 16 }} wrap="wrap">
        <Input
          placeholder={t("yields.search")}
          prefix={<SearchOutlined />}
          onChange={(e) => handleSearch(e.target.value)}
          value={searchText}
          style={{ width: 250 }}
          allowClear
          disabled={isSuggestActive}
        />

        <Select
          placeholder={t("yields.filterByStatus")}
          style={{ width: 180 }}
          allowClear
          onChange={handleStatusFilterChange}
          value={statusFilter}
          disabled={isSuggestActive}
          options={availableStatuses.map((status) => ({
            value: status,
            label: status,
          }))}
          suffixIcon={<FilterOutlined />}
        />

        <Space>
          {isSuggestActive ? (
            <Badge count={filteredYields.length} overflowCount={99} color="#52c41a">
              <Button type="primary" danger icon={<ClearOutlined />} onClick={handleClearSuggest}>
                {t("yields.clearSuggest")}
              </Button>
            </Badge>
          ) : (
            <>
              <Button
                type="primary"
                icon={<BulbOutlined />}
                onClick={handleSuggestYields}
                loading={suggestLoading}
              >
                {t("yields.suggest")}
              </Button>
              {(searchText || statusFilter) && (
                <Button icon={<ClearOutlined />} onClick={handleClearAllFilters}>
                  {t("yields.clearAllFilters")}
                </Button>
              )}
            </>
          )}
        </Space>
      </Flex>

      {loading || suggestLoading ? (
        <Flex justify="center" align="center" style={{ height: 300 }}>
          <Spin size="large" tip={t("yields.loading")} />
        </Flex>
      ) : filteredYields.length === 0 ? (
        <Empty description={t("yields.noData")} style={{ margin: "48px 0" }} />
      ) : (
        <List
          pagination={{
            pageSize,
            current: currentPage,
            onChange: (page) => setCurrentPage(page),
            total: filteredYields.length,
            showTotal: (total) => <PaginationTotal total={total} entityName={"yield"} />,
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
          dataSource={filteredYields}
          renderItem={(yieldItem) => (
            <List.Item>
              <YieldCard
                yieldItem={yieldItem}
                isSelected={selectedYieldId === yieldItem.id}
                onSelect={handleCardSelect}
                t={t}
              />
            </List.Item>
          )}
        />
      )}

      <Form.Item
        style={{ display: "none" }}
        label={t("plans.fields.yield.label")}
        name="yield_id"
        rules={[{ required: true, message: t("plans.fields.yield.required") }]}
      >
        <Select
          options={yields.map((yieldItem) => ({
            value: yieldItem.id,
            label: yieldItem.yield_name,
          }))}
          placeholder={t("plans.fields.yield.placeholder")}
        />
      </Form.Item>

      {!selectedYieldId && (
        <div style={{ color: "#ff4d4f", marginTop: 8 }}>{t("plans.fields.yield.required")}</div>
      )}
    </>
  );
};
