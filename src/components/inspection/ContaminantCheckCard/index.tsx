import React, { useMemo } from "react";
import { Card, Flex, Typography, Space, Table, Tag, Tooltip, theme, Modal } from "antd";
import { ExperimentOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { chemicalGroups, mustBeZeroKeys } from "../chemical/ChemicalConstants";
import { getContaminantsByType } from "../getContaminantsByType";
import { useTranslate } from "@refinedev/core";
import { getChemicalExplanation } from "../chemicalExplanation";

interface ContaminantCheckCardProps {
  type: string | undefined;
  style?: React.CSSProperties;
}

export const ContaminantCheckCard: React.FC<ContaminantCheckCardProps> = ({ style, type }) => {
  const { token } = theme.useToken();
  const mustBeZero = mustBeZeroKeys;
  const contaminants = useMemo(() => getContaminantsByType(type), [type]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalContent, setModalContent] = React.useState<string | null>(null);

  const t = useTranslate();

  return (
    <Card
      variant="borderless"
      style={{
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadow,
        background: token.colorBgContainer,
        ...style,
      }}
    >
      <ExperimentOutlined style={{ color: token.colorPrimary, fontSize: 28 }} />
      <Flex vertical style={{ gap: 4 }}>
        <Typography.Title level={3} style={{ margin: 0, color: token.colorPrimary }}>
          {t("contaminant.title")}
        </Typography.Title>
        {type && (
          <Tag
            color="blue"
            style={{
              fontSize: 16,
              padding: "4px 12px",
              borderRadius: token.borderRadiusLG,
              fontWeight: "bold",
              width: "fit-content",
            }}
          >
            {t("contaminant.plantType")}: {type}
          </Tag>
        )}

        <Typography.Text
          style={{
            fontSize: 14,
            marginTop: 4,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <InfoCircleOutlined style={{ color: token.colorPrimary }} />
          <span>
            <span style={{ color: token.colorError, fontWeight: 500 }}>
              MRL (Maximum Residue Level)
            </span>
            <span style={{ color: token.colorText, marginLeft: 4 }}>: {t("mrl.description")}</span>
          </span>
        </Typography.Text>
      </Flex>

      <Typography.Text
        type="secondary"
        italic
        style={{
          fontSize: 14,
          display: "block",
          marginBottom: 8,
          color: token.colorError,
        }}
      >
        {t("contaminant.note")}
      </Typography.Text>

      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {chemicalGroups.map((group) => {
          const groupContaminants = contaminants.filter((item) => group.keys.includes(item.key));
          if (groupContaminants.length === 0) return null;

          return (
            <Card
              key={group.title}
              title={
                <Flex align="center" gap={8}>
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      backgroundColor: group.color,
                    }}
                  />
                  <Typography.Title
                    level={4}
                    style={{ margin: 0, color: group.color, fontSize: 18 }}
                  >
                    {t(group.title)}
                  </Typography.Title>
                </Flex>
              }
              styles={{
                header: {
                  borderBottom: `2px solid ${group.color}`,
                  padding: "12px 16px",
                  backgroundColor: token.colorBgElevated,
                },
                body: {
                  padding: "16px",
                },
              }}
              style={{
                borderRadius: token.borderRadiusLG,
                boxShadow: token.boxShadow,
                backgroundColor: token.colorBgElevated,
              }}
            >
              <Table
                rowKey="key"
                dataSource={groupContaminants}
                columns={[
                  {
                    title: t("contaminant.table.chemicalName"),
                    dataIndex: "name",
                    key: "name",
                    render: (text, record) => {
                      const isZero = mustBeZero.includes(record.key);
                      return (
                        <Flex align="center" gap={8}>
                          <Typography.Text strong>
                            {`${text} (MRL: ${isZero ? "0" : record.danger} ${record.unit})`}
                            {isZero && (
                              <Typography.Text type="danger" strong style={{ marginLeft: 4 }}>
                                (*)
                              </Typography.Text>
                            )}
                          </Typography.Text>
                          <Tooltip
                            title={
                              <div>
                                <div>
                                  {record.key === "nano3_kno3"
                                    ? "Không có dư lượng cụ thể"
                                    : isZero
                                      ? "Bắt buộc bằng 0"
                                      : `Cảnh báo: > ${record.warning} ${record.unit}, Nguy hiểm: ≥ ${record.danger} ${record.unit}`}
                                </div>
                                <div
                                  style={{
                                    color: token.colorLink,
                                    cursor: "pointer",
                                    marginTop: 4,
                                    textDecoration: "underline",
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const explanation = getChemicalExplanation(record.key);
                                    setModalContent(explanation);
                                    setModalVisible(true);
                                  }}
                                >
                                  Chi tiết
                                </div>
                              </div>
                            }
                          >
                            <InfoCircleOutlined
                              style={{
                                color: token.colorPrimary,
                                cursor: "pointer",
                                fontSize: 14,
                              }}
                            />
                          </Tooltip>
                        </Flex>
                      );
                    },
                    width: "40%",
                  },
                  {
                    title: t("contaminant.table.warningLimit"),
                    dataIndex: "warning",
                    key: "warning",
                    render: (value: string, record) => {
                      const isNaNO3 = record.key === "nano3_kno3";
                      return (
                        <Tag
                          color="gold"
                          style={{
                            fontSize: 14,
                            padding: "4px 8px",
                            borderRadius: token.borderRadiusSM,
                          }}
                        >
                          {isNaNO3
                            ? value
                            : `${value.includes(">") || value.includes("<") ? value : `> ${value}`} ${record.unit}`}
                        </Tag>
                      );
                    },
                    width: "25%",
                  },
                  {
                    title: t("contaminant.table.dangerLimit"),
                    dataIndex: "danger",
                    key: "danger",
                    render: (value: string, record) => {
                      const isNaNO3 = record.key === "nano3_kno3";
                      return (
                        <Tag
                          color="red"
                          style={{
                            fontSize: 14,
                            padding: "4px 8px",
                            borderRadius: token.borderRadiusSM,
                          }}
                        >
                          {isNaNO3
                            ? value
                            : `${value.includes(">") || value.includes("<") ? value : `≥ ${value}`} ${record.unit}`}
                        </Tag>
                      );
                    },
                    width: "25%",
                  },
                ]}
                pagination={false}
                bordered
                size="middle"
                style={{
                  marginTop: 12,
                  borderRadius: token.borderRadiusLG,
                }}
                rowClassName={(_, index) =>
                  index % 2 === 0 ? "table-row-light" : "table-row-dark"
                }
              />
            </Card>
          );
        })}
      </Space>
      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        centered
        width={900}
        styles={{
          body: {
            backgroundColor: token.colorBgContainer,
            padding: 24,
            borderRadius: token.borderRadiusLG,
            boxShadow: token.boxShadowSecondary,
          },
        }}
        title={
          <Typography.Title
            level={4}
            style={{
              margin: 0,
              color: token.colorPrimary,
              fontWeight: 600,
            }}
          >
            🧪 Giải thích chi tiết về tiêu chí kiểm định
          </Typography.Title>
        }
      >
        <Typography.Paragraph
          style={{
            whiteSpace: "pre-line",
            maxHeight: 500,
            overflowY: "auto",
            fontSize: 16,
            lineHeight: 1.75,
            color: token.colorText,
            paddingRight: 8,
          }}
        >
          {modalContent}
        </Typography.Paragraph>

        <Flex justify="end">
          <button
            onClick={() => setModalVisible(false)}
            style={{
              marginTop: 24,
              padding: "8px 20px",
              fontSize: 14,
              fontWeight: 500,
              borderRadius: 8,
              backgroundColor: token.colorPrimary,
              color: "white",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            Đóng
          </button>
        </Flex>
      </Modal>
    </Card>
  );
};
