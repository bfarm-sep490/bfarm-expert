import { useForm } from "@refinedev/antd";
import { useList, useOne } from "@refinedev/core";
import { Button, Flex, Modal, Spin, theme } from "antd";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { AssignTasks } from "../../assign-tasks-sections";

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
  packaging_tasks: {
    task_id: number;
    farmer_id: number;
    status: string;
  }[];
  status: string;
  inspecting_forms: {
    task_id: number;
    inspector_id: number;
    status: string;
  }[];
}
interface FreeFarmer {
  id: number;
  name: string;
  list_schedule: {
    start_date: string;
    end_date: string;
  }[];
}
type AssignTaskModalProps = {
  open?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  refetch?: () => void;
  planId?: number;
  type?: string;
  problemId?: number;
  isOnlyAddTaskSign?: boolean;
  api?: any;
};

export const AssignTaskModal = (props: AssignTaskModalProps) => {
  const { id } = useParams();
  const [current, setCurrent] = React.useState<number>(0);
  const [productiveTasks, setProductiveTasks] = React.useState<any[]>([]);
  const [harvestingTasks, setHarvestingTasks] = React.useState<any[]>([]);
  const [inspectingTasks, setInspectingTasks] = React.useState<any[]>([]);
  const [inspectors, setInspectors] = React.useState<any[]>([]);
  const [chosenFarmers, setChosenFarmers] = React.useState<any[]>([]);
  const [packagingTasks, setPackagingTasks] = React.useState<any[]>([]);
  const [farmerSchedule, setFarmerSchedule] = React.useState<FreeFarmer[]>([]);
  const { formProps, formLoading, onFinish } = useForm<GainingPlan>({
    resource: "plans",
    id: `${props?.planId}/tasks-assign`,
    action: "edit",
    queryOptions: {
      enabled: false,
    },
    redirect: false,
    updateMutationOptions: {
      onSuccess: (data) => {
        props?.api?.success({
          message: "Cập nhật thành công",
        });
        props?.refetch?.();
        props?.onClose?.();
      },
      onError: (error) => {
        props?.api?.error({
          message: "Cập nhật thất bại",
          description: error.message,
        });
      },
    },
  });

  const { data: generalData, isLoading: generalLoading } = useOne({
    resource: "plans",
    id: `${props?.planId}/general`,
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
          inspecting_forms: [],
          harvesting_tasks: [],
          packaging_tasks: [],
          farmers: [],
        });
      },
    },
  });

  const {
    data: queryResult,
    isLoading: planLoading,
    refetch: planRefetch,
  } = useOne({
    resource: "plans",
    id: `${props?.planId || id}/general`,
  });

  const {
    data: chosenFarmerData,
    isLoading: chosenFarmerLoading,
    refetch: chosenFarmerRefetch,
  } = useList({
    resource: `plans/${props?.planId || id}/farmers`,
    queryOptions: {
      cacheTime: 60000,
      onSuccess(data: any) {
        setChosenFarmers(data?.data || []);
      },
    },
  });

  const {
    data: inspectorsData,
    isLoading: inspectorLoading,
    refetch: inspectorRefetch,
  } = useList({
    resource: "inspectors",
    queryOptions: {
      cacheTime: 60000,
      onSuccess(data: any) {
        setInspectors(data?.data || []);
      },
    },
  });

  const {
    data: CaringTaskData,
    isLoading: caringLoading,
    refetch: caringRefetch,
  } = useList({
    resource: "caring-tasks",
    filters: [
      {
        field: "plan_id",
        operator: "eq",
        value: props?.planId || id,
      },
      {
        field: "status_list",
        operator: "eq",
        value: ["Draft"],
      },
    ],
    queryOptions: {
      onSuccess(data: any) {
        if (props?.problemId)
          setProductiveTasks(
            data?.data.filter((task: any) => task?.problem_id === props?.problemId) || [],
          );
        else setProductiveTasks(data?.data || []);
      },
    },
  });

  const {
    data: PackagingTaskData,
    isLoading: packagingLoading,
    refetch: packagingRefetch,
  } = useList({
    resource: "packaging-tasks",
    filters: [
      {
        field: "plan_id",
        operator: "eq",
        value: props?.planId || id,
      },
      {
        field: "status",
        operator: "eq",
        value: ["Draft"],
      },
    ],
    queryOptions: {
      onSuccess(data: any) {
        if (!props?.problemId) setPackagingTasks(data?.data || []);
      },
    },
  });

  const {
    data: HarvestingTaskData,
    isLoading: harvestingLoading,
    refetch: harvestingRefetch,
  } = useList({
    resource: "harvesting-tasks",
    filters: [
      {
        field: "plan_id",
        operator: "eq",
        value: props?.planId || id,
      },
      {
        field: "status",
        operator: "eq",
        value: ["Draft"],
      },
    ],
    queryOptions: {
      onSuccess(data: any) {
        if (!props?.problemId) setHarvestingTasks(data?.data || []);
      },
    },
  });

  const {
    data: InspectingTaskData,
    isLoading: inspectingLoading,
    refetch: inspectingFormRefetch,
  } = useList({
    resource: "inspecting-forms",
    filters: [
      {
        field: "plan_id",
        operator: "eq",
        value: props?.planId || id,
      },
      {
        field: "status",
        operator: "eq",
        value: ["Draft"],
      },
    ],
    queryOptions: {
      onSuccess(data: any) {
        if (!props?.problemId) setInspectingTasks(data?.data || []);
      },
    },
  });
  const {
    data: scheduleData,
    isLoading: scheduleLoading,
    refetch: scheduleRefetch,
  } = useList({
    resource: `plans/${id}/busy-farmers`,
    errorNotification: false,
    filters: [
      {
        field: "start",
        operator: "eq",
        value: generalData?.data?.start_date,
      },
      {
        field: "end",
        operator: "eq",
        value: generalData?.data?.end_date,
      },
    ],
    queryOptions: {
      enabled: generalData?.data !== null,
      onSuccess(data: any) {
        setFarmerSchedule(data?.data || []);
      },
    },
  });
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
      formProps.form?.setFieldValue("status", queryResult?.data?.status);

      await onFinish();
      props?.refetch?.();
      props?.onClose?.();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  const [loadingForm, setLoadingForm] = useState(true);

  useEffect(() => {
    if (
      planLoading === false &&
      chosenFarmerLoading === false &&
      caringLoading === false &&
      harvestingLoading === false &&
      inspectingLoading === false &&
      packagingLoading === false &&
      inspectorLoading === false &&
      scheduleLoading === false &&
      formLoading === false
    ) {
      setLoadingForm(false);
    }
  }, [
    planLoading,
    chosenFarmerLoading,
    caringLoading,
    harvestingLoading,
    inspectingLoading,
    packagingLoading,
    inspectorLoading,
    scheduleLoading,
    formLoading,
  ]);

  useEffect(() => {
    if (props?.open === false) {
      setCurrent(0);
      setProductiveTasks([]);
      setHarvestingTasks([]);
      setInspectingTasks([]);
      setInspectors([]);
      setChosenFarmers([]);
      setPackagingTasks([]);
      setFarmerSchedule([]);
      formProps.form?.resetFields();
    } else {
      planRefetch();
      chosenFarmerRefetch();
      caringRefetch();
      harvestingRefetch();
      inspectingFormRefetch();
      packagingRefetch();
      inspectorRefetch();
      scheduleRefetch();
    }
  }, [props?.open]);

  const steps = [
    {
      title: "1",
      content: (
        <>
          <AssignTasks
            schedule={farmerSchedule}
            type="Draft"
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
  ];

  return (
    <Modal
      loading={loading}
      width={"60%"}
      height={"40%"}
      open={props?.open}
      onCancel={props?.onClose}
      title={"Phân công công việc"}
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
            {current < steps.length - 1 && (
              <Button
                type="primary"
                onClick={() => {
                  next();
                }}
              >
                Next
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button
                type="primary"
                onClick={() => {
                  handleDone(props?.type ? props?.type : "Ongoing");
                }}
                loading={loading}
              >
                Hoàn thành
              </Button>
            )}
          </Flex>
        </>
      }
    >
      <Spin spinning={loadingForm}>
        <div style={contentStyle}>{steps[current].content}</div>
      </Spin>
    </Modal>
  );
};
