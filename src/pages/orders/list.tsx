import { OrderListTable } from "@/components/orders/list-table.tsx";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useBack, useGo, useNavigation, useTranslate } from "@refinedev/core";
import { Button, Flex, Typography } from "antd";
import { type PropsWithChildren, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";

export const OrdersList = ({ children }: PropsWithChildren) => {
  const { id } = useParams();
  const back = useBack();
  const navigate = useNavigate();
  return (
    <>
      {id && (
        <Button
          type="text"
          style={{ width: "40px", height: "40px", marginBottom: 20 }}
          onClick={() => back()}
        >
          <ArrowLeftOutlined style={{ width: "50px", height: "50px" }} />
        </Button>
      )}
      <div>
        <Typography.Title level={4} style={{ marginBottom: 20 }}>
          {id ? `Đơn hàng của kế hoạch #${id}` : `Đơn hàng của trang trại `}
        </Typography.Title>
        {id && (
          <Flex justify="end" align="center" style={{ marginBottom: 20 }}>
            <Button onClick={() => navigate("create")}>Thêm đơn hàng mới</Button>
          </Flex>
        )}
        <OrderListTable />
      </div>
      {children}
    </>
  );
};
