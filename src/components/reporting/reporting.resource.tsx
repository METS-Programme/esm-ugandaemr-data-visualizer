import useSWR from "swr";
import { openmrsFetch } from "@openmrs/esm-framework";

export function useReports(reportUUID?: string) {
  const apiUrl = `/ws/rest/v1/ugandaemrreports/reportingDefinition?uuid=${reportUUID}&startDate=2022-01-01&endDate=2022-01-31`;
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    { data: { results: any } },
    Error
  >(reportUUID ? apiUrl : null, openmrsFetch);
  return {
    reportData: data ? data?.data : [],
    isLoading,
    isError: error,
    isValidating,
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
