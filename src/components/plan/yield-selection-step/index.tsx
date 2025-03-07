import { Flex, Form, List, Select, Empty, Input, Spin } from "antd";
import { useState, useEffect } from "react";
import { IYield } from "@/interfaces";
import { SearchOutlined } from "@ant-design/icons";
import { PaginationTotal } from "@/components/paginationTotal";
import { YieldCard } from "./YieldCard";

export const YieldSelectionStep = ({
  t,
  yields,
  loading,
  total,
}: {
  t: (key: string) => string;
  yields: IYield[];
  loading: boolean;
  total: number;
}) => {
  const [selectedYieldId, setSelectedYieldId] = useState<number | null>(null);
  const [filteredYields, setFilteredYields] = useState<IYield[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const form = Form.useFormInstance();

  useEffect(() => {
    setFilteredYields(yields);
  }, [yields]);

  useEffect(() => {
    if (selectedYieldId) {
      form.setFieldValue("yield_id", selectedYieldId);
    }
  }, [selectedYieldId, form]);

  useEffect(() => {
    const currentValue = form.getFieldValue("yield_id");
    if (currentValue) {
      setSelectedYieldId(currentValue);
    }
  }, [form]);

  const handleCardSelect = (yieldId: number) => {
    setSelectedYieldId(yieldId);
  };

  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredYields(yields);
    } else {
      const filtered = yields.filter(
        (yieldItem) =>
          yieldItem.yield_name.toLowerCase().includes(searchText.toLowerCase()) ||
          (yieldItem.description &&
            yieldItem.description.toLowerCase().includes(searchText.toLowerCase())) ||
          (yieldItem.type && yieldItem.type.toLowerCase().includes(searchText.toLowerCase())),
      );
      setFilteredYields(filtered);
    }
  }, [searchText, yields]);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  return (
    <>
      <Flex gap={16} style={{ marginBottom: 16 }}>
        <Input
          placeholder={t("yields.search")}
          prefix={<SearchOutlined />}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
      </Flex>

      {loading ? (
        <Flex justify="center" align="center" style={{ height: 300 }}>
          <Spin size="large" tip={t("yields.loading")} />
        </Flex>
      ) : filteredYields.length === 0 ? (
        <Empty description={t("yields.noData")} style={{ margin: "48px 0" }} />
      ) : (
        <List
          pagination={{
            pageSize: 4,
            total,
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
