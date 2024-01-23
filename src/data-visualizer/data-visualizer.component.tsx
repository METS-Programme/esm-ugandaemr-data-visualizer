import React, { useCallback, useEffect, useState } from "react";
import PivotTableUI from "react-pivottable/PivotTableUI";
import TableRenderers from "react-pivottable/TableRenderers";
import Plot from "react-plotly.js";
import createPlotlyRenderers from "react-pivottable/PlotlyRenderers";
import Illustration from "./data-visualizer-illustration.component";
import {
  ArrowLeft,
  ArrowRight,
  Catalog,
  CrossTab,
  Intersect,
  ImageService,
  SendAlt,
} from "@carbon/react/icons";
import {
  Accordion,
  AccordionItem,
  Button,
  ComboBox,
  ContentSwitcher,
  DataTableSkeleton,
  DatePicker,
  DatePickerInput,
  Form,
  FormGroup,
  FormLabel,
  Layer,
  Modal,
  RadioButton,
  RadioButtonGroup,
  Stack,
  Switch,
  TextInput,
  TextArea,
  OverflowMenu,
  OverflowMenuItem,
  Tile,
} from "@carbon/react";
import ReportingHomeHeader from "../components/header/header.component";
import {
  CQIReportHeaders,
  cqiReports,
  donorReports,
  facilityReports,
  integrationDataExports,
  nationalReports,
  reportIndicators,
  reportTypes,
} from "../constants";
import DataList from "../components/data-table/data-table.component";
import EmptyStateIllustration from "../components/empty-state/empty-state-illustration.component";
import Panel from "../components/panel/panel.component";
import pivotTableStyles from "!!raw-loader!react-pivottable/pivottable.css";
import styles from "./data-visualizer.scss";
import {
  createColumns,
  extractDate,
  getDateRange,
  getReport,
  saveReport,
  useGetEncounterConcepts,
  useGetEncounterType,
  useGetIdentifiers,
  useGetPatientAtrributes,
} from "./data-visualizer.resource";
import dayjs from "dayjs";
import { showNotification, showToast } from "@openmrs/esm-framework";
import {CQIData} from "../sample-data";
type ChartType = "list" | "pivot" | "aggregate";
type ReportingDuration = "fixed" | "relative";
type ReportingPeriod = "today" | "week" | "month" | "quarter" | "lastQuarter";
const DataVisualizer: React.FC = () => {
  let title,
    description = "";
  const PlotlyRenderers = createPlotlyRenderers(Plot);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [data, setData] = useState([]);
  const [pivotTableData, setPivotTableData] = useState(data);
  const [chartType, setChartType] = useState<ChartType>("list");
  const [reportType, setReportType] = useState<ReportType>("fixed");
  const [reportCategory, setReportCategory] = useState<{
    category: ReportCategory;
    renderType?: RenderType;
  }>({ category: "facility", renderType: "list" });
  const [reportingDuration, setReportingDuration] =
    useState<ReportingDuration>("fixed");
  const [reportingPeriod, setReportingPeriod] =
    useState<ReportingPeriod>("today");
  const [selectedIndicators, setSelectedIndicators] = useState<Indicator>(null);
  const [selectedReport, setSelectedReport] = useState<Report>(
    facilityReports.reports[0]
  );

  useEffect(() => {
    let initialSelectedReport;

    if (reportType === "fixed") {
      switch (reportCategory.category) {
        case "facility":
          initialSelectedReport = facilityReports.reports[0];
          break;
        case "donor":
          initialSelectedReport = donorReports.reports[0];
          break;
        case "national":
          initialSelectedReport = nationalReports.reports[0];
          break;
        case "cqi":
          initialSelectedReport = cqiReports.reports[0];
          break;
        case "integration":
          initialSelectedReport = integrationDataExports.reports[0];
          break;
        default:
          initialSelectedReport = facilityReports.reports[0];
      }
    } else {
      initialSelectedReport = facilityReports.reports[0];
      setChartType("list");
    }

    setSelectedReport(initialSelectedReport);
  }, [reportCategory, reportType]);

  const handleSelectedReport = ({ selectedItem }) => {
    setSelectedReport(selectedItem);
  };
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLineList, setShowLineList] = useState(false);
  const [availableParameters, setAvailableParameters] = useState([]);
  const [selectedParameters, setSelectedParameters] = useState<
    Array<Indicator>
  >([]);
  const [showFilters, setShowFilters] = useState(false);
  const [reportName, setReportName] = useState("Patient List");
  const { identifiers, isLoadingIdentifiers } = useGetIdentifiers();
  const { personAttributes, isLoadingAttributes } = useGetPatientAtrributes();
  const { encounterTypes } = useGetEncounterType();
  const [hasRetrievedConcepts, setHasRetrievedConcepts] = useState(false);
  const [saveReportModal, setSaveReportModal] = useState(false);
  const [reportTitle, setReportTitle] = useState(null);
  const [reportDescription, setReportDescription] = useState(null);
  const [htmlContent, setHTML] = useState("");
  const { encounterConcepts, isLoadingEncounterConcepts } =
    useGetEncounterConcepts(selectedIndicators?.id);

  const handleChartTypeChange = ({ name }) => {
    setChartType(name);
  };

  const handleReportTypeChange = ({ name }) => {
    setReportType(name);
  };

  const handleReportingDurationChange = (period) => {
    setReportingDuration(period);
  };

  const showSaveReportModal = () => {
    setSaveReportModal(true);
  };

  const closeReportModal = () => {
    setSaveReportModal(false);
  };

  const handleSaveReport = useCallback(() => {
    setReportTitle(title);
    setReportDescription(description);

    saveReport({
      reportName: title,
      reportDescription: description,
      reportType: pivotTableData?.["rendererName"],
      columns: "",
      rows: "",
      report_request_object: JSON.stringify(pivotTableData),
    }).then(
      (response) => {
        if (response.status === 200) {
          showToast({
            critical: true,
            title: "Saving Report",
            kind: "success",
            description: `Report ${reportTitle} saved Successfully`,
          });
          setSaveReportModal(false);
        }
      },
      (error) => {
        showNotification({
          title: "Error saving report",
          kind: "error",
          critical: true,
          description: error?.message,
        });
      }
    );
  }, [description, pivotTableData, reportTitle, title]);

  const handleReportTitleChange = (event) => {
    title = event.target.value;
  };

  const handleReportDescChange = (event) => {
    description = event.target.value;
  };

  const moveAllFromLeftToRight = (selectedParameter) => {
    const updatedAvailableParameters = availableParameters.filter(
      (parameter) => parameter !== selectedParameter
    );
    setAvailableParameters(updatedAvailableParameters);

    setSelectedParameters([...selectedParameters, selectedParameter]);
  };

  const moveAllFromRightToLeft = (selectedParameter) => {
    const updatedSelectedParameters = selectedParameters.filter(
      (parameter) => parameter !== selectedParameter
    );
    setSelectedParameters(updatedSelectedParameters);

    let updatedAvailableParameters = [...availableParameters];

    selectedIndicators.attributes.filter((parameter) => {
      if (parameter === selectedParameter) {
        updatedAvailableParameters = [
          ...updatedAvailableParameters,
          selectedParameter,
        ];
      }
    });
    setAvailableParameters(updatedAvailableParameters);
  };

  const moveAllParametersLeft = () => {
    setAvailableParameters(selectedIndicators.attributes);
    setSelectedParameters([]);
  };

  const moveAllParametersRight = () => {
    setSelectedParameters([...availableParameters, ...selectedParameters]);
    setAvailableParameters([]);
  };

  const handleIndicatorChange = ({ selectedItem }) => {
    switch (selectedItem.id) {
      case "IDN":
        if (!isLoadingIdentifiers && identifiers?.length > 0) {
          selectedItem.attributes = identifiers;
        }
        break;
      case "PAT":
        if (!isLoadingAttributes && personAttributes?.length > 0) {
          selectedItem.attributes = personAttributes;
        }
        break;
      default:
        setHasRetrievedConcepts(false);
        break;
    }
    setSelectedIndicators(selectedItem);
    setAvailableParameters(selectedItem.attributes ?? []);
  };

  const handleDynamicReportTypeChange = ({ selectedItem }) => {
    setSelectedReport(selectedItem);
  };

  const handleFiltersToggle = () => {
    showFilters === true ? setShowFilters(false) : setShowFilters(true);
  };

  const handleStartDateChange = (selectedDate) => {
    setStartDate(dayjs(selectedDate[0]).format("YYYY-MM-DD"));
  };

  const handleEndDateChange = (selectedDate) => {
    setEndDate(dayjs(selectedDate[0]).format("YYYY-MM-DD"));
  };

  const handleReportCategoryChange = (selectedItem) => {
    const typeOfReport = selectedItem.selectedItem.id;
    if (typeOfReport === "national") {
      setReportCategory({
        category: "national",
        renderType: "html",
      });
      setChartType("aggregate");
    } else if (typeOfReport === "cqi") {
      setReportCategory({ category: "cqi" });
      setChartType("aggregate");
    } else if (typeOfReport === "donor") {
      setReportCategory({
        category: "donor",
        renderType: "html",
      });
      setChartType("aggregate");
    } else if (typeOfReport === "integration") {
      setReportCategory({ category: "integration" });
      setChartType("list");
    } else {
      setReportCategory({ category: "facility" });
      setChartType("list");
    }
  };

  const handleReportingPeriod = (selectedPeriod: ReportingPeriod) => {
    setReportingPeriod(selectedPeriod);
    const dateRange = getDateRange(selectedPeriod);
    setStartDate(dayjs(dateRange.start).format("YYYY-MM-DD"));
    setEndDate(dayjs(dateRange.end).format("YYYY-MM-DD"));
  };

  const handleUpdateReport = () => {
    setShowLineList(true);
    setLoading(false);
    setShowFilters(false);
    setTableHeaders(CQIReportHeaders);
    setData(CQIData);
    setPivotTableData(CQIData);
    setReportName(selectedReport?.label);
  }

  // const handleUpdateReport = useCallback(() => {
  //   setShowLineList(true);
  //   setLoading(true);
  //
  //   getReport({
  //     uuid: selectedReport.id,
  //     startDate: startDate,
  //     endDate: endDate,
  //     reportCategory: reportCategory,
  //     reportIndicators: selectedParameters,
  //     reportType: reportType,
  //   }).then(
  //     (response) => {
  //       if (response.status === 200) {
  //         let headers = [];
  //         let dataForReport: any = [];
  //         const reportData = response?.data;
  //         if (reportType === "fixed") {
  //           if (reportCategory.renderType === "html") {
  //             response?.text().then((htmlString) => {
  //               setHTML(htmlString);
  //             });
  //           } else {
  //             const responseReportName = Object.keys(reportData)[0];
  //             if (
  //               reportData[responseReportName] &&
  //               reportData[responseReportName][0]
  //             ) {
  //               let columnNames = Object.keys(
  //                 reportData[responseReportName][0]
  //               );
  //               if (
  //                 selectedReport.id === "bf79f017-8591-4eaf-88c9-1cde33226517"
  //               ) {
  //                 columnNames = columnNames
  //                   .reverse()
  //                   .filter((column) => column !== "EDD" && column !== "Names");
  //                 headers = createColumns(columnNames);
  //                 dataForReport = reportData[responseReportName]
  //                   .filter((row) => row.PhoneNumber)
  //                   .map((row) => {
  //                     const formattedDate = extractDate(row.LastVisitDate);
  //                     if (row.PhoneNumber && row.PhoneNumber.startsWith("0")) {
  //                       return {
  //                         ...row,
  //                         PhoneNumber: "256" + row.PhoneNumber.substring(1),
  //                         LastVisitDate: formattedDate,
  //                       };
  //                     }
  //                     return row;
  //                   });
  //               } else {
  //                 headers = createColumns(columnNames).slice(0, 10);
  //                 dataForReport = reportData[responseReportName];
  //               }
  //             } else {
  //               setShowLineList(false);
  //             }
  //           }
  //         } else {
  //           if (reportData[0]) {
  //             const columnNames = Object.keys(reportData[0]);
  //             headers = createColumns(columnNames).slice(0, 10);
  //             dataForReport = reportData;
  //           } else {
  //             setShowLineList(false);
  //           }
  //         }
  //
  //         setLoading(false);
  //         setShowFilters(false);
  //         setTableHeaders(headers);
  //         setData(dataForReport);
  //         setPivotTableData(dataForReport);
  //         setReportName(selectedReport?.label);
  //       }
  //     },
  //     (error) => {
  //       setLoading(false);
  //       setShowFilters(false);
  //       showNotification({
  //         title: "Error fetching report",
  //         kind: "error",
  //         critical: true,
  //         description: error?.message,
  //       });
  //     }
  //   );
  // }, [
  //   endDate,
  //   reportCategory,
  //   reportType,
  //   selectedParameters,
  //   selectedReport,
  //   startDate,
  // ]);

  if (!isLoadingEncounterConcepts && encounterConcepts?.length > 0) {
    if (!hasRetrievedConcepts) {
      setAvailableParameters(encounterConcepts);
      selectedIndicators.attributes = encounterConcepts as Array<Indicator>;
      setHasRetrievedConcepts(true);
    }
  }

  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = `${pivotTableStyles}`;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <>
      <ReportingHomeHeader illustrationComponent={<Illustration />} />

      <div className={styles.container}>
        <Accordion className={styles.accordion}>
          <AccordionItem
            className={styles.heading}
            title="Report filters"
            open={showFilters}
            onHeadingClick={handleFiltersToggle}
          >
            <Form className={styles.form}>
              <Stack gap={2}>
                <FormGroup>
                  <FormLabel className={styles.label}>Type of report</FormLabel>
                  <ContentSwitcher size="sm" onChange={handleReportTypeChange}>
                    <Switch name="fixed" text="Fixed" />
                    <Switch name="dynamic" text="Dynamic" />
                  </ContentSwitcher>
                </FormGroup>

                {reportType === "fixed" && (
                  <>
                    <FormGroup>
                      <FormLabel className={styles.label}>
                        Which kind of report do you want to show?
                      </FormLabel>
                      <ComboBox
                        ariaLabel="Select Report Type"
                        id="ReportTypeCombobox"
                        items={reportTypes}
                        hideLabel
                        onChange={handleReportCategoryChange}
                        selectedItem={
                          reportTypes.filter(
                            (item) => item.id === reportCategory.category
                          )[0]
                        }
                      />
                    </FormGroup>

                    {reportCategory.category === "facility" && (
                      <FormGroup>
                        <FormLabel className={styles.label}>
                          Facility Reports
                        </FormLabel>
                        <ComboBox
                          ariaLabel="Select facility report"
                          id="facilityReportsCombobox"
                          items={facilityReports.reports}
                          hideLabel
                          onChange={handleSelectedReport}
                          selectedItem={selectedReport}
                        />
                      </FormGroup>
                    )}

                    {reportCategory.category === "national" && (
                      <FormGroup>
                        <FormLabel className={styles.label}>
                          National Reports
                        </FormLabel>
                        <ComboBox
                          ariaLabel="Select national report"
                          id="nationalReportsCombobox"
                          items={nationalReports.reports}
                          hideLabel
                          onChange={handleSelectedReport}
                          selectedItem={selectedReport}
                        />
                      </FormGroup>
                    )}

                    {reportCategory.category === "donor" && (
                      <FormGroup>
                        <FormLabel className={styles.label}>
                          Donor Reports
                        </FormLabel>
                        <ComboBox
                          ariaLabel="Select donor report"
                          id="donorReportsCombobox"
                          items={donorReports.reports}
                          hideLabel
                          onChange={handleSelectedReport}
                          selectedItem={selectedReport}
                        />
                      </FormGroup>
                    )}

                    {reportCategory.category === "cqi" && (
                      <FormGroup>
                        <FormLabel className={styles.label}>
                          CQI Reports
                        </FormLabel>
                        <ComboBox
                          ariaLabel="Select CQI report"
                          id="CQIReportsCombobox"
                          items={cqiReports.reports}
                          hideLabel
                          onChange={handleSelectedReport}
                          selectedItem={selectedReport}
                        />
                      </FormGroup>
                    )}

                    {reportCategory.category === "integration" && (
                      <FormGroup>
                        <FormLabel className={styles.label}>
                          Integration Data Exports
                        </FormLabel>
                        <ComboBox
                          ariaLabel="Select Integration Data Exports"
                          id="integrationDataExportCombobox"
                          items={integrationDataExports.reports}
                          hideLabel
                          onChange={handleSelectedReport}
                          selectedItem={selectedReport}
                        />
                      </FormGroup>
                    )}
                  </>
                )}

                {reportType === "dynamic" && (
                  <Stack gap={3}>
                    <FormGroup>
                      <FormLabel className={styles.label}>
                        Dynamic report type
                      </FormLabel>

                      <ComboBox
                        ariaLabel="Select report type"
                        id="reportTypeCombobox"
                        items={facilityReports.reports}
                        placeholder="Choose the report you want to generate"
                        onChange={handleDynamicReportTypeChange}
                        selectedItem={selectedReport}
                      />
                    </FormGroup>

                    <FormGroup>
                      <FormLabel className={styles.label}>Indicators</FormLabel>

                      <ComboBox
                        ariaLabel="Select indicators"
                        id="indicatorCombobox"
                        items={[...reportIndicators, ...encounterTypes]}
                        placeholder="Choose the indicators"
                        onChange={handleIndicatorChange}
                        selectedItem={selectedIndicators}
                      />
                    </FormGroup>

                    <div className={styles.panelContainer}>
                      <Panel heading="Available parameters">
                        <ul className={styles.list}>
                          {availableParameters.map((parameter) => (
                            <li
                              role="menuitem"
                              className={styles.leftListItem}
                              key={parameter.label}
                              onClick={() => moveAllFromLeftToRight(parameter)}
                            >
                              {parameter.label}
                            </li>
                          ))}
                        </ul>
                      </Panel>
                      <div className={styles.paramsControlContainer}>
                        <Button
                          iconDescription="Move all parameters to the right"
                          kind="tertiary"
                          hasIconOnly
                          renderIcon={ArrowRight}
                          onClick={moveAllParametersRight}
                          role="button"
                          size="md"
                          disabled={availableParameters.length < 1}
                        />
                        <Button
                          iconDescription="Move all parameters to the left"
                          kind="tertiary"
                          hasIconOnly
                          renderIcon={ArrowLeft}
                          onClick={moveAllParametersLeft}
                          role="button"
                          size="md"
                          disabled={selectedParameters.length < 1}
                        />
                      </div>
                      <Panel heading="Selected parameters">
                        <ul className={styles.list}>
                          {selectedParameters.map((parameter) => (
                            <li
                              className={styles.rightListItem}
                              key={parameter.label}
                              role="menuitem"
                              onClick={() => moveAllFromRightToLeft(parameter)}
                            >
                              {parameter.label}
                            </li>
                          ))}
                        </ul>
                      </Panel>
                    </div>
                  </Stack>
                )}

                <FormGroup>
                  <FormLabel className={styles.label}>
                    Do you want your report to cover a fixed reporting period or
                    a relative one?
                  </FormLabel>
                  <RadioButtonGroup
                    legendText=""
                    name="reportingDuration"
                    onChange={handleReportingDurationChange}
                    defaultSelected="fixed"
                  >
                    <RadioButton
                      id="fixedPeriod"
                      labelText="Fixed period"
                      value="fixed"
                    />
                    <RadioButton
                      id="relativePeriod"
                      labelText="Relative period"
                      value="relative"
                    />
                  </RadioButtonGroup>
                </FormGroup>
                {reportingDuration === "fixed" && (
                  <FormGroup>
                    <DatePicker
                      datePickerType="single"
                      onChange={handleStartDateChange}
                      dateFormat={"d/m/Y"}
                    >
                      <DatePickerInput
                        id="date-picker-input-id-start"
                        placeholder="dd/mm/yyyy"
                        labelText="Start Date"
                      />
                    </DatePicker>
                    <br />
                    <DatePicker
                      datePickerType="single"
                      onChange={handleEndDateChange}
                      dateFormat={"d/m/Y"}
                    >
                      <DatePickerInput
                        id="date-picker-input-id-end"
                        placeholder="dd/mm/yyyy"
                        labelText="End Date"
                      />
                    </DatePicker>
                  </FormGroup>
                )}
                {reportingDuration === "relative" && (
                  <FormGroup>
                    <FormLabel className={styles.label}>
                      Select your desired reporting period
                    </FormLabel>
                    <RadioButtonGroup
                      className={styles.wrapper}
                      legendText=""
                      name="reportingPeriod"
                      orientation="vertical"
                      defaultSelected="today"
                    >
                      <RadioButton
                        id="today"
                        onClick={() => handleReportingPeriod("today")}
                        labelText="Today"
                        value="today"
                      />
                      <RadioButton
                        id="week"
                        onClick={() => handleReportingPeriod("week")}
                        labelText="This Week"
                        value="week"
                      />
                      <RadioButton
                        id="month"
                        onClick={() => handleReportingPeriod("month")}
                        labelText=" This Month"
                        value="month"
                      />
                      <RadioButton
                        id="quarter"
                        onClick={() => handleReportingPeriod("quarter")}
                        labelText="This Quarter"
                        value="quarter"
                      />
                      <RadioButton
                        id="lastQuarter"
                        onClick={() => handleReportingPeriod("lastQuarter")}
                        labelText="Last Quarter"
                        value="lastQuarter"
                      />
                    </RadioButtonGroup>
                  </FormGroup>
                )}
              </Stack>
            </Form>
          </AccordionItem>
        </Accordion>
      </div>

      <section className={styles.section}>
        <div className={styles.contentSwitchContainer}>
          <ContentSwitcher onChange={handleChartTypeChange}>
            <Switch name="list" disabled={chartType === "aggregate"}>
              <div className={styles.switch}>
                <Catalog />
                <span>Patient list</span>
              </div>
            </Switch>
            <Switch name="pivot" disabled={chartType === "aggregate"}>
              <div className={styles.switch}>
                <CrossTab />
                <span>Pivot table</span>
              </div>
            </Switch>
            <Switch name="aggregate" disabled={chartType !== "aggregate"}>
              <div className={styles.switch}>
                <ImageService />
                <span>Aggregate Report</span>
              </div>
            </Switch>
          </ContentSwitcher>
        </div>
        <div className={styles.actionButtonContainer}>
          <Button
            size="md"
            kind="primary"
            onClick={handleUpdateReport}
            className={styles.actionButton}
          >
            <Intersect />
            <span>View Report</span>
          </Button>
          {data.length > 0 && (
            <OverflowMenu aria-label="overflow-menu" flipped size="md" kind="">
              <OverflowMenuItem
                itemText="Save Report"
                onClick={showSaveReportModal}
              />
              <OverflowMenuItem itemText="Open Saved Reports" />
            </OverflowMenu>
          )}
        </div>
      </section>

      {showLineList ? (
        <>
          {loading && <DataTableSkeleton role="progressbar" />}

          {chartType === "list" && !loading && (
            <div className={styles.reportContainer}>
              <h3 className={styles.listHeading}>
                {reportName} ({dayjs(startDate).format("DD/MM/YYYY")} -{" "}
                {dayjs(endDate).format("DD/MM/YYYY")})
              </h3>
              <div className={styles.reportDataTable}>
                <DataList columns={tableHeaders} data={data} />
              </div>
            </div>
          )}

          {chartType === "list" &&
            !loading &&
            selectedReport.id === "bf79f017-8591-4eaf-88c9-1cde33226517" && (
              <>
                <div className={styles.sendReportBtn}>
                  <Button
                    size="md"
                    kind="primary"
                    className={styles.actionButton}
                  >
                    <SendAlt />
                    <span>Send Report to Family Connect</span>
                  </Button>
                </div>
              </>
            )}

          {chartType === "pivot" && (
            <div className={styles.reportContainer}>
              <h3>Pivot Table</h3>
              <PivotTableUI
                data={pivotTableData}
                onChange={(s) => setPivotTableData(s)}
                renderers={{ ...TableRenderers, ...PlotlyRenderers }}
                {...pivotTableData}
              />
            </div>
          )}

          {chartType === "aggregate" && !loading && (
            <div className={styles.reportTableContainer}>
              <section className={styles.reportOptions}>
                <h3 className={styles.listHeading}>
                  {reportName} ({dayjs(startDate).format("DD/MM/YYYY")} -{" "}
                  {dayjs(endDate).format("DD/MM/YYYY")})
                </h3>
              </section>
              <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
              <div className={styles.sendReportBtn}>
                <Button
                  size="md"
                  kind="primary"
                  className={styles.actionButton}
                >
                  <SendAlt />
                  <span>Send Report to DHIS2</span>
                </Button>
              </div>
            </div>
          )}

          {saveReportModal && (
            <Modal
              open
              size="sm"
              preventCloseOnClickOutside={true}
              hasScrollingContent={true}
              modalHeading="ENTER REPORT DETAILS"
              secondaryButtonText="Cancel"
              primaryButtonText="Save Report"
              onRequestClose={closeReportModal}
              onRequestSubmit={handleSaveReport}
            >
              <div>
                <TextInput
                  id="title"
                  labelText={`Report Title`}
                  onChange={handleReportTitleChange}
                  maxCount={50}
                  placeholder="Enter report title"
                />
                <TextArea
                  id="description"
                  className={styles.reportDescription}
                  labelText={`Report Description`}
                  onChange={handleReportDescChange}
                  rows={2}
                  placeholder="Enter report description"
                />
              </div>
            </Modal>
          )}
        </>
      ) : (
        <Layer className={styles.layer}>
          <Tile className={styles.tile}>
            <EmptyStateIllustration />
            <p className={styles.content}>No data to display</p>
            <p className={styles.explainer}>
              Use the report filters above to build your reports
            </p>
          </Tile>
        </Layer>
      )}
    </>
  );
};

export default DataVisualizer;
