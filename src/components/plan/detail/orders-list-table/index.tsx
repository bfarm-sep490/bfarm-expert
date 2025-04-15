import { Card, Table } from "antd";
import { useParams } from "react-router";

type OrderListTableProps = {
  orders: any[];
  orderLoading?: boolean;
};

export const OrdersListTable = (props: OrderListTableProps) => {
  const { id } = useParams();

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên nhà mua sỉ",
      dataIndex: "retailer_name",
      key: "retailer_name",
    },
    {
      title: "Loại thành phẩm",
      dataIndex: "packaging_type_name",
      key: "packaging_type_name",
    },
    {
      title: "Số lượng dự kiến trong plan",

      render: (_: any, record: any) => {
        const currentPlanInfo = record?.plan_information?.filter(
          (item: any) => item?.plan_id === Number(id),
        );

        return currentPlanInfo?.[0]?.order_plan_quantity ?? 0;
      },
    },
  ];

  return (
    <Card
      title={`Đơn hàng (${props?.orders?.length || 0})`}
      style={{ marginTop: 10 }}
    >
      <Table
        loading={props?.orderLoading}
        dataSource={props?.orders}
        rowKey="id"
        pagination={{
          pageSize: 5,
        }}
        columns={columns}
      />
    </Card>
  );
};
