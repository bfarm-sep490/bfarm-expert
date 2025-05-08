import { useState, useEffect } from "react";
import { Card, Divider, Select, Typography, Space, Tag, Row, Col } from "antd";
import {
  ExperimentOutlined,
  BugOutlined,
  ExceptionOutlined,
  SafetyCertificateOutlined,
  AimOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

type ContaminantLimit = {
  [contaminant: string]: number | [number, number];
};

type VegetableContaminantLimits = {
  [vegetableType: string]: ContaminantLimit;
};

export const contaminantBasedVegetableType = {
  "Rau họ thập tự": ["cadmi"],
  Hành: ["cadmi"],
  "Rau ăn lá": ["cadmi", "plumbum"],
  "Rau ăn quả": ["cadmi", "plumbum"],
  "Rau ăn củ": ["cadmi", "plumbum"],
  Nấm: ["cadmi"],
  "Rau củ quả": ["hydrargyrum"],
  "Rau khô": ["arsen"],
};

export const getContaminantLimitsByVegetableType = (
  type: keyof typeof contaminantBasedVegetableType,
) => {
  return contaminantBasedVegetableType[type] || [];
};

const contaminantLimits: VegetableContaminantLimits = {
  "Rau họ thập tự": { Cadmi: 0.05 },
  Hành: { Cadmi: 0.05 },
  "Rau ăn lá": { Cadmi: 0.2, Plumbum: 0.3 },
  "Rau ăn quả": { Cadmi: 0.05, Plumbum: 0.1 },
  "Rau ăn củ": { Cadmi: 0.1, Plumbum: 0.1 },
  Nấm: { Cadmi: 0.2 },
  "Rau củ quả": { Hydrargyrum: 0.02 },
  "Rau khô": { Arsen: 1.0 },
};

const globalLimits: ContaminantLimit = {
  SulfurDioxide: 10.0,
  Nitrat: 9.0,
  NaNO3_KNO3: 15.0,
  Glyphosate_Glufosinate: 0.01,
  MethylBromide: 0.01,
  HydrogenPhosphide: 0.01,
  Dithiocarbamate: 0.01,
  Chlorate: 0.01,
  Perchlorate: 0.01,
  Salmonella: 0.0,
  Coliforms: 10.0,
  Ecoli: [100, 1000],
};

const contaminantGroups = {
  "Kim loại nặng": ["Cadmi", "Plumbum", "Hydrargyrum", "Arsen"],
  "Vi sinh": ["Salmonella", "Coliforms", "Ecoli"],
  "Hóa chất": [
    "SulfurDioxide",
    "Nitrat",
    "NaNO3_KNO3",
    "Glyphosate_Glufosinate",
    "MethylBromide",
    "HydrogenPhosphide",
    "Dithiocarbamate",
    "Chlorate",
    "Perchlorate",
  ],
};

const groupColors = {
  "Kim loại nặng": "#f50",
  "Vi sinh": "#108ee9",
  "Hóa chất": "#87d068",
};

const groupIcons = {
  "Kim loại nặng": <ExperimentOutlined />,
  "Vi sinh": <BugOutlined />,
  "Hóa chất": <ExceptionOutlined />,
};

const units = {
  "Kim loại nặng": "mg/kg",
  "Vi sinh": "CFU/g",
  "Hóa chất": "mg/kg",
};

function getContaminantLimits(vegetableType: string): ContaminantLimit {
  const result: ContaminantLimit = { ...globalLimits };

  if (contaminantLimits[vegetableType]) {
    Object.entries(contaminantLimits[vegetableType]).forEach(([contaminant, limit]) => {
      result[contaminant] = limit;
    });
  }

  return result;
}

interface ContaminantItemProps {
  name: string;
  value: number | [number, number];
  unit: string;
}

const ContaminantItem = ({ name, value, unit }: ContaminantItemProps) => {
  if (name === "Ecoli" && Array.isArray(value)) {
    const [lowerBound, upperBound] = value;
    return (
      <div className="contaminant-item" style={{ marginBottom: "12px" }}>
        <Row align="middle">
          <Col span={18}>
            <Space>
              <AimOutlined />
              <Text>{name}</Text>
            </Space>
          </Col>
          <Col span={6} style={{ textAlign: "right" }}>
            <Tag color="blue">{`${lowerBound} - ${upperBound} ${unit}`}</Tag>
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <div className="contaminant-item" style={{ marginBottom: "12px" }}>
      <Row align="middle">
        <Col span={18}>
          <Space>
            <AimOutlined />
            <Text>{name}</Text>
          </Space>
        </Col>
        <Col span={6} style={{ textAlign: "right" }}>
          <Tag color="blue">{`< ${value} ${unit}`}</Tag>
        </Col>
      </Row>
    </div>
  );
};

interface ContaminantGroupProps {
  title: string;
  contaminants: Array<{ name: string; value: number | [number, number] }>;
  unit: string;
  color: string;
  icon: React.ReactNode;
}

const ContaminantGroup = ({ title, contaminants, unit, color, icon }: ContaminantGroupProps) => {
  if (contaminants.length === 0) {
    return null;
  }

  return (
    <div className="contaminant-group" style={{ marginBottom: "24px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "12px",
          background: color,
          padding: "8px 12px",
          borderRadius: "4px",
          color: "white",
        }}
      >
        {icon} <span style={{ marginLeft: "8px", fontWeight: "bold" }}>{title}</span>
      </div>
      {contaminants.map((item, index) => (
        <ContaminantItem key={index} name={item.name} value={item.value} unit={unit} />
      ))}
      <Divider style={{ margin: "12px 0" }} />
    </div>
  );
};

interface ContaminantCheckCardProps {
  type?: string;
  onChange?: (type: string) => void;
  showDetails?: boolean;
  style?: React.CSSProperties;
}

const ContaminantCheckCard = ({
  type = "Rau ăn lá",
  onChange,
  showDetails = true,
  style,
}: ContaminantCheckCardProps) => {
  const [vegetableType, setVegetableType] = useState<string>(type);
  const [limits, setLimits] = useState<ContaminantLimit>({});

  useEffect(() => {
    const newLimits = getContaminantLimits(vegetableType);
    setLimits(newLimits);
  }, [vegetableType]);

  useEffect(() => {
    setVegetableType(type);
  }, [type]);

  const getContaminantsByGroup = (groupName: keyof typeof contaminantGroups) => {
    return contaminantGroups[groupName]
      .filter((name) => limits[name] !== undefined)
      .map((name) => ({ name, value: limits[name] }));
  };

  const getSpecificMetals = () => {
    return contaminantGroups["Kim loại nặng"]
      .filter((name) => contaminantLimits[vegetableType]?.[name] !== undefined)
      .map((name) => ({ name, value: contaminantLimits[vegetableType][name] }));
  };

  const cardTitle = (
    <div
      className="card-title"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Title level={4} style={{ margin: 0 }}>
        Tiêu chí kiểm định
      </Title>
    </div>
  );

  return (
    <Card style={style} title={cardTitle} variant="outlined" className="contaminant-check-card">
      <ContaminantGroup
        title="Kiểm định kim loại nặng"
        contaminants={getSpecificMetals()}
        unit={units["Kim loại nặng"]}
        color={groupColors["Kim loại nặng"]}
        icon={groupIcons["Kim loại nặng"]}
      />

      <ContaminantGroup
        title="Kiểm định vi sinh"
        contaminants={getContaminantsByGroup("Vi sinh")}
        unit={units["Vi sinh"]}
        color={groupColors["Vi sinh"]}
        icon={groupIcons["Vi sinh"]}
      />

      <ContaminantGroup
        title="Kiểm định hóa chất"
        contaminants={getContaminantsByGroup("Hóa chất")}
        unit={units["Hóa chất"]}
        color={groupColors["Hóa chất"]}
        icon={groupIcons["Hóa chất"]}
      />
    </Card>
  );
};

export default ContaminantCheckCard;
