import {
  type HttpError,
  getDefaultFilter,
  useGo,
  useNavigation,
  useInvalidate,
  useGetIdentity,
  useTranslate,
} from "@refinedev/core";
import { FilterDropdown, getDefaultSortOrder, useTable } from "@refinedev/antd";
import type { IIdentity, IPlan } from "../../../interfaces";
import { Input, InputNumber, Select, Table, theme, Typography, Tag, Spin, Badge } from "antd";
import { PaginationTotal } from "../../paginationTotal";
import { SearchOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router";
import { NumberWithUnit } from "../number-with-unit";
import { PlanActions } from "../plan-action";
import dayjs from "dayjs";

export const PlanListTable = () => {
  const { token } = theme.useToken();
  const t = useTranslate();
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();
  const invalidate = useInvalidate();
  const { data: user, isLoading: isLoadingUser } = useGetIdentity<IIdentity>();
  const { tableProps, sorters, filters } = useTable<IPlan, HttpError>({
    resource: `plans`,
    syncWithLocation: true,
    queryOptions: {
      enabled: !isLoadingUser && !!user?.id,
    },
    filters: {
      permanent: [
        {
          field: "expert_id",
          operator: "eq",
          value: user?.id,
        },
      ],
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

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "blue";
      case "ongoing":
        return "green";
      case "complete":
        return "purple";
      case "cancel":
        return "red";
      default:
        return "default";
    }
  };
  const navigate = useNavigate();

  if (isLoadingUser) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Table
      {...tableProps}
      rowKey="id"
      scroll={{ x: true }}
      pagination={{
        ...tableProps.pagination,
        showTotal: (total) => <PaginationTotal total={total} entityName="plans" />,
      }}
      onRow={(record) => ({
        onClick: () => navigate(`${record.id}`),
        style: { cursor: "pointer" },
      })}
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
        defaultFilteredValue={getDefaultFilter("id", filters, "eq")}
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
        title={
          <Typography.Text style={{ whiteSpace: "nowrap" }}>
            {t("plans.fields.plan_name.label")}
          </Typography.Text>
        }
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
        render={(value: string, record: IPlan) => (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Typography.Text
              style={{
                whiteSpace: "nowrap",
              }}
            >
              {value}
            </Typography.Text>
            {record.order_ids && record.order_ids.length > 0 && (
              <Badge count={record.order_ids.length} size="small">
                <ShoppingCartOutlined style={{ color: token.colorPrimary }} />
              </Badge>
            )}
          </div>
        )}
      />
      <Table.Column
        title={
          <Typography.Text style={{ whiteSpace: "nowrap" }}>
            {t("plans.fields.plant_name", "Plant")}
          </Typography.Text>
        }
        dataIndex="plant_name"
        render={(value: string) => (
          <Typography.Text
            style={{
              whiteSpace: "nowrap",
            }}
          >
            {value}
          </Typography.Text>
        )}
        filterIcon={(filtered) => (
          <SearchOutlined style={{ color: filtered ? token.colorPrimary : undefined }} />
        )}
        defaultFilteredValue={getDefaultFilter("plant_name", filters, "contains")}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Input placeholder={t("plans.filter.plant_name.placeholder")} />
          </FilterDropdown>
        )}
      />
      <Table.Column
        title={
          <Typography.Text style={{ whiteSpace: "nowrap" }}>
            {t("plans.fields.yield_name", "Land")}
          </Typography.Text>
        }
        dataIndex="yield_name"
        render={(value: string) => (
          <Typography.Text
            style={{
              whiteSpace: "nowrap",
            }}
          >
            {value}
          </Typography.Text>
        )}
        filterIcon={(filtered) => (
          <SearchOutlined style={{ color: filtered ? token.colorPrimary : undefined }} />
        )}
        defaultFilteredValue={getDefaultFilter("yield_name", filters, "contains")}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Input placeholder={t("plans.filter.yield_name.placeholder")} />
          </FilterDropdown>
        )}
      />
      <Table.Column
        title={
          <Typography.Text style={{ whiteSpace: "nowrap" }}>
            {t("plans.fields.expert_name", "Expert")}
          </Typography.Text>
        }
        dataIndex="expert_name"
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
        title={
          <Typography.Text style={{ whiteSpace: "nowrap" }}>
            {t("plans.fields.description.label", "Description")}
          </Typography.Text>
        }
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
        title={
          <Typography.Text style={{ whiteSpace: "nowrap" }}>
            {t("plans.fields.status", "Status")}
          </Typography.Text>
        }
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
              <Select.Option value="Complete">{t("plans.status.complete")}</Select.Option>
              <Select.Option value="Cancel">{t("plans.status.cancel")}</Select.Option>
            </Select>
          </FilterDropdown>
        )}
        render={(value: string) => (
          <Tag color={getStatusColor(value)}>{t(`plans.status.${value.toLowerCase()}`)}</Tag>
        )}
      />

      <Table.Column
        title={
          <Typography.Text style={{ whiteSpace: "nowrap" }}>
            {t("plans.fields.estimated_product.label", "Estimated Product")}
          </Typography.Text>
        }
        dataIndex="estimated_product"
        sorter
        defaultSortOrder={getDefaultSortOrder("estimated_product", sorters)}
        render={(value: number, record: IPlan) => (
          <NumberWithUnit value={value} unit={record.estimated_unit} />
        )}
      />

      <Table.Column
        title={
          <Typography.Text style={{ whiteSpace: "nowrap" }}>
            {t("plans.fields.date", "Dates")}
          </Typography.Text>
        }
        key="dates"
        render={(_, record: IPlan) => (
          <Typography.Text type="secondary" style={{ fontSize: "12px", whiteSpace: "nowrap" }}>
            {t("plans.fields.start_date.label")}: {dayjs(record.start_date).format("YYYY-MM-DD")} |{" "}
            {t("plans.fields.end_date.label")}: {dayjs(record.end_date).format("YYYY-MM-DD")}
          </Typography.Text>
        )}
      />

      <Table.Column<IPlan>
        fixed="right"
        title={
          <Typography.Text style={{ whiteSpace: "nowrap" }}>{t("table.actions")}</Typography.Text>
        }
        dataIndex="actions"
        key="actions"
        align="center"
        render={(_value, record) => {
          const hasActions = record.status === "Draft" || record.status === "Pending";
          if (!hasActions) return null;

          return (
            <div onClick={(e) => e.stopPropagation()}>
              <PlanActions
                record={record}
                onSuccess={() => {
                  invalidate({
                    resource: "plans",
                    invalidates: ["list"],
                  });
                }}
              />
            </div>
          );
        }}
      />
    </Table>
  );
};
