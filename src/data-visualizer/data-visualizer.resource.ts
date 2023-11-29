import useSWR from "swr";
import { openmrsFetch, restBaseUrl } from "@openmrs/esm-framework";

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
  let apiUrl = `${restBaseUrl}ugandaemrreports/dataDefinition`;
  let fixedReportUrl = `${apiUrl}?startDate=${params.startDate}&endDate=${params.endDate}&uuid=${params.uuid}`;

  if (params.reportType === "fixed") {
    if (params.reportCategory.renderType === "html") {
      fixedReportUrl += `&renderType=${params.reportCategory.renderType}`;
    }
    return openmrsFetch(fixedReportUrl, {
      headers: {
        "Content-Type": "application/json",
      },
      signal: abortController.signal,
    });
  } else {
    const parameters =
      params.reportIndicators.length > 0
        ? formatReportArray(params.reportIndicators)
        : [];

    return openmrsFetch(apiUrl, {
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
