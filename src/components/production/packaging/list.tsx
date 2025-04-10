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
import { Table, Space, Radio, Button, Breadcrumb, Typography, TableProps, Tag } from "antd";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { StatusTag } from "../../caring-task/status-tag";

export const PackagedProductList = ({ children }: PropsWithChildren) => {
  const back = useBack();
  const navigate = useNavigate();
  const { id } = useParams();

  const { tableProps } = useTable({
    resource: `packaging-products`,
    filters: {
      initial: [
        {
          field: "plan_id",
          operator: "eq",
          value: id ?? "",
        },
      ],
    },
  });

  const translate = useTranslate();

  return (
    <>
      <Table {...tableProps} rowKey="id" scroll={{ x: "max-content" }}>
        <Table.Column
          dataIndex="id"
          title={translate("ID")}
          render={(value) => <TextField value={"#" + value} style={{ fontWeight: "bold" }} />}
        />
        <Table.Column dataIndex="plan_name" title={translate("plan_name", "Tên kế hoạch")} />

        <Table.Column
          dataIndex="plant_name"
          title={translate("plant_name", "Tên cây trồng")}
          render={(value) => <TextField value={value ? value : "Chưa thu hoạch"} />}
        />
        <Table.Column
          dataIndex="packaging_date"
          title={translate("packaging_date", "Ngày đóng gói")}
          render={(value) => <DateField format="hh:mm DD/MM/YYYY" value={value} />}
        />
        <Table.Column
          dataIndex="quantity_per_pack"
          title={translate("quantity_per_pack", "Số lượng mỗi gói")}
          render={(value) => <TextField value={value ? value + " kg" : "Chưa thu hoạch"} />}
        />

        <Table.Column
          dataIndex="pack_quantity"
          title={translate("pack_quantity", "Số lượng gói còn lại")}
          render={(value) => <TextField value={value ? value : "Chưa thu hoạch"} />}
        />
        <Table.Column
          dataIndex="expired_date"
          title={translate("expired_date", "Ngày hết hạn")}
          render={(value) => (
            <DateField format="hh:mm DD/MM/YYYY" value={value ? value : "Chưa thu hoạch"} />
          )}
        />
        <Table.Column
          dataIndex="status"
          title={translate("packaging_product.status", "Trạng thái")}
          render={(value) => <ProductionStatus status={value} />}
        />

        <Table.Column
          fixed="right"
          title={translate("table.actions")}
          dataIndex="id"
          render={(_, record: BaseRecord) => (
            <Space>
              <ShowButton
                hideText
                size="small"
                onClick={() => {
                  navigate(`${record.id}`);
                }}
              />
            </Space>
          )}
        />
      </Table>

      {children}
    </>
  );
};

const getStatusTagColor = (value: string) => {
  switch (value) {
    case "Active":
      return "green";
    case "Inactive":
      return "orange";
    case "Expired":
      return "red";
  }
};

const getStatusTagValue = (value: string) => {
  switch (value) {
    case "Active":
      return "Còn hàng";
    case "Inactive":
      return "Hết hàng";
    case "Expired":
      return "Hết hạn";
  }
};
type ProductionStatusProps = {
  status: string;
};
export const ProductionStatus = ({ status }: ProductionStatusProps) => {
  return <Tag color={getStatusTagColor(status)}> {getStatusTagValue(status)}</Tag>;
};
