import { UseFormReturnType } from "@refinedev/antd";
import {
  Space,
  Button,
  Typography,
  Flex,
  Form,
  Input,
  DatePicker,
  Table,
  Modal,
  Tag,
  Tooltip,
  Popconfirm,
  Row,
  Col,
} from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { IPlant } from "@/interfaces";
import dayjs from "dayjs";
import { useState } from "react";
import { useTaskStore } from "@/store/task-store";

const { Text } = Typography;

interface InspectionTasksPanelProps {
  formProps: UseFormReturnType<IPlant>["formProps"];
  identity: { name: string } | undefined;
}

export const InspectionTasksPanel: React.FC<InspectionTasksPanelProps> = ({
  formProps,
  identity,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTaskIndex, setEditingTaskIndex] = useState<number | null>(null);
  const [form] = Form.useForm();
  const { incrementCount, decrementCount } = useTaskStore();

  const handleEditTask = (index: number) => {
    const currentTasks = formProps.form?.getFieldValue("inspecting_forms") || [];
    const taskToEdit = currentTasks[index];
    form.setFieldsValue(taskToEdit);
    setEditingTaskIndex(index);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const currentTasks = formProps.form?.getFieldValue("inspecting_forms") || [];
      const updatedTask = {
        ...values,
        created_by: identity?.name || "",
      };

      if (editingTaskIndex !== null) {
        currentTasks[editingTaskIndex] = updatedTask;
      } else {
        currentTasks.push(updatedTask);
        incrementCount("inspecting");
      }
      formProps.form?.setFieldsValue({ inspecting_forms: currentTasks });
      setIsModalVisible(false);
      setEditingTaskIndex(null);
      form.resetFields();
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingTaskIndex(null);
    form.resetFields();
  };

  const handleDeleteTask = (index: number) => {
    const currentTasks = formProps.form?.getFieldValue("inspecting_forms") || [];
    formProps.form?.setFieldsValue({
      inspecting_forms: currentTasks.filter((_: any, i: number) => i !== index),
    });
    decrementCount("inspecting");
  };

  const columns = [
    {
      title: "Tên công việc",
      dataIndex: "task_name",
      key: "task_name",
      sorter: (a: any, b: any) => a.task_name.localeCompare(b.task_name),
      filterSearch: true,
    },
    {
      title: "Người tạo",
      dataIndex: "created_by",
      key: "created_by",
      render: (createdBy: string) => <Tag color="blue">{createdBy}</Tag>,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
      render: (date: any) => dayjs(date).format("DD/MM/YYYY HH:mm"),
      sorter: (a: any, b: any) => dayjs(a.start_date).unix() - dayjs(b.start_date).unix(),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (date: any) => dayjs(date).format("DD/MM/YYYY HH:mm"),
      sorter: (a: any, b: any) => dayjs(a.end_date).unix() - dayjs(b.end_date).unix(),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: any, index: number) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button type="text" icon={<EditOutlined />} onClick={() => handleEditTask(index)} />
          </Tooltip>
          <Popconfirm
            title="Xóa công việc"
            description="Bạn có chắc chắn muốn xóa công việc này?"
            onConfirm={() => handleDeleteTask(index)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Flex justify="space-between" align="center">
        <Space direction="vertical" size="small">
          <Text strong style={{ fontSize: "16px" }}>
            Danh sách công việc kiểm tra
          </Text>
          <Text type="secondary">Quản lý các công việc kiểm tra sâu bệnh</Text>
        </Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            form.resetFields();
            setEditingTaskIndex(null);
            setIsModalVisible(true);
          }}
        >
          Thêm công việc
        </Button>
      </Flex>

      <Form.List name="inspecting_forms">
        {(fields, { add, remove }) => (
          <>
            <Table
              columns={columns}
              dataSource={fields.map((field) => ({
                key: field.key,
                ...formProps.form?.getFieldValue(["inspecting_forms", field.name]),
              }))}
              pagination={false}
              scroll={{ x: true }}
              size="small"
              style={{ whiteSpace: "nowrap" }}
              sticky={{ offsetHeader: -25 }}
            />

            <Modal
              title={editingTaskIndex !== null ? "Chỉnh sửa công việc" : "Thêm công việc mới"}
              open={isModalVisible}
              onOk={handleModalOk}
              onCancel={handleModalCancel}
              width={800}
              footer={[
                <Button key="cancel" onClick={handleModalCancel}>
                  Hủy
                </Button>,
                <Button key="submit" type="primary" onClick={handleModalOk}>
                  Lưu
                </Button>,
              ]}
            >
              <Form
                form={form}
                layout="vertical"
                initialValues={{
                  start_date: dayjs(),
                  end_date: dayjs(),
                  created_by: identity?.name || "",
                }}
              >
                <Form.Item
                  name="task_name"
                  label="Tên công việc"
                  rules={[{ required: true, message: "Vui lòng nhập tên công việc" }]}
                >
                  <Input placeholder="Tên công việc" />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="start_date"
                      label="Ngày bắt đầu"
                      rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu" }]}
                      getValueProps={(value) => ({ value: value ? dayjs(value) : null })}
                    >
                      <DatePicker
                        placeholder="Ngày bắt đầu"
                        format="DD/MM/YYYY HH:mm"
                        showTime={{ format: "HH:mm" }}
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="end_date"
                      label="Ngày kết thúc"
                      rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc" }]}
                      getValueProps={(value) => ({ value: value ? dayjs(value) : null })}
                    >
                      <DatePicker
                        placeholder="Ngày kết thúc"
                        format="DD/MM/YYYY HH:mm"
                        showTime={{ format: "HH:mm" }}
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="description"
                  label="Mô tả"
                  rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
                >
                  <Input.TextArea placeholder="Mô tả công việc kiểm tra" rows={3} />
                </Form.Item>
              </Form>
            </Modal>
          </>
        )}
      </Form.List>
    </Space>
  );
};
