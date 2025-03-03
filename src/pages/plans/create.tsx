import { useTranslate, useGo } from "@refinedev/core";
import { SaveButton, useStepsForm, useSelect } from "@refinedev/antd";
import {
  Form,
  Select,
  Input,
  Button,
  Steps,
  Card,
  Flex,
  Typography,
  Calendar,
  Badge,
  Modal,
  DatePicker,
  InputNumber,
  Space,
  Alert,
  Divider,
  Tooltip,
  SelectProps,
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import type { IPlan, IPlant, IYield } from "../../interfaces";
import { useState } from "react";
import { Dayjs } from "dayjs";
import { useNavigate } from "react-router";

const { RangePicker } = DatePicker;

export const PlanCreate = () => {
  const t = useTranslate();
  const navigate = useNavigate();
  const go = useGo();

  const { current, gotoStep, stepsProps, formProps, saveButtonProps } = useStepsForm<IPlan>({
    resource: "plans",
    action: "create",
    redirect: false,
    onMutationSuccess: () => {
      go({ to: "/plan", type: "push" });
    },
  });

  const { selectProps: plantSelectProps } = useSelect<IPlant>({
    resource: "plant",
    optionLabel: "plant_name",
    optionValue: "plant_id",
    meta: {
      fields: [
        "plant_id",
        "plant_name",
        "description",
        "min_temp",
        "max_temp",
        "min_humid",
        "max_humid",
        "min_moisture",
        "max_moisture",
      ],
    },
  });

  const { selectProps: yieldSelectProps } = useSelect<IYield>({
    resource: "yield",
    optionLabel: "yield_name",
    optionValue: "yield_id",
    meta: {
      fields: ["yield_id", "yield_name", "area", "area_unit", "description"],
    },
  });

  const [selectedPlant, setSelectedPlant] = useState<IPlant | null>(null);
  const [selectedYield, setSelectedYield] = useState<IYield | null>(null);
  const [events, setEvents] = useState<{ date: Dayjs; title: string; description: string }[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  const handlePlantSelect = (plantId: number) => {
    const plant = plantSelectProps.options?.find((p) => p.value === plantId)?.option as IPlant;
    setSelectedPlant(plant);
    formProps?.form?.setFieldsValue({ plant: { plant_id: plantId } });
  };

  const handleYieldSelect = (yieldId: number) => {
    const yieldData = yieldSelectProps.options?.find((y) => y.value === yieldId)?.option as IYield;
    setSelectedYield(yieldData);
    formProps?.form?.setFieldsValue({ yield: { yield_id: yieldId } });
  };

  const steps = [
    {
      title: t("plans.steps.selectPlant"),
      content: (
        <Flex vertical gap={16}>
          <Typography.Title level={4}>{t("plans.fields.selectPlant")}</Typography.Title>
          <Flex wrap="wrap" gap={16}>
            {plantSelectProps.options?.map((plant) => (
              <Card
                key={plant.value}
                hoverable
                style={{ width: 300 }}
                onClick={() => handlePlantSelect(plant.value as number)}
                className={selectedPlant?.plant_id === plant.value ? "selected-card" : ""}
              >
                <Card.Meta
                  title={plant.label}
                  description={
                    <Space direction="vertical" size="small">
                      <Typography.Text type="secondary">
                        {plant.option?.description}
                      </Typography.Text>
                      <Divider style={{ margin: "8px 0" }} />
                      <Typography.Text>
                        Temperature: {plant.option?.min_temp}°C - {plant.option?.max_temp}°C
                      </Typography.Text>
                      <Typography.Text>
                        Humidity: {plant.option?.min_humid}% - {plant.option?.max_humid}%
                      </Typography.Text>
                    </Space>
                  }
                />
              </Card>
            ))}
            <Card
              hoverable
              style={{ width: 300 }}
              onClick={() => navigate("/plants/create?to=/plans/create")}
            >
              <Card.Meta
                title={t("plans.actions.createNewPlant")}
                description={t("plans.actions.createNewPlantDesc")}
              />
            </Card>
          </Flex>
          {selectedPlant && (
            <Alert
              message="Plant Requirements"
              description={
                <Space direction="vertical">
                  <Typography.Text>
                    Moisture: {selectedPlant.min_moisture}% - {selectedPlant.max_moisture}%
                  </Typography.Text>
                  <Typography.Text>
                    Fertilizer: {selectedPlant.min_fertilizer_quantity} -{" "}
                    {selectedPlant.max_fertilizer_quantity} {selectedPlant.fertilizer_unit}
                  </Typography.Text>
                  <Typography.Text>
                    Brix Point: {selectedPlant.min_brix_point} - {selectedPlant.max_brix_point}
                  </Typography.Text>
                </Space>
              }
              type="info"
              showIcon
            />
          )}
        </Flex>
      ),
    },
    {
      title: t("plans.steps.selectYield"),
      content: (
        <Flex vertical gap={16}>
          <Form.Item
            label={t("plans.fields.yield")}
            name={["yield", "yield_id"]}
            rules={[{ required: true }]}
          >
            <Select<number>
              {...(yieldSelectProps as SelectProps<number>)}
              placeholder={t("plans.fields.yieldPlaceholder")}
              onChange={handleYieldSelect}
            />
          </Form.Item>
          {selectedYield && (
            <Card>
              <Flex vertical gap={8}>
                <Typography.Text strong>Selected Yield Area Details:</Typography.Text>
                <Typography.Text>
                  Area: {selectedYield.area} {selectedYield.area_unit}
                </Typography.Text>
                <Typography.Text>Type: {selectedYield.type}</Typography.Text>
                <Typography.Text>Size: {selectedYield.size}</Typography.Text>
              </Flex>
            </Card>
          )}
        </Flex>
      ),
    },
    {
      title: t("plans.steps.planDetails"),
      content: (
        <Flex vertical gap={16}>
          <Form.Item
            label={t("plans.fields.planName")}
            name="plan_name"
            rules={[{ required: true }]}
          >
            <Input placeholder={t("plans.fields.planNamePlaceholder")} />
          </Form.Item>

          <Form.Item
            label={t("plans.fields.dateRange")}
            name="date_range"
            rules={[{ required: true }]}
          >
            <RangePicker
              style={{ width: "100%" }}
              onChange={(dates) => {
                if (dates) {
                  formProps?.form?.setFieldsValue({
                    started_date: dates[0],
                    ended_date: dates[1],
                  });
                }
              }}
            />
          </Form.Item>

          <Form.Item label={t("plans.fields.estimatedProduct")} required>
            <Flex gap={8}>
              <Form.Item
                name="estimated_product"
                rules={[{ required: true }]}
                style={{ marginBottom: 0 }}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                name="estimated_unit"
                rules={[{ required: true }]}
                style={{ marginBottom: 0 }}
              >
                <Select
                  style={{ width: 120 }}
                  options={[
                    { label: "kg", value: "kg" },
                    { label: "ton", value: "ton" },
                    { label: "pieces", value: "pieces" },
                  ]}
                />
              </Form.Item>
            </Flex>
          </Form.Item>

          <Form.Item label={t("plans.fields.description")} name="description">
            <Input.TextArea rows={3} placeholder={t("plans.fields.descriptionPlaceholder")} />
          </Form.Item>
        </Flex>
      ),
    },
    {
      title: t("plans.steps.addTasks"),
      content: (
        <Flex vertical gap={16}>
          <Typography.Title level={4}>
            {t("plans.fields.tasks")}
            <Tooltip title="Add tasks by clicking on calendar dates">
              <InfoCircleOutlined style={{ marginLeft: 8 }} />
            </Tooltip>
          </Typography.Title>
          <Calendar
            style={{ border: "1px solid #d9d9d9", borderRadius: "6px" }}
            onSelect={(date) => {
              setSelectedDate(date);
              setIsModalVisible(true);
            }}
            dateCellRender={(date) => {
              const dayEvents = events.filter((event) => event.date.isSame(date, "day"));
              return (
                <ul className="events">
                  {dayEvents.map((event, index) => (
                    <li key={index}>
                      <Badge
                        status="processing"
                        text={<Tooltip title={event.description}>{event.title}</Tooltip>}
                      />
                    </li>
                  ))}
                </ul>
              );
            }}
          />
        </Flex>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", maxWidth: "1600px", margin: "0 auto" }}>
      <Flex vertical gap={24}>
        <Card>
          <Typography.Title level={2}>{t("plans.actions.create")}</Typography.Title>
          <Steps {...stepsProps} current={current}>
            {steps.map((step) => (
              <Steps.Step key={step.title} title={step.title} />
            ))}
          </Steps>
        </Card>

        <Form
          {...formProps}
          layout="vertical"
          style={{ width: "100%" }}
          onFinish={(values) => {
            formProps.onFinish?.({
              ...values,
              tasks: events.map((event) => ({
                title: event.title,
                description: event.description,
                date: event.date.toISOString(),
              })),
              status: "Pending",
            });
          }}
        >
          <Card>{steps[current].content}</Card>

          <Flex justify="space-between" style={{ marginTop: 24 }}>
            <Button onClick={() => go({ to: "/plans", type: "push" })}>
              {t("buttons.cancel")}
            </Button>
            <Space>
              {current > 0 && (
                <Button onClick={() => gotoStep(current - 1)}>{t("buttons.previousStep")}</Button>
              )}
              {current < steps.length - 1 ? (
                <Button
                  type="primary"
                  onClick={() => gotoStep(current + 1)}
                  disabled={(current === 0 && !selectedPlant) || (current === 1 && !selectedYield)}
                >
                  {t("buttons.nextStep")}
                </Button>
              ) : (
                <SaveButton {...saveButtonProps} />
              )}
            </Space>
          </Flex>
        </Form>
      </Flex>

      <Modal
        title={t("plans.fields.addTask")}
        open={isModalVisible}
        onOk={() => {
          if (selectedDate && taskTitle) {
            setEvents([
              ...events,
              { date: selectedDate, title: taskTitle, description: taskDescription },
            ]);
            setTaskTitle("");
            setTaskDescription("");
            setIsModalVisible(false);
          }
        }}
        onCancel={() => setIsModalVisible(false)}
        okButtonProps={{ disabled: !taskTitle }}
      >
        <Form layout="vertical">
          <Form.Item
            label={t("plans.fields.taskTitle")}
            required
            tooltip="Enter a clear and concise task title"
          >
            <Input
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder={t("plans.fields.taskTitlePlaceholder")}
            />
          </Form.Item>
          <Form.Item
            label={t("plans.fields.taskDescription")}
            tooltip="Add detailed instructions or notes for the task"
          >
            <Input.TextArea
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder={t("plans.fields.taskDescriptionPlaceholder")}
              rows={4}
            />
          </Form.Item>
        </Form>
      </Modal>

      <style>{`
        .selected-card {
          border-color: #1890ff;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }
        .events {
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .events li {
          margin-bottom: 4px;
        }
      `}</style>
    </div>
  );
};
