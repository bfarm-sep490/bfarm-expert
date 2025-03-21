import {
  Image,
  Card,
  Typography,
  Space,
  Tag,
  Flex,
  Divider,
  Row,
  Col,
  Grid,
  Button,
  Badge,
} from "antd";
import {
  EnvironmentOutlined,
  UserOutlined,
  CalendarOutlined,
  BranchesOutlined,
  AuditOutlined,
  GiftOutlined,
  DashboardOutlined,
  ArrowLeftOutlined,
  FieldTimeOutlined,
  GoldOutlined,
  GroupOutlined,
  SunOutlined,
  CloudOutlined,
  BulbOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  EditOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
import { DateField, ShowButton } from "@refinedev/antd";
import { HttpError, useOne } from "@refinedev/core";
import { useNavigate, useParams } from "react-router";
import React, { PropsWithChildren } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { DropDownSection } from "../../components/section/drop-down-section";
import { ActivityCard } from "../../components/card/card-activity";
import { RealTimeContentCard } from "../../components/card/card-real-time";
import { StatusTag } from "../../components/caring-task/status-tag";
import { StatusModal } from "@/components/plan/completd-modal";
import { set } from "lodash";
import { T } from "node_modules/react-router/dist/development/fog-of-war-BALYJxf_.mjs";
import { ProblemsDashBoard } from "@/components/plan/dashboard-problems";
import { IProblem } from "@/interfaces";
import { MaterialDashboard } from "@/components/plan/dashboard-fertilizer-pesticide-item";
import { CaringTaskDashboard } from "@/components/plan/dashboard-caring-tasks";

interface IGeneralPlan {
  plan_id: number;
  plan_name: string;
  plant_information: {
    plant_id: number;
    plant_name: string;
    plant_image: string;
  };
  yield_information: {
    yield_id: number;
    yield_name: string;
    yield_unit: string;
    area: number;
  };
  start_date: Date;
  end_date: Date;
  estimated_product: number;
  estimated_unit: string;
  status: string;
  created_at: Date;
  expert_information: {
    expert_id: number;
    expert_name: string;
  };
  description: string;
}

export const PlanShow = ({ children }: PropsWithChildren<{}>) => {
  const { id } = useParams();
  const [completedModal, setCompletedModal] = React.useState(false);
  const [valueModal, setValueModal] = React.useState("");
  const {
    data: generalData,
    isLoading: generalLoading,
    error: generalError,
  } = useOne<IGeneralPlan, HttpError>({
    resource: "plans",
    id: `${id}/general`,
  });
  const {
    data: farmersData,
    isLoading: farmersLoading,
    error: farmersError,
  } = useOne<any, HttpError>({
    resource: "plans",
    id: `${id}/farmers`,
    queryOptions: {
      staleTime: 1000 * 60,
      cacheTime: 1000 * 60,
    },
  });
  const { data: problemsData, isLoading: problemsLoading } = useOne<
    IProblem[],
    HttpError
  >({
    resource: "plans",
    id: `${id}/problems`,
  });

  const {
    data: taskDashBoardData,
    isLoading: isTaskDashboardLoading,
    error: taskDashBoardError,
  } = useOne<any, HttpError>({
    resource: "plans",
    id: `${id}/tasks/count`,
  });
  console.log(taskDashBoardData);
  const caring_task_dashboard = taskDashBoardData?.data?.caring_tasks;
  const havesting_task_dashboard = taskDashBoardData?.data?.harvesting_tasks;
  const packaging_task_dashboard = taskDashBoardData?.data?.packaging_tasks;
  const general_info = generalData?.data;
  const farmers_info = farmersData?.data as any[];
  const navigate = useNavigate();
  const [state5, setState5] = React.useState({
    series: [
      {
        name: "Độ ẩm %",
        type: "column",
        data: [40, 50, 41, 67, 22, 41, 20, 35, 75, 32, 25, 16],
      },
      {
        name: "Nhiệt độ °C",
        type: "line",
        data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
      },
      stroke: {
        width: [0, 4],
      },
      labels: [
        "01 Jan 2001",
        "02 Jan 2001",
        "03 Jan 2001",
        "04 Jan 2001",
        "05 Jan 2001",
        "06 Jan 2001",
        "07 Jan 2001",
        "08 Jan 2001",
        "09 Jan 2001",
        "10 Jan 2001",
        "11 Jan 2001",
        "12 Jan 2001",
      ],
      yaxis: [
        {
          opposite: true,
          title: {
            text: "Nhiệt độ °C",
            style: {
              fontWeight: "bold",
            },
          },
        },
        {
          title: {
            text: "Độ ẩm %",
            style: {
              fontWeight: "bold",
            },
          },
        },
      ],
    },
  });

  const breakpoint = Grid.useBreakpoint();
  return (
    <div>
      <Button
        type="text"
        style={{ width: "40px", height: "40px" }}
        onClick={() => navigate(`/plans`)}
      >
        <ArrowLeftOutlined style={{ width: "50px", height: "50px" }} />
      </Button>
      <div>
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} md={12} lg={12} xl={12}>
            <Typography.Title level={3}>📋 Thông tin kế hoạch</Typography.Title>
          </Col>
          <Col xs={24} md={12} lg={12} xl={12}>
            <Flex justify="end">
              {general_info?.status === "Draft" && (
                <Space>
                  <Button color="primary" variant="solid" onClick={() => {}}>
                    Xét duyệt kế hoạch
                  </Button>
                </Space>
              )}
            </Flex>
          </Col>
        </Row>
        <Divider />
        <Card title="Thông tin chung" loading={generalLoading}>
          <Flex
            gap={breakpoint.md ? 30 : 16}
            vertical={!breakpoint.md}
            justify="center"
            align="center"
          >
            <Image
              loading="lazy"
              style={{
                borderRadius: 10,
                width: breakpoint.md ? "300px" : "100%",
              }}
              width={300}
              height={400}
              src={
                general_info?.plant_information?.plant_image ||
                "https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2024/1/13/xa-lach-1705113923296944450397.jpg"
              }
            />
            <Flex vertical gap={16} style={{ flex: 1 }}>
              <Typography.Title level={4}>
                🌱 {general_info?.plan_name || "Chưa xác định"}
              </Typography.Title>
              <Divider />
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                  <Space align="start" style={{ marginTop: 12 }}>
                    <EnvironmentOutlined style={{ fontSize: 16 }} />
                    <Typography.Text strong>Thời gian:</Typography.Text>
                    <Typography.Text>
                      {general_info?.start_date ? (
                        <DateField value={general_info?.start_date} />
                      ) : (
                        "Chưa xác định"
                      )}{" "}
                      -
                      {general_info?.end_date ? (
                        <DateField value={general_info?.end_date} />
                      ) : (
                        "Chưa xác định"
                      )}
                    </Typography.Text>
                  </Space>

                  <Space align="start" style={{ marginTop: 12 }}>
                    <UserOutlined style={{ fontSize: 16 }} />
                    <Typography.Text strong>Cây trồng:</Typography.Text>
                    <Typography.Text>
                      {general_info?.plant_information?.plant_name ||
                        "Chưa xác định"}
                    </Typography.Text>
                  </Space>

                  <Space align="start" style={{ marginTop: 12 }}>
                    <GoldOutlined style={{ fontSize: 16 }} />
                    <Typography.Text strong>Khu đất</Typography.Text>
                    <Typography.Text>
                      <Tag>
                        {general_info?.yield_information?.yield_name ||
                          "Chưa xác định"}
                      </Tag>
                    </Typography.Text>
                  </Space>
                  <Space align="start" style={{ marginTop: 12 }}>
                    <GroupOutlined style={{ fontSize: 16 }} />
                    <Typography.Text strong>Sản lượng dự kiến:</Typography.Text>
                    <Typography.Text>
                      {general_info?.estimated_product || "Không có"}{" "}
                      {general_info?.estimated_unit || "Không có"}
                    </Typography.Text>
                  </Space>

                  <Space align="start" style={{ marginTop: 12 }}>
                    <FieldTimeOutlined style={{ fontSize: 16 }} />
                    <Typography.Text strong>Trạng thái:</Typography.Text>
                    <StatusTag status={general_info?.status || "Default"} />
                  </Space>
                  <Space align="start" style={{ marginTop: 12 }}>
                    <CalendarOutlined style={{ fontSize: 16 }} />
                    <Typography.Text strong>Ngày tạo:</Typography.Text>
                    <Typography.Text type="secondary">
                      {general_info?.created_at ? (
                        <DateField
                          value={general_info?.created_at}
                          format="hh:mm DD/MM/YYYY"
                        />
                      ) : (
                        <Typography.Text type="danger">
                          Chưa xác định
                        </Typography.Text>
                      )}
                    </Typography.Text>
                  </Space>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Space align="start" style={{ marginTop: 12 }}>
                    <GroupOutlined style={{ fontSize: 16 }} />
                    <Typography.Text strong>Chuyên gia:</Typography.Text>
                    <Typography.Text>
                      {general_info?.expert_information.expert_name}
                    </Typography.Text>
                  </Space>
                  <Space align="start" style={{ marginTop: 12 }}>
                    <SnippetsOutlined style={{ fontSize: 16 }} />
                    <Typography.Text strong>Mô tả</Typography.Text>
                    <Typography.Paragraph>
                      {general_info?.description || "Không có mô tả"}
                    </Typography.Paragraph>
                  </Space>
                </Col>
              </Row>
            </Flex>
          </Flex>
        </Card>
        <Divider />
        <DropDownSection title="Tổng quan">
          <Row gutter={[16, 16]} justify="center" style={{ marginTop: "30px" }}>
            <Col xs={24} sm={12} md={6}>
              <Card title="📦 Sản lượng thu hoạch">
                <Typography.Title level={2} style={{ textAlign: "center" }}>
                  1000
                </Typography.Title>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <ActivityCard
                loading={generalLoading}
                title={`🌍 Số lượng đơn hàng`}
                completedTasks={2}
                navigate={`/plans/${id}/orders`}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <ActivityCard
                title="⚠️ Vấn đề mới"
                navigate={`/plans/${id}/problems`}
                completedTasks={
                  problemsData?.data?.filter((x) => x.status === "Pending")
                    .length || 0
                }
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <ActivityCard
                loading={farmersLoading}
                title="👨‍🌾 Số nông dân"
                completedTasks={farmers_info?.length || 0}
                navigate={`/plans/${id}/farmers`}
              />
            </Col>
          </Row>

          <Row gutter={[16, 16]} justify="center" style={{ marginTop: "20px" }}>
            <Col xs={24} md={12}>
              <MaterialDashboard />
            </Col>
            <Col xs={24} md={12}>
              <ProblemsDashBoard data={problemsData?.data || []} />
            </Col>
          </Row>
        </DropDownSection>
        <Divider />

        <DropDownSection title="Công việc">
          <Row gutter={[16, 16]} justify="center" style={{ marginTop: "10px" }}>
            <Col xs={24} md={12} lg={12} xl={12}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                  <Badge.Ribbon
                    color="red"
                    text={`${caring_task_dashboard?.pending_quantity || 0}`}
                  >
                    <ActivityCard
                      icon={<BranchesOutlined style={{ color: "#52c41a" }} />}
                      completedTasks={
                        caring_task_dashboard?.complete_quantity || 0
                      }
                      title="Chăm sóc"
                      loading={isTaskDashboardLoading}
                      totalActivity={
                        caring_task_dashboard?.cancel_quantity +
                          caring_task_dashboard?.complete_quantity +
                          caring_task_dashboard?.incomplete_quantity +
                          caring_task_dashboard?.ongoing_quantity +
                          caring_task_dashboard?.pending_quantity || 0
                      }
                      lastActivityDate={
                        "Lần cuối: " +
                        new Date(
                          caring_task_dashboard?.last_create_date
                        ).toLocaleDateString()
                      }
                      navigate={`/plans/${id}/caring-tasks`}
                    />
                  </Badge.Ribbon>
                </Col>

                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                  <ActivityCard
                    icon={<AuditOutlined style={{ color: "#fa8c16" }} />}
                    completedTasks={12}
                    title="Kiểm định"
                    totalActivity={13}
                    lastActivityDate={"Lần cuối: 13/12/2025"}
                    navigate={`/plans/${id}/inspecting-tasks`}
                  />
                </Col>

                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                  <Badge.Ribbon
                    color="red"
                    text={`${havesting_task_dashboard?.pending_quantity || 0}`}
                  >
                    <ActivityCard
                      icon={<GiftOutlined style={{ color: "#52c41a" }} />}
                      completedTasks={
                        havesting_task_dashboard?.complete_quantity || 0
                      }
                      loading={isTaskDashboardLoading}
                      title="Thu hoạch"
                      totalActivity={
                        havesting_task_dashboard?.cancel_quantity +
                          havesting_task_dashboard?.complete_quantity +
                          havesting_task_dashboard?.incomplete_quantity +
                          havesting_task_dashboard?.ongoing_quantity +
                          havesting_task_dashboard?.pending_quantity || 0
                      }
                      lastActivityDate={
                        "Lần cuối: " +
                        new Date(
                          havesting_task_dashboard?.last_create_date
                        ).toLocaleDateString()
                      }
                      navigate={`/plans/${id}/harvesting-tasks`}
                    />
                  </Badge.Ribbon>
                </Col>

                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                  <Badge.Ribbon
                    color="red"
                    text={`${packaging_task_dashboard?.pending_quantity || 0}`}
                    children={
                      <ActivityCard
                        icon={<AuditOutlined style={{ color: "#fa8c16" }} />}
                        completedTasks={
                          packaging_task_dashboard?.complete_quantity || 0
                        }
                        loading={isTaskDashboardLoading}
                        totalActivity={
                          packaging_task_dashboard?.cancel_quantity +
                            packaging_task_dashboard?.complete_quantity +
                            packaging_task_dashboard?.incomplete_quantity +
                            packaging_task_dashboard?.ongoing_quantity +
                            packaging_task_dashboard?.pending_quantity || 0
                        }
                        title="Đóng gói"
                        lastActivityDate={
                          "Lần cuối: " +
                          new Date(
                            packaging_task_dashboard?.last_create_date
                          ).toLocaleDateString()
                        }
                        navigate={`/plans/${id}/packaging-tasks`}
                      />
                    }
                  ></Badge.Ribbon>
                </Col>
              </Row>
            </Col>

            <Col xs={24} md={12} lg={12} xl={12}>
              <CaringTaskDashboard />
            </Col>
          </Row>
        </DropDownSection>
        <Divider />

        {/* <DropDownSection title="Quan sát">
          <Row gutter={[16, 16]} justify={"start"} style={{ marginTop: "10px" }}>

            <Col
              xs={24}
              md={8}
              lg={8}
              xl={8}
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {[
                {
                  channel: "blcapstone/1",
                  id: "air_temperature",
                  title: "Nhiệt độ °C",
                  icon: <SunOutlined />,
                },
                {
                  channel: "blcapstone/1/air_humidity",
                  id: "air_humidity",
                  title: "Độ ẩm không khí %",
                  icon: <CloudOutlined />,
                },
                {
                  channel: "blcapstone/1/land_humidity",
                  id: "land_humidity",
                  title: "Độ ẩm đất %",
                  icon: <BulbOutlined />,
                },
              ].map((item) => (
                <RealTimeContentCard
                  key={item.id}
                  channel_name={item.channel}
                  component_id={item.id}
                  title={item.title}
                  icon={item.icon}
                />
              ))}
            </Col>

            <Col xs={24} md={16} lg={16} xl={16}>
              <Card
                title={
                  <Flex align="center" gap={8}>
                    <DashboardOutlined />
                    Hệ thống cảnh báo
                  </Flex>
                }
                style={{ height: "100%" }}
                extra={<ShowButton hideText size="small" />}
              >
                <Typography.Text type="warning">
                  Chưa có cảnh báo nào
                </Typography.Text>
              </Card>
            </Col>
          </Row>
          <Card
            style={{ marginTop: "10px" }}
            title="Biểu đồ nhiệt ẩm của khu đất"
          >
            <div>
              <div id="chart">
                <ReactApexChart
                  options={state5.options as ApexOptions}
                  series={state5.series}
                  type="line"
                  height={350}
                />
              </div>
              <div id="html-dist"></div>
            </div>
          </Card>
        </DropDownSection> */}
      </div>
      <StatusModal
        visible={completedModal}
        id={Number(id)}
        onClose={() => setCompletedModal(false)}
        status={valueModal}
      />
      {children}
    </div>
  );
};

export interface IDashbobardTask {
  ongoing_quantity: number;
  complete_quantity: number;
  pending_quantity: number;
  incomplete_quantity: number;
  cancel_quantity: number;
  last_create_date: Date;
}
