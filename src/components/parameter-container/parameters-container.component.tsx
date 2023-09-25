import React, { useState } from "react";
import styles from "./parameters-container.scss";
import Panel from "../panel/panel.component";
import { ArrowLeft, ArrowRight } from "@carbon/react/icons";
import { Button } from "@carbon/react";

interface ParametersContainerProps {
  availableParameters: any[];
  selectedParameters: any[];
  moveAllFromLeftToRight: (indicator: Indicator) => void;
  moveAllFromRightToLeft: (indicator: Indicator) => void;
  moveAllParametersLeft: () => void;
  moveAllParametersRight: () => void;
}

const ParametersContainer: React.FC<ParametersContainerProps> = ({
  availableParameters,
  selectedParameters,
  moveAllFromLeftToRight,
  moveAllFromRightToLeft,
  moveAllParametersLeft,
  moveAllParametersRight,
}) => {
  return (
    <>
      <div className={styles.panelContainer}>
        <Panel heading="Available parameters">
          <ul className={styles.list}>
            {availableParameters.map((parameter, index) => (
              <li
                role="menuitem"
                className={styles.leftListItem}
                key={parameter.label}
                onClick={() => moveAllFromLeftToRight(parameter)}
              >
                {parameter.label}
              </li>
            ))}
          </ul>
        </Panel>
        <div className={styles.paramsControlContainer}>
          <Button
            iconDescription="Move all parameters to the right"
            kind="tertiary"
            hasIconOnly
            renderIcon={ArrowRight}
            onClick={moveAllParametersRight}
            role="button"
            size="md"
            disabled={availableParameters.length < 1}
          />
          <Button
            iconDescription="Move all parameters to the left"
            kind="tertiary"
            hasIconOnly
            renderIcon={ArrowLeft}
            onClick={moveAllParametersLeft}
            role="button"
            size="md"
            disabled={selectedParameters.length < 1}
          />
        </div>
        <Panel heading="Selected parameters">
          <ul className={styles.list}>
            {selectedParameters.map((parameter, index) => (
              <li
                className={styles.rightListItem}
                key={parameter.label}
                role="menuitem"
                onClick={() => moveAllFromRightToLeft(parameter)}
              >
                {parameter.label}
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
};

export default ParametersContainer;
