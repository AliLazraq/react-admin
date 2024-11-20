import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { tokens } from "../theme";
import VehicleSelector from "./VehicleSelector";

const FuelLogForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [fuelLogs, setFuelLogs] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(""); // Vehicle selection state
  const [page, setPage] = useState(0); // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page
  const [order, setOrder] = useState("asc"); // Sorting order
  const [orderBy, setOrderBy] = useState("date"); // Column to sort by

  // Function to fetch fuel logs from the backend
  const fetchFuelLogs = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/fuel-logs");
      setFuelLogs(response.data);
    } catch (error) {
      console.error("Error fetching fuel logs:", error);
    }
  };

  useEffect(() => {
    fetchFuelLogs();
  }, []);

  // Function to handle form submission and save new fuel log
  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      console.log("Form values:", values);
      const Amount = (values.Total_cost / values.fuel_cost).toFixed(2);

      if (!selectedVehicle) {
        alert("Please select a vehicle.");
        return;
      }

      const jsonData = {
        vehicleId: selectedVehicle,
        fuelAmount: Amount,
        fuelCost: values.Total_cost,
        location: values.location,
        odometer: values.odometer,
        paymentMethod: values.paymentMethod, // Include payment method
      };

      console.log("Payload:", jsonData);

      await axios.post("http://localhost:8080/api/fuel-logs", jsonData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      alert("Fuel log added successfully!");
      resetForm();
      fetchFuelLogs(); // Refresh the fuel logs after adding a new one
    } catch (error) {
      console.error("Error adding fuel log:", error);
      alert("Failed to add fuel log");
    }
  };

  // Sorting handler
  const handleSort = (property) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Sort and paginate fuel logs
  const sortedLogs = [...fuelLogs].sort((a, b) => {
    if (order === "asc") {
      return a[orderBy] < b[orderBy] ? -1 : 1;
    }
    return a[orderBy] > b[orderBy] ? -1 : 1;
  });

  const paginatedLogs = sortedLogs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box p={3}>

      {/* Vehicle Selector */}
      <Box mb={2}>
        <VehicleSelector
          selectedVehicle={selectedVehicle}
          setSelectedVehicle={setSelectedVehicle}
        />
      </Box>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="20px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                label="Total Cost"
                name="Total_cost"
                value={values.Total_cost}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.Total_cost && !!errors.Total_cost}
                helperText={touched.Total_cost && errors.Total_cost}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Fuel Cost"
                name="fuel_cost"
                value={values.fuel_cost}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.fuel_cost && !!errors.fuel_cost}
                helperText={touched.fuel_cost && errors.fuel_cost}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Location"
                name="location"
                value={values.location}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.location && !!errors.location}
                helperText={touched.location && errors.location}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Odometer"
                name="odometer"
                value={values.odometer}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.odometer && !!errors.odometer}
                helperText={touched.odometer && errors.odometer}
              />
              <FormControl
                fullWidth
                variant="filled"
                sx={{
                  gridColumn: "span 4",
                  backgroundColor: colors.primary[400],
                }}
              >
                <InputLabel>Payment Method</InputLabel>
                <Select
                  name="paymentMethod"
                  value={values.paymentMethod}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.paymentMethod && !!errors.paymentMethod}
                >
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="Credit Card">Credit Card</MenuItem>
                  <MenuItem value="Fuel Card">Fuel Card</MenuItem>
                </Select>
                {touched.paymentMethod && errors.paymentMethod && (
                  <Typography variant="body2" color="error">
                    {errors.paymentMethod}
                  </Typography>
                )}
              </FormControl>
            </Box>
            <Box display="flex" justifyContent="flex-end" mt="20px">
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: colors.greenAccent[500],
                  "&:hover": {
                    backgroundColor: colors.greenAccent[700],
                  },
                }}
                disabled={!selectedVehicle} // Disable if no vehicle is selected
              >
                Add Fuel Log
              </Button>
            </Box>
          </form>
        )}
      </Formik>

      <Box mt={4}>
        <Typography variant="h6" mb={2}>
          Fuel Logs
        </Typography>
        {fuelLogs.length > 0 ? (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "vehicleId"}
                        direction={order}
                        onClick={() => handleSort("vehicleId")}
                      >
                        Vehicle ID
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "fuelAmount"}
                        direction={order}
                        onClick={() => handleSort("fuelAmount")}
                      >
                        Fuel Amount (L)
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Fuel Cost</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Odometer</TableCell>
                    <TableCell>Payment Method</TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "date"}
                        direction={order}
                        onClick={() => handleSort("date")}
                      >
                        Date
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedLogs.map((log) => (
                    <TableRow key={log.fuelLogId}>
                      <TableCell>{log.vehicleId}</TableCell>
                      <TableCell>{log.fuelAmount}</TableCell>
                      <TableCell>{log.fuelCost}</TableCell>
                      <TableCell>{log.location}</TableCell>
                      <TableCell>{log.odometer}</TableCell>
                      <TableCell>{log.paymentMethod}</TableCell>
                      <TableCell>
                        {new Date(log.date).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={fuelLogs.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        ) : (
          <Typography>No fuel logs available.</Typography>
        )}
      </Box>
    </Box>
  );
};

const validationSchema = yup.object().shape({
  Total_cost: yup.number().required("Total Cost is required").min(0),
  fuel_cost: yup.number().required("Fuel cost is required").min(0),
  location: yup.string().required("Location is required"),
  odometer: yup.number().required("Odometer is required").min(0),
  paymentMethod: yup
    .string()
    .oneOf(["Cash", "Credit Card", "Fuel Card"], "Invalid payment method")
    .required("Payment Method is required"),
});

const initialValues = {
  Total_cost: "",
  fuel_cost: "",
  location: "",
  odometer: "",
  paymentMethod: "Cash", // Default to "Cash"
};

export default FuelLogForm;
