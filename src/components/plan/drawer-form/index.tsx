import { useTranslate, useGetToPath, useGo, useGetIdentity } from "@refinedev/core";
import { SaveButton, useStepsForm, type UseFormReturnType } from "@refinedev/antd";
import {
  Form,
  Input,
  Button,
  Steps,
  Flex,
  theme,
  Select,
  InputNumber,
  Space,
  Drawer,
  Spin,
  DatePicker,
  Card,
  Typography,
  Table,
  Tag,
  Modal,
} from "antd";
import {
  InfoCircleOutlined,
  TagOutlined,
  ShopOutlined,
  NumberOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  ToolOutlined,
  CheckOutlined,
  PlusOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

import { useMemo, useState, useEffect } from "react";
import { IPlan, IPlant } from "@/interfaces";
import dayjs from "dayjs";
import { PlanSelectionModal } from "../plan-selection-modal";
import { TemplateSelection } from "../template-selection";
import { useOrderStore } from "@/store/order-store";

const { Text } = Typography;

type Props = {
  action: "create";
  onClose?: () => void;
  onMutationSuccess?: () => void;
};

type PlanType = "order" | "non-order";
type TemplateType = "with-template" | "without-template";

type Template = {
  id: number;
  name: string;
  description: string;
  caring_tasks: any[];
  harvesting_tasks: any[];
  inspecting_forms: any[];
  packaging_tasks: any[];
};

type TaskRecord = {
  task_name: string;
  task_type?: string;
  start_date: string;
  end_date: string;
  created_by: string;
};

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

export const PlanDrawer = (props: Props) => {
  const t = useTranslate();
  const getToPath = useGetToPath();
  const go = useGo();
  const { token } = theme.useToken();
  const { data: identity } = useGetIdentity<{ id: number; name: string }>();
  const expert_id = identity?.id;
  const expert_name = identity?.name;
  const [planType, setPlanType] = useState<PlanType>("order");
  const [templateType, setTemplateType] = useState<TemplateType>("without-template");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isTemplateModalVisible, setIsTemplateModalVisible] = useState(false);
  const [isPlanSelectionModalVisible, setIsPlanSelectionModalVisible] = useState(true);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isTemplateSelectionVisible, setIsTemplateSelectionVisible] = useState(false);

  const { selectedOrders, clearOrders } = useOrderStore();

  const handlePlanSelection = (type: PlanType) => {
    setPlanType(type);
    setIsPlanSelectionModalVisible(false);
    setIsTemplateModalVisible(true);
    go({
      to: `${getToPath({
        action: "create",
      })}`,
      type: "replace",
      options: {
        keepQuery: true,
      },
    });
  };

  const handleTemplateSelection = (type: TemplateType) => {
    setTemplateType(type);
    setIsTemplateModalVisible(false);
    if (type === "with-template") {
      setIsTemplateSelectionVisible(true);
    } else {
      setIsDrawerVisible(true);
    }
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setIsTemplateSelectionVisible(false);
    setIsDrawerVisible(true);
    // Apply template data to form
    formProps.form?.setFieldsValue({
      caring_tasks: template.caring_tasks,
      harvesting_tasks: template.harvesting_tasks,
      inspecting_forms: template.inspecting_forms,
      packaging_tasks: template.packaging_tasks,
    });
  };

  const { current, gotoStep, stepsProps, formProps, saveButtonProps, formLoading } =
    useStepsForm<IPlan>({
      resource: "plans/with-details",
      action: props?.action,
      redirect: false,
      onMutationSuccess: () => {
        props.onMutationSuccess?.();
      },
      defaultFormValues: {
        expert_id: expert_id as number,
        created_by: expert_name as string,
      },
    });
  const { formList } = useFormList({
    formProps,
    planType,
    templateType,
    selectedOrders,
    onTemplateSelection: handleTemplateSelection,
    selectedTemplate,
  });

  const onDrawerClose = () => {
    close();
    clearOrders();
    if (props?.onClose) {
      props.onClose();
      return;
    }

    go({
      to:
        getToPath({
          action: "list",
        }) ?? "",
      type: "replace",
      options: {
        keepQuery: true,
      },
    });
  };

  const isLastStep = current === formList.length - 1;
  const isFirstStep = current === 0;

  return (
    <>
      <PlanSelectionModal
        open={isPlanSelectionModalVisible}
        onClose={() => {
          clearOrders();
          onDrawerClose();
        }}
        onCreateWithOrders={() => {
          handlePlanSelection("order");
        }}
        onCreateNormal={() => {
          handlePlanSelection("non-order");
        }}
      />

      <Modal
        title="Chọn phương thức tạo kế hoạch"
        open={isTemplateModalVisible}
        onCancel={() => {
          clearOrders();
          onDrawerClose();
        }}
        footer={null}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Card
            hoverable
            style={{
              width: "100%",
              cursor: "pointer",
              borderColor: templateType === "with-template" ? "#1890ff" : "#d9d9d9",
            }}
            onClick={() => handleTemplateSelection("with-template")}
          >
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
              <Space>
                <FileTextOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
                <Text strong>Sử dụng template</Text>
              </Space>
              <Text type="secondary">
                Tạo kế hoạch từ template có sẵn. Bạn cần nhập thông tin cơ bản để lấy template phù
                hợp.
              </Text>
            </Space>
          </Card>

          <Card
            hoverable
            style={{
              width: "100%",
              cursor: "pointer",
              borderColor: templateType === "without-template" ? "#1890ff" : "#d9d9d9",
            }}
            onClick={() => handleTemplateSelection("without-template")}
          >
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
              <Space>
                <InfoCircleOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
                <Text strong>Tạo mới</Text>
              </Space>
              <Text type="secondary">Tạo kế hoạch mới từ đầu, không sử dụng template</Text>
            </Space>
          </Card>
        </Space>
      </Modal>

      <TemplateSelection
        open={isTemplateSelectionVisible}
        onClose={() => setIsTemplateSelectionVisible(false)}
        onTemplateSelect={handleTemplateSelect}
      />

      <Drawer
        open={isDrawerVisible}
        title="Tạo kế hoạch"
        width="100%"
        styles={{
          header: { padding: "16px 24px", borderBottom: `1px solid ${token.colorBorderSecondary}` },
          footer: { padding: "16px 24px", borderTop: `1px solid ${token.colorBorderSecondary}` },
          content: { padding: 0, background: token.colorBgContainer },
        }}
        closable={false}
        footer={
          <Flex align="center" justify="space-between">
            <Button size="large" onClick={onDrawerClose}>
              {t("buttons.cancel")}
            </Button>
            <Flex align="center" gap={16}>
              <Flex align="center" gap={16}>
                <Button size="large" disabled={isFirstStep} onClick={() => gotoStep(current - 1)}>
                  {t("buttons.previousStep")}
                </Button>
                {isLastStep ? (
                  <SaveButton
                    size="large"
                    icon={<CheckCircleOutlined />}
                    {...saveButtonProps}
                    type="primary"
                  />
                ) : (
                  <Button size="large" type="primary" onClick={() => gotoStep(current + 1)}>
                    {t("buttons.nextStep")}
                  </Button>
                )}
              </Flex>
            </Flex>
          </Flex>
        }
      >
        <Spin spinning={formLoading}>
          <Flex vertical gap="large" style={{ padding: "24px" }}>
            <Steps
              className="site-navigation-steps"
              {...stepsProps}
              responsive
              current={current}
              style={{ marginBottom: "24px" }}
            >
              <Steps.Step title={t("plans.steps.basic")} icon={<InfoCircleOutlined />} />
              <Steps.Step title={t("plans.steps.tasks")} icon={<ToolOutlined />} />
              <Steps.Step title={t("plans.steps.review")} icon={<CheckOutlined />} />
            </Steps>

            <Form {...formProps} layout="vertical">
              {formList[current]}
            </Form>
          </Flex>
        </Spin>
      </Drawer>
    </>
  );
};

type UseFormListProps = {
  formProps: UseFormReturnType<IPlant>["formProps"];
  planType: PlanType;
  templateType: TemplateType;
  selectedOrders: SelectedOrder[];
  onTemplateSelection: (type: TemplateType) => void;
  selectedTemplate: Template | null;
};

const useFormList = (props: UseFormListProps) => {
  const t = useTranslate();
  const { token } = theme.useToken();
  const { planType, templateType, selectedOrders, onTemplateSelection, selectedTemplate } = props;

  const formList = useMemo(() => {
    // Step 1: Basic Information & Orders
    const step1 = (
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        <Form.Item
          label={
            <span>
              <ShopOutlined /> {t("plans.fields.planName.label")}
            </span>
          }
          name="plan_name"
          rules={[{ required: true, message: t("plans.fields.planName.required") }]}
        >
          <Input
            size="large"
            placeholder={t("plans.fields.planName.placeholder")}
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
        >
          <Select
            size="large"
            placeholder={t("plans.fields.plant.placeholder")}
            options={[
              { value: 1, label: "Rau muống" },
              { value: 2, label: "Rau cải" },
            ]}
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
        >
          <Select
            size="large"
            placeholder={t("plans.fields.season.placeholder")}
            options={[
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
              <CalendarOutlined /> {t("plans.fields.startDate.label")}
            </span>
          }
          name="start_date"
          rules={[{ required: true, message: t("plans.fields.startDate.required") }]}
        >
          <DatePicker
            size="large"
            style={{ width: "100%" }}
            showTime
            format="YYYY-MM-DD HH:mm:ss"
          />
        </Form.Item>

        <Form.Item
          label={
            <span>
              <CalendarOutlined /> {t("plans.fields.endDate.label")}
            </span>
          }
          name="end_date"
          rules={[{ required: true, message: t("plans.fields.endDate.required") }]}
        >
          <DatePicker
            size="large"
            style={{ width: "100%" }}
            showTime
            format="YYYY-MM-DD HH:mm:ss"
          />
        </Form.Item>

        <Form.Item
          label={
            <span>
              <FileTextOutlined /> {t("plans.fields.description.label")}
            </span>
          }
          name="description"
        >
          <Input.TextArea
            rows={3}
            placeholder={t("plans.fields.description.placeholder")}
            style={{ resize: "none" }}
          />
        </Form.Item>

        {planType === "order" && selectedOrders.length > 0 && (
          <Table
            columns={[
              { title: "ID đơn hàng", dataIndex: "id" },
              { title: "Số lượng", dataIndex: "quantity" },
            ]}
            dataSource={selectedOrders.map((order) => ({ id: order.id, quantity: order.quantity }))}
            pagination={false}
          />
        )}

        {templateType === "with-template" && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => onTemplateSelection("with-template")}
            style={{ width: "100%" }}
          >
            Chọn template
          </Button>
        )}
      </Space>
    );

    // Step 2: Tasks & Activities
    const step2 = (
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        <Form.Item
          label={
            <span>
              <EnvironmentOutlined /> {t("plans.fields.land.label")}
            </span>
          }
          name="yield_id"
          rules={[{ required: true, message: t("plans.fields.land.required") }]}
        >
          <Select
            size="large"
            placeholder={t("plans.fields.land.placeholder")}
            options={[
              { value: 1, label: "Khu đất A (1000m²)" },
              { value: 2, label: "Khu đất B (800m²)" },
            ]}
          />
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
          />
        </Form.Item>

        <Form.Item
          label={
            <span>
              <NumberOutlined /> {t("plans.fields.seedQuantity.label")}
            </span>
          }
          name="seed_quantity"
          rules={[{ required: true, message: t("plans.fields.seedQuantity.required") }]}
        >
          <InputNumber
            size="large"
            min={0}
            style={{ width: "100%" }}
            placeholder="0"
            addonAfter="kg"
          />
        </Form.Item>

        <Form.Item
          label={
            <span>
              <ToolOutlined /> {t("plans.fields.caringTasks.label")}
            </span>
          }
          name="caring_tasks"
        >
          <Table<TaskRecord>
            columns={[
              {
                title: "Tên công việc",
                dataIndex: "task_name",
                key: "task_name",
              },
              {
                title: "Loại",
                dataIndex: "task_type",
                key: "task_type",
              },
              {
                title: "Thời gian",
                dataIndex: "time",
                key: "time",
                render: (_, record) => (
                  <Space>
                    <Tag>{dayjs(record.start_date).format("DD/MM/YYYY")}</Tag>
                    <Tag>{dayjs(record.end_date).format("DD/MM/YYYY")}</Tag>
                  </Space>
                ),
              },
            ]}
            dataSource={[]}
            pagination={false}
          />
        </Form.Item>

        <Form.Item
          label={
            <span>
              <CheckOutlined /> {t("plans.fields.harvestingTasks.label")}
            </span>
          }
          name="harvesting_tasks"
        >
          <Table<TaskRecord>
            columns={[
              {
                title: "Tên công việc",
                dataIndex: "task_name",
                key: "task_name",
              },
              {
                title: "Thời gian",
                dataIndex: "time",
                key: "time",
                render: (_, record) => (
                  <Space>
                    <Tag>{dayjs(record.start_date).format("DD/MM/YYYY")}</Tag>
                    <Tag>{dayjs(record.end_date).format("DD/MM/YYYY")}</Tag>
                  </Space>
                ),
              },
            ]}
            dataSource={[]}
            pagination={false}
          />
        </Form.Item>
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
              dataSource={[]}
              pagination={false}
            />
          </Space>
        </Card>

        <Card>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Text strong>Thông tin sản lượng</Text>
            <Table<SummaryRecord>
              columns={[
                { title: "Sản lượng dự kiến", dataIndex: "estimated_product" },
                { title: "Lượng giống", dataIndex: "seed_quantity" },
                { title: "Khu đất", dataIndex: "land_name" },
              ]}
              dataSource={[]}
              pagination={false}
            />
          </Space>
        </Card>

        <Card>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Text strong>Các công việc</Text>
            <Table<TaskSummaryRecord>
              columns={[
                { title: "Loại công việc", dataIndex: "task_type" },
                { title: "Số lượng", dataIndex: "task_count" },
              ]}
              dataSource={[
                { task_type: "Chăm sóc", task_count: 0 },
                { task_type: "Thu hoạch", task_count: 0 },
                { task_type: "Kiểm tra", task_count: 0 },
                { task_type: "Đóng gói", task_count: 0 },
              ]}
              pagination={false}
            />
          </Space>
        </Card>
      </Space>
    );

    return [step1, step2, step3];
  }, [t, token, planType, templateType, selectedOrders, onTemplateSelection, selectedTemplate]);

  return { formList };
};
