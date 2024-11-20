
import React from 'react';
import { Box, Typography } from '@mui/material';
import Predict from '../../components/Predict';
import Header from '../../components/Header';

const Predictions = () => {

    return (
      <Box p={3}> 
      <Header title="Price Predictor" subtitle="Car Information" />
        <Box mb={4}>
          <Predict />
        </Box>
      </Box>
    );
  };

export default Predictions;


