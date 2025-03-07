import React, { PropsWithChildren } from "react";
import { BaseRecord, useBack, useTranslate } from "@refinedev/core";
import {
  useTable,
  List,
  EditButton,
  ShowButton,
  ImageField,
  TagField,
  EmailField,
  DateField,
  TextField,
} from "@refinedev/antd";
import {
  Table,
  Space,
  Radio,
  Button,
  Breadcrumb,
  Typography,
  TableProps,
} from "antd";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { StatusTag } from "../../caring-task/status-tag";
type PackagingTableProps = {
  tableProps: TableProps;
  showNavigation?: string;
};

export const PakagingTaskList = ({
  children,
  tableProps,
  showNavigation,
}: PropsWithChildren & PackagingTableProps) => {
  const back = useBack();
  const navigate = useNavigate();
  const { id } = useParams();

  const translate = useTranslate();

  return (
    <>
      <List>
        <Table {...tableProps} rowKey="id" scroll={{ x: "max-content" }}>
          <Table.Column
            dataIndex="id"
            title={translate("ID")}
            render={(value) => (
              <TextField value={"#" + value} style={{ fontWeight: "bold" }} />
            )}
          />
          <Table.Column dataIndex="task_name" title={translate("name")} />
          <Table.Column
            dataIndex="start_date"
            title={translate("start_date")}
            render={(value) => <DateField format="DD/MM/YYYY" value={value} />}
          />
          <Table.Column
            dataIndex="end_date"
            title={translate("end_date")}
            render={(value) => <DateField format="DD/MM/YYYY" value={value} />}
          />
          <Table.Column
            dataIndex="packed_quantity"
            title={"packed_quantity"}
            render={(value) => (
              <TextField value={value ? value : "Chưa thu hoạch"} />
            )}
          />
          <Table.Column
            dataIndex="packed_unit"
            title={"packed_unit"}
            render={(value) => (
              <TextField value={value ? value : "Chưa thu hoạch"} />
            )}
          />
          <Table.Column
            dataIndex="status"
            title={"status"}
            render={(value) => <StatusTag status={value} />}
          />
          <Table.Column title={translate("farmer_id")} dataIndex="farmer_id" />
          <Table.Column title={translate("plan_id")} dataIndex="plan_id" />
          <Table.Column
            title={translate("created_at")}
            dataIndex="created_at"
            render={(value) => <DateField format="DD/MM/YYYY" value={value} />}
          />
          <Table.Column
            title={translate("updated_at")}
            dataIndex="updated_at"
            render={(value) =>
              value ? (
                <DateField format="DD/MM/YYYY" value={value} />
              ) : (
                <TextField value={"Chưa cập nhập lần nào"} />
              )
            }
          />

          <Table.Column
            title={translate("table.actions")}
            dataIndex="actions"
            render={(_, record: BaseRecord) => (
              <Space>
                <ShowButton
                  hideText
                  size="small"
                  onClick={() =>
                    navigate(
                      showNavigation
                        ? showNavigation + `/${record.id}`
                        : `/packaging-tasks/${record.id}`
                    )
                  }
                />
              </Space>
            )}
          />
        </Table>
      </List>

      {children}
    </>
  );
};
