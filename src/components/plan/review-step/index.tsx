import { ICaringTask, IHarvestingTask, IInspectingForm } from "@/interfaces";
import { Flex, Table, Typography, Card, Divider } from "antd";
import { CSSProperties } from "react";

const { Title, Text } = Typography;

// Style chung
const sectionStyle: CSSProperties = { marginBottom: "24px" };
const labelStyle: CSSProperties = { width: "200px", display: "inline-block" };

// Component bảng tasks
const TasksTable = ({ tasks, title }: { tasks: any[]; title: string }) => (
  <Card title={title} style={sectionStyle}>
    <Table
      dataSource={tasks}
      columns={[
        {
          title: "Task Name",
          dataIndex: "taskName",
          key: "taskName",
          ellipsis: true,
        },
        {
          title: "Type",
          dataIndex: "taskType",
          key: "taskType",
          width: 150,
        },
        {
          title: "Start Date",
          dataIndex: "startDate",
          key: "startDate",
          render: (val) =>
            val
              ? new Date(val).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })
              : "-",
          width: 200,
        },
      ]}
      pagination={false}
      rowKey="id"
      size="middle"
      bordered
    />
  </Card>
);

// Component review section
const ReviewSection = ({
  fields,
  title,
}: {
  fields: { label: string; value: any }[];
  title: string;
}) => (
  <Card title={title} style={sectionStyle}>
    <Flex vertical gap={8}>
      {fields.map((field, index) => (
        <div key={index}>
          <Text strong style={labelStyle}>
            {field.label}:
          </Text>
          <Text>{field.value || "-"}</Text>
        </div>
      ))}
    </Flex>
  </Card>
);

export const ReviewStep = ({
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
}) => {
  const formatDate = (date: any) =>
    date
      ? new Date(date).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })
      : "-";

  return (
    <Flex vertical gap={16}>
      <Title level={4} style={{ marginBottom: 0 }}>
        {t("plans.steps.review")}
      </Title>
      <Divider style={{ margin: "16px 0" }} />

      {/* Plan Details Section */}
      <ReviewSection
        title={t("plans.sections.planDetails")}
        fields={[
          { label: t("plans.fields.plant.label"), value: formProps.form.getFieldValue("plantId") },
          { label: t("plans.fields.yield.label"), value: formProps.form.getFieldValue("yieldId") },
          {
            label: t("plans.fields.planName.label"),
            value: formProps.form.getFieldValue("plan_name"),
          },
          {
            label: t("plans.fields.description.label"),
            value: formProps.form.getFieldValue("description"),
          },
          {
            label: t("plans.fields.startedDate.label"),
            value: formatDate(formProps.form.getFieldValue("start_date")),
          },
          {
            label: t("plans.fields.endedDate.label"),
            value: formatDate(formProps.form.getFieldValue("end_date")),
          },
          {
            label: t("plans.fields.estimatedProduct.label"),
            value: `${formProps.form.getFieldValue("estimatedProduct") || 0} ${formProps.form.getFieldValue("estimatedUnit") || ""}`,
          },
          { label: t("plans.fields.status.label"), value: formProps.form.getFieldValue("status") },
        ]}
      />

      {/* Tasks Review */}
      <TasksTable tasks={caringTasks} title={t("plans.tasks.caring")} />
      <TasksTable tasks={harvestingTasks} title={t("plans.tasks.harvesting")} />
      <TasksTable tasks={inspectingTasks} title={t("plans.tasks.inspecting")} />
    </Flex>
  );
};
