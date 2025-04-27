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
  Card,
  Image,
  Descriptions,
  Alert,
  Tabs,
  Collapse,
  Empty,
} from "antd";
import {
  ShopOutlined,
  TagOutlined,
  NumberOutlined,
  CalendarOutlined,
  BulbOutlined,
  ToolOutlined,
  CheckOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useSearchParams } from "react-router";
import { useTemplatePlan, useSuggestYield } from "@/hooks/useTemplatePlan";
import { useOrderStore } from "@/store/order-store";
import { ITemplatePlanResponse, IPlant, IYield, Template } from "@/interfaces";

const { Text } = Typography;

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
  const [selectedPlant, setSelectedPlant] = useState<IPlant | null>(null);
  const [selectedYield, setSelectedYield] = useState<IYield | null>(null);
  const [showSuggest, setShowSuggest] = useState(true);
  const { getTemplatePlan, isLoading, data, plantsOptions, yieldsOptions, plantsData, yieldsData } =
    useTemplatePlan();
  const { suggestYields, isLoading: isSuggestLoading } = useSuggestYield(selectedPlant?.id);
  const { selectedOrders, selectedPlantId, totalQuantity } = useOrderStore();
  const { data: identity } = useGetIdentity<{ id: number; name: string }>();
  const expert_id = identity?.id;
  const expert_name = identity?.name;

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        start_date: dayjs(),
        estimated_product: totalQuantity || 0,
        plant_id: selectedPlantId || undefined,
      });
    }
  }, [open, form, totalQuantity, selectedPlantId]);

  useEffect(() => {
    if (selectedPlantId) {
      form.setFieldsValue({ plant_id: selectedPlantId });
      const plant = plantsData.find((p) => p.id === selectedPlantId);
      setSelectedPlant(plant || null);
    }
    if (totalQuantity) {
      form.setFieldsValue({ estimated_product: totalQuantity });
    }
  }, [selectedPlantId, totalQuantity, form, plantsData]);

  useEffect(() => {
    const startDate = form.getFieldValue("start_date");
    if (selectedYield && startDate) {
      const isAfterEndDate = selectedYield.estimated_end_date
        ? new Date(startDate) > new Date(selectedYield.estimated_end_date)
        : false;

      if (selectedYield.status !== "Available" && !isAfterEndDate) {
        setSelectedYield(null);
        form.setFieldsValue({ yield_id: undefined });
      }
    }
  }, [form.getFieldValue("start_date")]);

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
      seed_quantity: 70,
      expert_id: expert_id as number,
      created_by: expert_name as string,
    });
  };

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const formattedTemplates = data.map(
        (template: ITemplatePlanResponse["data"][0], index: number) => {
          const plantName = plantsData.find((p) => p.id === template.plant_id)?.plant_name || "";
          return {
            ...template,
            name: `Kế hoạch ${plantName} - ${template.season_name}`,
            description: `Template cho ${plantName} mùa ${template.season_name}`,
          };
        },
      );
      setTemplates(formattedTemplates);
      setIsTemplateListVisible(true);
    }
  }, [data, plantsData]);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    onTemplateSelect(template);
    onClose();
  };

  const handlePlantSelect = (value: number) => {
    const plant = plantsData.find((p) => p.id === value);
    setSelectedPlant(plant || null);
    setShowSuggest(true);
  };

  const handleYieldSelect = (value: number) => {
    const yields = Array.isArray(suggestYields) ? suggestYields : suggestYields?.data || [];
    const yield_ = yields.find((y: IYield) => y.id === value);
    if (yield_) {
      setSelectedYield(yield_);
    } else {
      setSelectedYield(null);
      form.setFieldsValue({ yield_id: undefined });
    }
  };

  const handleSuggestYieldSelect = (yield_: IYield) => {
    const selectedYieldData = yieldsData.find((y) => y.id === yield_.id);
    if (selectedYieldData) {
      setSelectedYield(selectedYieldData);
      form.setFieldsValue({ yield_id: selectedYieldData.id });
      setShowSuggest(false);
    }
  };

  // Thêm useEffect để theo dõi thay đổi của selectedYield
  useEffect(() => {
    if (selectedYield) {
      form.setFieldsValue({ yield_id: selectedYield.id });
    }
  }, [selectedYield, form]);

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
              disabled={
                !selectedYield ||
                (selectedYield.status !== "Available" &&
                  selectedYield.status !== "In-Use" &&
                  (!selectedYield.estimated_end_date ||
                    new Date(form.getFieldValue("start_date")) <=
                      new Date(selectedYield.estimated_end_date)))
              }
            >
              Tìm template
            </Button>
          </Flex>
        }
      >
        <Spin spinning={isLoading}>
          <Form form={form} layout="vertical">
            <Space direction="vertical" size="large" style={{ width: "100%", padding: "24px" }}>
              <Form.Item
                label={
                  <span>
                    <CalendarOutlined /> {t("plans.fields.start_date.label")}
                  </span>
                }
                name="start_date"
                rules={[
                  { required: true, message: t("plans.fields.start_date.required") },
                  {
                    validator: (_, value) => {
                      if (value) {
                        const startDate = dayjs(value);
                        const today = dayjs().startOf("day");

                        if (startDate.isBefore(today)) {
                          return Promise.reject(new Error("Không thể chọn ngày trong quá khứ"));
                        }
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <DatePicker
                  size="large"
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                  disabledDate={(current) => {
                    if (current && current < dayjs().startOf("day")) {
                      return true;
                    }
                    return false;
                  }}
                />
              </Form.Item>

              <Form.Item
                label={
                  <span>
                    <NumberOutlined /> {t("plans.fields.estimated_product.label")}
                  </span>
                }
                name="estimated_product"
                rules={[{ required: true, message: t("plans.fields.estimated_product.required") }]}
              >
                <InputNumber
                  size="large"
                  min={0}
                  style={{ width: "100%" }}
                  placeholder={t("plans.fields.estimated_product.placeholder")}
                  addonAfter="kg"
                  value={totalQuantity}
                />
              </Form.Item>

              <Space direction="vertical" size="small" style={{ width: "100%" }}>
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
                    onChange={handlePlantSelect}
                  />
                </Form.Item>

                {selectedPlant && (
                  <Card size="small" style={{ width: "100%" }}>
                    <Flex gap="middle" align="flex-start">
                      <Image
                        src={selectedPlant.image_url}
                        alt={selectedPlant.plant_name}
                        style={{ width: 200, height: 200, objectFit: "cover" }}
                      />
                      <Descriptions bordered column={2} size="small" style={{ flex: 1 }}>
                        <Descriptions.Item label="Tên cây trồng" span={2}>
                          {selectedPlant.plant_name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Loại" span={2}>
                          {selectedPlant.type}
                        </Descriptions.Item>
                        <Descriptions.Item label="Mô tả" span={2}>
                          {selectedPlant.description}
                        </Descriptions.Item>
                        <Descriptions.Item label="Giá cơ bản">
                          {selectedPlant.base_price.toLocaleString()} VNĐ
                        </Descriptions.Item>
                        <Descriptions.Item label="Số lượng">
                          {selectedPlant.quantity}
                        </Descriptions.Item>
                        <Descriptions.Item label="Thời gian bảo quản">
                          {selectedPlant.preservation_day} ngày
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                          <Tag color={selectedPlant.status === "Available" ? "green" : "red"}>
                            {selectedPlant.status}
                          </Tag>
                        </Descriptions.Item>
                      </Descriptions>
                    </Flex>
                  </Card>
                )}
              </Space>

              <Space direction="vertical" size="small" style={{ width: "100%" }}>
                <Form.Item
                  label={
                    <span>
                      <TagOutlined /> {t("plans.fields.yield.label")}
                    </span>
                  }
                  name="yield_id"
                  rules={[{ required: true, message: t("plans.fields.yield.required") }]}
                >
                  <Space direction="vertical" size="small" style={{ width: "100%" }}>
                    <Select
                      size="large"
                      placeholder={t("plans.fields.yield.placeholder")}
                      options={yieldsOptions.map((option) => {
                        const yields = Array.isArray(suggestYields)
                          ? suggestYields
                          : suggestYields?.data || [];
                        const isSuggested = yields.some((y: IYield) => y.id === option.value);
                        const suggestedYield = yields.find((y: IYield) => y.id === option.value);
                        const isDisabled =
                          !isSuggested ||
                          (suggestedYield?.status !== "Available" &&
                            (!suggestedYield?.estimated_end_date ||
                              new Date(form.getFieldValue("start_date")) <=
                                new Date(suggestedYield.estimated_end_date)));
                        return {
                          ...option,
                          disabled: isDisabled,
                          label: (
                            <Space>
                              {option.label}
                              {!isSuggested && <Tag color="default">Không được gợi ý</Tag>}
                            </Space>
                          ),
                        };
                      })}
                      onChange={handleYieldSelect}
                      value={selectedYield?.id}
                      disabled={!selectedPlant}
                    />
                    {selectedYield && (
                      <Button
                        type="link"
                        onClick={() => setShowSuggest(true)}
                        icon={<BulbOutlined />}
                      >
                        Xem lại gợi ý vụ mùa phù hợp
                      </Button>
                    )}
                  </Space>
                </Form.Item>

                {selectedPlant &&
                  showSuggest &&
                  Array.isArray(suggestYields) &&
                  suggestYields.length > 0 && (
                    <Alert
                      message="Gợi ý vụ mùa phù hợp"
                      description={
                        <Space direction="vertical" size="small" style={{ width: "100%" }}>
                          {suggestYields.map((yield_: IYield) => {
                            const isAvailable = yield_.status === "Available";
                            const startDate = form.getFieldValue("start_date");
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
                                            {new Date(
                                              yield_.estimated_end_date,
                                            ).toLocaleDateString()}
                                          </Text>
                                          {!startDate ? (
                                            <Text type="warning">
                                              Vui lòng chọn ngày bắt đầu sau{" "}
                                              {new Date(
                                                yield_.estimated_end_date,
                                              ).toLocaleDateString()}{" "}
                                              để sử dụng
                                            </Text>
                                          ) : isAfterEndDate ? (
                                            <Text type="success">
                                              Có thể sử dụng vì ngày bắt đầu (
                                              {new Date(startDate).toLocaleDateString()}) sau ngày
                                              kết thúc
                                            </Text>
                                          ) : (
                                            <Text type="danger">
                                              Không thể sử dụng vì ngày bắt đầu (
                                              {new Date(startDate).toLocaleDateString()}) trước ngày
                                              kết thúc
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
                    />
                  )}

                {selectedYield && (
                  <Card size="small" style={{ width: "100%" }}>
                    <Descriptions bordered column={2} size="small">
                      <Descriptions.Item label="Tên vụ mùa" span={2}>
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
              </Space>
            </Space>
          </Form>
        </Spin>
      </Drawer>

      <Drawer
        open={isTemplateListVisible}
        title="Chọn template"
        width={1050}
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
          <Space direction="vertical" size="large" style={{ width: "100%", padding: "24px" }}>
            {selectedTemplate && (
              <Card
                style={{
                  border: `1px solid ${token.colorPrimary}`,
                  background: token.colorPrimaryBg,
                }}
              >
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                  <Flex justify="space-between" align="center">
                    <Text strong style={{ fontSize: "16px" }}>
                      {selectedTemplate.name}
                    </Text>
                    <Tag color="blue">Template đã chọn</Tag>
                  </Flex>
                  <Text type="secondary">{selectedTemplate.description}</Text>
                </Space>
              </Card>
            )}

            <Tabs
              defaultActiveKey="1"
              items={[
                {
                  key: "1",
                  label: "Danh sách template",
                  children: (
                    <Table<Template>
                      columns={[
                        {
                          title: "Tên template",
                          dataIndex: "name",
                          width: "20%",
                          render: (text, record) => (
                            <Space direction="vertical" size="small">
                              <Text strong>{text}</Text>
                              <Text type="secondary" style={{ fontSize: "12px" }}>
                                {record.description}
                              </Text>
                            </Space>
                          ),
                        },
                        {
                          title: "Thông tin cơ bản",
                          width: "20%",
                          render: (_, record) => (
                            <Space direction="vertical" size="small">
                              <Text>
                                <TagOutlined /> Cây trồng:{" "}
                                {plantsData.find((p) => p.id === record.plant_id)?.plant_name}
                              </Text>
                              <Text>
                                <CalendarOutlined /> Mùa vụ: {record.season_name}
                              </Text>
                            </Space>
                          ),
                        },
                        {
                          title: "Công việc",
                          width: "60%",
                          render: (_, record) => (
                            <Space direction="vertical" size="small" style={{ width: "100%" }}>
                              <Collapse
                                ghost
                                items={[
                                  {
                                    key: "caring",
                                    label: (
                                      <Space>
                                        <ToolOutlined />
                                        <Text>
                                          Chăm sóc ({record.caring_tasks?.length || 0} công việc)
                                        </Text>
                                      </Space>
                                    ),
                                    children: (
                                      <Space
                                        direction="vertical"
                                        size="small"
                                        style={{ width: "100%" }}
                                      >
                                        {record.caring_tasks?.map((task, index) => (
                                          <Card
                                            key={index}
                                            size="small"
                                            style={{ background: token.colorBgContainer }}
                                          >
                                            <Space direction="vertical" size={0}>
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
                                          </Card>
                                        ))}
                                      </Space>
                                    ),
                                  },
                                  {
                                    key: "harvesting",
                                    label: (
                                      <Space>
                                        <CheckOutlined />
                                        <Text>
                                          Thu hoạch ({record.harvesting_tasks?.length || 0} công
                                          việc)
                                        </Text>
                                      </Space>
                                    ),
                                    children: (
                                      <Space
                                        direction="vertical"
                                        size="small"
                                        style={{ width: "100%" }}
                                      >
                                        {record.harvesting_tasks?.map((task, index) => (
                                          <Card
                                            key={index}
                                            size="small"
                                            style={{ background: token.colorBgContainer }}
                                          >
                                            <Space direction="vertical" size={0}>
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
                                          </Card>
                                        ))}
                                      </Space>
                                    ),
                                  },
                                  {
                                    key: "packaging",
                                    label: (
                                      <Space>
                                        <InboxOutlined />
                                        <Text>
                                          Đóng gói ({record.packaging_tasks?.length || 0} công việc)
                                        </Text>
                                      </Space>
                                    ),
                                    children: (
                                      <Space
                                        direction="vertical"
                                        size="small"
                                        style={{ width: "100%" }}
                                      >
                                        {record.packaging_tasks?.map((task, index) => (
                                          <Card
                                            key={index}
                                            size="small"
                                            style={{ background: token.colorBgContainer }}
                                          >
                                            <Space direction="vertical" size={0}>
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
                                          </Card>
                                        ))}
                                      </Space>
                                    ),
                                  },
                                ]}
                              />
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
                          background:
                            selectedTemplate?.id === record.id ? token.colorPrimaryBg : "inherit",
                        },
                      })}
                      rowKey="id"
                      scroll={{ x: "max-content" }}
                    />
                  ),
                },
                {
                  key: "2",
                  label: "Chi tiết template",
                  children: selectedTemplate ? (
                    <Space direction="vertical" size="large" style={{ width: "100%" }}>
                      <Card>
                        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                          <Text strong style={{ fontSize: "16px" }}>
                            {selectedTemplate.name}
                          </Text>
                          <Text type="secondary">{selectedTemplate.description}</Text>
                          <Space>
                            <Tag>
                              <TagOutlined />{" "}
                              {
                                plantsData.find((p) => p.id === selectedTemplate.plant_id)
                                  ?.plant_name
                              }
                            </Tag>
                            <Tag>
                              <CalendarOutlined /> {selectedTemplate.season_name}
                            </Tag>
                          </Space>
                        </Space>
                      </Card>

                      <Tabs
                        items={[
                          {
                            key: "caring",
                            label: (
                              <Space>
                                <ToolOutlined />
                                <Text>Công việc chăm sóc</Text>
                                <Tag>{selectedTemplate.caring_tasks?.length || 0}</Tag>
                              </Space>
                            ),
                            children: (
                              <Space direction="vertical" size="small" style={{ width: "100%" }}>
                                {selectedTemplate.caring_tasks?.map((task, index) => (
                                  <Card key={index} size="small">
                                    <Space direction="vertical" size={0}>
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
                                  </Card>
                                ))}
                              </Space>
                            ),
                          },
                          {
                            key: "harvesting",
                            label: (
                              <Space>
                                <CheckOutlined />
                                <Text>Công việc thu hoạch</Text>
                                <Tag>{selectedTemplate.harvesting_tasks?.length || 0}</Tag>
                              </Space>
                            ),
                            children: (
                              <Space direction="vertical" size="small" style={{ width: "100%" }}>
                                {selectedTemplate.harvesting_tasks?.map((task, index) => (
                                  <Card key={index} size="small">
                                    <Space direction="vertical" size={0}>
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
                                  </Card>
                                ))}
                              </Space>
                            ),
                          },
                          {
                            key: "packaging",
                            label: (
                              <Space>
                                <InboxOutlined />
                                <Text>Công việc đóng gói</Text>
                                <Tag>{selectedTemplate.packaging_tasks?.length || 0}</Tag>
                              </Space>
                            ),
                            children: (
                              <Space direction="vertical" size="small" style={{ width: "100%" }}>
                                {selectedTemplate.packaging_tasks?.map((task, index) => (
                                  <Card key={index} size="small">
                                    <Space direction="vertical" size={0}>
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
                                  </Card>
                                ))}
                              </Space>
                            ),
                          },
                        ]}
                      />
                    </Space>
                  ) : (
                    <Empty description="Vui lòng chọn một template để xem chi tiết" />
                  ),
                },
              ]}
            />
          </Space>
        </Spin>
      </Drawer>
    </>
  );
};
