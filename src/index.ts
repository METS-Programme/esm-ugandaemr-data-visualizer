import { getAsyncLifecycle, defineConfigSchema, getSyncLifecycle } from "@openmrs/esm-framework";
import { configSchema } from "./config-schema";
import { dashboardMeta } from "./dashboardMeta";

declare var __VERSION__: string;
const version = __VERSION__;

const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);

const backendDependencies = {
  fhir2: "^1.2.0",
  "webservices.rest": "^2.2.0",
};

function setupOpenMRS() {
  const moduleName = "@ugandaemr/esm-ugandaemr-reporting";

  const options = {
    featureName: "ugandaemr-reporting",
    moduleName,
  };

  defineConfigSchema(moduleName, configSchema);

  return {
    pages: [
      {
        load: getAsyncLifecycle(
          () => import("./components/ugandaemr-reporting/ugandaemr-reporting"),
          options
        ),
        route: "reporting",
      },
    ],
    extensions: [
      {
        id: "ugandaemr-reporting-app-link",
        slot: "app-menu-slot",
        load: getAsyncLifecycle(
          () => import("./ugandaemr-reporting-link.component"),
          options
        ),
        online: true,
        offline: true,
      },
    ],
  };
}

export { backendDependencies, importTranslation, setupOpenMRS, version };
