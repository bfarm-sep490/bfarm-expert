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
} from "antd";
import { NumberOutlined, EnvironmentOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { IPlant, Template } from "@/interfaces";
import React, { useEffect, useState } from "react";

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
      return Promise.reject("Sản lượng dự kiến phải lớn hơn 0");
    }
    if (value > 1000000) {
      return Promise.reject("Sản lượng dự kiến không được vượt quá 1,000,000 kg");
    }
    return Promise.resolve();
  };

  const validateSeedQuantity = (_: any, value: number) => {
    if (value <= 0) {
      return Promise.reject("Lượng giống phải lớn hơn 0");
    }
    if (value > 10000) {
      return Promise.reject("Lượng giống không được vượt quá 10,000 kg");
    }
    return Promise.resolve();
  };

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
              Thông tin sản lượng
            </Text>
            <Text type="secondary">
              <InfoCircleOutlined style={{ marginRight: 4 }} />
              Nhập thông tin về sản lượng và khu đất canh tác
            </Text>
          </Space>
        </Flex>

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
                { type: "number", message: "Vui lòng chọn khu đất" },
              ]}
              initialValue={selectedTemplate?.yield_id}
            >
              <Select
                size="large"
                placeholder={t("plans.fields.land.placeholder")}
                options={yieldsOptions}
                showSearch
                optionFilterProp="label"
                notFoundContent="Không tìm thấy khu đất"
                optionRender={(option) => {
                  const yield_ = yieldMap[option.value as number];
                  return yield_ ? <YieldOption data={yield_} /> : option.label;
                }}
                dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
              />
            </Form.Item>
          </Col>
        </Row>

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
                title: "Sản lượng dự kiến thu hoạch (kg)",
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
                title: "Lượng giống cần sử dụng (kg)",
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
