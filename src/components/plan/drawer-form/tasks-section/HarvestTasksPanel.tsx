import { UseFormReturnType } from "@refinedev/antd";
import {
  Space,
  Button,
  Typography,
  Flex,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Table,
  Modal,
  Tag,
  Tooltip,
  Popconfirm,
  Row,
  Col,
} from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { IIdentity, IPlant } from "@/interfaces";
import dayjs from "dayjs";
import { useState } from "react";
import { useGetIdentity } from "@refinedev/core";
import { useTaskStore } from "@/store/task-store";

const { Text } = Typography;

interface HarvestTasksPanelProps {
  formProps: UseFormReturnType<IPlant>["formProps"];
  itemsOptions: { label: string; value: number }[];
}

export const HarvestTasksPanel: React.FC<HarvestTasksPanelProps> = ({
  formProps,
  itemsOptions,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTaskIndex, setEditingTaskIndex] = useState<number | null>(null);
  const [form] = Form.useForm();
  const { data: user } = useGetIdentity<IIdentity>();
  const { incrementCount, decrementCount } = useTaskStore();

  const handleEditTask = (index: number) => {
    const currentTasks = formProps.form?.getFieldValue("harvesting_tasks") || [];
    const taskToEdit = currentTasks[index];
    form.setFieldsValue(taskToEdit);
    setEditingTaskIndex(index);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const currentTasks = formProps.form?.getFieldValue("harvesting_tasks") || [];
      const updatedTask = {
        ...values,
        created_by: user?.name as string,
      };

      if (editingTaskIndex !== null) {
        currentTasks[editingTaskIndex] = updatedTask;
      } else {
        currentTasks.push(updatedTask);
        incrementCount("harvesting");
      }
      formProps.form?.setFieldsValue({ harvesting_tasks: currentTasks });
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
    const currentTasks = formProps.form?.getFieldValue("harvesting_tasks") || [];
    formProps.form?.setFieldsValue({
      harvesting_tasks: currentTasks.filter((_: any, i: number) => i !== index),
    });
    decrementCount("harvesting");
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
            Danh sách công việc thu hoạch
          </Text>
          <Text type="secondary">Quản lý các công việc thu hoạch sản phẩm</Text>
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

      <Form.List name="harvesting_tasks">
        {(fields, { add, remove }) => (
          <>
            <Table
              columns={columns}
              dataSource={fields.map((field) => ({
                key: field.key,
                ...formProps.form?.getFieldValue(["harvesting_tasks", field.name]),
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
                  items: [],
                  created_by: user?.name as string,
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

                <Form.Item name="description" label="Mô tả">
                  <Input.TextArea placeholder="Mô tả" rows={2} />
                </Form.Item>

                <Space direction="vertical" style={{ width: "100%" }}>
                  <Text strong>Vật tư thu hoạch</Text>
                  <Form.List name="items">
                    {(itemFields, { add: addItem, remove: removeItem }) => (
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {itemFields.map(({ key, name, ...restField }) => (
                          <div
                            key={key}
                            style={{
                              border: "1px dashed #d9d9d9",
                              padding: 16,
                              borderRadius: 4,
                            }}
                          >
                            <Row gutter={16} align="middle">
                              <Col span={10}>
                                <Form.Item
                                  {...restField}
                                  name={[name, "item_id"]}
                                  style={{ marginBottom: 0 }}
                                >
                                  <Select placeholder="Chọn vật tư" options={itemsOptions} />
                                </Form.Item>
                              </Col>
                              <Col span={10}>
                                <Form.Item
                                  {...restField}
                                  name={[name, "quantity"]}
                                  style={{ marginBottom: 0 }}
                                >
                                  <InputNumber
                                    placeholder="Số lượng"
                                    min={0}
                                    addonAfter={
                                      <Select
                                        defaultValue="cái"
                                        onChange={(value) => {
                                          form.setFieldValue(["items", name, "unit"], value);
                                        }}
                                        options={[
                                          { value: "cái", label: "cái" },
                                          { value: "hộp", label: "hộp" },
                                          { value: "kg", label: "kg" },
                                        ]}
                                      />
                                    }
                                    style={{ width: "100%" }}
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={0}>
                                <Form.Item
                                  {...restField}
                                  name={[name, "unit"]}
                                  style={{ marginBottom: 0 }}
                                  hidden
                                >
                                  <Input />
                                </Form.Item>
                              </Col>
                              <Col span={4} style={{ display: "flex", justifyContent: "center" }}>
                                <Button
                                  danger
                                  shape="circle"
                                  icon={<DeleteOutlined spin />}
                                  onClick={() => removeItem(name)}
                                />
                              </Col>
                            </Row>
                          </div>
                        ))}
                        <Button
                          type="dashed"
                          onClick={() => addItem()}
                          icon={<PlusOutlined />}
                          style={{ marginTop: 8 }}
                        >
                          Thêm vật tư
                        </Button>
                      </div>
                    )}
                  </Form.List>
                </Space>
              </Form>
            </Modal>
          </>
        )}
      </Form.List>
    </Space>
  );
};
