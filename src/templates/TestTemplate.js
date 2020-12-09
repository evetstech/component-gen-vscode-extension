const TestTemplate = (ComponentName) => 
`import React from "react";
import ${ComponentName} from "./${ComponentName}";
import { render, screen } from "@testing-library/react";

describe("${ComponentName} Tests", () => {
		it("should have some tests here", () => {
				expect(true).toBe(false);
		});
});`;

module.exports = TestTemplate;