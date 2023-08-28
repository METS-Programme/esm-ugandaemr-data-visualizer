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
