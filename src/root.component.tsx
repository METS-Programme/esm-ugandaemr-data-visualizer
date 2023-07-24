import React from "react";
import { ExtensionSlot } from "@openmrs/esm-framework";
import { SideNav } from "@carbon/react";

const Root: React.FC = () => {
  return (
    <SideNav expanded aria-label="Menu">
      <ExtensionSlot name="nav-menu-slot" />
    </SideNav>
  );
};

export default Root;
