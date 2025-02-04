import React, { PropsWithChildren } from "react";
import { BaseRecord, useTranslate } from "@refinedev/core";
import {
  useTable,
  List,
  EditButton,
  ShowButton,
  ImageField,
  TagField,
  EmailField,
  DateField,
} from "@refinedev/antd";
import { Table, Space } from "antd";

export const FarmerManagementList = ({ children }: PropsWithChildren) => {
  const translate = useTranslate();
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  return (
    <>
      <List>
        <Table {...tableProps} rowKey="id">
          <Table.Column
            dataIndex="Name"
            title={translate("farmer-management.fields.Name")}
          />
          <Table.Column
            dataIndex="Phone"
            title={translate("farmer-management.fields.Phone")}
          />
          <Table.Column
            dataIndex="Account"
            title={translate("farmer-management.fields.Account")}
          />
          <Table.Column
            dataIndex="Password"
            title={translate("farmer-management.fields.Password")}
          />
          <Table.Column
            dataIndex={["Avatar"]}
            title={translate("farmer-management.fields.Avatar")}
            render={(value: any) => (
              <ImageField style={{ maxWidth: "100px" }} value={value} />
            )}
          />
          <Table.Column
            dataIndex={["Email"]}
            title={translate("farmer-management.fields.Email")}
            render={(value: any) => <EmailField value={value} />}
          />
          <Table.Column
            dataIndex="Status"
            title={translate("farmer-management.fields.Status")}
          />
          <Table.Column
            dataIndex="CCCD"
            title={translate("farmer-management.fields.CCCD")}
          />
          <Table.Column
            dataIndex="DeviceNo"
            title={translate("farmer-management.fields.DeviceNo")}
          />
          <Table.Column
            dataIndex="Address"
            title={translate("farmer-management.fields.Address")}
          />
          <Table.Column
            dataIndex={["CreatedAt"]}
            title={translate("farmer-management.fields.CreatedAt")}
            render={(value: any) => <DateField value={value} />}
          />
          <Table.Column
            title={translate("table.actions")}
            dataIndex="actions"
            render={(_, record: BaseRecord) => (
              <Space>
                <EditButton hideText size="small" recordItemId={record.id} />
                <ShowButton hideText size="small" recordItemId={record.id} />
              </Space>
            )}
          />
        </Table>
      </List>
      {children}
    </>
  );
};
