import React from "react";
import { BaseRecord, useGo, useTranslate } from "@refinedev/core";
import {
  useTable,
  List,
  ShowButton,
  TagField,
  DateField,
  EditButton,
  TextField,
} from "@refinedev/antd";
import { Table, Space } from "antd";
import { StatusTag } from "../../components/caring-task/status-tag";
export const PlanList = () => {
  const translate = useTranslate();

  const { tableProps } = useTable({
    resource: "plans",
    syncWithLocation: true,
    queryOptions: {
      staleTime: 1000 * 60,
      cacheTime: 1000 * 60,
    },
  });
  const go = useGo();

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="id"
          title={translate("plans.fields.id")}
          render={(value, record) => {
            return <TextField style={{ fontWeight: "bold" }} value={`#${value}`} />;
          }}
        />
        <Table.Column dataIndex="plan_name" title={translate("plans.fields.name")} />
        <Table.Column dataIndex={"plant_name"} title={translate("plans.fields.plant_name")} />
        <Table.Column
          dataIndex="yield_name"
          title={translate("plans.fields.yield_name")}
          render={(value) => <TagField value={value} key={value} />}
        />
        <Table.Column
          dataIndex={["start_date"]}
          title={translate("plans.fields.start_date")}
          render={(value: any) => <DateField value={value} />}
        />
        <Table.Column
          dataIndex="status"
          title={translate("plans.fields.status")}
          render={(value: any) => <StatusTag status={value} />}
        />
        <Table.Column
          dataIndex="expert_name"
          title={translate("plans.fields.expert_name")}
          render={(value) => <TagField value={value} key={value} />}
        />
        <Table.Column
          dataIndex={["created_at"]}
          title={translate("plans.fields.created_at")}
          render={(value: any) => <DateField value={value} />}
        />
        <Table.Column
          dataIndex={["updated_at"]}
          title={translate("plans.fields.updated_at")}
          render={(value: any) => {
            return value ? <DateField value={value} /> : <TextField value="Chưa cập nhập" />;
          }}
        />
        <Table.Column
          title={translate("table.actions")}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <ShowButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
