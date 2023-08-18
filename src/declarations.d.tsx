declare module "@carbon/react";
declare module "*.css";
declare module "*.scss";
declare module "*.png";

declare type SideNavProps = {};
declare type report = {
  id: string;
  label: string;
  startDate?: boolean;
  endDate?: boolean;
  location?: boolean;
  outputFormat?: Array<string>;
  parameters?: Array<string>;
};

declare type reportProps = {
  categoryName: string;
  reports: Array<report>;
};
