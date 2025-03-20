import { Avatar, Button, Card, Checkbox, Modal, Table } from "antd";
import { FormProps } from "antd/lib";
import React from "react";

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

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

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
      ),
    },
  ];
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
        <Modal title="Chọn nông dân" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <Table dataSource={farmers} columns={farm_modals_columns}></Table>
        </Modal>
      </Card>
    </>
  );
};
