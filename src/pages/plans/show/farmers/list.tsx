
import { FarmerScheduleComponent } from "@/components/plan/detail/scheduler/farmer-task-scheduler";
import {
  AppstoreOutlined,
  ArrowLeftOutlined,
  DeleteOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { CreateButton, List, ShowButton, useForm } from "@refinedev/antd";
import {
  HttpError,
  useBack,
  useCustom,
  useCustomMutation,
  useDelete,
  useGo,
  useList,
  useModal,
  useNavigation,
  useOne,
  useTable,
  useTranslate,
} from "@refinedev/core";
import {
  Alert,
  Button,
  Flex,
  Form,
  Modal,
  notification,
  Segmented,
  Select,
  Space,
  Spin,
  Table,
  theme,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { on } from "events";
import { filter, replace } from "lodash";
import { type PropsWithChildren, useEffect, useState } from "react";
import { Calendar } from "react-big-calendar";

// Define the IFarmer interface
interface IFarmer {
  id: number;
  name: string;
  status?: string;
}
import { useLocation, useNavigate, useParams } from "react-router";

export const FarmerListInPlan = ({ children }: PropsWithChildren) => {
  const [deletedId, setDeletedId] = useState<number>(0);
  const [deletedOpen, setDeletedOpen] = useState<boolean>(false);
  const [addOpen, setAddOpen] = useState<boolean>(false);
  const { id } = useParams();
  const go = useGo();
  const back = useBack();
  const { replace } = useNavigation();
  const { pathname } = useLocation();
  const { createUrl } = useNavigation();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const {
    data: farmerData,
    isLoading,
    isError,
    error,
    refetch: farmerRefetch,
  } = useList({
    resource: `plans/${id}/farmers`,
  });
  const farmers = farmerData?.data;
  const { token } = theme.useToken();
  const translate = useTranslate();
  const [api, contextHolder] = notification.useNotification();

  return (
    <>
      {contextHolder}
      <Button
        type="text"
        style={{ width: "40px", height: "40px" }}
        onClick={() => navigate(`/plans/${id}`)}
      >
        <ArrowLeftOutlined style={{ width: "50px", height: "50px" }} />
      </Button>

      <List
        breadcrumb={false}
        headerButtons={(props) => [
          <Button type="primary" variant="filled" onClick={() => setAddOpen(true)}>
            Thêm nông dân
          </Button>,
        ]}
      >
        <Table dataSource={farmers} loading={isLoading} rowKey="id" scroll={{ x: true }}>
          <Table.Column
            title="ID"
            dataIndex="id"
            key="id"
            width={"auto"}
            render={(value) => (
              <Typography.Text style={{ fontWeight: "bold" }}>#{value}</Typography.Text>
            )}
            filterIcon={(filtered) => (
              <SearchOutlined
                style={{
                  color: filtered ? token.colorPrimary : undefined,
                }}
              />
            )}
          />

          <Table.Column
            title={translate("farmer_name", "Tên nông dân")}
            dataIndex="name"
            key="name"
            width={"auto"}
            filterIcon={(filtered) => (
              <SearchOutlined
                style={{
                  color: filtered ? token.colorPrimary : undefined,
                }}
              />
            )}
          />

          <Table.Column
            title={translate("Status", "Trạng thái")}
            dataIndex="status"
            key="status"
            width={"auto"}
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
                  setDeletedOpen(true);
                }}
              >
                <DeleteOutlined />
              </Button>
            )}
          />
        </Table>
        {children}
        <AddFarmerIntoPlanModal
          api={api}
          refetch={farmerRefetch}
          visible={addOpen}
          onClose={() => setAddOpen(false)}
        />
        <DeleteFarmerInPlanModal
          refetch={farmerRefetch}
          api={api}
          visible={deletedOpen}
          onClose={() => setDeletedOpen(false)}
          farmer_id={deletedId}
        />
      </List>
    </>
  );
};
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
  const navigate = useNavigate();
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
  const farmers = farmerData?.data as IFarmer[];
  const chosenFarmers = chosenFarmrtData?.data as IFarmer[];
  const filterFarmers =
    farmers?.filter((x) => !chosenFarmers?.some((y: any) => y.id === x.id)) ??
    [];

  const navigate = useNavigate();
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
      <Form
        {...formProps}
        layout="vertical" // Thay đổi layout thành vertical
      >
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
