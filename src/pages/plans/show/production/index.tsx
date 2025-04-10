import React, { PropsWithChildren } from "react";
import { useBack, useTranslate } from "@refinedev/core";
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
import { Table, Space, Radio, Button, Breadcrumb, Flex, Typography } from "antd";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { ArrowLeftOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { PackagedProductListInPlan } from "./packaging/list";
import { HarvestingProductionListInPlan } from "./harvesting/list";

export const ShowProductList = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const isPackagedProduct = location.pathname.includes("packaged-products");
  const isHarvestingProduct = location.pathname.includes("harvesting-products");

  return (
    <>
      <Button
        type="text"
        style={{ width: "40px", height: "40px" }}
        onClick={() => navigate(`/plans/${id}`)}
      >
        <ArrowLeftOutlined style={{ width: "50px", height: "50px" }} />
      </Button>
      <div>
        <Typography.Title level={3}>Sản phẩm của kế hoạch #{id}</Typography.Title>
        <Flex justify="space-between" align="center">
          <Space>
            <Radio.Group
              defaultValue={isPackagedProduct ? "packaged-products" : "harvesting-products"}
              onChange={(e) => {
                navigate(`/plans/${id}/${e.target.value}`);
              }}
            >
              <Radio.Button value="harvesting-products">Thu hoạch</Radio.Button>
              <Radio.Button value="packaged-products">Đóng gói</Radio.Button>
            </Radio.Group>
          </Space>
        </Flex>
        {isPackagedProduct ? <PackagedProductListInPlan /> : <HarvestingProductionListInPlan />}
        {children}
      </div>
    </>
  );
};
