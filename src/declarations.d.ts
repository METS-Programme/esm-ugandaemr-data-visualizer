declare module "@carbon/react";
declare module "*.css";
declare module "*.scss";
declare module "*.png";

declare type SideNavProps = {};

declare type Report = {
  id: string;
  label: string;
  clazz?: string;
};

declare type ReportProps = {
  categoryName: string;
  reports: Array<Report>;
};

declare type Indicator = {
  id: string;
  label: string;
  type?: string;
  attributes?: Array<IndicatorItem>;
};

declare type IndicatorItem = {
  id: string;
  label: string;
  type?: string;
};

declare type ReportParamItem = {
  label: string;
  type?: string;
  expression: string;
};
