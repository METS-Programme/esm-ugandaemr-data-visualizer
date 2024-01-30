import useSWR from "swr";
import { openmrsFetch, restBaseUrl } from "@openmrs/esm-framework";
import {CQIReportingCohort} from "./data-visualizer.component";

type ReportRequest = {
  uuid: string;
  startDate: string;
  endDate: string;
  reportCategory?: {
    category: ReportCategory;
    renderType?: RenderType;
  };
  reportIndicators?: Array<Indicator>;
  reportType: ReportType;
  reportingCohort?: CQIReportingCohort;
};

type saveReportRequest = {
  reportName: string;
  reportDescription?: string;
  reportType?: string;
  columns?: string;
  rows: string;
  report_request_object: string;
};

export async function getReport(params: ReportRequest) {
  const abortController = new AbortController();
  let apiUrl = `${restBaseUrl}ugandaemrreports/reportingDefinition`;
  let fixedReportUrl = `${apiUrl}?startDate=${params.startDate}&endDate=${params.endDate}&uuid=${params.uuid}`;

  if (params.reportType === "fixed") {
    if (params.reportCategory.category === "cqi") {
      fixedReportUrl += `&cohortList=${params.reportingCohort}`;
    } else {
      if (params.reportCategory.renderType === "html") {
        fixedReportUrl += `&renderType=${params.reportCategory.renderType}`;
      }
    }

    return openmrsFetch(fixedReportUrl, {
      signal: abortController.signal,
    });
  } else {
    const parameters =
      params.reportIndicators.length > 0
        ? formatReportArray(params.reportIndicators)
        : [];

    return openmrsFetch(`${restBaseUrl}ugandaemrreports/dataDefinition`, {
      method: "POST",
      signal: abortController.signal,
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        cohort: {
          clazz: "",
          uuid: params.uuid,
          name: "",
          description: "",
          parameters: [
            {
              startDate: params.startDate,
            },
            {
              endDate: params.endDate,
            },
          ],
        },
        columns: parameters,
      },
    });
  }
}

export function useGetIdentifiers() {
  const apiUrl = `${restBaseUrl}patientidentifiertype`;
  const { data, error, isLoading, mutate } = useSWR<
    { data: { results: any } },
    Error
  >(apiUrl, openmrsFetch);
  return {
    identifiers: data
      ? mapDataElements(data?.data["results"], "PatientIdentifier")
      : [],
    isError: error,
    isLoadingIdentifiers: isLoading,
    mutate,
  };
}

export function useGetPatientAtrributes() {
  const apiUrl = `${restBaseUrl}personattributetype`;
  const { data, error, isLoading, mutate } = useSWR<
    { data: { results: any } },
    Error
  >(apiUrl, openmrsFetch);
  return {
    personAttributes: data
      ? mapDataElements(data?.data["results"], "PersonAttribute")
      : [],
    isLoadingAttributes: isLoading,
    isError: error,
    mutate,
  };
}

export function useGetEncounterType() {
  const apiUrl = `${restBaseUrl}encountertype`;
  const { data, error, isLoading } = useSWR<{ data: { results: any } }, Error>(
    apiUrl,
    openmrsFetch
  );
  return {
    encounterTypes: data ? mapDataElements(data?.data["results"]) : [],
    isError: error,
    isLoadingEncounterTypes: isLoading,
  };
}

export function useGetEncounterConcepts(uuid: string) {
  const apiUrl = `${restBaseUrl}ugandaemrreports/concepts/encountertype?uuid=${uuid}`;
  const { data, error, isLoading, mutate } = useSWR<
    {
      data: {
        results: any;
      };
    },
    Error
  >(uuid !== "IDN" && uuid !== "PAT" ? apiUrl : null, openmrsFetch);
  return {
    encounterConcepts: data
      ? mapDataElements(data?.data as any, null, "concepts")
      : [],
    isError: error,
    isLoadingEncounterConcepts: isLoading,
    mutate,
  };
}

export async function saveReport(params: saveReportRequest) {
  const apiUrl = `${restBaseUrl}dashboardReport`;
  const abortController = new AbortController();

  return openmrsFetch(apiUrl, {
    method: "POST",
    signal: abortController.signal,
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      name: params.reportName,
      description: params?.reportDescription,
      type: params?.reportType,
      columns: params?.columns,
      rows: params?.rows,
      report_request_object: params.report_request_object,
    },
  });
}

export function createColumns(columns: Array<string>) {
  let dataColumn: Array<Record<string, string>> = [];
  columns.map((column: string, index) => {
    dataColumn.push({
      id: `${index++}`,
      key: column,
      header: column,
      accessor: column,
    });
  });
  return dataColumn;
}

export function mapDataElements(
  dataArray: Array<Record<string, string>>,
  type?: string,
  category?: string
) {
  let arrayToReturn: Array<Indicator> = [];
  if (dataArray) {
    if (category === "concepts") {
      dataArray.map((encounterType: Record<string, string>) => {
        arrayToReturn.push({
          id: encounterType.uuid,
          label: encounterType.conceptName,
          type: encounterType.type,
        });
      });
    } else {
      dataArray.map((encounterType: Record<string, string>) => {
        arrayToReturn.push({
          id: encounterType.uuid,
          label: encounterType.display,
          type: type ?? "",
        });
      });
    }
  }

  return arrayToReturn;
}

export function formatReportArray(selectedItems: Array<Indicator>) {
  let arrayToReturn: Array<ReportParamItem> = [];
  if (selectedItems) {
    selectedItems.map((item: Indicator) => {
      arrayToReturn.push({
        label: item.label,
        type: item.type,
        expression: item.id,
      });
    });
  }

  return arrayToReturn;
}

export function getDateRange(selectedPeriod: string) {
  const currentDate = new Date();

  switch (selectedPeriod) {
    case "today":
      return {
        start: currentDate,
        end: currentDate,
      };
    case "week":
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

      const endOfWeek = new Date(currentDate);
      endOfWeek.setDate(currentDate.getDate() + (6 - currentDate.getDay()));

      return {
        start: startOfWeek,
        end: endOfWeek,
      };
    case "month":
      const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const endOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );
      return {
        start: startOfMonth,
        end: endOfMonth,
      };
    case "quarter":
      const quarter = Math.floor(currentDate.getMonth() / 3);
      const startOfQuarter = new Date(
        currentDate.getFullYear(),
        Math.floor(currentDate.getMonth() / 3) * 3,
        1
      );
      const endOfQuarter = new Date(
        currentDate.getFullYear(),
        (quarter + 1) * 3,
        0
      );
      return {
        start: startOfQuarter,
        end: endOfQuarter,
      };
    case "lastQuarter":
      const currentQuarter = Math.floor(currentDate.getMonth() / 3) + 1;
      let previousQuarter;
      let previousQuarterYear;

      if (currentQuarter === 1) {
        previousQuarter = 4;
        previousQuarterYear = currentDate.getFullYear() - 1;
      } else {
        previousQuarter = currentQuarter - 1;
        previousQuarterYear = currentDate.getFullYear();
      }

      const startOfPreviousQuarter = new Date(
        previousQuarterYear,
        (previousQuarter - 1) * 3,
        1
      );

      const endOfPreviousQuarter = new Date(
        previousQuarterYear,
        previousQuarter * 3,
        0
      );

      return {
        start: startOfPreviousQuarter,
        end: endOfPreviousQuarter,
      };
    default:
      return {
        start: null,
        end: null,
      };
  }
}

export function extractDate(timestamp: string): string {
  const dateObject = new Date(timestamp);
  const year = dateObject.getFullYear();
  const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
  const day = dateObject.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}
