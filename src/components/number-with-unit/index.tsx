import { Typography } from "antd";

interface NumberWithUnitProps {
  value: number;
  unit: string;
}

export const NumberWithUnit = ({ value, unit }: NumberWithUnitProps) => {
  return (
    <Typography.Text>
      {value} {unit}
    </Typography.Text>
  );
};
