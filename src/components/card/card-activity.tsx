import { ShowButton } from "@refinedev/antd";
import { Card, Flex, Typography } from "antd";
import React from "react";
import { useNavigate } from "react-router";

type ActivityCardProps = {
  totalActivity?: number;
  lastActivityDate?: string;
  navigate?: string;
  title: string;
  icon?: React.ReactNode;
  completedTasks: number;
  loading?: boolean;
};

export const ActivityCard = (props: ActivityCardProps) => {
  const navigate = useNavigate();
  return (
    <>
      {" "}
      <Card
        loading={props?.loading}
        title={
          <Flex align="center" gap={8}>
            {props.icon}
            {props.title}
          </Flex>
        }
        extra={
          props?.navigate && (
            <ShowButton hideText size="small" onClick={() => navigate(`${props.navigate}`)} />
          )
        }
      >
        <Typography.Title level={2} style={{ fontSize: 28, textAlign: "center" }}>
          {props.completedTasks}
          {props.totalActivity && (
            <strong style={{ fontSize: 20, color: "gray" }}>/{props?.totalActivity}</strong>
          )}
        </Typography.Title>
        <Typography.Text
          type="secondary"
          style={{
            textAlign: "end",
            fontSize: 12,
            fontStyle: "italic",
          }}
        >
          {props.lastActivityDate}
        </Typography.Text>
      </Card>
    </>
  );
};
