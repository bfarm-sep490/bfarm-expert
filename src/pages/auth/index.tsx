import { AuthPage as AntdAuthPage, type AuthProps } from "@refinedev/antd";
import { Flex } from "antd";
import React from "react";
import { Link } from "react-router";

const authWrapperProps = {
  style: {
    background:
      "radial-gradient(50% 50% at 50% 50%,rgba(255, 255, 255, 0) 0%,rgba(0, 0, 0, 0.5) 100%),url('images/login-bg.png')",
    backgroundSize: "cover",
  },
};

const renderAuthContent = (content: React.ReactNode) => {
  return (
    <div
      style={{
        maxWidth: 408,
        margin: "auto",
      }}
    >
      <Link to="/">
        <Flex
          align="center"
          justify="center"
          style={{
            marginBottom: 16,
          }}
        >
          <img
            src="/logo.png"
            alt="Logo"
            style={{
              width: "auto",
              height: 101,
            }}
          />
        </Flex>
      </Link>
      {content}
    </div>
  );
};

export const AuthPage: React.FC<AuthProps> = ({ type, formProps, ...rest }) => {
  return (
    <AntdAuthPage
      type={type}
      wrapperProps={authWrapperProps}
      renderContent={renderAuthContent}
      formProps={{
        ...formProps,
        layout: "vertical",
      }}
      {...rest}
    />
  );
};
