import { Box, useTheme } from "@mui/material";
import GPSMap from "../../components/GPSMap";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const GPS = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px">
      <Header title="GPS Tracking" subtitle="Real-time Location and Speed" />

      <Box
        height="75vh"
        border={`1px solid ${colors.grey[100]}`}
        borderRadius="4px"
      >
        <GPSMap />
      </Box>
    </Box>
  );
};

export default GPS;
