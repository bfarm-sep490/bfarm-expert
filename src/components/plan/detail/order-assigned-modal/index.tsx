import { DateField, useForm } from "@refinedev/antd";
import { useBack, useList, useOne } from "@refinedev/core";
import { Alert, Button, Divider, Flex, Form, List, Modal, Select, Typography } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

export const OrderAssignedModal = () => {
  const [needOrder, setNeedOrder] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const { id } = useParams();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { data: plantData } = useOne({
    resource: `plans`,
    id: `${id}/general`,
  });
  const plan = plantData?.data;

  const { data: orderData } = useList({
    resource: `orders/no-plan`,
  });

  const noPlanOrders = orderData?.data;

  const orders = noPlanOrders?.filter(
    (order) => order.plant_id === plan?.plant_information?.plant_id,
  );
  const { formProps, saveButtonProps } = useForm({
    resource: `plans/${id}/orders`,
    action: "create",
    onMutationSuccess() {
      navigate(`/plans/${id}/orders`);
    },
    onMutationError() {
      setError("Đã có lỗi xảy ra, vui lòng thử lại sau!");
    },
  });
  useEffect(() => {
    if (orders && JSON.stringify(orders) !== JSON.stringify(needOrder)) {
      setNeedOrder(orders);
    }
  }, [orders]);
  const back = useBack();
  const handleOrderSelect = (orderId: any) => {
    const order = orders?.find((o) => o.id === orderId);
    setSelectedOrder(order);
    formProps?.form?.setFieldsValue({ order_id: orderId });
  };

  return (
    <Form
      layout="vertical"
      form={formProps.form}
      onChange={formProps.onChange}
      onFinish={formProps.onFinish}
    >
      <Modal
        title="Thêm nông dân vào kế hoạch"
        open={true}
        onCancel={() => back()}
        footer={
          <>
            <Button type="default" onClick={() => back()}>
              Hủy
            </Button>
            <Button type="primary" {...saveButtonProps}>
              Lưu
            </Button>
          </>
        }
      >
        <Typography.Text
          type="danger"
          style={{ fontSize: 12, marginBottom: 20, fontStyle: "italic" }}
        >
          * Kế hoạch đã được lên kế hoạch cho những đơn hàng với sản lượng dự kiến đã tính toán kĩ,
          bạn cân nhắc khi thêm đơn hàng vào kế hoạch.
        </Typography.Text>
        <Divider></Divider>
        {error && <Alert message={error} type="error" showIcon />}
        <Form.Item
          name="order_id"
          label="Chọn đơn hàng"
          rules={[{ required: true, message: "Vui lòng chọn đơn hàng!" }]}
        >
          <Select placeholder="Chọn đơn hàng" onChange={handleOrderSelect}>
            {needOrder?.map((order: any) => (
              <Select.Option key={order.id} value={order.id}>
                {`${order.retailer_name} - ${order.preorder_quantity} kg - ${order.estimate_pick_up_date}`}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {selectedOrder && (
          <Flex vertical gap={24}>
            <Typography.Title level={4}>Chi tiết đơn hàng</Typography.Title>
            <List
              bordered
              dataSource={[
                { label: "Nhà mua sỉ", value: selectedOrder.retailer_name },
                { label: "Giống cây", value: selectedOrder.plant_name },
                { label: "Trạng thái", value: selectedOrder.status },
                { label: "Địa chỉ", value: selectedOrder.address },
                { label: "Số điện thoại", value: selectedOrder.phone },
                {
                  label: "Số lượng dự kiến",
                  value: selectedOrder.preorder_quantity + " kg",
                },
                {
                  label: "Ngày ước tính lấy hàng",
                  value: (
                    <DateField value={selectedOrder.estimate_pick_up_date} format="DD/MM/YYYY" />
                  ),
                },
                {
                  label: "Ngày tạo đơn",
                  value: <DateField value={selectedOrder.created_at} format="hh:mm DD/MM/YYYY" />,
                },
                {
                  label: "Mức giá đặt cọc",
                  value: selectedOrder.deposit_price + " vnd",
                },
                {
                  label: "Giá tổng",
                  value: selectedOrder.total_price ? selectedOrder.total_price + " vnd" : "Chưa có",
                },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Typography.Text strong>{item.label}:</Typography.Text> {item.value}
                </List.Item>
              )}
            />
          </Flex>
        )}
      </Modal>
    </Form>
  );
};
