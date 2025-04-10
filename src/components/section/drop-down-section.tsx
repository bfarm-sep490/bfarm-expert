import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import { icon } from "@fortawesome/fontawesome-svg-core";
import { Card, Col, Flex, Row, Typography } from "antd";
import { PropsWithChildren, useState } from "react";

type DropDownSection = {
  title?: string;
};

export const DropDownSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [icon, setIcon] = useState<boolean>(true);
  const handle = (value: boolean) => {
    setIcon(value);
  };
  return (
    <>
      <Flex justify={"space-between"} style={{ fontSize: "40px" }}>
        <Typography.Title level={3}>{title}</Typography.Title>
        {icon ? (
          <CaretUpOutlined onClick={() => handle(false)} />
        ) : (
          <CaretDownOutlined onClick={() => handle(true)} />
        )}
      </Flex>
      <div style={{ display: icon ? "block" : "none" }}>{children}</div>
    </>
  );
};
