import { Typography } from "antd";

export const NumberWithUnit = ({ value, unit }: { value: number; unit: string }) => {
  return (
    <Typography.Text>
      {value.toLocaleString()} {unit}
    </Typography.Text>
  );
};
