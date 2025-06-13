const _assembleFilterGeneric = (propFilter, value) => (` ${propFilter} eq '${value}'`);

const _assembleOrFilterGeneric = (objHana, propOfilter, propObjHana, propItem) => {
  const aValues = JSON.parse(objHana[propObjHana]);
  const aFiltersValues = aValues.filter((item) => (item.status))
    .map((item) => (`${_assembleFilterGeneric(propOfilter, item[propItem])} or`));
  // console.log(aFiltersValues)
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

export {_assembleOrFilterGeneric, getDateNow}