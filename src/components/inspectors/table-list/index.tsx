import {
  type HttpError,
  getDefaultFilter,
  useGo,
  useNavigation,
  useTranslate,
} from "@refinedev/core";
import { DateField, FilterDropdown, TextField, useTable } from "@refinedev/antd";

import { Avatar, Button, Input, InputNumber, Select, Table, Typography, theme } from "antd";

import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { useLocation } from "react-router";
import { PaginationTotal } from "@/components/paginationTotal";
import { FarmerStatusTag } from "@/components/farmer";

export const InspectorListTable: React.FC = () => {
  const { token } = theme.useToken();
  const t = useTranslate();
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();

  const { tableProps, sorters, filters } = useTable<any, HttpError>({
    resource: "inspectors",
    filters: {
      initial: [
        {
          field: "id",
          operator: "eq",
          value: "",
        },
        {
          field: "name",
          operator: "contains",
          value: "",
        },
        {
          field: "phone",
          operator: "contains",
          value: "",
        },
        {
          field: "status",
          operator: "in",
          value: [],
        },
        {
          field: "email",
          operator: "contains",
          value: "",
        },
      ],
    },
  });

  return (
    <Table
      {...tableProps}
      rowKey="id"
      scroll={{ x: true }}
      pagination={{
        ...tableProps.pagination,
        showTotal: (total) => <PaginationTotal total={total} entityName="inspectors" />,
      }}
    >
      <Table.Column
        title="ID"
        dataIndex="id"
        key="id"
        width={"auto"}
        render={(value) => (
          <Typography.Text style={{ fontWeight: "bold" }}>#{value}</Typography.Text>
        )}
        filterIcon={(filtered) => (
          <SearchOutlined
            style={{
              color: filtered ? token.colorPrimary : undefined,
            }}
          />
        )}
        defaultFilteredValue={getDefaultFilter("id", filters, "eq")}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <InputNumber addonBefore="#" style={{ width: "100%" }} placeholder="Tìm ID" />
          </FilterDropdown>
        )}
      />

      <Table.Column
        title="Avatar"
        width={"auto"}
        dataIndex="image_url"
        key="image_url"
        render={(image: string) => <Avatar shape="square" src={image} alt="Inspector" />}
      />

      <Table.Column
        title="Name"
        dataIndex="name"
        key="name"
        width={"auto"}
        filterIcon={(filtered) => (
          <SearchOutlined
            style={{
              color: filtered ? token.colorPrimary : undefined,
            }}
          />
        )}
        defaultFilteredValue={getDefaultFilter("name", filters, "contains")}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Input placeholder="Search name" />
          </FilterDropdown>
        )}
      />

      <Table.Column
        title="Phone"
        dataIndex="phone"
        key="phone"
        width={"auto"}
        render={(value) => (
          <Typography.Paragraph ellipsis={{ rows: 2, tooltip: true }} style={{ marginBottom: 0 }}>
            {value}
          </Typography.Paragraph>
        )}
      />

      <Table.Column
        title="Email"
        dataIndex="email"
        key="email"
        width={"auto"}
        filterIcon={(filtered) => (
          <SearchOutlined
            style={{
              color: filtered ? token.colorPrimary : undefined,
            }}
          />
        )}
        defaultFilteredValue={getDefaultFilter("email", filters, "contains")}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Input placeholder="Search email" />
          </FilterDropdown>
        )}
      />

      <Table.Column
        title="Status"
        dataIndex="status"
        key="status"
        width={"auto"}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Select
              style={{ width: "200px" }}
              mode="multiple"
              placeholder="Filter by status"
              allowClear
            >
              <Select.Option value="Actived">Actived</Select.Option>
              <Select.Option value="UnActived">UnActived</Select.Option>
            </Select>
          </FilterDropdown>
        )}
        render={(value) => <FarmerStatusTag value={value} />}
      />
      <Table.Column
        title="Ngày tạo"
        dataIndex="created_at"
        key="created_at"
        width={120}
        render={(value) => <DateField value={value} />}
      />
      <Table.Column
        title="Ngày cập nhập"
        dataIndex="updated_at"
        key="updated_at"
        width={"auto"}
        render={(value) =>
          value ? (
            <DateField value={value} format="DD/MM/YYYY" />
          ) : (
            <TextField value="Chưa cập nhập" />
          )
        }
      />

      <Table.Column
        title="Actions"
        key="actions"
        fixed="right"
        align="center"
        render={(_, record: any) => (
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              go({
                to: `/inspectors/${record.id}`,
                query: {
                  to: pathname,
                },
                options: {
                  keepQuery: true,
                },
                type: "replace",
              });
            }}
          />
        )}
      />
    </Table>
  );
};
