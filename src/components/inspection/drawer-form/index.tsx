import { SaveButton, useDrawerForm } from "@refinedev/antd";
import { type BaseKey, useGetToPath, useGo } from "@refinedev/core";
import { Form, Input, DatePicker, Button, Flex, Drawer, Spin, Select } from "antd";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import dayjs from "dayjs";

type Props = {
  id?: BaseKey;
  action: "edit" | "create";
  open?: boolean;
  onClose?: () => void;
  onMutationSuccess?: () => void;
  initialValues?: any;
};

export const InspectionDrawerForm = (props: Props) => {
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const [form] = Form.useForm();

  const { drawerProps, formProps, close, saveButtonProps } = useDrawerForm<any>({
    resource: "inspecting-forms",
    id: props?.id,
    action: props.action,
    redirect: false,
    queryOptions: {
      enabled: props.action === "edit",
      onSuccess: (data) => {
        if (data?.data) {
          setFormLoading(false);
          const formattedData = {
            ...data.data,
            start_date: data.data.start_date ? dayjs(data.data.start_date) : null,
            end_date: data.data.end_date ? dayjs(data.data.end_date) : null,
          };
          form.setFieldsValue(formattedData);
        }
      },
    },
    onMutationSuccess: () => {
      props.onMutationSuccess?.();
    },
  });
  useEffect(() => {
    if (props.open && props.initialValues) {
      console.log("Received initialValues:", props.initialValues);

      const formattedData = {
        ...props.initialValues,
        start_date: props.initialValues.start_date ? dayjs(props.initialValues.start_date) : null,
        end_date: props.initialValues.end_date ? dayjs(props.initialValues.end_date) : null,
      };

      console.log("Formatted Data:", formattedData);

      form.setFieldsValue(formattedData);
    }
  }, [props.open, props.initialValues]);

  const onDrawerClose = () => {
    form.resetFields();
    close();
    if (props?.onClose) {
      props.onClose();
      return;
    }
    go({
      to: searchParams.get("to") ?? getToPath({ action: "list" }) ?? "",
      query: { to: undefined },
      options: { keepQuery: true },
      type: "replace",
    });
  };

  const title = props.action === "edit" ? "Chỉnh Sửa" : "Thêm";

  return (
    <Drawer {...drawerProps} open={props.open} title={title} width={500} onClose={onDrawerClose}>
      <Spin spinning={formLoading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={formProps?.onFinish}
          onValuesChange={formProps?.onValuesChange}
        >
          <Form.Item
            label="Tên kế hoạch"
            name="task_name"
            rules={[{ required: true, message: "Please enter task name!" }]}
          >
            <Input placeholder="Enter task name" />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <Input.TextArea rows={3} placeholder="Enter description" />
          </Form.Item>

          <Form.Item
            label="Ngày bắt đầu"
            name="start_date"
            rules={[{ required: true, message: "Please select start date!" }]}
          >
            <DatePicker style={{ width: "100%" }} showTime placeholder="Select start date" />
          </Form.Item>

          <Form.Item
            label="Ngày kết thúc"
            name="end_date"
            rules={[{ required: true, message: "Please select end date!" }]}
          >
            <DatePicker style={{ width: "100%" }} showTime placeholder="Select end date" />
          </Form.Item>

          <Form.Item
            label="Cập nhật bởi"
            name="updated_by"
            rules={[{ required: true, message: "Please enter who updated this form!" }]}
          >
            <Input placeholder="Enter name of person updating" />
          </Form.Item>

          <Flex justify="space-between" style={{ paddingTop: 16 }}>
            <Button onClick={onDrawerClose}>Hủy</Button>
            <SaveButton {...saveButtonProps} htmlType="submit" type="primary">
              Lưu
            </SaveButton>
          </Flex>
        </Form>
      </Spin>
    </Drawer>
  );
};
