import React, { useEffect, useState } from "react";
import PivotTableUI from "react-pivottable/PivotTableUI";
import TableRenderers from "react-pivottable/TableRenderers";
import Plot from "react-plotly.js";
import createPlotlyRenderers from "react-pivottable/PlotlyRenderers";
import {
  ArrowLeft,
  ArrowRight,
  Catalog,
  ChartColumn,
  ChartLine,
  ChartPie,
  CrossTab,
  Intersect,
  Save,
} from "@carbon/react/icons";
import {
  Button,
  ComboBox,
  ContentSwitcher,
  Form,
  FormGroup,
  FormLabel,
  Layer,
  RadioButton,
  RadioButtonGroup,
  Stack,
  Switch,
  Tile,
} from "@carbon/react";
import ReportingHomeHeader from "../reporting-header/reporting-home-header.component";
import {
  data,
  facilityReports,
  nationalReports,
  Indicators,
  tableHeaders,
} from "../../constants";
import DataList from "../reporting-helper/data-table.component";
import EmptyStateIllustration from "./empty-state-illustration.component";
import Panel from "../panel/panel.component";
import pivotTableStyles from "!!raw-loader!react-pivottable/pivottable.css";
import styles from "./dashboard.scss";

type ChartType = "list" | "pivot" | "line" | "bar" | "pie";
type ReportType = "fixed" | "dynamic";
type ReportCategory = "facility" | "national";
type ReportingDuration = "fixed" | "relative";
type ReportingPeriod = "today" | "week" | "month" | "quarter" | "lastQuarter";

const Dashboard: React.FC = () => {
  const PlotlyRenderers = createPlotlyRenderers(Plot);

  const [patientData, setPatientData] = useState(data);
  const [chartType, setChartType] = useState<ChartType>("list");
  const [reportType, setReportType] = useState<ReportType>("fixed");
  const [reportCategory, setReportCategory] =
    useState<ReportCategory>("facility");
  const [reportingDuration, setReportingDuration] =
    useState<ReportingDuration>("fixed");
  const [reportingPeriod, setReportingPeriod] =
    useState<ReportingPeriod>("today");
  const [selectedIndicators, setSelectedIndicators] = useState<{
    id: string;
    label: string;
    parameters: Array<string>;
  }>(null);
  const [selectedReport, setSelectedReport] = useState<{
    id: string;
    label: string;
    parameters: Array<string>;
  }>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showLineList, setShowLineList] = useState(false);
  const [availableParameters, setAvailableParameters] = useState([]);
  const [selectedParameters, setSelectedParameters] = useState([]);

  const handleUpdateReport = () => {
    setShowLineList(true);
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

    selectedIndicators.parameters.filter((parameter) => {
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
    setAvailableParameters(selectedIndicators.parameters);
    setSelectedParameters([]);
  };

  const moveAllParametersRight = () => {
    setSelectedParameters([...availableParameters, ...selectedParameters]);
    setAvailableParameters([]);
  };

  const handleIndicatorChange = ({ selectedItem }) => {
    setAvailableParameters(selectedItem.parameters);
    setSelectedIndicators(selectedItem);
  };

  const handleDynamicReportTypeChange = ({ selectedItem }) => {
    setSelectedReport(selectedItem);
  };

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
      <ReportingHomeHeader />

      <div className={styles.container}>
        <p className={styles.heading}>Report filters</p>
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
                    Do you want to show a facility report or a national report?
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
                    items={[...Indicators.Indicators]}
                    placeholder="Choose the indicators"
                    onChange={handleIndicatorChange}
                    selectedItem={selectedIndicators}
                  />
                </FormGroup>

                <div className={styles.panelContainer}>
                  <Panel heading="Available parameters">
                    <ul>
                      {availableParameters.map((parameter, index) => (
                        <li
                          role="menuitem"
                          className={styles.leftListItem}
                          key={index}
                          onClick={() => moveAllFromLeftToRight(parameter)}
                        >
                          {parameter}
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
                    <ul>
                      {selectedParameters.map((parameter, index) => (
                        <li
                          className={styles.rightListItem}
                          key={index}
                          role="menuitem"
                          onClick={() => moveAllFromRightToLeft(parameter)}
                        >
                          {parameter}
                        </li>
                      ))}
                    </ul>
                  </Panel>
                </div>
              </Stack>
            )}

            <FormGroup>
              <FormLabel className={styles.label}>
                Do you want your report to cover a fixed reporting period or a
                relative one?
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
                  defaultSelexted="today"
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
            <Switch name="line">
              <div className={styles.switch}>
                <ChartLine />
                <span>Line chart</span>
              </div>
            </Switch>
            <Switch name="bar">
              <div className={styles.switch}>
                <ChartColumn />
                <span>Bar chart</span>
              </div>
            </Switch>
            <Switch name="pie">
              <div className={styles.switch}>
                <ChartPie />
                <span>Pie chart</span>
              </div>
            </Switch>
          </ContentSwitcher>
        </div>
        <div className={styles.actionButtonContainer}>
          <Button
            className={styles.actionButton}
            size="md"
            kind="primary"
            onClick={handleUpdateReport}
          >
            <Intersect />
            <span>Update report</span>
          </Button>
          <Button
            className={styles.actionButton}
            size="md"
            kind="tertiary"
            onClick={() => {}}
            role="button"
          >
            <Save />
            <span>Save report</span>
          </Button>
        </div>
      </section>

      {showLineList ? (
        <>
          {chartType === "list" && (
            <div className={styles.reportContainer}>
              <h3 className={styles.listHeading}>Patient list</h3>
              <DataList columns={tableHeaders} data={data} />
            </div>
          )}

          {chartType === "pivot" && (
            <div className={styles.reportContainer}>
              <h3>Pivot Table</h3>
              <PivotTableUI
                data={patientData}
                onChange={(s) => setPatientData(s)}
                renderers={{ ...TableRenderers, ...PlotlyRenderers }}
                {...patientData}
              />
            </div>
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

export default Dashboard;
