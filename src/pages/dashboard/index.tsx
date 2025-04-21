import { useGetIdentity, useList } from "@refinedev/core";
import { Flex, Card, Typography, Spin } from "antd";
import React from "react";

import { DashboardPlanTracking } from "@/components/dashboard/dashboard-plans-tracking";
import { IIdentity } from "../../interfaces";

export const DashboardPage: React.FC = () => {
  const { data: plantData, isLoading: plantLoading } = useList({
    resource: "plants",
    pagination: {
      pageSize: 100,
    },
  });

  const { data: user } = useGetIdentity<IIdentity>();

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

  const problemCount = problemData?.data?.filter(
    (problem) =>
      planData?.data?.map((plan) => plan?.id)?.some((planId) => problem?.plan_id === planId) &&
      problem?.status === "Pending",
  )?.length;

  const endingSoonCount = planData?.data?.filter(
    (plan: any) =>
      plan?.expert_id === user?.id &&
      plan?.end_date - Date.now() < 86400000 * 7 &&
      plan?.status === "Ongoing",
  )?.length;

  const cardStyle = {
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    height: "100%",
    transition: "all 0.3s ease",
  };

  const statCards = [
    {
      title: "Tổng số kế hoạch",
      value: planData?.data?.length || 0,
      color: "#e6f4ff",
      textColor: "#1677ff",
      borderColor: "#1677ff",
    },
    {
      title: "Kế hoạch đang thực thi",
      value: planData?.data?.filter((plan: any) => plan?.status === "Ongoing")?.length || 0,
      color: "#f6ffed",
      textColor: "#52c41a",
      borderColor: "#52c41a",
    },
    {
      title: "Kế hoạch sắp kết thúc",
      value: endingSoonCount || 0,
      color: "#fffbe6",
      textColor: "#faad14",
      borderColor: "#faad14",
      subtext: "Kết thúc sau 7 ngày",
    },
    {
      title: "Vấn đề mới",
      value: problemCount || 0,
      color: "#fff1f0",
      textColor: "#ff4d4f",
      borderColor: "#ff4d4f",
    },
  ];

  const isLoading = planLoading || plantLoading || problemLoading;

  return (
    <Flex vertical gap={20}>
      <Flex gap={16} style={{ width: "100%" }}>
        {statCards.map((card, index) => (
          <Card
            key={index}
            title={
              <Flex align="center" gap={10}>
                <Typography.Text strong>{card.title}</Typography.Text>
              </Flex>
            }
            style={{
              ...cardStyle,
              width: "25%",
              borderTop: `3px solid ${card.borderColor}`,
            }}
            bodyStyle={{
              padding: card.subtext ? "16px" : "24px 16px",
              borderRadius: "0 0 10px 10px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
            headStyle={{
              borderBottom: `1px solid ${card.borderColor}`,
              padding: "16px",
            }}
          >
            {isLoading ? (
              <Spin />
            ) : (
              <Flex vertical gap={4} justify="center" align="center">
                <Typography.Text
                  strong
                  style={{
                    fontSize: 36,
                    color: card.textColor,
                  }}
                >
                  {card.value}
                </Typography.Text>
                {card.subtext && (
                  <Typography.Text type="secondary" style={{ textAlign: "center" }}>
                    {card.subtext}
                  </Typography.Text>
                )}
              </Flex>
            )}
          </Card>
        ))}
      </Flex>

      <DashboardPlanTracking
        plansData={planData}
        plantData={plantData}
        loading={isLoading}
        style={{ width: "100%" }}
      />
    </Flex>
  );
};
