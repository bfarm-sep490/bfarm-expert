import { useGetIdentity, useList, useGo } from "@refinedev/core";
import {
  Card,
  Typography,
  Row,
  Col,
  Progress,
  Tag,
  Space,
  Statistic,
  Timeline,
  Image,
  Avatar,
} from "antd";
import React from "react";
import {
  CalendarOutlined,
  FieldTimeOutlined,
  WarningOutlined,
  FileTextOutlined,
  TeamOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { IIdentity } from "../../interfaces";

const { Title, Text } = Typography;

export const DashboardPage: React.FC = () => {
  const { data: user } = useGetIdentity<IIdentity>();

  const { data: plantData, isLoading: plantLoading } = useList({
    resource: "plants",
    pagination: {
      pageSize: 100,
    },
  });

  const { data: planData, isLoading: planLoading } = useList({
    resource: "plans",
    pagination: {
      pageSize: 100,
    },
    filters: [
      {
        field: "expert_id",
        operator: "eq",
        value: user?.id,
      },
    ],
  });

  const { data: problemData, isLoading: problemLoading } = useList({
    resource: "problems",
    filters: [
      {
        field: "status",
        operator: "eq",
        value: "Pending",
      },
    ],
  });

  const isLoading = planLoading || plantLoading || problemLoading;

  // Calculate statistics
  const totalPlans = planData?.data?.length || 0;
  const ongoingPlans =
    planData?.data?.filter((plan: any) => plan?.status === "Ongoing")?.length || 0;
  const pendingPlans =
    planData?.data?.filter((plan: any) => plan?.status === "Pending")?.length || 0;
  const draftPlans = planData?.data?.filter((plan: any) => plan?.status === "Draft")?.length || 0;

  const endingSoonPlans =
    planData?.data?.filter(
      (plan: any) =>
        plan?.expert_id === user?.id &&
        plan?.end_date - Date.now() < 86400000 * 7 &&
        plan?.status === "Ongoing",
    )?.length || 0;

  const pendingProblems =
    problemData?.data?.filter(
      (problem) =>
        planData?.data?.map((plan) => plan?.id)?.some((planId) => problem?.plan_id === planId) &&
        problem?.status === "Pending",
    )?.length || 0;

  const totalEstimatedProducts =
    planData?.data?.reduce((sum: number, plan: any) => sum + (plan?.estimated_product || 0), 0) ||
    0;

  const totalOrders =
    planData?.data?.reduce((sum: number, plan: any) => sum + (plan?.order_ids?.length || 0), 0) ||
    0;

  const cardStyle = {
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    height: "100%",
    transition: "all 0.3s ease",
  };

  const statCards = [
    {
      title: "Tổng số kế hoạch",
      value: totalPlans,
      icon: <FileTextOutlined />,
      color: "#1677ff",
    },
    {
      title: "Kế hoạch đang thực thi",
      value: ongoingPlans,
      icon: <FieldTimeOutlined />,
      color: "#52c41a",
    },
    {
      title: "Vấn đề cần xử lý",
      value: pendingProblems,
      icon: <WarningOutlined />,
      color: "#ff4d4f",
    },
    {
      title: "Tổng sản lượng dự kiến",
      value: totalEstimatedProducts,
      suffix: "kg",
      icon: <DollarOutlined />,
      color: "#faad14",
    },
  ];

  const recentProblems = problemData?.data?.slice(0, 5) || [];

  const go = useGo();

  const handleProblemClick = (problemId: number) => {
    go({
      to: `/problems/${problemId}`,
      type: "push",
    });
  };

  const handleViewAllProblems = () => {
    go({
      to: "/problems",
      type: "push",
    });
  };

  const ongoingPlansList = planData?.data?.filter((plan: any) => plan?.status === "Ongoing") || [];

  const calculateProgress = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = Date.now();
    const total = end - start;
    const elapsed = now - start;
    return Math.min(Math.max(Math.round((elapsed / total) * 100), 0), 100);
  };

  const getPlantInfo = (plantId: number) => {
    return plantData?.data?.find((plant: any) => plant.id === plantId);
  };

  const handlePlanClick = (planId: number) => {
    go({
      to: `/plans/${planId}`,
      type: "push",
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <Title level={2}>Dashboard</Title>

      {/* Overview Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        {statCards.map((card, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card style={cardStyle}>
              <Statistic
                title={card.title}
                value={card.value}
                prefix={card.icon}
                valueStyle={{ color: card.color }}
                suffix={card.suffix}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Main Content */}
      <Row gutter={[16, 16]}>
        {/* Left Column */}
        <Col xs={24} md={16}>
          <Card title="Kế hoạch đang thực thi" style={cardStyle}>
            <Row gutter={[16, 16]}>
              {ongoingPlansList.map((plan: any) => {
                const plantInfo = getPlantInfo(plan.plant_id);
                return (
                  <Col xs={24} sm={12} key={plan.id}>
                    <Card
                      style={{
                        ...cardStyle,
                        borderLeft: "4px solid #52c41a",
                        cursor: "pointer",
                      }}
                      onClick={() => handlePlanClick(plan.id)}
                    >
                      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                        <div>
                          <Space>
                            <Avatar
                              size="large"
                              src={plantInfo?.image_url}
                              style={{ objectFit: "cover" }}
                            />
                            <div>
                              <Text strong style={{ fontSize: "16px" }}>
                                {plan.plan_name}
                              </Text>
                              <br />
                              <Text type="secondary">
                                <FileTextOutlined /> {plan.plant_name}
                              </Text>
                              {plantInfo && (
                                <Text type="secondary" style={{ display: "block" }}>
                                  {plantInfo.type}
                                </Text>
                              )}
                            </div>
                          </Space>
                        </div>

                        <div>
                          <Text type="secondary" style={{ display: "block", marginBottom: 8 }}>
                            {plan.description}
                          </Text>
                          <Space size="middle" wrap>
                            <Text type="secondary">
                              <EnvironmentOutlined /> {plan.yield_name}
                            </Text>
                            <Text type="secondary">
                              <TeamOutlined /> {plan.expert_name}
                            </Text>
                          </Space>
                        </div>

                        <div>
                          <Text strong style={{ display: "block", marginBottom: 8 }}>
                            Tiến độ
                          </Text>
                          <Progress
                            percent={calculateProgress(plan.start_date, plan.end_date)}
                            status="active"
                            format={(percent) => `${percent}%`}
                          />
                          <Space size="middle" wrap style={{ marginTop: 8 }}>
                            <Text type="secondary">
                              <CalendarOutlined /> Bắt đầu: {formatDateTime(plan.start_date)}
                            </Text>
                            <Text type="secondary">
                              <ClockCircleOutlined /> Kết thúc: {formatDateTime(plan.end_date)}
                            </Text>
                          </Space>
                        </div>

                        <div>
                          <Space size="middle" wrap>
                            <Tag color="green" style={{ marginBottom: 4 }}>
                              <DollarOutlined /> Sản lượng: {plan.estimated_product}kg
                            </Tag>
                            {plan.order_ids?.length > 0 && (
                              <Tag color="blue" style={{ marginBottom: 4 }}>
                                <FileTextOutlined /> {plan.order_ids.length} đơn hàng
                              </Tag>
                            )}
                          </Space>
                        </div>
                      </Space>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Card>
        </Col>

        {/* Right Column */}
        <Col xs={24} md={8}>
          <Card
            title="Vấn đề gần đây"
            style={cardStyle}
            extra={
              <Tag
                color="red"
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewAllProblems();
                }}
              >
                {pendingProblems} đang chờ
              </Tag>
            }
          >
            <Timeline
              items={recentProblems.map((problem: any) => ({
                color: "red",
                children: (
                  <div
                    style={{
                      cursor: "pointer",
                      padding: "8px",
                      borderRadius: "4px",
                      transition: "all 0.3s",
                    }}
                    onClick={() => handleProblemClick(problem.id)}
                  >
                    <Space direction="vertical" size="small" style={{ width: "100%" }}>
                      <div>
                        <Text strong style={{ fontSize: "16px" }}>
                          {problem.problem_name}
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: "14px" }}>
                          <FileTextOutlined /> Kế hoạch: {problem.plan_name}
                        </Text>
                      </div>

                      <Text type="secondary" style={{ fontSize: "14px" }}>
                        {problem.description}
                      </Text>

                      <Space size="middle">
                        <Text type="secondary" style={{ fontSize: "14px" }}>
                          <CalendarOutlined /> {formatDateTime(problem.created_date)}
                        </Text>
                        <Text type="secondary" style={{ fontSize: "14px" }}>
                          <TeamOutlined /> {problem.farmer_name}
                        </Text>
                      </Space>

                      {problem.problem_images?.length > 0 && (
                        <Image.PreviewGroup>
                          <Space
                            size="small"
                            style={{ marginTop: 8, display: "flex", flexWrap: "wrap" }}
                          >
                            {problem.problem_images.map((img: any) => (
                              <Image
                                key={img.image_id}
                                src={img.url}
                                width={60}
                                height={60}
                                style={{
                                  objectFit: "cover",
                                  borderRadius: 4,
                                  marginRight: 4,
                                  marginBottom: 4,
                                  cursor: "pointer",
                                }}
                                preview={false}
                              />
                            ))}
                          </Space>
                        </Image.PreviewGroup>
                      )}
                    </Space>
                  </div>
                ),
              }))}
            />
          </Card>
        </Col>
      </Row>

      {/* Status Overview */}
      <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
        <Col xs={24}>
          <Card title="Tổng quan trạng thái" style={cardStyle}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <Text strong style={{ display: "block", marginBottom: 8 }}>
                  Kế hoạch đang thực thi
                </Text>
                <Progress
                  type="circle"
                  percent={Math.round((ongoingPlans / totalPlans) * 100)}
                  format={() => `${ongoingPlans}/${totalPlans}`}
                  status="active"
                />
              </Col>
              <Col xs={24} sm={8}>
                <Text strong style={{ display: "block", marginBottom: 8 }}>
                  Kế hoạch chờ duyệt
                </Text>
                <Progress
                  type="circle"
                  percent={Math.round((pendingPlans / totalPlans) * 100)}
                  format={() => `${pendingPlans}/${totalPlans}`}
                  status="exception"
                />
              </Col>
              <Col xs={24} sm={8}>
                <Text strong style={{ display: "block", marginBottom: 8 }}>
                  Kế hoạch nháp
                </Text>
                <Progress
                  type="circle"
                  percent={Math.round((draftPlans / totalPlans) * 100)}
                  format={() => `${draftPlans}/${totalPlans}`}
                  status="normal"
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
