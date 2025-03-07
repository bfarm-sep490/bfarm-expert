import {
  DateField,
  SaveButton,
  TagField,
  Title,
  useDrawerForm,
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
} from "antd";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
type ReportProblemProps = {
  status?: string;
  open: boolean;
  close: () => void;
};
export const ReportProblemModal = (props: ReportProblemProps) => {
  const { id } = useParams();
  const { modalProps, formProps, close, onFinish, formLoading } = useModalForm<any>({
    resource: "problems",
    id,
    action: "edit",
    redirect: false,
  });
  const navigate = useNavigate();
  const breakpoint = { sm: window.innerWidth > 576 };

  const statusOptions = [
    { label: "Cancelled", value: "Cancelled" },
    { label: "Resovled", value: "Resolved" },
  ];
  return (
    <>
      <Modal
        {...modalProps}
        open={props.open}
        title={"Kết quả vấn đề"}
        width={breakpoint.sm ? "378px" : "100%"}
        zIndex={1001}
        onClose={props?.close}
        onCancel={props?.close}
        onOk={onFinish}
      >
        <Spin spinning={formLoading}>
          <Form {...formProps} layout="vertical">
            <Form.Item
              label="Kết quả"
              name="result"
              rules={[{ required: true, message: "Vui lòng nhập kết quả" }]}
            >
              <Input.TextArea name="result" />
            </Form.Item>

            <Form.Item label="Status" name="status" rules={[{ required: true }]}>
              <Select defaultValue={props.status} options={statusOptions} />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};
