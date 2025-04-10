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
  TextField,
} from "@refinedev/antd";
import { Table, Space, Radio, Button, Breadcrumb, Typography, TableProps } from "antd";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { StatusTag } from "../../caring-task/status-tag";
type PackagingTableProps = {
  tableProps: TableProps<BaseRecord>;
  showNavigation?: string;
};

export const PackagingTaskList = ({
  children,
  tableProps,
  showNavigation,
}: PropsWithChildren & PackagingTableProps) => {
  const back = useBack();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: planData } = useList({
    resource: "plans",
  });
  const plans = planData?.data || [];

  const { data: farmerData } = useList({
    resource: "farmers",
  });
  const farmers = farmerData?.data || [];
  console.log(farmers);
  const translate = useTranslate();

  return (
    <>
      <List>
        <Table {...tableProps} rowKey="id" scroll={{ x: "max-content" }}>
          <Table.Column
            dataIndex="id"
            title={translate("ID")}
            render={(value) => <TextField value={"#" + value} style={{ fontWeight: "bold" }} />}
          />
          <Table.Column
            dataIndex="task_name"
            title={translate("packaging_task.task_name", "Tên công việc")}
          />
          <Table.Column
            dataIndex="start_date"
            title={translate("packaging_task.start_date", "Thời gian bắt đầu")}
            render={(value) => <DateField format="hh:mm DD/MM/YYYY" value={value} />}
          />
          <Table.Column
            dataIndex="end_date"
            title={translate("packaging_task.end_date", "Thời gian kết thúc")}
            render={(value) => <DateField format="hh:mm DD/MM/YYYY" value={value} />}
          />
          <Table.Column
            dataIndex="packed_quantity"
            title={translate("packaging_task.packed_quantity", "Số lượng đóng gói")}
            render={(value) => <TextField value={value ? value : "Chưa thu hoạch"} />}
          />
          <Table.Column
            dataIndex="packed_unit"
            title={translate("packaging_task.packed_unit", "Đơn vị đóng gói")}
            render={(value) => <TextField value={value ? value : "Chưa thu hoạch"} />}
          />
          <Table.Column
            dataIndex="status"
            title={translate("packaging_task.status", "Trạng thái")}
            render={(value) => <StatusTag status={value} />}
          />
          <Table.Column
            title={translate("packaging_task.farmer_name", "Tên nông dân")}
            dataIndex="farmer_id"
            render={(value) => {
              const farmer = farmers.find((x) => x.id === value);
              return <TextField value={farmer ? farmer.name : "Không xác định được nông dân"} />;
            }}
          />
          <Table.Column
            title={translate("packaging_task.plan_name", "Tên kế hoạch")}
            dataIndex="plan_id"
            render={(value) => {
              const plan = plans.find((x) => x.id === value);
              return <TextField value={plan ? plan.plan_name : "Không xác định được kế hoạch"} />;
            }}
          />
          <Table.Column
            title={translate("packaging_task.created_at", "Ngày tạo")}
            dataIndex="created_at"
            render={(value) => <DateField format="DD/MM/YYYY" value={value} />}
          />
          <Table.Column
            title={translate("packaging_task.updated_at", "Ngày cập nhập")}
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
            title={translate("table.actions", "Hành động")}
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
                        : `/packaging-tasks/${record.id}`,
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
