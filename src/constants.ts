export const spaRoot = window["getOpenmrsSpaBase"];
export const basePath = "/reporting";
export const spaBasePath = `${window.spaBase}${basePath}`;

export const facilityReports: ReportProps = {
  categoryName: "FACILITY REPORTS",
  reports: [
    {
      id: "9c85e20b-c3ce-4dc1-b332-13f1d02f1c5c",
      label: "Appointments List",
      clazz:
        "org.openmrs.module.ugandaemrreports.definition.cohort.definition.ActivesInCareCohortDefinition",
    },
    {
      id: "654c7276-75f8-11e6-8b77-86f30ca893d3",
      label: "Missed Appointments List",
      clazz: "",
    },
    {
      id: "73585ad5-8a5c-4e4a-b197-9241abe24bd9",
      label: "Daily Missed Appointments List",
      clazz: "",
    },
  ],
};

export const nationalReports: ReportProps = {
  categoryName: "MONTHLY REPORTS",
  reports: [
    {
      id: "HMIS106-1A",
      label: "HMIS 106A",
    },
    {
      id: "",
      label: "HMIS 105",
    },
    {
      id: "TxC28",
      label: "Tx Current_28Days Report",
    },
    {
      id: "TxC90",
      label: "Tx Current_90Days Report",
    },
  ],
};

export const Indicators: any = {
  Indicators: [
    {
      id: "IDN",
      label: "Identifiers",
      parameters: ["HIV Clinic No.", "OPD No.", "TB No.", "Patient No.", "NIN"],
    },
    {
      id: "APA",
      label: "Person Attributes",
      parameters: [
        "Family Name",
        "Given Name",
        "Marital Status",
        "Occupation",
        "Birthdate",
        "Gender",
      ],
    },
    {
      id: "DAL",
      label: "ART Attributes",
      parameters: [
        "DSDM Model",
        "Viral Load",
        "Current Regimen",
        "Advanced Disease",
        "Gender",
      ],
    },
  ],
};

export const testData = [
  { name: "John", age: 30, district: "Kampala", viral_load: 85 },
  { name: "Alice", age: 25, district: "Wakiso", viral_load: 92 },
  { name: "Bob", age: 28, district: "Kampala", viral_load: 78 },
  { name: "Sam", age: 30, district: "Wakiso", viral_load: 85 },
  { name: "Musa", age: 25, district: "Kampala", viral_load: 92 },
  { name: "Alex", age: 28, district: "Kampala", viral_load: 78 },
  { name: "Derrick", age: 30, district: "Kampala", viral_load: 85 },
  { name: "David", age: 25, district: "Kampala", viral_load: 92 },
  { name: "Solomon", age: 28, district: "Kampala", viral_load: 78 },
  { name: "Jaba", age: 30, district: "Kampala", viral_load: 85 },
  {
    name: "Jonathan",
    age: 25,
    district: "Kampala",
    viral_load: 92,
  },
  { name: "Daphine", age: 28, district: "Kampala", viral_load: 78 },
];

export const tableHeadersTest = [
  {
    id: 1,
    key: "name",
    header: "Patient Name",
    accessor: "name",
  },
  { id: 2, key: "age", header: "Age", accessor: "age" },
  {
    id: 3,
    key: "district",
    header: "District",
  },
  {
    id: 4,
    key: "viral_load",
    header: "Viral Load",
  },
];

export const reportIndicators: Array<Indicator> = [
  {
    id: "IDN",
    label: "Identifiers",
    type: "PatientIdentifier",
    attributes: [],
  },
  {
    id: "PAT",
    label: "Person Attributes",
    type: "PersonAttribute",
    attributes: [],
  },
];
