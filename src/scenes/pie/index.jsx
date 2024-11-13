import Header from '../../components/Header';
import { Box } from '@mui/material';
import PieChart from '../../components/PieChart';

const Pie = () => {
  return (
    <Box m= "20px">
        <Box height="75vh">
        <Header title="Pie Chart" subtitle="Simple Pie Chart" />
        <PieChart />
        </Box>
        </Box>
  );
};

export default Pie;
