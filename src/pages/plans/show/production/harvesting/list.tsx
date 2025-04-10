
import { HarvestingProductList } from "@/components/production/harvesting/list";
import { AppstoreOutlined, ArrowLeftOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { CreateButton, List } from "@refinedev/antd";
import { useBack, useGo, useNavigation } from "@refinedev/core";
import { Button, Segmented } from "antd";
import { type PropsWithChildren, useState } from "react";
import { useLocation } from "react-router";

export const HarvestingProductionListInPlan = ({ children }: PropsWithChildren) => {
  const go = useGo();
  const back = useBack();
  const { replace } = useNavigation();
  const { pathname } = useLocation();
  const { createUrl } = useNavigation();

  return (
    <>
      <HarvestingProductList />
      {children}
    </>
  );
};
