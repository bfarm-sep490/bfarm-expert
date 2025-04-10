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
type HarvestingTableProps = {
  tableProps: TableProps<BaseRecord>;
  showNavigation?: string;
};

export const HarvestedTaskList = ({
  children,
  tableProps,
  showNavigation,
}: PropsWithChildren & HarvestingTableProps) => {
  const back = useBack();
  const navigate = useNavigate();
  const translate = useTranslate();
  const { id } = useParams();
  const { data: planData } = useList({
    resource: "plans",
  });
  const plans = planData?.data || [];

  const { data: farmerData } = useList({
    resource: "farmers",
  });
  const farmers = farmerData?.data || [];
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
            title={translate("harvesting_task.task_name", "Tên công việc")}
          />
          <Table.Column
            dataIndex="start_date"
            title={translate("harvesting_task.start_date", "Thời gian bắt đầu")}
            render={(value) => <DateField format="hh:mm DD/MM/YYYY" value={value} />}
          />
          <Table.Column
            dataIndex="end_date"
            title={translate("harvesting_task.end_date", "Thời gian kết thúc")}
            render={(value) => <DateField format="hh:mm DD/MM/YYYY" value={value} />}
          />
          <Table.Column
            dataIndex="harvested_quantity"
            title={translate("harvesting_task.harvested_quantity", "Sản lượng thu hoạch")}
            render={(value) => <TextField value={value ? value + " kg" : "Chưa thu hoạch"} />}
          />

          <Table.Column
            dataIndex="status"
            title={translate("harvesting_task.status", "Trạng thái")}
            render={(value) => <StatusTag status={value} />}
          />
          <Table.Column
            title={translate("harvesting_task.farmer_name", "Tên nông dân")}
            dataIndex="farmer_id"
            render={(value) => {
              const farmer = farmers.find((x) => x.id === value);
              return <TextField value={farmer ? farmer.name : "Không xác định được nông dân"} />;
            }}
          />
          <Table.Column
            title={translate("harvesting_task.plan_name", "Tên kế hoạch")}
            dataIndex="plan_id"
            render={(value) => {
              const plan = plans.find((x) => x.id === value);
              return <TextField value={plan ? plan.plan_name : "Không xác định được kế hoạch"} />;
            }}
          />
          <Table.Column
            title={translate("harvesting_task.created_at", "Ngày tạo")}
            dataIndex="created_at"
            render={(value) => <DateField format="DD/MM/YYYY" value={value} />}
          />
          <Table.Column
            title={translate("harvesting_task.updated_at", "Ngày cập nhập")}
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
                        : `/harvesting-tasks/${record.id}`,
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
