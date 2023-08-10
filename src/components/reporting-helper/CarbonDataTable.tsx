import {
  Button,
  DataTable,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Tile,
} from "@carbon/react";
import { Intersect, Save, DocumentDownload } from "@carbon/icons-react";
import {
  isDesktop,
  useLayoutType,
  usePagination,
} from "@openmrs/esm-framework";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./carbon-data-tables.scss";
import { saveAs } from "file-saver";

type FilterProps = {
  rowIds: Array<string>;
  headers: any;
  cellsById: any;
  inputValue: string;
  getCellId: (row, key) => string;
};

const PatientList: React.FC = () => {
  const { t } = useTranslation();
  const layout = useLayoutType();
  const [allRows, setAllRows] = useState([]);
  const isTablet = useLayoutType() === "tablet";
  const [patients, setPatients] = useState([
    { id: "1", name: "John", age: 30, country: "Kampala", score: 85 },
    { id: "2", name: "Alice", age: 25, country: "Wakiso", score: 92 },
    { id: "3", name: "Bob", age: 28, country: "Kampala", score: 78 },
    { id: "4", name: "Sam", age: 30, country: "Wakiso", score: 85 },
    { id: "5", name: "Musa", age: 25, country: "Kampala", score: 92 },
    { id: "6", name: "Alex", age: 28, country: "Kampala", score: 78 },
    { id: "7", name: "Derrick", age: 30, country: "Kampala", score: 85 },
    { id: "8", name: "David", age: 25, country: "Kampala", score: 92 },
    { id: "9", name: "Solomon", age: 28, country: "Kampala", score: 78 },
    { id: "10", name: "Jaba", age: 30, country: "Kampala", score: 85 },
    { id: "11", name: "Jonathan", age: 25, country: "Kampala", score: 92 },
    { id: "12", name: "Daphine", age: 28, country: "Kampala", score: 78 },
  ]);
  const pageSizes = [10, 20, 30, 40, 50];
  const [currentPageSize, setPageSize] = useState(10);
  const {
    goTo,
    results: paginatedPatientEntries,
    currentPage,
  } = usePagination(patients, currentPageSize);

  const tableHeaders = [
    {
      id: 0,
      key: "id",
      header: t("id", "ID")
    },
    {
      id: 1,
      key: "name",
      header: t("status", "Patient Name"),
      accessor: "name",
    },
    { id: 2, key: "age", header: t("age", "Age"), accessor: "age" },
    {
      id: 3,
      key: "country",
      header: t("country", "District")
    },
    {
      id: 4,
      key: "score",
      header: t("score", "Viral Load")
    },
  ];
  // memoized
  useEffect(() => {
    let rows = [];

    paginatedPatientEntries.map((facility) => {
      return rows.push({
        id: facility.id,
        name: facility.name,
        age: facility.age,
        country: facility.country,
        score: facility.score,
      });
    });
    setAllRows(rows);
  }, [paginatedPatientEntries, allRows]);

  const handleFilter = ({
    rowIds,
    headers,
    cellsById,
    inputValue,
    getCellId,
  }: FilterProps): Array<string> => {
    return rowIds.filter((rowId) =>
      headers.some(({ key }) => {
        const cellId = getCellId(rowId, key);
        const filterableValue = cellsById[cellId].value;
        const filterTerm = inputValue.toLowerCase();

        if (typeof filterableValue === "boolean") {
          return false;
        }

        return ("" + filterableValue).toLowerCase().includes(filterTerm);
      })
    );
  };
  const handleExport = () => {
    const csvString = convertToCSV(patients, tableHeaders);
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "data.csv");
  };
  const convertToCSV = (data, columns) => {
    const header = columns.map((col) => col.header).join(",");
    const rows = data.map((row) =>
      columns.map((col) => JSON.stringify(row[col.key])).join(",")
    );
    return [header, ...rows].join("\n");
  };
  return (
    <>
      <DataTable
        data-floating-menu-container
        rows={allRows}
        headers={tableHeaders}
        filterRows={handleFilter}
        overflowMenuOnHover={isDesktop(layout) ? true : false}
        size={isTablet ? "lg" : "sm"}
        useZebraStyles
      >
        {({ rows, headers, getHeaderProps, getTableProps, onInputChange }) => (
          <div>
            <TableContainer className={styles.tableContainer}>
              <TableToolbar
                style={{
                  position: "static",
                  height: "3rem",
                  overflow: "visible",
                  backgroundColor: "color",
                }}
              >
                <TableToolbarContent className={styles.toolbarContent}>
                  <Button
                    size="sm"
                    kind="tertiary"
                    className={styles.patientListDownload}
                    renderIcon={DocumentDownload}
                    onClick={handleExport}
                  >
                    Download
                  </Button>
                  <TableToolbarSearch
                    className={styles.patientListSearch}
                    expanded
                    onChange={onInputChange}
                    placeholder={t("searchThisList", "Search this list")}
                    size="sm"
                  />
                </TableToolbarContent>
              </TableToolbar>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <TableHeader {...getHeaderProps({ header })}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow key={row.id}>
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>{cell.value}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {rows.length === 0 ? (
                <div className={styles.tileContainer}>
                  <Tile className={styles.tile}>
                    <div className={styles.tileContent}>
                      <p className={styles.content}>
                        {t("No data", "No data to display")}
                      </p>
                    </div>
                  </Tile>
                </div>
              ) : null}
              <Pagination
                forwardText="Next page"
                backwardText="Previous page"
                page={currentPage}
                pageSize={currentPageSize}
                pageSizes={pageSizes}
                totalItems={patients?.length}
                className={styles.pagination}
                onChange={({ pageSize, page }) => {
                  if (pageSize !== currentPageSize) {
                    setPageSize(pageSize);
                  }
                  if (page !== currentPage) {
                    goTo(page);
                  }
                }}
              />
            </TableContainer>
          </div>
        )}
      </DataTable>
    </>
  );
};

export default PatientList;
