declare module "@carbon/react";
declare module "*.css";
declare module "*.scss";
declare module "*.png";

declare type SideNavProps = {};

declare type Report = {
  id: string;
  label: string;
  startDate?: boolean;
  endDate?: boolean;
  location?: boolean;
  outputFormat?: Array<string>;
  parameters?: Array<string>;
};

declare type ReportProps = {
  categoryName: string;
  reports: Array<Report>;
};
