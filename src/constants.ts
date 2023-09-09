export const basePath = "/reporting";

export const facilityReports: ReportProps = {
  categoryName: "FACILITY REPORTS",
  reports: [
    {
      id: "9c85e20b-c3ce-4dc1-b332-13f1d02f1c5c",
      label: "Appointments List",
    },
    {
      id: "654c7276-75f8-11e6-8b77-86f30ca893d3",
      label: "Missed Appointments List",
    },
    {
      id: "73585ad5-8a5c-4e4a-b197-9241abe24bd9",
      label: "Daily Missed Appointments List",
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
      id: "HMIS-105",
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
