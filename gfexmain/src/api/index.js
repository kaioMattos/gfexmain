import axios from "axios";

const userApi = "/user-api/currentUser";
const urlS42Yesb = "gfexs42Destination/sap/opu/odata/sap/YESB_GFEX";
const urlS42YapiSup = "gfexs42Destination/sap/opu/odata/sap/YAPI_GFEX_SUPPLIER_O2";
const urlS42YapiMat = "gfexs42Destination/sap/opu/odata/sap/YAPI_GFEX_RECMAT_O2";
const urlS42YapiInfoTec = "gfexs42Destination/sap/opu/odata/sap/YAPI_GFEX_INFOTEC_O2";

const instance = axios.create({
  baseURL:urlS42Yesb
});
const instanceYapiSup = axios.create({
  baseURL:urlS42YapiSup
});
const instanceYapiMat = axios.create({
  baseURL:urlS42YapiMat
});

export const getTableData = async (params = { $top: 100, $skip: 0, $filter:'' }) => {
  const { data } = await instance.get("/ConsumerMaterial", {
    params
  });

  return data.d?.results || data.d || data.value;
};

export const getTableCount = async (params = { $filter:'' }) => {
  const { data } = await instance.get("/ConsumerMaterial/$count?sap-client=220",{
    params
  });
  return data;
};

export const getTecInfoMaterial = async (params = { $filter:'' }) => {
  const { data } = await instance.get("/CharMaterialClass?sap-client=220", {
    params
  });

  return data.d?.results || data.d || data.value;
};

export const getCountIndicator = async (params) => {
  const { data } = await instance.get("/ConsumerMaterial/$count?sap-client=220", {
    params
  });

  return data;
};

export const getUserHana = async (params) => {
  const { data } = await instanceYapiSup.get("/SuppliersGFEX?sap-client=220", {
    params
  });

  return  data.d?.results[0];
};

export const getUserLogged = async () => {
 
  const { data } = await axios.get(userApi);
  return data.d?.results || data.d || data.value;
};

export const getUsersS4Data = async (params = {  }) => {
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
    // console.log('OData request successful:', response.data);
  } catch (error) {
    console.error('Error making OData request:', error);
  }
}

export const postInfoTec = async (oEntry) => {

  const csrfToken = await fetchXCSRFTokenInfoTec();

  if (!csrfToken) {
    console.error('Failed to retrieve CSRF token.');
    return;
  }

  try {
    const response = await axios.post(`${urlS42YapiInfoTec}/InfoTec?sap-client=220`, {
      ...oEntry
    }, {
      headers: {
        'X-CSRF-Token': csrfToken,
        'Content-Type': 'application/json'
      }
    });
    // console.log('OData request successful:', response.data);
  } catch (error) {
    console.error('Error making OData request:', error);
  }
}

export const putInfoTec = async (oEntry) => {

  const csrfToken = await fetchXCSRFTokenInfoTec();

  if (!csrfToken) {
    console.error('Failed to retrieve CSRF token.');
    return;
  }

  try {
    const response = await axios.put(`${urlS42YapiInfoTec}/InfoTec('${oEntry.Nm}')?sap-client=220`, {
      ...oEntry
    }, {
      headers: {
        'X-CSRF-Token': csrfToken,
        'Content-Type': 'application/json'
      }
    });
    console.log('OData request successful:', response.data);
  } catch (error) {
    console.error('Error making OData request:', error);
  }
}

export const putMaterial = async (oEntry) => {

  const csrfToken = await fetchXCSRFToken();

  if (!csrfToken) {
    console.error('Failed to retrieve CSRF token.');
    return;
  }

  try {
    const response = await axios.patch(`${urlS42YapiMat}/ReconhecimentoMaterial('${oEntry.Nm}')?sap-client=220`, {
      ...oEntry
    }, {
      headers: {
        'X-CSRF-Token': csrfToken,
        'Content-Type': 'application/json'
      }
    });
    console.log('OData request successful:', response.data);
  } catch (error) {
    console.error('Error making OData request:', error);
  }
}