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
  Col,
  Row,
  TableColumnsType,
} from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined, SettingOutlined } from "@ant-design/icons";
import { IIdentity, IPlant } from "@/interfaces";
import dayjs from "dayjs";
import { useState } from "react";
import { useGetIdentity } from "@refinedev/core";
import { useTaskStore } from "@/store/task-store";
import { TypeTag } from "./TypeTag";
import { useItems } from "../hooks/useItems";

const { Text } = Typography;

interface CareTasksPanelProps {
  formProps: UseFormReturnType<IPlant>["formProps"];
  fertilizersOptions: { label: string; value: number }[];
  pesticidesOptions: { label: string; value: number }[];
}

export const CareTasksPanel: React.FC<CareTasksPanelProps> = ({
  formProps,
  fertilizersOptions,
  pesticidesOptions,
}) => {
  const { itemsOptions } = useItems("Caring");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTaskIndex, setEditingTaskIndex] = useState<number | null>(null);
  const [form] = Form.useForm();
  const { data: user } = useGetIdentity<IIdentity>();
  const { incrementCount, decrementCount } = useTaskStore();

  const handleEditTask = (index: number) => {
    const currentTasks = formProps.form?.getFieldValue("caring_tasks") || [];
    const taskToEdit = currentTasks[index];
    form.setFieldsValue(taskToEdit);
    setEditingTaskIndex(index);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const currentTasks = formProps.form?.getFieldValue("caring_tasks") || [];
      const updatedTask = {
        ...values,
        items: values.items?.map((item: any) => ({
          ...item,
          unit: item.unit || "cái",
        })),
        fertilizers: values.fertilizers?.map((fertilizer: any) => ({
          ...fertilizer,
          unit: fertilizer.unit || "kg",
        })),
        pesticides: values.pesticides?.map((pesticide: any) => ({
          ...pesticide,
          unit: pesticide.unit || "kg",
        })),
      };

      if (editingTaskIndex !== null) {
        currentTasks[editingTaskIndex] = updatedTask;
      } else {
        currentTasks.push(updatedTask);
        incrementCount("caring");
      }
      formProps.form?.setFieldsValue({ caring_tasks: currentTasks });
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
    const currentTasks = formProps.form?.getFieldValue("caring_tasks") || [];
    formProps.form?.setFieldsValue({
      caring_tasks: currentTasks.filter((task: any) => task.id !== record.id),
    });
    decrementCount("caring");
  };

  const columns: TableColumnsType<any> = [
    {
      title: "Tên công việc",
      dataIndex: "task_name",
      key: "task_name",
      sorter: (a: any, b: any) => a.task_name.localeCompare(b.task_name),
      filterSearch: true,
    },
    {
      title: "Loại công việc",
      dataIndex: "task_type",
      key: "task_type",
      render: (type: string) => <TypeTag status={type as any} />,
      sorter: (a: any, b: any) => a.task_type.localeCompare(b.task_type),
      filters: [
        { text: "Chuẩn bị", value: "Setup" },
        { text: "Trồng cây", value: "Planting" },
        { text: "Làm cỏ", value: "Weeding" },
        { text: "Cắt tỉa", value: "Pruning" },
        { text: "Chăm sóc", value: "Nurturing" },
        { text: "Tưới nước", value: "Watering" },
        { text: "Bón phân", value: "Fertilizing" },
        { text: "Phòng trừ sâu bệnh", value: "Pesticide" },
      ],
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
      fixed: "right",
      render: (_: any, record: any, index: number) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button type="text" icon={<EditOutlined />} onClick={() => handleEditTask(index)} />
          </Tooltip>
          <Popconfirm
            title="Xóa công việc"
            description="Bạn có chắc chắn muốn xóa công việc này?"
            onConfirm={() => handleDeleteTask(record)}
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

  const getTaskTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      Setup: "blue",
      Planting: "green",
      Nurturing: "orange",
      Watering: "cyan",
      Fertilizing: "purple",
      Pesticide: "red",
      Weeding: "lime",
      Pruning: "gold",
    };
    return colors[type] || "default";
  };

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Flex justify="space-between" align="center">
        <Space direction="vertical" size="small">
          <Text strong style={{ fontSize: "16px" }}>
            Danh sách công việc chăm sóc
          </Text>
          <Text type="secondary">Quản lý các công việc chăm sóc cây trồng</Text>
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

      <Form.List name="caring_tasks">
        {(fields, { add, remove }) => (
          <>
            <Table
              columns={columns}
              dataSource={fields.map((field) => ({
                key: field.key,
                ...formProps.form?.getFieldValue(["caring_tasks", field.name]),
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
                  task_type: "Setup",
                  start_date: dayjs(),
                  end_date: dayjs(),
                  fertilizers: [],
                  pesticides: [],
                  items: [],
                  created_by: user?.name,
                }}
              >
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
                  name="task_type"
                  label="Loại công việc"
                  rules={[{ required: true, message: "Vui lòng chọn loại công việc" }]}
                >
                  <Select
                    placeholder="Loại công việc"
                    options={[
                      { value: "Setup", label: "Chuẩn bị đất" },
                      { value: "Planting", label: "Trồng cây" },
                      { value: "Nurturing", label: "Chăm sóc" },
                      { value: "Watering", label: "Tưới nước" },
                      { value: "Fertilizing", label: "Bón phân" },
                      { value: "Pesticide", label: "Phòng trừ sâu bệnh" },
                      { value: "Weeding", label: "Làm cỏ" },
                      { value: "Pruning", label: "Cắt tỉa" },
                    ]}
                  />
                </Form.Item>

                <Form.Item
                  rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
                  name="description"
                  label="Mô tả"
                >
                  <Input.TextArea placeholder="Mô tả" rows={2} />
                </Form.Item>

                <Space direction="vertical" style={{ width: "100%" }}>
                  <Text strong>Phân bón</Text>
                  <Form.List name="fertilizers">
                    {(fertilizerFields, { add: addFertilizer, remove: removeFertilizer }) => (
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {fertilizerFields.map(({ key, name, ...restField }) => (
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
                                  name={[name, "fertilizer_id"]}
                                  style={{ marginBottom: 0 }}
                                >
                                  <Select
                                    placeholder="Chọn phân bón"
                                    options={fertilizersOptions}
                                  />
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
                                        defaultValue="kg"
                                        onChange={(value) => {
                                          form.setFieldValue(["fertilizers", name, "unit"], value);
                                        }}
                                        options={[
                                          { value: "kg", label: "kg" },
                                          { value: "g", label: "g" },
                                          { value: "l", label: "l" },
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
                                  icon={<DeleteOutlined />}
                                  onClick={() => removeFertilizer(name)}
                                />
                              </Col>
                            </Row>
                          </div>
                        ))}
                        <Button
                          type="dashed"
                          onClick={() => addFertilizer()}
                          icon={<PlusOutlined />}
                          style={{ marginTop: 8 }}
                        >
                          Thêm phân bón
                        </Button>
                      </div>
                    )}
                  </Form.List>

                  <Text strong>Thuốc bảo vệ thực vật</Text>
                  <Form.List name="pesticides">
                    {(pesticideFields, { add: addPesticide, remove: removePesticide }) => (
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {pesticideFields.map(({ key, name, ...restField }) => (
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
                                  name={[name, "pesticide_id"]}
                                  style={{ marginBottom: 0 }}
                                >
                                  <Select placeholder="Chọn thuốc" options={pesticidesOptions} />
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
                                        defaultValue="kg"
                                        onChange={(value) => {
                                          form.setFieldValue(["pesticides", name, "unit"], value);
                                        }}
                                        options={[
                                          { value: "kg", label: "kg" },
                                          { value: "g", label: "g" },
                                          { value: "l", label: "l" },
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
                                  icon={<DeleteOutlined />}
                                  onClick={() => removePesticide(name)}
                                />
                              </Col>
                            </Row>
                          </div>
                        ))}
                        <Button
                          type="dashed"
                          onClick={() => addPesticide()}
                          icon={<PlusOutlined />}
                          style={{ marginTop: 8 }}
                        >
                          Thêm thuốc
                        </Button>
                      </div>
                    )}
                  </Form.List>

                  <Text strong>Vật tư</Text>
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
                                  icon={<DeleteOutlined />}
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
