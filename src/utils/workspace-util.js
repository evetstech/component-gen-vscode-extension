const getWorkspaceFolder = (folders) => {
  if (!folders) {
    return '';
  }

  const folder = folders[0] || {};
  const uri = folder.uri;

  return uri.fsPath;
};

module.exports = getWorkspaceFolder;