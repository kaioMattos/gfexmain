const _assembleFilterGeneric = (propFilter, value) => (` ${propFilter} eq '${value}'`);

const _assembleOrFilterGeneric = (objHana, propOfilter, propObjHana, propItem) => {
  const aValues = objHana[propObjHana];
  const aFiltersValues = aValues.filter((item) => (item.status))
    .map((item) => (`${_assembleFilterGeneric(propOfilter, item[propItem])} or`));
  return aFiltersValues.join('').slice(0, -3);
};

const getDateNow = () => {
  const oDate = new Date();
  const year = oDate.getFullYear();
  const month = oDate.getMonth() <= 9 ? `0${oDate.getMonth()}` : oDate.getMonth();
  const day = oDate.getDate() <= 9 ? `0${oDate.getDate()}` : oDate.getDate();
  const hours = oDate.getHours() <= 9 ? `0${oDate.getHours()}` : oDate.getHours();
  const minutes = oDate.getMinutes() <= 9 ? `0${oDate.getMinutes()}` : oDate.getMinutes();
  const seconds = oDate.getSeconds() <= 9 ? `0${oDate.getSeconds()}` : oDate.getSeconds();
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
}

const getDateIsoString = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const edmDate = `${yyyy}-${mm}-${dd}`; // "2025-07-22"
  return edmDate
}

const removeDuplicatesFromArray = (arr) => {
  return [...new Set(
    arr.map(el => JSON.stringify(el))
  )].map(e => JSON.parse(e))
}
const base64ToBlob = (base64, mimeType) => {
  const base64Data = base64.replace(/^data:([^;]+);base64,/, '');
  const byteCharacters = atob(base64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: mimeType });
}

const readFile = (file) => {
  return new Promise((resolve, reject) => {
    var fr = new FileReader();
    fr.onload = () => {
      resolve(fr.result)
    };
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}
const getDateNowFrontFormated = (sTime, format) => {
  let sDate = '';
  const oDate = new Date(sTime);
  const year = oDate.getFullYear();
  const month = (oDate.getMonth() + 1) <= 9 ? `0${oDate.getMonth() + 1}` : (oDate.getMonth() + 1);
  const day = oDate.getDate() <= 9 ? `0${oDate.getDate()}` : oDate.getDate();
  const hours = oDate.getHours() <= 9 ? `0${oDate.getHours()}` : oDate.getHours();
  const minutes = oDate.getMinutes() <= 9 ? `0${oDate.getMinutes()}` : oDate.getMinutes();
  if (format === 'dataAtMinutes') {
    sDate = `${day}-${month}-${year} ${hours}:${minutes}`
  } else {
    sDate = `${day}-${month}-${year}`
  }
  return sDate
}


export {
  _assembleOrFilterGeneric, getDateNow, getDateIsoString, removeDuplicatesFromArray,
  readFile, getDateNowFrontFormated, base64ToBlob
}