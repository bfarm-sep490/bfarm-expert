import React, { useState, useEffect } from "react";
import {
  BarChartOutlined,
  BarsOutlined,
  DeleteOutlined,
  LoadingOutlined,
  PlusSquareOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Flex,
  Form,
  Modal,
  notification,
  Segmented,
  Select,
  Space,
  Spin,
  Table,
  Typography,
} from "antd";
import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import { DateField, ShowButton, TextField, useForm } from "@refinedev/antd";
import {
  BaseRecord,
  useCustom,
  useDelete,
  useList,
  useOne,
  useTranslate,
} from "@refinedev/core";
import { ProblemStatusTag } from "@/components/problem/status-tag";
import { useNavigate, useParams } from "react-router";
import { FarmerScheduleComponent } from "../scheduler/farmer-task-scheduler";

type ChosenDashBoardProps = {
  status?: string;
  harvesting_task?: [];
  packaging_task?: [];
  caring_task?: [];
  chosenFarmer: [];
  refetch?: () => void;
  visible?: boolean;
  loading?: boolean;
  style?: React.CSSProperties;
};

export const ChosenFarmerDashBoard: React.FC<ChosenDashBoardProps> = ({
  status,
  harvesting_task,
  packaging_task,
  caring_task,
  chosenFarmer,
  loading,
  refetch,
  style,
}) => {
  const [api, contextHolder] = notification.useNotification();
  const [viewComponent, setViewComponent] = useState("Chart");
  const translate = useTranslate();
  const [loadingChart, setLoadingChart] = useState(false);
  const [deletedId, setDeletedId] = useState<number | undefined>(undefined);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [chartConfig, setChartConfig] = useState<{
    options: ApexOptions;
    series: any[];
  }>({
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 10,
          borderRadiusApplication: "end",
          borderRadiusWhenStacked: "last",
          dataLabels: {
            total: {
              enabled: true,
              style: {
                fontSize: "13px",
                fontWeight: 900,
              },
            },
          },
        },
      },
      xaxis: {
        categories: [],
      },
      legend: {
        position: "bottom",
        offsetY: 40,
      },
      fill: {
        opacity: 1,
      },
    },
    series: [],
  });

  useEffect(() => {
    if (loading === true) return;
    setLoadingChart(true);
    const series = [
      {
        name: "Chăm sóc",
        data: chosenFarmer?.map(
          (x: any) =>
            caring_task?.filter((y: any) => y?.farmer_id === x?.id)?.length ?? 0
        ),
      },
      {
        name: "Thu hoạch",
        data: chosenFarmer?.map(
          (x: any) =>
            harvesting_task?.filter((y: any) => y?.farmer_id === x?.id)
              ?.length ?? 0
        ),
      },
      {
        name: "Đóng gói",
        data: chosenFarmer?.map(
          (x: any) =>
            packaging_task?.filter((y: any) => y?.farmer_id === x?.id)
              ?.length ?? 0
        ),
      },
    ];

    const categories = chosenFarmer?.map((x: any) => x?.name) ?? [];

    setChartConfig((prevConfig) => ({
      ...prevConfig,
      series,
      options: {
        ...prevConfig.options,
        xaxis: {
          ...prevConfig.options.xaxis,
          categories,
        },
      },
    }));
    setLoadingChart(false);
  }, [harvesting_task, packaging_task, caring_task, chosenFarmer, loading]);

  return (
    <Card
      style={style}
      title={
        <Flex justify="space-between" align="center">
          <Flex gap={10}>
            <Typography.Title level={5}>
              Nông dân tham gia ({chosenFarmer?.length})
            </Typography.Title>
            {loading || loadingChart ? (
              <Spin indicator={<LoadingOutlined spin />} size="small" />
            ) : (
              <ReloadOutlined onClick={refetch} />
            )}
          </Flex>
          <Segmented
            disabled={loading || loadingChart}
            size="large"
            vertical={false}
            onChange={(value) => setViewComponent(value)}
            options={[
              { value: "List", icon: <BarsOutlined /> },
              { value: "Chart", icon: <BarChartOutlined /> },
            ]}
          />
        </Flex>
      }
      loading={loading}
    >
      {contextHolder}
      {status !== "Pending" && (
        <Flex justify="end" align="center" gap={10} style={{ marginBottom: 10 }}>
          <Button
            icon={<PlusSquareOutlined />}
            type="primary"
            onClick={() => setAddModalVisible(true)}
          >
            Thêm
          </Button>
        </Flex>
      )}
      {loading === false && viewComponent === "Chart" && (
        <ReactApexChart
          options={chartConfig.options}
          series={chartConfig.series}
          type="bar"
          height={350}
        />
      )}
      {loading === false && viewComponent === "List" && (
        <Table dataSource={chosenFarmer} loading={loading} rowKey="id" scroll={{ x: true }}>
          <Table.Column title="ID" dataIndex="id" key="id" width={"auto"} />

          <Table.Column
            title={translate("farmer_name", "Tên nông dân")}
            dataIndex="name"
            key="name"
            width={"auto"}
          />
          <Table.Column
            title={translate("Đang thực thi", "Đang thực thi")}
            key="OngoingTask"
            dataIndex={"id"}
            width={"auto"}
            render={(value, record: any) => {
              return (
                <TextField
                  value={
                    (harvesting_task?.filter(
                      (x: any) =>
                        x?.farmer_id === value && x?.status === "Ongoing"
                    )?.length ?? 0) +
                    (packaging_task?.filter(
                      (x: any) =>
                        x?.farmer_id === value && x?.status === "Ongoing"
                    )?.length ?? 0) +
                    (caring_task?.filter(
                      (x: any) =>
                        x?.farmer_id === value && x?.status === "Ongoing"
                    )?.length ?? 0)
                  }
                />
              );
            }}
          />
          <Table.Column
            title={translate("Đã hoàn thành", "Đã hoàn thành")}
            dataIndex={"id"}
            width={"auto"}
            render={(value, record: any) => {
              return (
                <TextField
                  value={
                    (harvesting_task?.filter(
                      (x: any) =>
                        x?.farmer_id === value && x?.status === "Complete"
                    )?.length ?? 0) +
                    (packaging_task?.filter(
                      (x: any) =>
                        x?.farmer_id === value && x?.status === "Complete"
                    )?.length ?? 0) +
                    (caring_task?.filter(
                      (x: any) =>
                        x?.farmer_id === value && x?.status === "Complete"
                    )?.length ?? 0)
                  }
                />
              );
            }}
          />
          <Table.Column
            title={translate("Không hoành thành", "Không hoành thành")}
            dataIndex={"id"}
            width={"auto"}
            render={(value, record: any) => {
              return (
                <TextField
                  value={
                    (harvesting_task?.filter(
                      (x: any) =>
                        x?.farmer_id === value && x?.status === "Incomplete"
                    )?.length ?? 0) +
                    (packaging_task?.filter(
                      (x: any) =>
                        x?.farmer_id === value && x?.status === "Incomplete"
                    )?.length ?? 0) +
                    (caring_task?.filter(
                      (x: any) =>
                        x?.farmer_id === value && x?.status === "Incomplete"
                    )?.length ?? 0)
                  }
                />
              );
            }}
          />

          <Table.Column
            title={translate("Actions", "Hành động")}
            key="actions"
            fixed="right"
            align="center"
            render={(value, record: any) => (
              <Button
                shape="circle"
                danger
                onClick={() => {
                  setDeletedId(record.id);
                  setDeleteModalVisible(true);
                }}
              >
                <DeleteOutlined />
              </Button>
            )}
          />
        </Table>
      )}
      <DeleteFarmerInPlanModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        refetch={refetch}
        farmer_id={deletedId}
        api={api}
      />
      <AddFarmerIntoPlanModal
        api={api}
        onClose={() => setAddModalVisible(false)}
        visible={addModalVisible}
        refetch={refetch}
      />
    </Card>
  );
};
// ///////////////////////////////////////////////////////////////////////////////
type DeleteFarmerInPlanModalProps = {
  refetch?: () => void;
  api?: any;
  visible?: boolean;
  onClose?: () => void;
  farmer_id?: number;
};

export const DeleteFarmerInPlanModal = ({
  refetch,
  api,
  visible,
  onClose,
  farmer_id,
}: DeleteFarmerInPlanModalProps) => {
  const { id } = useParams();
  const [error, setError] = useState<string | undefined>();
  const { mutate } = useDelete({});
  const handleDelete = async () => {
    await mutate(
      {
        resource: `plans`,
        id: `${id}/farmers/${farmer_id}`,
      },
      {
        onError: (error, variables, context) => {
          api.error({
            message: "Lỗi! Vui lòng thử lại.",
            description: error?.message,
          });
        },
        onSuccess: (data: any, variables, context) => {
          if (typeof data === "string") {
            api.error({ message: "Lỗi! Vui lòng thử lại.", description: data });
          } else {
            api.success({
              message: "Thành công!",
              description: "Xóa nông dân thành công.",
            });
            refetch?.();
          }
          onClose?.();
        },
      }
    );
  };
  return (
    <Modal
      title="Xóa nông dân trong kế hoạch"
      open={visible}
      onCancel={onClose}
      onClose={onClose}
      footer={
        <>
          <Button type="default" onClick={onClose}>
            Hủy
          </Button>
          <Button type="primary" variant="filled" onClick={handleDelete}>
            Lưu
          </Button>
        </>
      }
    >
      {error && <Alert message={error} type="error" />}
      <Typography.Text
        style={{ fontSize: 12, color: "red", fontStyle: "italic" }}
      >
        * Không thể xóa các nông dân đang thực hiện công việc. Bạn có chắc chắn
        xóa không?
      </Typography.Text>
    </Modal>
  );
};
type AddFarmerIntoPlanModalProps = {
  api?: any;
  refetch?: () => void;
  visible?: boolean;
  onClose?: () => void;
};
export const AddFarmerIntoPlanModal = (props: AddFarmerIntoPlanModalProps) => {
  const { id } = useParams();
  const [selectFarmer, setSelectFarmer] = useState<number | undefined>();
  const [events, setEvents] = useState<
    {
      id: number;
      title: string;
      start: Date;
      end: Date;
      type: "Chăm sóc" | "Thu hoạch" | "Đóng gói" | "Kiểm định";
      status: "Pending" | "Complete" | "Ongoing" | "Cancel" | "Incomplete";
    }[]
  >([]);

  const {
    data: planData,
    isLoading: planLoading,
    refetch: planRefetch,
  } = useOne({
    resource: `plans`,
    id: `${id}/general`,
    queryOptions: {
      enabled: false,
    },
  });

  const plan = planData?.data;

  const {
    data: farmerData,
    isLoading: farmersLoading,
    refetch: farmerRefetch,
  } = useList({
    resource: "farmers",
    filters: [
      {
        field: "status",
        operator: "eq",
        value: "Active",
      },
    ],
    queryOptions: {
      enabled: false,
    },
  });

  const {
    data: chosenFarmrtData,
    isLoading: chosenFarmersLoading,
    refetch: chosenFarmersRefetch,
  } = useList({
    resource: `plans/${id}/farmers`,
    queryOptions: {
      enabled: false,
    },
  });
  const [viewCalendar, setViewCalendar] = useState(false);
  const farmers = farmerData?.data;
  const chosenFarmers = chosenFarmrtData?.data;
  const filterFarmers =
    farmers?.filter((x) => !chosenFarmers?.some((y: any) => y.id === x.id)) ??
    [];

  const { formProps, saveButtonProps } = useForm({
    resource: `plans/${id}/farmers`,
    action: "create",
    onMutationSuccess: () => {
      props?.onClose?.();
    },
    createMutationOptions: {
      onSuccess: async () => {
        props?.api?.success({
          message: "Thêm nông dân thành công",
        });
        props?.refetch?.();
      },
      onError: () => {
        props?.api?.error({
          message: "Lỗi! Vui lòng thử lại",
        });
      },
    },
  });
  useEffect(() => {
    if (props?.visible === true) {
      planRefetch();
      farmerRefetch();
      chosenFarmersRefetch();
    } else {
      setSelectFarmer(undefined);
      setEvents([]);
    }
  }, [props?.visible]);
  const { refetch, isLoading } = useCustom({
    url: `https://api.outfit4rent.online/api/farmers/${selectFarmer}/calendar`,
    method: "get",
    queryOptions: {
      enabled: false,
      onSuccess: (data) => {
        setEvents(
          data?.data?.map((x: any) => {
            return {
              title: x.task_type,
              start: x.start_date,
              end: x.end_date,
              status: x.status,
            };
          }) || []
        );
      },
    },
  });

  const handleSelect = async (value: number) => {
    setSelectFarmer(value);
    formProps?.form?.setFieldValue("farmer_id", value);
  };

  const handleShowDetail = async () => {
    if (!selectFarmer) return;
    refetch();
    setViewCalendar(true);
  };

  return (
    <Modal
      width={1000}
      title="Thêm nông dân vào kế hoạch"
      open={props?.visible}
      onCancel={() => props.onClose?.()}
      footer={
        <>
          <Button type="default" onClick={() => props.onClose?.()}>
            Hủy
          </Button>
          <Button type="primary" variant="filled" {...saveButtonProps}>
            Lưu
          </Button>
        </>
      }
    >
      <Form {...formProps} layout="vertical">
        <Form.Item
          vertical={false}
          name="farmer_id"
          label="Chọn nông dân"
          rules={[{ required: true, message: "Vui lòng chọn nông dân!" }]}
        >
          <Space
            direction="vertical"
            style={{ width: "100%", marginBottom: 20 }}
          >
            <Flex>
              <Select value={selectFarmer} onChange={handleSelect}>
                {filterFarmers?.map((farmer) => (
                  <Select.Option key={farmer.id} value={farmer.id}>
                    {farmer.name}
                  </Select.Option>
                ))}
              </Select>
            </Flex>
            <Space>
              <Space>
                <Button type="primary" onClick={() => handleShowDetail()}>
                  Xem lịch
                </Button>

                <Button
                  onClick={() => setViewCalendar(false)}
                  disabled={!viewCalendar}
                >
                  Ẩn lịch
                </Button>
              </Space>{" "}
            </Space>
          </Space>
        </Form.Item>
      </Form>
      {viewCalendar && (
        <FarmerScheduleComponent
          farmer={farmers?.find((x) => x.id === selectFarmer)}
          events={events}
          isLoading={false}
          start_date={plan?.start_date}
          end_date={plan?.end_date}
        />
      )}
    </Modal>
  );
};
