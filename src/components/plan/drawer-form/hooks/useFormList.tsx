import { useTranslate } from "@refinedev/core";
import { UseFormReturnType } from "@refinedev/antd";
import {
  theme,
  Space,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Card,
  Typography,
  Table,
  Tag,
  Flex,
  Button,
  Tabs,
} from "antd";
import {
  TagOutlined,
  ShopOutlined,
  NumberOutlined,
  FileTextOutlined,
  CheckOutlined,
  EnvironmentOutlined,
  ToolOutlined,
  PlusOutlined,
  CalendarOutlined,
  DeleteOutlined,
  FileSearchOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { IPlant, Template } from "@/interfaces";
import dayjs from "dayjs";
import { useMemo } from "react";

const { Text } = Typography;

type PlanType = "order" | "non-order";
type TemplateType = "with-template" | "without-template";

type SummaryRecord = {
  plan_name: string;
  plant_name: string;
  season_name: string;
  start_date: string;
  end_date: string;
  estimated_product: number;
  seed_quantity: number;
  land_name: string;
};

type TaskSummaryRecord = {
  task_type: string;
  task_count: number;
};

type SelectedOrder = {
  id: string;
  quantity: number;
};

export interface UseFormListProps {
  formProps: UseFormReturnType<IPlant>["formProps"];
  planType: PlanType;
  templateType: TemplateType;
  selectedOrders: SelectedOrder[];
  onTemplateSelection: (type: TemplateType) => void;
  selectedTemplate: Template | null;
  plantsOptions: { label: string; value: number }[];
  yieldsOptions: { label: string; value: number }[];
  fertilizersOptions: { label: string; value: number }[];
  pesticidesOptions: { label: string; value: number }[];
  itemsOptions: { label: string; value: number }[];
  packagingTypesOptions: { label: string; value: number }[];
  identity: { name: string } | undefined;
}

export const useFormList = (props: UseFormListProps) => {
  const t = useTranslate();
  const { token } = theme.useToken();
  const {
    planType,
    templateType,
    selectedOrders,
    onTemplateSelection,
    selectedTemplate,
    plantsOptions,
    yieldsOptions,
    fertilizersOptions,
    pesticidesOptions,
    itemsOptions,
    packagingTypesOptions,
    formProps,
    identity,
  } = props;

  const formList = useMemo(() => {
    // Step 1: Basic Information & Orders
    const step1 = (
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        <Form.Item
          label={
            <span>
              <ShopOutlined /> {t("plans.fields.plan_name.label")}
            </span>
          }
          name="plan_name"
          rules={[
            { required: true, message: t("plans.fields.plan_name.required") },
            { min: 3, message: t("plans.validation.description_min_length") },
            { max: 500, message: t("plans.validation.description_max_length") },
          ]}
          initialValue={selectedTemplate ? `Kế hoạch ${selectedTemplate.name}` : undefined}
        >
          <Input
            size="large"
            placeholder={t("plans.fields.plan_name.placeholder")}
            prefix={<ShopOutlined style={{ color: token.colorTextTertiary }} />}
          />
        </Form.Item>

        <Form.Item
          label={
            <span>
              <ShopOutlined /> {t("plans.fields.plant.label")}
            </span>
          }
          name="plant_id"
          rules={[{ required: true, message: t("plans.fields.plant.required") }]}
          initialValue={selectedTemplate?.plant_id}
        >
          <Select
            size="large"
            placeholder={t("plans.fields.plant.placeholder")}
            options={plantsOptions}
          />
        </Form.Item>

        <Form.Item
          label={
            <span>
              <TagOutlined /> {t("plans.fields.season.label")}
            </span>
          }
          name="season_name"
          rules={[{ required: true, message: t("plans.fields.season.required") }]}
          initialValue={selectedTemplate?.season_name}
        >
          <Select
            size="large"
            placeholder={t("plans.fields.season.placeholder")}
            options={[
              { value: "Quanh năm", label: "Quanh năm" },
              { value: "Xuân", label: "Xuân" },
              { value: "Hạ", label: "Hạ" },
              { value: "Thu", label: "Thu" },
              { value: "Đông", label: "Đông" },
            ]}
          />
        </Form.Item>

        <Form.Item
          label={
            <span>
              <CalendarOutlined /> {t("plans.fields.start_date.label")}
            </span>
          }
          name="start_date"
          rules={[
            { required: true, message: t("plans.fields.start_date.required") },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || !getFieldValue("end_date")) {
                  return Promise.resolve();
                }
                if (dayjs(value).isAfter(dayjs(getFieldValue("end_date")))) {
                  return Promise.reject(new Error(t("plans.validation.start_date_before_end")));
                }
                return Promise.resolve();
              },
            }),
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
            placeholder={t("plans.fields.start_date.placeholder")}
          />
        </Form.Item>

        <Form.Item
          label={
            <span>
              <CalendarOutlined /> {t("plans.fields.end_date.label")}
            </span>
          }
          name="end_date"
          rules={[
            { required: true, message: t("plans.fields.end_date.required") },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || !getFieldValue("start_date")) {
                  return Promise.resolve();
                }
                if (dayjs(value).isBefore(dayjs(getFieldValue("start_date")))) {
                  return Promise.reject(new Error(t("plans.validation.end_date_after_start")));
                }
                return Promise.resolve();
              },
            }),
          ]}
          initialValue={selectedTemplate?.end_date ? dayjs(selectedTemplate.end_date) : undefined}
        >
          <DatePicker
            size="large"
            style={{ width: "100%" }}
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            placeholder={t("plans.fields.end_date.placeholder")}
          />
        </Form.Item>

        <Form.Item
          label={
            <span>
              <FileTextOutlined /> {t("plans.fields.description.label")}
            </span>
          }
          name="description"
          rules={[{ required: true, message: t("plans.fields.description.required") }]}
          initialValue={selectedTemplate?.description}
        >
          <Input.TextArea
            rows={3}
            placeholder={t("plans.fields.description.placeholder")}
            style={{ resize: "none" }}
          />
        </Form.Item>
      </Space>
    );

    // Step 2: Tasks & Activities
    const step2 = (
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        <Card>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Flex justify="space-between" align="center">
              <Space direction="vertical" size="small">
                <Text strong style={{ fontSize: "16px" }}>
                  Thông tin sản lượng
                </Text>
                <Text type="secondary">Nhập thông tin về sản lượng và khu đất canh tác</Text>
              </Space>
            </Flex>

            <Form.Item
              label={
                <span>
                  <EnvironmentOutlined /> {t("plans.fields.land.label")}
                </span>
              }
              name="yield_id"
              rules={[{ required: true, message: t("plans.fields.land.required") }]}
              initialValue={selectedTemplate?.yield_id}
            >
              <Select
                size="large"
                placeholder={t("plans.fields.land.placeholder")}
                options={yieldsOptions}
              />
            </Form.Item>

            <Space>
              <Form.Item
                label={
                  <span>
                    <NumberOutlined /> {t("plans.fields.estimated_product.label")}
                  </span>
                }
                name="estimated_product"
                rules={[
                  { required: true, message: t("plans.fields.estimated_product.required") },
                  { type: "number", min: 0, message: t("plans.validation.estimated_product_min") },
                ]}
                initialValue={selectedTemplate?.estimated_product}
                style={{ width: "300px" }}
              >
                <InputNumber
                  size="large"
                  min={0}
                  style={{ width: "100%" }}
                  placeholder={t("plans.fields.estimated_product.placeholder")}
                  addonAfter="kg"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span>
                    <NumberOutlined /> {t("plans.fields.seed_quantity.label")}
                  </span>
                }
                name="seed_quantity"
                rules={[
                  { required: true, message: t("plans.fields.seed_quantity.required") },
                  { type: "number", min: 0, message: t("plans.validation.seed_quantity_min") },
                ]}
                initialValue={selectedTemplate?.seed_quantity}
                style={{ width: "300px" }}
              >
                <InputNumber
                  size="large"
                  min={0}
                  style={{ width: "100%" }}
                  placeholder={t("plans.fields.seed_quantity.placeholder")}
                  addonAfter="kg"
                />
              </Form.Item>
            </Space>
          </Space>
        </Card>

        <Card>
          <Tabs
            type="card"
            defaultActiveKey="caring"
            items={[
              {
                key: "caring",
                label: (
                  <Space>
                    <ToolOutlined />
                    <span>Công việc chăm sóc</span>
                    {formProps.form?.getFieldValue("caring_tasks")?.length > 0 && (
                      <Tag color="blue">
                        {formProps.form?.getFieldValue("caring_tasks")?.length}
                      </Tag>
                    )}
                  </Space>
                ),
                children: (
                  <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    <Flex justify="space-between" align="center">
                      <Space direction="vertical" size="small">
                        <Text strong style={{ fontSize: "16px" }}>
                          Danh sách công việc chăm sóc
                        </Text>
                        <Text type="secondary">Quản lý các công việc chăm sóc cây trồng</Text>
                      </Space>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                          const currentTasks = formProps.form?.getFieldValue("caring_tasks") || [];
                          formProps.form?.setFieldsValue({
                            caring_tasks: [
                              ...currentTasks,
                              {
                                id: Date.now(),
                                task_name: "",
                                task_type: "Planting",
                                description: "",
                                start_date: dayjs(),
                                end_date: dayjs(),
                              },
                            ],
                          });
                        }}
                      >
                        Thêm công việc
                      </Button>
                    </Flex>

                    <Form.List name="caring_tasks">
                      {(fields, { add, remove }) => (
                        <div
                          style={{
                            display: "grid",
                            gap: "16px",
                            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                          }}
                        >
                          {fields.map(({ key, name, ...restField }) => (
                            <Card
                              key={key}
                              size="small"
                              actions={[
                                <Button
                                  key="delete"
                                  type="text"
                                  danger
                                  icon={<DeleteOutlined />}
                                  onClick={() => remove(name)}
                                >
                                  Xóa
                                </Button>,
                              ]}
                            >
                              {/* Card content for caring task */}
                              {/* ... (rest of the caring tasks form content) */}
                            </Card>
                          ))}
                        </div>
                      )}
                    </Form.List>
                  </Space>
                ),
              },
              {
                key: "harvesting",
                label: (
                  <Space>
                    <CheckOutlined />
                    <span>Công việc thu hoạch</span>
                    {formProps.form?.getFieldValue("harvesting_tasks")?.length > 0 && (
                      <Tag color="blue">
                        {formProps.form?.getFieldValue("harvesting_tasks")?.length}
                      </Tag>
                    )}
                  </Space>
                ),
                children: (
                  <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    {/* Harvesting tasks tab content */}
                    {/* ... */}
                  </Space>
                ),
              },
              {
                key: "inspecting",
                label: (
                  <Space>
                    <FileSearchOutlined />
                    <span>Công việc kiểm tra</span>
                    {formProps.form?.getFieldValue("inspecting_forms")?.length > 0 && (
                      <Tag color="blue">
                        {formProps.form?.getFieldValue("inspecting_forms")?.length}
                      </Tag>
                    )}
                  </Space>
                ),
                children: (
                  <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    {/* Inspecting forms tab content */}
                    {/* ... */}
                  </Space>
                ),
              },
              {
                key: "packaging",
                label: (
                  <Space>
                    <InboxOutlined />
                    <span>Công việc đóng gói</span>
                    {formProps.form?.getFieldValue("packaging_tasks")?.length > 0 && (
                      <Tag color="blue">
                        {formProps.form?.getFieldValue("packaging_tasks")?.length}
                      </Tag>
                    )}
                  </Space>
                ),
                children: (
                  <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    {/* Packaging tasks tab content */}
                    {/* ... */}
                  </Space>
                ),
              },
            ]}
          />
        </Card>
      </Space>
    );

    // Step 3: Review & Confirm
    const step3 = (
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        <Card>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Text strong>Thông tin cơ bản</Text>
            <Table<SummaryRecord>
              columns={[
                { title: "Tên kế hoạch", dataIndex: "plan_name" },
                { title: "Cây trồng", dataIndex: "plant_name" },
                { title: "Mùa vụ", dataIndex: "season_name" },
                {
                  title: "Thời gian",
                  dataIndex: "time",
                  render: (_, record) => (
                    <Space>
                      <Tag>{dayjs(record.start_date).format("DD/MM/YYYY")}</Tag>
                      <Tag>{dayjs(record.end_date).format("DD/MM/YYYY")}</Tag>
                    </Space>
                  ),
                },
              ]}
              dataSource={[
                {
                  plan_name: formProps.form?.getFieldValue("plan_name") || "",
                  plant_name:
                    plantsOptions.find((p) => p.value === formProps.form?.getFieldValue("plant_id"))
                      ?.label || "",
                  season_name: formProps.form?.getFieldValue("season_name") || "",
                  start_date: formProps.form?.getFieldValue("start_date") || "",
                  end_date: formProps.form?.getFieldValue("end_date") || "",
                  estimated_product: formProps.form?.getFieldValue("estimated_product") || 0,
                  seed_quantity: formProps.form?.getFieldValue("seed_quantity") || 0,
                  land_name:
                    yieldsOptions.find((y) => y.value === formProps.form?.getFieldValue("yield_id"))
                      ?.label || "",
                },
              ]}
              pagination={false}
            />
          </Space>
        </Card>

        {/* More review cards */}
        {/* ... */}
      </Space>
    );

    return [step1, step2, step3];
  }, [
    t,
    token,
    planType,
    templateType,
    selectedOrders,
    onTemplateSelection,
    selectedTemplate,
    plantsOptions,
    yieldsOptions,
    fertilizersOptions,
    pesticidesOptions,
    itemsOptions,
    packagingTypesOptions,
    formProps,
    identity,
  ]);

  return { formList };
};

// Export types to be used in other components
export type { PlanType, TemplateType, SelectedOrder };
