import React, { useMemo } from "react";
import { useTable } from "@refinedev/antd";
import { getDefaultFilter, type HttpError, useGo } from "@refinedev/core";
import { Table, InputNumber, Typography, theme } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { PaginationTotal } from "@/components/paginationTotal";
import { IInspectingForm } from "@/interfaces";
import { InspectionStatusTag } from "../status";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

export const InspectionListTable: React.FC = () => {
  const { token } = theme.useToken();
  const go = useGo();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { tableProps, filters, setFilters } = useTable<IInspectingForm, HttpError>({
    resource: "inspecting-forms",
    filters: {
      initial: [
        { field: "id", operator: "eq", value: "" },
        { field: "task_type", operator: "contains", value: "" },
      ],
    },
  });

  const filteredData = useMemo(() => {
    return (tableProps.dataSource || []).filter(
      (item) => item.status === "Ongoing" || item.status === "Complete",
    );
  }, [tableProps.dataSource]);

  return (
    <Table
      {...tableProps}
      dataSource={filteredData}
      rowKey="id"
      scroll={{ x: true }}
      pagination={{
        ...tableProps.pagination,
        showTotal: (total) => <PaginationTotal total={total} entityName="inspections" />,
      }}
      onRow={(record) => ({
        onClick: () => {
          if (record.id) {
            navigate(`/inspection-forms/${record.id}`);
          }
        },
      })}
      rowHoverable
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
            placeholder={t("inspections.search_id")}
            onChange={(value) => setFilters([{ field: "id", operator: "eq", value }])}
          />
        )}
        render={(value) => <Typography.Text>{`#${value}`}</Typography.Text>}
      />

      <Table.Column title={t("inspections.plan_name")} dataIndex="plan_name" key="plan_name" />
      <Table.Column title={t("inspections.task_name")} dataIndex="task_name" key="task_name" />
      <Table.Column
        title={t("inspections.inspector_name")}
        dataIndex="inspector_name"
        key="inspector_name"
      />
      <Table.Column
        title={t("inspections.start_date")}
        dataIndex="start_date"
        key="start_date"
        render={(value: string) => dayjs(value).format("DD/MM/YYYY HH:mm")}
      />
      <Table.Column
        title={t("inspections.end_date")}
        dataIndex="end_date"
        key="end_date"
        render={(value: string) => dayjs(value).format("DD/MM/YYYY HH:mm")}
      />
      <Table.Column
        title={t("inspections.status")}
        dataIndex="status"
        key="status"
        render={(status) => <InspectionStatusTag value={status} />}
      />
    </Table>
  );
};
