const ComponentTemplate = (ComponentName) =>
`import React from "react";
import PropTypes from "prop-types";

// NOTE: when development is done, insert entry point into index.js and rollup.config.js for deployment

const ${ComponentName} = () => {

		return (
				<h1> ${ComponentName} </h1>
		);
};

${ComponentName}.propTypes = {

};

export default ${ComponentName};`;

module.exports = ComponentTemplate;