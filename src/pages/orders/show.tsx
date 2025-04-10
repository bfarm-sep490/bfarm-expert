import { OrderDrawerShow } from "@/components/orders/drawer-show";
import { PropsWithChildren } from "react";

export const OrderShow = ({ children }: PropsWithChildren) => {
  return (
    <>
      <OrderDrawerShow />
      {children}
    </>
  );
};
