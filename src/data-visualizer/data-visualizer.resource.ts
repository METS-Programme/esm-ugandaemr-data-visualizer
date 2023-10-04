import useSWR from "swr";
import { openmrsFetch, restBaseUrl } from "@openmrs/esm-framework";

type fixedReportRequest = {
  reportUUID: string;
  startDate: string;
  endDate: string;
};

type dynamicReportRequest = {
  uuid: string;
  reportIndicators: Array<Indicator>;
  startDate: string;
  endDate: string;
};

type saveReportRequest = {
  reportName: string;
  reportDescription?: string;
  reportType?: string;
  columns?: string;
  rows: string;
  report_request_object: string;
};

export function useReports(params: fixedReportRequest) {
  const apiUrl = `${restBaseUrl}ugandaemrreports/reportingDefinition?uuid=${params.reportUUID}&startDate=${params.startDate}&endDate=${params.endDate}`;
  const { data, error, isLoading, isValidating } = useSWR<
    { data: { results: any } },
    Error
  >(params.reportUUID ? apiUrl : null, openmrsFetch);
  return {
    reportData: data ? data?.data : [],
    isLoading,
    isError: error,
    isValidating,
  };
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

export function useDynamicReportFetcher(params: dynamicReportRequest) {
  const parameters =
    params.reportIndicators.length > 0
      ? formatReportArray(params.reportIndicators)
      : [];
  const abortController = new AbortController();
  const apiUrl = params.uuid
    ? `${restBaseUrl}ugandaemrreports/dataDefinition`
    : null;
  const fetcher = () =>
    openmrsFetch(apiUrl, {
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

  const { data, error, isLoading, isValidating } = useSWR<
    {
      data: {
        results: any;
      };
    },
    Error
  >(apiUrl, fetcher);

  return {
    dynamicReportData: data ? data?.data : [],
    isError: error,
    isLoadingDynamicReport: isLoading,
    isValidatingDynamicReport: isValidating,
  };
}

export function useSaveReport(params: saveReportRequest) {
  const apiUrl = params.reportName ? `${restBaseUrl}dashboardReport` : null;
  const abortController = new AbortController();

  const fetcher = () =>
    openmrsFetch(apiUrl, {
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

  const { data, error, isLoading, isValidating } = useSWR<
    {
      data: {
        results: any;
      };
    },
    Error
  >(apiUrl, fetcher);

  return {
    savedReport: data ? data?.data : [],
    isErrorInSaving: error,
    isLoadingSaveReport: isLoading,
    isValidatingSaveReport: isValidating,
  };
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
