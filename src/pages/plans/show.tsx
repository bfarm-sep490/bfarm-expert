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
  Spin,
  Alert,
} from "antd";
import {
  EnvironmentOutlined,
  UserOutlined,
  CalendarOutlined,
  BranchesOutlined,
  AuditOutlined,
  GiftOutlined,
  GoldOutlined,
  GroupOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  EditOutlined,
  DashboardOutlined,
  BarChartOutlined,
  ShoppingOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import { DateField, Show } from "@refinedev/antd";
import { HttpError, useList, useOne, useGo } from "@refinedev/core";
import { useParams } from "react-router";
import React, { PropsWithChildren } from "react";

import { IOrder, IPlan, IProblem } from "@/interfaces";
import { StatusTag } from "@/components/caring-task/status-tag";
import { ProblemsDashBoard } from "@/components/plan/detail/dashboard-problems";
import { ScheduleComponent } from "@/components/plan/detail/scheduler";
import { StatusModal } from "@/components/plan/detail/completd-modal";
import { ChosenFarmerDashBoard } from "@/components/plan/detail/dashboard-farmers";
import HarvestingProductDashBoard from "@/components/plan/detail/dashboard-harvest-product";
import PackagingProductDashBoard from "@/components/plan/detail/dashboard-packaging-products";
import { OrdersListTable } from "@/components/plan/detail/orders-list-table";

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
  const go = useGo();
  const { id } = useParams();
  const [completedModal, setCompletedModal] = React.useState(false);
  const [valueModal, setValueModal] = React.useState("");
  const tasksRef = React.useRef<HTMLDivElement>(null);
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
  } = useList<IOrder, HttpError>({
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

  const handleScrollToTasks = () => {
    tasksRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Show title="Chi tiết kế hoạch" canEdit={false} breadcrumb={false}>
      <Anchor
        direction="horizontal"
        offsetTop={67}
        targetOffset={120}
        style={{
          marginBottom: "24px",
          backgroundColor: token.colorBgContainer,
          padding: "12px 0",
          borderRadius: token.borderRadius,
        }}
        items={[
          {
            key: "overview",
            href: "#overview",
            title: (
              <Space>
                <DashboardOutlined />
                <span>Tổng quan</span>
              </Space>
            ),
          },
          {
            key: "dashboard",
            href: "#dashboard",
            title: (
              <Space>
                <BarChartOutlined />
                <span>Bảng điều khiển</span>
              </Space>
            ),
          },
          {
            key: "orders",
            href: "#orders",
            title: (
              <Space>
                <ShoppingOutlined />
                <span>Đơn hàng & Vấn đề</span>
              </Space>
            ),
          },
          {
            key: "tasks",
            href: "#tasks",
            title: (
              <Space>
                <CalendarOutlined />
                <span>Công việc</span>
              </Space>
            ),
          },
        ]}
      />
      {general_info?.status === "Draft" && (
        <Alert
          message={
            <Flex justify="space-between" align="center">
              <Space>
                <UserOutlined />
                <span>
                  {chosenfarmerData?.data?.length === 0
                    ? "Vui lòng thêm nông dân vào kế hoạch trước khi xác nhận"
                    : "Hãy chắc chắn đã thêm đủ nông dân vào kế hoạch trước khi xác nhận"}
                </span>
              </Space>
              {chosenfarmerData?.data?.length === 0 && (
                <Button type="link" icon={<ArrowDownOutlined />} onClick={handleScrollToTasks}>
                  Đi đến phần công việc
                </Button>
              )}
            </Flex>
          }
          type="warning"
          showIcon
          style={{
            marginBottom: 24,
            borderRadius: token.borderRadius,
          }}
        />
      )}

      <div>
        <Row gutter={[16, 16]} justify="space-between" align="middle">
          <Col>
            <Typography.Title level={3} style={{ margin: 0 }}>
              📋 {general_info?.plan_name || "Thông tin kế hoạch"}
            </Typography.Title>
          </Col>
          <Col>
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
                  }}
                >
                  Kết thúc
                </Button>
              )}
            </Flex>
          </Col>
        </Row>

        <Divider style={{ margin: "16px 0" }} />

        <Spin spinning={generalLoading || generalFetching}>
          <Flex gap={16} vertical={!breakpoint.sm}>
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
              style={{
                width: !breakpoint.sm ? "100%" : "50%",
                borderRadius: token.borderRadiusLG,
              }}
            >
              <Flex gap={24} vertical>
                <Flex
                  gap={24}
                  align="center"
                  vertical={!breakpoint.sm}
                  style={{
                    width: "100%",
                    textAlign: !breakpoint.sm ? "center" : "left",
                  }}
                >
                  <Image
                    style={{
                      borderRadius: token.borderRadius,
                      border: `1px solid ${token.colorBorder}`,
                      objectFit: "cover",
                      minWidth: !breakpoint.sm ? "100%" : "120px",
                      maxWidth: !breakpoint.sm ? "100%" : "120px",
                      height: !breakpoint.sm ? "auto" : "120px",
                      aspectRatio: "1/1",
                    }}
                    src={general_info?.plant_information?.plant_image}
                  />
                  <Flex vertical gap={8} style={{ width: "100%" }}>
                    <Typography.Title level={4} style={{ margin: 0 }}>
                      🌱 {general_info?.plan_name || "Chưa xác định"}
                    </Typography.Title>
                    <Typography.Text type="secondary">
                      {general_info?.description || "Không có mô tả"}
                    </Typography.Text>
                  </Flex>
                </Flex>

                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <Card
                      size="small"
                      style={{
                        background: token.colorBgContainer,
                        border: `1px solid ${token.colorBorder}`,
                      }}
                    >
                      <Flex gap={8} vertical>
                        <Typography.Text strong>
                          <UserOutlined style={{ marginRight: 8, color: token.colorPrimary }} />
                          Cây trồng
                        </Typography.Text>
                        <Typography.Text>
                          {general_info?.plant_information?.plant_name || "Chưa xác định"}
                        </Typography.Text>
                      </Flex>
                    </Card>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Card
                      size="small"
                      style={{
                        background: token.colorBgContainer,
                        border: `1px solid ${token.colorBorder}`,
                      }}
                    >
                      <Flex gap={8} vertical>
                        <Typography.Text strong>
                          <GoldOutlined style={{ marginRight: 8, color: token.colorPrimary }} />
                          Khu đất
                        </Typography.Text>
                        <Typography.Text>
                          <Tag color="blue">
                            {general_info?.yield_information?.yield_name || "Chưa xác định"}
                          </Tag>
                        </Typography.Text>
                      </Flex>
                    </Card>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Card
                      size="small"
                      style={{
                        background: token.colorBgContainer,
                        border: `1px solid ${token.colorBorder}`,
                      }}
                    >
                      <Flex gap={8} vertical>
                        <Typography.Text strong>
                          <EnvironmentOutlined
                            style={{ marginRight: 8, color: token.colorPrimary }}
                          />
                          Thời gian thực hiện
                        </Typography.Text>
                        <Typography.Text>
                          {general_info?.start_date ? (
                            <DateField value={general_info?.start_date} />
                          ) : (
                            "Chưa xác định"
                          )}{" "}
                          -{" "}
                          {general_info?.end_date ? (
                            <DateField value={general_info?.end_date} />
                          ) : (
                            "Chưa xác định"
                          )}
                        </Typography.Text>
                      </Flex>
                    </Card>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Card
                      size="small"
                      style={{
                        background: token.colorBgContainer,
                        border: `1px solid ${token.colorBorder}`,
                      }}
                    >
                      <Flex gap={8} vertical>
                        <Typography.Text strong>
                          <CalendarOutlined style={{ marginRight: 8, color: token.colorPrimary }} />
                          Ngày tạo
                        </Typography.Text>
                        <Typography.Text>
                          {general_info?.created_at ? (
                            <DateField value={general_info?.created_at} format="DD/MM/YYYY HH:mm" />
                          ) : (
                            "Chưa xác định"
                          )}
                        </Typography.Text>
                      </Flex>
                    </Card>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Card
                      size="small"
                      style={{
                        background: token.colorBgContainer,
                        border: `1px solid ${token.colorBorder}`,
                      }}
                    >
                      <Flex gap={8} vertical>
                        <Typography.Text strong>
                          <GiftOutlined style={{ marginRight: 8, color: token.colorPrimary }} />
                          Sản lượng dự kiến
                        </Typography.Text>
                        <Typography.Text>
                          {general_info?.estimated_product || "0"}{" "}
                          {general_info?.estimated_unit || "kg"}
                        </Typography.Text>
                      </Flex>
                    </Card>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Card
                      size="small"
                      style={{
                        background: token.colorBgContainer,
                        border: `1px solid ${token.colorBorder}`,
                      }}
                    >
                      <Flex gap={8} vertical>
                        <Typography.Text strong>
                          <GroupOutlined style={{ marginRight: 8, color: token.colorPrimary }} />
                          Chuyên gia phụ trách
                        </Typography.Text>
                        <Typography.Text>
                          {general_info?.expert_information?.expert_name || "Chưa xác định"}
                        </Typography.Text>
                      </Flex>
                    </Card>
                  </Col>
                </Row>
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

              <Row gutter={[16, 16]} style={{ height: !breakpoint.sm ? "auto" : "120px" }}>
                <Col xs={24} sm={12}>
                  <Card
                    size="small"
                    style={{
                      borderRadius: token.borderRadiusLG,
                      height: !breakpoint.sm ? "auto" : "100%",
                    }}
                    bodyStyle={{ height: !breakpoint.sm ? "auto" : "100%", padding: "12px" }}
                  >
                    <Flex
                      vertical
                      justify="space-between"
                      style={{ height: !breakpoint.sm ? "auto" : "100%" }}
                    >
                      <Flex justify="space-between" align="center">
                        <Typography.Text strong>
                          <BranchesOutlined style={{ marginRight: 8, color: token.colorSuccess }} />
                          Chăm sóc
                        </Typography.Text>
                      </Flex>
                      <Flex
                        vertical
                        align="center"
                        justify="center"
                        style={{ flex: 1, margin: !breakpoint.sm ? "8px 0" : 0 }}
                      >
                        <Typography.Title level={2} style={{ margin: 0 }}>
                          {caring_task_dashboard?.complete_quantity || 0}/
                          {caringData?.data?.length || 0}
                        </Typography.Title>
                      </Flex>
                      <Typography.Text type="secondary">
                        Lần cuối:{" "}
                        {new Date(caring_task_dashboard?.last_create_date).toLocaleDateString()}
                      </Typography.Text>
                    </Flex>
                  </Card>
                </Col>
                <Col xs={24} sm={12}>
                  <Card
                    size="small"
                    style={{
                      borderRadius: token.borderRadiusLG,

                      height: !breakpoint.sm ? "auto" : "100%",
                    }}
                    bodyStyle={{ height: !breakpoint.sm ? "auto" : "100%", padding: "12px" }}
                  >
                    <Flex
                      vertical
                      justify="space-between"
                      style={{ height: !breakpoint.sm ? "auto" : "100%" }}
                    >
                      <Flex justify="space-between" align="center">
                        <Typography.Text strong>
                          <AuditOutlined style={{ marginRight: 8, color: token.colorWarning }} />
                          Kiểm định
                        </Typography.Text>
                      </Flex>
                      <Flex
                        vertical
                        align="center"
                        justify="center"
                        style={{ flex: 1, margin: !breakpoint.sm ? "8px 0" : 0 }}
                      >
                        <Typography.Title level={2} style={{ margin: 0 }}>
                          {inspecting_task_dashboard?.filter((x) => x.status === "Complete")
                            ?.length || 0}
                          /{inspectingTaskData?.data?.length || 0}
                        </Typography.Title>
                      </Flex>
                      <Typography.Text type="secondary">Lần cuối: 13/12/2025</Typography.Text>
                    </Flex>
                  </Card>
                </Col>
                <Col xs={24} sm={12}>
                  <Card
                    size="small"
                    style={{
                      borderRadius: token.borderRadiusLG,

                      height: !breakpoint.sm ? "auto" : "100%",
                    }}
                    bodyStyle={{ height: !breakpoint.sm ? "auto" : "100%", padding: "12px" }}
                  >
                    <Flex
                      vertical
                      justify="space-between"
                      style={{ height: !breakpoint.sm ? "auto" : "100%" }}
                    >
                      <Flex justify="space-between" align="center">
                        <Typography.Text strong>
                          <GiftOutlined style={{ marginRight: 8, color: token.colorSuccess }} />
                          Thu hoạch
                        </Typography.Text>
                      </Flex>
                      <Flex
                        vertical
                        align="center"
                        justify="center"
                        style={{ flex: 1, margin: !breakpoint.sm ? "8px 0" : 0 }}
                      >
                        <Typography.Title level={2} style={{ margin: 0 }}>
                          {havesting_task_dashboard?.complete_quantity || 0}/
                          {harvestData?.data?.length || 0}
                        </Typography.Title>
                      </Flex>
                      <Typography.Text type="secondary">
                        Lần cuối: {new Date().toLocaleDateString()}
                      </Typography.Text>
                    </Flex>
                  </Card>
                </Col>
                <Col xs={24} sm={12}>
                  <Card
                    size="small"
                    style={{
                      borderRadius: token.borderRadiusLG,

                      height: !breakpoint.sm ? "auto" : "100%",
                    }}
                    bodyStyle={{ height: !breakpoint.sm ? "auto" : "100%", padding: "12px" }}
                  >
                    <Flex
                      vertical
                      justify="space-between"
                      style={{ height: !breakpoint.sm ? "auto" : "100%" }}
                    >
                      <Flex justify="space-between" align="center">
                        <Typography.Text strong>
                          <AuditOutlined style={{ marginRight: 8, color: token.colorWarning }} />
                          Đóng gói
                        </Typography.Text>
                      </Flex>
                      <Flex
                        vertical
                        align="center"
                        justify="center"
                        style={{ flex: 1, margin: !breakpoint.sm ? "8px 0" : 0 }}
                      >
                        <Typography.Title level={2} style={{ margin: 0 }}>
                          {packaging_task_dashboard?.complete_quantity || 0}/
                          {packingData?.data?.length || 0}
                        </Typography.Title>
                      </Flex>
                      <Typography.Text type="secondary">
                        Lần cuối:{" "}
                        {new Date(packaging_task_dashboard?.last_create_date).toLocaleDateString()}
                      </Typography.Text>
                    </Flex>
                  </Card>
                </Col>
              </Row>
            </Flex>
          </Flex>
        </Spin>
        <div id="orders">
          <Card
            style={{
              borderRadius: token.borderRadiusLG,
              marginBottom: 24,
              marginTop: 24,
            }}
          >
            <Flex vertical gap={24}>
              <Flex justify="space-between" align="center">
                <Typography.Title level={4} style={{ margin: 0 }}>
                  Đơn hàng & Vấn đề
                </Typography.Title>
                <Space>
                  <Tag color="blue">{orders?.length || 0} đơn hàng</Tag>
                  <Tag color="red">{problemsData?.data?.length || 0} vấn đề</Tag>
                </Space>
              </Flex>

              <Row gutter={[24, 24]} style={{ height: "100%" }}>
                <Col xs={24} lg={12} style={{ height: "100%" }}>
                  <OrdersListTable orders={orders} orderLoading={orderLoading} />
                </Col>
                <Col xs={24} lg={12} style={{ height: "100%" }}>
                  <ProblemsDashBoard
                    loading={problemsLoading || problemFetching}
                    refetch={problemRefetch}
                    data={problemsData?.data || []}
                  />
                </Col>
              </Row>
            </Flex>
          </Card>
        </div>
        <Divider style={{ margin: "24px 0" }} />
        <div id="tasks" ref={tasksRef}>
          <Card
            style={{
              borderRadius: token.borderRadiusLG,

              marginBottom: 24,
            }}
          >
            <Flex vertical gap={24}>
              <Typography.Title level={4} style={{ margin: 0 }}>
                Công việc
              </Typography.Title>

              <ChosenFarmerDashBoard
                status={general_info?.status}
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

              <ScheduleComponent status={general_info?.status} />
            </Flex>
          </Card>
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
    </Show>
  );
};
