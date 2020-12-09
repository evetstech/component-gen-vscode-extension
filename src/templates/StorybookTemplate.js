const StorybookTemplate = (ComponentName, AtomicType) => 
`import React from "react";
import ${ComponentName} from "./${ComponentName}";

export default {
		title: "${AtomicType}/${ComponentName}",
		component: ${ComponentName},
		argTypes: {

		}
};

const Template = (args) => <${ComponentName} {...args} />

export const Default = Template.bind({});
Default.args = {

};`;

module.exports = StorybookTemplate;