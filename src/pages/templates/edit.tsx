import { SaveButton, useDrawerForm } from "@refinedev/antd";
import { type BaseKey, useGetToPath, useGo, useSelect, useTranslate } from "@refinedev/core";
import {
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Grid,
  Button,
  Flex,
  Spin,
  Drawer as AntdDrawer,
  Card,
  Space,
  Divider,
  Table,
  Modal,
  Popconfirm,
  Tabs,
  Col,
  Row,
} from "antd";
import type { IFertilizer, IItem, IPesticide, ITemplate } from "../../interfaces";
import { useSearchParams } from "react-router";
import { useStyles } from "./styled";
import dayjs from "dayjs";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { ColumnType } from "antd/es/table";

const Drawer = (props: any) => {
  return <AntdDrawer {...props} />;
};

type Props = {
  id?: BaseKey;
  onClose?: () => void;
  onMutationSuccess?: () => void;
};

type TaskModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (values: any) => void;
  initialValues?: any;
  type: "caring" | "inspecting" | "harvesting";
};

const TaskModal = ({ open, onClose, onSave, initialValues, type }: TaskModalProps) => {
  const [form] = Form.useForm();

  // Reset form when modal opens/closes or initialValues changes
  useEffect(() => {
    if (open) {
      form.resetFields();
      if (initialValues) {
        // Format initialValues to match form structure
        const formattedValues = {
          ...initialValues,
          items: initialValues.items || [],
          fertilizers: type === "caring" ? initialValues.fertilizers || [] : undefined,
          pesticides: type === "caring" ? initialValues.pesticides || [] : undefined,
          task_type: type === "harvesting" ? "Harvesting" : initialValues.task_type,
        };
        form.setFieldsValue(formattedValues);
      }
    }
  }, [open, initialValues, form, type]);

  const { options: fertilizersOptions } = useSelect<IFertilizer>({
    resource: "fertilizers",
    optionLabel: "name",
    optionValue: "id",
  });

  const { options: pesticidesOptions } = useSelect<IPesticide>({
    resource: "pesticides",
    optionLabel: "name",
    optionValue: "id",
  });

  const { options: itemsOptions } = useSelect<IItem>({
    resource: "items",
    optionLabel: "name",
    optionValue: "id",
  });

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      // Format values before saving
      const formattedValues = {
        ...values,
        items: values.items || [],
        fertilizers: type === "caring" ? values.fertilizers || [] : undefined,
        pesticides: type === "caring" ? values.pesticides || [] : undefined,
      };
      onSave(formattedValues);
      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Modal
      title={`${type === "caring" ? "Caring" : type === "inspecting" ? "Inspecting" : "Harvesting"} Task`}
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name={type === "inspecting" ? "form_name" : "task_name"}
          label={type === "inspecting" ? "Form Name" : "Task Name"}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description" rules={[{ required: true }]}>
          <Input.TextArea />
        </Form.Item>
        {type === "caring" && (
          <Form.Item name="task_type" label="Task Type" rules={[{ required: true }]}>
            <Select
              options={[
                { value: "Setup", label: "Setup" },
                { value: "Planting", label: "Planting" },
                { value: "Nurturing", label: "Nurturing" },
                { value: "Watering", label: "Watering" },
                { value: "Fertilizing", label: "Fertilizing" },
                { value: "Pesticide", label: "Pesticide" },
                { value: "Weeding", label: "Weeding" },
                { value: "Pruning", label: "Pruning" },
              ]}
            />
          </Form.Item>
        )}
        <Form.Item name="start_in" label="Start In (hours)" rules={[{ required: true }]}>
          <InputNumber style={{ width: "100%" }} min={0} addonAfter="hours" />
        </Form.Item>
        <Form.Item name="end_in" label="End In (hours)" rules={[{ required: true }]}>
          <InputNumber style={{ width: "100%" }} min={0} addonAfter="hours" />
        </Form.Item>

        {(type === "caring" || type === "harvesting") && (
          <>
            <Divider orientation="left">Items</Divider>
            <Form.List name="items">
              {(fields, { add, remove }) => (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {fields.map(({ key, name, ...restField }) => (
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
                            rules={[{ required: true, message: "Vui lòng chọn vật tư" }]}
                          >
                            <Select placeholder="Chọn sản phẩm" options={itemsOptions} />
                          </Form.Item>
                        </Col>
                        <Col span={10}>
                          <Form.Item
                            {...restField}
                            name={[name, "quantity"]}
                            style={{ marginBottom: 0 }}
                            rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
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
                                    { value: "ml", label: "ml" },
                                    { value: "g", label: "g" },
                                    { value: "lít", label: "lít" },
                                  ]}
                                />
                              }
                              style={{ width: "100%" }}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={4} style={{ display: "flex", justifyContent: "center" }}>
                          <Button
                            danger
                            shape="circle"
                            icon={<DeleteOutlined />}
                            onClick={() => remove(name)}
                          />
                        </Col>
                      </Row>
                    </div>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => {
                      const newItem = { unit: "cái" };
                      add(newItem);
                    }}
                    icon={<PlusOutlined />}
                    style={{ marginTop: 8 }}
                  >
                    Thêm vật tư
                  </Button>
                </div>
              )}
            </Form.List>
          </>
        )}

        {type === "caring" && (
          <>
            <Divider orientation="left">Fertilizers</Divider>
            <Form.List name="fertilizers">
              {(fields, { add, remove }) => (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {fields.map(({ key, name, ...restField }) => (
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
                            rules={[{ required: true, message: "Vui lòng chọn phân bón" }]}
                          >
                            <Select placeholder="Chọn phân bón" options={fertilizersOptions} />
                          </Form.Item>
                        </Col>
                        <Col span={10}>
                          <Form.Item
                            {...restField}
                            name={[name, "quantity"]}
                            style={{ marginBottom: 0 }}
                            rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
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
                                    { value: "lít", label: "lít" },
                                    { value: "ml", label: "ml" },
                                    { value: "g", label: "g" },
                                  ]}
                                />
                              }
                              style={{ width: "100%" }}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={4} style={{ display: "flex", justifyContent: "center" }}>
                          <Button
                            danger
                            shape="circle"
                            icon={<DeleteOutlined />}
                            onClick={() => remove(name)}
                          />
                        </Col>
                      </Row>
                    </div>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => {
                      const newItem = { unit: "kg" };
                      add(newItem);
                    }}
                    icon={<PlusOutlined />}
                    style={{ marginTop: 8 }}
                  >
                    Thêm phân bón
                  </Button>
                </div>
              )}
            </Form.List>

            <Divider orientation="left">Pesticides</Divider>
            <Form.List name="pesticides">
              {(fields, { add, remove }) => (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {fields.map(({ key, name, ...restField }) => (
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
                            rules={[{ required: true, message: "Vui lòng chọn thuốc trừ sâu" }]}
                          >
                            <Select placeholder="Chọn thuốc trừ sâu" options={pesticidesOptions} />
                          </Form.Item>
                        </Col>
                        <Col span={10}>
                          <Form.Item
                            {...restField}
                            name={[name, "quantity"]}
                            style={{ marginBottom: 0 }}
                            rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
                          >
                            <InputNumber
                              placeholder="Số lượng"
                              min={0}
                              addonAfter={
                                <Select
                                  defaultValue="ml"
                                  onChange={(value) => {
                                    form.setFieldValue(["pesticides", name, "unit"], value);
                                  }}
                                  options={[
                                    { value: "ml", label: "ml" },
                                    { value: "lít", label: "lít" },
                                    { value: "g", label: "g" },
                                  ]}
                                />
                              }
                              style={{ width: "100%" }}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={4} style={{ display: "flex", justifyContent: "center" }}>
                          <Button
                            danger
                            shape="circle"
                            icon={<DeleteOutlined />}
                            onClick={() => remove(name)}
                          />
                        </Col>
                      </Row>
                    </div>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => {
                      const newItem = { unit: "ml" };
                      add(newItem);
                    }}
                    icon={<PlusOutlined />}
                    style={{ marginTop: 8 }}
                  >
                    Thêm thuốc trừ sâu
                  </Button>
                </div>
              )}
            </Form.List>
          </>
        )}
      </Form>
    </Modal>
  );
};

export const TemplateEdit = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const t = useTranslate();
  const breakpoint = Grid.useBreakpoint();
  const { styles } = useStyles();
  const [form] = Form.useForm();

  const [taskModal, setTaskModal] = useState<{
    open: boolean;
    type: "caring" | "inspecting" | "harvesting";
    initialValues?: any;
    index?: number;
  }>({
    open: false,
    type: "caring",
  });

  const { drawerProps, formProps, close, saveButtonProps, formLoading } = useDrawerForm<ITemplate>({
    resource: "template",
    id: props?.id,
    action: "edit",
    redirect: false,
    onMutationSuccess: () => {
      props.onMutationSuccess?.();
    },
  });

  useEffect(() => {
    if (formProps.initialValues) {
      form.setFieldsValue(formProps.initialValues);
    }
  }, [formProps.initialValues, form]);

  const { options: plantOptions } = useSelect({
    resource: "plants",
    optionLabel: "plant_name",
    optionValue: "id",
  });

  const { options: itemsOptions } = useSelect<IItem>({
    resource: "items",
    optionLabel: "name",
    optionValue: "id",
  });

  const { options: fertilizersOptions } = useSelect<IFertilizer>({
    resource: "fertilizers",
    optionLabel: "name",
    optionValue: "id",
  });

  const { options: pesticidesOptions } = useSelect<IPesticide>({
    resource: "pesticides",
    optionLabel: "name",
    optionValue: "id",
  });

  const caringTasks = Form.useWatch(["plant_template", "caring_tasks"], form);
  const inspectingTasks = Form.useWatch(["plant_template", "inspecting_tasks"], form);
  const harvestingTasks = Form.useWatch(["plant_template", "harvesting_task_templates"], form);

  const onDrawerClose = () => {
    close();

    if (props?.onClose) {
      props.onClose();
      return;
    }

    go({
      to:
        searchParams.get("to") ??
        getToPath({
          action: "list",
        }) ??
        "",
      query: {
        to: undefined,
      },
      options: {
        keepQuery: true,
      },
      type: "replace",
    });
  };

  const handleTaskSave = (values: any) => {
    const fieldName =
      taskModal.type === "harvesting" ? "harvesting_task_templates" : `${taskModal.type}_tasks`;
    const tasks = form.getFieldValue(["plant_template", fieldName]) || [];
    if (taskModal.index !== undefined) {
      tasks[taskModal.index] = values;
    } else {
      tasks.push(values);
    }
    form.setFieldValue(["plant_template", fieldName], tasks);
  };

  const handleTaskEdit = (type: "caring" | "inspecting" | "harvesting", index: number) => {
    const fieldName = type === "harvesting" ? "harvesting_task_templates" : `${type}_tasks`;
    const tasks = form.getFieldValue(["plant_template", fieldName]) || [];
    setTaskModal({
      open: true,
      type,
      initialValues: tasks[index],
      index,
    });
  };

  const handleTaskDelete = (type: "caring" | "inspecting" | "harvesting", index: number) => {
    const fieldName = type === "harvesting" ? "harvesting_task_templates" : `${type}_tasks`;
    const tasks = form.getFieldValue(["plant_template", fieldName]) || [];
    tasks.splice(index, 1);
    form.setFieldsValue({
      plant_template: {
        ...form.getFieldValue("plant_template"),
        [fieldName]: tasks,
      },
    });
  };

  const renderItems = (items: any[]) => {
    return (
      items
        ?.map((item) => {
          const itemName = itemsOptions?.find(
            (opt: { value: string; label: string }) => opt.value === item.item_id,
          )?.label;
          return `${itemName}: ${item.quantity} ${item.unit}`;
        })
        .join(", ") || "-"
    );
  };

  const renderFertilizers = (fertilizers: any[]) => {
    return (
      fertilizers
        ?.map((fertilizer) => {
          const fertilizerName = fertilizersOptions?.find(
            (opt: { value: string; label: string }) => opt.value === fertilizer.fertilizer_id,
          )?.label;
          return `${fertilizerName}: ${fertilizer.quantity} ${fertilizer.unit}`;
        })
        .join(", ") || "-"
    );
  };

  const renderPesticides = (pesticides: any[]) => {
    return (
      pesticides
        ?.map((pesticide) => {
          const pesticideName = pesticidesOptions?.find(
            (opt: { value: string; label: string }) => opt.value === pesticide.pesticide_id,
          )?.label;
          return `${pesticideName}: ${pesticide.quantity} ${pesticide.unit}`;
        })
        .join(", ") || "-"
    );
  };

  const caringColumns: ColumnType<any>[] = [
    {
      title: t("templates.fields.task_name"),
      dataIndex: "task_name",
      key: "task_name",
    },
    {
      title: t("templates.fields.description"),
      dataIndex: "description",
      key: "description",
    },
    {
      title: t("templates.fields.task_type"),
      dataIndex: "task_type",
      key: "task_type",
    },
    {
      title: t("templates.fields.start_in"),
      dataIndex: "start_in",
      key: "start_in",
      render: (value) => `${value} hours`,
    },
    {
      title: t("templates.fields.end_in"),
      dataIndex: "end_in",
      key: "end_in",
      render: (value) => `${value} hours`,
    },
    {
      title: "Calculated Start Date",
      key: "calculated_start",
      render: (_, record) => {
        const startDate = form.getFieldValue("start_date");
        if (!startDate || !record.start_in) return "-";
        return dayjs(startDate).add(record.start_in, "hour").format("YYYY-MM-DD HH:mm");
      },
    },
    {
      title: "Calculated End Date",
      key: "calculated_end",
      render: (_, record) => {
        const startDate = form.getFieldValue("start_date");
        if (!startDate || !record.end_in) return "-";
        return dayjs(startDate).add(record.end_in, "hour").format("YYYY-MM-DD HH:mm");
      },
    },
    {
      title: t("templates.fields.items"),
      dataIndex: "items",
      key: "items",
      render: renderItems,
    },
    {
      title: t("templates.fields.fertilizers"),
      dataIndex: "fertilizers",
      key: "fertilizers",
      render: renderFertilizers,
    },
    {
      title: t("templates.fields.pesticides"),
      dataIndex: "pesticides",
      key: "pesticides",
      render: renderPesticides,
    },
    {
      title: t("table.actions"),
      key: "actions",
      fixed: "right",
      render: (_: any, __: any, index: number) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleTaskEdit("caring", index)}
          />
          <Popconfirm
            title={t("buttons.confirm")}
            description={t("buttons.confirm")}
            onConfirm={() => handleTaskDelete("caring", index)}
            okText={t("common.yes")}
            cancelText={t("common.no")}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const inspectingColumns: ColumnType<any>[] = [
    {
      title: "Form Name",
      dataIndex: "form_name",
      key: "form_name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Start In",
      dataIndex: "start_in",
      key: "start_in",
      render: (value) => `${value} hours`,
    },
    {
      title: "End In",
      dataIndex: "end_in",
      key: "end_in",
      render: (value) => `${value} hours`,
    },
    {
      title: "Calculated Start Date",
      key: "calculated_start",
      render: (_, record) => {
        const startDate = form.getFieldValue("start_date");
        if (!startDate || !record.start_in) return "-";
        return dayjs(startDate).add(record.start_in, "hour").format("YYYY-MM-DD HH:mm");
      },
    },
    {
      title: "Calculated End Date",
      key: "calculated_end",
      render: (_, record) => {
        const startDate = form.getFieldValue("start_date");
        if (!startDate || !record.end_in) return "-";
        return dayjs(startDate).add(record.end_in, "hour").format("YYYY-MM-DD HH:mm");
      },
    },
    {
      title: t("table.actions"),
      key: "actions",
      fixed: "right",
      render: (_: any, __: any, index: number) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleTaskEdit("inspecting", index)}
          />
          <Popconfirm
            title="Delete task"
            description="Are you sure to delete this task?"
            onConfirm={() => handleTaskDelete("inspecting", index)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const harvestingColumns: ColumnType<any>[] = [
    {
      title: "Task Name",
      dataIndex: "task_name",
      key: "task_name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Start In (hours)",
      dataIndex: "start_in",
      key: "start_in",
    },
    {
      title: "End In (hours)",
      dataIndex: "end_in",
      key: "end_in",
    },
    {
      title: "Calculated Start Date",
      key: "calculated_start",
      render: (_, record) => {
        const startDate = form.getFieldValue("start_date");
        if (!startDate || !record.start_in) return "-";
        return dayjs(startDate).add(record.start_in, "hour").format("YYYY-MM-DD HH:mm");
      },
    },
    {
      title: "Calculated End Date",
      key: "calculated_end",
      render: (_, record) => {
        const startDate = form.getFieldValue("start_date");
        if (!startDate || !record.end_in) return "-";
        return dayjs(startDate).add(record.end_in, "hour").format("YYYY-MM-DD HH:mm");
      },
    },
    {
      title: "Items",
      dataIndex: "items",
      key: "items",
      render: renderItems,
    },
    {
      title: t("table.actions"),
      key: "actions",
      fixed: "right",
      render: (_: any, __: any, index: number) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleTaskEdit("harvesting", index)}
          />
          <Popconfirm
            title="Delete task"
            description="Are you sure to delete this task?"
            onConfirm={() => handleTaskDelete("harvesting", index)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Drawer
      {...drawerProps}
      open={true}
      width={breakpoint.lg ? "1001px" : "100%"}
      zIndex={1001}
      onClose={onDrawerClose}
      title={t("templates.titles.edit_template")}
    >
      <Spin spinning={formLoading}>
        <Form {...formProps} form={form} layout="vertical">
          <Flex vertical gap="large">
            <Card title={t("templates.titles.basic_info")}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label={t("templates.fields.plant")}
                    name="plant_id"
                    className={styles.formItem}
                    rules={[
                      {
                        required: true,
                        message: t("templates.messages.plant_required"),
                      },
                      {
                        validator: async (_, value) => {
                          if (!value) {
                            return Promise.reject(
                              new Error(t("templates.messages.plant_required")),
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Select
                      placeholder={t("templates.fields.plant")}
                      options={plantOptions}
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={t("templates.fields.season_type")}
                    name="season_type"
                    className={styles.formItem}
                    rules={[
                      {
                        required: true,
                        message: t("templates.messages.season_type_required"),
                      },
                      {
                        validator: async (_, value) => {
                          if (!value) {
                            return Promise.reject(
                              new Error(t("templates.messages.season_type_required")),
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Select
                      placeholder={t("templates.fields.season_type")}
                      options={[
                        { value: "spring", label: t("templates.seasons.spring") },
                        { value: "summer", label: t("templates.seasons.summer") },
                        { value: "autumn", label: t("templates.seasons.autumn") },
                        { value: "winter", label: t("templates.seasons.winter") },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label={t("templates.fields.description")}
                name="description"
                className={styles.formItem}
                rules={[
                  {
                    required: true,
                    message: t("templates.messages.description_required"),
                  },
                  {
                    min: 10,
                    message: t("templates.messages.description_min_length"),
                  },
                  {
                    max: 500,
                    message: t("templates.messages.description_max_length"),
                  },
                  {
                    validator: async (_, value) => {
                      if (!value || value.trim().length < 10) {
                        return Promise.reject(
                          new Error(t("templates.messages.description_min_length")),
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder={t("templates.fields.description_placeholder")}
                  showCount
                  maxLength={500}
                />
              </Form.Item>

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label={t("templates.fields.start_date")}
                    name="start_date"
                    className={styles.formItem}
                    rules={[
                      {
                        required: true,
                        message: t("templates.messages.start_date_required"),
                      },
                      {
                        validator: async (_, value) => {
                          if (!value) {
                            return Promise.reject(
                              new Error(t("templates.messages.start_date_required")),
                            );
                          }
                          const endDate = form.getFieldValue("end_date");
                          if (endDate && dayjs(value).isAfter(dayjs(endDate))) {
                            return Promise.reject(
                              new Error(t("templates.messages.start_date_before_end")),
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                    getValueProps={(value) => ({
                      value: value ? dayjs(value) : undefined,
                    })}
                    normalize={(value) => {
                      return value ? value.format("YYYY-MM-DDTHH:mm:ss.SSSZ") : undefined;
                    }}
                  >
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      placeholder={t("templates.fields.start_date")}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={t("templates.fields.end_date")}
                    name="end_date"
                    className={styles.formItem}
                    rules={[
                      {
                        required: true,
                        message: t("templates.messages.end_date_required"),
                      },
                      {
                        validator: async (_, value) => {
                          if (!value) {
                            return Promise.reject(
                              new Error(t("templates.messages.end_date_required")),
                            );
                          }
                          const startDate = form.getFieldValue("start_date");
                          if (startDate && dayjs(value).isBefore(dayjs(startDate))) {
                            return Promise.reject(
                              new Error(t("templates.messages.end_date_after_start")),
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                    getValueProps={(value) => ({
                      value: value ? dayjs(value) : undefined,
                    })}
                    normalize={(value) => {
                      return value ? value.format("YYYY-MM-DDTHH:mm:ss.SSSZ") : undefined;
                    }}
                  >
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      placeholder={t("templates.fields.end_date")}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label={t("templates.fields.estimated_per_one")}
                    name="estimated_per_one"
                    className={styles.formItem}
                    rules={[
                      {
                        required: true,
                        message: t("templates.messages.estimated_per_one_required"),
                      },
                      {
                        type: "number",
                        min: 0,
                        message: t("templates.messages.estimated_per_one_min"),
                      },
                      {
                        validator: async (_, value) => {
                          if (!value || value < 0) {
                            return Promise.reject(
                              new Error(t("templates.messages.estimated_per_one_min")),
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                    tooltip={t("templates.tooltips.estimated_per_one")}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      min={0}
                      placeholder={t("templates.fields.estimated_per_one")}
                      addonAfter="kg"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={t("templates.fields.duration_days")}
                    name="duration_days"
                    className={styles.formItem}
                    rules={[
                      {
                        required: true,
                        message: t("templates.messages.duration_days_required"),
                      },
                      {
                        type: "number",
                        min: 1,
                        message: t("templates.messages.duration_days_min"),
                      },
                      {
                        validator: async (_, value) => {
                          if (!value || value < 1) {
                            return Promise.reject(
                              new Error(t("templates.messages.duration_days_min")),
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                    tooltip={t("templates.tooltips.duration_days")}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      min={1}
                      placeholder={t("templates.fields.duration_days")}
                      addonAfter="days"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card title={t("templates.titles.plant_template")}>
              <Form.Item
                label={t("templates.fields.season_type")}
                name={["plant_template", "season_type"]}
                className={styles.formItem}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={t("templates.fields.sample_quantity")}
                name={["plant_template", "sample_quantity"]}
                className={styles.formItem}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>

              <Tabs
                items={[
                  {
                    key: "caring",
                    label: t("templates.titles.caring_tasks"),
                    children: (
                      <>
                        <Flex justify="flex-end" style={{ marginBottom: 16 }}>
                          <Button
                            type="primary"
                            onClick={() => setTaskModal({ open: true, type: "caring" })}
                            icon={<PlusOutlined />}
                          >
                            {t("templates.buttons.add_caring_task")}
                          </Button>
                        </Flex>
                        <Form.Item name={["plant_template", "caring_tasks"]} noStyle>
                          <Table
                            columns={caringColumns}
                            dataSource={caringTasks || []}
                            pagination={false}
                            scroll={{ x: true, y: 400 }}
                            size="small"
                            style={{ whiteSpace: "nowrap" }}
                            sticky={{ offsetHeader: -25 }}
                          />
                        </Form.Item>
                      </>
                    ),
                    forceRender: true,
                  },
                  {
                    key: "inspecting",
                    label: t("templates.titles.inspecting_tasks"),
                    children: (
                      <>
                        <Flex justify="flex-end" style={{ marginBottom: 16 }}>
                          <Button
                            type="primary"
                            onClick={() => setTaskModal({ open: true, type: "inspecting" })}
                            icon={<PlusOutlined />}
                          >
                            {t("templates.buttons.add_inspecting_task")}
                          </Button>
                        </Flex>
                        <Form.Item name={["plant_template", "inspecting_tasks"]} noStyle>
                          <Table
                            columns={inspectingColumns}
                            dataSource={inspectingTasks || []}
                            pagination={false}
                            scroll={{ x: true, y: 400 }}
                            size="small"
                            style={{ whiteSpace: "nowrap" }}
                            sticky={{ offsetHeader: -25 }}
                          />
                        </Form.Item>
                      </>
                    ),
                    forceRender: true,
                  },
                  {
                    key: "harvesting",
                    label: t("templates.titles.harvesting_tasks"),
                    children: (
                      <>
                        <Flex justify="flex-end" style={{ marginBottom: 16 }}>
                          <Button
                            type="primary"
                            onClick={() => setTaskModal({ open: true, type: "harvesting" })}
                            icon={<PlusOutlined />}
                          >
                            {t("templates.buttons.add_harvesting_task")}
                          </Button>
                        </Flex>
                        <Form.Item name={["plant_template", "harvesting_task_templates"]} noStyle>
                          <Table
                            columns={harvestingColumns}
                            dataSource={harvestingTasks || []}
                            pagination={false}
                            scroll={{ x: true, y: 400 }}
                            size="small"
                            style={{ whiteSpace: "nowrap" }}
                            sticky={{ offsetHeader: -25 }}
                          />
                        </Form.Item>
                      </>
                    ),
                    forceRender: true,
                  },
                ]}
              />
            </Card>
          </Flex>
          <Flex justify="flex-end" gap="small" style={{ marginTop: 16 }}>
            <Button onClick={onDrawerClose}>{t("buttons.cancel")}</Button>
            <SaveButton {...saveButtonProps} htmlType="submit" type="primary" icon={null}>
              {t("buttons.save")}
            </SaveButton>
          </Flex>
        </Form>
      </Spin>

      <TaskModal
        open={taskModal.open}
        onClose={() => setTaskModal({ open: false, type: "caring" })}
        onSave={handleTaskSave}
        initialValues={taskModal.initialValues}
        type={taskModal.type}
      />
    </Drawer>
  );
};
