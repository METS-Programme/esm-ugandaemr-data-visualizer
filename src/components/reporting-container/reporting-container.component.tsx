import React from "react";
import { Accordion, AccordionItem } from "@carbon/react";
import ReportingItem from "../reporting-item/reporting-item.component";
import styles from "./reporting-container.scss";

interface ReportingContainerProps {
  categoryName: string;
  reports?: Array<Report>;
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
