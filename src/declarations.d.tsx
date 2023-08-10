declare module "@carbon/react";
declare module "*.css";
declare module "*.scss";
declare module "*.png";

declare type SideNavProps = {};
declare type report = {
  reportName: string;
  reportUUID: string;
  startDate?: boolean;
  endDate?: boolean;
  location?: boolean;
  outputFormat: Array<string>;
}

declare type reportProps = {
  categoryName: string;
  reports:Array<report>;
}
