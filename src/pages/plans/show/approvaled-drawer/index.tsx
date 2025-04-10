import axios from "axios";
import { DateField, TextField, useForm } from "@refinedev/antd";
import { useBack, useList, useOne, useShow } from "@refinedev/core";
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
  Input,
  Modal,
  Row,
  Select,
  Space,
  Spin,
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
import { VerifyPlanInformation } from "./verify";
import { InputGeneralPlan } from "./input-general";
import { ChooseFarmers } from "./choose-farmers";
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

export const ApprovingPlanDrawer = () => {
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

  const { formProps, formLoading, onFinish } = useForm<GainingPlan>({
    resource: "plans",
    id: `${id}/tasks-assign`,
    action: "edit",
    queryOptions: {
      enabled: false,
    },
  });
  const { data: generalData, isLoading: generalLoading } = useOne({
    resource: "plans",
    id: `${id}/general`,
    queryOptions: {
      onSuccess(data: any) {
        const plan = data?.data;
        formProps?.form?.setFieldsValue({
          description: data.description,
          end_date: plan.end_date,
          plant_id: plan.plant_information.plant_id,
          yield_id: plan.yield_information.yield_id,
          estimated_product: plan.estimated_product,
          plan_name: plan.plan_name,
          expert_id: plan.expert_information.expert_id,
          start_date: plan.start_date,
          estimated_unit: plan.estimated_unit,
          caring_tasks: [],
          inspecting_forms: [],
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
      cacheTime: 60000,
      onSuccess(data: any) {
        setChosenFarmers(data?.data || []);
      },
    },
  });
  const { data: farmerData, isLoading: farmerLoading } = useList({
    resource: `farmers`,
    queryOptions: {
      cacheTime: 60000,
      onSuccess(data: any) {
        setFarmers(data?.data || []);
      },
    },
  });

  const { data: expertsData, isLoading: expertLoading } = useList({
    resource: `experts`,

    queryOptions: {
      cacheTime: 60000,
      onSuccess(data: any) {
        setExperts(data?.data || []);
      },
    },
  });

  const { data: yieldsData, isLoading: yieldLoading } = useList({
    resource: "yields",

    queryOptions: {
      cacheTime: 60000,
      onSuccess(data: any) {
        setYields(data?.data || []);
      },
    },
  });
  const { data: plantData, isLoading: plantLoading } = useList({
    resource: "plants",

    queryOptions: {
      cacheTime: 60000,
      onSuccess(data: any) {
        setPlants(data?.data || []);
      },
    },
  });
  const { data: inspectorsData, isLoading: inspectorLoading } = useList({
    resource: "inspectors",

    queryOptions: {
      cacheTime: 60000,
      onSuccess(data: any) {
        setInspectors(data?.data || []);
      },
    },
  });
  const { data: CaringTaskData, isLoading: caringLoading } = useList({
    resource: "caring-tasks",
    filters: [
      {
        field: "plan_id",
        operator: "eq",
        value: id,
      },
      {
        field: "status",
        operator: "eq",
        value: "Pending",
      },
    ],
    queryOptions: {
      onSuccess(data: any) {
        setProductiveTasks(data?.data || []);
      },
    },
  });
  const { data: PackagingTaskData, isLoading: packagingLoading } = useList({
    resource: "packaging-tasks",
    filters: [
      {
        field: "plan_id",
        operator: "eq",
        value: id,
      },
      {
        field: "status",
        operator: "eq",
        value: "Pending",
      },
    ],
    queryOptions: {
      onSuccess(data: any) {
        setPackagingTasks(data?.data || []);
      },
    },
  });
  const { data: HarvestingTaskData, isLoading: harvestingLoading } = useList({
    resource: "harvesting-tasks",
    filters: [
      {
        field: "plan_id",
        operator: "eq",
        value: id,
      },
      {
        field: "status",
        operator: "eq",
        value: "Pending",
      },
    ],
    queryOptions: {
      onSuccess(data: any) {
        setHarvestingTasks(data?.data || []);
      },
    },
  });
  const { data: InspectingTaskData, isLoading: inspectingLoading } = useList({
    resource: "inspecting-forms",
    filters: [
      {
        field: "plan_id",
        operator: "eq",
        value: id,
      },
      {
        field: "status",
        operator: "eq",
        value: "Pending",
      },
    ],
    queryOptions: {
      onSuccess(data: any) {
        setInspectingTasks(data?.data || []);
      },
    },
  });

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
  const handleDone = async (type: string) => {
    try {
      setLoading(true);
      const caring_tasks = productiveTasks.map((task) => ({
        task_id: task.id,
        farmer_id: task.farmer_id,
        status: type,
      }));
      const harvesting_tasks = harvestingTasks.map((task) => ({
        task_id: task.id,
        farmer_id: task.farmer_id,
        status: type,
      }));
      const inspecting_forms = inspectingTasks.map((task) => ({
        task_id: task.id,
        inspector_id: task.inspector_id,
        status: type,
      }));
      const packaging_tasks = packagingTasks.map((task) => ({
        task_id: task.id,
        farmer_id: task.farmer_id,
        status: type,
      }));
      formProps.form?.setFieldValue("caring_tasks", caring_tasks);
      formProps.form?.setFieldValue("harvesting_tasks", harvesting_tasks);
      formProps.form?.setFieldValue("inspecting_forms", inspecting_forms);
      formProps.form?.setFieldValue("packaging_tasks", packaging_tasks);
      formProps.form?.setFieldValue("status", type);
      await onFinish();
    } catch (error) {
      console.error("Error:", error);
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
            task.id,
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
            task.id,
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
            task.id,
        );
        return false;
      }
    }
    return true;
  };
  const [loadingForm, setLoadingForm] = useState(true);
  useEffect(() => {
    if (
      queryResult?.isLoading === false &&
      plantLoading === false &&
      yieldLoading === false &&
      expertLoading === false &&
      farmerLoading === false &&
      chosenFarmerLoading === false &&
      caringLoading === false &&
      harvestingLoading === false &&
      inspectingLoading === false &&
      packagingLoading === false &&
      inspectorLoading === false &&
      formLoading === false
    ) {
      setLoadingForm(false);
    }
  }, [
    queryResult?.isLoading,
    plantLoading,
    yieldLoading,
    expertLoading,
    farmerLoading,
    chosenFarmerLoading,
    caringLoading,
    harvestingLoading,
    inspectingLoading,
    packagingLoading,
    inspectorLoading,
    formLoading,
  ]);

  const steps = [
    {
      title: "1",
      content: (
        <InputGeneralPlan experts={experts} yields={yields} plants={plants} formProps={formProps} />
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
            loading={loading}
            saveHandle={handleDone}
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
  return (
    <Drawer
      loading={loadingForm}
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
              <Button loading={loading} style={{ margin: "0 8px" }} onClick={() => prev()}>
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
              <Button type="primary" onClick={() => handleDone("Ongoing")} loading={loading}>
                Done
              </Button>
            )}
          </Flex>
        </>
      }
    >
      <Spin spinning={loadingForm}>
        <div style={contentStyle}>{steps[current].content}</div>
      </Spin>
    </Drawer>
  );
};
