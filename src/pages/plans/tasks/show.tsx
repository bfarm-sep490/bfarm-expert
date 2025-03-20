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
import { CaringListTable } from "../../../components/caring-task/list-table";
import { HarvestedTaskList } from "../../../components/harvesting-task/list-table";
import { CaringTaskListInPlan } from "./caring-list";
import { HarvestingTaskListInPlan } from "./harvesting-list";
import { PackagingTaskListInPlan } from "./packaging-list";


export const ShowTasksList = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const isHarvestingTask = location.pathname.includes("harvesting-task");
  const isProductingTask = location.pathname.includes("caring-task");
  const isPackagingTask = location.pathname.includes("packaging-task");

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
        <Typography.Title level={3}>Danh sách công việc của kế hoạch #{id}</Typography.Title>
        <Flex justify="space-between" align="center">
          <Space>
            <Radio.Group
              defaultValue={
                isHarvestingTask ? "harvesting" : isPackagingTask ? "packaging" : "caring"
              }
              onChange={(e) => {
                navigate(`/plans/${id}/${e.target.value}-tasks`);
              }}
            >
              <Radio.Button value="caring">Chăm sóc</Radio.Button>
              <Radio.Button value="harvesting">Thu hoạch</Radio.Button>
              <Radio.Button value="packaging">Đóng gói</Radio.Button>
            </Radio.Group>
          </Space>
          <Button
            icon={<PlusSquareOutlined />}
            type="primary"
            onClick={() => {
              if (isProductingTask) navigate(`/plans/${id}/caring-tasks/create`);

              if (isHarvestingTask) navigate(`/plans/${id}/harvesting-tasks/create`);

              if (isPackagingTask) navigate(`/plans/${id}/packaging-tasks/create`);
            }}
          >
            Tạo mới
          </Button>
        </Flex>
        {isProductingTask ? (
          <CaringTaskListInPlan />
        ) : isHarvestingTask ? (
          <HarvestingTaskListInPlan />
        ) : (
          <PackagingTaskListInPlan />
        )}
        {children}
      </div>
    </>
  );
};
