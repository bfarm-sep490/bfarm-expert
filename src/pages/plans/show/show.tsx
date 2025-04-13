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
  Table,
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
import { DateField, ShowButton, TextField } from "@refinedev/antd";
import { HttpError, useList, useOne } from "@refinedev/core";
import { useNavigate, useParams } from "react-router";
import React, { PropsWithChildren } from "react";
// import ReactApexChart from "react-apexcharts"; // Removed as it is unused
import { ApexOptions } from "apexcharts";

import { filter, set } from "lodash";
import { IProblem } from "@/interfaces";
import { StatusTag } from "@/components/caring-task/status-tag";
import { DropDownSection } from "@/components/section/drop-down-section";
import { ActivityCard } from "@/components/card/card-activity";
import { MaterialDashboard } from "@/components/plan/detail/dashboard-fertilizer-pesticide-item";
import { ProblemsDashBoard } from "@/components/plan/detail/dashboard-problems";
import { CaringTaskDashboard } from "@/components/plan/detail/dashboard-caring-tasks";
import { ScheduleComponent } from "@/components/plan/detail/scheduler";
import { StatusModal } from "@/components/plan/detail/completd-modal";
import { ChosenFarmerDashBoard } from "@/components/plan/detail/dashboard-farmers";
import HarvestingProductDashBoard from "@/components/plan/detail/dashboard-harvest-product";
import PackagingProductDashBoard from "@/components/plan/detail/dashboard-packaging-products";
import { OrdersListTabel } from "@/components/plan/detail/orders-list-table";

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
    refetch: generalRefetch,
    isFetching: generalFetching,
  } = useOne<IGeneralPlan, HttpError>({
    resource: "plans",
    id: `${id}/general`,
  });
  const {
    data: problemsData,
    isLoading: problemsLoading,
    isFetching: problemFetching,
    refetch: problemRefetch,
  } = useOne<IProblem[]>({
    resource: "plans",
    id: `${id}/problems`,
  });

  const {
    data: taskDashBoardData,
    isLoading: isTaskDashboardLoading,
    error: taskDashBoardError,
    refetch: taskDashBoardRefetch,
    isFetching: taskDashBoardFetching,
  } = useOne<any, HttpError>({
    resource: "plans",
    id: `${id}/tasks/count`,
  });
  const {
    data: inspectingTaskData,
    isLoading: inspectingTaskLoading,
    error: inspectingTaskError,
    refetch: inspectingTaskRefetch,
    isFetching: inspectingTaskFetching,
  } = useList<any, HttpError>({
    resource: "inspecting-forms",
    filters: [
      {
        field: "plan_id",
        operator: "eq",
        value: id,
      },
    ],
  });
  const {
    data: chosenfarmerData,
    isLoading: chosenFarmerLoading,
    isFetching: chosenFarmerFetching,
    refetch: chosenFarmerRefetch,
  } = useList({
    resource: `plans/${id}/farmers`,
  });
  const {
    data: caringData,
    isLoading: caringLoading,
    refetch: caringRefetch,
    isFetching: caringFetching,
  } = useList({
    resource: "caring-tasks",
    filters: [
      { field: "plan_id", operator: "eq", value: id },
      {
        field: "status",
        operator: "eq",
        value: ["Ongoing", "Pending", "Cancel", "Incomplete", "Complete"],
      },
    ],
  });
  const {
    data: harvestData,
    isLoading: harvestLoading,
    refetch: harvestingRefetch,
    isFetching: harvestingFetching,
  } = useList({
    resource: "harvesting-tasks",
    filters: [
      { field: "plan_id", operator: "eq", value: id },
      {
        field: "status",
        operator: "eq",
        value: ["Ongoing", "Pending", "Cancel", "Incomplete", "Complete"],
      },
    ],
  });
  const {
    data: packingData,
    isLoading: packingLoading,
    refetch: packagingRefetch,
    isFetching: packagingFetching,
  } = useList({
    resource: "packaging-tasks",
    filters: [
      { field: "plan_id", operator: "eq", value: id },
      {
        field: "status",
        operator: "eq",
        value: ["Ongoing", "Pending", "Cancel", "Incomplete", "Complete"],
      },
    ],
  });
  const inspecting_task_dashboard = inspectingTaskData?.data as any[];
  const caring_task_dashboard = taskDashBoardData?.data?.caring_tasks;
  const havesting_task_dashboard = taskDashBoardData?.data?.harvesting_tasks;
  const packaging_task_dashboard = taskDashBoardData?.data?.packaging_tasks;
  const general_info = generalData?.data;

  const navigate = useNavigate();
  const {
    data: packagingProductsData,
    isLoading: packagingProductsLoading,
    isFetching: packagingProductFetching,
    refetch: packagingProductRefetch,
  } = useList<any, HttpError>({
    resource: `packaging-products`,
    filters: [
      {
        field: "plan_id",
        operator: "eq",
        value: id,
      },
    ],
  });
  const {
    data: packagingTypesData,
    isLoading: packagingTypesLoading,

    isFetching: packagingTypeFetching,
    refetch: packagingTypeRefetch,
  } = useList<any, HttpError>({
    resource: `packaging-types`,
  });
  const {
    data: harvestingProductsData,
    isLoading: harvestingProductsLoading,
    isFetching: harvestingProductFetching,
    refetch: harvestingProductRefetch,
  } = useList<any, HttpError>({
    resource: `harvesting-product`,
    filters: [
      {
        field: "plan_id",
        operator: "eq",
        value: id,
      },
    ],
  });
  const harvesting_products = harvestingProductsData?.data as any[];
  const {
    data: orderData,
    isLoading: orderLoading,
    refetch: orderRetch,
    isFetching: orderFetching,
  } = useList<any, HttpError>({
    resource: `orders`,
    filters: [
      {
        field: "plan_id",
        operator: "eq",
        value: id,
      },
    ],
  });
  const orders = orderData?.data as any[];
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
                  <Button
                    color="danger"
                    variant="solid"
                    onClick={() => {
                      setValueModal("Cancel");
                      setCompletedModal(true);
                    }}
                    icon={<CloseCircleOutlined />}
                  >
                    Xóa kế hoạch
                  </Button>
                  <Button
                    color="primary"
                    variant="solid"
                    onClick={() => {
                      setValueModal("Pending");
                      setCompletedModal(true);
                    }}
                    icon={<EditOutlined />}
                  >
                    Xác nhận
                  </Button>
                </Space>
              )}
              {general_info?.status === "Ongoing" && (
                <Space>
                  <Button
                    color="primary"
                    variant="solid"
                    onClick={() => {
                      setValueModal("Complete");
                      setCompletedModal(true);
                    }}
                    icon={<CheckCircleOutlined />}
                  >
                    Kết thúc
                  </Button>
                </Space>
              )}
            </Flex>
          </Col>
        </Row>
        <Divider />
        <Flex gap={10} vertical={!breakpoint.sm ? true : false}>
          <Card
            title={
              <Flex
                vertical={false}
                gap={10}
                justify="space-between"
                align="center"
              >
                <Typography.Title level={5}> Thông tin chung</Typography.Title>
                <StatusTag status={general_info?.status || "Default"} />
              </Flex>
            }
            loading={generalLoading}
            style={{ width: !breakpoint.sm ? "100%" : "50%" }}
          >
            <Flex gap={breakpoint.md ? 30 : 16}>
              <Flex vertical={true} gap={10} style={{ flex: 1 }}>
                <Typography.Title level={4} style={{ textAlign: "center" }}>
                  🌱 {general_info?.plan_name || "Chưa xác định"}
                </Typography.Title>
                <Image
                  style={{ borderRadius: 10, border: "1px solid #ddd" }}
                  width={300}
                  height={300}
                  src={general_info?.plant_information?.plant_image}
                />
                <Flex
                  gap={breakpoint.sm || breakpoint.md ? 48 : 10}
                  vertical={
                    !breakpoint.sm || !breakpoint?.md || !breakpoint?.lg
                      ? true
                      : false
                  }
                >
                  <Flex vertical={true} gap={5}>
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
                  </Flex>
                  <Flex vertical={true} gap={10}>
                    <Space align="start" style={{ marginTop: 12 }}>
                      <GroupOutlined style={{ fontSize: 16 }} />
                      <Typography.Text strong>Chuyên gia:</Typography.Text>
                      <Typography.Text>
                        {general_info?.expert_information.expert_name}
                      </Typography.Text>
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
                    <Space align="start" style={{ marginTop: 12 }}>
                      <GroupOutlined style={{ fontSize: 16 }} />
                      <Typography.Text strong>
                        Sản lượng dự kiến:
                      </Typography.Text>
                      <Typography.Text>
                        {general_info?.estimated_product || "Không có"}{" "}
                        {general_info?.estimated_unit || "Không có"}
                      </Typography.Text>
                    </Space>
                  </Flex>
                </Flex>
                <Flex style={{ width: "100%" }}>
                  <Space align="start" style={{ marginTop: 12 }}>
                    <SnippetsOutlined style={{ fontSize: 16 }} />
                    <Typography.Text strong>Mô tả</Typography.Text>
                    <Typography.Paragraph>
                      {general_info?.description || "Không có mô tả"}
                    </Typography.Paragraph>
                  </Space>
                </Flex>
              </Flex>
            </Flex>
          </Card>
          <Flex
            vertical
            style={{ width: !breakpoint.sm ? "100%" : "50%" }}
            gap={10}
          >
            <Card
              loading={
                generalLoading ||
                generalFetching ||
                packagingProductFetching ||
                packagingTypeFetching ||
                packagingProductsLoading ||
                packagingTypesLoading ||
                orderFetching ||
                orderLoading
              }
            >
              <Flex gap={44} justify="space-between" align="center">
                <Flex
                  style={{
                    height: 180,
                    flexDirection: "column",
                    justifyContent: "space-between",
                    width: "33%",
                  }}
                >
                  <Flex style={{ justifyContent: "center" }} gap={10}>
                    <Typography.Title level={5}>
                      Sản lượng (kg)
                    </Typography.Title>
                  </Flex>
                  <Flex
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <HarvestingProductDashBoard
                      quantity_available_harvesting_products={
                        harvesting_products
                          ?.map((x) => x?.available_harvesting_quantity)
                          ?.reduce((acc, curr) => acc + curr, 0) || 0
                      }
                      total_harvesting_products={
                        general_info?.estimated_product || 0
                      }
                    />
                  </Flex>
                </Flex>
                <Flex
                  style={{
                    height: 180,
                    flexDirection: "column",
                    justifyContent: "space-between",
                    width: "33%",
                  }}
                >
                  <Flex style={{ justifyContent: "center" }} gap={10}>
                    <Typography.Title level={5}>Thành phẩm</Typography.Title>
                  </Flex>
                  <Flex
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <PackagingProductDashBoard
                      packaging_products={packagingProductsData?.data || []}
                      orders={orderData?.data || []}
                      packaging_types={packagingTypesData?.data || []}
                    />
                  </Flex>
                </Flex>
              </Flex>
            </Card>
            <ChosenFarmerDashBoard
              status={general_info?.status}
              style={{ width: "100%" }}
              chosenFarmer={(chosenfarmerData?.data as []) ?? []}
              caring_task={(caringData?.data as []) ?? []}
              harvesting_task={(harvestData?.data as []) ?? []}
              packaging_task={(packingData?.data as []) ?? []}
              loading={
                chosenFarmerLoading ||
                caringLoading ||
                harvestLoading ||
                packingLoading ||
                caringFetching ||
                harvestingFetching ||
                packagingFetching
              }
              refetch={chosenFarmerRefetch}
            />
          </Flex>
        </Flex>
        <OrdersListTabel orders={orders} orderLoading={orderLoading} />
        <Divider />
        <DropDownSection title="Công việc">
          <Flex gap={10} vertical={true}>
            <Flex gap={10} vertical={!breakpoint.sm ? true : false}>
              <ProblemsDashBoard
                style={{ width: breakpoint?.sm ? "50%" : "100%" }}
                loading={problemsLoading || problemFetching}
                refetch={problemRefetch}
                data={problemsData?.data || []}
              />

              <Flex
                style={{ width: breakpoint?.sm ? "50%" : "100%" }}
                gap={10}
                vertical={true}
              >
                <Flex
                  style={{ width: "100%" }}
                  gap={10}
                  vertical={!breakpoint.sm ? true : false}
                >
                  <ActivityCard
                    style={{ width: "100%" }}
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
                  />

                  <ActivityCard
                    style={{ width: "100%" }}
                    loading={inspectingTaskLoading}
                    icon={<AuditOutlined style={{ color: "#fa8c16" }} />}
                    completedTasks={
                      inspecting_task_dashboard?.filter(
                        (x) => x.status === "Complete"
                      )?.length || 0
                    }
                    title="Kiểm định"
                    totalActivity={inspecting_task_dashboard?.length || 0}
                    lastActivityDate={"Lần cuối: 13/12/2025"}
                  />
                </Flex>
                <Flex
                  style={{ width: "100%" }}
                  gap={10}
                  vertical={!breakpoint.sm ? true : false}
                >
                  <ActivityCard
                    style={{ width: "100%" }}
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
                  />

                  <ActivityCard
                    style={{ width: "100%" }}
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
                  />
                </Flex>
              </Flex>
            </Flex>

            <ScheduleComponent status={general_info?.status} />
          </Flex>
        </DropDownSection>
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
        refetch={() => {
          generalRefetch();
          taskDashBoardRefetch();
          inspectingTaskRefetch();
          caringRefetch();
          harvestingRefetch();
          packagingRefetch();
          chosenFarmerRefetch();
          orderRetch();
          packagingProductRefetch();
          packagingTypeRefetch();
          harvestingProductRefetch();
          problemRefetch();
        }}
      />
      {children}{" "}
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
