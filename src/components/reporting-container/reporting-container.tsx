import React from "react";
import styles from "./reporting-container.css";
import { Accordion, AccordionItem } from "@carbon/react";
import ReportingItem from "../reporting-item/reporting-item";

interface ReportingContainerProps {
  categoryName: string;
  reports?: Array<report>;
}

const ReportingContainer: React.FC<ReportingContainerProps> = ({
  categoryName,
  reports,
}) => {
  return (
    <div className={`${styles.reportingDiv}`}>
      <Accordion>
        <AccordionItem
          open
          title={categoryName}
          className={`${styles.reportingAccordionItem}`}
        >
          {reports
            ? reports.map((report) => (
                <ReportingItem reportName={report.reportName}></ReportingItem>
              ))
            : {}}
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ReportingContainer;
