import { SaveButton, useDrawerForm } from "@refinedev/antd";
import { type BaseKey, useGetToPath, useGo } from "@refinedev/core";
import { Form, Input, DatePicker, Button, Flex, Drawer, Spin } from "antd";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

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
      const formattedData = {
        ...props.initialValues,
        start_date: props.initialValues.start_date ? dayjs(props.initialValues.start_date) : null,
        end_date: props.initialValues.end_date ? dayjs(props.initialValues.end_date) : null,
      };

      form.setFieldsValue(formattedData);
    }
  }, [props.open, props.initialValues, form]);

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

  const { t } = useTranslation();

  const title = props.action === "edit" ? t("inspections.edit") : t("inspections.add");

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
            label={t("inspections.task_name")}
            name="task_name"
            rules={[{ required: true, message: t("inspections.task_name_required") }]}
          >
            <Input placeholder={t("inspections.task_name_placeholder")} />
          </Form.Item>

          <Form.Item
            label={t("inspections.description")}
            name="description"
            rules={[{ required: true, message: t("inspections.description_required") }]}
          >
            <Input.TextArea rows={3} placeholder={t("inspections.description_placeholder")} />
          </Form.Item>

          <Form.Item
            label={t("inspections.start_date")}
            name="start_date"
            rules={[{ required: true, message: t("inspections.start_date_required") }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              showTime
              placeholder={t("inspections.start_date_placeholder")}
            />
          </Form.Item>

          <Form.Item
            label={t("inspections.end_date")}
            name="end_date"
            rules={[{ required: true, message: t("inspections.end_date_required") }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              showTime
              placeholder={t("inspections.end_date_placeholder")}
            />
          </Form.Item>

          <Form.Item
            label={t("inspections.updated_by")}
            name="updated_by"
            rules={[{ required: true, message: t("inspections.updated_by_required") }]}
          >
            <Input placeholder={t("inspections.updated_by_placeholder")} />
          </Form.Item>

          <Flex justify="space-between" style={{ paddingTop: 16 }}>
            <Button onClick={onDrawerClose}>{t("actions.cancel")}</Button>
            <SaveButton {...saveButtonProps} htmlType="submit" type="primary">
              {t("buttons.save")}
            </SaveButton>
          </Flex>
        </Form>
      </Spin>
    </Drawer>
  );
};
