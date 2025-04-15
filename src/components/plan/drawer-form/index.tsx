import { useTranslate, useGetToPath, useGo, useGetIdentity, useSelect } from "@refinedev/core";
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
  Tabs,
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
  DeleteOutlined,
  FileSearchOutlined,
  InboxOutlined,
} from "@ant-design/icons";

import { useMemo, useState, useEffect } from "react";
import {
  IPlan,
  IPlant,
  IYield,
  Template,
  IFertilizer,
  IPesticide,
  IItem,
  IPackagingType,
} from "@/interfaces";
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

  // Add useSelect hooks for plants and yields
  const { options: plantsOptions } = useSelect<IPlant>({
    resource: "plants",
    optionLabel: "plant_name",
    optionValue: "id",
  });

  const { options: yieldsOptions } = useSelect<IYield>({
    resource: "yields",
    optionLabel: "yield_name",
    optionValue: "id",
  });

  const { options: fertilizersOptions } = useSelect<IFertilizer>({
    resource: "fertilizers",
    optionLabel: "name",
    optionValue: "id",
  });

  const { options: pesticidesOptions } = useSelect<IPesticide>({
    resource: "pesticides",
    optionLabel: "name",
    optionValue: "id",
  });

  const { options: itemsOptions } = useSelect<IItem>({
    resource: "items",
    optionLabel: "name",
    optionValue: "id",
  });

  const { options: packagingTypesOptions } = useSelect<IPackagingType>({
    resource: "packaging-types",
    optionLabel: "name",
    optionValue: "id",
  });

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
        caring_tasks: [],
        harvesting_tasks: [],
        inspecting_forms: [],
        packaging_tasks: [],
      },
    });

  // Update form values when template is selected
  useEffect(() => {
    if (selectedTemplate && formProps.form) {
      const { expert_id: _, created_by: __, ...templateData } = selectedTemplate;

      // Convert date strings to dayjs objects
      const formattedTemplateData = {
        ...templateData,
        plan_name: `${templateData.name}`,
        start_date: templateData.start_date ? dayjs(templateData.start_date) : undefined,
        end_date: templateData.end_date ? dayjs(templateData.end_date) : undefined,
        caring_tasks: templateData.caring_tasks?.map((task) => ({
          ...task,
          start_date: task.start_date ? dayjs(task.start_date) : undefined,
          end_date: task.end_date ? dayjs(task.end_date) : undefined,
        })),
        harvesting_tasks: templateData.harvesting_tasks?.map((task) => ({
          ...task,
          start_date: task.start_date ? dayjs(task.start_date) : undefined,
          end_date: task.end_date ? dayjs(task.end_date) : undefined,
        })),
        inspecting_forms: templateData.inspecting_forms?.map((form) => ({
          ...form,
          start_date: form.start_date ? dayjs(form.start_date) : undefined,
          end_date: form.end_date ? dayjs(form.end_date) : undefined,
        })),
        packaging_tasks: templateData.packaging_tasks?.map((task) => ({
          ...task,
          start_date: task.start_date ? dayjs(task.start_date) : undefined,
          end_date: task.end_date ? dayjs(task.end_date) : undefined,
        })),
      };

      formProps.form.setFieldsValue(formattedTemplateData);
    }
  }, [selectedTemplate, formProps.form]);

  // Initialize form with default values
  useEffect(() => {
    if (formProps.form) {
      formProps.form.setFieldsValue({
        expert_id: expert_id as number,
        created_by: expert_name as string,
        start_date: dayjs(),
        end_date: dayjs(),
      });
    }
  }, [formProps.form, expert_id, expert_name]);

  const { formList } = useFormList({
    formProps,
    planType,
    templateType,
    selectedOrders,
    onTemplateSelection: handleTemplateSelection,
    selectedTemplate,
    plantsOptions,
    yieldsOptions,
    fertilizersOptions,
    pesticidesOptions,
    itemsOptions,
    packagingTypesOptions,
    identity,
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

interface UseFormListProps {
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

const useFormList = (props: UseFormListProps) => {
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
              <ShopOutlined /> {t("plans.fields.planName.label")}
            </span>
          }
          name="plan_name"
          rules={[{ required: true, message: t("plans.fields.planName.required") }]}
          initialValue={selectedTemplate ? `Kế hoạch ${selectedTemplate.name}` : undefined}
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
              <CalendarOutlined /> {t("plans.fields.startDate.label")}
            </span>
          }
          name="start_date"
          rules={[{ required: true, message: t("plans.fields.startDate.required") }]}
          initialValue={
            selectedTemplate?.start_date ? dayjs(selectedTemplate.start_date) : undefined
          }
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
          initialValue={selectedTemplate?.end_date ? dayjs(selectedTemplate.end_date) : undefined}
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
                    <NumberOutlined /> {t("plans.fields.estimatedProduct.label")}
                  </span>
                }
                name="estimated_product"
                rules={[{ required: true, message: t("plans.fields.estimatedProduct.required") }]}
                initialValue={selectedTemplate?.estimated_product}
                style={{ width: "300px" }}
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
                initialValue={selectedTemplate?.seed_quantity}
                style={{ width: "300px" }}
              >
                <InputNumber
                  size="large"
                  min={0}
                  style={{ width: "100%" }}
                  placeholder="0"
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
                              <Space direction="vertical" style={{ width: "100%" }}>
                                <Form.Item
                                  {...restField}
                                  name={[name, "task_name"]}
                                  rules={[
                                    { required: true, message: "Vui lòng nhập tên công việc" },
                                  ]}
                                >
                                  <Input placeholder="Tên công việc" />
                                </Form.Item>
                                <Form.Item
                                  {...restField}
                                  name={[name, "task_type"]}
                                  rules={[
                                    { required: true, message: "Vui lòng chọn loại công việc" },
                                  ]}
                                >
                                  <Select
                                    placeholder="Loại công việc"
                                    options={[
                                      { value: "Chuẩn bị đất", label: "Chuẩn bị đất" },
                                      { value: "Trồng", label: "Trồng" },
                                      { value: "Chăm sóc", label: "Chăm sóc" },
                                      { value: "Tưới nước", label: "Tưới nước" },
                                      { value: "Bón phân", label: "Bón phân" },
                                      { value: "Phòng trừ sâu bệnh", label: "Phòng trừ sâu bệnh" },
                                    ]}
                                  />
                                </Form.Item>
                                <Form.Item {...restField} name={[name, "description"]}>
                                  <Input.TextArea placeholder="Mô tả" rows={2} />
                                </Form.Item>

                                <Space direction="vertical" style={{ width: "100%" }}>
                                  <Text strong>Phân bón</Text>
                                  <Form.List name={[name, "fertilizers"]}>
                                    {(
                                      fertilizerFields,
                                      { add: addFertilizer, remove: removeFertilizer },
                                    ) => (
                                      <div
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          gap: "8px",
                                        }}
                                      >
                                        {fertilizerFields.map(
                                          ({
                                            key,
                                            name: fertilizerName,
                                            ...restFertilizerField
                                          }) => (
                                            <Space key={key} style={{ width: "100%" }}>
                                              <Form.Item
                                                {...restFertilizerField}
                                                name={[fertilizerName, "fertilizer_id"]}
                                                style={{ flex: 1 }}
                                              >
                                                <Select
                                                  placeholder="Chọn phân bón"
                                                  options={fertilizersOptions}
                                                />
                                              </Form.Item>
                                              <Form.Item
                                                {...restFertilizerField}
                                                name={[fertilizerName, "quantity"]}
                                                style={{ width: "100px" }}
                                              >
                                                <InputNumber placeholder="Số lượng" min={0} />
                                              </Form.Item>
                                              <Form.Item
                                                {...restFertilizerField}
                                                name={[fertilizerName, "unit"]}
                                                style={{ width: "100px" }}
                                              >
                                                <Select
                                                  placeholder="Đơn vị"
                                                  options={[
                                                    { value: "kg", label: "kg" },
                                                    { value: "g", label: "g" },
                                                    { value: "l", label: "l" },
                                                  ]}
                                                />
                                              </Form.Item>
                                              <Button
                                                type="text"
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() => removeFertilizer(fertilizerName)}
                                              />
                                            </Space>
                                          ),
                                        )}
                                        <Button
                                          type="dashed"
                                          onClick={() => addFertilizer()}
                                          icon={<PlusOutlined />}
                                        >
                                          Thêm phân bón
                                        </Button>
                                      </div>
                                    )}
                                  </Form.List>

                                  <Text strong>Thuốc bảo vệ thực vật</Text>
                                  <Form.List name={[name, "pesticides"]}>
                                    {(
                                      pesticideFields,
                                      { add: addPesticide, remove: removePesticide },
                                    ) => (
                                      <div
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          gap: "8px",
                                        }}
                                      >
                                        {pesticideFields.map(
                                          ({ key, name: pesticideName, ...restPesticideField }) => (
                                            <Space key={key} style={{ width: "100%" }}>
                                              <Form.Item
                                                {...restPesticideField}
                                                name={[pesticideName, "pesticide_id"]}
                                                style={{ flex: 1 }}
                                              >
                                                <Select
                                                  placeholder="Chọn thuốc"
                                                  options={pesticidesOptions}
                                                />
                                              </Form.Item>
                                              <Form.Item
                                                {...restPesticideField}
                                                name={[pesticideName, "quantity"]}
                                                style={{ width: "100px" }}
                                              >
                                                <InputNumber placeholder="Số lượng" min={0} />
                                              </Form.Item>
                                              <Form.Item
                                                {...restPesticideField}
                                                name={[pesticideName, "unit"]}
                                                style={{ width: "100px" }}
                                              >
                                                <Select
                                                  placeholder="Đơn vị"
                                                  options={[
                                                    { value: "kg", label: "kg" },
                                                    { value: "g", label: "g" },
                                                    { value: "l", label: "l" },
                                                  ]}
                                                />
                                              </Form.Item>
                                              <Button
                                                type="text"
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() => removePesticide(pesticideName)}
                                              />
                                            </Space>
                                          ),
                                        )}
                                        <Button
                                          type="dashed"
                                          onClick={() => addPesticide()}
                                          icon={<PlusOutlined />}
                                        >
                                          Thêm thuốc
                                        </Button>
                                      </div>
                                    )}
                                  </Form.List>

                                  <Text strong>Vật tư</Text>
                                  <Form.List name={[name, "items"]}>
                                    {(itemFields, { add: addItem, remove: removeItem }) => (
                                      <div
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          gap: "8px",
                                        }}
                                      >
                                        {itemFields.map(
                                          ({ key, name: itemName, ...restItemField }) => (
                                            <Space key={key} style={{ width: "100%" }}>
                                              <Form.Item
                                                {...restItemField}
                                                name={[itemName, "item_id"]}
                                                style={{ flex: 1 }}
                                              >
                                                <Select
                                                  placeholder="Chọn vật tư"
                                                  options={itemsOptions}
                                                />
                                              </Form.Item>
                                              <Form.Item
                                                {...restItemField}
                                                name={[itemName, "quantity"]}
                                                style={{ width: "100px" }}
                                              >
                                                <InputNumber placeholder="Số lượng" min={0} />
                                              </Form.Item>
                                              <Form.Item
                                                {...restItemField}
                                                name={[itemName, "unit"]}
                                                style={{ width: "100px" }}
                                              >
                                                <Select
                                                  placeholder="Đơn vị"
                                                  options={[
                                                    { value: "cái", label: "cái" },
                                                    { value: "hộp", label: "hộp" },
                                                    { value: "kg", label: "kg" },
                                                  ]}
                                                />
                                              </Form.Item>
                                              <Button
                                                type="text"
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() => removeItem(itemName)}
                                              />
                                            </Space>
                                          ),
                                        )}
                                        <Button
                                          type="dashed"
                                          onClick={() => addItem()}
                                          icon={<PlusOutlined />}
                                        >
                                          Thêm vật tư
                                        </Button>
                                      </div>
                                    )}
                                  </Form.List>
                                </Space>

                                <Space direction="vertical" style={{ width: "100%" }}>
                                  <Form.Item
                                    {...restField}
                                    name={[name, "start_date"]}
                                    rules={[
                                      { required: true, message: "Vui lòng chọn ngày bắt đầu" },
                                    ]}
                                    getValueProps={(value) => ({
                                      value: value ? dayjs(value) : null,
                                    })}
                                  >
                                    <DatePicker
                                      placeholder="Ngày bắt đầu"
                                      format="DD/MM/YYYY"
                                      style={{ width: "100%" }}
                                    />
                                  </Form.Item>
                                  <Form.Item
                                    {...restField}
                                    name={[name, "end_date"]}
                                    rules={[
                                      { required: true, message: "Vui lòng chọn ngày kết thúc" },
                                    ]}
                                    getValueProps={(value) => ({
                                      value: value ? dayjs(value) : null,
                                    })}
                                  >
                                    <DatePicker
                                      placeholder="Ngày kết thúc"
                                      format="DD/MM/YYYY"
                                      style={{ width: "100%" }}
                                    />
                                  </Form.Item>
                                </Space>
                              </Space>
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
                    <Flex justify="space-between" align="center">
                      <Space direction="vertical" size="small">
                        <Text strong style={{ fontSize: "16px" }}>
                          Danh sách công việc thu hoạch
                        </Text>
                        <Text type="secondary">Quản lý các công việc thu hoạch sản phẩm</Text>
                      </Space>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                          const currentTasks =
                            formProps.form?.getFieldValue("harvesting_tasks") || [];
                          formProps.form?.setFieldsValue({
                            harvesting_tasks: [
                              ...currentTasks,
                              {
                                id: Date.now(),
                                task_name: "",
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

                    <Form.List name="harvesting_tasks">
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
                              <Space direction="vertical" style={{ width: "100%" }}>
                                <Form.Item
                                  {...restField}
                                  name={[name, "task_name"]}
                                  rules={[
                                    { required: true, message: "Vui lòng nhập tên công việc" },
                                  ]}
                                >
                                  <Input placeholder="Tên công việc" />
                                </Form.Item>
                                <Form.Item {...restField} name={[name, "description"]}>
                                  <Input.TextArea placeholder="Mô tả" rows={2} />
                                </Form.Item>

                                <Text strong>Vật tư thu hoạch</Text>
                                <Form.List name={[name, "items"]}>
                                  {(itemFields, { add: addItem, remove: removeItem }) => (
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "8px",
                                      }}
                                    >
                                      {itemFields.map(
                                        ({ key, name: itemName, ...restItemField }) => (
                                          <Space key={key} style={{ width: "100%" }}>
                                            <Form.Item
                                              {...restItemField}
                                              name={[itemName, "item_id"]}
                                              style={{ flex: 1 }}
                                            >
                                              <Select
                                                placeholder="Chọn vật tư"
                                                options={itemsOptions}
                                              />
                                            </Form.Item>
                                            <Form.Item
                                              {...restItemField}
                                              name={[itemName, "quantity"]}
                                              style={{ width: "100px" }}
                                            >
                                              <InputNumber placeholder="Số lượng" min={0} />
                                            </Form.Item>
                                            <Form.Item
                                              {...restItemField}
                                              name={[itemName, "unit"]}
                                              style={{ width: "100px" }}
                                            >
                                              <Select
                                                placeholder="Đơn vị"
                                                options={[
                                                  { value: "cái", label: "cái" },
                                                  { value: "hộp", label: "hộp" },
                                                  { value: "kg", label: "kg" },
                                                ]}
                                              />
                                            </Form.Item>
                                            <Button
                                              type="text"
                                              danger
                                              icon={<DeleteOutlined />}
                                              onClick={() => removeItem(itemName)}
                                            />
                                          </Space>
                                        ),
                                      )}
                                      <Button
                                        type="dashed"
                                        onClick={() => addItem()}
                                        icon={<PlusOutlined />}
                                      >
                                        Thêm vật tư
                                      </Button>
                                    </div>
                                  )}
                                </Form.List>

                                <Space direction="vertical" style={{ width: "100%" }}>
                                  <Form.Item
                                    {...restField}
                                    name={[name, "start_date"]}
                                    rules={[
                                      { required: true, message: "Vui lòng chọn ngày bắt đầu" },
                                    ]}
                                    getValueProps={(value) => ({
                                      value: value ? dayjs(value) : null,
                                    })}
                                  >
                                    <DatePicker
                                      placeholder="Ngày bắt đầu"
                                      format="DD/MM/YYYY"
                                      style={{ width: "100%" }}
                                    />
                                  </Form.Item>
                                  <Form.Item
                                    {...restField}
                                    name={[name, "end_date"]}
                                    rules={[
                                      { required: true, message: "Vui lòng chọn ngày kết thúc" },
                                    ]}
                                    getValueProps={(value) => ({
                                      value: value ? dayjs(value) : null,
                                    })}
                                  >
                                    <DatePicker
                                      placeholder="Ngày kết thúc"
                                      format="DD/MM/YYYY"
                                      style={{ width: "100%" }}
                                    />
                                  </Form.Item>
                                </Space>
                              </Space>
                            </Card>
                          ))}
                        </div>
                      )}
                    </Form.List>
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
                    <Flex justify="space-between" align="center">
                      <Space direction="vertical" size="small">
                        <Text strong style={{ fontSize: "16px" }}>
                          Danh sách công việc kiểm tra
                        </Text>
                        <Text type="secondary">Quản lý các công việc kiểm tra sâu bệnh</Text>
                      </Space>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                          const currentTasks =
                            formProps.form?.getFieldValue("inspecting_forms") || [];
                          formProps.form?.setFieldsValue({
                            inspecting_forms: [
                              ...currentTasks,
                              {
                                id: Date.now(),
                                task_name: "",
                                description: "",
                                start_date: dayjs(),
                                end_date: dayjs(),
                                created_by: identity?.name || "",
                              },
                            ],
                          });
                        }}
                      >
                        Thêm công việc
                      </Button>
                    </Flex>

                    <Form.List name="inspecting_forms">
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
                              <Space direction="vertical" style={{ width: "100%" }}>
                                <Form.Item
                                  {...restField}
                                  name={[name, "task_name"]}
                                  rules={[
                                    { required: true, message: "Vui lòng nhập tên công việc" },
                                  ]}
                                >
                                  <Input placeholder="Tên công việc" />
                                </Form.Item>
                                <Form.Item
                                  {...restField}
                                  name={[name, "description"]}
                                  rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
                                >
                                  <Input.TextArea placeholder="Mô tả công việc kiểm tra" rows={3} />
                                </Form.Item>
                                <Space direction="vertical" style={{ width: "100%" }}>
                                  <Form.Item
                                    {...restField}
                                    name={[name, "start_date"]}
                                    rules={[
                                      { required: true, message: "Vui lòng chọn ngày bắt đầu" },
                                    ]}
                                    getValueProps={(value) => ({
                                      value: value ? dayjs(value) : null,
                                    })}
                                  >
                                    <DatePicker
                                      placeholder="Ngày bắt đầu"
                                      format="DD/MM/YYYY HH:mm:ss"
                                      showTime
                                      style={{ width: "100%" }}
                                    />
                                  </Form.Item>
                                  <Form.Item
                                    {...restField}
                                    name={[name, "end_date"]}
                                    rules={[
                                      { required: true, message: "Vui lòng chọn ngày kết thúc" },
                                    ]}
                                    getValueProps={(value) => ({
                                      value: value ? dayjs(value) : null,
                                    })}
                                  >
                                    <DatePicker
                                      placeholder="Ngày kết thúc"
                                      format="DD/MM/YYYY HH:mm:ss"
                                      showTime
                                      style={{ width: "100%" }}
                                    />
                                  </Form.Item>
                                </Space>
                                <Form.Item
                                  {...restField}
                                  name={[name, "created_by"]}
                                  initialValue={identity?.name}
                                  hidden
                                >
                                  <Input />
                                </Form.Item>
                              </Space>
                            </Card>
                          ))}
                        </div>
                      )}
                    </Form.List>
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
                    <Flex justify="space-between" align="center">
                      <Space direction="vertical" size="small">
                        <Text strong style={{ fontSize: "16px" }}>
                          Danh sách công việc đóng gói
                        </Text>
                        <Text type="secondary">Quản lý các công việc đóng gói sản phẩm</Text>
                      </Space>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                          const currentTasks =
                            formProps.form?.getFieldValue("packaging_tasks") || [];
                          formProps.form?.setFieldsValue({
                            packaging_tasks: [
                              ...currentTasks,
                              {
                                id: Date.now(),
                                task_name: "",
                                description: "",
                                start_date: dayjs(),
                                end_date: dayjs(),
                                total_package_weight: 0,
                              },
                            ],
                          });
                        }}
                      >
                        Thêm công việc
                      </Button>
                    </Flex>

                    <Form.List name="packaging_tasks">
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
                              <Space direction="vertical" style={{ width: "100%" }}>
                                <Form.Item
                                  {...restField}
                                  name={[name, "task_name"]}
                                  rules={[
                                    { required: true, message: "Vui lòng nhập tên công việc" },
                                  ]}
                                >
                                  <Input placeholder="Tên công việc" />
                                </Form.Item>
                                <Form.Item
                                  {...restField}
                                  name={[name, "packaging_type_id"]}
                                  rules={[
                                    { required: true, message: "Vui lòng chọn loại đóng gói" },
                                  ]}
                                >
                                  <Select
                                    placeholder="Loại đóng gói"
                                    options={packagingTypesOptions}
                                  />
                                </Form.Item>
                                <Form.Item {...restField} name={[name, "description"]}>
                                  <Input.TextArea placeholder="Mô tả" rows={2} />
                                </Form.Item>
                                <Form.Item
                                  {...restField}
                                  name={[name, "total_package_weight"]}
                                  rules={[
                                    { required: true, message: "Vui lòng nhập tổng khối lượng" },
                                  ]}
                                >
                                  <InputNumber
                                    min={0}
                                    style={{ width: "100%" }}
                                    placeholder="Tổng khối lượng"
                                    addonAfter="kg"
                                  />
                                </Form.Item>

                                <Text strong>Vật tư đóng gói</Text>
                                <Form.List name={[name, "items"]}>
                                  {(itemFields, { add: addItem, remove: removeItem }) => (
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "8px",
                                      }}
                                    >
                                      {itemFields.map(
                                        ({ key, name: itemName, ...restItemField }) => (
                                          <Space key={key} style={{ width: "100%" }}>
                                            <Form.Item
                                              {...restItemField}
                                              name={[itemName, "item_id"]}
                                              style={{ flex: 1 }}
                                            >
                                              <Select
                                                placeholder="Chọn vật tư"
                                                options={itemsOptions}
                                              />
                                            </Form.Item>
                                            <Form.Item
                                              {...restItemField}
                                              name={[itemName, "quantity"]}
                                              style={{ width: "100px" }}
                                            >
                                              <InputNumber placeholder="Số lượng" min={0} />
                                            </Form.Item>
                                            <Form.Item
                                              {...restItemField}
                                              name={[itemName, "unit"]}
                                              style={{ width: "100px" }}
                                            >
                                              <Select
                                                placeholder="Đơn vị"
                                                options={[
                                                  { value: "cái", label: "cái" },
                                                  { value: "hộp", label: "hộp" },
                                                  { value: "kg", label: "kg" },
                                                ]}
                                              />
                                            </Form.Item>
                                            <Button
                                              type="text"
                                              danger
                                              icon={<DeleteOutlined />}
                                              onClick={() => removeItem(itemName)}
                                            />
                                          </Space>
                                        ),
                                      )}
                                      <Button
                                        type="dashed"
                                        onClick={() => addItem()}
                                        icon={<PlusOutlined />}
                                      >
                                        Thêm vật tư
                                      </Button>
                                    </div>
                                  )}
                                </Form.List>

                                <Space direction="vertical" style={{ width: "100%" }}>
                                  <Form.Item
                                    {...restField}
                                    name={[name, "start_date"]}
                                    rules={[
                                      { required: true, message: "Vui lòng chọn ngày bắt đầu" },
                                    ]}
                                    getValueProps={(value) => ({
                                      value: value ? dayjs(value) : null,
                                    })}
                                  >
                                    <DatePicker
                                      placeholder="Ngày bắt đầu"
                                      format="DD/MM/YYYY"
                                      style={{ width: "100%" }}
                                    />
                                  </Form.Item>
                                  <Form.Item
                                    {...restField}
                                    name={[name, "end_date"]}
                                    rules={[
                                      { required: true, message: "Vui lòng chọn ngày kết thúc" },
                                    ]}
                                    getValueProps={(value) => ({
                                      value: value ? dayjs(value) : null,
                                    })}
                                  >
                                    <DatePicker
                                      placeholder="Ngày kết thúc"
                                      format="DD/MM/YYYY"
                                      style={{ width: "100%" }}
                                    />
                                  </Form.Item>
                                </Space>
                              </Space>
                            </Card>
                          ))}
                        </div>
                      )}
                    </Form.List>
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

        <Card>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Text strong>Thông tin sản lượng</Text>
            <Table<SummaryRecord>
              columns={[
                {
                  title: "Sản lượng dự kiến",
                  dataIndex: "estimated_product",
                  render: (value) => `${value} kg`,
                },
                {
                  title: "Lượng giống",
                  dataIndex: "seed_quantity",
                  render: (value) => `${value} kg`,
                },
                { title: "Khu đất", dataIndex: "land_name" },
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

        <Card>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Text strong>Các công việc</Text>
            <Table<TaskSummaryRecord>
              columns={[
                { title: "Loại công việc", dataIndex: "task_type" },
                { title: "Số lượng", dataIndex: "task_count" },
              ]}
              dataSource={[
                {
                  task_type: "Chăm sóc",
                  task_count: selectedTemplate?.caring_tasks?.length || 0,
                },
                {
                  task_type: "Thu hoạch",
                  task_count: selectedTemplate?.harvesting_tasks?.length || 0,
                },
                {
                  task_type: "Kiểm tra",
                  task_count: selectedTemplate?.inspecting_forms?.length || 0,
                },
                {
                  task_type: "Đóng gói",
                  task_count: selectedTemplate?.packaging_tasks?.length || 0,
                },
              ]}
              pagination={false}
            />
          </Space>
        </Card>

        {selectedTemplate && (
          <>
            <Card>
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <Text strong>Công việc chăm sóc</Text>
                <Table
                  columns={[
                    { title: "Tên công việc", dataIndex: "task_name" },
                    { title: "Loại", dataIndex: "task_type" },
                    { title: "Mô tả", dataIndex: "description" },
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
                  dataSource={selectedTemplate.caring_tasks}
                  pagination={false}
                />
              </Space>
            </Card>

            <Card>
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <Text strong>Công việc thu hoạch</Text>
                <Table
                  columns={[
                    { title: "Tên công việc", dataIndex: "task_name" },
                    { title: "Mô tả", dataIndex: "description" },
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
                  dataSource={selectedTemplate.harvesting_tasks}
                  pagination={false}
                />
              </Space>
            </Card>

            <Card>
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <Text strong>Công việc kiểm tra</Text>
                <Table
                  columns={[
                    { title: "Tên công việc", dataIndex: "task_name" },
                    { title: "Mô tả", dataIndex: "description" },
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
                  dataSource={selectedTemplate.inspecting_forms}
                  pagination={false}
                />
              </Space>
            </Card>

            <Card>
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <Text strong>Công việc đóng gói</Text>
                <Table
                  columns={[
                    { title: "Tên công việc", dataIndex: "task_name" },
                    { title: "Mô tả", dataIndex: "description" },
                    {
                      title: "Tổng khối lượng",
                      dataIndex: "total_package_weight",
                      render: (value) => `${value} kg`,
                    },
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
                  dataSource={selectedTemplate.packaging_tasks}
                  pagination={false}
                />
              </Space>
            </Card>
          </>
        )}
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
