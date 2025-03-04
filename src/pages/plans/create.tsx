import { useTranslate, useGetToPath, useGo } from "@refinedev/core";
import { SaveButton, useStepsForm, useSelect } from "@refinedev/antd";
import {
  Form,
  Select,
  Input,
  Button,
  Steps,
  Flex,
  DatePicker,
  Table,
  Typography,
  InputNumber,
  FormProps,
  Tabs,
  Card,
  Badge,
  Space,
  Dropdown,
  Col,
  Row,
  Modal,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import {
  IPlan,
  IPlant,
  IYield,
  ICaringTask,
  IHarvestingTask,
  IInspectingForm,
  IPesticide,
  IItem,
  IFertilizer,
} from "../../interfaces";
import { DownOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

/**
 * Main component for creating a new plan with a multi-step form
 */
export const PlanCreate = () => {
  const t = useTranslate();
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();

  const { current, gotoStep, stepsProps, formProps, saveButtonProps } = useStepsForm<IPlan>({
    resource: "plans",
    action: "create",
  });

  const { formList } = useFormList({ formProps });

  const handleCancel = () => {
    go({
      to: searchParams.get("to") ?? getToPath({ action: "list" }) ?? "",
      query: { to: undefined },
      options: { keepQuery: true },
      type: "replace",
    });
  };

  const isLastStep = current === formList.length - 1;
  const isFirstStep = current === 0;

  return (
    <div style={{ padding: "24px", maxWidth: "1600px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "24px" }}>{t("plans.actions.create")}</h2>

      <Steps {...stepsProps} responsive style={{ marginBottom: "24px" }}>
        <Steps.Step title={t("plans.steps.plant")} />
        <Steps.Step title={t("plans.steps.yield")} />
        <Steps.Step title={t("plans.steps.details")} />
        <Steps.Step title={t("plans.steps.tasks")} />
        <Steps.Step title={t("plans.steps.review")} />
      </Steps>

      <Form {...formProps} layout="vertical">
        {formList[current]}
      </Form>

      <Flex align="center" justify="space-between" style={{ marginTop: "24px" }}>
        <Button onClick={handleCancel}>{t("buttons.cancel")}</Button>
        <Flex align="center" gap={16}>
          <Button disabled={isFirstStep} onClick={() => gotoStep(current - 1)}>
            {t("buttons.previousStep")}
          </Button>
          {isLastStep ? (
            <SaveButton icon={false} {...saveButtonProps} />
          ) : (
            <Button type="primary" onClick={() => gotoStep(current + 1)}>
              {t("buttons.nextStep")}
            </Button>
          )}
        </Flex>
      </Flex>
    </div>
  );
};

/**
 * Hook that manages the form steps and form data
 */
const useFormList = ({ formProps }: { formProps: FormProps }) => {
  const t = useTranslate();

  // Select components for different resources
  const { selectProps: plantSelectProps } = useSelect<IPlant>({
    resource: "plants",
    optionLabel: "plant_name",
    optionValue: "id",
    filters: [{ field: "isAvailable", operator: "eq", value: true }],
  });

  const { selectProps: yieldSelectProps } = useSelect<IYield>({
    resource: "yields",
    optionLabel: "yield_name",
    optionValue: "id",
    filters: [{ field: "isAvailable", operator: "eq", value: true }],
  });

  const { selectProps: fertilizerSelectProps } = useSelect<IFertilizer>({
    resource: "fertilizers",
    optionLabel: "name",
    optionValue: "id",
  });

  const { selectProps: pesticideSelectProps } = useSelect<IPesticide>({
    resource: "pesticides",
    optionLabel: "name",
    optionValue: "id",
  });

  const { selectProps: itemSelectProps } = useSelect<IItem>({
    resource: "items",
    optionLabel: "name",
    optionValue: "id",
  });

  // Tasks state
  const [caringTasks, setCaringTasks] = useState<Partial<ICaringTask>[]>([]);
  const [harvestingTasks, setHarvestingTasks] = useState<Partial<IHarvestingTask>[]>([]);
  const [inspectingTasks, setInspectingTasks] = useState<Partial<IInspectingForm>[]>([]);

  // Form steps
  const formList = useMemo(
    () => [
      // Step 1: Plant Selection
      <PlantSelectionStep key="plant" t={t} plantSelectProps={plantSelectProps} />,

      // Step 2: Yield Selection
      <YieldSelectionStep key="yield" t={t} yieldSelectProps={yieldSelectProps} />,

      // Step 3: Basic Details
      <DetailsStep key="details" t={t} />,

      // Step 4: Task Management
      <TasksStep
        key="tasks"
        t={t}
        caringTasks={caringTasks}
        setCaringTasks={setCaringTasks}
        harvestingTasks={harvestingTasks}
        setHarvestingTasks={setHarvestingTasks}
        inspectingTasks={inspectingTasks}
        setInspectingTasks={setInspectingTasks}
        fertilizerSelectProps={fertilizerSelectProps}
        pesticideSelectProps={pesticideSelectProps}
        itemSelectProps={itemSelectProps}
      />,

      // Step 5: Review
      <ReviewStep
        key="review"
        t={t}
        formProps={formProps}
        caringTasks={caringTasks}
        harvestingTasks={harvestingTasks}
        inspectingTasks={inspectingTasks}
      />,
    ],
    [
      t,
      plantSelectProps,
      yieldSelectProps,
      caringTasks,
      harvestingTasks,
      inspectingTasks,
      fertilizerSelectProps,
      pesticideSelectProps,
      itemSelectProps,
      formProps,
    ],
  );

  return {
    formList,
    caringTasks,
    setCaringTasks,
    harvestingTasks,
    setHarvestingTasks,
    inspectingTasks,
    setInspectingTasks,
  };
};

/**
 * Step 1: Plant Selection
 */
const PlantSelectionStep = ({
  t,
  plantSelectProps,
}: {
  t: (key: string) => string;
  plantSelectProps: any;
}) => (
  <Flex vertical>
    <Form.Item
      label={t("plans.fields.plant.label")}
      name="plantId"
      rules={[{ required: true, message: t("plans.fields.plant.required") }]}
    >
      <Select {...plantSelectProps} placeholder={t("plans.fields.plant.placeholder")} />
    </Form.Item>
  </Flex>
);

/**
 * Step 2: Yield Selection
 */
const YieldSelectionStep = ({
  t,
  yieldSelectProps,
}: {
  t: (key: string) => string;
  yieldSelectProps: any;
}) => (
  <Flex vertical>
    <Form.Item
      label={t("plans.fields.yield.label")}
      name="yieldId"
      rules={[{ required: true, message: t("plans.fields.yield.required") }]}
    >
      <Select {...yieldSelectProps} placeholder={t("plans.fields.yield.placeholder")} />
    </Form.Item>
  </Flex>
);

/**
 * Step 3: Basic Details
 */
const DetailsStep = ({ t }: { t: (key: string) => string }) => (
  <Flex vertical>
    <Form.Item
      label={t("plans.fields.planName.label")}
      name="plan_name" // Changed to match interface field name
      rules={[{ required: true, message: t("plans.fields.planName.required") }]}
    >
      <Input placeholder={t("plans.fields.planName.placeholder")} />
    </Form.Item>

    <Form.Item label={t("plans.fields.description.label")} name="description">
      <Input.TextArea rows={3} placeholder={t("plans.fields.description.placeholder")} />
    </Form.Item>

    <Form.Item
      label={t("plans.fields.startedDate.label")}
      name="startedDate"
      rules={[{ required: true, message: t("plans.fields.startedDate.required") }]}
    >
      <DatePicker
        showTime
        format="YYYY-MM-DD HH:mm:ss"
        style={{ width: "100%" }}
        placeholder={t("plans.fields.startedDate.placeholder")}
      />
    </Form.Item>

    <Form.Item
      label={t("plans.fields.endedDate.label")}
      name="endedDate"
      rules={[{ required: true, message: t("plans.fields.endedDate.required") }]}
    >
      <DatePicker
        showTime
        format="YYYY-MM-DD HH:mm:ss"
        style={{ width: "100%" }}
        placeholder={t("plans.fields.endedDate.placeholder")}
      />
    </Form.Item>

    <Form.Item label={t("plans.fields.estimatedProduct.label")} name="estimatedProduct">
      <InputNumber min={0} placeholder={t("plans.fields.estimatedProduct.placeholder")} />
    </Form.Item>

    <Form.Item label={t("plans.fields.estimatedUnit.label")} name="estimatedUnit">
      <Select
        options={[
          { label: "kg", value: "kg" },
          { label: "ton", value: "ton" },
        ]}
        placeholder={t("plans.fields.estimatedUnit.placeholder")}
      />
    </Form.Item>

    <Form.Item
      label={t("plans.fields.status.label")}
      name="status"
      initialValue="Draft"
      rules={[{ required: true }]}
    >
      <Select
        options={[
          { label: "Draft", value: "Draft" },
          { label: "Pending", value: "Pending" },
          { label: "Ongoing", value: "Ongoing" },
          { label: "Completed", value: "Completed" },
          { label: "Cancelled", value: "Cancelled" },
        ]}
        placeholder={t("plans.fields.status.placeholder")}
      />
    </Form.Item>
  </Flex>
);

/**
 * Modal for Adding/Editing Tasks
 */
const TaskFormModal = ({
  taskType,
  onTaskAdded,
  initialValues = null,
  fertilizerSelectProps,
  pesticideSelectProps,
  itemSelectProps,
  t,
}) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [visible, form, initialValues]);

  const handleModalOpen = () => {
    form.resetFields();
    setVisible(true);
  };

  const handleModalClose = () => {
    setVisible(false);
  };

  const handleFormSubmit = () => {
    form.validateFields().then((values) => {
      // Format dates to string if they're date objects
      const formattedValues = {
        ...values,
        start_date:
          values.start_date instanceof Date ? values.start_date.toISOString() : values.start_date,
        end_date: values.end_date instanceof Date ? values.end_date.toISOString() : values.end_date,
        status: values.status || "pending",
      };

      onTaskAdded(formattedValues);
      setVisible(false);
    });
  };

  const getTaskTypeOptions = () => {
    if (taskType === "caring") {
      return [
        { label: "Planting", value: "Planting" },
        { label: "Nurturing", value: "Nurturing" },
        { label: "Watering", value: "Watering" },
        { label: "Fertilizing", value: "Fertilizing" },
        { label: "PestControl", value: "PestControl" },
      ];
    } else if (taskType === "harvesting") {
      return [{ label: "Harvesting", value: "Harvesting" }];
    } else {
      return [
        { label: "SoilInspection", value: "SoilInspection" },
        { label: "PlantInspection", value: "PlantInspection" },
      ];
    }
  };

  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleModalOpen}>
        {t("buttons.addTask")}
      </Button>
      <Modal
        title={initialValues ? t("plans.tasks.editTask") : t("plans.tasks.addTask")}
        open={visible}
        onOk={handleFormSubmit}
        onCancel={handleModalClose}
        width={800}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("plans.fields.taskName.label")}
                name="task_name"
                rules={[{ required: true, message: t("plans.fields.taskName.required") }]}
              >
                <Input placeholder={t("plans.fields.taskName.placeholder")} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("plans.fields.taskType.label")}
                name="task_type"
                rules={[{ required: true, message: t("plans.fields.taskType.required") }]}
              >
                <Select
                  options={getTaskTypeOptions()}
                  placeholder={t("plans.fields.taskType.placeholder")}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("plans.fields.startDate.label")}
                name="start_date"
                rules={[{ required: true, message: t("plans.fields.startDate.required") }]}
              >
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: "100%" }}
                  placeholder={t("plans.fields.startDate.placeholder")}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("plans.fields.endDate.label")}
                name="end_date"
                rules={[{ required: true, message: t("plans.fields.endDate.required") }]}
              >
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: "100%" }}
                  placeholder={t("plans.fields.endDate.placeholder")}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label={t("plans.fields.status.label")}
                initialValue="pending"
              >
                <Select
                  options={[
                    { label: t("plans.status.pending"), value: "pending" },
                    { label: t("plans.status.inProgress"), value: "in-progress" },
                    { label: t("plans.status.completed"), value: "completed" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              {taskType !== "inspecting" ? (
                <Form.Item
                  label={t("plans.fields.farmerId.label")}
                  name="farmer_id"
                  rules={[{ required: true, message: t("plans.fields.farmerId.required") }]}
                >
                  <InputNumber
                    min={1}
                    style={{ width: "100%" }}
                    placeholder={t("plans.fields.farmerId.placeholder")}
                  />
                </Form.Item>
              ) : (
                <Form.Item
                  label={t("plans.fields.inspectorId.label")}
                  name="inspector_id"
                  rules={[{ required: true, message: t("plans.fields.inspectorId.required") }]}
                >
                  <InputNumber
                    min={1}
                    style={{ width: "100%" }}
                    placeholder={t("plans.fields.inspectorId.placeholder")}
                  />
                </Form.Item>
              )}
            </Col>
          </Row>

          {taskType === "caring" && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label={t("plans.fields.fertilizers.label")} name="fertilizers">
                  <Select
                    {...fertilizerSelectProps}
                    mode="multiple"
                    placeholder={t("plans.fields.fertilizers.placeholder")}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={t("plans.fields.pesticides.label")} name="pesticides">
                  <Select
                    {...pesticideSelectProps}
                    mode="multiple"
                    placeholder={t("plans.fields.pesticides.placeholder")}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
            </Row>
          )}

          {taskType === "harvesting" && (
            <Form.Item label={t("plans.fields.estimatedYield.label")} name="estimated_yield">
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder={t("plans.fields.estimatedYield.placeholder")}
                addonAfter="kg"
              />
            </Form.Item>
          )}

          {taskType === "inspecting" && (
            <Form.Item label={t("plans.fields.inspectionResult.label")} name="inspection_result">
              <Select
                placeholder={t("plans.fields.inspectionResult.placeholder")}
                options={[
                  { label: t("plans.inspection.passed"), value: "passed" },
                  { label: t("plans.inspection.failed"), value: "failed" },
                  { label: t("plans.inspection.needsWork"), value: "needs-work" },
                ]}
              />
            </Form.Item>
          )}

          <Form.Item label={t("plans.fields.items.label")} name="items">
            <Select
              {...itemSelectProps}
              mode="multiple"
              placeholder={t("plans.fields.items.placeholder")}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item label={t("plans.fields.notes.label")} name="notes">
            <Input.TextArea rows={3} placeholder={t("plans.fields.notes.placeholder")} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
/**
 * Task Table with Expandable Rows
 */
const TaskTable = ({
  tasks,
  setTasks,
  taskType,
  fertilizerSelectProps,
  pesticideSelectProps,
  itemSelectProps,
  t,
}) => {
  // Main action menu items
  const actionMenuItems = [
    {
      key: "view",
      label: t("actions.view"),
    },
    {
      key: "delete",
      label: t("actions.delete"),
      danger: true,
    },
  ];

  // Handler for editing a task
  const handleEditTask = (task) => {
    // Implementation for edit action
    console.log("Edit task:", task);
  };

  // Handler for deleting a task
  const handleDeleteTask = (key) => {
    setTasks(tasks.filter((task) => task.key !== key));
  };

  // Handler for dropdown menu actions
  const handleMenuClick = (key, task) => {
    if (key === "delete") {
      handleDeleteTask(task.key);
    } else if (key === "view") {
      // Implementation for view action
      console.log("View details for:", task);
    }
  };

  // Define expandable rows content
  const expandedRowRender = (record) => {
    // Define columns for expanded row based on task type
    let detailColumns;

    if (taskType === "caring") {
      detailColumns = [
        { title: t("plans.fields.taskType.label"), dataIndex: "task_type", key: "task_type" },
        { title: t("plans.fields.farmerId.label"), dataIndex: "farmer_id", key: "farmer_id" },
        {
          title: t("plans.fields.fertilizers.label"),
          key: "fertilizers",
          render: (_, record) =>
            record.fertilizers?.length > 0
              ? `${record.fertilizers.length} ${t("plans.fields.selected")}`
              : "-",
        },
        {
          title: t("plans.fields.pesticides.label"),
          key: "pesticides",
          render: (_, record) =>
            record.pesticides?.length > 0
              ? `${record.pesticides.length} ${t("plans.fields.selected")}`
              : "-",
        },
        {
          title: t("plans.fields.action.label"),
          key: "operation",
          render: () => (
            <Space size="middle">
              <a>{t("actions.start")}</a>
              <a>{t("actions.reschedule")}</a>
              <a>{t("actions.complete")}</a>
            </Space>
          ),
        },
      ];
    } else if (taskType === "harvesting") {
      detailColumns = [
        { title: t("plans.fields.taskType.label"), dataIndex: "task_type", key: "task_type" },
        { title: t("plans.fields.farmerId.label"), dataIndex: "farmer_id", key: "farmer_id" },
        {
          title: t("plans.fields.estimatedYield.label"),
          dataIndex: "estimated_yield",
          key: "estimated_yield",
        },
        {
          title: t("plans.fields.action.label"),
          key: "operation",
          render: () => (
            <Space size="middle">
              <a>{t("actions.start")}</a>
              <a>{t("actions.reschedule")}</a>
              <a>{t("actions.complete")}</a>
            </Space>
          ),
        },
      ];
    } else {
      detailColumns = [
        { title: t("plans.fields.taskType.label"), dataIndex: "task_type", key: "task_type" },
        {
          title: t("plans.fields.inspectorId.label"),
          dataIndex: "inspector_id",
          key: "inspector_id",
        },
        {
          title: t("plans.fields.inspectionResult.label"),
          dataIndex: "inspection_result",
          key: "inspection_result",
        },
        {
          title: t("plans.fields.action.label"),
          key: "operation",
          render: () => (
            <Space size="middle">
              <a>{t("actions.start")}</a>
              <a>{t("actions.reschedule")}</a>
              <a>{t("actions.complete")}</a>
            </Space>
          ),
        },
      ];
    }

    // Common detail columns for all task types
    const commonDetailColumns = [
      {
        title: t("plans.fields.notes.label"),
        dataIndex: "notes",
        key: "notes",
        render: (notes) => notes || "-",
      },
      {
        title: t("plans.fields.items.label"),
        key: "items",
        render: (_, record) =>
          record.items?.length > 0 ? `${record.items.length} ${t("plans.fields.selected")}` : "-",
      },
    ];

    // Create a single row of data based on the record
    const detailData = [{ ...record, key: `${record.key}-detail` }];

    return (
      <div style={{ margin: "0 16px" }}>
        <Table
          columns={[...detailColumns, ...commonDetailColumns]}
          dataSource={detailData}
          pagination={false}
          size="small"
        />
      </div>
    );
  };

  // Define main table columns
  const columns = [
    {
      title: t("plans.fields.taskName.label"),
      dataIndex: "task_name",
      key: "task_name",
    },
    {
      title: t("plans.fields.startDate.label"),
      dataIndex: "start_date",
      key: "start_date",
      render: (date) => new Date(date).toLocaleString(),
      width: 180,
    },
    {
      title: t("plans.fields.endDate.label"),
      dataIndex: "end_date",
      key: "end_date",
      render: (date) => new Date(date).toLocaleString(),
      width: 180,
    },
    {
      title: t("plans.fields.status.label"),
      key: "status",
      dataIndex: "status",
      width: 120,
      render: (status) => {
        let statusBadge;
        switch (status) {
          case "completed":
            statusBadge = <Badge status="success" text={t("plans.status.completed")} />;
            break;
          case "in-progress":
            statusBadge = <Badge status="processing" text={t("plans.status.inProgress")} />;
            break;
          default:
            statusBadge = <Badge status="default" text={t("plans.status.pending")} />;
        }
        return statusBadge;
      },
    },
    {
      title: t("plans.fields.action.label"),
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEditTask(record)} />
          <Dropdown
            menu={{
              items: actionMenuItems,
              onClick: ({ key }) => handleMenuClick(key, record),
            }}
          >
            <Button type="text">
              <Space>
                {t("actions.more")}
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ marginTop: 16 }}>
      <Table
        columns={columns}
        dataSource={tasks}
        expandable={{
          expandedRowRender,
          expandRowByClick: true,
        }}
        size="middle"
        locale={{ emptyText: t("plans.tasks.noTasks") }}
      />
    </div>
  );
};
/**
 * Step 4: Task Management
 */
const TasksStep = ({
  t,
  caringTasks,
  setCaringTasks,
  harvestingTasks,
  setHarvestingTasks,
  inspectingTasks,
  setInspectingTasks,
  fertilizerSelectProps,
  pesticideSelectProps,
  itemSelectProps,
}) => {
  // State for the active tab
  const [activeTab, setActiveTab] = useState("caring");

  return (
    <Card className="task-step-card">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        tabBarExtraContent={
          <TaskFormModal
            taskType={activeTab}
            onTaskAdded={(task) => {
              if (activeTab === "caring") {
                setCaringTasks([...caringTasks, { ...task, key: `caring-${caringTasks.length}` }]);
              } else if (activeTab === "harvesting") {
                setHarvestingTasks([
                  ...harvestingTasks,
                  { ...task, key: `harvesting-${harvestingTasks.length}` },
                ]);
              } else if (activeTab === "inspecting") {
                setInspectingTasks([
                  ...inspectingTasks,
                  { ...task, key: `inspecting-${inspectingTasks.length}` },
                ]);
              }
            }}
            fertilizerSelectProps={fertilizerSelectProps}
            pesticideSelectProps={pesticideSelectProps}
            itemSelectProps={itemSelectProps}
            t={t}
          />
        }
      >
        <TabPane
          tab={
            <span>
              <Badge count={caringTasks.length} size="small" offset={[10, 0]}>
                {t("plans.tasks.caring")}
              </Badge>
            </span>
          }
          key="caring"
        >
          <TaskTable
            tasks={caringTasks}
            setTasks={setCaringTasks}
            taskType="caring"
            fertilizerSelectProps={fertilizerSelectProps}
            pesticideSelectProps={pesticideSelectProps}
            itemSelectProps={itemSelectProps}
            t={t}
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <Badge count={harvestingTasks.length} size="small" offset={[10, 0]}>
                {t("plans.tasks.harvesting")}
              </Badge>
            </span>
          }
          key="harvesting"
        >
          <TaskTable
            tasks={harvestingTasks}
            setTasks={setHarvestingTasks}
            taskType="harvesting"
            itemSelectProps={itemSelectProps}
            t={t}
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <Badge count={inspectingTasks.length} size="small" offset={[10, 0]}>
                {t("plans.tasks.inspecting")}
              </Badge>
            </span>
          }
          key="inspecting"
        >
          <TaskTable
            tasks={inspectingTasks}
            setTasks={setInspectingTasks}
            taskType="inspecting"
            itemSelectProps={itemSelectProps}
            t={t}
          />
        </TabPane>
      </Tabs>
    </Card>
  );
};

/**
 * Step 5: Review
 */
const ReviewStep = ({
  t,
  formProps,
  caringTasks,
  harvestingTasks,
  inspectingTasks,
}: {
  t: (key: string) => string;
  formProps: any;
  caringTasks: Partial<ICaringTask>[];
  harvestingTasks: Partial<IHarvestingTask>[];
  inspectingTasks: Partial<IInspectingForm>[];
}) => (
  <Flex vertical>
    <Title level={4}>{t("plans.steps.review")}</Title>

    {/* Plan Details Section */}
    <ReviewSection
      fields={[
        { label: t("plans.fields.plant.label"), value: formProps.form.getFieldValue("plantId") },
        { label: t("plans.fields.yield.label"), value: formProps.form.getFieldValue("yieldId") },
        {
          label: t("plans.fields.planName.label"),
          value: formProps.form.getFieldValue("planName"),
        },
        {
          label: t("plans.fields.description.label"),
          value: formProps.form.getFieldValue("description"),
        },
        {
          label: t("plans.fields.startedDate.label"),
          value: formProps.form.getFieldValue("startedDate")?.toLocaleString(),
        },
        {
          label: t("plans.fields.endedDate.label"),
          value: formProps.form.getFieldValue("endedDate")?.toLocaleString(),
        },
        {
          label: t("plans.fields.estimatedProduct.label"),
          value: `${formProps.form.getFieldValue("estimatedProduct")} ${formProps.form.getFieldValue("estimatedUnit")}`,
        },
        { label: t("plans.fields.status.label"), value: formProps.form.getFieldValue("status") },
      ]}
    />

    {/* Tasks Review */}
    <Title level={5} style={{ marginTop: "16px" }}>
      {t("plans.tasks.caring")}
    </Title>
    <TasksTable tasks={caringTasks} />

    <Title level={5}>{t("plans.tasks.harvesting")}</Title>
    <TasksTable tasks={harvestingTasks} />

    <Title level={5}>{t("plans.tasks.inspecting")}</Title>
    <TasksTable tasks={inspectingTasks} />
  </Flex>
);

/**
 * Review Section component for displaying field values
 */
const ReviewSection = ({ fields }: { fields: { label: string; value: any }[] }) => (
  <>
    {fields.map((field, index) => (
      <div key={index}>
        <Text strong>{field.label}: </Text>
        <Text>{field.value}</Text>
      </div>
    ))}
  </>
);

/**
 * Tasks Table component for the review step
 */
const TasksTable = ({ tasks }: { tasks: any[] }) => (
  <Table
    dataSource={tasks}
    columns={[
      { title: "Task Name", dataIndex: "taskName" },
      { title: "Type", dataIndex: "taskType" },
      {
        title: "Start Date",
        dataIndex: "startDate",
        render: (val) => new Date(val).toLocaleString(),
      },
    ]}
    pagination={false}
  />
);
