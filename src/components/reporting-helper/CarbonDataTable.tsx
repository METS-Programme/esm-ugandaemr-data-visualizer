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
  OverflowMenu,
  OverflowMenuItem,
} from "@carbon/react";
import { DocumentDownload } from "@carbon/icons-react";
import {
  isDesktop,
  useLayoutType,
  usePagination,
} from "@openmrs/esm-framework";
import React, { useEffect, useState } from "react";
import { data } from "../../constants";
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
  const [patients, setPatients] = useState(data);
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
      header: t("id", "ID"),
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
      header: t("country", "District"),
    },
    {
      id: 4,
      key: "score",
      header: t("score", "Viral Load"),
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
        country: facility.district,
        score: facility.viral_load,
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
  const handleExport = (object) => {
    const csvString = convertToCSV(patients, tableHeaders);
    if (object.currentTarget.innerText == "Download As CSV") {
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8" });
      saveAs(blob, "data.csv");
    } else if (object.currentTarget.innerText == "Download As Json") {
      const jsonBlob = new Blob([csvString], { type: "application/json" });
      saveAs(jsonBlob, "data.json");
    }
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
                  <OverflowMenu
                    size="sm"
                    kind="tertiary"
                    renderIcon={DocumentDownload}
                    iconDescription="Download As"
                    focusTrap={false}
                  >
                    <OverflowMenuItem
                      itemText="Download As CSV"
                      onClick={handleExport}
                    />
                    <OverflowMenuItem
                      itemText="Download As PDF"
                      onClick={handleExport}
                    />
                    <OverflowMenuItem
                      itemText="Download As Json"
                      onClick={handleExport}
                    />
                  </OverflowMenu>
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
