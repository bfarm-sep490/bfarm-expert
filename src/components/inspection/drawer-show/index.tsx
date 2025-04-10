/* eslint-disable prettier/prettier */
import React, { useState, useMemo, useEffect } from "react";
import { type HttpError, useOne, useShow, useTranslate } from "@refinedev/core";
import {
  Button,
  List,
  Typography,
  Spin,
  Table,
  Alert,
  Drawer,
  Modal,
  Divider,
  theme,
} from "antd";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { IInspectingForm } from "@/interfaces";
import { InspectionDrawerForm } from "../drawer-form";
import { InspectionResultTag } from "../result";
import { InspectionStatusTag } from "../status";
import { useNavigate, useParams } from "react-router";
import dayjs from "dayjs";
import {
  chemicalGroups,
  columns,
  getChemicalData,
} from "../chemical/ChemicalConstants";
type InspectionShowProps = {
  visible?: boolean;
  onClose?: () => void;
  taskId?: number;
  refetch?: () => void;
};
export const InspectionsShow = (props: InspectionShowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedResult, setSelectedResult] = useState<IInspectingForm | null>(
    null
  );
  const { token } = theme.useToken();
  const { id } = useParams();
  const navigate = useNavigate();
  const t = useTranslate();

  const {
    data: formQueryResult,
    isLoading: inspectingLoading,
    refetch: inspectingRefetching,
    isFetching: inspectingFetching,
  } = useOne<any, HttpError>({
    resource: "inspecting-forms",
    id,
    queryOptions: { enabled: props?.visible === true },
  });

  const {
    data: resultQueryResult,
    isLoading: inspectingResultLoading,
    refetch: refetchInspectingResult,
    isFetching: inspectingResultFetching,
  } = useOne<any, HttpError>({
    resource: "inspecting-results",
    id,
    queryOptions: { enabled: props?.visible === true },
  });

  const inspection = formQueryResult?.data?.[0];

  const inspectionResult = resultQueryResult?.data?.[0];

  const chemicalData = getChemicalData(inspectionResult);

  const handleBack = () => navigate(-1);

  const handleEdit = () => {
    if (inspection) {
      const formattedInspection = {
        ...inspection,
        start_date: inspection.start_date
          ? dayjs(inspection.start_date).toISOString()
          : "",
        end_date: inspection.end_date
          ? dayjs(inspection.end_date).toISOString()
          : "",
      };
      setSelectedResult(formattedInspection);
      setIsEditing(true);
    }
  };

  const handleCloseDrawer = () => {
    setIsEditing(false);
    setSelectedResult(null);
  };
  const breakpoint = { sm: window.innerWidth > 576 };

  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);
  useEffect(() => {
    if (props?.visible === true) {
      refetchInspectingResult();
      inspectingRefetching();
    } else {
      setIsEditing(false);
      setIsModalVisible(false);
      setSelectedResult(null);
    }
  }, [props?.visible]);
  if (!inspection) return <Typography.Text></Typography.Text>;

  return (
    <Drawer
      loading={
        inspectingLoading ||
        inspectingResultFetching ||
        inspectingFetching ||
        inspectingResultLoading
      }
      open={props?.visible}
      width={breakpoint?.sm ? "60%" : "100%"}
      onClose={props?.onClose ?? handleBack}
      bodyStyle={{ padding: "24px 32px" }}
      style={{ background: token.colorBgLayout }}
      headerStyle={{
        background: token.colorBgContainer,
      }}
      title={
        <Typography.Title level={2} style={{ margin: 0 }}>
          #{inspection.id} - {inspection.task_name}
        </Typography.Title>
      }
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <Typography.Title level={3} style={{ margin: 0 }}>
          Thông tin kết quả
        </Typography.Title>

        {inspection.status !== "Cancel" && inspectionResult && (
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={handleOpenModal}
          >
            Xem chi tiết
          </Button>
        )}
      </div>

      <Divider style={{ marginTop: 0 }} />

      <div
        style={{
          border: `1px solid ${token.colorBorder}`,
          borderRadius: 8,
          padding: 16,
          marginBottom: 32,
          background: token.colorBgContainer,
        }}
      >
        {inspection.status === "Cancel" ? (
          <Typography.Text type="danger">
            Đợt kiểm nghiệm đã bị hủy. Không thể tạo kết quả.
          </Typography.Text>
        ) : inspectionResult ? (
          <List
            dataSource={[
              {
                label: "Đánh giá",
                value: (
                  <InspectionResultTag
                    value={inspectionResult.evaluated_result}
                  />
                ),
              },
              {
                label: "Nội dung",
                value: inspectionResult.result_content || "N/A",
              },
              {
                label: "Ảnh kết quả",
                value:
                  Array.isArray(inspectionResult.inspect_images) &&
                  inspectionResult.inspect_images.length > 0
                    ? "Có"
                    : "Không có",
              },
            ]}
            renderItem={(data) => (
              <List.Item>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Typography.Text strong>{data.label}</Typography.Text>
                  <Typography.Text>{data.value}</Typography.Text>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <Typography.Text type="secondary">Chưa có kết quả.</Typography.Text>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <Typography.Title level={3} style={{ margin: 0 }}>
          Thông tin công việc
        </Typography.Title>

        <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
          Thay đổi
        </Button>
      </div>
      <Divider style={{ marginTop: 0 }} />

      <div
        style={{
          border: `1px solid ${token.colorBorder}`,
          borderRadius: 8,
          padding: 16,
          marginBottom: 32,
          background: token.colorBgContainer,
        }}
      >
        {inspection && (
          <List
            dataSource={[
              { label: "Tên kế hoạch", value: inspection.plan_name || "N/A" },
              {
                label: "Trung tâm kiểm định",
                value: inspection.inspector_name || "N/A",
              },
              { label: "Mô tả", value: inspection.description || "N/A" },
              {
                label: "Ngày bắt đầu",
                value: new Date(inspection.start_date).toLocaleDateString(),
              },
              {
                label: "Ngày kết thúc",
                value: new Date(inspection.end_date).toLocaleDateString(),
              },
              {
                label: "Trạng thái",
                value: <InspectionStatusTag value={inspection.status} />,
              },
              {
                label: "Cho thu hoạch",
                value: inspection.can_harvest ? "Có" : "Không",
              },
            ]}
            renderItem={(item) => (
              <List.Item>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Typography.Text strong>{item.label}</Typography.Text>
                  <Typography.Text>{item.value}</Typography.Text>
                </div>
              </List.Item>
            )}
          />
        )}
      </div>

      <Typography.Title level={3} style={{ marginBottom: 8 }}>
        Thời gian
      </Typography.Title>
      <Divider style={{ marginTop: 0 }} />

      <div
        style={{
          border: `1px solid ${token.colorBorder}`,
          borderRadius: 8,
          padding: 16,
          marginBottom: 32,
          background: token.colorBgContainer,
        }}
      >
        <List
          dataSource={[
            {
              label: "Hoàn thành",
              value: inspection.complete_date
                ? new Date(inspection.complete_date).toLocaleDateString()
                : "N/A",
            },
            {
              label: "Tạo lúc",
              value: new Date(inspection.created_at).toLocaleDateString(),
            },
            { label: "Tạo bởi", value: inspection.created_by || "N/A" },
            {
              label: "Cập nhật",
              value: inspection.updated_at
                ? new Date(inspection.updated_at).toLocaleDateString()
                : "N/A",
            },
            { label: "Cập nhật bởi", value: inspection.updated_by || "N/A" },
          ]}
          renderItem={(data) => (
            <List.Item>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography.Text strong>{data.label}</Typography.Text>
                <Typography.Text>{data.value}</Typography.Text>
              </div>
            </List.Item>
          )}
        />
      </div>

      <Modal
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={900}
      >
        <Typography.Title level={3}>
          Chi tiết kết quả kiểm nghiệm
        </Typography.Title>
        {chemicalGroups.map((group) => {
          const groupData = chemicalData.filter((item) =>
            group.keys.includes(item.key)
          );
          if (groupData.length === 0) return null;

          return (
            <div key={group.title} style={{ marginBottom: 24 }}>
              <Typography.Text strong>{group.title}</Typography.Text>
              <Table
                rowKey="key"
                dataSource={groupData}
                columns={columns}
                pagination={false}
                bordered
                style={{ marginTop: 8 }}
              />
            </div>
          );
        })}
      </Modal>

      {isEditing && selectedResult && (
        <InspectionDrawerForm
          id={selectedResult.id}
          action="edit"
          open={isEditing}
          initialValues={selectedResult}
          onClose={handleCloseDrawer}
          onMutationSuccess={handleCloseDrawer}
        />
      )}
    </Drawer>
  );
};
