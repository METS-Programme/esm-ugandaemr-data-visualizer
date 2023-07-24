import React, { useState, useEffect } from "react";
import styles from "./ugandaemr-reporting.css";
import PivotTableUI from "react-pivottable/PivotTableUI";
import TableRenderers from "react-pivottable/TableRenderers";
import Plot from "react-plotly.js";
import createPlotlyRenderers from "react-pivottable/PlotlyRenderers";
import stylesText from "!!raw-loader!react-pivottable/pivottable.css";
import { SideNav} from "@carbon/react";
import { ExtensionSlot } from "@openmrs/esm-framework";

const UgandaemrReporting: React.FC = () => {
  const PlotlyRenderers = createPlotlyRenderers(Plot);
  const data = [
    ["Viral Load", "Gender"],
    [150, "Female"],
    [200, "Male"],
    [130, "Male"],
    [200, "Male"],
    [200, "Female"],
    [150, "Male"],
    [300, "Male"],
    [300, "Male"],
    [100, "Male"],
    [400, "Male"],
    [340, "Male"],
    [300, "Female"],
    [90, "Male"],
    [500, "Male"],
    [100, "Female"],
  ];
  const [state, setState] = useState(data);
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = `${stylesText}`;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  return (
    <div>
      <div className={`omrs-main-content ${styles.container}`}>
        <h3>UgandaEMR Reports</h3>
      </div>
      <PivotTableUI
        data={state}
        onChange={(s) => setState(s)}
        renderers={{ ...TableRenderers, ...PlotlyRenderers }}
        {...state}
      />
    </div>
  );
};

export default UgandaemrReporting;
