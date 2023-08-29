import useSWR from "swr";
import { openmrsFetch } from "@openmrs/esm-framework";

type reportRequest = {
  reportUUID: string;
  startDate: string;
  endDate: string;
};

export function useReports(params: reportRequest) {
  const apiUrl = `/ws/rest/v1/ugandaemrreports/reportingDefinition?uuid=${params.reportUUID}&startDate=${params.startDate}&endDate=${params.endDate}`;
  const { data, error, isLoading, isValidating, mutate } = useSWR<
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
  const apiUrl = `/ws/rest/v1/patientidentifiertype`;
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    { data: { results: any } },
    Error
  >(apiUrl, openmrsFetch);
  return {
    identifiers: data ? mapDataElements(data?.data["results"]) : [],
    isError: error,
    isLoadingIdentifiers: isLoading,
    mutate,
  };
}

export function useGetPatientAtrributes() {
  const apiUrl = `/ws/rest/v1/personattributetype`;
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    { data: { results: any } },
    Error
  >(apiUrl, openmrsFetch);
  return {
    personAttributes: data ? mapDataElements(data?.data["results"]) : [],
    isLoadingAttributes: isLoading,
    isError: error,
    mutate,
  };
}

export function useGetEncounterType() {
  const apiUrl = `/ws/rest/v1/encountertype`;
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    { data: { results: any } },
    Error
  >(apiUrl, openmrsFetch);
  return {
    encounterTypes: data ? mapDataElements(data?.data["results"]) : [],
    isError: error,
    isLoadingEncounterTypes: isLoading,
  };
}

export function useGetEncounterConcepts(uuid: string) {
  const apiUrl = `/ws/rest/v1/ugandaemrreports/concepts/encountertype?uuid=${uuid}`;
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    {
      data: {
        results: any;
      };
    },
    Error
  >(uuid !== "IDN" && uuid !== "PAT" ? apiUrl : null, openmrsFetch);
  return {
    encounterConcepts: data
      ? mapDataElements(data?.data as any, "concepts")
      : [],
    isError: error,
    isLoadingEncounterConcepts: isLoading,
    mutate,
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
  type?: string
) {
  let arrayToReturn: Array<Indicator> = [];
  if (dataArray) {
    if (type === "concepts") {
      dataArray.map((encounterType: Record<string, string>, index) => {
        arrayToReturn.push({
          id: encounterType.uuid,
          label: encounterType.conceptName,
        });
      });
    } else {
      dataArray.map((encounterType: Record<string, string>, index) => {
        arrayToReturn.push({
          id: encounterType.uuid,
          label: encounterType.display,
        });
      });
    }
  }

  return arrayToReturn;
}

export function useGetConceptElements(uuid: string) {
  let data: Array<Indicator> = [];
  const { encounterConcepts, isLoadingEncounterConcepts } =
    useGetEncounterConcepts(uuid);
  if (!isLoadingEncounterConcepts) {
    data = encounterConcepts;
  }

  return data;
}
