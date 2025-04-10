import { FarmerScheduleComponent } from "@/components/plan/detail/scheduler/farmer-task-scheduler";
import { ShowButton } from "@refinedev/antd";
import { useCustom } from "@refinedev/core";
import {
  Avatar,
  Button,
  Calendar,
  Card,
  Checkbox,
  Divider,
  Flex,
  Input,
  Modal,
  Space,
  Spin,
  Table,
  Typography,
} from "antd";
import { FormProps } from "antd/lib";
import React, { useEffect } from "react";

type Props = {
  formProps: FormProps;
  chosenFarmers: any[];
  farmers: any[];
  setChosenFarmers(value: any): void;
  productiveTasks: any[];
  setProductiveTasks(value: any): void;
  harvestingTasks: any[];
  setHarvestingTasks(value: any): void;
  inspectingTasks: any[];
  setInspectingTasks(value: any): void;
  packagingTasks: any[];
  setPackagingTasks(value: any): void;
};
export const ChooseFarmers = ({
  formProps,
  chosenFarmers,
  farmers,
  setChosenFarmers,
  productiveTasks,
  setProductiveTasks,
  harvestingTasks,
  setHarvestingTasks,
  inspectingTasks,
  setInspectingTasks,
  packagingTasks,
  setPackagingTasks,
}: Props) => {
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [events, setEvents] = React.useState<any[]>([]);
  const [selectFarmer, setSelectFarmer] = React.useState<number>(0);
  const [search, setSearch] = React.useState<string>("");
  const showModal = () => {
    setIsModalOpen(true);
  };
  const [filteredFarmers, setFilteredFarmers] = React.useState<any[]>([]);

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleSelect = async (value: number) => {
    setSelectFarmer(value);
    refetch();
  };
  const { refetch, isLoading } = useCustom({
    url: `https://api.outfit4rent.online/api/farmers/${selectFarmer}/calendar`,
    method: "get",
    queryOptions: {
      enabled: false,
      onSuccess: (data) => {
        setEvents(
          data?.data?.map((x: any) => {
            return {
              title: x.task_type,
              start: x.start_date,
              end: x.end_date,
              status: x.status,
            };
          }) || [],
        );
      },
    },
  });
  const farm_columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Ảnh nông dân",
      dataIndex: "avatar",
      key: "avatar",
      render: (text: any, record: any) => <Avatar src={record?.avatar}></Avatar>,
    },
    {
      title: "Tên nông dân",
      dataIndex: "name",
      key: "name",
    },
  ];
  const farm_modals_columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Ảnh nông dân",
      dataIndex: "avatar",
      key: "avatar",
      render: (text: any, record: any) => <Avatar src={record?.avatar}></Avatar>,
    },
    {
      title: "Tên nông dân",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Chọn",
      key: "action",
      render: (text: any, record: any) => (
        <Flex vertical={true}>
          <Checkbox
            checked={chosenFarmers?.find((farmer: any) => farmer.id === record.id) || false}
            onChange={(e) => {
              if (e.target.checked) {
                setChosenFarmers([...chosenFarmers, { ...record }]);
              } else {
                setChosenFarmers(chosenFarmers.filter((farmer: any) => farmer.id !== record.id));
                const newProductiveTask = productiveTasks.map((task: any) => {
                  if (task?.farmer_id && task?.farmer_id === record?.id) {
                    return {
                      ...task,
                      farmer_id: null,
                    };
                  }
                  return task;
                });
                setProductiveTasks(newProductiveTask);
                const newHarvestingTask = harvestingTasks.map((task: any) => {
                  if (task?.farmer_id && task?.farmer_id === record?.id) {
                    return {
                      ...task,
                      farmer_id: null,
                    };
                  }
                  return task;
                });
                setHarvestingTasks(newHarvestingTask);

                const newPackagingTask = packagingTasks.map((task: any) => {
                  if (task?.farmer_id && task?.farmer_id === record?.id) {
                    return {
                      ...task,
                      farmer_id: null,
                    };
                  }
                  return task;
                });
                setPackagingTasks(newPackagingTask);
              }
            }}
          ></Checkbox>
          <Space>
            <Button size="small" onClick={() => handleSelect(record.id)}>
              Xem lịch
            </Button>
          </Space>
        </Flex>
      ),
    },
  ];
  useEffect(() => {
    setFilteredFarmers(farmers.filter((farmer) => farmer.name.includes(search)));
  }, [search, farmers]);

  return (
    <>
      <Card
        style={{ minHeight: "600px" }}
        title="Lựa chọn nông dân"
        extra={
          <>
            <Button type="primary" color="primary" onClick={showModal}>
              Thay đổi nông dân tham gia
            </Button>
          </>
        }
      >
        <Table columns={farm_columns} dataSource={chosenFarmers} rowKey="id"></Table>
        <Modal
          width={1000}
          height={600}
          title="Chọn nông dân"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Flex vertical={true} gap={10}>
            <Input
              type="text"
              placeholder="Tìm kiếm tên nông dân"
              onChange={(e) => {
                e.preventDefault();
                setSearch(e.target.value);
              }}
            ></Input>
            <Table
              pagination={{
                pageSize: 5,
              }}
              dataSource={filteredFarmers}
              columns={farm_modals_columns}
            ></Table>
          </Flex>
          <Divider></Divider>
          {isLoading && !selectFarmer && <Spin></Spin>}
          {selectFarmer && (
            <>
              <Typography.Title level={4}>
                Lịch sử công việc của nông dân #{selectFarmer}
              </Typography.Title>
              <FarmerScheduleComponent
                events={events}
                isLoading={isLoading}
                start_date={formProps?.form?.getFieldValue("start_date")}
                end_date={formProps?.form?.getFieldValue("end_date")}
              />
            </>
          )}
        </Modal>
      </Card>
    </>
  );
};
