import {
  getAsyncLifecycle,
  getSyncLifecycle,
  defineConfigSchema,
} from "@openmrs/esm-framework";
import { configSchema } from "./config-schema";
import { createDashboardLink } from "./create-dashboard-link.component";

const moduleName = "@ugandaemr/esm-reporting-app";
const options = {
  featureName: "ugandaemr-reporting",
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
  () => import("./components/reporting/reporting.component"),
  options
);

export const reportingDashboardLink = getSyncLifecycle(
  createDashboardLink({
    name: "reporting",
    slot: "reporting-dashboard-slot",
    title: "Reporting",
  }),
  options
);

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}
