import { DateField, TagField, TextField, Title, useModalForm } from "@refinedev/antd";
import { useShow, useNavigation, useBack, useList } from "@refinedev/core";
import {
  Drawer,
  Flex,
  Grid,
  Typography,
  List,
  Divider,
  Image,
  Table,
  Radio,
  Space,
  Button,
  Modal,
  Tag,
  Select,
  notification,
  Input,
  Form,
  theme,
  Card,
} from "antd";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { set, values } from "lodash";
import { CompleteOrderModal } from "../complete-modal";
export const OrderDrawerShow = () => {
  const [open, setOpen] = useState(false);
  const { orderId } = useParams();
  const { query: queryResult } = useShow<any>({
    resource: "orders",
    id: orderId,
  });
  const order = queryResult?.data?.data;
  const navigate = useNavigate();
  const back = useBack();
  const [api, contextHolder] = notification.useNotification();
  const { token } = theme.useToken();
  const breakpoint = { sm: window.innerWidth > 576 };
  return (
    <>
      {contextHolder}
      <Drawer
        open={true}
        width={breakpoint.sm ? "60%" : "100%"}
        onClose={back}
        style={{
          backgroundColor: token.colorBgLayout,
        }}
        headerStyle={{
          backgroundColor: token.colorBgContainer,
        }}
        title={
          <>
            <Flex justify="space-between" align="center" style={{ marginLeft: 16 }}>
              <Typography.Title level={4} style={{ margin: 0 }}>
                Thông tin đơn hàng #{orderId}
              </Typography.Title>
              {order?.status === "Pending" && (
                <Flex justify="end">
                  <Space>
                    <Button color="danger" variant="solid">
                      Từ chối
                    </Button>
                    <Button>Chấp nhận</Button>
                  </Space>
                </Flex>
              )}
              {order?.status === "Deposit" && (
                <>
                  <Flex justify="end" gap={10}>
                    <Button color="danger" onClick={() => navigate("cancel")}>
                      Hủy bỏ
                    </Button>
                    <Button
                      type="primary"
                      disabled={order?.plan_id === null}
                      onClick={() => setOpen(true)}
                    >
                      Hoàn thành
                    </Button>
                  </Flex>

                  {order.plan_id === null && (
                    <TextField
                      style={{
                        textAlign: "end",
                        fontSize: 12,
                        color: "red",
                        fontStyle: "italic",
                        marginTop: 10,
                        marginBottom: 10,
                        justifyContent: "end",
                      }}
                      value={"* Đơn hàng này không thể hoàn thành khi chưa có kế hoạch"}
                    ></TextField>
                  )}
                </>
              )}
            </Flex>
          </>
        }
      >
        <Card
          title={
            <>
              <Flex justify="space-between">
                <Flex vertical={false} gap={6}>
                  <Typography.Title level={5} style={{ margin: 0 }}>
                    Đơn hàng #{orderId}
                  </Typography.Title>
                  <Typography.Text
                    style={{
                      fontSize: 14,
                      color: `${
                        order?.status === "Deposit"
                          ? "green"
                          : order?.status === "Pending"
                            ? "orange"
                            : "red"
                      }`,
                    }}
                  >
                    {order?.status === "Deposit"
                      ? "Đã đặt cọc"
                      : order?.status === "Pending"
                        ? "Chờ duyệt"
                        : order?.status}
                  </Typography.Text>
                </Flex>
                <Flex justify="end">
                  <TagField value={order?.status} />
                </Flex>
              </Flex>
            </>
          }
        >
          <Flex vertical gap={12}>
            <Flex justify="space-between">
              <Typography.Text strong>Nhà mua sỉ</Typography.Text>
              <Typography.Text>{order?.retailer_name}</Typography.Text>
            </Flex>
            <Flex justify="space-between">
              <Typography.Text strong>Giống cây</Typography.Text>
              <Typography.Text>{order?.plant_name}</Typography.Text>
            </Flex>
            <Flex justify="space-between">
              <Typography.Text strong>Địa chỉ</Typography.Text>
              <Typography.Text>{order?.address}</Typography.Text>
            </Flex>
            <Flex justify="space-between">
              <Typography.Text strong>Số điện thoại</Typography.Text>
              <Typography.Text>{order?.phone}</Typography.Text>
            </Flex>
            <Flex justify="space-between">
              <Typography.Text strong>Số lượng dự kiến</Typography.Text>
              <Typography.Text>{order?.preorder_quantity} kg</Typography.Text>
            </Flex>
            <Flex justify="space-between">
              <Typography.Text strong>Ngày ước tính lấy hàng</Typography.Text>
              <DateField format="DD/MM/YYYY" value={order?.estimate_pick_up_date} />
            </Flex>
            <Flex justify="space-between">
              <Typography.Text strong>Ngày tạo đơn</Typography.Text>
              <DateField format="hh:mm DD/MM/YYYY" value={order?.created_at} />
            </Flex>
            <Flex justify="space-between">
              <Typography.Text strong>Mức giá đặt cọc</Typography.Text>
              <Typography.Text>{order?.deposit_price} vnd</Typography.Text>
            </Flex>
            <Flex justify="space-between">
              <Typography.Text strong>Giá tổng</Typography.Text>
              <Typography.Text>
                {order?.total_price ? order?.total_price + " vnd" : "Chưa có"}
              </Typography.Text>
            </Flex>
          </Flex>
        </Card>

        <Divider />
        <Card title={"Thông tin kế hoạch"}>
          <Flex justify="space-between">
            <Typography.Text strong>Id</Typography.Text>
            <Typography.Text>{order?.plan_id}</Typography.Text>
          </Flex>
          <Flex justify="space-between">
            <Typography.Text strong>Tên kế hoạch</Typography.Text>
            <Typography.Text>{order?.plan_name}</Typography.Text>
          </Flex>
        </Card>
        <CompleteOrderModal
          onCancel={() => setOpen(false)}
          onClose={() => setOpen(false)}
          open={open}
        />
      </Drawer>
    </>
  );
};
