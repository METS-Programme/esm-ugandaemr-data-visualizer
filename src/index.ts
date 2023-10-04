import {
  getAsyncLifecycle,
  getSyncLifecycle,
  defineConfigSchema,
} from "@openmrs/esm-framework";
import { configSchema } from "./config-schema";
import { createDashboardLink } from "./create-dashboard-link.component";

const moduleName = "@ugandaemr/esm-data-visualizer-app";
const options = {
  featureName: "data-visualizer",
  moduleName,
};

export const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);

export const root = getAsyncLifecycle(
  () => import("./root.component"),
  options
);

export const reportingComponent = getAsyncLifecycle(
  () => import("./data-visualizer/data-visualizer.component"),
  options
);

export const dataVisualizerDashboardLink = getSyncLifecycle(
  createDashboardLink({
    name: "data-visualizer",
    slot: "data-visualizer-dashboard-slot",
    title: "Data visualizer",
  }),
  options
);

export const userDashboard = getAsyncLifecycle(
  () => import("./user-dashboard/user-dashboard.component"),
  options
);

export const userDashboardLink = getSyncLifecycle(
  createDashboardLink({
    name: "user-dashboard",
    slot: "user-dashboard-slot",
    title: "User Dashboard",
  }),
  options
);

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}
