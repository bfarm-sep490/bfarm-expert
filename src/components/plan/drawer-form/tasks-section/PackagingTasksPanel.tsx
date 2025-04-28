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
import { useState, useEffect } from "react";
import { useGetIdentity } from "@refinedev/core";
import { useTaskStore } from "@/store/task-store";

const { Text } = Typography;

interface PackagingTasksPanelProps {
  formProps: UseFormReturnType<IPlant>["formProps"];
  itemsOptions: { label: string; value: number }[];
  packagingTypesOptions: { label: string; value: number }[];
  orders: {
    id: string;
    quantity: number;
    estimate_pick_up_date: string;
    plant_id: number;
    packaging_type_id: number;
  }[];
}

export const PackagingTasksPanel: React.FC<PackagingTasksPanelProps> = ({
  formProps,
  itemsOptions,
  packagingTypesOptions,
  orders,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTaskIndex, setEditingTaskIndex] = useState<number | null>(null);
  const [form] = Form.useForm();
  const { incrementCount, decrementCount } = useTaskStore();
  const { data: user } = useGetIdentity<IIdentity>();

  useEffect(() => {
    const currentTasks = formProps.form?.getFieldValue("packaging_tasks") || [];

    // Only create tasks if there are no existing tasks
    if (currentTasks.length === 0) {
      const newTasks =
        orders.length > 0
          ? orders.map((order) => ({
              task_name: `Đóng gói cho Order ${order.id}`,
              order_id: order.id,
              created_by: user?.name,
              start_date: dayjs(),
              end_date: dayjs(),
              packaging_type_id: order.packaging_type_id || 1,
              description: "",
              total_package_weight: order.quantity,
              items: [],
            }))
          : [
              {
                task_name: "Đóng gói sản phẩm",
                order_id: null,
                created_by: user?.name,
                start_date: dayjs(),
                end_date: dayjs(),
                packaging_type_id: 1,
                description: "Đóng gói sản phẩm",
                total_package_weight: 50,
                items: [],
              },
            ];

      formProps.form?.setFieldsValue({
        packaging_tasks: newTasks,
      });
    }
  }, [orders, formProps.form, user?.name]);

  const handleEditTask = (index: number) => {
    const currentTasks = formProps.form?.getFieldValue("packaging_tasks") || [];
    const taskToEdit = currentTasks[index];
    form.setFieldsValue(taskToEdit);
    setEditingTaskIndex(index);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const currentTasks = formProps.form?.getFieldValue("packaging_tasks") || [];
      const updatedTask = {
        ...values,
        created_by: user?.name as string,
        items: values.items?.map((item: any) => ({
          ...item,
          unit: item.unit || "cái", // Set default unit if not provided
        })),
      };

      if (editingTaskIndex !== null) {
        currentTasks[editingTaskIndex] = updatedTask;
      } else {
        currentTasks.push(updatedTask);
        incrementCount("packaging");
      }
      formProps.form?.setFieldsValue({ packaging_tasks: currentTasks });
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

  const handleDeleteTask = (record: any) => {
    const currentTasks = formProps.form?.getFieldValue("packaging_tasks") || [];

    // Kiểm tra nếu task có order_id thì không cho xóa
    if (record.order_id) {
      Modal.error({
        title: "Không thể xóa",
        content:
          "Không thể xóa task đang gắn với order. Vui lòng hủy liên kết với order trước khi xóa.",
      });
      return;
    }

    // Xóa task dựa vào index
    const updatedTasks = currentTasks.filter((_: any, index: number) => index !== record.key);
    formProps.form?.setFieldsValue({
      packaging_tasks: updatedTasks,
    });
    decrementCount("packaging");
  };

  const columns = [
    {
      title: "Tên công việc",
      dataIndex: "task_name",
      key: "task_name",
      sorter: (a: any, b: any) => a.task_name.localeCompare(b.task_name),
      filterSearch: true,
    },
    ...(orders.length > 0
      ? [
          {
            title: "Order ID",
            dataIndex: "order_id",
            key: "order_id",
            render: (orderId: string) => <Tag color="green">Order {orderId}</Tag>,
          },
        ]
      : []),
    {
      title: "Người tạo",
      dataIndex: "created_by",
      key: "created_by",
      render: (createdBy: string) => <Tag color="blue">{createdBy}</Tag>,
    },
    {
      title: "Loại đóng gói",
      dataIndex: "packaging_type_id",
      key: "packaging_type_id",
      render: (typeId: number) => {
        const type = packagingTypesOptions.find((opt) => opt.value === typeId);
        return <Tag color="blue">{type?.label}</Tag>;
      },
    },
    {
      title: "Tổng khối lượng",
      dataIndex: "total_package_weight",
      key: "total_package_weight",
      render: (weight: number) => `${weight} kg`,
      sorter: (a: any, b: any) => a.total_package_weight - b.total_package_weight,
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
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditTask(record.key)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa công việc"
            description="Bạn có chắc chắn muốn xóa công việc này?"
            onConfirm={() => handleDeleteTask(record)}
            okText="Xóa"
            cancelText="Hủy"
            disabled={!!record.order_id}
          >
            <Tooltip title={record.order_id ? "Không thể xóa task đang gắn với order" : "Xóa"}>
              <Button type="text" danger icon={<DeleteOutlined />} disabled={!!record.order_id} />
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
            Danh sách công việc đóng gói
          </Text>
          <Text type="secondary">Quản lý các công việc đóng gói sản phẩm</Text>
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

      <Form.List name="packaging_tasks">
        {(fields, { add, remove }) => (
          <>
            <Table
              columns={columns}
              dataSource={fields.map((field) => ({
                key: field.key,
                ...formProps.form?.getFieldValue(["packaging_tasks", field.name]),
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
                  total_package_weight: 0,
                  items: [],
                  created_by: user?.name,
                  order_id: null,
                }}
              >
                {orders.length > 0 && (
                  <Form.Item
                    name="order_id"
                    label="Order"
                    rules={[{ required: false, message: "Vui lòng chọn order" }]}
                  >
                    <Select
                      placeholder="Chọn order"
                      options={[
                        { label: "Không có order", value: null },
                        ...orders.map((order) => ({
                          label: `Order ${order.id}`,
                          value: order.id,
                        })),
                      ]}
                      disabled={editingTaskIndex !== null}
                    />
                  </Form.Item>
                )}

                <Form.Item
                  name="task_name"
                  label="Tên công việc"
                  rules={[{ required: true, message: "Vui lòng nhập tên công việc" }]}
                >
                  <Input placeholder="Tên công việc" />
                </Form.Item>

                <Form.Item name="created_by" label="Người tạo" hidden>
                  <Input />
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
                  name="packaging_type_id"
                  label="Loại đóng gói"
                  rules={[{ required: true, message: "Vui lòng chọn loại đóng gói" }]}
                >
                  <Select placeholder="Loại đóng gói" options={packagingTypesOptions} />
                </Form.Item>

                <Form.Item name="description" label="Mô tả">
                  <Input.TextArea placeholder="Mô tả" rows={2} />
                </Form.Item>

                <Form.Item
                  name="total_package_weight"
                  label="Tổng khối lượng"
                  rules={[{ required: true, message: "Vui lòng nhập tổng khối lượng" }]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: "100%" }}
                    placeholder="Tổng khối lượng"
                    addonAfter="kg"
                  />
                </Form.Item>

                <Space direction="vertical" style={{ width: "100%" }}>
                  <Text strong>Vật tư đóng gói</Text>
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
