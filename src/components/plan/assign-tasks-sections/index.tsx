import { DateField } from "@refinedev/antd";
import {
  Button,
  Card,
  Flex,
  FormProps,
  notification,
  Select,
  Table,
  Tabs,
  Tooltip,
  Typography,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { CaringTypeTag } from "../../../components/caring-task/type-tag";
import React, { use, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useParams } from "react-router";
import { useCustom, useCustomMutation, useOne, useUpdate } from "@refinedev/core";
import { FileSearchOutlined, QuestionCircleOutlined } from "@ant-design/icons";

interface Task {
  id: number;
  task_name: string;
  start_date: string;
  end_date: string;
  task_type?: string;
}

interface ProductiveTask extends Task {
  farmer_id?: number;
  task_type: string;
}

interface HarvestingTask extends Task {
  farmer_id?: number;
}

interface PackagingTask extends Task {
  farmer_id?: number;
}

interface InspectingTask extends Task {
  inspector_id?: number;
}

interface Farmer {
  id: number;
  name: string;
}

interface Inspector {
  id: number;
  name: string;
}

type Props = {
  schedule?: any[];
  formProps: FormProps;
  chosenFarmers: Farmer[];
  productiveTasks: ProductiveTask[];
  harvestingTasks: HarvestingTask[];
  inspectingTasks: InspectingTask[];
  setChosenFarmers(value: Farmer[]): void;
  setProductiveTasks(value: ProductiveTask[]): void;
  setHarvestingTasks(value: HarvestingTask[]): void;
  inspectors: Inspector[];
  setInspectingTasks(value: InspectingTask[]): void;
  packagingTasks: PackagingTask[];
  setPackagingTasks(value: PackagingTask[]): void;
  saveHandle(value: string): void;
  loading: boolean;
  type?: string;
};

export const AssignTasks = ({
  schedule,
  chosenFarmers,
  formProps,
  harvestingTasks,
  inspectingTasks,
  packagingTasks,
  productiveTasks,
  setHarvestingTasks,
  setInspectingTasks,
  setPackagingTasks,
  setProductiveTasks,
  inspectors,
  saveHandle,
  loading,
  type,
}: Props) => {
  const isOverlappingPeriod = (
    start1: string,
    end1: string,
    start2: string,
    end2: string,
  ): boolean => {
    const s1 = new Date(start1).getTime();
    const e1 = new Date(end1).getTime();
    const s2 = new Date(start2).getTime();
    const e2 = new Date(end2).getTime();

    return s1 < e2 && e1 > s2;
  };

  const filterAvailableFarmers = (
    record: ProductiveTask | HarvestingTask | PackagingTask,
    chosenFarmers: Farmer[],
    chosenSchedule: any[],
  ): Farmer[] => {
    return chosenFarmers?.filter((farmer) => {
      if (record?.farmer_id === farmer.id) return true;
      const farmerSchedule = chosenSchedule?.find((s) => s?.id === farmer?.id);
      if (farmerSchedule?.list_schedule?.length === 0) return true;
      console.log("farmerSchedule", farmerSchedule);
      const availableSchedule = farmerSchedule?.list_schedule?.some(
        (schedule: any) =>
          new Date(schedule?.start_date) <= new Date(record?.start_date) &&
          new Date(schedule?.end_date) >= new Date(record?.end_date),
      );

      const isTaskOverlapping = [...productiveTasks, ...harvestingTasks, ...packagingTasks].some(
        (task) =>
          task?.farmer_id === farmer.id &&
          isOverlappingPeriod(
            task?.start_date,
            task?.end_date,
            record?.start_date,
            record?.end_date,
          ),
      );
      return !availableSchedule && !isTaskOverlapping;
    });
  };
  const { id } = useParams();
  console.log(schedule, "schedule");
  const {
    data: autoTaskData,
    isLoading: autoTaskLoading,
    refetch: autoTaskRefetch,
    isFetching: autoTaskFetching,
  } = useOne({
    resource: `plans`,
    id: `${id}/genarated-tasks?farmer_ids=${chosenFarmers?.map((x) => x.id).join("&farmer_ids=")}`,

    queryOptions: {
      enabled: false,
      onSuccess: (data) => {
        if (data?.data !== null && typeof data?.data === "string") {
          api.warning({
            message: "Vui lòng xem lại các nông dân đã chọn.",
            description: data?.data as unknown as string,
            duration: 2,
          });
        } else {
          api.success({
            message: "Tạo công việc thành công.",
            duration: 2,
          });
          setProductiveTasks(
            productiveTasks.map((task) => {
              const newTask = data?.data?.caringTasks?.find(
                (x: any) => x?.caringTaskId === task.id,
              );
              if (newTask) {
                return {
                  ...task,
                  farmer_id: newTask?.farmerId,
                };
              }
              return task;
            }),
          );
          setHarvestingTasks(
            harvestingTasks.map((task) => {
              const newTask = data?.data?.harvestingTasks?.find(
                (x: any) => x?.harvestingTaskId === task.id,
              );
              if (newTask) {
                return {
                  ...task,
                  farmer_id: newTask?.farmerId,
                };
              }
              return task;
            }),
          );
          setPackagingTasks(
            packagingTasks.map((task) => {
              const newTask = data?.data?.packagingTasks?.find(
                (x: any) => x?.packagingTaskId === task.id,
              );
              if (newTask) {
                return {
                  ...task,
                  farmer_id: newTask?.farmerId,
                };
              }
              return task;
            }),
          );
        }
      },
    },
  });
  const [api, contextHolder] = notification.useNotification();

  const column_productive: ColumnsType<ProductiveTask> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên công việc",
      dataIndex: "task_name",
      key: "name",
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
      render: (_, record) => <DateField value={record.start_date} format="hh:mm DD/MM/YYYY" />,
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (_, record) => <DateField value={record.end_date} format="hh:mm DD/MM/YYYY" />,
    },
    {
      title: "Loại chăm sóc",
      dataIndex: "task_type",
      key: "type",
      render: (_, record) => (
        <CaringTypeTag
          status={
            record.task_type as
              | "Planting"
              | "Nurturing"
              | "Watering"
              | "Fertilizing"
              | "Setup"
              | "Pesticide"
              | "Weeding"
              | "Pruning"
          }
        />
      ),
    },
    {
      title: "Lựa chọn nông dân",
      key: "farmer_id",
      dataIndex: "farmer_id",
      fixed: "left",
      render: (_, record) => (
        <Select
          key={record.id}
          value={record.farmer_id || undefined}
          onChange={(value: number) => {
            const newProductiveTasks = productiveTasks.map((task) => {
              if (record.id === task.id) {
                return {
                  ...task,
                  farmer_id: value,
                };
              }
              return task;
            });
            setProductiveTasks(newProductiveTasks);
          }}
          style={{ width: "150px" }}
        >
          {filterAvailableFarmers(record, chosenFarmers, schedule as [])?.map((farmer) => (
            <Select.Option key={farmer?.id} value={farmer.id}>
              {farmer?.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
  ];

  const column_packaging: ColumnsType<PackagingTask> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên công việc",
      dataIndex: "task_name",
      key: "name",
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
      render: (_, record) => <DateField value={record.start_date} format="hh:mm DD/MM/YYYY" />,
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (_, record) => <DateField value={record.end_date} format="hh:mm DD/MM/YYYY" />,
    },
    {
      title: "Lựa chọn nông dân",
      key: "farmer_id",
      dataIndex: "farmer_id",
      fixed: "left",
      render: (_, record) => (
        <Select
          key={record.id}
          value={record.farmer_id || undefined}
          onChange={(value: number) => {
            const newPackagingTasks = packagingTasks.map((task) => {
              if (record.id === task.id) {
                return {
                  ...task,
                  farmer_id: value,
                };
              }
              return task;
            });
            setPackagingTasks(newPackagingTasks);
          }}
          style={{ width: "150px" }}
        >
          {filterAvailableFarmers(record, chosenFarmers, schedule as [])?.map((farmer) => (
            <Select.Option key={farmer.id} value={farmer.id}>
              {farmer.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
  ];

  const column_harvesting: ColumnsType<HarvestingTask> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên thu hoạch",
      dataIndex: "task_name",
      key: "task_name",
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "start_date",
      key: "startDate",
      render: (_, record) => <DateField value={record.start_date} format="hh:mm DD/MM/YYYY" />,
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (_, record) => <DateField value={record.end_date} format="hh:mm DD/MM/YYYY" />,
    },
    {
      title: "Lựa chọn nông dân",
      fixed: "left",
      key: "farmer_id",
      dataIndex: "farmer_id",
      render: (_, record) => (
        <Select
          key={record.id}
          value={record.farmer_id || undefined}
          onChange={(value: number) => {
            const newHarvestingTask = harvestingTasks.map((task) => {
              if (record.id === task.id) {
                return {
                  ...task,
                  farmer_id: value,
                };
              }
              return task;
            });
            setHarvestingTasks(newHarvestingTask);
          }}
          style={{ width: "150px" }}
        >
          {filterAvailableFarmers(record, chosenFarmers, schedule as [])?.map((farmer) => (
            <Select.Option key={farmer.id} value={farmer.id}>
              {farmer.name}
            </Select.Option>
          ))}
          ss
        </Select>
      ),
    },
  ];

  const column_inspecting: ColumnsType<InspectingTask> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên công việc",
      dataIndex: "task_name",
      key: "name",
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
      render: (_, record) => <DateField value={record.start_date} format="DD/MM/YYYY" />,
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (_, record) => <DateField value={record.end_date} format="DD/MM/YYYY" />,
    },
    {
      title: "Lựa chọn nhà kiểm định",
      fixed: "left",
      key: "inspector_id",
      dataIndex: "inspector_id",
      render: (_, record) => (
        <Select
          key={record.id}
          value={record.inspector_id || undefined}
          onChange={(value: number) => {
            const newInspectingTasks = inspectingTasks.map((task) => {
              if (task.id === record.id) {
                return {
                  ...task,
                  inspector_id: value,
                };
              }
              return task;
            });
            setInspectingTasks([...newInspectingTasks]);
          }}
          style={{ width: "150px" }}
        >
          {inspectors.map((inspector) => (
            <Select.Option key={inspector.id} value={inspector.id}>
              {inspector.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
  ];
  const { mutate, isLoading } = useUpdate();

  const handleUpdate = () => {
    const values = formProps?.form?.getFieldsValue?.();
    mutate(
      {
        resource: "plans",
        id: `${id}/tasks-assign`,
        values: {
          description: formProps?.form?.getFieldValue("description"),
          end_date: formProps?.form?.getFieldValue("end_date"),
          plant_id: formProps?.form?.getFieldValue("plant_id"),
          yield_id: formProps?.form?.getFieldValue("yield_id"),
          estimated_product: formProps?.form?.getFieldValue("estimated_product"),
          plan_name: formProps?.form?.getFieldValue("plan_name"),
          expert_id: formProps?.form?.getFieldValue("expert_id"),
          start_date: formProps?.form?.getFieldValue("start_date"),
          estimated_unit: formProps?.form?.getFieldValue("estimated_unit"),
          status: type ? type : "Pending",
          farmers: chosenFarmers.map((x) => x.id),
          caring_tasks: productiveTasks
            ?.filter((x) => x.farmer_id !== null)
            ?.map((x) => {
              return {
                task_id: x.id,
                farmer_id: x.farmer_id,
                status: type ? type : "Pending",
              };
            }),
          harvesting_tasks: harvestingTasks
            ?.filter((x) => x.farmer_id !== null)
            ?.map((x) => {
              return {
                task_id: x.id,
                farmer_id: x.farmer_id,
                status: type ? type : "Pending",
              };
            }),
          packaging_tasks: packagingTasks
            ?.filter((x) => x.farmer_id !== null)
            ?.map((x) => {
              return {
                task_id: x.id,
                farmer_id: x.farmer_id,
                status: type ? type : "Pending",
              };
            }),
          inspecting_forms: inspectingTasks
            ?.filter((x) => x.inspector_id !== null)
            ?.map((x) => {
              return {
                task_id: x.id,
                inspector_id: x.inspector_id,
                status: type ? type : "Pending",
              };
            }),
        },
      },
      {
        onSuccess: (data) => {
          if (data?.data !== null)
            api.warning({
              message: data?.data as unknown as string,
              duration: 2,
            });
          else
            api.success({
              message: "Lưu thành công",
              duration: 2,
            });
        },
      },
    );
  };

  return (
    <>
      {contextHolder}

      <Flex justify="end" align="center" style={{ marginBottom: 20, marginTop: 20 }}>
        <Flex gap={10} style={{ marginLeft: 20 }}>
          <Tooltip
            placement="bottom"
            title={"Nút hỗ trợ lưu bản phân bố công việc nháp"}
            arrow={true}
          >
            <Button icon={<FileSearchOutlined />} loading={isLoading} onClick={handleUpdate}>
              Lưu
            </Button>
          </Tooltip>
          <Tooltip
            placement="bottom"
            title={"Tự động phân bố công việc cho nông dân với số lượng công việc bằng nhau"}
            arrow={true}
          >
            <Button
              icon={<QuestionCircleOutlined />}
              loading={autoTaskFetching && autoTaskLoading}
              type="primary"
              onClick={() => autoTaskRefetch()}
            >
              Tự động
            </Button>
          </Tooltip>
        </Flex>
      </Flex>
      <Tabs defaultActiveKey={"1"} tabPosition={"top"} style={{ minHeight: 220 }}>
        <Tabs.TabPane key="1" tab="Chăm sóc">
          <Table
            pagination={{
              pageSize: 10,
            }}
            columns={column_productive}
            dataSource={productiveTasks}
            rowKey="id"
            scroll={{ x: "max-content" }}
          />
        </Tabs.TabPane>
        <Tabs.TabPane key="2" tab="Thu hoạch">
          <Table
            pagination={{
              pageSize: 10,
            }}
            columns={column_harvesting}
            dataSource={harvestingTasks}
            rowKey="id"
            scroll={{ x: "max-content" }}
          />
        </Tabs.TabPane>
        <Tabs.TabPane key="3" tab="Kiểm định">
          <Table
            pagination={{
              pageSize: 10,
            }}
            columns={column_inspecting}
            dataSource={inspectingTasks}
            rowKey="id"
            scroll={{ x: "max-content" }}
          />
        </Tabs.TabPane>
        <Tabs.TabPane key="4" tab="Đóng gói">
          <Table
            pagination={{
              pageSize: 10,
            }}
            columns={column_packaging}
            dataSource={packagingTasks}
            rowKey="id"
            scroll={{ x: "max-content" }}
          />
        </Tabs.TabPane>
      </Tabs>
    </>
  );
};
