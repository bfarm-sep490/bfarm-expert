import { useList, useTranslate } from "@refinedev/core";
import { UseFormReturnType } from "@refinedev/antd";
import {
  Space,
  Form,
  Input,
  Select,
  DatePicker,
  theme,
  Row,
  Col,
  Card,
  Typography,
  Image,
  Tag,
} from "antd";
import {
  ShopOutlined,
  TagOutlined,
  FileTextOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { IPlant, Template } from "@/interfaces";
import dayjs from "dayjs";
import React from "react";

const { Title, Text } = Typography;

interface BasicInformationProps {
  formProps: UseFormReturnType<IPlant>["formProps"];
  selectedTemplate: Template | null;
  plantsOptions: { label: string; value: number }[];
  isPlantFromOrder?: boolean;
}

// Custom option renderer cho plant selection
const PlantOption = ({ data }: { data: IPlant }) => {
  const { token } = theme.useToken();

  return (
    <div style={{ padding: "8px 0" }}>
      <Space align="start" size="middle">
        <Image
          src={data.image_url}
          alt={data.plant_name}
          width={60}
          height={60}
          style={{ objectFit: "cover", borderRadius: token.borderRadius }}
          fallback="https://via.placeholder.com/60"
        />
        <Space direction="vertical" size="small" style={{ flex: 1 }}>
          <Text strong>{data.plant_name}</Text>
          <Space size="small">
            <Tag color="blue">{data.type}</Tag>
            <Tag color="green">{data.status}</Tag>
          </Space>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            <InfoCircleOutlined style={{ marginRight: 4 }} />
            {data.description}
          </Text>
          <Space size="small">
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Tỷ lệ sản xuất: {data.average_estimated_per_one} kg/hạt
            </Text>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Giá cơ bản: {data.base_price.toLocaleString()} đ/kg
            </Text>
          </Space>
        </Space>
      </Space>
    </div>
  );
};

export const BasicInformation: React.FC<BasicInformationProps> = ({
  formProps,
  selectedTemplate,
  plantsOptions,
  isPlantFromOrder = false,
}) => {
  const t = useTranslate();
  const { token } = theme.useToken();

  // Lấy thông tin chi tiết của cây trồng
  const { data: plantData } = useList<IPlant>({
    resource: "plants",
    filters: [
      {
        field: "id",
        operator: "in",
        value: plantsOptions.map((option) => option.value),
      },
    ],
  });

  // Tạo map để truy cập nhanh thông tin cây trồng
  const plantMap = React.useMemo(() => {
    if (!plantData?.data) return {};
    return plantData.data.reduce(
      (acc, plant) => {
        acc[plant.id] = plant;
        return acc;
      },
      {} as Record<number, IPlant>,
    );
  }, [plantData]);

  const validateEndDate = (_: any, value: dayjs.Dayjs) => {
    const startDate = formProps.form?.getFieldValue("start_date");
    if (startDate && value && value.isBefore(startDate)) {
      return Promise.reject("Ngày kết thúc phải sau ngày bắt đầu");
    }
    return Promise.resolve();
  };

  const validateStartDate = (_: any, value: dayjs.Dayjs) => {
    const endDate = formProps.form?.getFieldValue("end_date");
    if (endDate && value && value.isAfter(endDate)) {
      return Promise.reject("Ngày bắt đầu phải trước ngày kết thúc");
    }
    return Promise.resolve();
  };

  return (
    <div
      style={{
        maxWidth: 1024,
        margin: "0 auto",
        padding: "0 16px",
      }}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card>
          <Title level={4} style={{ marginBottom: 24 }}>
            Thông tin cơ bản
          </Title>

          <Form.Item
            label={
              <span>
                <ShopOutlined /> {t("plans.fields.planName.label")}
              </span>
            }
            name="plan_name"
            rules={[
              { required: true, message: t("plans.fields.planName.required") },
              { max: 100, message: "Tên kế hoạch không được vượt quá 100 ký tự" },
              { whitespace: true, message: "Tên kế hoạch không được chỉ chứa khoảng trắng" },
            ]}
            initialValue={selectedTemplate ? `Kế hoạch ${selectedTemplate.name}` : undefined}
          >
            <Input
              size="large"
              placeholder={t("plans.fields.planName.placeholder")}
              prefix={<ShopOutlined style={{ color: token.colorTextTertiary }} />}
            />
          </Form.Item>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label={
                  <span>
                    <ShopOutlined /> {t("plans.fields.plant.label")}
                  </span>
                }
                name="plant_id"
                rules={[
                  { required: true, message: t("plans.fields.plant.required") },
                  { type: "number", message: "Vui lòng chọn cây trồng" },
                ]}
                initialValue={selectedTemplate?.plant_id}
                extra={isPlantFromOrder ? "Cây trồng đã được chọn từ đơn hàng" : undefined}
              >
                <Select
                  size="large"
                  placeholder={t("plans.fields.plant.placeholder")}
                  options={plantsOptions}
                  showSearch
                  optionFilterProp="label"
                  notFoundContent="Không tìm thấy cây trồng"
                  optionRender={(option) => {
                    const plant = plantMap[option.value as number];
                    return plant ? <PlantOption data={plant} /> : option.label;
                  }}
                  dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                  disabled={isPlantFromOrder}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <span>
                    <TagOutlined /> {t("plans.fields.season.label")}
                  </span>
                }
                name="season_name"
                rules={[
                  { required: true, message: t("plans.fields.season.required") },
                  { type: "string", message: "Vui lòng chọn mùa vụ" },
                ]}
                initialValue={selectedTemplate?.season_name}
              >
                <Select
                  size="large"
                  placeholder={t("plans.fields.season.placeholder")}
                  options={[
                    { value: "Mùa Xuân", label: "Mùa Xuân" },
                    { value: "Mùa Hạ", label: "Mùa Hạ" },
                    { value: "Mùa Thu", label: "Mùa Thu" },
                    { value: "Mùa Đông", label: "Mùa Đông" },
                    { value: "Quanh năm", label: "Quanh năm" },
                    { value: "Mùa Chính", label: "Mùa Chính" },
                    { value: "Mùa Phụ", label: "Mùa Phụ" },
                  ]}
                  notFoundContent="Không tìm thấy mùa vụ"
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card>
          <Title level={4} style={{ marginBottom: 24 }}>
            Thời gian thực hiện
          </Title>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label={
                  <span>
                    <CalendarOutlined /> {t("plans.fields.startDate.label")}
                  </span>
                }
                name="start_date"
                rules={[
                  { required: true, message: t("plans.fields.startDate.required") },
                  { validator: validateStartDate },
                ]}
                initialValue={
                  selectedTemplate?.start_date ? dayjs(selectedTemplate.start_date) : undefined
                }
              >
                <DatePicker
                  size="large"
                  style={{ width: "100%" }}
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={(current) => {
                    return current && current < dayjs().startOf("day");
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <span>
                    <CalendarOutlined /> {t("plans.fields.endDate.label")}
                  </span>
                }
                name="end_date"
                rules={[
                  { required: true, message: t("plans.fields.endDate.required") },
                  { validator: validateEndDate },
                ]}
                initialValue={
                  selectedTemplate?.end_date ? dayjs(selectedTemplate.end_date) : undefined
                }
              >
                <DatePicker
                  size="large"
                  style={{ width: "100%" }}
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={(current) => {
                    const startDate = formProps.form?.getFieldValue("start_date");
                    return current && startDate && current < dayjs(startDate).startOf("day");
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card>
          <Title level={4} style={{ marginBottom: 24 }}>
            Mô tả kế hoạch
          </Title>

          <Form.Item
            label={
              <span>
                <FileTextOutlined /> {t("plans.fields.description.label")}
              </span>
            }
            name="description"
            rules={[{ max: 500, message: "Mô tả không được vượt quá 500 ký tự", required: true }]}
            initialValue={selectedTemplate?.description}
          >
            <Input.TextArea
              rows={4}
              placeholder={t("plans.fields.description.placeholder")}
              style={{ resize: "none" }}
              showCount
              maxLength={500}
            />
          </Form.Item>
        </Card>
      </Space>
    </div>
  );
};
