import React, { useState, useEffect } from "react";
import stylesDatePicker from "!!raw-loader!./ugandaemr-reporting.css";
import PivotTableUI from "react-pivottable/PivotTableUI";
import TableRenderers from "react-pivottable/TableRenderers";
import Plot from "react-plotly.js";
import createPlotlyRenderers from "react-pivottable/PlotlyRenderers";
import stylesText from "!!raw-loader!react-pivottable/pivottable.css";
import styles from "./ugandaemr-reporting.css";
import { Intersect, Save, DocumentDownload } from "@carbon/icons-react";
import {
  SideNav,
  Content,
  Accordion,
  AccordionItem,
  Select,
  SelectItem,
  SelectItemGroup,
  Checkbox,
  DatePicker,
  DatePickerInput,
  Button,
  ContentSwitcher,
  Switch,
  ButtonSet,
} from "@carbon/react";
import ReportingHomeHeader from "../reporting-header/reporting-home-header.component";
import FacilityList from "../reporting-helper/CarbonDataTable";

const UgandaemrReporting: React.FC = () => {
  const PlotlyRenderers = createPlotlyRenderers(Plot);
  const data = [
    { id: "1", name: "John", age: 30, district: "Kampala", viral_load: 85 },
    { id: "2", name: "Alice", age: 25, district: "Wakiso", viral_load: 92 },
    { id: "3", name: "Bob", age: 28, district: "Kampala", viral_load: 78 },
    { id: "4", name: "Sam", age: 30, district: "Wakiso", viral_load: 85 },
    { id: "5", name: "Musa", age: 25, district: "Kampala", viral_load: 92 },
    { id: "6", name: "Alex", age: 28, district: "Kampala", viral_load: 78 },
    { id: "7", name: "Derrick", age: 30, district: "Kampala", viral_load: 85 },
    { id: "8", name: "David", age: 25, district: "Kampala", viral_load: 92 },
    { id: "9", name: "Solomon", age: 28, district: "Kampala", viral_load: 78 },
    { id: "10", name: "Jaba", age: 30, district: "Kampala", viral_load: 85 },
    {
      id: "11",
      name: "Jonathan",
      age: 25,
      district: "Kampala",
      viral_load: 92,
    },
    { id: "12", name: "Daphine", age: 28, district: "Kampala", viral_load: 78 },
  ];
  const [state, setState] = useState(data);
  const [modalOpen, setModalOpen] = useState(false);
  const [chart, setChart] = useState("List");
  const displayReport = () => {
    setModalOpen(true);
  };
  const updateSwitcher = (object) => {
    let { name } = object;
    setChart(name);
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
  const displayContainer = {
    width: "100%",
    display: "flex",
    padding: "20px 0 20px 0",
  };
  const displayInner1 = {
    width: "50%",
  };
  const displayOption = {
    width: "10%",
    "margin-top": "10px",
    "font-weight": "600",
  };
  const displayInner2 = {
    width: "40%",
  };
  const optionsCard = {
    display: "flex",
  };
  return (
    <div>
      <SideNav expanded aria-label="Menu">
        <Accordion className="custom-class">
          <AccordionItem title="Cohort Definition">
            <Select hideLabel={true}>
              <SelectItemGroup label="FACILITY REPORTS">
                <SelectItem value="option-1" text="Appointments List" />
                <SelectItem value="option-2" text="Missed Appointments List" />
                <SelectItem
                  value="option-3"
                  text="Daily Missed Appointments List"
                />
              </SelectItemGroup>
              <SelectItemGroup label="MER INDICATOR REPORTS">
                <SelectItem value="option-5" text="Tx Current_28Days Report" />
                <SelectItem value="option-5" text="Tx Current_90Days Report" />
                <SelectItem value="option-5" text="HCT_TST_Facility Report" />
              </SelectItemGroup>
            </Select>
          </AccordionItem>
          <AccordionItem title="Filters / Disaggregate">
            <fieldset className="bx--fieldset">
              <Checkbox labelText="Names" id="checked-names" />
              <Checkbox labelText="Gender" id="checked-gender" />
              <Checkbox labelText="Viral Load" id="checked-vl" />
              <Checkbox labelText="Appointment Date" id="checked-app-date" />
            </fieldset>
          </AccordionItem>
          <AccordionItem title="Period">
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
        </Accordion>
      </SideNav>
      <Content>
        <ReportingHomeHeader />
        <div style={displayContainer}>
          <div style={displayOption}>Display Options</div>
          <div style={displayInner1}>
            <ContentSwitcher onChange={updateSwitcher}>
              <Switch name={"List"} text="Patient List" />
              <Switch name={"Pivot"} text="Pivot Table" />
              <Switch name={"Line"} text="Line Chart" />
              <Switch name={"Bar"} text="Bar Chart" />
              <Switch name={"Pie"} text="Pie Chart" />
            </ContentSwitcher>
          </div>
          <div style={displayInner2}>
            <ButtonSet className={styles.dispayBtnGrp}>
              <Button size="sm" kind="primary" onClick={displayReport}>
                <Intersect />
                Display Report
              </Button>
              <Button
                renderIcon={DocumentDownload}
                size="sm"
                kind="secondary"
                hasIconOnly
              />
              <Button renderIcon={Save} size="sm" kind="tertiary" hasIconOnly />
            </ButtonSet>
          </div>
        </div>
        {modalOpen && chart == "List" && (
          <div className={styles.reportContainerBackground}>
            <h3>Patient List</h3>
            <FacilityList />
          </div>
        )}
        {modalOpen && chart == "Pivot" && (
          <div className={styles.reportContainerBackground}>
            <h3>Pivot Table</h3>
            <PivotTableUI
              data={state}
              onChange={(s) => setState(s)}
              renderers={{ ...TableRenderers, ...PlotlyRenderers }}
              {...state}
            />
          </div>
        )}
      </Content>
    </div>
  );
};

export default UgandaemrReporting;
