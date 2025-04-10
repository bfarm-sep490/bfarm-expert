import { SaveButton, useDrawerForm } from "@refinedev/antd";
import { type BaseKey, useApiUrl, useGetToPath, useGo, useTranslate } from "@refinedev/core";
import axios from "axios";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Grid,
  Button,
  Flex,
  Avatar,
  Spin,
  DatePicker,
  message,
} from "antd";
import { useParams, useSearchParams } from "react-router";
import { Drawer } from "../../drawer";
import { UploadOutlined } from "@ant-design/icons";
import { useStyles } from "./styled";
import { IFarmer, IFertilizer } from "@/interfaces";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { before, set } from "lodash";
import moment from "moment";

type Props = {
  id?: BaseKey;
  action: "create" | "edit";
  onClose?: () => void;
  onMutationSuccess?: () => void;
};

export const InspectorDrawerForm = (props: Props) => {
  const [previewImage, setPreviewImage] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const { id } = useParams();
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const t = useTranslate();
  const breakpoint = Grid.useBreakpoint();
  const { styles, theme } = useStyles();

  const { drawerProps, formProps, close, saveButtonProps, formLoading } = useDrawerForm<{
    avatar_image: string;
    name: string;
    phone: string;
    email: string;
    status: string;
  }>({
    resource: "inspectors",
    id,
    action: props.action,
    redirect: false,
    queryOptions: {
      enabled: props.action === "edit",
      onSuccess: (data: any) => {
        if (data?.data?.image_url) {
          setPreviewImage(data?.data?.image_url);
        }
        formProps.form.setFieldsValue(data?.data);
      },
    },
    onMutationSuccess: () => {
      props.onMutationSuccess?.();
    },
  });

  const onDrawerClose = () => {
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
  useEffect(() => {
    if (props.action === "edit" && formProps.form) {
      const currentAvatar = formProps.form.getFieldValue("image_url") as string;
      console.log("currentAvatar: " + currentAvatar);
      if (currentAvatar) {
        setPreviewImage(currentAvatar);
      }
    }
  }, [props.action, formProps.form]);

  const uploadImage = async ({ onSuccess, onError, file, onProgress }: any) => {
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    try {
      const response = await axios.post(
        "https://api.outfit4rent.online/api/farmers/images/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.status === 200 && response.data.data?.length) {
        const uploadedImageUrl = response.data.data[0];
        setPreviewImage(uploadedImageUrl);
        onSuccess(uploadedImageUrl);
        formProps.form?.setFieldsValue({ avatar_image: uploadedImageUrl });
      } else {
        throw new Error(response.data.message || "Upload failed.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      onError(error);
    } finally {
      setUploading(false);
    }
  };
  const title = props.action === "edit" ? "Edit this farmer" : "Add a farmer";

  const statusOptions = [
    { label: "Active", value: "Hoạt động" },
    { label: "Inactive", value: "Không hoạt động" },
  ];
  return (
    <Drawer
      {...drawerProps}
      open={true}
      title={title}
      width={breakpoint.sm ? "378px" : "100%"}
      zIndex={1001}
      onClose={onDrawerClose}
    >
      <Spin spinning={formLoading}>
        <Form
          form={formProps?.form}
          layout="vertical"
          onFinish={formProps?.onFinish}
          onValuesChange={formProps?.onValuesChange}
        >
          <Form.Item
            name="image_url"
            valuePropName="file"
            getValueFromEvent={(e: any) => {
              return e?.file?.response ?? "/images/fertilizer-default-img.png";
            }}
            style={{ margin: 0 }}
          >
            <Upload.Dragger
              name="file"
              customRequest={uploadImage}
              maxCount={1}
              accept=".png,.jpg,.jpeg"
              className={styles.uploadDragger}
              showUploadList={false}
            >
              <Flex
                vertical
                align="center"
                justify="center"
                style={{ position: "relative", height: "100%" }}
              >
                <Avatar
                  shape="square"
                  style={{
                    aspectRatio: 1,
                    objectFit: "contain",
                    width: previewImage ? "100%" : "48px",
                    height: previewImage ? "100%" : "48px",
                    marginTop: previewImage ? undefined : "auto",
                    transform: previewImage ? undefined : "translateY(50%)",
                  }}
                  src={previewImage || "/images/fertilizer-default-img.png"}
                  alt="Farmer Image"
                />
                <Button
                  icon={<UploadOutlined />}
                  style={{
                    marginTop: "auto",
                    marginBottom: "16px",
                    backgroundColor: theme.colorBgContainer,
                  }}
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload Image"}
                </Button>
              </Flex>
            </Upload.Dragger>
          </Form.Item>
          <Flex vertical>
            <Form.Item
              key={"name"}
              label="Name"
              name="name"
              className={styles.formItem}
              rules={[
                { required: true, message: "Please input your name!" },
                {
                  min: 6,
                  max: 50,
                  message: "Name must be between 6 and 50 characters!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              key={"address"}
              label="Address"
              name="address"
              className={styles.formItem}
              rules={[{ required: true, message: "Please input the address!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              key={"phone"}
              label="Phone"
              name="phone"
              className={styles.formItem}
              rules={[
                { required: true, message: "Please input your phone!" },
                {
                  message: "The input is not valid phone number!",
                  min: 10,
                  max: 11,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              key={"email"}
              label="Email"
              name="email"
              className={styles.formItem}
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              key={"status"}
              label="Status"
              name="status"
              className={styles.formItem}
              rules={[{ required: true }]}
            >
              <Select options={statusOptions} />
            </Form.Item>
            <Flex align="center" justify="space-between" style={{ padding: "16px 16px 0px 16px" }}>
              <Button onClick={onDrawerClose}>Cancel</Button>
              <SaveButton {...saveButtonProps} htmlType="submit" type="primary" icon={null}>
                Save
              </SaveButton>
            </Flex>
          </Flex>
        </Form>
      </Spin>
    </Drawer>
  );
};
