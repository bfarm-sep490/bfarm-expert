import { useTranslate, useCustomMutation, useApiUrl, useNotification } from "@refinedev/core";
import { Form, Select, Input, Button, Modal, Col, Row, DatePicker, InputNumber, Spin } from "antd";
import { useState, useEffect } from "react";

import moment from "moment";
import { DeleteOutlined } from "@ant-design/icons";

interface TaskFormModalProps {
  taskType: string;
  planId: number;
  initialValues?: any;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  fertilizerSelectProps?: any;
  pesticideSelectProps?: any;
  itemSelectProps?: any;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  taskType,
  planId,
  initialValues = null,
  visible,
  onCancel,
  onSuccess,
  fertilizerSelectProps,
  pesticideSelectProps,
  itemSelectProps,
}) => {
  const t = useTranslate();
  const [form] = Form.useForm();
  const [fertilizerFields, setFertilizerFields] = useState<{ id: number }[]>([]);
  const [pesticideFields, setPesticideFields] = useState<{ id: number }[]>([]);
  const [itemFields, setItemFields] = useState<{ id: number }[]>([]);
  const apiUrl = useApiUrl();
  const { open } = useNotification();

  const { mutate: customUpdateTask, isLoading: isUpdating } = useCustomMutation();

  useEffect(() => {
    if (visible && initialValues) {
      const formattedValues = {
        ...initialValues,
        start_date: initialValues.start_date ? moment(initialValues.start_date) : null,
        end_date: initialValues.end_date ? moment(initialValues.end_date) : null,
      };

      form.setFieldsValue(formattedValues);

      const fertilizers = initialValues.fertilizers || initialValues.care_fertilizers || [];
      if (fertilizers.length > 0) {
        const fields = fertilizers.map((item: any, index: number) => ({
          id: Date.now() + index,
          ...item,
        }));
        setFertilizerFields(fields);

        fields.forEach((field: any) => {
          form.setFieldsValue({
            [`fertilizer_id_${field.id}`]: field.fertilizer_id,
            [`fertilizer_quantity_${field.id}`]: field.quantity,
            [`fertilizer_unit_${field.id}`]: field.unit,
          });
        });
      } else {
        setFertilizerFields([]);
      }

      const pesticides = initialValues.pesticides || initialValues.care_pesticides || [];
      if (pesticides.length > 0) {
        const fields = pesticides.map((item: any, index: number) => ({
          id: Date.now() + index + 100,
          ...item,
        }));
        setPesticideFields(fields);

        fields.forEach((field: any) => {
          form.setFieldsValue({
            [`pesticide_id_${field.id}`]: field.pesticide_id,
            [`pesticide_quantity_${field.id}`]: field.quantity,
            [`pesticide_unit_${field.id}`]: field.unit,
          });
        });
      } else {
        setPesticideFields([]);
      }

      const items = initialValues.items || initialValues.care_items || [];
      if (items.length > 0) {
        const fields = items.map((item: any, index: number) => ({
          id: Date.now() + index + 200,
          ...item,
        }));
        setItemFields(fields);

        fields.forEach((field: any) => {
          form.setFieldsValue({
            [`item_id_${field.id}`]: field.item_id,
            [`item_quantity_${field.id}`]: field.quantity,
            [`item_unit_${field.id}`]: field.unit,
          });
        });
      } else {
        setItemFields([]);
      }
    } else {
      form.resetFields();
      setFertilizerFields([]);
      setPesticideFields([]);
      setItemFields([]);
    }
  }, [visible, form, initialValues]);

  const addField = (list: any[], setList: React.Dispatch<React.SetStateAction<any[]>>) => {
    const newList = [...list, { id: Date.now() }];
    setList(newList);
  };

  const removeField = (
    id: number,
    list: any[],
    setList: React.Dispatch<React.SetStateAction<any[]>>,
  ) => {
    const newList = list.filter((item) => item.id !== id);
    setList(newList);
  };

  const handleFormSubmit = () => {
    form.validateFields().then((values) => {
      let endpoint = "";
      let payload: any = {};

      const fertilizers = fertilizerFields
        .map((field) => ({
          fertilizer_id: form.getFieldValue(`fertilizer_id_${field.id}`),
          quantity: form.getFieldValue(`fertilizer_quantity_${field.id}`),
          unit: form.getFieldValue(`fertilizer_unit_${field.id}`),
        }))
        .filter((item) => item.fertilizer_id);

      const pesticides = pesticideFields
        .map((field) => ({
          pesticide_id: form.getFieldValue(`pesticide_id_${field.id}`),
          quantity: form.getFieldValue(`pesticide_quantity_${field.id}`),
          unit: form.getFieldValue(`pesticide_unit_${field.id}`),
        }))
        .filter((item) => item.pesticide_id);

      const items = itemFields
        .map((field) => ({
          item_id: form.getFieldValue(`item_id_${field.id}`),
          quantity: form.getFieldValue(`item_quantity_${field.id}`),
          unit: form.getFieldValue(`item_unit_${field.id}`),
        }))
        .filter((item) => item.item_id);

      switch (taskType) {
        case "caring":
          endpoint = `caring-tasks/${initialValues?.id || ""}`;
          payload = {
            plan_id: planId,
            task_name: values.task_name,
            task_type: values.task_type,
            start_date: values.start_date.toISOString(),
            end_date: values.end_date.toISOString(),
            fertilizers,
            pesticides,
            items,
          };
          break;

        case "harvesting":
          endpoint = `harvesting-tasks/${initialValues?.id || ""}`;
          payload = {
            plan_id: planId,
            task_name: values.task_name,
            description: values.description || "",
            start_date: values.start_date.toISOString(),
            end_date: values.end_date.toISOString(),
            items,
          };
          break;

        case "packaging":
          endpoint = `packaging-tasks/${initialValues?.id || ""}`;
          payload = {
            plan_id: planId,
            task_name: values.task_name,
            description: values.description || "",
            start_date: values.start_date.toISOString(),
            end_date: values.end_date.toISOString(),
            items,
          };
          break;

        case "inspecting":
          endpoint = `inspecting-forms/${initialValues?.id || ""}`;
          payload = {
            plan_id: planId,
            task_name: values.task_name,
            task_type: values.task_type,
            description: values.description || "",
            start_date: values.start_date.toISOString(),
            end_date: values.end_date.toISOString(),
          };
          break;

        default:
          open?.({
            type: "error",
            message: t("errors.unknownTaskType", "Unknown task type"),
          });
          return;
      }

      customUpdateTask(
        {
          url: `${apiUrl}/${endpoint}`,
          method: initialValues ? "put" : "post",
          values: payload,
        },
        {
          onSuccess: (data) => {
            open?.({
              type: "success",
              message: initialValues
                ? t("success.taskUpdated", "Task updated successfully")
                : t("success.taskAdded", "Task added successfully"),
            });
            onSuccess();
          },
          onError: (error) => {
            console.error(initialValues ? "Error updating task:" : "Error adding task:", error);
            open?.({
              type: "error",
              message: initialValues
                ? t("errors.updatingTask", "Failed to update task")
                : t("errors.addingTask", "Failed to add task"),
            });
          },
        },
      );
    });
  };

  const getTaskTypeOptions = () => {
    if (taskType === "caring") {
      return [
        { label: "Planting", value: "Planting" },
        { label: "Nurturing", value: "Nurturing" },
        { label: "Watering", value: "Watering" },
        { label: "Fertilizing", value: "Fertilizing" },
        { label: "PestControl", value: "PestControl" },
      ];
    } else if (taskType === "harvesting") {
      return [{ label: "Harvesting", value: "Harvesting" }];
    } else if (taskType === "packaging") {
      return [{ label: "Packaging", value: "Packaging" }];
    } else {
      return [
        { label: "SoilInspection", value: "SoilInspection" },
        { label: "PlantInspection", value: "PlantInspection" },
        { label: "QualityInspection", value: "QualityInspection" },
      ];
    }
  };

  return (
    <Modal
      title={
        initialValues
          ? t("plans.tasks.editTask", "Edit Task")
          : t("plans.tasks.addTask", "Add Task")
      }
      open={visible}
      onOk={handleFormSubmit}
      onCancel={onCancel}
      width={800}
      confirmLoading={isUpdating}
      destroyOnClose
    >
      <Spin spinning={isUpdating}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("plans.fields.taskName.label", "Task Name")}
                name="task_name"
                rules={[{ required: true, message: t("plans.fields.taskName.required") }]}
              >
                <Input placeholder={t("plans.fields.taskName.placeholder")} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("plans.fields.taskType.label", "Task Type")}
                name="task_type"
                rules={[{ required: true, message: t("plans.fields.taskType.required") }]}
              >
                <Select
                  options={getTaskTypeOptions()}
                  placeholder={t("plans.fields.taskType.placeholder")}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("plans.fields.startDate.label", "Start Date")}
                name="start_date"
                rules={[{ required: true, message: t("plans.fields.startDate.required") }]}
              >
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: "100%" }}
                  placeholder={t("plans.fields.startDate.placeholder")}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("plans.fields.endDate.label", "End Date")}
                name="end_date"
                rules={[{ required: true, message: t("plans.fields.endDate.required") }]}
              >
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: "100%" }}
                  placeholder={t("plans.fields.endDate.placeholder")}
                />
              </Form.Item>
            </Col>
          </Row>

          {(taskType === "harvesting" || taskType === "packaging" || taskType === "inspecting") && (
            <Form.Item
              label={t("plans.fields.description.label", "Description")}
              name="description"
            >
              <Input.TextArea
                rows={3}
                placeholder={t("plans.fields.description.placeholder", "Enter description")}
              />
            </Form.Item>
          )}

          {taskType === "caring" && (
            <>
              <div className="form-section">
                <div className="section-header">
                  <h4>{t("plans.fields.fertilizers.label", "Fertilizers")}</h4>
                  <Button
                    type="dashed"
                    onClick={() => addField(fertilizerFields, setFertilizerFields)}
                    style={{ marginBottom: 16 }}
                  >
                    + {t("buttons.addFertilizer", "Add Fertilizer")}
                  </Button>
                </div>

                {fertilizerFields.map((field) => (
                  <div
                    key={field.id}
                    style={{
                      marginBottom: 16,
                      border: "1px dashed #d9d9d9",
                      padding: 16,
                      borderRadius: 4,
                    }}
                  >
                    <Row gutter={16} align="middle">
                      <Col span={10}>
                        <Form.Item
                          label={t("plans.fields.fertilizerId.label", "Fertilizer")}
                          name={`fertilizer_id_${field.id}`}
                          rules={[
                            {
                              required: true,
                              message: t(
                                "plans.fields.fertilizerId.required",
                                "Fertilizer is required",
                              ),
                            },
                          ]}
                        >
                          <Select
                            placeholder={t(
                              "plans.fields.fertilizerId.placeholder",
                              "Select fertilizer",
                            )}
                            {...fertilizerSelectProps}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          label={t("plans.fields.quantity.label", "Quantity")}
                          name={`fertilizer_quantity_${field.id}`}
                          rules={[
                            {
                              required: true,
                              message: t("plans.fields.quantity.required", "Quantity is required"),
                            },
                          ]}
                        >
                          <InputNumber min={0.1} step={0.1} style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          label={t("plans.fields.unit.label", "Unit")}
                          name={`fertilizer_unit_${field.id}`}
                          rules={[
                            {
                              required: true,
                              message: t("plans.fields.unit.required", "Unit is required"),
                            },
                          ]}
                        >
                          <Select
                            placeholder={t("plans.fields.unit.placeholder", "Select unit")}
                            options={[
                              { label: "kg", value: "kg" },
                              { label: "g", value: "g" },
                              { label: "l", value: "l" },
                              { label: "ml", value: "ml" },
                            ]}
                          />
                        </Form.Item>
                      </Col>
                      <Col>
                        <Button
                          shape="circle"
                          danger
                          onClick={() =>
                            removeField(field.id, fertilizerFields, setFertilizerFields)
                          }
                        >
                          <DeleteOutlined />
                        </Button>
                      </Col>
                    </Row>
                  </div>
                ))}
              </div>

              <div className="form-section">
                <div className="section-header">
                  <h4>{t("plans.fields.pesticides.label", "Pesticides")}</h4>
                  <Button
                    type="dashed"
                    onClick={() => addField(pesticideFields, setPesticideFields)}
                    style={{ marginBottom: 16 }}
                  >
                    + {t("buttons.addPesticide", "Add Pesticide")}
                  </Button>
                </div>

                {pesticideFields.map((field) => (
                  <div
                    key={field.id}
                    style={{
                      marginBottom: 16,
                      border: "1px dashed #d9d9d9",
                      padding: 16,
                      borderRadius: 4,
                    }}
                  >
                    <Row gutter={16} align="middle">
                      <Col span={10}>
                        <Form.Item
                          label={t("plans.fields.pesticideId.label", "Pesticide")}
                          name={`pesticide_id_${field.id}`}
                          rules={[
                            {
                              required: true,
                              message: t(
                                "plans.fields.pesticideId.required",
                                "Pesticide is required",
                              ),
                            },
                          ]}
                        >
                          <Select
                            placeholder={t(
                              "plans.fields.pesticideId.placeholder",
                              "Select pesticide",
                            )}
                            {...pesticideSelectProps}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          label={t("plans.fields.quantity.label", "Quantity")}
                          name={`pesticide_quantity_${field.id}`}
                          rules={[
                            {
                              required: true,
                              message: t("plans.fields.quantity.required", "Quantity is required"),
                            },
                          ]}
                        >
                          <InputNumber min={0.1} step={0.1} style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          label={t("plans.fields.unit.label", "Unit")}
                          name={`pesticide_unit_${field.id}`}
                          rules={[
                            {
                              required: true,
                              message: t("plans.fields.unit.required", "Unit is required"),
                            },
                          ]}
                        >
                          <Select
                            placeholder={t("plans.fields.unit.placeholder", "Select unit")}
                            options={[
                              { label: "kg", value: "kg" },
                              { label: "g", value: "g" },
                              { label: "l", value: "l" },
                              { label: "ml", value: "ml" },
                            ]}
                          />
                        </Form.Item>
                      </Col>
                      <Col>
                        <Button
                          danger
                          shape="circle"
                          onClick={() => removeField(field.id, pesticideFields, setPesticideFields)}
                        >
                          <DeleteOutlined />
                        </Button>
                      </Col>
                    </Row>
                  </div>
                ))}
              </div>
            </>
          )}

          {(taskType === "caring" || taskType === "harvesting" || taskType === "packaging") && (
            <div className="form-section">
              <div className="section-header">
                <h4>{t("plans.fields.items.label", "Items")}</h4>
                <Button
                  type="dashed"
                  onClick={() => addField(itemFields, setItemFields)}
                  style={{ marginBottom: 16 }}
                >
                  + {t("buttons.addItem", "Add Item")}
                </Button>
              </div>

              {itemFields.map((field) => (
                <div
                  key={field.id}
                  style={{
                    marginBottom: 16,
                    border: "1px dashed #d9d9d9",
                    padding: 16,
                    borderRadius: 4,
                  }}
                >
                  <Row gutter={16} align="middle">
                    <Col span={10}>
                      <Form.Item
                        label={t("plans.fields.itemId.label", "Item")}
                        name={`item_id_${field.id}`}
                        rules={[
                          {
                            required: true,
                            message: t("plans.fields.itemId.required", "Item is required"),
                          },
                        ]}
                      >
                        <Select
                          placeholder={t("plans.fields.itemId.placeholder", "Select item")}
                          {...itemSelectProps}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        label={t("plans.fields.quantity.label", "Quantity")}
                        name={`item_quantity_${field.id}`}
                        rules={[
                          {
                            required: true,
                            message: t("plans.fields.quantity.required", "Quantity is required"),
                          },
                        ]}
                      >
                        <InputNumber min={1} style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        label={t("plans.fields.unit.label", "Unit")}
                        name={`item_unit_${field.id}`}
                        rules={[
                          {
                            required: true,
                            message: t("plans.fields.unit.required", "Unit is required"),
                          },
                        ]}
                      >
                        <Select
                          placeholder={t("plans.fields.unit.placeholder", "Select unit")}
                          options={[
                            { label: "piece", value: "piece" },
                            { label: "set", value: "set" },
                            { label: "box", value: "box" },
                          ]}
                        />
                      </Form.Item>
                    </Col>
                    <Col>
                      <Button
                        danger
                        shape="circle"
                        onClick={() => removeField(field.id, itemFields, setItemFields)}
                      >
                        <DeleteOutlined />
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}
            </div>
          )}
        </Form>
      </Spin>
    </Modal>
  );
};
