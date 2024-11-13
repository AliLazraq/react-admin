import Header from '../../components/Header';
import { Box } from '@mui/material';
import LineChart from '../../components/LineChart';

const Line = () => {
    return (
        <Box m= "20px">
        <Box height="75vh">
        <Header title="Line Chart" subtitle="Simple Line Chart" />
        <LineChart />
        </Box>
        </Box>
    );
    };

    export default Line;