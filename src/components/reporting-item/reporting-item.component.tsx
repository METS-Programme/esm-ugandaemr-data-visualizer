import React, { useState } from "react";
import {
  Button,
  Modal,
  Dropdown,
  DatePicker,
  DatePickerInput,
} from "@carbon/react";
import styles from "./reporting-item.scss";

interface ReportingItemProps {
  reportName: string;
}

const ReportingItem: React.FC<ReportingItemProps> = ({ reportName }) => {
  const items = ["Excel", "CSV"];
  const locations = ["ART Clinic", "TB Clinic", "SMC Clinic"];
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };
  return (
    <div>
      <Button
        className={`${styles.reportingBtn}`}
        size="field"
        kind="tertiary"
        onClick={openModal}
      >
        {reportName}
      </Button>
      {modalOpen && (
        <Modal
          open
          size="md"
          modalHeading="REPORT  PARAMETERS"
          secondaryButtonText="Cancel"
          primaryButtonText="Generate Report"
          onRequestClose={closeModal}
          onRequestSubmit={closeModal}
        >
          <DatePicker datePickerType="single">
            <DatePickerInput
              placeholder="mm/dd/yyyy"
              labelText="Start Date"
              id="start-date-picker"
            />
          </DatePicker>
          <DatePicker datePickerType="single">
            <DatePickerInput
              placeholder="mm/dd/yyyy"
              labelText="End Date"
              id="end-date-picker"
            />
          </DatePicker>
          <Dropdown
            ariaLabel="Dropdown"
            items={locations}
            label="Location"
            titleText="location"
          />
          <Dropdown
            ariaLabel="Dropdown"
            items={items}
            label="Output Format"
            titleText="Output Format"
          />
        </Modal>
      )}
    </div>
  );
};

export default ReportingItem;
