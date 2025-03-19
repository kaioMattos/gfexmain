import axios from "axios";

const userApi = "/user-api/currentUser";
const urlS42 = "gfexs42Destination/sap/opu/odata/sap/YESB_GFEX";
const urlCAP = "gfexCAPDestination/odata/v2/catalog";

const instance = axios.create({
  baseURL:urlS42
});
const instanceHana = axios.create({
  baseURL:urlCAP
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

export const getCountIndicator = async (params) => {
  const { data } = await instance.get("/ConsumerMaterial/$count?sap-client=220", {
    params
  });

  return data;
};

export const getUserHana = async (params) => {
  const { data } = await instanceHana.get("/Suppliers", {
    params
  });

  return  data.d?.results[0];
};

export const getUserLogged = async () => {
 
  const { data } = await axios.get(userApi);
  return data.d?.results || data.d || data.value;
};

export const getUsersS4Data = async (params = {  }) => {
  const { data } = await instance.get("/CentralConsumer", {
    params
  });

  return data.d?.results || data.d || data.value;
};