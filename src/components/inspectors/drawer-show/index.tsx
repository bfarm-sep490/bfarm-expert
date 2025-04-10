import {
  type BaseKey,
  type HttpError,
  useGetToPath,
  useGo,
  useNavigation,
  useShow,
  useTranslate,
} from "@refinedev/core";
import { Avatar, Button, Divider, Flex, Grid, List, Typography, theme, Tag } from "antd";
import { useParams, useSearchParams } from "react-router";
import { Drawer } from "../../drawer";
import { DateField, DeleteButton, TextField } from "@refinedev/antd";
import { EditOutlined } from "@ant-design/icons";
import { FarmerStatus } from "@/interfaces";

type Props = {
  id?: BaseKey;
  onClose?: () => void;
  onEdit?: () => void;
};

const FarmerStatusTag = ({ status }: { status: FarmerStatus }) => {
  const colorMap = {
    Inactive: "red",
    Active: "success",
  };

  return <Tag color={colorMap[status]}>{status}</Tag>;
};

export const InspectorDrawerShow = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const go = useGo();
  const { editUrl } = useNavigation();
  const t = useTranslate();
  const { token } = theme.useToken();
  const breakpoint = Grid.useBreakpoint();

  const { query: queryResult } = useShow<any, HttpError>({
    resource: "inspectors",
    id,
  });
  const inspector = queryResult?.data?.data;
  console.log(inspector);
  const handleDrawerClose = () => {
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

  return (
    <Drawer
      open={true}
      width={breakpoint.sm ? "378px" : "100%"}
      zIndex={1001}
      onClose={handleDrawerClose}
    >
      <Flex vertical align="center" justify="center">
        <Avatar
          shape="square"
          style={{
            aspectRatio: 1,
            objectFit: "contain",
            width: "240px",
            height: "240px",
            margin: "16px auto",
            borderRadius: "8px",
          }}
          src={inspector?.image_url}
          alt={inspector?.name}
        />
      </Flex>
      <Flex
        vertical
        style={{
          backgroundColor: token.colorBgContainer,
        }}
      >
        <Flex
          vertical
          style={{
            padding: "16px",
          }}
        >
          <Typography.Title level={5}>{inspector?.name}</Typography.Title>
        </Flex>

        <Divider style={{ margin: 0, padding: 0 }} />
        <List
          dataSource={[
            {
              label: <Typography.Text type="secondary">Address</Typography.Text>,
              value: inspector?.address,
            },
            {
              label: <Typography.Text type="secondary">Phone</Typography.Text>,
              value: inspector?.phone,
            },
            {
              label: <Typography.Text type="secondary">Email</Typography.Text>,
              value: inspector?.email,
            },

            {
              label: <Typography.Text type="secondary">Status</Typography.Text>,
              value: inspector?.status && <FarmerStatusTag status={inspector.status} />,
            },
            {
              label: <Typography.Text type="secondary">Ngày tạo</Typography.Text>,
              value: inspector?.created_at && <DateField value={inspector?.created_at} />,
            },
            {
              label: <Typography.Text type="secondary">Ngày cập nhập</Typography.Text>,
              value: inspector?.updated_at ? (
                <FarmerStatusTag status={inspector?.updated_at} />
              ) : (
                <TextField value={"Chưa cập nhập"} />
              ),
            },
          ]}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                style={{
                  padding: "0 16px",
                }}
                avatar={item.label}
                title={item.value}
              />
            </List.Item>
          )}
        />
      </Flex>
      <Flex
        align="center"
        justify="space-between"
        style={{
          padding: "16px 16px 16px 0",
        }}
      >
        <DeleteButton
          type="text"
          recordItemId={inspector?.id}
          resource="farmers"
          onSuccess={handleDrawerClose}
        />
        <Button
          icon={<EditOutlined />}
          onClick={() => {
            if (props?.onEdit) {
              return props.onEdit();
            }

            return go({
              to: `/inspectors/edit/${inspector?.id}`,
              query: { to: "/inspectors" },
              options: { keepQuery: true },
              type: "replace",
            });
          }}
        >
          {t("actions.edit")}
        </Button>
      </Flex>
    </Drawer>
  );
};
