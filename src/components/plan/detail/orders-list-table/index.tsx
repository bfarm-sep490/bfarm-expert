import { Card, Table, Tag, Typography, Flex, Space } from "antd";
import { useParams } from "react-router";
import { ShoppingOutlined, UserOutlined, NumberOutlined, BoxPlotOutlined } from "@ant-design/icons";

type OrderListTableProps = {
  orders: any[];
  orderLoading?: boolean;
};

export const OrdersListTable = (props: OrderListTableProps) => {
  const { id } = useParams();

  const columns = [
    {
      title: (
        <Space>
          <NumberOutlined />
          <span>ID</span>
        </Space>
      ),
      dataIndex: "id",
      key: "id",
      render: (value: number) => <Typography.Text strong>#{value}</Typography.Text>,
    },
    {
      title: (
        <Space>
          <UserOutlined />
          <span>Tên nhà mua sỉ</span>
        </Space>
      ),
      dataIndex: "retailer_name",
      key: "retailer_name",
      render: (value: string) => <Typography.Text>{value}</Typography.Text>,
    },
    {
      title: (
        <Space>
          <BoxPlotOutlined />
          <span>Loại thành phẩm</span>
        </Space>
      ),
      dataIndex: "packaging_type_name",
      key: "packaging_type_name",
      render: (value: string) => <Tag color="blue">{value}</Tag>,
    },
    {
      title: (
        <Space>
          <ShoppingOutlined />
          <span>Số lượng dự kiến</span>
        </Space>
      ),
      render: (_: any, record: any) => {
        const currentPlanInfo = record?.plan_information?.filter(
          (item: any) => item?.plan_id === Number(id),
        );
        const quantity = currentPlanInfo?.[0]?.order_plan_quantity ?? 0;
        return (
          <Flex align="center" gap={4}>
            <Typography.Text strong>{quantity}</Typography.Text>
            <Typography.Text type="secondary">kg</Typography.Text>
          </Flex>
        );
      },
    },
  ];

  return (
    <Card
      title={
        <Flex justify="space-between" align="center">
          <Typography.Title level={5} style={{ margin: 0 }}>
            Đơn hàng
          </Typography.Title>
          <Tag color="blue">{props?.orders?.length || 0} đơn</Tag>
        </Flex>
      }
      style={{
        height: "100%",
        borderRadius: 8,
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
      }}
      bodyStyle={{
        padding: 0,
        height: "calc(100% - 56px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Table
        loading={props?.orderLoading}
        dataSource={props?.orders}
        rowKey="id"
        pagination={{
          pageSize: 5,
          showSizeChanger: false,
          position: ["bottomCenter"],
        }}
        columns={columns}
        scroll={{ x: "max-content" }}
        size="small"
        style={{ flex: 1 }}
      />
    </Card>
  );
};
