import React, { useEffect, useState } from "react";
import { Box,Grid } from '@mui/material';
import { Card, CardContent, CardActionArea, Typography } from '@mui/material';
import { useDashboard } from 'useContext';
import { getDateNowFrontFormated } from '../../../../utils';
import "../../styles.css"; 

export default function Master({ items }) {

  const [selectedCard, setSelectedCard] = useState(0);
  const handleSelectedCard = (index, item) => {
    setSelectedCard(index);
   
  };
  const loadDataDetail = () => {
  }
  useEffect(() => {
    loadDataDetail();
  }, []);
  return (
    <Box
      className="centerCol"
    >
      {items.map((item, index) => (
        <Card style={{ margin: '10px' }}>
          <CardActionArea
            onClick={() => handleSelectedCard(index, item)}
            data-active={selectedCard === index ? '' : undefined}
            sx={{
              height: '100%',
              '&[data-active]': {
                border: '1px solid rgb(0, 133, 66)',
                borderRadius: '4px',

                backgroundColor: 'rgba(0, 133, 66, 0.09)',
                '&:hover': {
                  backgroundColor: 'action.selectedHover',
                },
              },
            }}
          >
            <CardContent sx={{ height: '100%', width: '100%', textAlign: 'left' }}>
              <Grid container>
                <Grid item size={12}>
                  <Typography variant="h6" component="div" sx={{ color: 'rgb(0,136,66)' }}>
                    {item.maktx}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container style={{ marginTop: '10px' }}>
                <Grid item size={6}>
                  <Typography variant="body2" color="text.secondary">
                    {item.matnr}
                  </Typography>
                </Grid>
                <Grid item size={6} style={{ textAlign: 'end' }}>
                  <Typography variant="body2" color="text.secondary" >
                    {/* {getDateNowFrontFormated(parseInt(item.updatedAt.slice(6, -2), 10), 'dateAtDay')} */}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
}
