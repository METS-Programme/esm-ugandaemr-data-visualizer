export const spaRoot = window["getOpenmrsSpaBase"];
export const basePath = "/reporting";
export const spaBasePath = `${window.spaBase}${basePath}`;

export const facilityReports: reportProps = {
  categoryName: "FACILITY REPORTS",
  reports: [
    {
      id: "APL",
      label: "Appointments List",
    },
    {
      id: "MPL",
      label: "Missed Appointments List",
    },
    {
      id: "DAL",
      label: "Daily Appointments List",
    },
  ],
};

export const nationalReports: reportProps = {
  categoryName: "MONTHLY REPORTS",
  reports: [
    {
      id: "HMIS106-1A",
      label: "HMIS 106A Section 1A",
    },
    {
      id: "HMIS106-1B",
      label: "HMIS 106A Section 1B",
    },
    {
      id: "",
      label: "HMIS 105 Section 2.2: MATERNITY",
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



export const data = [
  { id: "1", name: "John", age: 30, district: "Kampala", viral_load: 85 },
  { id: "2", name: "Alice", age: 25, district: "Wakiso", viral_load: 92 },
  { id: "3", name: "Bob", age: 28, district: "Kampala", viral_load: 78 },
  { id: "4", name: "Sam", age: 30, district: "Wakiso", viral_load: 85 },
  { id: "5", name: "Musa", age: 25, district: "Kampala", viral_load: 92 },
  { id: "6", name: "Alex", age: 28, district: "Kampala", viral_load: 78 },
  { id: "7", name: "Derrick", age: 30, district: "Kampala", viral_load: 85 },
  { id: "8", name: "David", age: 25, district: "Kampala", viral_load: 92 },
  { id: "9", name: "Solomon", age: 28, district: "Kampala", viral_load: 78 },
  { id: "10", name: "Jaba", age: 30, district: "Kampala", viral_load: 85 },
  {
    id: "11",
    name: "Jonathan",
    age: 25,
    district: "Kampala",
    viral_load: 92,
  },
  { id: "12", name: "Daphine", age: 28, district: "Kampala", viral_load: 78 },
];
export const displayContainer = {
  width: "100%",
  display: "flex",
  padding: "20px 0 20px 0",
};
export const displayInner1 = {
  width: "50%",
};
export const displayOption = {
  width: "10%",
  "margin-top": "10px",
  "font-weight": "600",
};
export const displayInner2 = {
  width: "40%",
};
