/* eslint-disable prettier/prettier */
import { Typography, Tag } from "antd";

export const LIMITS: Record<string, number> = {
  arsen: 0.5,
  plumbum: 0.3,
  cadmi: 0.05,
  hydragyrum: 0.01,
  glyphosate_glufosinate: 0.1,
  sulfur_dioxide: 30,
  methyl_bromide: 0.01,
  hydrogen_phosphide: 0.05,
  dithiocarbamate: 1.0,
  nitrat: 2000,
  nano3_kno3: 500,
  chlorate: 0.01,
  perchlorate: 0.01,
  salmonella: 0,
  ecoli: 10,
  coliforms: 100,
};

export const UNITS: Record<string, string> = {
  arsen: "mg/kg",
  plumbum: "mg/kg",
  cadmi: "mg/kg",
  hydragyrum: "mg/kg",
  glyphosate_glufosinate: "mg/kg",
  sulfur_dioxide: "mg/kg",
  methyl_bromide: "mg/kg",
  hydrogen_phosphide: "mg/kg",
  dithiocarbamate: "mg/kg",
  nitrat: "mg/kg",
  nano3_kno3: "mg/kg",
  chlorate: "mg/kg",
  perchlorate: "mg/kg",
  salmonella: "CFU/25g",
  ecoli: "CFU/g",
  coliforms: "CFU/g",
};

export const columns = [
  {
    title: "Chỉ tiêu",
    dataIndex: "label",
    key: "label",
    render: (text: string) => <Typography.Text strong>{text}</Typography.Text>,
  },
  {
    title: "Giá trị",
    dataIndex: "value",
    key: "value",
    render: (value: number, record: any) => {
      const limit = LIMITS[record.key];
      const isExceed = limit !== undefined && value > limit;
      return <Tag color={isExceed ? "red" : "green"}>{value}</Tag>;
    },
  },
];

export type ChemicalCategory = {
  title: string;
  keys: string[];
};

export const chemicalGroups: ChemicalCategory[] = [
  { title: "Kim loại nặng", keys: ["arsen", "plumbum", "cadmi", "hydragyrum"] },
  { title: "Vi sinh vật gây bệnh", keys: ["salmonella", "coliforms", "ecoli"] },
  {
    title: "Thuốc trừ sâu & tồn dư BVTV",
    keys: [
      "glyphosate_glufosinate",
      "dithiocarbamate",
      "chlorate",
      "perchlorate",
    ],
  },
  {
    title: "Chất xông hơi & bảo quản",
    keys: ["sulfur_dioxide", "methyl_bromide", "hydrogen_phosphide"],
  },
  {
    title: "Hóa chất nông nghiệp",
    keys: ["nitrat", "nano3_kno3"],
  },
];

export const getChemicalData = (inspectionResult?: any) =>
  !inspectionResult
    ? []
    : [
        {
          key: "arsen",
          label: `Arsen (${UNITS["arsen"]})`,
          value: inspectionResult?.arsen,
        },

        {
          key: "plumbum",
          label: `Plumbum (${UNITS["plumbum"]})`,
          value: inspectionResult?.plumbum,
        },
        {
          key: "cadmi",
          label: `Cadmium (${UNITS["cadmi"]})`,
          value: inspectionResult?.cadmi,
        },
        {
          key: "hydragyrum",
          label: `Mercury (${UNITS["hydragyrum"]})`,
          value: inspectionResult?.hydrargyrum,
        },
        {
          key: "salmonella",
          label: `Salmonella (${UNITS["salmonella"]})`,
          value: inspectionResult?.salmonella,
        },
        {
          key: "coliforms",
          label: `Coliforms (${UNITS["coliforms"]})`,
          value: inspectionResult?.coliforms,
        },
        {
          key: "ecoli",
          label: `E. Coli (${UNITS["ecoli"]})`,
          value: inspectionResult?.ecoli,
        },
        {
          key: "glyphosate_glufosinate",
          label: `Glyphosate/Glufosinate (${UNITS["glyphosate_glufosinate"]})`,
          value: inspectionResult?.glyphosate_glufosinate,
        },
        {
          key: "sulfur_dioxide",
          label: `Sulfur Dioxide (${UNITS["sulfur_dioxide"]})`,
          value: inspectionResult?.sulfur_dioxide,
        },
        {
          key: "methyl_bromide",
          label: `Methyl Bromide (${UNITS["methyl_bromide"]})`,
          value: inspectionResult?.methyl_bromide,
        },
        {
          key: "hydrogen_phosphide",
          label: `Hydrogen Phosphide (${UNITS["hydrogen_phosphide"]})`,
          value: inspectionResult?.hydrogen_phosphide,
        },
        {
          key: "dithiocarbamate",
          label: `Dithiocarbamate (${UNITS["dithiocarbamate"]})`,
          value: inspectionResult?.dithiocarbamate,
        },
        {
          key: "nitrat",
          label: `Nitrat (${UNITS["nitrat"]})`,
          value: inspectionResult?.nitrat,
        },
        {
          key: "nano3_kno3",
          label: `Nano3/KNO3 (${UNITS["nano3_kno3"]})`,
          value: inspectionResult?.nano3_kno3,
        },
        {
          key: "chlorate",
          label: `Chlorate (${UNITS["chlorate"]})`,
          value: inspectionResult?.chlorate,
        },
        {
          key: "perchlorate",
          label: `Perchlorate (${UNITS["perchlorate"]})`,
          value: inspectionResult?.perchlorate,
        },
      ];
