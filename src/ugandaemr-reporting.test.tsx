
import React from "react";
import { render, cleanup } from "@testing-library/react";
import UgandaemrReporting from "./ugandaemr-reporting";
import { useConfig } from "@openmrs/esm-framework";
import { Config } from "./config-schema";

const mockUseConfig = useConfig as jest.Mock;

describe(`<UgandaemrReporting />`, () => {
  afterEach(cleanup);
  it(`renders without dying`, () => {
    const config: Config = { casualGreeting: false, whoToGreet: ["World"] };
    mockUseConfig.mockReturnValue(config);
    render(<UgandaemrReporting />);
  });
});
