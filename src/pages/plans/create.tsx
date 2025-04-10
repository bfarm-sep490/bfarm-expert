import { PlanForm } from "@/components/plan/plan-form";
import { useSearchParams } from "react-router";

export const PlanCreate = () => {
  const [searchParams] = useSearchParams();
  const orderIds = searchParams.get("orderIds")?.split(",") || [];
  const totalPreorderQuantity = Number(searchParams.get("totalPreorderQuantity")) || 0;

  return (
    <PlanForm action="create" orderIds={orderIds} totalPreorderQuantity={totalPreorderQuantity} />
  );
};
