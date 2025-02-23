import { PhoneOutlined, UserOutlined, CalendarOutlined } from "@ant-design/icons";
import { useTranslate } from "@refinedev/core";
import { List, Typography, Card } from "antd";
import dayjs from "dayjs";

import { UserStatus } from "../userStatus";

import type { IUser } from "../../../interfaces";

type Props = {
  customer?: IUser;
};

export const CustomerInfoList = ({ customer }: Props) => {
  const t = useTranslate();

  return (
    <Card
      bordered={false}
      styles={{
        body: {
          padding: "0 16px 0 16px",
        },
      }}
    >
      <List
        itemLayout="horizontal"
        dataSource={[
          {
            title: t("users.fields.gsm"),
            icon: <PhoneOutlined />,
            value: <Typography.Text>{customer?.gsm}</Typography.Text>,
          },
          {
            title: t("users.fields.isActive.label"),
            icon: <UserOutlined />,
            value: <UserStatus value={!!customer?.isActive} />,
          },
          {
            title: t("users.fields.createdAt"),
            icon: <CalendarOutlined />,
            value: (
              <Typography.Text>
                {dayjs(customer?.createdAt).format("MMMM, YYYY HH:mm A")}
              </Typography.Text>
            ),
          },
        ]}
        renderItem={(item) => {
          return (
            <List.Item>
              <List.Item.Meta
                avatar={item.icon}
                title={<Typography.Text type="secondary">{item.title}</Typography.Text>}
                description={item.value}
              />
            </List.Item>
          );
        }}
      />
    </Card>
  );
};
