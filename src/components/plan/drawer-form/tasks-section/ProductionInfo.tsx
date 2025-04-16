import { useTranslate } from "@refinedev/core";
import { UseFormReturnType } from "@refinedev/antd";
import { Space, Form, Select, InputNumber, Card, Typography, Flex, Row, Col, theme } from "antd";
import { NumberOutlined, EnvironmentOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { IPlant, Template } from "@/interfaces";

const { Text } = Typography;

interface ProductionInfoProps {
  formProps: UseFormReturnType<IPlant>["formProps"];
  selectedTemplate: Template | null;
  yieldsOptions: { label: string; value: number }[];
}

export const ProductionInfo: React.FC<ProductionInfoProps> = ({
  formProps,
  selectedTemplate,
  yieldsOptions,
}) => {
  const t = useTranslate();
  const { token } = theme.useToken();

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
              />
            </Form.Item>
          </Col>
        </Row>
      </Space>
    </Card>
  );
};
