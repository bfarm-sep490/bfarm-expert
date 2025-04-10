import { PackagedProductList } from "@/components/production/packaging/list";

import { Typography } from "antd";
import { type PropsWithChildren } from "react";

export const PackagedProductListPage = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Typography.Title level={4} style={{ marginBottom: 16 }}>
        Danh sách thành phẩm phụ trách
      </Typography.Title>
      <PackagedProductList />
      {children}
    </>
  );
};
