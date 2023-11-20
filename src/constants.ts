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
    {
      id: "0272907f-f2bf-437f-8bf9-8c4cb0a983fa",
      label: "ART Patient Export",
    },
    {
      id: "9c85e2eb-c3ce-4dc1-b332-13f1d02f1c5a",
      label: "Facility Death List",
    },
    {
      id: "47bbb9e4-a160-47f7-a547-619fcc5dff0d",
      label: "Exposed Infants Due for 1st PCR",
    },
    {
      id: "cd8b4a66-f4e6-43b6-a4fd-061e57823cc4",
      label: "Exposed Infants Due for 2nd PCR",
    },
    {
      id: "1ff3e32c-5526-11e7-b407-15be7a295d59",
      label: "Exposed Infants Due for Rapid Test",
    },
    {
      id: "4f2cd763-6737-4e82-93e0-515d0633c58b",
      label: "Exposed Infants Due for Appointment",
    },
    {
      id: "09c76cd3-4585-4e1c-b3f7-78e2a5726d6d",
      label: "OptionB+ Weekly SMS Report",
    },
    {
      id: "2404d86c-81a4-4fda-9e77-ea4d6eacdfb6",
      label: "Transfer Out List",
    },
    {
      id: "795050b6-3804-46d7-b49f-cb146a6cbf74",
      label: "Transfer In List",
    },
    {
      id: "6325ccbd-2d98-4e8c-bc1c-befc2eb0dfa5",
      label: "Lost Clients",
    },
    {
      id: "a549c20a-ff8e-4b92-afbe-aeeaa4e47ff7",
      label: "Lost To Follow Up",
    },
    {
      id: "9d6c7e51-2257-4f56-addc-e37e8272ff9d",
      label: "Active Patients in Care",
    },
    {
      id: "72884470-099f-4c51-9313-4ba828980c18",
      label: "PEPFAR Active Patients in Care",
    },
    {
      id: "72884470-099f-4c51-9313-4ba828980c18",
      label: "PEPFAR Active Patients in Care",
    },
    {
      id: "23ef26dd-8e26-4109-b8f2-d102a119b901",
      label: "Due For Viral Load",
    },
    {
      id: "41814bf8-dfa9-4d67-a197-bd4b6e40db63",
      label: "Overdue for Viral Load",
    },
    {
      id: "8067d0cf-9925-4377-9b16-31e4c8500fe1",
      label: "Non Suppressed Viral Load",
    },
    {
      id: "96e0926d-1606-4de6-943f-cb036bdc15ad",
      label: "HTS Client Card Data Export",
    },
    {
      id: "9d066d2b-3cee-4fba-a148-bb82c4ba65ef",
      label: "Stablity Assessment Report",
    },
    {
      id: "941d0567-4848-41b2-8713-305667c89d01",
      label: "Patient DSDM Model Report",
    },
    {
      id: "e38117c0-9ddd-4d51-b3b7-a39e38fd85a1",
      label: "Patients Transitioned to DTG",
    },
    {
      id: "f9096e93-fae7-45a6-b2f7-7883d09f66e5",
      label: "TPT Status Report",
    },
    {
      id: "2fc0da7b-c297-48b2-857e-113da2a3b357",
      label: "Patients on First Line Regimens",
    },
    {
      id: "864b1e53-eb4c-4d74-bfbd-331f95554150",
      label: "Patients on Second Line Regimens",
    },
    {
      id: "d0647d6a-8dea-4536-b502-0a1a53a3d18e",
      label: "Patients on Third Line Regimens",
    },
    {
      id: "1381401f-1dd2-11b2-96d6-3d6bf54c9095",
      label: "Patients Regimen Change List",
    },
    {
      id: "6f1f996e-6f2c-4491-b055-2560242b1ab9",
      label: "Back To Care Services Report",
    },
    {
      id: "ca24a543-c0dc-45c2-baf7-a73e31060bb3",
      label: "Covid-19 Vaccination Report",
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
