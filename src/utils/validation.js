const validateName = (name) => {
  if (!name) {
    return 'Name is required';
  }

  if (name.includes(' ')) {
    return 'Spaces are not allowed';
  }

  // no errors
  return null;
}
const validateFolder = (folder) => {
  if (!folder) {
    return "Folder is Required! " + "Output Path (Use PascalCase) Ex: 'FirstPartyData' will output to src/features/FirstPartyData/ " +
    "'FirstPartyData/RandomComponent' will output to src/features/FirstPartyData/RandomComponent/\n"
  }

  if (folder.includes(' ')) {
    return 'Spaces are not allowed' + "Output Path (Use PascalCase) Ex: 'FirstPartyData' will output to src/features/FirstPartyData/ " +
    "'FirstPartyData/RandomComponent' will output to src/features/FirstPartyData/RandomComponent/\n";
  }

  // no errors
  return null;
}
const validateCategory = (name) => {
  if (!name) {
    return 'Name is required';
  }

  // no errors
  return null;
}
const validateAtomicType = type => {
  if(!type) {
    return "Type is required.  Atomic type must be one of the following: Atom/Molecule/Organism/Page/Template"
  }
  if(!['atom', 'molecule','organism', 'page', 'template'].includes(type.toLowerCase())) {
    return "Atomic type must be one of the following: Atom/Molecule/Organism/Page/Template"
  }

  return null;
}
module.exports = { validateCategory, validateName, validateFolder, validateAtomicType };