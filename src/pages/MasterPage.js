import React, { useEffect, useState } from "react";
import { Container, Box } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { getTableData, getTableCount, getUserHana } from "api";

const columns = [
  { field: "matnr", headerName: "matnr", width: 250 },
  { field: "maktx", headerName: "maktx", flex: 1 },
  { field: "mfrpn", headerName: "mfrpn", flex: 1 }
];
const _assembleFilterGeneric = (propFilter, value) => (` ${propFilter} eq '${value}'`);

const _assembleOrFilterGeneric =  (objHana, propOfilter, propObjHana) => {
  const aValues = JSON.parse(objHana[propObjHana]);
  const aFiltersValues = aValues.filter((item) => (item.status))
    .map((item) => (`${_assembleFilterGeneric(propOfilter, item[propObjHana])} or`));
    console.log(aFiltersValues)
  return aFiltersValues.join('').slice(0, -3);
};
const PAGE_SIZE = 15;

export default function MasterPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Number of rows which exist on the service
  const [rowCount, setRowCount] = useState(0);

  const loadData = async (isFirstLoad, skip = 0) => {
    try {
      setItems([]);
      setLoading(true);
      const usersS4 = await getUserHana({$filter: `documentId eq '03680252000105'`});
      const sFiltersClasses = _assembleOrFilterGeneric(usersS4,'classDesc', 'class');
      const sFiltersManufactureres = _assembleOrFilterGeneric(usersS4,'mfrnr', 'manufacturer');
      const sFilter = ` fornecedorInex eq '10097577'and (${sFiltersClasses}) and (${sFiltersManufactureres})`
      if (isFirstLoad) {
        const count = await getTableCount({$filter: sFilter});
        setRowCount(count);
      }
       
      const _items = await getTableData({
        $top: PAGE_SIZE,
        $skip: skip,
        $filter: sFilter
      });
      const itemsWithIds = _items.map((item, index) => {
        item.id = index;
        return item;
      });
      setItems(itemsWithIds);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChanged = ({ page }) => {
    loadData(false, page * PAGE_SIZE);
  };

  useEffect(() => {
    // when component mounted
    loadData(true);
  }, []);

  return (
    <Container disableGutters>
      <Box height="80vh" py={5}>
        <DataGrid
          loading={loading}
          rows={items}
          columns={columns}
          pageSize={PAGE_SIZE}
          paginationMode="server"
          rowCount={rowCount}
          onPageChange={handlePageChanged}
        />
      </Box>
    </Container>
  );
}
