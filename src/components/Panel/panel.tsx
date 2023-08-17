import React from "react";
import panelStyle from "./panel.css";

interface PanelProps {
  heading: string;
  body: any;
}
export const Panel: React.FC<PanelProps> = ({ heading, body }) => {
  return (
    <div className={panelStyle.rxpPanel}>
      <div className={panelStyle.rxpPanelHeading}> {heading}</div>
      <div className={panelStyle.rxpPanelBody}>{body}</div>
    </div>
  );
};
