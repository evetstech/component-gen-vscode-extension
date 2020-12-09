const toWords = (input) => {
  const regex = /[A-Z\xC0-\xD6\xD8-\xDE]?[a-z\xDF-\xF6\xF8-\xFF]+|[A-Z\xC0-\xD6\xD8-\xDE]+(?![a-z\xDF-\xF6\xF8-\xFF])|\d+/g;

  return input.match(regex);
}

const toPascalCase = (inputArray) => {
  let result = "";
  for (let i = 0, len = inputArray.length; i < len; i++) {

    let currentStr = inputArray[i];

    let tempStr = currentStr.toLowerCase();

    // convert first letter to upper case (the word is in lowercase) 
    tempStr = tempStr.substr(0, 1).toUpperCase() + tempStr.substr(1);

    result += tempStr;

  }

  return result;
}

module.exports = { toWords, toPascalCase };