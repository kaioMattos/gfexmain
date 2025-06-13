import React, { createContext, useState, useContext } from 'react';

export const DashboardContext = createContext();


export const DashboardContextProvider = (props) => {
    const [supplier, setSupplier] = useState({validatedPetro:null});
    const [selectedMaterials, setSelectedMaterials] = useState(null);
    const [selectedMaterialsMastDet, setSelectedMaterialsMastDet] = useState({matnr:null, fields:[]});
    const [loadingPage, setLoadingPage] = useState(false);
    const [cacheFieldValues, setCacheFieldValues] = useState([]);

    const setSupplierContext = (oSupplier)=>{
        const permission = oSupplier !== undefined ? oSupplier.validatedPetro : 'nao_cadastrado'
        setSupplier({...oSupplier, validatedPetro:permission});
    }
    const setSelectedMaterialsContext = (aValues)=>{
        setSelectedMaterials(aValues);
    }


    return <DashboardContext.Provider value={{
        supplier, loadingPage, setSupplierContext, setLoadingPage,
        selectedMaterials, setSelectedMaterialsContext, selectedMaterialsMastDet,
        setSelectedMaterialsMastDet, cacheFieldValues, setCacheFieldValues
    }}>
        {props.children}
    </DashboardContext.Provider>
}

export const useDashboard = () => useContext(DashboardContext);
