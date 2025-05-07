import { useSelect } from "@refinedev/core";
import { IItem } from "@/interfaces";

export const useItems = (type: "Caring" | "Harvesting" | "Packaging") => {
  const { options: itemsOptions } = useSelect<IItem>({
    resource: "items",
    optionLabel: "name",
    optionValue: "id",
    filters: [
      {
        field: "type",
        operator: "eq",
        value: type,
      },
    ],
  });

  return { itemsOptions };
};
