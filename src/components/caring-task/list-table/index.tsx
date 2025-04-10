import React, { PropsWithChildren } from "react";
import { BaseRecord, useBack, useList, useTranslate } from "@refinedev/core";
import { List, ShowButton, DateField, TextField } from "@refinedev/antd";
import { Table, Space, TableProps } from "antd";
import { useLocation, useNavigate, useParams } from "react-router";
import { CaringTypeTag } from "../type-tag";
import { StatusTag } from "../status-tag";

type CaringTableProps = {
  tableProps: TableProps<BaseRecord>;
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
          <Table.Column
            dataIndex="task_name"
            title={translate("caring_task.task_name", "Tên công việc")}
          />
          <Table.Column
            dataIndex="start_date"
            title={translate("caring_task.start_date", "Ngày bắt đầu")}
            render={(value) => <DateField format="DD/MM/YYYY" value={value} />}
          />
          <Table.Column
            dataIndex="end_date"
            title={translate("caring_task.end_date", " Ngày kết thúc")}
            render={(value) => <DateField format="DD/MM/YYYY" value={value} />}
          />
          <Table.Column
            dataIndex="task_type"
            title={translate("caring_task.task_type", "Loại công việc")}
            render={(value) => <CaringTypeTag status={value} />}
          />
          <Table.Column
            dataIndex="status"
            title={translate("caring_task.status", "Trạng thái")}
            render={(value) => <StatusTag status={value} />}
          />
          <Table.Column
            title={translate("caring_task.farmer_name", "Tên nông dân")}
            dataIndex="farmer_id"
            render={(value) => {
              const farmer = farmers.find((x) => x.id === value);
              return <TextField value={farmer ? farmer.name : "Không xác định được nông dân"} />;
            }}
          />
          <Table.Column
            title={translate("caring_task.plan_name", "Tên kế hoạch")}
            dataIndex="plan_id"
            render={(value) => {
              const plan = plans.find((x) => x.id === value);
              return <TextField value={plan ? plan.plan_name : "Không xác định được kế hoạch"} />;
            }}
          />
          <Table.Column
            title={translate("caring_task.create_at", "Ngày tạo")}
            dataIndex="create_at"
            render={(value) => <DateField format="DD/MM/YYYY" value={value} />}
          />
          <Table.Column
            title={translate("caring_task.update_at", "Ngày cập nhập")}
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
