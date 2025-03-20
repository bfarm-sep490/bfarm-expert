import React, { PropsWithChildren } from "react";
import { BaseRecord, useBack, useList, useTranslate } from "@refinedev/core";
import {
  useTable,
  List,
  EditButton,
  ShowButton,
  ImageField,
  TagField,
  EmailField,
  DateField,
  Title,
  TextField,
} from "@refinedev/antd";
import { Table, Space, Radio, Button, Breadcrumb, TableProps } from "antd";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Typography } from "antd/lib";
import { CaringTypeTag } from "../type-tag";
import { StatusTag } from "../status-tag";

type CaringTableProps = {
  tableProps: TableProps;
  showNavigation?: string;
};

export const CaringListTable = ({
  children,
  tableProps,
  showNavigation,
}: PropsWithChildren & CaringTableProps) => {
  const back = useBack();
  const navigate = useNavigate();
  const { id } = useParams();
  const translate = useTranslate();
  const { data: planData } = useList({
    resource: "plans",
  });
  const plans = planData?.data || [];

  const { data: farmerData } = useList({
    resource: "farmers",
  });
  const farmers = farmerData?.data || [];
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <>
      <List>
        <Table {...tableProps} rowKey="id" scroll={{ x: "max-content" }}>
          <Table.Column
            dataIndex="id"
            title={translate("ID")}
            render={(value) => <TextField value={"#" + value} style={{ fontWeight: "bold" }} />}
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
            dataIndex="task_type"
            title={translate("type")}
            render={(value) => <CaringTypeTag status={value} />}
          />
          <Table.Column
            dataIndex="status"
            title={"status"}
            render={(value) => <StatusTag status={value} />}
          />
          <Table.Column
            title={translate("farmer_id")}
            dataIndex="farmer_id"
            render={(value) => {
              const farmer = farmers.find((x) => x.id === value);
              return <TextField value={farmer ? farmer.name : "Không xác định được nông dân"} />;
            }}
          />
          <Table.Column
            title={translate("plan_id")}
            dataIndex="plan_id"
            render={(value) => {
              const plan = plans.find((x) => x.id === value);
              return <TextField value={plan ? plan.plan_name : "Không xác định được kế hoạch"} />;
            }}
          />
          <Table.Column
            title={translate("create_at")}
            dataIndex="create_at"
            render={(value) => <DateField format="DD/MM/YYYY" value={value} />}
          />
          <Table.Column
            title={translate("update_at")}
            dataIndex="update_at"
            render={(value) =>
              value ? (
                <DateField format="DD/MM/YYYY" value={value} />
              ) : (
                <TextField value={"Chưa cập nhập"} />
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
                        : `caring-tasks/${record.id}`,
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
