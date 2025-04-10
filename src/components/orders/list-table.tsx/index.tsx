import React from "react";
import { DateField, TextField, useTable } from "@refinedev/antd";
import { getDefaultFilter, type HttpError, useGo, useTranslate } from "@refinedev/core";
import { Table, Button, Input, InputNumber, Typography, theme, Space } from "antd";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { PaginationTotal } from "@/components/paginationTotal";
import { IInspectingForm } from "@/interfaces";
import { useNavigate, useParams } from "react-router";
export const OrderListTable: React.FC = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const go = useGo();
  const { id } = useParams();
  const { tableProps, filters, setFilters } = useTable({
    resource: "orders",
    filters: {
      initial: [{ field: "plan_id", operator: "eq", value: id ?? "" }],
    },
  });
  const translate = useTranslate();
  return (
    <Table
      {...tableProps}
      rowKey="id"
      scroll={{ x: "max-content" }}
      pagination={{
        ...tableProps.pagination,
        showTotal: (total) => <PaginationTotal total={total} entityName="inspections" />,
      }}
    >
      <Table.Column
        title="ID"
        dataIndex="id"
        key="id"
        width={80}
        filterIcon={(filtered) => (
          <SearchOutlined style={{ color: filtered ? token.colorPrimary : undefined }} />
        )}
        defaultFilteredValue={getDefaultFilter("id", filters, "eq")}
        filterDropdown={(props) => (
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Tìm ID"
            onChange={(value) => setFilters([{ field: "id", operator: "eq", value }])}
          />
        )}
      />

      <Table.Column
        title={translate("retailer_name", "Tên người mua lẻ")}
        dataIndex="retailer_name"
        key="retailer_name"
      />
      <Table.Column
        title={translate("plan_name", "Tên kế hoạch")}
        dataIndex="plan_name"
        key="plan_name"
        render={(value) => <TextField value={value ? value : "Chưa xác định kế hoạch"} />}
      />
      <Table.Column
        title={translate("packaging_type_name", "Loại bao bì")}
        dataIndex="packaging_type_name"
        key="packaging_type_name"
      />

      <Table.Column
        title={translate("deposit_price", "Tiền đặt cọc")}
        dataIndex="deposit_price"
        key="deposit_price"
        render={(value) => <TextField value={value ? value + " vnd" : "Chưa đặt cọc"} />}
      />
      <Table.Column
        title={translate("total_price", "Tổng tiền")}
        dataIndex="total_price"
        key="total_price"
        render={(value) => <TextField value={value ? value + " vnd" : "Chưa xác định tổng"} />}
      />
      <Table.Column title={translate("phone", "Điện thoại")} dataIndex="phone" key="phone" />
      <Table.Column
        title={translate("preorder_quantity", "Số lượng đặt trước")}
        dataIndex="preorder_quantity"
        key="preorder_quantity"
        render={(value) => (
          <TextField value={value ? value + " kg" : "Chưa xác định số lượng đặt trước"} />
        )}
      />
      <Table.Column
        title={translate("estimate_pick_up_date", "Ngày dự kiến lấy hàng")}
        dataIndex="estimate_pick_up_date"
        key="estimate_pick_up_date"
        render={(value) => <DateField value={value} format="DD/MM/YYYY" />}
      />
      <Table.Column
        title={translate("created_at", "Ngày tạo")}
        dataIndex="created_at"
        key="created_at"
        render={(value) => <DateField value={value} format="DD/MM/YYYY" />}
      />

      <Table.Column title={translate("Status", "Trạng thái")} dataIndex="status" key="status" />

      <Table.Column
        title={translate("Actions", "Hành động")}
        key="actions"
        fixed="right"
        align="center"
        render={(_, record: IInspectingForm) => (
          <Space>
            {record.id ? (
              <Button
                icon={<EyeOutlined />}
                onClick={() =>
                  navigate(id ? `/plans/${id}/orders/${record.id}` : `/orders/${record.id}`)
                }
              />
            ) : (
              <Typography.Text type="secondary">N/A</Typography.Text>
            )}
          </Space>
        )}
      />
    </Table>
  );
};
