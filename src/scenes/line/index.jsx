import Header from '../../components/Header';
import { Box } from '@mui/material';
import BarChart from '../../components/LineChart';

const Line = () => {
    return (
        <Box m= "20px">
        <Box height="75vh">
        <Header title="Fuel Logs Overview" subtitle="Bar Chart" />
        <BarChart />
        </Box>
        </Box>
    );
    };

    export default Line;