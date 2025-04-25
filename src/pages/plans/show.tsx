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
  theme,
  Anchor,
} from "antd";
import {
  EnvironmentOutlined,
  UserOutlined,
  CalendarOutlined,
  BranchesOutlined,
  AuditOutlined,
  GiftOutlined,
  ArrowLeftOutlined,
  GoldOutlined,
  GroupOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  EditOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
import { DateField } from "@refinedev/antd";
import { HttpError, useList, useOne } from "@refinedev/core";
import { useNavigate, useParams } from "react-router";
import React, { PropsWithChildren } from "react";
// import ReactApexChart from "react-apexcharts"; // Removed as it is unused

import { IPlan, IProblem } from "@/interfaces";
import { StatusTag } from "@/components/caring-task/status-tag";
import { DropDownSection } from "@/components/section/drop-down-section";
import { ActivityCard } from "@/components/card/card-activity";
import { ProblemsDashBoard } from "@/components/plan/detail/dashboard-problems";
import { ScheduleComponent } from "@/components/plan/detail/scheduler";
import { StatusModal } from "@/components/plan/detail/completd-modal";
import { ChosenFarmerDashBoard } from "@/components/plan/detail/dashboard-farmers";
import HarvestingProductDashBoard from "@/components/plan/detail/dashboard-harvest-product";
import PackagingProductDashBoard from "@/components/plan/detail/dashboard-packaging-products";
import { OrdersListTable } from "@/components/plan/detail/orders-list-table";
import { QRCodeModal } from "@/components/plan/qrcode-modal";

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
  const { token } = theme.useToken();
  const [qrCodeModal, setQRCodeModal] = React.useState(false);
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
        value: ["Draft", "Ongoing", "Pending", "Cancel", "Incomplete", "Complete"],
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
        value: ["Draft", "Ongoing", "Pending", "Cancel", "Incomplete", "Complete"],
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
        value: ["Draft", "Ongoing", "Pending", "Cancel", "Incomplete", "Complete"],
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
  const {
    data: planData,
    isLoading: planLoading,
    isFetching: planFetching,
    refetch: planRefetch,
  } = useOne<IPlan, HttpError>({
    resource: `plans`,
    id: `${id}`,
  });
  const orders = orderData?.data as any[];
  const breakpoint = Grid.useBreakpoint();
  return (
    <div style={{ padding: "24px" }}>
      <Button
        type="text"
        style={{
          width: "40px",
          height: "40px",
          marginBottom: "16px",
          borderRadius: token.borderRadius,
          backgroundColor: token.colorBgContainer,
          boxShadow: token.boxShadowSecondary,
        }}
        onClick={() => navigate(`/plans`)}
      >
        <ArrowLeftOutlined style={{ fontSize: "20px" }} />
      </Button>

      <Anchor
        direction="horizontal"
        offsetTop={67}
        targetOffset={120}
        style={{
          marginBottom: "24px",
          backgroundColor: token.colorBgContainer,
          padding: "12px 16px",
          borderRadius: token.borderRadius,
        }}
        items={[
          {
            key: "overview",
            href: "#overview",
            title: "Tổng quan",
          },
          {
            key: "dashboard",
            href: "#dashboard",
            title: "Bảng điều khiển",
          },
          {
            key: "tasks",
            href: "#tasks",
            title: "Công việc",
          },
          {
            key: "orders",
            href: "#orders",
            title: "Đơn hàng",
          },
        ]}
      />

      <div>
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} md={12} lg={12} xl={12}>
            <Typography.Title level={3} style={{ margin: 0 }}>
              📋 Thông tin kế hoạch
            </Typography.Title>
          </Col>
          <Col xs={24} md={12} lg={12} xl={12}>
            <Flex justify="end" gap={8}>
              {general_info?.status === "Draft" && (
                <Space>
                  <Button
                    danger
                    onClick={() => {
                      setValueModal("Cancel");
                      setCompletedModal(true);
                    }}
                    icon={<CloseCircleOutlined />}
                    style={{
                      borderRadius: token.borderRadius,
                      boxShadow: token.boxShadowSecondary,
                    }}
                  >
                    Xóa kế hoạch
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      setValueModal("Pending");
                      setCompletedModal(true);
                    }}
                    icon={<EditOutlined />}
                    style={{
                      borderRadius: token.borderRadius,
                      boxShadow: token.boxShadowSecondary,
                    }}
                  >
                    Xác nhận
                  </Button>
                </Space>
              )}
              {general_info?.status === "Ongoing" && (
                <Button
                  type="primary"
                  onClick={() => {
                    setValueModal("Complete");
                    setCompletedModal(true);
                  }}
                  icon={<CheckCircleOutlined />}
                  style={{
                    borderRadius: token.borderRadius,
                    boxShadow: token.boxShadowSecondary,
                  }}
                >
                  Kết thúc
                </Button>
              )}
            </Flex>
          </Col>
        </Row>
        <Divider style={{ margin: "16px 0" }} />
        <Flex gap={16} vertical={!breakpoint.sm ? true : false}>
          <Card
            id="overview"
            title={
              <Flex vertical={false} gap={10} justify="space-between" align="center">
                <Typography.Title level={5} style={{ margin: 0 }}>
                  Tổng quan
                </Typography.Title>
                <StatusTag status={general_info?.status || "Default"} />
              </Flex>
            }
            loading={generalLoading}
            style={{
              width: !breakpoint.sm ? "100%" : "50%",
              borderRadius: token.borderRadiusLG,
              boxShadow: token.boxShadow,
            }}
            bodyStyle={{ padding: "24px" }}
          >
            <Flex gap={breakpoint.md ? 30 : 16}>
              <Flex vertical={true} gap={16} style={{ flex: 1 }}>
                <Typography.Title level={4} style={{ textAlign: "center", margin: 0 }}>
                  🌱 {general_info?.plan_name || "Chưa xác định"}
                </Typography.Title>
                <Flex justify="center" align="center">
                  <Image
                    style={{
                      borderRadius: token.borderRadius,
                      border: `1px solid ${token.colorBorder}`,
                      boxShadow: token.boxShadowSecondary,
                    }}
                    width={300}
                    height={300}
                    src={general_info?.plant_information?.plant_image}
                  />
                </Flex>
                <Flex
                  gap={breakpoint.sm || breakpoint.md ? 48 : 16}
                  vertical={!breakpoint.sm || !breakpoint?.md || !breakpoint?.lg ? true : false}
                >
                  <Flex vertical={true} gap={12}>
                    <Space align="start">
                      <EnvironmentOutlined style={{ fontSize: 16, color: token.colorPrimary }} />
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

                    <Space align="start">
                      <UserOutlined style={{ fontSize: 16, color: token.colorPrimary }} />
                      <Typography.Text strong>Cây trồng:</Typography.Text>
                      <Typography.Text>
                        {general_info?.plant_information?.plant_name || "Chưa xác định"}
                      </Typography.Text>
                    </Space>

                    <Space align="start">
                      <GoldOutlined style={{ fontSize: 16, color: token.colorPrimary }} />
                      <Typography.Text strong>Khu đất</Typography.Text>
                      <Typography.Text>
                        <Tag color="blue">
                          {general_info?.yield_information?.yield_name || "Chưa xác định"}
                        </Tag>
                      </Typography.Text>
                    </Space>
                  </Flex>
                  <Flex vertical={true} gap={12}>
                    <Space align="start">
                      <GroupOutlined style={{ fontSize: 16, color: token.colorPrimary }} />
                      <Typography.Text strong>Chuyên gia:</Typography.Text>
                      <Typography.Text>
                        {general_info?.expert_information.expert_name}
                      </Typography.Text>
                    </Space>
                    <Space align="start">
                      <CalendarOutlined style={{ fontSize: 16, color: token.colorPrimary }} />
                      <Typography.Text strong>Ngày tạo:</Typography.Text>
                      <Typography.Text type="secondary">
                        {general_info?.created_at ? (
                          <DateField value={general_info?.created_at} format="hh:mm DD/MM/YYYY" />
                        ) : (
                          <Typography.Text type="danger">Chưa xác định</Typography.Text>
                        )}
                      </Typography.Text>
                    </Space>
                    <Space align="start">
                      <GroupOutlined style={{ fontSize: 16, color: token.colorPrimary }} />
                      <Typography.Text strong>Sản lượng dự kiến:</Typography.Text>
                      <Typography.Text>
                        {general_info?.estimated_product || "Không có"}{" "}
                        {general_info?.estimated_unit || "Không có"}
                      </Typography.Text>
                    </Space>
                  </Flex>
                </Flex>
                <Flex style={{ width: "100%" }}>
                  <Space align="start">
                    <SnippetsOutlined style={{ fontSize: 16, color: token.colorPrimary }} />
                    <Typography.Text strong>Mô tả</Typography.Text>
                    <Typography.Paragraph style={{ margin: 0 }}>
                      {general_info?.description || "Không có mô tả"}
                    </Typography.Paragraph>
                  </Space>
                </Flex>
              </Flex>
            </Flex>
          </Card>
          <Flex vertical style={{ width: !breakpoint.sm ? "100%" : "50%" }} gap={16}>
            <Card
              id="dashboard"
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
              style={{
                borderRadius: token.borderRadiusLG,
                boxShadow: token.boxShadow,
              }}
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
                    <Typography.Title level={5} style={{ margin: 0 }}>
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
                      total_harvesting_products={general_info?.estimated_product || 0}
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
                    <Typography.Title level={5} style={{ margin: 0 }}>
                      Thành phẩm
                    </Typography.Title>
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
              style={{
                width: "100%",
                borderRadius: token.borderRadiusLG,
                boxShadow: token.boxShadow,
              }}
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
        <div id="orders">
          <OrdersListTable orders={orders} orderLoading={orderLoading} />
        </div>
        <Divider style={{ margin: "24px 0" }} />
        <div id="tasks">
          <DropDownSection title="Công việc">
            <Flex gap={16} vertical={true}>
              <Flex gap={16} vertical={!breakpoint.sm ? true : false}>
                <ProblemsDashBoard
                  style={{
                    width: breakpoint?.sm ? "50%" : "100%",
                    borderRadius: token.borderRadiusLG,
                    boxShadow: token.boxShadow,
                  }}
                  loading={problemsLoading || problemFetching}
                  refetch={problemRefetch}
                  data={problemsData?.data || []}
                />

                <Flex style={{ width: breakpoint?.sm ? "50%" : "100%" }} gap={16} vertical={true}>
                  <Flex style={{ width: "100%" }} gap={16} vertical={!breakpoint.sm ? true : false}>
                    <ActivityCard
                      style={{
                        width: "100%",
                        borderRadius: token.borderRadiusLG,
                        boxShadow: token.boxShadow,
                      }}
                      icon={<BranchesOutlined style={{ color: token.colorSuccess }} />}
                      completedTasks={caring_task_dashboard?.complete_quantity || 0}
                      title="Chăm sóc"
                      loading={isTaskDashboardLoading}
                      totalActivity={caringData?.data?.length}
                      lastActivityDate={
                        "Lần cuối: " +
                        new Date(caring_task_dashboard?.last_create_date).toLocaleDateString()
                      }
                    />

                    <ActivityCard
                      style={{
                        width: "100%",
                        borderRadius: token.borderRadiusLG,
                        boxShadow: token.boxShadow,
                      }}
                      loading={inspectingTaskLoading}
                      icon={<AuditOutlined style={{ color: token.colorWarning }} />}
                      completedTasks={
                        inspecting_task_dashboard?.filter((x) => x.status === "Complete")?.length ||
                        0
                      }
                      title="Kiểm định"
                      totalActivity={inspectingTaskData?.data?.length}
                      lastActivityDate={"Lần cuối: 13/12/2025"}
                    />
                  </Flex>
                  <Flex style={{ width: "100%" }} gap={16} vertical={!breakpoint.sm ? true : false}>
                    <ActivityCard
                      style={{
                        width: "100%",
                        borderRadius: token.borderRadiusLG,
                        boxShadow: token.boxShadow,
                      }}
                      icon={<GiftOutlined style={{ color: token.colorSuccess }} />}
                      completedTasks={havesting_task_dashboard?.complete_quantity || 0}
                      loading={isTaskDashboardLoading}
                      title="Thu hoạch"
                      totalActivity={harvestData?.data?.length}
                      lastActivityDate={"Lần cuối: " + new Date().toLocaleDateString()}
                    />

                    <ActivityCard
                      style={{
                        width: "100%",
                        borderRadius: token.borderRadiusLG,
                        boxShadow: token.boxShadow,
                      }}
                      icon={<AuditOutlined style={{ color: token.colorWarning }} />}
                      completedTasks={packaging_task_dashboard?.complete_quantity || 0}
                      loading={isTaskDashboardLoading}
                      totalActivity={packingData?.data?.length}
                      title="Đóng gói"
                      lastActivityDate={
                        "Lần cuối: " +
                        new Date(packaging_task_dashboard?.last_create_date).toLocaleDateString()
                      }
                    />
                  </Flex>
                </Flex>
              </Flex>

              <ScheduleComponent status={general_info?.status} />
            </Flex>
          </DropDownSection>
        </div>
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
      {children}
    </div>
  );
};
