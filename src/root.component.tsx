import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DataVisualizer from "./data-visualizer/data-visualizer.component";
import UserDashboard from "./user-dashboard/user-dashboard.component";

const Root: React.FC = () => {
  return (
    <BrowserRouter basename={window.getOpenmrsSpaBase()}>
      <Routes>
        <Route path="home/data-visualizer" element={<DataVisualizer />} />
        <Route path="home/user-dashboard" element={<UserDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Root;
