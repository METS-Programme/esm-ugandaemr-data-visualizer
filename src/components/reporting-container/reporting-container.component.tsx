import React from "react";
import styles from "./reporting-container.css";
import { Accordion, AccordionItem } from "@carbon/react";
import ReportingItem from "../reporting-item/reporting-item.component";

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
                <ReportingItem reportName={report.label}></ReportingItem>
              ))
            : {}}
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ReportingContainer;
