import { useList, useTranslate, useOne } from "@refinedev/core";
import { UseFormReturnType } from "@refinedev/antd";
import {
  Space,
  Form,
  Select,
  InputNumber,
  Card,
  Typography,
  Flex,
  Row,
  Col,
  theme,
  Tag,
  Button,
  Alert,
  Descriptions,
} from "antd";
import {
  NumberOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  BulbOutlined,
} from "@ant-design/icons";
import { IPlant, Template } from "@/interfaces";
import React, { useEffect, useState } from "react";
import { useSuggestYield } from "@/hooks/useTemplatePlan";

const { Text } = Typography;

interface ProductionInfoProps {
  formProps: UseFormReturnType<IPlant>["formProps"];
  selectedTemplate: Template | null;
  yieldsOptions: { label: string; value: number }[];
}

// Custom option renderer cho yield selection
const YieldOption = ({ data }: { data: any }) => {
  const { token } = theme.useToken();

  return (
    <div style={{ padding: "8px 0" }}>
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        <Text strong>{data.yield_name}</Text>
        <Space size="small">
          <Tag color="blue">{data.type}</Tag>
          <Tag color={data.status === "Available" ? "green" : "red"}>{data.status}</Tag>
        </Space>
        <Text type="secondary" style={{ fontSize: "12px" }}>
          <InfoCircleOutlined style={{ marginRight: 4 }} />
          {data.description}
        </Text>
        <Space size="small">
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Diện tích: {data.area.toLocaleString()} {data.area_unit}
          </Text>
          {data.maximum_quantity > 0 && (
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Sản lượng tối đa: {data.maximum_quantity.toLocaleString()} kg
            </Text>
          )}
        </Space>
      </Space>
    </div>
  );
};

export const ProductionInfo: React.FC<ProductionInfoProps> = ({
  formProps,
  selectedTemplate,
  yieldsOptions,
}) => {
  const t = useTranslate();
  const { token } = theme.useToken();
  const [estimatedPerOne, setEstimatedPerOne] = useState<number | null>(null);
  const [calculationInfo, setCalculationInfo] = useState<string>("");
  const [showSuggest, setShowSuggest] = useState(false);
  const [selectedYield, setSelectedYield] = useState<any>(null);

  const plantId = formProps.form?.getFieldValue("plant_id");
  const { suggestYields, isLoading: isLoadingSuggest } = useSuggestYield(plantId);

  // Lấy thông tin cây trồng để lấy average_estimated_per_one
  const { data: plantData } = useOne({
    resource: "plants",
    id: formProps.form?.getFieldValue("plant_id"),
    queryOptions: {
      enabled: !!formProps.form?.getFieldValue("plant_id"),
    },
  });

  // Lấy template data để lấy estimated_per_one
  const { data: templateData } = useList({
    resource: "templates",
    filters: [
      {
        field: "plant_id",
        operator: "eq",
        value: formProps.form?.getFieldValue("plant_id"),
      },
      {
        field: "season_type",
        operator: "eq",
        value: formProps.form?.getFieldValue("season_name"),
      },
      {
        field: "start",
        operator: "eq",
        value: formProps.form?.getFieldValue("start_date")?.format("MM-DD"),
      },
    ],
    queryOptions: {
      enabled:
        !!formProps.form?.getFieldValue("plant_id") &&
        !!formProps.form?.getFieldValue("season_name") &&
        !!formProps.form?.getFieldValue("start_date"),
    },
  });

  // Lấy thông tin chi tiết của yield
  const { data: yieldData } = useList({
    resource: "yields",
    filters: [
      {
        field: "id",
        operator: "in",
        value: yieldsOptions.map((option) => option.value),
      },
    ],
  });

  // Tạo map để truy cập nhanh thông tin yield
  const yieldMap = React.useMemo(() => {
    if (!yieldData?.data) return {};
    return yieldData.data.reduce(
      (acc, yield_) => {
        if (typeof yield_.id === "number") {
          acc[yield_.id] = yield_;
        }
        return acc;
      },
      {} as Record<number, any>,
    );
  }, [yieldData]);

  // Cập nhật estimated_per_one khi có template data hoặc plant data
  useEffect(() => {
    if (templateData?.data?.[0]?.estimated_per_one) {
      setEstimatedPerOne(templateData.data[0].estimated_per_one);
      setCalculationInfo(
        `Tỷ lệ sản xuất: 1 hạt giống = ${templateData.data[0].estimated_per_one} kg sản phẩm (${formProps.form?.getFieldValue("season_name")})`,
      );
    } else if (plantData?.data?.average_estimated_per_one) {
      setEstimatedPerOne(plantData.data.average_estimated_per_one);
      setCalculationInfo(
        `Tỷ lệ sản xuất: 1 hạt giống = ${plantData.data.average_estimated_per_one} kg sản phẩm (${formProps.form?.getFieldValue("season_name")})`,
      );
    } else {
      setEstimatedPerOne(1);
      setCalculationInfo(
        `Tỷ lệ sản xuất: 1 hạt giống = 1 kg sản phẩm (${formProps.form?.getFieldValue("season_name")})`,
      );
    }
  }, [templateData, plantData, formProps.form]);

  // Tính toán seed_quantity khi estimated_product thay đổi
  const handleEstimatedProductChange = (value: number | null) => {
    if (formProps.form && value) {
      const seedQuantity = Math.ceil(value / (estimatedPerOne || 1));
      formProps.form.setFieldsValue({
        seed_quantity: seedQuantity,
      });
    }
  };

  const validateEstimatedProduct = (_: any, value: number) => {
    if (value <= 0) {
      return Promise.reject(t("plans.validation.estimated_product_min"));
    }
    if (value > 1000000) {
      return Promise.reject(t("plans.validation.estimated_product_max"));
    }
    return Promise.resolve();
  };

  const validateSeedQuantity = (_: any, value: number) => {
    if (value <= 0) {
      return Promise.reject(t("plans.validation.seed_quantity_min"));
    }
    if (value > 10000) {
      return Promise.reject(t("plans.validation.seed_quantity_max"));
    }
    return Promise.resolve();
  };

  const handleYieldSelect = (value: number) => {
    const yields = Array.isArray(suggestYields) ? suggestYields : suggestYields?.data || [];
    const yield_ = yields.find((y: any) => y.id === value);
    if (yield_) {
      setSelectedYield(yield_);
    } else {
      setSelectedYield(null);
      formProps.form?.setFieldsValue({ yield_id: undefined });
    }
  };

  const handleSuggestYieldSelect = (yield_: any) => {
    const selectedYieldData = yieldData?.data?.find((y) => y.id === yield_.id);
    if (selectedYieldData) {
      setSelectedYield(selectedYieldData);
      formProps.form?.setFieldsValue({ yield_id: selectedYieldData.id });
      setShowSuggest(false);
    }
  };

  // Set selected yield from template when component mounts
  useEffect(() => {
    if (selectedTemplate?.yield_id) {
      const templateYield = yieldData?.data?.find((y) => y.id === selectedTemplate.yield_id);
      if (templateYield) {
        setSelectedYield(templateYield);
        formProps.form?.setFieldsValue({ yield_id: templateYield.id });
      }
    }
  }, [selectedTemplate, yieldData]);

  return (
    <Card
      style={{
        background: token.colorBgContainer,
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowTertiary,
      }}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Flex justify="space-between" align="center">
          <Space direction="vertical" size="small">
            <Text strong style={{ fontSize: "16px" }}>
              <EnvironmentOutlined style={{ marginRight: 8, color: token.colorPrimary }} />
              {t("plans.messages.production_info.title")}
            </Text>
            <Text type="secondary">
              <InfoCircleOutlined style={{ marginRight: 4 }} />
              {t("plans.messages.production_info.description")}
            </Text>
          </Space>
          {plantId && !selectedTemplate && (
            <Button
              type="primary"
              icon={<BulbOutlined />}
              onClick={() => setShowSuggest(!showSuggest)}
              loading={isLoadingSuggest}
            >
              {showSuggest ? t("yields.clearSuggest") : t("yields.suggest")}
            </Button>
          )}
        </Flex>

        {showSuggest && plantId && !selectedTemplate && (
          <Alert
            message={t("yields.selectPlantFirst")}
            description={t("yields.selectPlantFirstDescription")}
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {showSuggest &&
          Array.isArray(suggestYields) &&
          suggestYields.length > 0 &&
          !selectedTemplate && (
            <Alert
              message="Gợi ý đất phù hợp"
              description={
                <Space direction="vertical" size="small" style={{ width: "100%" }}>
                  {suggestYields.map((yield_: any) => {
                    const isAvailable = yield_.status === "Available";
                    const startDate = formProps.form?.getFieldValue("start_date");
                    const isAfterEndDate =
                      startDate && yield_.estimated_end_date
                        ? new Date(startDate) > new Date(yield_.estimated_end_date)
                        : false;
                    const canSelect = isAvailable || isAfterEndDate;

                    return (
                      <Card
                        key={yield_.id}
                        size="small"
                        style={{
                          cursor: canSelect ? "pointer" : "not-allowed",
                          opacity: canSelect ? 1 : 0.7,
                          borderColor: canSelect ? undefined : "#ff4d4f",
                        }}
                        onClick={() => {
                          if (canSelect) {
                            handleSuggestYieldSelect(yield_);
                          }
                        }}
                      >
                        <Space direction="vertical" size="small" style={{ width: "100%" }}>
                          <Space>
                            <Text strong>{yield_.yield_name}</Text>
                            <Text type="secondary">
                              {yield_.area} {yield_.area_unit}
                            </Text>
                            <Tag color={canSelect ? "green" : "red"}>{yield_.status}</Tag>
                          </Space>
                          <Text type="secondary">
                            Số lượng hạt giống tối đa: {yield_.maximum_quantity} hạt
                          </Text>
                          {!isAvailable && (
                            <>
                              <Text type="secondary">
                                Số kế hoạch đang sử dụng: {yield_.plan_id_in_use || 0}
                              </Text>
                              {yield_.estimated_end_date && (
                                <>
                                  <Text type="secondary">
                                    Dự kiến kết thúc:{" "}
                                    {new Date(yield_.estimated_end_date).toLocaleDateString()}
                                  </Text>
                                  {!startDate ? (
                                    <Text type="warning">
                                      Vui lòng chọn ngày bắt đầu sau{" "}
                                      {new Date(yield_.estimated_end_date).toLocaleDateString()} để
                                      sử dụng
                                    </Text>
                                  ) : isAfterEndDate ? (
                                    <Text type="success">
                                      Có thể sử dụng vì ngày bắt đầu (
                                      {new Date(startDate).toLocaleDateString()}) sau ngày kết thúc
                                    </Text>
                                  ) : (
                                    <Text type="danger">
                                      Không thể sử dụng vì ngày bắt đầu (
                                      {new Date(startDate).toLocaleDateString()}) trước ngày kết
                                      thúc
                                    </Text>
                                  )}
                                </>
                              )}
                            </>
                          )}
                        </Space>
                      </Card>
                    );
                  })}
                </Space>
              }
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label={
                <span>
                  <EnvironmentOutlined /> {t("plans.fields.land.label")}
                </span>
              }
              name="yield_id"
              rules={[
                { required: true, message: t("plans.fields.land.required") },
                { type: "number", message: t("plans.validation.land_type") },
              ]}
              initialValue={selectedTemplate?.yield_id}
            >
              <Space direction="vertical" size="small" style={{ width: "100%" }}>
                <Select
                  size="large"
                  placeholder={t("plans.fields.land.placeholder")}
                  options={yieldsOptions.map((option) => {
                    const yields = Array.isArray(suggestYields)
                      ? suggestYields
                      : suggestYields?.data || [];
                    const isSuggested = yields.some((y: any) => y.id === option.value);
                    const suggestedYield = yields.find((y: any) => y.id === option.value);
                    const isDisabled = Boolean(
                      selectedTemplate ||
                        !isSuggested ||
                        (suggestedYield?.status !== "Available" &&
                          (!suggestedYield?.estimated_end_date ||
                            new Date(formProps.form?.getFieldValue("start_date")) <=
                              new Date(suggestedYield.estimated_end_date))),
                    );
                    return {
                      ...option,
                      disabled: isDisabled,
                      label: (
                        <Space>
                          {option.label}
                          {!isSuggested && <Tag color="default">{t("yields.notSuggested")}</Tag>}
                        </Space>
                      ),
                    };
                  })}
                  onChange={handleYieldSelect}
                  value={selectedYield?.id}
                  showSearch
                  optionFilterProp="label"
                  notFoundContent={t("plans.messages.no_yields_found")}
                  optionRender={(option) => {
                    const yield_ = yieldMap[option.value as number];
                    return yield_ ? <YieldOption data={yield_} /> : option.label;
                  }}
                  dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                  disabled={!!selectedTemplate}
                />
                {selectedYield && !selectedTemplate && (
                  <Button type="link" onClick={() => setShowSuggest(true)} icon={<BulbOutlined />}>
                    Xem lại gợi ý đất phù hợp
                  </Button>
                )}
              </Space>
            </Form.Item>
          </Col>
        </Row>

        {selectedYield && (
          <Card size="small" style={{ width: "100%" }}>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Tên đất" span={2}>
                {selectedYield.yield_name}
              </Descriptions.Item>
              <Descriptions.Item label="Loại" span={2}>
                {selectedYield.type}
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả" span={2}>
                {selectedYield.description}
              </Descriptions.Item>
              <Descriptions.Item label="Diện tích">
                {selectedYield.area} {selectedYield.area_unit}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={selectedYield.status === "Available" ? "green" : "red"}>
                  {selectedYield.status}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label={
                <span>
                  <NumberOutlined /> {t("plans.fields.estimatedProduct.label")}
                </span>
              }
              name="estimated_product"
              rules={[
                { required: true, message: t("plans.fields.estimatedProduct.required") },
                { validator: validateEstimatedProduct },
              ]}
              initialValue={selectedTemplate?.estimated_product}
              tooltip={{
                title: t("plans.tooltips.estimated_product"),
                icon: <InfoCircleOutlined />,
              }}
            >
              <InputNumber
                size="large"
                min={0}
                max={1000000}
                style={{ width: "100%" }}
                placeholder="0"
                addonAfter="kg"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => {
                  if (!value) return 0;
                  const parsed = Number(value.replace(/\$\s?|(,*)/g, ""));
                  return Math.min(Math.max(parsed, 0), 1000000) as 0 | 1000000;
                }}
                step={100}
                onChange={handleEstimatedProductChange}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={
                <span>
                  <NumberOutlined /> {t("plans.fields.seedQuantity.label")}
                </span>
              }
              name="seed_quantity"
              rules={[
                { required: true, message: t("plans.fields.seedQuantity.required") },
                { validator: validateSeedQuantity },
              ]}
              initialValue={selectedTemplate?.seed_quantity}
              tooltip={{
                title: t("plans.tooltips.seed_quantity"),
                icon: <InfoCircleOutlined />,
              }}
              extra={calculationInfo}
            >
              <InputNumber
                size="large"
                min={0}
                max={10000}
                style={{ width: "100%" }}
                placeholder="0"
                addonAfter="kg"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => {
                  if (!value) return 0;
                  const parsed = Number(value.replace(/\$\s?|(,*)/g, ""));
                  return Math.min(Math.max(parsed, 0), 10000) as 0 | 10000;
                }}
                step={10}
                disabled
              />
            </Form.Item>
          </Col>
        </Row>
      </Space>
    </Card>
  );
};
