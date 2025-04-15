import { useTranslate, useGetToPath, useGo, useGetIdentity } from "@refinedev/core";
import {
  Drawer,
  Form,
  Select,
  InputNumber,
  Space,
  Button,
  Table,
  Tag,
  Typography,
  theme,
  Flex,
  Spin,
  DatePicker,
} from "antd";
import {
  ShopOutlined,
  TagOutlined,
  NumberOutlined,
  FileTextOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useSearchParams } from "react-router";
import { useTemplatePlan, type TemplatePlanResponse } from "@/hooks/useTemplatePlan";
import { useOrderStore } from "@/store/order-store";

const { Text } = Typography;

type Template = {
  id: number;
  name: string;
  description: string;
  caring_tasks: any[];
  harvesting_tasks: any[];
  inspecting_forms: any[];
  packaging_tasks: any[];
};

type TemplateSelectionProps = {
  open: boolean;
  onClose: () => void;
  onTemplateSelect: (template: Template) => void;
};

export const TemplateSelection = ({ open, onClose, onTemplateSelect }: TemplateSelectionProps) => {
  const t = useTranslate();
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const [isTemplateListVisible, setIsTemplateListVisible] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const { getTemplatePlan, isLoading, data, plantsOptions, yieldsOptions } = useTemplatePlan();
  const { selectedOrders, selectedPlantId, totalQuantity } = useOrderStore();
  const { data: identity } = useGetIdentity<{ id: number; name: string }>();
  const expert_id = identity?.id;
  const expert_name = identity?.name;

  useEffect(() => {
    if (selectedPlantId) {
      form.setFieldsValue({ plant_id: selectedPlantId });
    }
    if (totalQuantity) {
      form.setFieldsValue({ estimated_product: totalQuantity });
    }
  }, [selectedPlantId, totalQuantity, form]);

  const onDrawerClose = () => {
    onClose();

    go({
      to:
        searchParams.get("to") ??
        getToPath({
          action: "list",
        }) ??
        "",
      query: {
        to: undefined,
      },
      options: {
        keepQuery: true,
      },
      type: "replace",
    });
  };

  const handleTemplateInfoSubmit = async (values: any) => {
    // Format selected orders to match API requirements
    const formattedOrders = selectedOrders.map((order) => ({
      id: parseInt(order.id),
      quantity: order.quantity,
    }));

    getTemplatePlan({
      orders: formattedOrders,
      plant_id: values.plant_id,
      yield_id: values.yield_id,
      start_date: dayjs(values.start_date).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
      estimated_product: values.estimated_product,
      seed_quantity: 50,
      expert_id: expert_id as number,
      created_by: expert_name as string,
    });
  };

  // Update templates when API response is received
  useEffect(() => {
    if (data && Array.isArray(data)) {
      const formattedTemplates = data.map(
        (template: TemplatePlanResponse["data"][0], index: number) => ({
          id: index + 1,
          name: `Template ${index + 1}`,
          description: `Template cho ${template.season_name}`,
          caring_tasks: template.caring_tasks || [],
          harvesting_tasks: template.harvesting_tasks || [],
          inspecting_forms: template.inspecting_forms || [],
          packaging_tasks: template.packaging_tasks || [],
        }),
      );
      setTemplates(formattedTemplates);
      setIsTemplateListVisible(true);
    }
  }, [data]);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    onTemplateSelect(template);
    onClose();
  };

  return (
    <>
      <Drawer
        open={open}
        title="Nhập thông tin để tìm template phù hợp"
        width={1200}
        onClose={onDrawerClose}
        styles={{
          header: { padding: "16px 24px", borderBottom: `1px solid ${token.colorBorderSecondary}` },
          footer: { padding: "16px 24px", borderTop: `1px solid ${token.colorBorderSecondary}` },
          content: { padding: 0, background: token.colorBgContainer },
        }}
        footer={
          <Flex align="center" justify="space-between">
            <Button size="large" onClick={onDrawerClose}>
              {t("buttons.cancel")}
            </Button>
            <Button
              size="large"
              type="primary"
              onClick={() => {
                const values = form.getFieldsValue();
                handleTemplateInfoSubmit(values);
              }}
            >
              Tìm template
            </Button>
          </Flex>
        }
      >
        <Spin spinning={isLoading}>
          <Form form={form} layout="vertical">
            <Space direction="vertical" size="small" style={{ width: "100%", padding: "24px" }}>
              <Form.Item
                label={
                  <span>
                    <ShopOutlined /> {t("plans.fields.plant.label")}
                  </span>
                }
                name="plant_id"
                rules={[{ required: true, message: t("plans.fields.plant.required") }]}
              >
                <Select
                  size="large"
                  placeholder={t("plans.fields.plant.placeholder")}
                  options={plantsOptions}
                  disabled={!!selectedPlantId}
                />
              </Form.Item>

              <Form.Item
                label={
                  <span>
                    <TagOutlined /> {t("plans.fields.yield.label")}
                  </span>
                }
                name="yield_id"
                rules={[{ required: true, message: t("plans.fields.yield.required") }]}
              >
                <Select
                  size="large"
                  placeholder={t("plans.fields.yield.placeholder")}
                  options={yieldsOptions}
                />
              </Form.Item>

              <Form.Item
                label={
                  <span>
                    <CalendarOutlined /> {t("plans.fields.startDate.label")}
                  </span>
                }
                name="start_date"
                rules={[{ required: true, message: t("plans.fields.startDate.required") }]}
              >
                <DatePicker size="large" style={{ width: "100%" }} format="DD/MM/YYYY" />
              </Form.Item>

              <Form.Item
                label={
                  <span>
                    <NumberOutlined /> {t("plans.fields.estimatedProduct.label")}
                  </span>
                }
                name="estimated_product"
                rules={[{ required: true, message: t("plans.fields.estimatedProduct.required") }]}
              >
                <InputNumber
                  size="large"
                  min={0}
                  style={{ width: "100%" }}
                  placeholder="0"
                  addonAfter="kg"
                  value={totalQuantity}
                />
              </Form.Item>
            </Space>
          </Form>
        </Spin>
      </Drawer>

      <Drawer
        open={isTemplateListVisible}
        title="Chọn template"
        width={960}
        onClose={() => setIsTemplateListVisible(false)}
        styles={{
          header: { padding: "16px 24px", borderBottom: `1px solid ${token.colorBorderSecondary}` },
          footer: { padding: "16px 24px", borderTop: `1px solid ${token.colorBorderSecondary}` },
          content: { padding: 0, background: token.colorBgContainer },
        }}
        footer={
          <Flex align="center" justify="space-between">
            <Button size="large" onClick={() => setIsTemplateListVisible(false)}>
              {t("buttons.cancel")}
            </Button>
            <Button
              size="large"
              type="primary"
              disabled={!selectedTemplate}
              onClick={() => {
                if (selectedTemplate) {
                  handleTemplateSelect(selectedTemplate);
                }
              }}
            >
              Xác nhận
            </Button>
          </Flex>
        }
      >
        <Spin spinning={isLoading}>
          <Space direction="vertical" size="small" style={{ width: "100%", padding: "24px" }}>
            <Table<Template>
              columns={[
                {
                  title: "Tên template",
                  dataIndex: "name",
                  width: "15%",
                },
                {
                  title: "Mô tả",
                  dataIndex: "description",
                  width: "20%",
                },
                {
                  title: "Công việc chăm sóc",
                  dataIndex: "caring_tasks",
                  width: "25%",
                  render: (tasks) => (
                    <Space direction="vertical" size="small">
                      {tasks.map((task: any, index: number) => (
                        <Space key={index} direction="vertical" size={0}>
                          <Text strong>{task.task_name}</Text>
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            {dayjs(task.start_date).format("DD/MM/YYYY")} -{" "}
                            {dayjs(task.end_date).format("DD/MM/YYYY")}
                          </Text>
                          {task.description && (
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                              {task.description}
                            </Text>
                          )}
                        </Space>
                      ))}
                    </Space>
                  ),
                },
                {
                  title: "Công việc thu hoạch",
                  dataIndex: "harvesting_tasks",
                  width: "20%",
                  render: (tasks) => (
                    <Space direction="vertical" size="small">
                      {tasks.map((task: any, index: number) => (
                        <Space key={index} direction="vertical" size={0}>
                          <Text strong>{task.task_name}</Text>
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            {dayjs(task.start_date).format("DD/MM/YYYY")} -{" "}
                            {dayjs(task.end_date).format("DD/MM/YYYY")}
                          </Text>
                          {task.description && (
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                              {task.description}
                            </Text>
                          )}
                        </Space>
                      ))}
                    </Space>
                  ),
                },
                {
                  title: "Đóng gói",
                  dataIndex: "packaging_tasks",
                  width: "20%",
                  render: (tasks) => (
                    <Space direction="vertical" size="small">
                      {tasks.map((task: any, index: number) => (
                        <Space key={index} direction="vertical" size={0}>
                          <Text strong>{task.task_name}</Text>
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            {dayjs(task.start_date).format("DD/MM/YYYY")} -{" "}
                            {dayjs(task.end_date).format("DD/MM/YYYY")}
                          </Text>
                          {task.description && (
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                              {task.description}
                            </Text>
                          )}
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            Tổng khối lượng: {task.total_package_weight}kg
                          </Text>
                        </Space>
                      ))}
                    </Space>
                  ),
                },
              ]}
              dataSource={templates}
              pagination={false}
              onRow={(record) => ({
                onClick: () => setSelectedTemplate(record),
                style: {
                  cursor: "pointer",
                  background: selectedTemplate?.id === record.id ? token.colorPrimaryBg : "inherit",
                },
              })}
              rowKey="id"
              scroll={{ x: "max-content" }}
            />
          </Space>
        </Spin>
      </Drawer>
    </>
  );
};
