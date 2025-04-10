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
import { Table, Space, Radio, Button, Breadcrumb, Typography, TableProps } from "antd";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { ProblemTypeTag } from "./type-tag";
import { ProblemStatusTag } from "./status-tag";
import { IProblem } from "@/interfaces";

type TableProblemProps = {
  data: IProblem[];
  showNavigation?: string;
  planIds: number[];
  loading: boolean;
};
export const ProblemListTable = ({
  children,
  data,
  showNavigation,
  planIds,
  loading,
}: PropsWithChildren & TableProblemProps) => {
  const { id } = useParams();
  const translate = useTranslate();
  const navigate = useNavigate();

  return (
    <>
      <Typography.Title level={4} style={{ marginBottom: 16 }}>
        {translate("problem.list", "Danh sách vấn đề phụ trách")}
      </Typography.Title>
      <Table
        loading={loading}
        dataSource={data}
        pagination={{
          pageSize: 10,
        }}
        rowKey="id"
        scroll={{ x: "max-content" }}
      >
        <Table.Column
          dataIndex="id"
          title={translate("ID")}
          render={(value) => <TextField value={"#" + value} style={{ fontWeight: "bold" }} />}
        />
        <Table.Column dataIndex="problem_name" title={translate("problem_name", "Tên vấn đề")} />
        <Table.Column dataIndex="farmer_name" title={translate("farmer_name", "Tên nông dân")} />
        <Table.Column dataIndex="plan_name" title={translate("plan_name", "Tên kế hoạch")} />
        <Table.Column
          dataIndex="created_date"
          title={translate("problem.created_date", "Ngày phát sinh")}
          render={(value) => <DateField format="DD/MM/YYYY" value={value} />}
        />

        <Table.Column
          dataIndex="status"
          title={translate("problem.status", "Trạng thái")}
          render={(value) => <ProblemStatusTag status={value} />}
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
                    showNavigation ? showNavigation + `/${record.id}` : `/problems/${record.id}`,
                  )
                }
              />
            </Space>
          )}
        />
      </Table>

      {children}
    </>
  );
};
