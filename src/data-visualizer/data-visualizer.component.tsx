import React, { useEffect, useState } from "react";
import PivotTableUI from "react-pivottable/PivotTableUI";
import TableRenderers from "react-pivottable/TableRenderers";
import Plot from "react-plotly.js";
import createPlotlyRenderers from "react-pivottable/PlotlyRenderers";
import Illustration from "./data-visualizer-illustration.component";
import {
  ArrowLeft,
  ArrowRight,
  Catalog,
  ChartColumn,
  ChartLine,
  ChartPie,
  CrossTab,
  Intersect,
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
  facilityReports,
  nationalReports,
  reportIndicators,
} from "../constants";
import DataList from "../components/data-table/data-table.component";
import EmptyStateIllustration from "../components/empty-state/empty-state-illustration.component";
import Panel from "../components/panel/panel.component";
import pivotTableStyles from "!!raw-loader!react-pivottable/pivottable.css";
import styles from "./data-visualizer.scss";
import {
  createColumns,
  useDynamicReportFetcher,
  useGetEncounterConcepts,
  useGetEncounterType,
  useGetIdentifiers,
  useGetPatientAtrributes,
  useReports,
  useSaveReport,
} from "./data-visualizer.resource";
import dayjs from "dayjs";
import { showToast } from "@openmrs/esm-framework";

type ChartType = "list" | "pivot" | "line" | "bar" | "pie";
type ReportType = "fixed" | "dynamic";
type ReportCategory = "facility" | "national";
type ReportingDuration = "fixed" | "relative";
type ReportingPeriod = "today" | "week" | "month" | "quarter" | "lastQuarter";

const DataVisualizer: React.FC = () => {
  let title,
    description = "";
  const PlotlyRenderers = createPlotlyRenderers(Plot);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [data, setData] = useState([]);
  const [fixedReportIdentifier, setFixedReportIdentifier] =
    useState<string>(null);
  const [dynamicReportIdentifier, setDynamicReportIdentifier] =
    useState<string>(null);
  const [pivotTableData, setPivotTableData] = useState(data);
  const [chartType, setChartType] = useState<ChartType>("list");
  const [reportType, setReportType] = useState<ReportType>("fixed");
  const [reportCategory, setReportCategory] =
    useState<ReportCategory>("facility");
  const [reportingDuration, setReportingDuration] =
    useState<ReportingDuration>("fixed");
  const [reportingPeriod, setReportingPeriod] =
    useState<ReportingPeriod>("today");
  const [selectedIndicators, setSelectedIndicators] = useState<Indicator>(null);
  const [selectedReport, setSelectedReport] = useState<{
    id: string;
    label: string;
    uuid?: string;
  }>(facilityReports.reports[0]);
  const [facilityReport, setFacilityReport] = useState(
    facilityReports.reports[0]
  );
  const handleUpdateFacilityReport = ({ selectedItem }) => {
    setFacilityReport(selectedItem);
  };
  const [canSaveReport, setCanSaveReport] = useState(false);
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
  const [hasUpdatedFixedReport, setHasUpdatedFixedReport] = useState(false);
  const [hasUpdatedDynamicReport, setHasUpdatedDynamicReport] = useState(false);
  const [showSaveReportModal, setShowSaveReportModal] = useState(false);
  const [reportTitle, setReportTitle] = useState(null);
  const [reportDescription, setReportDescription] = useState(null);
  const { reportData, isLoading } = useReports({
    reportUUID: fixedReportIdentifier,
    startDate: startDate,
    endDate: endDate,
  });
  const { encounterConcepts, isLoadingEncounterConcepts } =
    useGetEncounterConcepts(selectedIndicators?.id);

  const handleUpdateReport = () => {
    if (reportType === "fixed") {
      setFixedReportIdentifier(facilityReport.id);
      setHasUpdatedFixedReport(false);
    } else {
      setDynamicReportIdentifier(selectedReport.id);
      setHasUpdatedDynamicReport(false);
    }

    setShowLineList(true);
    setLoading(true);
  };

  const handleChartTypeChange = ({ name }) => {
    setChartType(name);
  };

  const handleReportTypeChange = ({ name }) => {
    setReportType(name);
  };

  const handleReportingDurationChange = (period) => {
    setReportingDuration(period);
  };

  const handleSaveReport = () => {
    setShowSaveReportModal(true);
  };

  const closeReportModal = () => {
    setShowSaveReportModal(false);
  };

  const saveReport = () => {
    setReportTitle(title);
    setReportDescription(description);
    setCanSaveReport(true);
    setShowSaveReportModal(false);
  };

  const handleReportTitleChange = (event) => {
    title = event.target.value;
  };

  const handleReportDescChange = (event) => {
    description = event.target.value;
  };

  const { isLoadingSaveReport, isErrorInSaving } = useSaveReport({
    reportName: reportTitle,
    reportDescription: reportDescription,
    reportType: pivotTableData?.["rendererName"],
    columns: "",
    rows: "",
    report_request_object: JSON.stringify(pivotTableData),
  });

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

  const { dynamicReportData, isLoadingDynamicReport } = useDynamicReportFetcher(
    {
      uuid: dynamicReportIdentifier,
      reportIndicators: selectedParameters,
      startDate: startDate,
      endDate: endDate,
    }
  );

  if (reportType === "dynamic") {
    if (!isLoadingDynamicReport) {
      if (!hasUpdatedDynamicReport) {
        let headers = [];
        let dataForReport: any = [];
        if (dynamicReportData[0]) {
          const columnNames = Object.keys(dynamicReportData[0]);
          headers = createColumns(columnNames).slice(0, 10);
          dataForReport = dynamicReportData;
          setLoading(false);
          setShowFilters(false);
        } else {
          setShowLineList(false);
        }
        setTableHeaders(headers);
        setData(dataForReport);
        setPivotTableData(dataForReport);
        setReportName(selectedReport?.label);
        setHasUpdatedDynamicReport(true);
      }
    }
  }

  if (!isLoadingEncounterConcepts && encounterConcepts?.length > 0) {
    if (!hasRetrievedConcepts) {
      setAvailableParameters(encounterConcepts);
      selectedIndicators.attributes = encounterConcepts as Array<Indicator>;
      setHasRetrievedConcepts(true);
    }
  }

  if (reportType === "fixed") {
    if (!isLoading && !hasUpdatedFixedReport) {
      let headers = [];
      let dataForReport = [];
      const responseReportName = Object.keys(reportData)[0];
      if (reportData[responseReportName] && reportData[responseReportName][0]) {
        const columnNames = Object.keys(reportData[responseReportName][0]);
        headers = createColumns(columnNames).slice(0, 10);
        dataForReport = reportData[responseReportName];
        setLoading(false);
        setShowFilters(false);
      } else {
        setShowLineList(false);
      }
      setTableHeaders(headers);
      setData(dataForReport);
      setPivotTableData(dataForReport);
      setHasUpdatedFixedReport(true);
      setReportName(facilityReport?.label);
    }
  }

  if (!isLoadingSaveReport) {
    if (!isErrorInSaving && canSaveReport) {
      showToast({
        critical: true,
        title: "Saving Report",
        kind: "success",
        description: `Report ${reportTitle} saved Successfully`,
      });
      setReportTitle(null);
      setCanSaveReport(false);
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
                        Do you want to show a facility report or a national
                        report?
                      </FormLabel>
                      <RadioButtonGroup
                        defaultSelected="facility"
                        legendText=""
                        name="reportCategory"
                      >
                        <RadioButton
                          id="facilityReport"
                          labelText="Facility"
                          onClick={() => setReportCategory("facility")}
                          value="facility"
                        />
                        <RadioButton
                          id="nationalReport"
                          labelText="National"
                          onClick={() => setReportCategory("national")}
                          value="national"
                        />
                      </RadioButtonGroup>
                    </FormGroup>

                    {reportCategory === "facility" && (
                      <FormGroup>
                        <FormLabel className={styles.label}>
                          Facility report
                        </FormLabel>
                        <ComboBox
                          ariaLabel="Select facility report"
                          id="facilityReportsCombobox"
                          items={facilityReports.reports}
                          hideLabel
                          onChange={handleUpdateFacilityReport}
                          selectedItem={facilityReport}
                        />
                      </FormGroup>
                    )}

                    {reportCategory === "national" && (
                      <FormGroup>
                        <FormLabel className={styles.label}>
                          National report
                        </FormLabel>
                        <ComboBox
                          ariaLabel="Select national report"
                          id="nationalReportsCombobox"
                          items={nationalReports.reports}
                          hideLabel
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
                        items={[
                          ...facilityReports.reports,
                          ...nationalReports.reports,
                        ]}
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
                        onClick={() => setReportingPeriod("today")}
                        labelText="Today"
                        value="today"
                      />
                      <RadioButton
                        id="week"
                        onClick={() => setReportingPeriod("week")}
                        labelText="Week"
                        value="week"
                      />
                      <RadioButton
                        id="month"
                        onClick={() => setReportingPeriod("month")}
                        labelText="Month"
                        value="month"
                      />
                      <RadioButton
                        id="quarter"
                        onClick={() => setReportingPeriod("quarter")}
                        labelText="Quarter"
                        value="quarter"
                      />
                      <RadioButton
                        id="lastQuarter"
                        onClick={() => setReportingPeriod("lastQuarter")}
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
        <div>
          <ContentSwitcher onChange={handleChartTypeChange}>
            <Switch name="list">
              <div className={styles.switch}>
                <Catalog />
                <span>Patient list</span>
              </div>
            </Switch>
            <Switch name="pivot">
              <div className={styles.switch}>
                <CrossTab />
                <span>Pivot table</span>
              </div>
            </Switch>
            <Switch name="line" disabled={true}>
              <div className={styles.switch}>
                <ChartLine />
                <span>Line chart</span>
              </div>
            </Switch>
            <Switch name="bar" disabled={true}>
              <div className={styles.switch}>
                <ChartColumn />
                <span>Bar chart</span>
              </div>
            </Switch>
            <Switch name="pie" disabled={true}>
              <div className={styles.switch}>
                <ChartPie />
                <span>Pie chart</span>
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
            <span>Update report</span>
          </Button>
          {data.length > 0 && (
            <OverflowMenu aria-label="overflow-menu" flipped size="md" kind="">
              <OverflowMenuItem
                itemText="Save Report"
                onClick={handleSaveReport}
              />
              <OverflowMenuItem itemText="Open Saved Reports" />
            </OverflowMenu>
          )}
        </div>
      </section>

      {showLineList ? (
        <>
          {chartType === "list" && loading && (
            <DataTableSkeleton role="progressbar" />
          )}

          {chartType === "list" && !loading && (
            <div className={styles.reportContainer}>
              <h3 className={styles.listHeading}>{reportName}</h3>
              <DataList columns={tableHeaders} data={data} />
            </div>
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

          {showSaveReportModal && (
            <Modal
              open
              size="sm"
              preventCloseOnClickOutside={true}
              hasScrollingContent={true}
              modalHeading="ENTER REPORT DETAILS"
              secondaryButtonText="Cancel"
              primaryButtonText="Save Report"
              onRequestClose={closeReportModal}
              onRequestSubmit={saveReport}
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
