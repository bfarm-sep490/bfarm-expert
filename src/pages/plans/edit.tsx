import { useSearchParams } from "react-router";

export const PlanEdit = () => {
  const [searchParams] = useSearchParams();
  const orderIds = searchParams.get("orderIds")?.split(",") || [];
  return <></>;
};
