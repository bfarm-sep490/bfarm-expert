import { PlanForm } from "@/components/plan/plan-form";
import { useSearchParams } from "react-router";

export const PlanEdit = () => {
  const [searchParams] = useSearchParams();
  const orderIds = searchParams.get("orderIds")?.split(",") || [];
  return <PlanForm action="edit" orderIds={orderIds} />;
};
