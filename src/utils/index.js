const _assembleFilterGeneric = (propFilter, value) => (` ${propFilter} eq '${value}'`);

const _assembleOrFilterGeneric = (objHana, propOfilter, propObjHana, propItem) => {
  const aValues = JSON.parse(objHana[propObjHana]);
  const aFiltersValues = aValues.filter((item) => (item.status))
    .map((item) => (`${_assembleFilterGeneric(propOfilter, item[propItem])} or`));
  console.log(aFiltersValues)
  return aFiltersValues.join('').slice(0, -3);
};

export {_assembleOrFilterGeneric}