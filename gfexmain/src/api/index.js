import axios from "axios";

const userApi = "/user-api/currentUser";
const urlCapGfex = "gfexDestination/odata/v4/catalog";
const urlS42Yesb = "gfexs42Destination/sap/opu/odata/sap/YESB_GFEX";
const urlS42YapiSup = "gfexs42Destination/sap/opu/odata/sap/YAPI_GFEX_SUPPLIER_O2";
const urlS42YapiMat = "gfexs42Destination/sap/opu/odata/sap/YAPI_GFEX_RECMAT_O2";
const urlS42YapiInfoTec = "gfexs42Destination/sap/opu/odata/sap/YAPI_GFEX_IT_APPROVAL_O2";

const instanceCap = axios.create({
  baseURL: urlCapGfex
});

const instance = axios.create({
  baseURL: urlS42Yesb
});
const instanceYapiSup = axios.create({
  baseURL: urlS42YapiSup
});
const instanceYapiMat = axios.create({
  baseURL: urlS42YapiMat
});

export const getTableData = async (params = { $top: 100, $skip: 0, filter: '' }) => {
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
export const getUserHana = async (user) => {
  const url = `/SuppliersGFEX('${user}')`;
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

export const getTableCount = async (params = { $filter: '' }) => {
  const { data } = await instanceCap.get("/ConsumerMaterial/$count?sap-client=220", {
    params
  });
  return data;
};

export const getUserLogged= async () => {
  const url = `/GetAutorization`;
  const { data } = await instanceCap.get(url);
  return data;
};



export const getUserLoggedWithAttr = async () => {
  const { data } = await axios.get(userApi, "/attributes");
  return data.d?.results || data.d || data.value;
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
export const putInfoTecMain = async (oEntry) => {

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
  } catch (error) {
    console.error('Error making OData request:', error);
  }
}

export const putInfoTec = async (oEntry) => {

  try {
    const response = await instanceCap.put(`/CaracApproval('${oEntry.Nm}')?sap-client=220`, {
      ...oEntry
    });
    console.log('OData request successful:', response.data);
  } catch (error) {
    console.error('Error making OData request:', error);
  }
}



export const getUsersS4Data = async (params = {}) => {
  const { data } = await instance.get("/CentralConsumer?sap-client=220", {
    params
  });
  return data.d?.results || data.d || data.value;
};

const fetchXCSRFToken = async () => {
  try {
    const response = await axios.get(`${urlS42YapiMat}/?sap-client=220`, {
      headers: {
        'X-CSRF-Token': 'Fetch'
      }
    });
    return response.headers['x-csrf-token'];
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
  }
}

const fetchXCSRFTokenInfoTec = async () => {
  try {
    const response = await axios.get(`${urlS42YapiInfoTec}/?sap-client=220`, {
      headers: {
        'X-CSRF-Token': 'Fetch'
      }
    });
    return response.headers['x-csrf-token'];
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
  }
}

export const postRecogMaterial = async (oEntry) => {

  const csrfToken = await fetchXCSRFToken();

  if (!csrfToken) {
    console.error('Failed to retrieve CSRF token.');
    return;
  }

  try {
    const response = await axios.post(`${urlS42YapiMat}/ReconhecimentoMaterial?sap-client=220`, {
      ...oEntry
    }, {
      headers: {
        'X-CSRF-Token': csrfToken,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error making OData request:', error);
  }
}
