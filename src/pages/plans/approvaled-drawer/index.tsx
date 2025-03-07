import { Area } from "@ant-design/plots";
import axios from "axios";
import { DateField, TextField, useForm } from "@refinedev/antd";
import { useBack, useList, useShow } from "@refinedev/core";
import { useQueries, useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Drawer,
  Flex,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Steps,
  Table,
  Tabs,
  Tag,
  theme,
  Typography,
} from "antd";
import { DatePickerType } from "antd/es/date-picker";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { CaringTypeTag } from "../../../components/caring-task/type-tag";
import { VerifyPlanInformation } from "./verify";
import { InputGeneralPlan } from "./input-general";
import { ChooseFarmers } from "./choose-farmers";
import { set } from "lodash";
import { AssignTasks } from "./assign-tasks";

interface GainingPlan {
  plan_name: string;
  plant_id: number;
  expert_id: number;
  yield_id: number;
  description: string;
  start_date: any;
  end_date: any;
  estimated_product: number;
  estimated_unit: string;
  farmers: { id: number }[];
  caring_tasks: {
    task_id: number;
    farmer_id: number;
    status: string;
  }[];
  harvesting_tasks: {
    task_id: number;
    farmer_id: number;
    status: string;
  }[];

  inspecting_tasks: {
    task_id: number;
    inspector_id: number;
    status: string;
  }[];
}

export const ApprovalingPlanDrawer = () => {
  const { id } = useParams();
  const [current, setCurrent] = React.useState<number>(0);
  const [productiveTasks, setProductiveTasks] = React.useState<any[]>([]);
  const [harvestingTasks, setHarvestingTasks] = React.useState<any[]>([]);
  const [inspectingTasks, setInspectingTasks] = React.useState<any[]>([]);
  const [farmers, setFarmers] = React.useState<any[]>([]);
  const [inspectors, setInspectors] = React.useState<any[]>([]);
  const [chosenFarmers, setChosenFarmers] = React.useState<any[]>([]);
  const [plants, setPlants] = React.useState<any[]>([]);
  const [experts, setExperts] = React.useState<any[]>([]);
  const [yields, setYields] = React.useState<any[]>([]);
  const [packagingTasks, setPackagingTasks] = React.useState<any[]>([]);
  const { formProps, formLoading } = useForm<GainingPlan>({
    resource: "plans",
    id: `${id}/general`,
    action: "edit",
    queryOptions: {
      onSuccess(data: any) {
        const plan = data?.data;
        formProps?.form?.setFieldsValue({
          description: plan.description,
          end_date: plan.end_date,
          plant_id: plan.plant_information.plant_id,
          yield_id: plan.yield_information.yield_id,
          estimated_product: plan.estimated_product,
          plan_name: plan.plan_name,
          expert_id: plan.expert_information.expert_id,
          start_date: plan.start_date,
          estimated_unit: plan.estimated_unit,
          caring_tasks: [],
          inspecting_tasks: [],
          harvesting_tasks: [],
          farmers: [],
        });
      },
    },
  });

  const { query: queryResult } = useShow({
    resource: "plans",
    id: `${id}/general`,
  });

  const { data: chosenFarmerData, isLoading: chosenFarmerLoading } = useList({
    resource: `plans/${id}/farmers`,
    queryOptions: {
      staleTime: 60000,
      onSuccess(data: any) {
        setChosenFarmers(data?.data || []);
      },
    },
  });
  const { data: farmerData, isLoading: farmerLoading } = useList({
    resource: `farmers`,
    queryOptions: {
      staleTime: 60000,
      onSuccess(data: any) {
        setFarmers(data?.data || []);
      },
    },
  });

  const { data: expertsData, isLoading: expertLoading } = useList({
    resource: `experts`,

    queryOptions: {
      staleTime: 60000,
      onSuccess(data: any) {
        setExperts(data?.data || []);
      },
    },
  });

  const { data: yieldsData, isLoading: yieldLoading } = useList({
    resource: "yields",

    queryOptions: {
      staleTime: 60000,
      onSuccess(data: any) {
        setYields(data?.data || []);
      },
    },
  });
  const { data: plantData, isLoading: plantLoading } = useList({
    resource: "plants",

    queryOptions: {
      staleTime: 60000,
      onSuccess(data: any) {
        setPlants(data?.data || []);
      },
    },
  });
  const { data: inspectorsData } = useList({
    resource: "inspectors",

    queryOptions: {
      staleTime: 60000,
      onSuccess(data: any) {
        setInspectors(data?.data || []);
      },
    },
  });
  const { data: CaringTaskData } = useList({
    resource: "caring-tasks",
    filters: [
      {
        field: "plan_id",
        operator: "eq",
        value: id,
      },
    ],
    queryOptions: {
      onSuccess(data: any) {
        setProductiveTasks(data?.data || []);
      },
    },
  });
  const { data: PackagingTaskData } = useList({
    resource: "packaging-tasks",
    filters: [
      {
        field: "plan_id",
        operator: "eq",
        value: id,
      },
    ],
    queryOptions: {
      onSuccess(data: any) {
        setPackagingTasks(data?.data || []);
      },
    },
  });
  const { data: HarvestingTaskData } = useList({
    resource: "harvesting-tasks",
    filters: [
      {
        field: "plan_id",
        operator: "eq",
        value: id,
      },
    ],
    queryOptions: {
      onSuccess(data: any) {
        setHarvestingTasks(data?.data || []);
      },
    },
  });
  const { data: InspectingTaskData } = useList({
    resource: "inspecting-forms",
    filters: [
      {
        field: "plan_id",
        operator: "eq",
        value: id,
      },
    ],
    queryOptions: {
      onSuccess(data: any) {
        setInspectingTasks(data?.data || []);
      },
    },
  });

  const steps = [
    {
      title: "1",
      content: (
        <InputGeneralPlan
          experts={experts}
          yields={yields}
          plants={plants}
          formProps={formProps}
        />
      ),
    },
    {
      title: "2",
      content: (
        <>
          <ChooseFarmers
            farmers={farmers}
            productiveTasks={productiveTasks}
            setProductiveTasks={setProductiveTasks}
            harvestingTasks={harvestingTasks}
            setHarvestingTasks={setHarvestingTasks}
            inspectingTasks={inspectingTasks}
            setInspectingTasks={setInspectingTasks}
            formProps={formProps}
            chosenFarmers={chosenFarmers}
            setChosenFarmers={setChosenFarmers}
            packagingTasks={packagingTasks}
            setPackagingTasks={setPackagingTasks}
          />
        </>
      ),
    },
    {
      title: "3",
      content: (
        <>
          <AssignTasks
            chosenFarmers={chosenFarmers}
            productiveTasks={productiveTasks}
            harvestingTasks={harvestingTasks}
            inspectingTasks={inspectingTasks}
            setChosenFarmers={setChosenFarmers}
            setProductiveTasks={setProductiveTasks}
            setHarvestingTasks={setHarvestingTasks}
            inspectors={inspectors}
            setInspectingTasks={setInspectingTasks}
            formProps={formProps}
            packagingTasks={packagingTasks}
            setPackagingTasks={setPackagingTasks}
          />
        </>
      ),
    },
    {
      title: "4",
      content: (
        <>
          <VerifyPlanInformation
            plants={plants}
            yields={yields}
            formProps={formProps}
            experts={experts}
            productiveTasks={productiveTasks}
            harvestingTasks={harvestingTasks}
            inspectingTasks={inspectingTasks}
            inspectors={inspectors}
            farmers={farmers}
            packagingTasks={packagingTasks}
          />
        </>
      ),
    },
  ];
  const back = useBack();
  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };
  const { token } = theme.useToken();

  const contentStyle: React.CSSProperties = {
    color: token.colorTextTertiary,
    marginTop: 16,
  };
  const [loading, setLoading] = useState(false);
  const handleDone = async () => {
    try {
      setLoading(true);

      const response = await axios.put(
        `https://api.outfit4rent.online/api/plans/${id}/tasks-assign
`,
        {
          ...formProps?.form?.getFieldsValue(true),
          caring_tasks: productiveTasks.map((task) => ({
            task_id: task.id,
            farmer_id: task.farmer_id,
            status: "Ongoing",
          })),
          harvesting_tasks: harvestingTasks.map((task) => ({
            task_id: task.id,
            farmer_id: task.farmer_id,
            status: "Ongoing",
          })),
          inspecting_forms: inspectingTasks.map((task) => ({
            task_id: task.id,
            inspector_id: task.inspector_id,
            status: "Ongoing",
          })),
          packaging_tasks: packagingTasks.map((task) => ({
            task_id: task.id,
            farmer_id: task.farmer_id,
            status: "Ongoing",
          })),
          status: "Ongoing",
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Response:", response.data.data);

      back();
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setLoading(false);
    }
  };
  const validateAllTasks = () => {
    for (const task of productiveTasks) {
      if (!task.farmer_id) {
        alert(
          "Chưa chọn nông dân cho công việc chăm sóc cho công việc " +
            task.name +
            " #ID: " +
            task.id
        );
        return false;
      }
    }
    for (const task of harvestingTasks) {
      if (!task.farmer_id) {
        alert(
          "Chưa chọn nông dân cho công việc thu hoạch cho công việc " +
            task.name +
            " #ID: " +
            task.id
        );
        return false;
      }
    }
    for (const task of inspectingTasks) {
      if (!task.inspector_id) {
        alert(
          "Chưa chọn nhà kiểm định cho công việc kiểm định cho công việc " +
            task.name +
            " #ID: " +
            task.id
        );
        return false;
      }
    }
    return true;
  };
  return (
    <Drawer
      loading={
        loading &&
        queryResult?.isLoading &&
        plantLoading &&
        yieldLoading &&
        expertLoading &&
        farmerLoading &&
        chosenFarmerLoading &&
        formLoading
      }
      open
      title={
        <>
          <Steps
            style={{ marginTop: "20px" }}
            current={current}
            onChange={(value: any) => setCurrent(value)}
          >
            <Steps.Step key={1} title="Thông tin chung" />
            <Steps.Step key={2} title="Nông dân tham gia" />
            <Steps.Step key={3} title="Phân bổ công việc" />
            <Steps.Step key={4} title="Xác nhận" />
          </Steps>
        </>
      }
      width={"100%"}
      height={"100%"}
      onClose={back}
      footer={
        <>
          <Flex justify="end">
            {current > 0 && (
              <Button
                loading={loading}
                style={{ margin: "0 8px" }}
                onClick={() => prev()}
              >
                Previous
              </Button>
            )}
            {current < 3 && (
              <Button
                type="primary"
                onClick={() => {
                  if (current == 2) {
                    if (!validateAllTasks()) return;
                  }
                  next();
                }}
              >
                Next
              </Button>
            )}
            {current === 3 && (
              <Button type="primary" onClick={handleDone} loading={loading}>
                Done
              </Button>
            )}
          </Flex>
        </>
      }
    >
      <div style={contentStyle}>{steps[current].content}</div>
    </Drawer>
  );
};
