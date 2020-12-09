const path = require('path');
const fs = require('fs');
const { outputFileSync } = require('fs-extra');
const ComponentTemplate = require('./templates/ComponentTemplate');
const TestTemplate = require('./templates/TestTemplate');
const StorybookTemplate = require('./templates/StorybookTemplate');
const { toWords, toPascalCase } = require('./utils/stringUtils');
const { validateName, validateCategory, validateFolder, validateAtomicType } = require('./utils/validation');

const featureVerbage = {
  folderDesc:
    "Output Path (Use PascalCase) Ex: 'FirstPartyData' will output to src/features/FirstPartyData/ " +
    "'FirstPartyData/RandomComponent' will output to src/features/FirstPartyData/RandomComponent/\n",
  nameDesc: (folderName) =>
    `Component Name (Use PascalCase):  'TestBtn' will output to src/features/${folderName}/TestBtn.jsx, etc.`
};

const componentVerbage = {
  nameDesc: 'Component Name:  What is the name of the component you want to create?\n' +
    `Example: 'TestBtn' will output to src/components/TestBtn/TestBtn.jsx, etc.`
};

const uiKitVerbage = {
  atomicType: 'Atomic type: Must be one of the following: Atom/Molecule/Organism/Page/Template',
  folderDesc: (AtomicType) =>
    `Output Path:  Where should this component be outputed to? Your input is relative to src/components/${AtomicType}s [Use PascalCase]\n` +
    `Example: 'SlideOutPanel' will output to src/components/${AtomicType}s/SlideOutPanel/\n`,
  nameDesc: (AtomicType, folderName) =>
    `Component Name:  What is the name of the component you want to create? Ex: 'SlideOutPanel' will output to src/components/${AtomicType}s/${folderName}/SlideOutPanel.jsx, etc.`
};

class Generator {
  componentFiles = ['main', 'test', 'story'];

  defaultPath = 'src/';

  constructor(workspaceRoot, window) {
    this.window = window;
    this.workspaceRoot = workspaceRoot;
  }

  execute = async () => {
    let componentType;

    while (true) {
      componentType = await this.selectComponentType();
      if (['Feature', 'Component (common)', 'UI Kit', undefined].includes(componentType)) {
        break;
      }
    }
    let outputInfo;

    switch (componentType) {
      case 'Feature':
        outputInfo = await this.featureComponentPrompt();
        break;
      case 'Component (common)': outputInfo = await this.commonComponentPrompt(); break;
      case 'UI Kit': outputInfo = await this.uiKitComponentPrompt(); break;
      default: return;
    }

    if (outputInfo.cancel) {
      return;
    }

    try {
      this.create(outputInfo);
      this.window.showInformationMessage(`Component ${outputInfo.name} successfully created`);
    } catch (err) {
      this.window.showErrorMessage(`Error: ${err.message}`);
    }
  }

  featureComponentPrompt = async () => {
    const folder = await this.window.showInputBox({ ignoreFocusOut: true, prompt: featureVerbage.folderDesc, validateInput: validateFolder });
    if (!folder) {
      return { cancel: true };
    }

    const name = await this.window.showInputBox({ ignoreFocusOut: true, prompt: featureVerbage.nameDesc(folder), validateInput: validateName });
    if (!name) {
      return { cancel: true };
    }

    return { folder: this.toAbsolutePath('features/' + folder), name: toPascalCase(toWords(name)), type: 'feature' };
  };

  commonComponentPrompt = async () => {
    const name = await this.window.showInputBox({ ignoreFocusOut: true, prompt: componentVerbage.nameDesc, validateInput: validateName });
    if (!name) {
      return { cancel: true };
    }

    return { folder: this.toAbsolutePath('components/' + toPascalCase(toWords(name))), name: toPascalCase(toWords(name)), type: 'common' };
  };

  uiKitComponentPrompt = async () => {
    let atomicType = await this.window.showInputBox({ ignoreFocusOut: true, prompt: uiKitVerbage.atomicType, validateInput: validateAtomicType });
    if (!atomicType) {
      return { cancel: true };
    }
    const folder = await this.window.showInputBox({ ignoreFocusOut: true, prompt: uiKitVerbage.folderDesc(atomicType), validateInput: validateFolder });
    if (!folder) {
      return { cancel: true };
    }
    const name = await this.window.showInputBox({ ignoreFocusOut: true, prompt: uiKitVerbage.nameDesc(atomicType, folder), validateInput: validateName });
    if (!name) {
      return { cancel: true };
    }
    return {
      folder: this.toAbsolutePath('components/' + atomicType + 's/' + folder + '/' + toPascalCase(toWords(name))),
      name: toPascalCase(toWords(name)),
      atomicType: atomicType.substr(0, 1).toUpperCase() + atomicType.substr(1) + 's',
      type: 'uikit'
    };
  };

  selectComponentType = async () => {
    const pickOptions = [
      'Feature',
      'Component (common)',
      'UI Kit'
    ];
    const options = {
      canPickMany: false,
      placeHolder: 'What type of component are you creating?'
    }
    return await this.window.showQuickPick(pickOptions, options);
  }

  create = async (outputInfo) => {
    try {
      let files = ['component', 'test'];
      if (outputInfo.type === 'uikit') {
        files.push('story');
      }

      files.forEach((file) => {
        let data;

        switch (file) {
          case 'component': data = { filename: outputInfo.name + '.jsx', content: ComponentTemplate(outputInfo.name) }; break;
          case 'story': data = { filename: outputInfo.name + '.stories.jsx', content: StorybookTemplate(outputInfo.name, outputInfo.atomicType) }; break;
          case 'test': data = { filename: outputInfo.name + '.test.jsx', content: TestTemplate(outputInfo.name) }; break;
          default: return;
        }

        const fullpath = path.join(outputInfo.folder, data.filename);

        outputFileSync(fullpath, data.content);
      });
    } catch (err) {
      // log other than console?
      console.log('Error', err.message);

      throw err;
    }
  }

  toAbsolutePath = (nameOrRelativePath) => {
    return path.resolve(this.workspaceRoot, this.defaultPath, nameOrRelativePath);
  }
}

module.exports = Generator;