/* eslint-disable prettier/prettier */
import React from "react";
import { useTable } from "@refinedev/antd";
import { getDefaultFilter, type HttpError, useGo } from "@refinedev/core";
import { Table, Button, Input, InputNumber, Typography, theme, Space } from "antd";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { PaginationTotal } from "@/components/paginationTotal";
import { IInspectingForm } from "@/interfaces";
import { InspectionStatusTag } from "../status";
import dayjs from "dayjs";

export const InspectionListTable: React.FC = () => {
  const { token } = theme.useToken();
  const go = useGo();


  const { tableProps, filters, setFilters } = useTable<IInspectingForm, HttpError>({
    resource: "inspecting-forms",
    filters: {
      initial: [
        { field: "id", operator: "eq", value: "" },
        { field: "task_type", operator: "contains", value: "" },

      ],
    },
  });

  const handleView = (id?: number) => {
    if (id) {
      go({
        to: `/inspection-forms/${id}`,
        type: "push",
      });
    }
  };

  return (
    <Table
      {...tableProps}
      rowKey="id"
      scroll={{ x: true }}
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

      <Table.Column title="Tên kế hoạch" dataIndex="plan_name" key="plan_name" />
      <Table.Column title="Tên công việc" dataIndex="task_name" key="task_name" />

      <Table.Column title="Người kiểm tra" dataIndex="inspector_name" key="inspector_name" />
      <Table.Column
        title="Ngày bắt đầu"
        dataIndex="start_date"
        key="start_date"
        render={(value: string) => dayjs(value).format("DD/MM/YYYY HH:mm")}
      />

      <Table.Column
        title="Ngày kết thúc"
        dataIndex="end_date"
        key="end_date"
        render={(value: string) => dayjs(value).format("DD/MM/YYYY HH:mm")}
      />


      <Table.Column
        title="Trạng thái"
        dataIndex="status"
        key="status"
        render={(status) => <InspectionStatusTag value={status} />}
      />

      <Table.Column
        title="Hành động"
        key="actions"
        fixed="right"
        align="center"
        render={(_, record: IInspectingForm) => (
          <Space>
            {record.id ? (
              <Button icon={<EyeOutlined />} onClick={() => handleView(record.id)} />
            ) : (
              <Typography.Text type="secondary">N/A</Typography.Text>
            )}
          </Space>
        )}
      />
    </Table>
  );
};
