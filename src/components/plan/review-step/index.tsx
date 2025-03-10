import { ICaringTask, IHarvestingTask, IInspectingForm, IPlant, IYield } from "@/interfaces";
import { Flex, Table, Typography, Card, Divider, Row, Col, Descriptions, Tag, Empty } from "antd";
import { CSSProperties, useMemo } from "react";

const { Title } = Typography;

const sectionStyle: CSSProperties = { marginBottom: "24px" };

export const ReviewStep = ({
  t,
  formProps,
  caringTasks = [],
  harvestingTasks = [],
  inspectingTasks = [],
  plants = [],
  yields = [],
}: {
  t: (key: string) => string;
  formProps: any;
  caringTasks: Partial<ICaringTask>[];
  harvestingTasks: Partial<IHarvestingTask>[];
  inspectingTasks: Partial<IInspectingForm>[];
  plants?: IPlant[];
  yields?: IYield[];
}) => {
  const formatDate = (date: any) => {
    if (!date) return "-";
    try {
      return new Date(date).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch (e) {
      return String(date);
    }
  };

  const plantId = formProps.form.getFieldValue("plant_id");
  const yieldId = formProps.form.getFieldValue("yield_id");

  const getPlantName = () => {
    if (formProps.initialValues?.plant_information?.plant_name) {
      return formProps.initialValues.plant_information.plant_name;
    }

    const plant = plants.find((p) => p.id === plantId);
    if (plant) return plant.plant_name;

    return plantId ? `ID: ${plantId}` : "-";
  };

  const getYieldName = () => {
    if (formProps.initialValues?.yield_information?.yield_name) {
      return formProps.initialValues.yield_information.yield_name;
    }

    const yieldItem = yields.find((y) => y.id === yieldId);
    if (yieldItem) return yieldItem.yield_name;

    return yieldId ? `ID: ${yieldId}` : "-";
  };

  const formattedCaringTasks = useMemo(
    () =>
      caringTasks.map((task) => ({
        id: task.id,
        taskName: task.task_name,
        taskType: task.task_type,
        startDate: task.start_date,
        endDate: task.end_date,
        status: task.status,
        priority: task.priority,
      })),
    [caringTasks],
  );

  const formattedHarvestingTasks = useMemo(
    () =>
      harvestingTasks.map((task) => ({
        id: task.id,
        taskName: task.task_name,
        startDate: task.start_date,
        endDate: task.end_date,
        status: task.status,
        priority: task.priority,
      })),
    [harvestingTasks],
  );

  const formattedInspectingTasks = useMemo(
    () =>
      inspectingTasks.map((task) => ({
        id: task.id,
        taskName: task.task_name,
        taskType: task.task_type,
        startDate: task.start_date,
        endDate: task.end_date,
        status: task.status,
        priority: task.priority,
      })),
    [inspectingTasks],
  );

  // Generate columns for task tables
  const caringColumns = [
    {
      title: t("plans.fields.taskName.label"),
      dataIndex: "taskName",
      key: "taskName",
      ellipsis: true,
    },
    {
      title: t("plans.fields.taskType.label"),
      dataIndex: "taskType",
      key: "taskType",
      render: (value: string) => <Tag color="blue">{value}</Tag>,
      width: 120,
    },
    {
      title: t("plans.fields.startDate.label"),
      dataIndex: "startDate",
      key: "startDate",
      render: (val: string) => formatDate(val),
      width: 180,
    },
    {
      title: t("plans.fields.endDate.label"),
      dataIndex: "endDate",
      key: "endDate",
      render: (val: string) => formatDate(val),
      width: 180,
    },
    {
      title: t("plans.fields.status.label"),
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "default";
        if (status === "Pending") color = "orange";
        if (status === "Completed") color = "green";
        if (status === "Draft") color = "blue";
        if (status === "Cancelled") color = "red";
        return <Tag color={color}>{status}</Tag>;
      },
      width: 100,
    },
  ];

  const harvestingColumns = [
    {
      title: t("plans.fields.taskName.label"),
      dataIndex: "taskName",
      key: "taskName",
      ellipsis: true,
    },
    {
      title: t("plans.fields.startDate.label"),
      dataIndex: "startDate",
      key: "startDate",
      render: (val: string) => formatDate(val),
      width: 180,
    },
    {
      title: t("plans.fields.endDate.label"),
      dataIndex: "endDate",
      key: "endDate",
      render: (val: string) => formatDate(val),
      width: 180,
    },
    {
      title: t("plans.fields.status.label"),
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "default";
        if (status === "Pending") color = "orange";
        if (status === "Completed") color = "green";
        if (status === "Draft") color = "blue";
        if (status === "Cancelled") color = "red";
        return <Tag color={color}>{status}</Tag>;
      },
      width: 100,
    },
  ];

  const inspectingColumns = [
    {
      title: t("plans.fields.taskName.label"),
      dataIndex: "taskName",
      key: "taskName",
      ellipsis: true,
    },
    {
      title: t("plans.fields.taskType.label"),
      dataIndex: "taskType",
      key: "taskType",
      render: (value: string) => <Tag color="purple">{value}</Tag>,
      width: 150,
    },
    {
      title: t("plans.fields.startDate.label"),
      dataIndex: "startDate",
      key: "startDate",
      render: (val: string) => formatDate(val),
      width: 180,
    },
    {
      title: t("plans.fields.endDate.label"),
      dataIndex: "endDate",
      key: "endDate",
      render: (val: string) => formatDate(val),
      width: 180,
    },
    {
      title: t("plans.fields.status.label"),
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "default";
        if (status === "Pending") color = "orange";
        if (status === "Completed") color = "green";
        if (status === "Draft") color = "blue";
        if (status === "Cancelled") color = "red";
        return <Tag color={color}>{status}</Tag>;
      },
      width: 100,
    },
  ];

  return (
    <Flex vertical gap={24}>
      <Title level={4}>{t("plans.steps.review")}</Title>
      <Divider style={{ margin: "0 0 16px 0" }} />

      {/* Plan Details Section */}
      <Card title={t("plans.sections.planDetails")} style={sectionStyle} bordered>
        <Descriptions bordered column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 3 }} size="small">
          <Descriptions.Item label={t("plans.fields.plant.label")}>
            {getPlantName()}
          </Descriptions.Item>
          <Descriptions.Item label={t("plans.fields.yield.label")}>
            {getYieldName()}
          </Descriptions.Item>
          <Descriptions.Item label={t("plans.fields.planName.label")}>
            {formProps.form.getFieldValue("plan_name") || "-"}
          </Descriptions.Item>
          <Descriptions.Item label={t("plans.fields.status.label")}>
            <Tag color="blue">{formProps.form.getFieldValue("status") || "Draft"}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label={t("plans.fields.startedDate.label")}>
            {formatDate(formProps.form.getFieldValue("start_date"))}
          </Descriptions.Item>
          <Descriptions.Item label={t("plans.fields.endedDate.label")}>
            {formatDate(formProps.form.getFieldValue("end_date"))}
          </Descriptions.Item>
          <Descriptions.Item label={t("plans.fields.estimatedProduct.label")}>
            {`${formProps.form.getFieldValue("estimated_product") || 0} ${formProps.form.getFieldValue("estimated_unit") || ""}`}
          </Descriptions.Item>
          <Descriptions.Item label={t("plans.fields.description.label")} span={2}>
            {formProps.form.getFieldValue("description") || "-"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Tasks Review Section */}
      <Row gutter={[0, 24]}>
        {/* Caring Tasks */}
        <Col span={24}>
          <Card
            title={
              <Flex align="center" justify="space-between">
                <span>{t("plans.tasks.caring")}</span>
                <Tag color="blue">{formattedCaringTasks.length}</Tag>
              </Flex>
            }
            bordered
          >
            {formattedCaringTasks.length > 0 ? (
              <Table
                dataSource={formattedCaringTasks}
                columns={caringColumns}
                pagination={false}
                rowKey="id"
                size="small"
                bordered
              />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("plans.tasks.noCaring")} />
            )}
          </Card>
        </Col>

        {/* Harvesting Tasks */}
        <Col span={24}>
          <Card
            title={
              <Flex align="center" justify="space-between">
                <span>{t("plans.tasks.harvesting")}</span>
                <Tag color="green">{formattedHarvestingTasks.length}</Tag>
              </Flex>
            }
            bordered
          >
            {formattedHarvestingTasks.length > 0 ? (
              <Table
                dataSource={formattedHarvestingTasks}
                columns={harvestingColumns}
                pagination={false}
                rowKey="id"
                size="small"
                bordered
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={t("plans.tasks.noHarvesting")}
              />
            )}
          </Card>
        </Col>

        {/* Inspecting Tasks */}
        <Col span={24}>
          <Card
            title={
              <Flex align="center" justify="space-between">
                <span>{t("plans.tasks.inspecting")}</span>
                <Tag color="purple">{formattedInspectingTasks.length}</Tag>
              </Flex>
            }
            bordered
          >
            {formattedInspectingTasks.length > 0 ? (
              <Table
                dataSource={formattedInspectingTasks}
                columns={inspectingColumns}
                pagination={false}
                rowKey="id"
                size="small"
                bordered
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={t("plans.tasks.noInspecting")}
              />
            )}
          </Card>
        </Col>
      </Row>
    </Flex>
  );
};
