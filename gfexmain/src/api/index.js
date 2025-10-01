import axios from "axios";

const urlCapGfex = "gfexDestination/odata/v4/catalog";
const instanceCap = axios.create({
  baseURL: urlCapGfex
});

export const getMaterial = async (params = { $top: 100, $skip: 0, filter: '' }) => {
  const url = `/ConsumerMaterial?$filter=${params.filter}`
  const { data } = await instanceCap.get(url);
  return data.value;
};

export const getCountIndicator = async (params) => {
  const url = `/ConsumerMaterial/$count?$filter=${params.filter}`
  const { data } = await instanceCap.get(url);
  return data;
};

export const getCountIndSugg = async () => {
  const url = `/ConsumerSuggestion/$count`
  const { data } = await instanceCap.get(url);
  return data;
};

export const getDataSugg = async () => {
  const url = `/ConsumerSuggestion`
  const { data } = await instanceCap.get(url);
  return data;
};

export const postRecogMat = async (oEntry) => {
  try {
    const response = await instanceCap.post(`/ReconhecimentoMaterial?sap-client=220`, {
      ...oEntry
    });
  } catch (error) {
    console.error('Error making OData request:', error);
  }
}

export const putRecogMat  = async (oEntry) => {

  try {
    const response = await instanceCap.patch(`/ReconhecimentoMaterial('${oEntry.Nm}')?sap-client=220`, {
      ...oEntry
    });
    console.log('OData request successful:', response.data);
  } catch (error) {
    console.error('Error making OData request:', error);
  }
}

export const getUserLogged= async () => {
  const url = `/GetAutorization`;
  const { data } = await instanceCap.get(url);
  return data;
};

export const getTecInfoMaterial = async ({ filter, expand }) => {
  let url = `/CharMaterialClass?$filter=${filter}&$expand=${expand}`
  const { data } = await instanceCap.get(url);

  return data.d?.results || data.d || data.value;
};

export const postInfoTecMain = async (oEntry) => {

  try {
    const response = await instanceCap.post(`/MainApproval?sap-client=220`, {
      ...oEntry
    });
    return response
  } catch (error) {
    console.error('Error making OData request:', error);
  }
}
export const putInfoTecCaracMain = async (oEntry) => {

  try {
    const response = await instanceCap.put(`/MainApproval(IdModificacao='${oEntry.IdModificacao}')?sap-client=220`, {
      ...oEntry
    });
    console.log('OData request successful:', response.data);
  } catch (error) {
    console.error('Error making OData request:', error);
  }
}
export const getTecInfoMain = async (params = { $top: 100, $skip: 0, filter: '' }) => {
  try {
    const url = `/MainApproval?$filter=${params.filter}`
    const { data } = await instanceCap.get(url);
    return data.value;
  } catch (error) {
    console.error('Error making OData request:', error);
  }
};
export const postInfoTecCarac = async (oEntry) => {

  try {
    const response = await instanceCap.post(`/CaracApproval?sap-client=220`, {
      ...oEntry
    });
    return response
  } catch (error) {
    console.error('Error making OData request:', error);
  }
}

export const putInfoTecCarac = async (oEntry) => {

  try {
    const response = await instanceCap.put(`/CaracApproval('${oEntry.Nm}')?sap-client=220`, {
      ...oEntry
    });
    console.log('OData request successful:', response.data);
  } catch (error) {
    console.error('Error making OData request:', error);
  }
}

export const postSupplier = async (oEntry) => {

  try {
    const response = await instanceCap.post(`/SuppliersGFEX?sap-client=220`, {
      ...oEntry
    });
    return response
  } catch (error) {
    console.error('Error making OData request:', error);
  }
}

export const putSupplier = async (oEntry) => {

  try {
    const response = await instanceCap.put(`/SuppliersGFEX('${oEntry.eMail}')?sap-client=220`, {
      ...oEntry
    });
    console.log('OData request successful:', response.data);
  } catch (error) {
    console.error('Error making OData request:', error);
  }
}

export const postExclusivityLetter = async (oEntry) => {
console.log(oEntry)
  try {
    const response = await axios.post(`/gfexDestination/uploadDocument`, oEntry);
    return response
  } catch (error) {
    console.error('Error making OData request:', error);
  }
}

export const deleteExclusivityLetter = async (oEntry) => {

  try {
    const response = await instanceCap.delete(`/ExclusiveCardGFEX(guid'${oEntry.id}')?sap-client=220`, {
      ...oEntry
    });
    console.log('OData request successful:', response.data);
  } catch (error) {
    console.error('Error making OData request:', error);
  }
}

export const getSupplier = async ({filter}) => {
  const { data } = await instanceCap.get(`/CentralConsumer?$filter=${filter}`);
  return data.value[0]
};
export const getManufacturer = async ({filter, expand}) => {
  const { data } = await instanceCap.get(`/ManufacturerMaterial?$filter=${filter}&$expand=${expand}`);
  return data.value
};

export const getClass = async ({filter}) => {
  const { data } = await instanceCap.get(`/MaterialClass?$filter=${filter}`);

  return data.d?.results || data.d || data.value;
};