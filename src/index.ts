import {
  getAsyncLifecycle,
  defineConfigSchema,
  getSyncLifecycle,
} from "@openmrs/esm-framework";
import { configSchema } from "./config-schema";
import { dashboardMeta } from "./ReportingDashboard.meta";
import { createDashboardLink } from "./createDashboardLink";

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
      {
        load: getAsyncLifecycle(
          () => import("./components/ugandaemr-reporting/ugandaemr-reporting"),
          options
        ),
        route: /patient-reports/,
        online: true,
        offline: true,
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
      // {
      //   id: "report-link",
      //   slot: "nav-menu-slot",
      //   load: getSyncLifecycle(createDashboardLink(dashboardMeta), options),
      //   meta: dashboardMeta,
      //   offline: true,
      //   online: true,
      // },
      // {
      //   id: "reporting-dashboard",
      //   slot: "patient-reporting-dashboard-slot",
      //   load: getAsyncLifecycle(
      //     () => import("./components/ugandaemr-reporting/ugandaemr-reporting"),
      //     {
      //       featureName: "reportings landing page",
      //       moduleName,
      //     }
      //   ),
      // },
    ],
  };
}

export { backendDependencies, importTranslation, setupOpenMRS, version };
