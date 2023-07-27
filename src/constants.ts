export const spaRoot = window["getOpenmrsSpaBase"];
export const basePath = "/reporting";
export const spaBasePath = `${window.spaBase}${basePath}`;

export const facilityReports: reportProps = {
  categoryName: "FACILITY REPORTS",
  reports: [
    {
      reportName: "Appointments List",
      reportUUID: "",
      outputFormat: ["Excel", "CSV"],
    },
    {
      reportName: "Missed Appointments List",
      reportUUID: "",
      outputFormat: ["Excel", "CSV"],
    },
    {
      reportName: "Daily Appointments List",
      reportUUID: "",
      outputFormat: ["Excel", "CSV"],
    },
  ],
};

export const monthlyReports: reportProps = {
  categoryName: "MONTHLY REPORTS",
  reports: [
    {
      reportName: "HMIS 105 Section 2: ANTENANTAL",
      reportUUID: "",
      outputFormat: ["Excel", "CSV"],
    },
    {
      reportName: "HMIS 105 Section 2.3: POSTNATAL",
      reportUUID: "",
      outputFormat: ["Excel", "CSV"],
    },
    {
      reportName: "HMIS 105 Section 2.2: MATERNITY",
      reportUUID: "",
      outputFormat: ["Excel", "CSV"],
    },
  ],
};

export const quarterlyReports: reportProps = {
  categoryName: "QUARTERLY REPORTS",
  reports: [
    {
      reportName: "HMIS 106A Section 1A HC01 To HC15",
      reportUUID: "",
      outputFormat: ["Excel", "CSV"],
    },
    {
      reportName: "HMIS 106A Section 1A HC16 To HC28",
      reportUUID: "",
      outputFormat: ["Excel", "CSV"],
    },
    {
      reportName: "HMIS 106A Section 1A HC29 To HC48",
      reportUUID: "",
      outputFormat: ["Excel", "CSV"],
    },
  ],
};

export const merIndicatorReports: reportProps = {
  categoryName: "MER INDICATOR REPORTS",
  reports: [
    {
      reportName: "HCT_TST_Facility Report",
      reportUUID: "",
      outputFormat: ["Excel", "CSV"],
    },
    {
      reportName: "Tx Current_28Days Report",
      reportUUID: "",
      outputFormat: ["Excel", "CSV"],
    },
    {
      reportName: "Tx Current_90Days Report",
      reportUUID: "",
      outputFormat: ["Excel", "CSV"],
    },
  ],
};

//maternity
export const ADMISSION_DATE = "cb9b223e-a09c-4f8a-b34d-a0934a2af04a";
export const DELIVERY_TYPE = "dcc3ac63-30ab-102d-86b0-7a5022ba4115";

// facility Url
export const REGISTRY_URL =
  "https://nhfr-staging-api.planetsystems.co/nhfrApi/v0.0.1/externalSystem/search";

export const REGISTRY_REGIONS_URL =
  "https://nhfr-staging-api.planetsystems.co/nhfrApi/v0.0.1/externalSystem/by/Region";
