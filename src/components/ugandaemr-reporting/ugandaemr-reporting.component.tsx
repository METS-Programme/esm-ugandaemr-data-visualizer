import React, { useState, useEffect } from "react";
import stylesDatePicker from "!!raw-loader!./ugandaemr-reporting.scss";
import PivotTableUI from "react-pivottable/PivotTableUI";
import TableRenderers from "react-pivottable/TableRenderers";
import Plot from "react-plotly.js";
import createPlotlyRenderers from "react-pivottable/PlotlyRenderers";
import stylesText from "!!raw-loader!react-pivottable/pivottable.css";
import styles from "./ugandaemr-reporting.scss";
import {
  Intersect,
  Save,
  Catalog,
  ChartLine,
  ChartColumn,
  ChartPie,
  CrossTab,
  ArrowRight,
  ArrowLeft,
} from "@carbon/react/icons";
import {
  SideNav,
  Content,
  Accordion,
  AccordionItem,
  DatePicker,
  DatePickerInput,
  Button,
  ContentSwitcher,
  Switch,
  ButtonSet,
  RadioButtonGroup,
  RadioButton,
  ComboBox,
  Modal,
} from "@carbon/react";
import ReportingHomeHeader from "../reporting-header/reporting-home-header.component";
import {
  facilityReports,
  nationalReports,
  Indicators,
  data,
  displayContainer,
  displayInner1,
  displayOption,
  displayInner2,
  tableHeaders,
} from "../../constants";
import Panel from "../panel/panel.component";
import DataList from "../reporting-helper/data-table.component";

const UgandaemrReporting: React.FC = () => {
  const PlotlyRenderers = createPlotlyRenderers(Plot);

  const [patientData, setPatientData] = useState(data);
  const [modalOpen, setModalOpen] = useState(false);
  const [chart, setChart] = useState("List");
  const [reportType, setReportType] = useState("Fixed");
  const [modelState, setModelState] = useState(false);
  const [reportTypeToggle, setReportTypeToggle] = useState(true);
  const [facilityReportToggle, setFacilityReportToggle] = useState(true);
  const [nationalReportToggle, setNationalReportToggle] = useState(false);
  const [fixedPeriodToggle, setFixedPeriodToggle] = useState(true);
  const [relativePeriodToggle, setRelativePeriodToggle] = useState(false);
  const [selectedIndicators, setSelectedIndicators] = useState({});
  const [selectedReport, setSelectedReport] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const closeModal = () => {
    setModelState(false);
    // updateTypeSwitcher({ name: "Fixed" });
  };
  const displayReport = () => {
    setModalOpen(true);
  };
  const updateReportSwitcher = (object) => {
    let { name } = object;
    setChart(name);
  };
  const updateTypeSwitcher = (object) => {
    let { name } = object;
    setReportType(name);
    if (name == "Dynamic") {
      setModelState(true);
      setReportTypeToggle(false);
      setFacilityReportToggle(false);
      setNationalReportToggle(false);
    } else {
      setReportTypeToggle(true);
      setFacilityReportToggle(true);
    }
  };
  const handleReportTypeToggle = (selectedRadioButton) => {
    if (selectedRadioButton == "option-national") {
      setFacilityReportToggle(false);
      setNationalReportToggle(true);
    } else {
      setFacilityReportToggle(true);
      setNationalReportToggle(false);
    }
  };
  const handlePeriodTypeToggle = (selectedRadioButton) => {
    if (selectedRadioButton == "Relative") {
      setFixedPeriodToggle(false);
      setRelativePeriodToggle(true);
    } else {
      setFixedPeriodToggle(true);
      setRelativePeriodToggle(false);
    }
  };

  const [availableParameters, setAvailableParameters] = useState([]);
  const [selectedParameters, setSelectedParameters] = useState([]);

  const moveLeftToRight = (parameter) => {
    const updatedAvailableParameters = availableParameters.filter(
      (param) => param !== parameter
    );
    setAvailableParameters(updatedAvailableParameters);

    setSelectedParameters([...selectedParameters, parameter]);
  };

  const moveRightToLeft = (parameter) => {
    const updatedSelectedParameters = selectedParameters.filter(
      (param) => param !== parameter
    );
    setSelectedParameters(updatedSelectedParameters);

    let updatedAvailableParameters = [...availableParameters];
    // @ts-ignore
    selectedIndicators.parameters.filter((param) => {
      if (param == parameter) {
        updatedAvailableParameters = [...updatedAvailableParameters, parameter];
      }
    });
    setAvailableParameters(updatedAvailableParameters);
  };

  const moveAllToLeft = () => {
    // @ts-ignore
    setAvailableParameters(selectedIndicators.parameters);
    setSelectedParameters([]);
  };

  const moveAllToRight = () => {
    setSelectedParameters([...availableParameters, ...selectedParameters]);
    setAvailableParameters([]);
  };

  const handleSelectedIndicators = (selectedIndicator) => {
    setAvailableParameters(selectedIndicator.selectedItem.parameters);
    setSelectedIndicators(selectedIndicator.selectedItem);
  };

  const handleSelectedReport = (selectedReport) => {
    setSelectedReport(selectedReport.selectedItem);
  };

  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = `${stylesText}`;
    document.head.appendChild(styleElement);

    const styleElementDP = document.createElement("style");
    styleElementDP.textContent = `${stylesDatePicker}`;
    document.head.appendChild(styleElementDP);

    return () => {
      document.head.removeChild(styleElement);
      document.head.removeChild(styleElementDP);
    };
  }, []);

  return (
    <div>
      <SideNav expanded aria-label="Menu">
        <Accordion className="custom-class">
          <AccordionItem title="Type Of Report" open>
            <ContentSwitcher size="sm" onChange={updateTypeSwitcher}>
              <Switch name={"Fixed"} text="Fixed" />
              <Switch name={"Dynamic"} text="Dynamic" />
            </ContentSwitcher>
          </AccordionItem>
          {reportTypeToggle && (
            <AccordionItem title="Fixed Reports" open>
              <RadioButtonGroup
                defaultSelected="default-selected"
                hideLabel={false}
                name="radio-button-group"
                valueSelected="option-facility"
                onChange={handleReportTypeToggle}
              >
                <RadioButton
                  id="radio-facility"
                  labelText="Facility"
                  value="option-facility"
                />
                <RadioButton
                  id="radio-national"
                  labelText="National"
                  value="option-national"
                />
              </RadioButtonGroup>
            </AccordionItem>
          )}
          {facilityReportToggle && (
            <AccordionItem title="Facility Reports" open>
              <ComboBox
                ariaLabel="ComboBox Select"
                id="filterable-select-example"
                items={facilityReports.reports}
                hideLabel={true}
              />
            </AccordionItem>
          )}
          {nationalReportToggle && (
            <AccordionItem title="National Reports" open>
              <ComboBox
                ariaLabel="ComboBox Select"
                id="filterable-select-example"
                items={nationalReports.reports}
                hideLabel={true}
              />
            </AccordionItem>
          )}
          <AccordionItem title="Period" open>
            <RadioButtonGroup
              defaultSelected="default-selected"
              name="radio-button-period"
              valueSelected="Fixed"
              onChange={handlePeriodTypeToggle}
            >
              <RadioButton id="radio-fixed" labelText="Fixed" value="Fixed" />
              <RadioButton
                id="radio-relative"
                labelText="Relative"
                value="Relative"
              />
            </RadioButtonGroup>
          </AccordionItem>
          {fixedPeriodToggle && (
            <AccordionItem title="Fixed Period" open>
              <DatePicker datePickerType="single">
                <DatePickerInput
                  id="date-picker-input-id-start"
                  placeholder="dd-mm-yyyy"
                  labelText="Start Date"
                />
              </DatePicker>
              <br />
              <DatePicker datePickerType="single">
                <DatePickerInput
                  id="date-picker-input-id-end"
                  placeholder="dd-mm-yyyy"
                  labelText="End Date"
                />
              </DatePicker>
            </AccordionItem>
          )}
          {relativePeriodToggle && (
            <AccordionItem title="Relative Period" open>
              <RadioButtonGroup
                defaultSelected="default-selected"
                name="radio-button-relative"
                valueSelected="Today"
                orientation="vertical"
              >
                <RadioButton id="radio-today" labelText="Today" value="Today" />
                <RadioButton id="radio-week" labelText="Week" value="Week" />
                <RadioButton id="radio-month" labelText="Month" value="Month" />
                <RadioButton
                  id="radio-quarter"
                  labelText="Quarter"
                  value="Quarter"
                />
                <RadioButton
                  id="radio-lq"
                  labelText="Last Quarter"
                  value="Last Quarter"
                />
              </RadioButtonGroup>
            </AccordionItem>
          )}
        </Accordion>
      </SideNav>
      <Content>
        <ReportingHomeHeader />
        <div style={displayContainer}>
          <div style={displayOption}>Display Options</div>
          <div style={displayInner1}>
            <ContentSwitcher onChange={updateReportSwitcher}>
              <Switch name={"List"}>
                <Catalog /> {"Patient List"}
              </Switch>
              <Switch name={"Pivot"}>
                <CrossTab /> {"Pivot Table"}
              </Switch>
              <Switch name={"Line"}>
                <ChartLine /> {"Line Chart"}
              </Switch>
              <Switch name={"Bar"}>
                <ChartColumn /> {"Bar Chart"}
              </Switch>
              <Switch name={"Pie"}>
                <ChartPie /> {"Pie Chart"}
              </Switch>
            </ContentSwitcher>
          </div>
          <div style={displayInner2}>
            <ButtonSet className={styles.dispayBtnGrp}>
              <Button size="sm" kind="primary" onClick={displayReport}>
                <Intersect />
                {"UPDATE"}
              </Button>
              <Button
                renderIcon={Save}
                size="sm"
                kind="tertiary"
                hasIconOnly
                as="div"
                role="button"
              />
            </ButtonSet>
          </div>
        </div>
        {modalOpen && chart == "List" && (
          <div className={styles.reportContainerBackground}>
            <h3>Patient List</h3>
            <DataList columns={tableHeaders} data={data} />
          </div>
        )}
        {modalOpen && chart == "Pivot" && (
          <div className={styles.reportContainerBackground}>
            <h3>Pivot Table</h3>
            <PivotTableUI
              data={patientData}
              onChange={(s) => setPatientData(s)}
              renderers={{ ...TableRenderers, ...PlotlyRenderers }}
              {...patientData}
            />
          </div>
        )}
        {modelState && reportType == "Dynamic" && (
          <Modal
            open
            size="md"
            preventCloseOnClickOutside={true}
            hasScrollingContent={true}
            modalHeading="SELECT PARAMETERS"
            secondaryButtonText="Cancel"
            primaryButtonText="Confirm"
            onRequestClose={closeModal}
            onRequestSubmit={closeModal}
          >
            <div>
              <ComboBox
                ariaLabel="ComboBox"
                id="chart-selectable-list"
                items={[...facilityReports.reports, ...nationalReports.reports]}
                label="Select a report"
                titleText="Select a report"
                onChange={handleSelectedReport}
                selectedItem={selectedReport}
              />
            </div>
            <div>
              <ComboBox
                ariaLabel="ComboBox"
                id="chart-selectable-list"
                items={[...Indicators.Indicators]}
                label="Select a report"
                titleText="Select Indicators"
                onChange={handleSelectedIndicators}
                selectedItem={selectedIndicators}
              />
            </div>
            <div className={styles.paramsConatiner}>
              <Panel
                heading={`Available parameters`}
                body={
                  <ul>
                    {availableParameters.map((param) => (
                      <li key={param}>
                        {" "}
                        <Button
                          className={styles.paramBtn}
                          kind="danger--primary"
                          onClick={() => moveLeftToRight(param)}
                          as="div"
                          role="button"
                        >
                          {param}
                        </Button>
                      </li>
                    ))}
                  </ul>
                }
              />
              <div className={styles.paramsControlContainer}>
                <Button
                  className={styles.paramsControl}
                  kind="tertiary"
                  hasIconOnly
                  renderIcon={ArrowRight}
                  onClick={moveAllToRight}
                  as="div"
                  role="button"
                  disabled={availableParameters.length < 1}
                />
                <Button
                  kind="tertiary"
                  hasIconOnly
                  renderIcon={ArrowLeft}
                  onClick={moveAllToLeft}
                  as="div"
                  role="button"
                  disabled={selectedParameters.length < 1}
                />
              </div>
              <Panel
                heading={`Selected parameters`}
                body={
                  <ul>
                    {selectedParameters.map((param) => (
                      <li key={param}>
                        {" "}
                        <Button
                          className={styles.paramBtn}
                          kind="danger--primary"
                          onClick={() => moveRightToLeft(param)}
                          as="div"
                          role="button"
                        >
                          {param}
                        </Button>
                      </li>
                    ))}
                  </ul>
                }
              />
            </div>
          </Modal>
        )}
      </Content>
    </div>
  );
};

export default UgandaemrReporting;
