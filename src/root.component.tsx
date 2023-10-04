import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Reporting from "./data-visualizer/reporting.component";

const Root: React.FC = () => {
  return (
    <BrowserRouter basename={window.getOpenmrsSpaBase()}>
      <Routes>
        <Route path="home/data-visualizer" element={<Reporting />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Root;
