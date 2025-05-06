import { SaveButton, useDrawerForm } from "@refinedev/antd";
import { type BaseKey, useApiUrl, useGetToPath, useGo } from "@refinedev/core";
import {
  Form,
  Input,
  InputNumber,
  Upload,
  Grid,
  Button,
  Flex,
  Avatar,
  Spin,
  message,
  Select,
  Card,
  Typography,
  theme,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useSearchParams } from "react-router";
import { PlantType } from "../plant-type";

import { useTranslation } from "react-i18next";
import { axiosInstance } from "@/rest-data-provider/utils";

type Props = {
  id?: BaseKey;
  action: "edit" | "create";
  open?: boolean;
  onClose?: () => void;
  onMutationSuccess?: () => void;
};

export const PlantDrawerForm = (props: Props) => {
  const [previewImage, setPreviewImage] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const apiUrl = useApiUrl();
  const breakpoint = Grid.useBreakpoint();
  const { token } = theme.useToken();

  const { formProps, close, saveButtonProps, formLoading } = useDrawerForm<any>({
    resource: "plants",
    id: props?.id,
    action: props.action,
    redirect: false,
    queryOptions: {
      enabled: props.action === "edit",
      onSuccess: (data) => {
        if (data?.data?.image_url) {
          setPreviewImage(data.data.image_url);
          formProps.form.setFieldsValue({
            ...data?.data,
          });
        }
      },
    },
    onMutationSuccess: () => {
      props.onMutationSuccess?.();
    },
  });

  const onModalClose = () => {
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

  const uploadImage = async ({ onSuccess, onError, file }: any) => {
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    try {
      const response = await axiosInstance.post(`${apiUrl}/plants/images/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.status === 200 && response.data.data?.length) {
        const uploadedImageUrl = response.data.data[0];
        setPreviewImage(uploadedImageUrl);
        onSuccess(uploadedImageUrl);
        formProps.form.setFieldValue("image_url", uploadedImageUrl);
      } else {
        throw new Error(response.data.message || "Upload failed.");
      }
    } catch (error) {
      message.error("Image upload failed.");
      onError(error);
    } finally {
      setUploading(false);
    }
  };

  const { t } = useTranslation();

  return (
    <Card
      title={
        <Typography.Title level={4} style={{ margin: 0, color: token.colorPrimary }}>
          {props.action === "create" ? "Thêm giống cây trồng" : "Chỉnh sửa giống cây trồng"}
        </Typography.Title>
      }
      style={{
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        borderRadius: "12px",
      }}
    >
      <Spin spinning={formLoading}>
        <Form {...formProps} layout="vertical">
          <div
            style={{
              padding: "24px",
              backgroundColor: token.colorBgLayout,
              borderRadius: "8px",
              marginBottom: "24px",
            }}
          >
            <Typography.Title level={5} style={{ marginBottom: 16, color: token.colorPrimary }}>
              Thông tin cơ bản
            </Typography.Title>

            <Form.Item name="image_url" valuePropName="file">
              <Upload.Dragger
                name="file"
                customRequest={uploadImage}
                maxCount={1}
                accept=".png,.jpg,.jpeg"
                showUploadList={false}
                style={{
                  padding: "24px",
                  backgroundColor: token.colorBgContainer,
                  borderRadius: "8px",
                  border: `1px dashed ${token.colorBorderSecondary}`,
                }}
              >
                <Flex vertical align="center" justify="center" gap={16}>
                  <Avatar
                    shape="square"
                    src={previewImage || "/images/plant-default-img.png"}
                    alt={t("plant.imageAlt")}
                    style={{
                      width: "200px",
                      height: "200px",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Button icon={<UploadOutlined />} disabled={uploading} type="primary">
                    {uploading ? t("plant.uploading") : t("plant.upload")}
                  </Button>
                </Flex>
              </Upload.Dragger>
            </Form.Item>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "16px",
                marginTop: "24px",
              }}
            >
              <Form.Item
                label={t("plant.name")}
                name="plant_name"
                rules={[{ required: true, message: t("plant.nameRequired") }]}
              >
                <Input placeholder={t("plant.namePlaceholder")} style={{ borderRadius: "6px" }} />
              </Form.Item>

              <Form.Item
                label={t("plant.type")}
                name="type"
                rules={[{ required: true, message: t("plant.typeRequired") }]}
              >
                <Select placeholder={t("plant.typePlaceholder")} style={{ borderRadius: "6px" }}>
                  {Object.values(PlantType).map((type) => (
                    <Select.Option key={type} value={type}>
                      {type}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label={t("plant.quantity")}
                name="quantity"
                rules={[{ required: true, message: t("plant.quantityRequired") }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%", borderRadius: "6px" }}
                  placeholder={t("plant.quantityPlaceholder")}
                />
              </Form.Item>

              <Form.Item
                label={t("plant.basePrice")}
                name="base_price"
                rules={[{ required: true, message: t("plant.basePriceRequired") }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%", borderRadius: "6px" }}
                  placeholder={t("plant.basePricePlaceholder")}
                />
              </Form.Item>
            </div>

            <Form.Item
              label={t("plant.preservationDay")}
              name="preservation_day"
              style={{ marginTop: "16px" }}
            >
              <InputNumber
                min={0}
                style={{ width: "100%", borderRadius: "6px" }}
                placeholder={t("plant.preservationDayPlaceholder")}
              />
            </Form.Item>

            <Form.Item
              label={t("plant.description")}
              name="description"
              rules={[{ required: true, message: t("plant.descriptionRequired") }]}
              style={{ marginTop: "16px" }}
            >
              <Input.TextArea
                rows={3}
                placeholder={t("plant.descriptionPlaceholder")}
                style={{ borderRadius: "6px" }}
              />
            </Form.Item>
          </div>

          <div
            style={{
              padding: "24px",
              backgroundColor: token.colorBgLayout,
              borderRadius: "8px",
              marginBottom: "24px",
            }}
          >
            <Typography.Title level={5} style={{ marginBottom: 16, color: token.colorPrimary }}>
              Tỉ lệ giá
            </Typography.Title>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "16px",
              }}
            >
              <Form.Item
                label={t("plant.deltaOne")}
                name="delta_one"
                rules={[{ required: true, message: "Vui lòng nhập tỉ lệ 1" }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%", borderRadius: "6px" }}
                  placeholder={t("plant.deltaOnePlaceholder")}
                />
              </Form.Item>

              <Form.Item
                label={t("plant.deltaTwo")}
                name="delta_two"
                rules={[{ required: true, message: "Vui lòng nhập tỉ lệ 2" }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%", borderRadius: "6px" }}
                  placeholder={t("plant.deltaTwoPlaceholder")}
                />
              </Form.Item>

              <Form.Item
                label={t("plant.deltaThree")}
                name="delta_three"
                rules={[{ required: true, message: "Vui lòng nhập tỉ lệ 3" }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%", borderRadius: "6px" }}
                  placeholder={t("plant.deltaThreePlaceholder")}
                />
              </Form.Item>
            </div>
          </div>

          <div
            style={{
              padding: "24px",
              backgroundColor: token.colorBgLayout,
              borderRadius: "8px",
            }}
          >
            <Form.Item
              label={t("plant.status")}
              name="status"
              rules={[{ required: true, message: t("plant.statusRequired") }]}
              style={{ margin: 0 }}
            >
              <Select
                placeholder={t("plant.statusPlaceholder")}
                style={{ width: "100%", borderRadius: "6px" }}
              >
                <Select.Option value="Available">Khả dụng</Select.Option>
                <Select.Option value="Unavailable">Không khả dụng</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Flex justify="flex-end" gap={16} style={{ marginTop: "24px" }}>
            <Button
              onClick={onModalClose}
              style={{
                borderRadius: "6px",
                padding: "4px 16px",
              }}
            >
              {t("actions.cancel")}
            </Button>

            <SaveButton
              {...saveButtonProps}
              htmlType="submit"
              type="primary"
              style={{
                borderRadius: "6px",
                padding: "4px 16px",
              }}
            >
              {t("buttons.save")}
            </SaveButton>
          </Flex>
        </Form>
      </Spin>
    </Card>
  );
};
