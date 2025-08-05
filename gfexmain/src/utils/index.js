const _assembleFilterGeneric = (propFilter, value) => (` ${propFilter} eq '${value}'`);

const _assembleOrFilterGeneric = (objHana, propOfilter, propObjHana, propItem) => {
  const aValues = JSON.parse(objHana[propObjHana]);
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

export {_assembleOrFilterGeneric, getDateNow, getDateIsoString}