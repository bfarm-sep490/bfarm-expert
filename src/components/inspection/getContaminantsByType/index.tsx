export interface Threshold {
  key: string;
  name: string;
  unit: string;
  warning: string;
  danger: string;
}

export function getContaminantsByType(type?: string): Threshold[] {
  const common: Threshold[] = [
    {
      key: "perchlorate",
      name: "Perchlorate",
      unit: "mg/kg",
      warning: "0.003",
      danger: "0.005",
    },
    {
      key: "chlorate",
      name: "Chlorate",
      unit: "mg/kg",
      warning: "0.008",
      danger: "0.01",
    },
    {
      key: "hydrogen_phosphide",
      name: "Hydrogen Phosphide",
      unit: "mg/kg",
      warning: "> 0",
      danger: "> 0",
    },
    {
      key: "methyl_bromide",
      name: "Methyl Bromide",
      unit: "mg/kg",
      warning: "0.008",
      danger: "0.01",
    },
    {
      key: "glyphosate_glufosinate",
      name: "Glyphosate & Glufosinate",
      unit: "mg/kg",
      warning: "0.005",
      danger: "0.01",
    },
    {
      key: "nitrat",
      name: "Nitrat",
      unit: "mg/kg",
      warning: "2000",
      danger: "5000",
    },
    {
      key: "dithiocarbamate",
      name: "Dithiocarbamate",
      unit: "mg/kg",
      warning: "0.005",
      danger: "0.01",
    },
    {
      key: "ecoli",
      name: "E. coli",
      unit: "CFU/g",
      warning: "100",
      danger: "1000",
    },
    {
      key: "salmonella",
      name: "Salmonella",
      unit: "CFU/25g",
      warning: "0",
      danger: "> 0",
    },
    {
      key: "coliforms",
      name: "Coliforms",
      unit: "CFU/g",
      warning: ">7.69< 10",
      danger: "10",
    },
    {
      key: "sulfur_dioxide",
      name: "Sulfur Dioxide",
      unit: "mg/kg",
      warning: "0",
      danger: "> 0",
    },
    {
      key: "nano3_kno3",
      name: "NaNO3/KNO3",
      unit: "",
      warning: "Không có dư lượng cụ thể",
      danger: "Không có dư lượng cụ thể",
    },
  ];

  const metalByType: Record<string, Threshold[]> = {
    "Rau họ thập tự": [
      {
        key: "cadmi",
        name: "Cadmi",
        unit: "mg/kg",
        warning: "0.03",
        danger: "0.05",
      },
      {
        key: "plumbum",
        name: "Chì",
        unit: "mg/kg",
        warning: "0.23",
        danger: "0.3",
      },
    ],
    Hành: [
      {
        key: "cadmi",
        name: "Cadmi",
        unit: "mg/kg",
        warning: "0.03",
        danger: "0.05",
      },
      {
        key: "plumbum",
        name: "Chì",
        unit: "mg/kg",
        warning: "0.07",
        danger: "0.1",
      },
    ],
    "Rau ăn lá": [
      {
        key: "cadmi",
        name: "Cadmi",
        unit: "mg/kg",
        warning: "0.15",
        danger: "0.2",
      },
      {
        key: "plumbum",
        name: "Chì",
        unit: "mg/kg",
        warning: "0.23",
        danger: "0.3",
      },
    ],
    "Rau ăn quả": [
      {
        key: "cadmi",
        name: "Cadmi",
        unit: "mg/kg",
        warning: "0.03",
        danger: "0.05",
      },
      {
        key: "plumbum",
        name: "Chì",
        unit: "mg/kg",
        warning: "0.07",
        danger: "0.1",
      },
    ],
    "Rau ăn củ": [
      {
        key: "cadmi",
        name: "Cadmi",
        unit: "mg/kg",
        warning: "0.07",
        danger: "0.1",
      },
      {
        key: "plumbum",
        name: "Chì",
        unit: "mg/kg",
        warning: "0.07",
        danger: "0.1",
      },
    ],
    "Rau ăn thân": [
      {
        key: "cadmi",
        name: "Cadmi",
        unit: "mg/kg",
        warning: "0.07",
        danger: "0.1",
      },
    ],
    Nấm: [
      {
        key: "cadmi",
        name: "Cadmi",
        unit: "mg/kg",
        warning: "0.15",
        danger: "0.2",
      },
      {
        key: "plumbum",
        name: "Chì",
        unit: "mg/kg",
        warning: "0.23",
        danger: "0.3",
      },
    ],
    "Rau họ đậu": [
      {
        key: "cadmi",
        name: "Cadmi",
        unit: "mg/kg",
        warning: "0.07",
        danger: "0.1",
      },
    ],
    "Rau củ quả": [
      {
        key: "hydrargyrum",
        name: "Thủy ngân",
        unit: "mg/kg",
        warning: "0.01",
        danger: "0.02",
      },
    ],
    "Rau khô": [
      {
        key: "arsen",
        name: "Arsen",
        unit: "mg/kg",
        warning: "0.7",
        danger: "1",
      },
    ],
  };

  return [...common, ...(metalByType[type || ""] || [])];
}
