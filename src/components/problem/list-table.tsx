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
import { ProblemTypeTag } from "./type-tag";
import { ProblemStatusTag } from "./status-tag";

type TableProblemProps = {
  tableProps: TableProps;
  showNavigation?: string;
};
export const ProblemListTable = ({
  children,
  tableProps,
  showNavigation,
}: PropsWithChildren & TableProblemProps) => {
  const { id } = useParams();
  const translate = useTranslate();

  const navigate = useNavigate();

  return (
    <>
      <List>
        <Table {...tableProps} rowKey="id" scroll={{ x: "max-content" }}>
          <Table.Column
            dataIndex="id"
            title={translate("ID")}
            render={(value) => <TextField value={"#" + value} style={{ fontWeight: "bold" }} />}
          />
          <Table.Column dataIndex="problem_name" title={translate("name")} />
          <Table.Column
            dataIndex="created_date"
            title={"Ngày phát sinh"}
            render={(value) => <DateField format="DD/MM/YYYY" value={value} />}
          />

          <Table.Column
            dataIndex="status"
            title={"status"}
            render={(value) => <ProblemStatusTag status={value} />}
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
                        : `/problems/${record.id}`
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
