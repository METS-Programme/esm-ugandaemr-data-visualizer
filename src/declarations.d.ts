declare module "@carbon/react";
declare module "*.css";
declare module "*.scss";
declare module "*.png";

declare type SideNavProps = {};

declare type Report = {
  id: string;
  label: string;
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

type savedReport = {
  id: string;
  label: string;
  description: string;
  type: string;
  columns: string;
  rows: string;
  aggregator: string;
  report_request_object: string;
};

type savedDashboard = {
  uuid: string;
  name: string;
  description: string;
  items: any;
};

type ReportCategory = "facility" | "national" | "cqi";

type RenderType = "list" | "json" | "html";
type ReportType = "fixed" | "dynamic";
