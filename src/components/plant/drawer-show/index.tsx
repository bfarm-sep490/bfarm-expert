import React, { useState } from "react";
import "./styles.css";
import {
  useBack,
  useDelete,
  useGetToPath,
  useGo,
  useList,
  useShow,
  useTranslate,
} from "@refinedev/core";
import {
  Avatar,
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  List,
  Space,
  Tooltip,
  Typography,
  notification,
  theme,
  Popconfirm,
} from "antd";
import { useParams, useSearchParams } from "react-router";
import { DeleteButton } from "@refinedev/antd";
import {
  AreaChartOutlined,
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  ExperimentOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import { PlantDrawerForm } from "../drawer-form";
import { PlantStatusTag } from "../status";
import { AddSuitableModal } from "../add-modal";

type Props = {
  onClose?: () => void;
};

export const PlantDrawerShow: React.FC<Props> = ({ onClose }) => {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const t = useTranslate();
  const { token } = theme.useToken();
  const breakpoint = Grid.useBreakpoint();
  const [api, contextHolder] = notification.useNotification();
  const { queryResult } = useShow({
    resource: "plants",
    id,
  });

  const plant = queryResult?.data?.data;

  const {
    data: yieldsData,
    isLoading: isYieldsLoading,
    refetch: yieldRefetch,
  } = useList({
    resource: `plants/${id}/suggest-yields`,
  });

  const yields = yieldsData?.data ?? [];

  const handleDrawerClose = () => {
    if (onClose) {
      onClose();
      return;
    }

    go({
      to: searchParams.get("to") ?? getToPath({ action: "list" }) ?? "",
      query: { to: undefined },
      options: { keepQuery: true },
      type: "replace",
    });
  };

  const getAvatarColor = (name: any) => {
    const colors = [
      "#f56a00",
      "#7265e6",
      "#ffbf00",
      "#00a2ae",
      "#87d068",
      "#108ee9",
      "#722ed1",
      "#eb2f96",
    ];
    const charCode = name.charCodeAt(0);
    return colors[charCode % colors.length];
  };

  const getInitials = (name: any) => {
    return name.charAt(0).toUpperCase();
  };

  const back = useBack();
  const { mutate } = useDelete({});

  const handleDelete = (value: number) => {
    mutate(
      {
        resource: `plants/${id}`,
        values: {
          plant_id: plant?.id,
          yield_id: value,
        },
        id: "suggest-yields?yield_id=" + value,
      },
      {
        onSuccess: () => {
          api.success({
            message: t("plant.suitableYields.deleteSuccess"),
          });
          yieldRefetch();
        },
        onError: () => {
          api.error({
            message: t("plant.suitableYields.deleteError"),
          });
        },
      },
    );
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      {contextHolder}
      <Button
        type="text"
        style={{
          width: "40px",
          height: "40px",
          marginBottom: "16px",
          transition: "all 0.3s",
        }}
        className="hover-bg"
        onClick={() => back()}
      >
        <ArrowLeftOutlined style={{ fontSize: "20px" }} />
      </Button>

      {!isEditing && plant && (
        <Flex gap={24} wrap="wrap">
          <Card
            className="plant-info-card"
            loading={queryResult?.isLoading}
            title={
              <Typography.Title level={4} style={{ margin: 0 }}>
                {t("plant.basicInfo.title")}
              </Typography.Title>
            }
            style={{
              flex: "1 1 400px",
              minWidth: "300px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              borderRadius: "12px",
            }}
            bodyStyle={{ padding: "24px" }}
          >
            <Flex align="center" justify="center" style={{ marginBottom: "24px" }}>
              <Avatar
                shape="square"
                style={{
                  aspectRatio: 1,
                  objectFit: "cover",
                  width: "280px",
                  height: "280px",
                  borderRadius: "12px",
                  border: `1px solid ${token.colorBorderSecondary}`,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
                src={plant.image_url}
                alt={plant.plant_name}
              />
            </Flex>

            <Divider style={{ margin: "24px 0" }} />

            <Flex style={{ marginBottom: "24px" }} justify="space-between" align="center">
              <Typography.Title level={5} style={{ margin: 0, color: token.colorPrimary }}>
                {t("plant.title")}
              </Typography.Title>
              <Space>
                <DeleteButton
                  type="text"
                  recordItemId={plant.id}
                  resource="plants"
                  onSuccess={handleDrawerClose}
                  style={{
                    color: token.colorError,
                  }}
                  className="hover-error-bg"
                >
                  {t("actions.delete")}
                </DeleteButton>
                <Button icon={<EditOutlined />} onClick={() => setIsEditing(true)} type="primary">
                  {t("actions.edit")}
                </Button>
              </Space>
            </Flex>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  padding: "16px",
                  backgroundColor: token.colorBgLayout,
                  borderRadius: "8px",
                  border: `1px solid ${token.colorBorderSecondary}`,
                }}
              >
                <Typography.Text type="secondary" style={{ display: "block", marginBottom: "8px" }}>
                  {t("plant.quantity")}
                </Typography.Text>
                <Typography.Text strong style={{ fontSize: "16px" }}>
                  {plant.quantity}
                </Typography.Text>
              </div>

              <div
                style={{
                  padding: "16px",
                  backgroundColor: token.colorBgLayout,
                  borderRadius: "8px",
                  border: `1px solid ${token.colorBorderSecondary}`,
                }}
              >
                <Typography.Text type="secondary" style={{ display: "block", marginBottom: "8px" }}>
                  {t("plant.basePrice")}
                </Typography.Text>
                <Typography.Text strong style={{ fontSize: "16px", color: token.colorSuccess }}>
                  {plant.base_price.toLocaleString()} VND
                </Typography.Text>
              </div>

              <div
                style={{
                  padding: "16px",
                  backgroundColor: token.colorBgLayout,
                  borderRadius: "8px",
                  border: `1px solid ${token.colorBorderSecondary}`,
                }}
              >
                <Typography.Text type="secondary" style={{ display: "block", marginBottom: "8px" }}>
                  {t("plant.preservationDay")}
                </Typography.Text>
                <Typography.Text strong style={{ fontSize: "16px" }}>
                  {plant.preservation_day} {t("plant.day")}
                </Typography.Text>
              </div>

              <div
                style={{
                  padding: "16px",
                  backgroundColor: token.colorBgLayout,
                  borderRadius: "8px",
                  border: `1px solid ${token.colorBorderSecondary}`,
                }}
              >
                <Typography.Text type="secondary" style={{ display: "block", marginBottom: "8px" }}>
                  {t("plant.status")}
                </Typography.Text>
                <PlantStatusTag value={plant.status} />
              </div>
            </div>

            {plant.description && (
              <div
                style={{
                  padding: "16px",
                  backgroundColor: token.colorBgLayout,
                  borderRadius: "8px",
                  border: `1px solid ${token.colorBorderSecondary}`,
                }}
              >
                <Typography.Text type="secondary" style={{ display: "block", marginBottom: "8px" }}>
                  {t("plant.description")}
                </Typography.Text>
                <Typography.Paragraph style={{ margin: 0 }}>
                  {plant.description}
                </Typography.Paragraph>
              </div>
            )}

            <Divider style={{ margin: "24px 0" }} />

            <Typography.Title level={5} style={{ marginBottom: "16px", color: token.colorPrimary }}>
              {t("plant.plantRatioTitle")}
            </Typography.Title>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "16px",
              }}
            >
              <div
                style={{
                  padding: "16px",
                  backgroundColor: token.colorBgLayout,
                  borderRadius: "8px",
                  border: `1px solid ${token.colorBorderSecondary}`,
                }}
              >
                <Typography.Text type="secondary" style={{ display: "block", marginBottom: "8px" }}>
                  {t("plant.deltaOne")}
                </Typography.Text>
                <Typography.Text strong style={{ fontSize: "16px", color: token.colorPrimary }}>
                  {plant.delta_one * 100}%
                </Typography.Text>
              </div>

              <div
                style={{
                  padding: "16px",
                  backgroundColor: token.colorBgLayout,
                  borderRadius: "8px",
                  border: `1px solid ${token.colorBorderSecondary}`,
                }}
              >
                <Typography.Text type="secondary" style={{ display: "block", marginBottom: "8px" }}>
                  {t("plant.deltaTwo")}
                </Typography.Text>
                <Typography.Text strong style={{ fontSize: "16px", color: token.colorPrimary }}>
                  {plant.delta_two * 100}%
                </Typography.Text>
              </div>

              <div
                style={{
                  padding: "16px",
                  backgroundColor: token.colorBgLayout,
                  borderRadius: "8px",
                  border: `1px solid ${token.colorBorderSecondary}`,
                }}
              >
                <Typography.Text type="secondary" style={{ display: "block", marginBottom: "8px" }}>
                  {t("plant.deltaThree")}
                </Typography.Text>
                <Typography.Text strong style={{ fontSize: "16px", color: token.colorPrimary }}>
                  {plant.delta_three * 100}%
                </Typography.Text>
              </div>
            </div>
          </Card>

          <Card
            className="suitable-yields-card"
            title={
              <Flex justify="space-between" align="center">
                <Typography.Title level={4} style={{ margin: 0 }}>
                  {t("plant.suitableYields.title")}
                </Typography.Title>
                <Button
                  onClick={() => setIsAddModalVisible(true)}
                  type="primary"
                  style={{
                    borderRadius: "6px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  {t("plant.suitableYields.add")}
                </Button>
              </Flex>
            }
            loading={isYieldsLoading}
            style={{
              flex: "1 1 400px",
              minWidth: "300px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              borderRadius: "12px",
              height: "fit-content",
            }}
            bodyStyle={{
              padding: "16px",
              maxHeight: "600px",
              overflow: "auto",
            }}
          >
            <List
              style={{
                backgroundColor: token.colorBgContainer,
              }}
              dataSource={yields}
              renderItem={(yieldItem) => (
                <List.Item
                  key={yieldItem.id}
                  style={{
                    padding: "20px",
                    transition: "all 0.3s",
                    borderBottom: `1px solid ${token.colorBorderSecondary}`,
                    borderRadius: "8px",
                    marginBottom: "12px",
                    backgroundColor: token.colorBgLayout,
                  }}
                  className="hover-bg"
                >
                  <div style={{ width: "100%" }}>
                    <Flex
                      justify="space-between"
                      align="center"
                      style={{
                        width: "100%",
                        marginBottom: "16px",
                      }}
                    >
                      <Typography.Title level={5} style={{ margin: 0, color: token.colorPrimary }}>
                        {yieldItem.yield_name}
                      </Typography.Title>
                      <Popconfirm
                        title={t("plant.suitableYields.deleteConfirm.title")}
                        description={t("plant.suitableYields.deleteConfirm.description")}
                        onConfirm={() => handleDelete(yieldItem?.id as number)}
                        okText={t("plant.suitableYields.deleteConfirm.okText")}
                        cancelText={t("plant.suitableYields.deleteConfirm.cancelText")}
                        okButtonProps={{ danger: true }}
                      >
                        <DeleteOutlined
                          style={{
                            color: token.colorError,
                            fontSize: 18,
                            cursor: "pointer",
                            transition: "all 0.3s",
                          }}
                          className="hover-error"
                        />
                      </Popconfirm>
                    </Flex>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "16px",
                      }}
                    >
                      <div
                        style={{
                          padding: "12px",
                          backgroundColor: token.colorBgContainer,
                          borderRadius: "6px",
                          border: `1px solid ${token.colorBorderSecondary}`,
                        }}
                      >
                        <Space>
                          <AreaChartOutlined
                            style={{ color: token.colorPrimary, fontSize: "16px" }}
                          />
                          <Typography.Text style={{ color: token.colorTextSecondary }}>
                            {t("plant.suitableYields.area")}:
                          </Typography.Text>
                          <Typography.Text strong>
                            {yieldItem.area} {yieldItem.area_unit}
                          </Typography.Text>
                        </Space>
                      </div>

                      <div
                        style={{
                          padding: "12px",
                          backgroundColor: token.colorBgContainer,
                          borderRadius: "6px",
                          border: `1px solid ${token.colorBorderSecondary}`,
                        }}
                      >
                        <Space>
                          <ExperimentOutlined
                            style={{ color: token.colorPrimary, fontSize: "16px" }}
                          />
                          <Typography.Text style={{ color: token.colorTextSecondary }}>
                            {t("plant.suitableYields.soilType")}:
                          </Typography.Text>
                          <Typography.Text strong>{yieldItem.type}</Typography.Text>
                        </Space>
                      </div>

                      <div
                        style={{
                          padding: "12px",
                          backgroundColor: token.colorBgContainer,
                          borderRadius: "6px",
                          border: `1px solid ${token.colorBorderSecondary}`,
                          gridColumn: "span 2",
                        }}
                      >
                        <Space>
                          <LineChartOutlined
                            style={{ color: token.colorSuccess, fontSize: "16px" }}
                          />
                          <Typography.Text style={{ color: token.colorTextSecondary }}>
                            {t("plant.suitableYields.estimatedHarvest")}:
                          </Typography.Text>
                          <Tooltip
                            title={`${t("plant.suitableYields.totalEstimatedHarvest")}: ${(
                              yieldItem.area * yieldItem.maximum_quantity
                            ).toFixed(1)} kg`}
                          >
                            <Typography.Text strong style={{ color: token.colorSuccess }}>
                              {yieldItem?.maximum_quantity} kg/m²
                            </Typography.Text>
                          </Tooltip>
                        </Space>
                      </div>
                    </div>

                    {yieldItem.description && (
                      <Typography.Paragraph
                        ellipsis={{
                          rows: 2,
                          expandable: true,
                          symbol: t("plant.suitableYields.viewMore"),
                        }}
                        style={{
                          marginTop: "16px",
                          marginBottom: 0,
                          padding: "12px",
                          backgroundColor: token.colorBgContainer,
                          borderRadius: "6px",
                          border: `1px solid ${token.colorBorderSecondary}`,
                        }}
                      >
                        <Typography.Text style={{ color: token.colorTextSecondary }}>
                          {t("plant.suitableYields.description")}:
                        </Typography.Text>{" "}
                        {yieldItem.description}
                      </Typography.Paragraph>
                    )}
                  </div>
                </List.Item>
              )}
              locale={{
                emptyText: (
                  <div style={{ padding: "32px", textAlign: "center" }}>
                    <Typography.Text type="secondary">
                      {t("plant.suitableYields.noData")}
                    </Typography.Text>
                  </div>
                ),
              }}
            />
          </Card>
        </Flex>
      )}

      <AddSuitableModal
        api={api}
        id={plant?.id as number}
        onClose={() => setIsAddModalVisible(false)}
        visible={isAddModalVisible}
        suggest_yields={yields as []}
        refresh={yieldRefetch}
      />

      {isEditing && plant && (
        <PlantDrawerForm
          id={plant.id ?? ""}
          action="edit"
          onClose={() => setIsEditing(false)}
          onMutationSuccess={() => {
            setIsEditing(false);
            queryResult.refetch();
          }}
        />
      )}
    </div>
  );
};
