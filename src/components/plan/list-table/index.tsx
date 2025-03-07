import {
  type HttpError,
  getDefaultFilter,
  useGo,
  useNavigation,
  useTranslate,
} from "@refinedev/core";
import { FilterDropdown, getDefaultSortOrder, useTable } from "@refinedev/antd";
import type { IPlan } from "../../../interfaces";
import { Button, Input, InputNumber, Select, Table, theme, Typography } from "antd";
import { PaginationTotal } from "../../paginationTotal";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { useLocation } from "react-router";
import { NumberWithUnit } from "../number-with-unit";

export const PlanListTable = () => {
  const { token } = theme.useToken();
  const t = useTranslate();
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();

  const { tableProps, sorters, filters } = useTable<IPlan, HttpError>({
    filters: {
      initial: [
        {
          field: "description",
          operator: "contains",
          value: "",
        },
        {
          field: "plan_name",
          operator: "contains",
          value: "",
        },
        {
          field: "status",
          operator: "in",
          value: [],
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
        showTotal: (total) => <PaginationTotal total={total} entityName="plan" />,
      }}
    >
      <Table.Column
        title={
          <Typography.Text
            style={{
              whiteSpace: "nowrap",
            }}
          >
            ID #
          </Typography.Text>
        }
        dataIndex="id"
        width={80}
        render={(value) => (
          <Typography.Text
            style={{
              whiteSpace: "nowrap",
            }}
          >
            #{value}
          </Typography.Text>
        )}
        filterIcon={(filtered) => (
          <SearchOutlined style={{ color: filtered ? token.colorPrimary : undefined }} />
        )}
        defaultFilteredValue={getDefaultFilter("plan_id", filters, "eq")}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <InputNumber
              addonBefore="#"
              style={{ width: "100%" }}
              placeholder={t("plans.filter.id.placeholder")}
            />
          </FilterDropdown>
        )}
      />
      <Table.Column
        title={t("plans.fields.plan_name", "Plan Name")}
        dataIndex="plan_name"
        filterIcon={(filtered) => (
          <SearchOutlined style={{ color: filtered ? token.colorPrimary : undefined }} />
        )}
        defaultFilteredValue={getDefaultFilter("plan_name", filters, "contains")}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Input placeholder={t("plans.filter.plan_name.placeholder")} />
          </FilterDropdown>
        )}
        render={(value: string) => (
          <Typography.Text
            style={{
              whiteSpace: "nowrap",
            }}
          >
            {value}
          </Typography.Text>
        )}
      />
      <Table.Column
        title={t("plans.fields.plant", "Plant")}
        dataIndex={["plants", "plant_name"]}
        render={(value: string) => (
          <Typography.Text
            style={{
              whiteSpace: "nowrap",
            }}
          >
            {value}
          </Typography.Text>
        )}
      />
      <Table.Column
        title={t("plans.fields.description", "Description")}
        dataIndex="description"
        width={300}
        filterIcon={(filtered) => (
          <SearchOutlined style={{ color: filtered ? token.colorPrimary : undefined }} />
        )}
        defaultFilteredValue={getDefaultFilter("description", filters, "contains")}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Input placeholder={t("plans.filter.description.placeholder")} />
          </FilterDropdown>
        )}
        render={(description: string) => (
          <Typography.Paragraph
            ellipsis={{ rows: 1, tooltip: true }}
            style={{ maxWidth: "280px", marginBottom: 0 }}
          >
            {description}
          </Typography.Paragraph>
        )}
      />
      <Table.Column
        title={t("plans.fields.status", "Status")}
        dataIndex="status"
        sorter
        defaultSortOrder={getDefaultSortOrder("status", sorters)}
        defaultFilteredValue={getDefaultFilter("status", filters, "in")}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Select
              style={{ width: "200px" }}
              allowClear
              mode="multiple"
              placeholder={t("plans.filter.status.placeholder")}
            >
              <Select.Option value="Pending">{t("plans.status.pending")}</Select.Option>
              <Select.Option value="Ongoing">{t("plans.status.ongoing")}</Select.Option>
              <Select.Option value="Completed">{t("plans.status.completed")}</Select.Option>
              <Select.Option value="Cancelled">{t("plans.status.cancelled")}</Select.Option>
            </Select>
          </FilterDropdown>
        )}
      />

      <Table.Column
        title={t("plans.fields.estimated_product", "EstimatedProduct")}
        dataIndex="estimated_product"
        sorter
        defaultSortOrder={getDefaultSortOrder("estimated_product", sorters)}
        render={(value: number, record: IPlan) => (
          <NumberWithUnit value={value} unit={record.estimated_unit} />
        )}
      />
      <Table.Column
        title={t("plans.fields.started_date", "StartedDate")}
        dataIndex="start_date"
        sorter
        defaultSortOrder={getDefaultSortOrder("started_date", sorters)}
        render={(value: string) => (
          <Typography.Text style={{ whiteSpace: "nowrap" }}>
            {new Date(value)?.toLocaleDateString()}
          </Typography.Text>
        )}
      />
      <Table.Column
        title={t("table.actions")}
        fixed="right"
        align="center"
        render={(_, record: IPlan) => (
          <Button
            icon={<EyeOutlined />}
            onClick={() =>
              go({
                to: `${showUrl("plans", record.id)}`,
                query: { to: pathname },
                options: { keepQuery: true },
                type: "replace",
              })
            }
          />
        )}
      />
    </Table>
  );
};
