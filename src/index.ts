import { getAsyncLifecycle, defineConfigSchema } from "@openmrs/esm-framework";
import { configSchema } from "./config-schema";

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

export const reportingComponent = getAsyncLifecycle(
  () => import("./components/ugandaemr-reporting/ugandaemr-reporting"),
  options
);

export const reportingLink = getAsyncLifecycle(
  () => import("./ugandaemr-reporting-link.component"),
  options
);

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}
