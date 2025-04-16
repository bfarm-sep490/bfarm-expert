import { Modal } from "antd";
import { useOrderStore } from "@/store/order-store";
import { PlanType } from "../hooks/useFormList";
import { PlanSelectionModal } from "../../plan-selection-modal";

interface PlanTypeSelectionProps {
  open: boolean;
  onClose: () => void;
  onPlanTypeSelect: (type: PlanType) => void;
}

export const PlanTypeSelection: React.FC<PlanTypeSelectionProps> = ({
  open,
  onClose,
  onPlanTypeSelect,
}) => {
  const { clearOrders } = useOrderStore();

  return (
    <PlanSelectionModal
      open={open}
      onClose={() => {
        clearOrders();
        onClose();
      }}
      onCreateWithOrders={() => {
        onPlanTypeSelect("order");
      }}
      onCreateNormal={() => {
        onPlanTypeSelect("non-order");
      }}
    />
  );
};

// Re-export PlanSelectionModal for use in PlanDrawer
export { PlanSelectionModal } from "../../plan-selection-modal";
