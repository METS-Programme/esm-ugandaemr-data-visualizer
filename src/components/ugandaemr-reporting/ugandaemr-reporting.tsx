import React, { useState, useEffect } from "react";
import styles from "./ugandaemr-reporting.css";
import PivotTableUI from "react-pivottable/PivotTableUI";
import TableRenderers from "react-pivottable/TableRenderers";
import Plot from "react-plotly.js";
import createPlotlyRenderers from "react-pivottable/PlotlyRenderers";
import stylesText from "!!raw-loader!react-pivottable/pivottable.css";

const UgandaemrReporting: React.FC = () => {
  const PlotlyRenderers = createPlotlyRenderers(Plot);
  const data = [
    [
      "Total Bill",
      "Tip",
      "Gender",
      "Payer Smoker",
      "Day of Week",
      "Meal",
      "Party Size",
    ],
    [16.99, 1.01, "Female", "Non-Smoker", "Monday", "Dinner", 2],
    [10.34, 1.66, "Male", "Non-Smoker", "Sunday", "Dinner", 3],
    [21.01, 3.5, "Male", "Non-Smoker", "Sunday", "Dinner", 3],
    [23.68, 3.31, "Male", "Non-Smoker", "Sunday", "Dinner", 2],
    [24.59, 3.61, "Female", "Non-Smoker", "Tuesday", "Dinner", 4],
    [25.29, 4.71, "Male", "Non-Smoker", "Sunday", "Dinner", 4],
    [8.77, 2, "Male", "Non-Smoker", "Sunday", "Dinner", 2],
    [26.88, 3.12, "Male", "Non-Smoker", "Sunday", "Dinner", 4],
    [15.04, 1.96, "Male", "Non-Smoker", "Monday", "Dinner", 2],
    [14.78, 3.23, "Male", "Non-Smoker", "Sunday", "Dinner", 2],
    [10.27, 1.71, "Male", "Non-Smoker", "Tuesday", "Dinner", 2],
    [35.26, 5, "Female", "Non-Smoker", "Sunday", "Dinner", 4],
    [15.42, 1.57, "Male", "Non-Smoker", "Sunday", "Dinner", 2],
    [18.43, 3, "Male", "Non-Smoker", "Monday", "Dinner", 4],
    [14.83, 3.02, "Female", "Non-Smoker", "Sunday", "Dinner", 2],
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
