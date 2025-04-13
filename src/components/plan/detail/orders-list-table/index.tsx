import { Card, Table } from "antd";
type OrderListTableProps = {
  orders: any[];
  orderLoading?: boolean;
};

export const OrdersListTabel = (props: OrderListTableProps) => {
  return (
    <Card title={`Đơn hàng (${props?.orders?.length})`} style={{ marginTop: 10 }}>
      <Table
        loading={props?.orderLoading}
        dataSource={props?.orders}
        rowKey="id"
        pagination={{
          pageSize: 5,
        }}
      >
        <Table.Column title="ID" dataIndex="id" key="id" />
        <Table.Column title="Tên nhà mua sỉ" dataIndex="retailer_name" key="retailer_name" />
        <Table.Column
          title="Loại thành phẩm"
          dataIndex="packaging_type_name"
          key="packaging_type_name"
        />
        <Table.Column title="Trạng thái" dataIndex="status" key="status" />
      </Table>
    </Card>
  );
};
