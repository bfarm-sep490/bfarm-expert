import {
  DateField,
  SaveButton,
  TagField,
  Title,
  useDrawerForm,
  useForm,
  useModalForm,
} from "@refinedev/antd";
import { useShow, useNavigation, useBack, useUpdate } from "@refinedev/core";
import {
  Drawer,
  Flex,
  Grid,
  Typography,
  List,
  Divider,
  Image,
  Table,
  Radio,
  Space,
  Button,
  Modal,
  Form,
  Input,
  Spin,
  Select,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
type ReportProblemProps = {
  status?: string;
  open: boolean;
  close: () => void;
  refetch?: () => void;
};
export const ReportProblemModal = (props: ReportProblemProps) => {
  const { id } = useParams();
  const [api, context] = notification.useNotification();
  const { formProps, formLoading, saveButtonProps } = useForm<{
    result_content: string;
    status: string;
  }>({
    resource: "problems",
    id: `${id}/problem-report`,
    action: "edit",
    queryOptions: {
      enabled: false,
    },
    redirect: false,
    updateMutationOptions: {
      onSuccess: () => {
        props?.refetch?.();
        props?.close();
      },
      onError: (error) => {
        api.error({
          message: "Có lỗi xảy ra",
          description: error?.message || "Vui lòng thử lại sau",
          placement: "top",
        });
        props.close();
      },
    },
  });
  const breakpoint = { sm: window.innerWidth > 576 };

  useEffect(() => {
    if (props?.open === false) {
      formProps?.form?.resetFields();
    } else if (props?.open === true) {
      formProps?.form?.setFieldValue("status", props?.status);
    }
  }, [props?.open]);
  return (
    <>
      <Modal
        open={props.open}
        title={props?.status === "Resolve" ? "Đồng ý vấn đề" : "Từ chối vấn đề"}
        width={breakpoint.sm ? "378px" : "100%"}
        zIndex={1001}
        onClose={props?.close}
        onCancel={props?.close}
        footer={
          <Flex vertical={false} gap={8} justify="end" style={{ width: "100%" }}>
            <Button onClick={close}>Đóng</Button>
            <Button {...saveButtonProps} type="primary">
              Lưu
            </Button>
          </Flex>
        }
      >
        {context}
        <Spin spinning={formLoading}>
          <Form {...formProps} layout="vertical">
            <Form.Item
              label="Nội dung kết quả"
              name="result_content"
              rules={[{ required: true, message: "Vui lòng nhập kết quả" }]}
            >
              <Input.TextArea name="result_content" />
            </Form.Item>
            <Form.Item name="status" hidden>
              <Input name="status" hidden />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};
