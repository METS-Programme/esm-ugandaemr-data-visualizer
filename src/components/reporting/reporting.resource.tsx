import useSWR from "swr";
import { openmrsFetch } from "@openmrs/esm-framework";
import {useMemo} from "react";

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

export function useGetIdentifiers(id: string) {
  const apiUrl = `/ws/rest/v1/patientidentifiertype`;
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    { data: { results: any } },
    Error
  >(id === "IDN" ? apiUrl : null, openmrsFetch);
  return {
    identifiers: data ? data?.data : [],
    isError: error,
    isLoadingIndentifiers: isLoading,
  };
}

export function useGetPatientAtrributes(id: string) {
  const apiUrl = `/ws/rest/v1/personattributetype`;
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    { data: { results: any } },
    Error
  >(id === "PAT" ? apiUrl : null, openmrsFetch);

  const memorisedAttributes = useMemo(
    () => (data ? data?.data : []),
    [data?.data.results]
  );

  return {
    personAttributes: memorisedAttributes,
    isLoadingPersonAttributes: isLoading,
    isError: error,
  };
}

export function useGetEncounterType() {
  const apiUrl = `/ws/rest/v1/encountertype`;
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    { data: { results: any } },
    Error
  >(apiUrl, openmrsFetch);
  return {
    encounterTypes: data ? data?.data : [],
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
    encounterConcepts: data ? data?.data : [],
    isError: error,
    isLoadingEncounterConcepts: isLoading,
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

  return arrayToReturn;
}
