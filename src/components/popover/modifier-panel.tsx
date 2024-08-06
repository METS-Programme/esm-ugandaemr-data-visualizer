import React from 'react';
import styles from "../../data-visualizer/data-visualizer.scss";
import { Add, Subtract } from "@carbon/react/icons";
type Props = {
  listItem: Indicator;
  onChangeMostRecent: (selectParameter: Indicator, type: string) => void;
}
const ModifierComponent: React.FC<Props> = ({listItem,onChangeMostRecent}) => {
  return (
    <>
      <div className={styles.selectedListItem}>
        <div> Most Recent #: <span className={styles.modifierLeft}>{listItem?.modifier}</span></div>
        <div>
          <Subtract className={`${styles.selectedListItemArrow} ${styles.modifier}`} onClick={() => onChangeMostRecent(listItem, "subtract")}/>
          <Add className={styles.selectedListItemArrow} onClick={() => onChangeMostRecent(listItem, "add")}/>
        </div>
      </div>
    </>
  );
}

export default ModifierComponent;
