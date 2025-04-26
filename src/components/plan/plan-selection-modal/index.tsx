import { Modal, Card, Transfer, Typography, Space, Tag, Spin, Button } from "antd";
import { useState, Key, useEffect } from "react";
import { useList } from "@refinedev/core";
import { ShoppingCartOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { IOrder } from "@/interfaces";
import { useOrderStore } from "@/store/order-store";
import Paragraph from "antd/es/typography/Paragraph";

const { Text } = Typography;

interface OrderData {
  key: string;
  id: number;
  address: string;
  preorder_quantity: number;
  status: string;
  estimate_pick_up_date: string;
  plant_id: number;
  plant_name: string;
  retailer_id: number;
  packaging_type_id: number;
  disabled?: boolean;
}

interface PlanSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onCreateWithOrders: (orderIds: string[], totalPreorderQuantity: number) => void;
  onCreateNormal: () => void;
}

export const PlanSelectionModal = ({
  open,
  onClose,
  onCreateWithOrders,
  onCreateNormal,
}: PlanSelectionModalProps) => {
  const [option, setOption] = useState<"with_orders" | "normal">("normal");
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);

  const {
    setOrders,
    setSelectedOrders,
    selectedOrders,
    totalQuantity,
    selectedPlantId,
    setSelectedPlantId,
  } = useOrderStore();

  const { data, isLoading } = useList<IOrder>({
    resource: "orders/no-plan",
    filters: [
      {
        field: "status",
        operator: "eq",
        value: "Deposit",
      },
    ],
  });

  useEffect(() => {
    if (data?.data) {
      const formattedOrders = data.data.map((order) => ({
        id: order.id,
        name: `Đơn hàng #${order.id}`,
        quantity: order.preorder_quantity,
        estimate_pick_up_date: order.estimate_pick_up_date,
        plant_id: order.plant_id,
        selected: false,
      }));
      setOrders(formattedOrders);
    }
  }, [data, setOrders]);

  const tableData: OrderData[] =
    data?.data?.map((order) => ({
      key: order.id.toString(),
      ...order,
      disabled: selectedPlantId !== null && order.plant_id !== selectedPlantId,
    })) || [];

  const handleTransferChange = (
    nextTargetKeys: Key[],
    direction: "left" | "right",
    moveKeys: Key[],
  ) => {
    if (nextTargetKeys.length === 0) {
      setSelectedPlantId(null);
      setSelectedOrders([]);
      return;
    }

    if (selectedOrders.length === 0 && nextTargetKeys.length > 0) {
      const firstOrder = tableData.find((order) => order.key === nextTargetKeys[0]);
      if (firstOrder) {
        setSelectedPlantId(firstOrder.plant_id);
      }
    }

    const validMoveKeys = moveKeys.filter((key) => {
      const order = tableData.find((order) => order.key === key);
      return order && !order.disabled;
    });

    if (direction === "right") {
      const newOrders = validMoveKeys.map((key) => {
        const order = tableData.find((order) => order.key === key);
        return {
          id: key.toString(),
          quantity: order?.preorder_quantity || 0,
          estimate_pick_up_date: order?.estimate_pick_up_date || "",
          plant_id: order?.plant_id || 0,
          packaging_type_id: order?.packaging_type_id || 0,
        };
      });
      setSelectedOrders([...selectedOrders, ...newOrders]);
    } else {
      const remainingOrders = selectedOrders.filter((order) => !validMoveKeys.includes(order.id));
      setSelectedOrders(remainingOrders);
      if (remainingOrders.length === 0) {
        setSelectedPlantId(null);
      }
    }
  };

  const handleSelectChange = (sourceSelectedKeys: Key[], targetSelectedKeys: Key[]) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);

    if (sourceSelectedKeys.length > 0) {
      const firstSelectedOrder = tableData.find((order) => order.key === sourceSelectedKeys[0]);
      if (firstSelectedOrder) {
        setSelectedPlantId(firstSelectedOrder.plant_id);
      }
    } else {
      setSelectedPlantId(null);
    }
  };

  const handleOptionChange = (value: "with_orders" | "normal") => {
    setOption(value);
    setSelectedOrders([]);
    setSelectedPlantId(null);
    setSelectedKeys([]);
  };

  const handleClose = () => {
    setOption("normal");
    setSelectedOrders([]);
    setSelectedPlantId(null);
    setSelectedKeys([]);
    onClose();
  };

  const handleCreate = () => {
    if (option === "with_orders") {
      onCreateWithOrders(
        selectedOrders.map((order) => order.id),
        totalQuantity,
      );
    } else {
      onCreateNormal();
    }
  };

  return (
    <Modal
      title="Tạo kế hoạch mới"
      open={open}
      onCancel={handleClose}
      onOk={handleCreate}
      okButtonProps={{
        disabled: option === "with_orders" && selectedOrders.length === 0,
      }}
      width={1200}
      footer={[
        <Space key="footer">
          <Text type="secondary">
            {selectedOrders.length > 0
              ? `Đã chọn ${selectedOrders.length} đơn hàng (Tổng số lượng: ${totalQuantity} kg)`
              : "Chưa chọn đơn hàng nào"}
          </Text>
          <Button onClick={handleClose}>Hủy</Button>
          <Button
            type="primary"
            onClick={handleCreate}
            disabled={option === "with_orders" && selectedOrders.length === 0}
          >
            Xác nhận
          </Button>
        </Space>,
      ]}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div style={{ display: "flex", gap: "16px", width: "100%" }}>
          <Card
            hoverable
            style={{
              flex: 1,
              cursor: "pointer",
              borderColor: option === "with_orders" ? "#1890ff" : "#d9d9d9",
              height: "100%",
            }}
            onClick={() => handleOptionChange("with_orders")}
          >
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
              <Space>
                <ShoppingCartOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
                <Text strong>Tạo từ đơn hàng</Text>
              </Space>
              <Paragraph
                type="secondary"
                ellipsis={{
                  rows: 1,
                  expandable: true,
                  tooltip: true,
                }}
              >
                Tạo kế hoạch từ các đơn hàng đã đặt cọc. Các đơn hàng phải cùng một cây.
              </Paragraph>
            </Space>
          </Card>

          <Card
            hoverable
            style={{
              flex: 1,
              cursor: "pointer",
              borderColor: option === "normal" ? "#1890ff" : "#d9d9d9",
              height: "100%",
            }}
            onClick={() => handleOptionChange("normal")}
          >
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
              <Space>
                <PlusCircleOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
                <Text strong>Tạo mới</Text>
              </Space>
              <Paragraph
                type="secondary"
                ellipsis={{
                  expandable: true,
                  tooltip: true,
                }}
              >
                Tạo kế hoạch mới từ đầu, không liên kết với đơn hàng nào
              </Paragraph>
            </Space>
          </Card>
        </div>

        {option === "with_orders" && (
          <Spin spinning={isLoading}>
            <Transfer<OrderData>
              dataSource={tableData}
              oneWay
              targetKeys={selectedOrders.map((order) => order.id)}
              selectedKeys={selectedKeys}
              onChange={handleTransferChange}
              onSelectChange={handleSelectChange}
              render={(item) => (
                <Space direction="vertical" size={0}>
                  <Space>
                    <Text strong>#{item.id}</Text>
                    <Tag
                      color={
                        selectedPlantId === null || selectedPlantId === item.plant_id
                          ? "blue"
                          : "default"
                      }
                    >
                      #{item.plant_name}
                    </Tag>
                  </Space>
                  <Space>
                    <Text type="secondary">Số lượng: {item.preorder_quantity} kg</Text>
                    <Text type="secondary">•</Text>
                    <Text type="secondary">Địa chỉ: {item.address}</Text>
                  </Space>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    Ngày dự kiến: {new Date(item.estimate_pick_up_date).toLocaleDateString("vi-VN")}
                  </Text>
                </Space>
              )}
              titles={[
                <Space key="left">
                  <Text strong>Đơn hàng khả dụng</Text>
                  <Tag color="blue">{tableData.length}</Tag>
                </Space>,
                <Space key="right">
                  <Text strong>Đơn hàng đã chọn</Text>
                  <Tag color="green">{selectedOrders.length}</Tag>
                </Space>,
              ]}
              style={{ width: "100%" }}
              listStyle={{
                flex: 1,
                height: 400,
              }}
              showSearch
              filterOption={(inputValue, item) => {
                const order = item as OrderData;
                return (
                  order.id.toString().indexOf(inputValue) !== -1 ||
                  order.address.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
                );
              }}
            />
          </Spin>
        )}
      </Space>
    </Modal>
  );
};
