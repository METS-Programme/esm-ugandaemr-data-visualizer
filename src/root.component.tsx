import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Reporting from "./components/reporting/reporting.component";

const Root: React.FC = () => {
  return (
    <BrowserRouter basename={`${window.spaBase}/home/reporting`}>
      <Routes>
        <Route path="/" element={<Reporting />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Root;
