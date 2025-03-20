import { DateField } from "@refinedev/antd";
import { Card, FormProps, Select, Table, Tabs } from "antd";
import { ColumnsType } from "antd/es/table";
import { inspect } from "util";
import { CaringTypeTag } from "../../../components/caring-task/type-tag";

type Props = {
  formProps: FormProps;
  chosenFarmers: any[];
  productiveTasks: any[];
  harvestingTasks: any[];
  inspectingTasks: any[];
  setChosenFarmers(value: any[]): void;
  setProductiveTasks(value: any[]): void;
  setHarvestingTasks(value: any[]): void;
  inspectors: any[];
  setInspectingTasks(value: any): void;
  packagingTasks: any[];
  setPackagingTasks(value: any): void;
};
export const AssignTasks = ({
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
}: Props) => {
  const column_productive = [
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
      render: (text: any, record: any) => (
        <DateField value={record?.start_date} format="DD/MM/YYYY" />
      ),
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (text: any, record: any) => (
        <DateField value={record?.end_date} format="DD/MM/YYYY" />
      ),
    },
    {
      title: "Loại chăm sóc",
      dataIndex: "task_type",
      key: "type",
      render: (text: any, record: any) => <CaringTypeTag status={record?.task_type} />,
    },
    {
      title: "Lựa chọn nông dân",
      key: "farmer_id",
      dataIndex: "farmer_id",
      fixed: "left",
      render: (text: any, record: any) => (
        <Select
          key={record.farmer_id}
          value={record?.farmer_id || ""}
          onChange={(value: any) => {
            const newProductiveTasks = productiveTasks.map((task: any) => {
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
          {chosenFarmers.map((farmer: any) => (
            <Select.Option key={farmer.id} value={farmer.id}>
              {farmer.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
  ];
  const column_packaging = [
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
      render: (text: any, record: any) => (
        <DateField value={record?.start_date} format="DD/MM/YYYY" />
      ),
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (text: any, record: any) => (
        <DateField value={record?.end_date} format="DD/MM/YYYY" />
      ),
    },
    {
      title: "Lựa chọn nông dân",
      key: "farmer_id",
      dataIndex: "farmer_id",
      fixed: "left",
      render: (text: any, record: any) => (
        <Select
          key={record.farmer_id}
          value={record?.farmer_id || ""}
          onChange={(value: any) => {
            const newPackagingTasks = packagingTasks.map((task: any) => {
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
          {chosenFarmers.map((farmer: any) => (
            <Select.Option key={farmer.id} value={farmer.id}>
              {farmer.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
  ];
  const column_harvesting = [
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
      render: (text: any, record: any) => (
        <DateField value={record?.start_date} format="DD/MM/YYYY" />
      ),
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (text: any, record: any) => (
        <DateField value={record?.end_date} format="DD/MM/YYYY" />
      ),
    },
    {
      title: "Lựa chọn nông dân",
      fixed: "left",
      key: "farmer_id",
      dataIndex: "farmer_id",
      render: (text: any, record: any) => (
        <Select
          key={record.id}
          value={record?.farmer_id || ""}
          onChange={(value) => {
            const newHarvestingTask = harvestingTasks.map((task: any) => {
              if (record.id === task.id) {
                return {
                  ...task,
                  farmer_id: value,
                };
              }
              return task;
            });
            setHarvestingTasks(newHarvestingTask);
            console.log(productiveTasks);
          }}
          style={{ width: "150px" }}
        >
          {chosenFarmers.map((chosenFarmer: any) => (
            <Select.Option key={chosenFarmer.id} value={chosenFarmer.id}>
              {chosenFarmer.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
  ];
  const column_inspecting = [
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
      render: (text: any, record: any) => (
        <DateField value={record?.start_date} format="DD/MM/YYYY" />
      ),
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (text: any, record: any) => (
        <DateField value={record?.end_date} format="DD/MM/YYYY" />
      ),
    },
    {
      title: "Lựa chọn nhà kiểm định",
      fixed: "left",
      key: "inspector_id",
      dataIndex: "inspector_id",
      render: (text: any, record: any) => (
        <Select
          key={record.id}
          value={record?.inspector_id || ""}
          onChange={(value) => {
            const newInspectingTasks = inspectingTasks.map((task: any) => {
              if (task?.id === record?.id) {
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
          {inspectors.map((inspector: any) => (
            <Select.Option key={inspector.id} value={inspector.id}>
              {inspector.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
  ];

  return (
    <Card title="Phân bổ công việc" style={{ minHeight: "600px" }}>
      <Tabs defaultActiveKey={"1"} tabPosition={"left"} style={{ minHeight: 220 }}>
        <Tabs.TabPane key="1" tab="Chăm sóc">
          <Table
            pagination={{
              pageSize: 10,
            }}
            columns={column_productive as ColumnsType<any>}
            dataSource={productiveTasks}
            rowKey="id"
            scroll={{ x: "max-content" }}
          ></Table>
        </Tabs.TabPane>
        <Tabs.TabPane key="2" tab="Thu hoạch">
          <Table
            pagination={{
              pageSize: 10,
            }}
            columns={column_harvesting as ColumnsType<any>}
            dataSource={harvestingTasks}
            rowKey="id"
            scroll={{ x: "max-content" }}
          ></Table>
        </Tabs.TabPane>
        <Tabs.TabPane key="3" tab="Kiểm định">
          <Table
            pagination={{
              pageSize: 10,
            }}
            columns={column_inspecting as ColumnsType<any>}
            dataSource={inspectingTasks}
            rowKey="id"
            scroll={{ x: "max-content" }}
          ></Table>
        </Tabs.TabPane>
        <Tabs.TabPane key="4" tab="Đóng gói">
          <Table
            pagination={{
              pageSize: 10,
            }}
            columns={column_packaging as ColumnsType<any>}
            dataSource={packagingTasks}
            rowKey="id"
            scroll={{ x: "max-content" }}
          ></Table>
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};
