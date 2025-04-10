import React, { PropsWithChildren } from "react";
import { BaseRecord, useBack, useGetIdentity, useList, useTranslate } from "@refinedev/core";
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
import { ProductionStatus } from "../packaging/list";
import { IIdentity } from "@/interfaces";

export const HarvestingProductList = ({ children }: PropsWithChildren) => {
  const back = useBack();
  const navigate = useNavigate();
  const { data: user } = useGetIdentity<IIdentity>();
  const { data: planData, isLoading: planLoading } = useList({
    resource: `plans`,
    filters: [
      {
        field: "expert_id",
        operator: "eq",
        value: user?.id,
      },
    ],
  });
  const resources = "harvesting-product";
  const { data: harvestingProductData, isLoading: harvestingsProductLoading } = useList({
    resource: resources,
  });
  const products = harvestingProductData?.data?.filter((x) =>
    planData?.data?.some((item) => item.id === x.plan_id),
  );
  const translate = useTranslate();

  return (
    <>
      <Table
        dataSource={products}
        loading={harvestingsProductLoading || planLoading}
        pagination={{
          pageSize: 10,
        }}
        rowKey="id"
        scroll={{ x: "max-content" }}
      >
        <Table.Column
          dataIndex="harvesting_task_id"
          title={translate("ID")}
          render={(value) => <TextField value={"#" + value} style={{ fontWeight: "bold" }} />}
        />
        <Table.Column dataIndex="plan_name" title={translate("plan_name", "Tên kế hoạch")} />
        <Table.Column dataIndex="plant_name" title={translate("plant_name", "Cây trồng")} />
        <Table.Column
          dataIndex="harvesting_date"
          title={translate("harvesting_date", "Ngày thu hoạch")}
          render={(value) => <DateField format="hh:mm DD/MM/YYYY" value={value} />}
        />
        <Table.Column
          dataIndex="available_harvesting_quantity"
          title={translate("available_harvesting_quantity", "Sản lượng còn lại")}
          render={(value) => <TextField value={value ? value + " kg" : "Chưa thu hoạch"} />}
        />
        <Table.Column
          dataIndex="expired_date"
          title={translate("expired_date", "Ngày hết hạn")}
          render={(value) => (
            <DateField format="hh:mm DD/MM/YYYY" value={value ? value : "Chưa tính toán"} />
          )}
        />
        <Table.Column
          dataIndex="status"
          title={translate("harvesting_product.status", "Trạng thái")}
          render={(value) => <ProductionStatus status={value} />}
        />

        <Table.Column
          fixed="right"
          title={translate("table.actions")}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <ShowButton
                hideText
                size="small"
                onClick={() => {
                  navigate(`${record.harvesting_task_id}`);
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
