import { UseFormReturnType } from "@refinedev/antd";
import {
  Space,
  Card,
  Typography,
  Table,
  Tag,
  Row,
  Col,
  Statistic,
  Divider,
  Grid,
  theme,
  Tabs,
  List,
  Avatar,
} from "antd";
import { IPlant, Template } from "@/interfaces";
import dayjs from "dayjs";
import { useTaskStore } from "@/store/task-store";
import { useList } from "@refinedev/core";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  FieldTimeOutlined,
  FileTextOutlined,
  ToolOutlined,
  CheckOutlined,
  FileSearchOutlined,
  InboxOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const { useBreakpoint } = Grid;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

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
  icon: React.ReactNode;
  color: string;
};

interface TaskItem {
  item_id: number;
  quantity: number;
  unit: string;
}

interface TaskFertilizer {
  fertilizer_id: number;
  quantity: number;
  unit: string;
}

interface TaskPesticide {
  pesticide_id: number;
  quantity: number;
  unit: string;
}

interface TaskRecord {
  task_name: string;
  description: string;
  start_date: string;
  end_date: string;
  created_by: string;
  items?: TaskItem[];
  fertilizers?: TaskFertilizer[];
  pesticides?: TaskPesticide[];
}

interface ReviewSectionProps {
  formProps: UseFormReturnType<IPlant>["formProps"];
  selectedTemplate: Template | null;
  plantsOptions: { label: string; value: number }[];
  yieldsOptions: { label: string; value: number }[];
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  formProps,
  selectedTemplate,
  plantsOptions,
  yieldsOptions,
}) => {
  const { token } = theme.useToken();
  const screens = useBreakpoint();
  const { counts } = useTaskStore();

  const { data: itemsData } = useList({
    resource: "items",
  });

  const { data: pesticidesData } = useList({
    resource: "pesticides",
  });

  const { data: fertilizersData } = useList({
    resource: "fertilizers",
  });

  const getItemName = (id: number) => {
    return itemsData?.data.find((item) => item.id === id)?.name || "Unknown Item";
  };

  const getPesticideName = (id: number) => {
    return (
      pesticidesData?.data.find((pesticide) => pesticide.id === id)?.name || "Unknown Pesticide"
    );
  };

  const getFertilizerName = (id: number) => {
    return (
      fertilizersData?.data.find((fertilizer) => fertilizer.id === id)?.name || "Unknown Fertilizer"
    );
  };

  const taskTypes: TaskSummaryRecord[] = [
    {
      task_type: "Chăm sóc",
      task_count: counts.caring,
      icon: <ToolOutlined />,
      color: "#1890ff",
    },
    {
      task_type: "Thu hoạch",
      task_count: counts.harvesting,
      icon: <CheckOutlined />,
      color: "#52c41a",
    },
    {
      task_type: "Kiểm tra",
      task_count: counts.inspecting,
      icon: <FileSearchOutlined />,
      color: "#faad14",
    },
    {
      task_type: "Đóng gói",
      task_count: counts.packaging,
      icon: <InboxOutlined />,
      color: "#722ed1",
    },
  ];

  const basicInfo = {
    plan_name: formProps.form?.getFieldValue("plan_name") || "",
    plant_name:
      plantsOptions.find((p) => p.value === formProps.form?.getFieldValue("plant_id"))?.label || "",
    season_name: formProps.form?.getFieldValue("season_name") || "",
    start_date: formProps.form?.getFieldValue("start_date") || "",
    end_date: formProps.form?.getFieldValue("end_date") || "",
    estimated_product: formProps.form?.getFieldValue("estimated_product") || 0,
    seed_quantity: formProps.form?.getFieldValue("seed_quantity") || 0,
    land_name:
      yieldsOptions.find((y) => y.value === formProps.form?.getFieldValue("yield_id"))?.label || "",
  };

  const renderBasicInfo = () => (
    <Card
      style={{
        background: token.colorBgContainer,
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowTertiary,
      }}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Title level={4} style={{ margin: 0 }}>
          <FileTextOutlined style={{ marginRight: 8, color: token.colorPrimary }} />
          Thông tin cơ bản
        </Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card size="small" hoverable>
              <Statistic
                title={
                  <Space>
                    <UserOutlined />
                    <span>Tên kế hoạch</span>
                  </Space>
                }
                value={basicInfo.plan_name}
                valueStyle={{ fontSize: "16px" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card size="small" hoverable>
              <Statistic
                title={
                  <Space>
                    <EnvironmentOutlined />
                    <span>Cây trồng</span>
                  </Space>
                }
                value={basicInfo.plant_name}
                valueStyle={{ fontSize: "16px" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card size="small" hoverable>
              <Statistic
                title={
                  <Space>
                    <ClockCircleOutlined />
                    <span>Mùa vụ</span>
                  </Space>
                }
                value={basicInfo.season_name}
                valueStyle={{ fontSize: "16px" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card size="small" hoverable>
              <Statistic
                title={
                  <Space>
                    <EnvironmentOutlined />
                    <span>Khu đất</span>
                  </Space>
                }
                value={basicInfo.land_name}
                valueStyle={{ fontSize: "16px" }}
              />
            </Card>
          </Col>
          <Col span={24}>
            <Card size="small" hoverable>
              <Space direction="vertical" size="small" style={{ width: "100%" }}>
                <Text strong>Thời gian thực hiện</Text>
                <Space>
                  <Tag icon={<CalendarOutlined />} color="blue">
                    Bắt đầu: {dayjs(basicInfo.start_date).format("DD/MM/YYYY")}
                  </Tag>
                  <Tag icon={<CalendarOutlined />} color="green">
                    Kết thúc: {dayjs(basicInfo.end_date).format("DD/MM/YYYY")}
                  </Tag>
                </Space>
              </Space>
            </Card>
          </Col>
        </Row>
      </Space>
    </Card>
  );

  const renderProductionInfo = () => (
    <Card
      style={{
        background: token.colorBgContainer,
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowTertiary,
      }}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Title level={4} style={{ margin: 0 }}>
          <EnvironmentOutlined style={{ marginRight: 8, color: token.colorPrimary }} />
          Thông tin sản lượng
        </Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12}>
            <Card size="small" hoverable>
              <Statistic
                title={
                  <Space>
                    <EnvironmentOutlined />
                    <span>Sản lượng dự kiến</span>
                  </Space>
                }
                value={basicInfo.estimated_product}
                suffix="kg"
                valueStyle={{ color: "#52c41a", fontSize: "24px" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card size="small" hoverable>
              <Statistic
                title={
                  <Space>
                    <EnvironmentOutlined />
                    <span>Lượng giống</span>
                  </Space>
                }
                value={basicInfo.seed_quantity}
                valueStyle={{ color: "#1890ff", fontSize: "24px" }}
              />
            </Card>
          </Col>
        </Row>
      </Space>
    </Card>
  );

  const renderTaskOverview = () => (
    <Card
      style={{
        background: token.colorBgContainer,
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowTertiary,
      }}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Title level={4} style={{ margin: 0 }}>
          <FieldTimeOutlined style={{ marginRight: 8, color: token.colorPrimary }} />
          Tổng quan công việc
        </Title>
        <Row gutter={[24, 24]}>
          {taskTypes.map((task) => (
            <Col xs={24} sm={12} md={6} key={task.task_type}>
              <Card
                size="small"
                hoverable
                style={{
                  borderLeft: `4px solid ${task.color}`,
                  background: `${task.color}10`,
                }}
              >
                <Statistic
                  title={
                    <Space>
                      {task.icon}
                      <span>{task.task_type}</span>
                    </Space>
                  }
                  value={task.task_count}
                  valueStyle={{ color: task.color, fontSize: "24px" }}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Space>
    </Card>
  );

  const renderTaskDetails = () => {
    if (!selectedTemplate) return null;

    return (
      <>
        <Divider orientation="left">
          <Title level={4} style={{ margin: 0 }}>
            Chi tiết công việc
          </Title>
        </Divider>

        <Row gutter={[24, 24]}>
          {taskTypes.map((task) => {
            let tasks;
            switch (task.task_type) {
              case "Chăm sóc":
                tasks = formProps.form?.getFieldValue("caring_tasks") || [];
                break;
              case "Thu hoạch":
                tasks = formProps.form?.getFieldValue("harvesting_tasks") || [];
                break;
              case "Kiểm tra":
                tasks = formProps.form?.getFieldValue("inspecting_forms") || [];
                break;
              case "Đóng gói":
                tasks = formProps.form?.getFieldValue("packaging_tasks") || [];
                break;
              default:
                tasks = [];
            }

            if (!tasks?.length) return null;

            return (
              <Col span={24} key={task.task_type}>
                <Card
                  style={{
                    background: token.colorBgContainer,
                    borderRadius: token.borderRadiusLG,
                    boxShadow: token.boxShadowTertiary,
                  }}
                >
                  <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    <Title level={5} style={{ margin: 0 }}>
                      {task.icon} {task.task_type}
                    </Title>
                    <Table<TaskRecord>
                      rowKey={(record) => `${record.task_name}-${record.start_date}`}
                      columns={[
                        { title: "Tên công việc", dataIndex: "task_name" },
                        { title: "Mô tả", dataIndex: "description" },
                        {
                          title: "Thời gian",
                          dataIndex: "time",
                          render: (_, record: TaskRecord) => (
                            <Space>
                              <Tag icon={<CalendarOutlined />} color="blue">
                                {dayjs(record.start_date).format("DD/MM/YYYY")}
                              </Tag>
                              <Tag icon={<CalendarOutlined />} color="green">
                                {dayjs(record.end_date).format("DD/MM/YYYY")}
                              </Tag>
                            </Space>
                          ),
                        },
                        {
                          title: "Người tạo",
                          dataIndex: "created_by",
                        },
                      ]}
                      dataSource={tasks}
                      pagination={false}
                      size="small"
                      expandable={{
                        expandedRowRender: (record: TaskRecord) => (
                          <Space direction="vertical" style={{ width: "100%" }}>
                            {record.items && record.items.length > 0 && (
                              <Card size="small" title="Dụng cụ sử dụng">
                                <List
                                  dataSource={record.items}
                                  renderItem={(item: TaskItem) => (
                                    <List.Item>
                                      <List.Item.Meta
                                        avatar={
                                          <Avatar
                                            src={
                                              itemsData?.data.find((i) => i.id === item.item_id)
                                                ?.image
                                            }
                                          />
                                        }
                                        title={getItemName(item.item_id)}
                                        description={`Số lượng: ${item.quantity} ${item.unit}`}
                                      />
                                    </List.Item>
                                  )}
                                />
                              </Card>
                            )}
                            {record.fertilizers && record.fertilizers.length > 0 && (
                              <Card size="small" title="Phân bón sử dụng">
                                <List
                                  dataSource={record.fertilizers}
                                  renderItem={(fertilizer: TaskFertilizer) => (
                                    <List.Item>
                                      <List.Item.Meta
                                        avatar={
                                          <Avatar
                                            src={
                                              fertilizersData?.data.find(
                                                (f) => f.id === fertilizer.fertilizer_id,
                                              )?.image
                                            }
                                          />
                                        }
                                        title={getFertilizerName(fertilizer.fertilizer_id)}
                                        description={`Số lượng: ${fertilizer.quantity} ${fertilizer.unit}`}
                                      />
                                    </List.Item>
                                  )}
                                />
                              </Card>
                            )}
                            {record.pesticides && record.pesticides.length > 0 && (
                              <Card size="small" title="Thuốc trừ sâu sử dụng">
                                <List
                                  dataSource={record.pesticides}
                                  renderItem={(pesticide: TaskPesticide) => (
                                    <List.Item>
                                      <List.Item.Meta
                                        avatar={
                                          <Avatar
                                            src={
                                              pesticidesData?.data.find(
                                                (p) => p.id === pesticide.pesticide_id,
                                              )?.image
                                            }
                                          />
                                        }
                                        title={getPesticideName(pesticide.pesticide_id)}
                                        description={`Số lượng: ${pesticide.quantity} ${pesticide.unit}`}
                                      />
                                    </List.Item>
                                  )}
                                />
                              </Card>
                            )}
                          </Space>
                        ),
                      }}
                    />
                  </Space>
                </Card>
              </Col>
            );
          })}
        </Row>
      </>
    );
  };

  return (
    <Tabs
      defaultActiveKey="1"
      style={{
        background: token.colorBgContainer,
        padding: "16px",
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowTertiary,
      }}
      items={[
        {
          key: "1",
          label: (
            <span style={{ fontSize: "16px", fontWeight: 500 }}>
              <FileTextOutlined style={{ marginRight: 8 }} />
              Thông tin cơ bản
            </span>
          ),
          children: (
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              {renderBasicInfo()}
              {renderProductionInfo()}
            </Space>
          ),
        },
        {
          key: "2",
          label: (
            <span style={{ fontSize: "16px", fontWeight: 500 }}>
              <FieldTimeOutlined style={{ marginRight: 8 }} />
              Công việc
            </span>
          ),
          children: (
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              {renderTaskOverview()}
              {renderTaskDetails()}
            </Space>
          ),
        },
      ]}
    />
  );
};
