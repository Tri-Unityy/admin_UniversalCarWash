import React from "react";
import { Box, Typography, Grid, Paper, Divider } from "@mui/material";
import logo from "../../assets/images/Carwash.png";

const BillView = () => {
  const bill = {
    id: 123,
    date: "2024-05-04",
    totalAmount: 150.0,
    items: [
      { name: "Window Cleaning", price: 50.0, quantity: 2 },
      { name: "Rim Cleaning", price: 25.0, quantity: 3 },
      { name: "Seat Cleaning", price: 20.0, quantity: 1 },
      { name: "Window Cleaning", price: 50.0, quantity: 2 },
      { name: "Rim Cleaning", price: 25.0, quantity: 3 },
      { name: "Seat Cleaning", price: 20.0, quantity: 1 },
    ],
  };

  return (
    <Box sx={{ fontFamily: "Arial, sans-serif", textAlign: "center", p: 4 }}>
      {/* Header Section */}
      <Paper
        elevation={3}
        sx={{
          mb: 3,
          p: 1,
          backgroundColor: 'black',
          color: 'white',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          '@media print': {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap', 
            alignItems: 'center', 
          }
        }}
      >
        <Grid
          container
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap', 
            alignItems: 'center',
            padding:'10px',
            width: '100%',
            '@media print': {
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'nowrap',
            }
          }}
        >
          <Grid item xs={12} md={2} sx={{ textAlign: 'left', '@media print': { width: 'auto' } }}>
            <Box>
              <img src={logo} alt="Company Logo" width={150} />
            </Box>
          </Grid>
          <Grid item xs={12} md={10} sx={{ textAlign: 'right', '@media print': { width: 'auto' } }}>
            <Typography variant="h6" sx={{ fontSize: '1rem',color:'white' }}> 
              Craft your dream vehicle
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.775rem' ,color:'white' }}> 
            Universal Car Wash Sàrl Route de Saint-Georges, 77 1213 Petit Lancy
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Information */}
      <Paper
        elevation={3}
        sx={{
          mb: 3,
          p: 1, // Reduced padding
          '@media print': {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap', // Prevent wrapping in print
          },
        }}
      >
        <Grid
          container
          spacing={1} // Reduced spacing
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            '@media print': {
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'nowrap',
            },
          }}
        >
          <Grid item xs={12} md={6}>
            <Typography
              sx={{
                '@media print': {
                  textAlign: 'left',
                  margin: 0,
                  fontSize: '0.875rem', // Reduced font size
                },
              }}
            >
              Universal Car Wash Sàrl Genève, le 16 octobre 2023
              <br />
              MARC ROBIN Automobile SA Route de Saint-Georges, 85 1213 Petit-Lancy
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={1} sx={{ '@media print': { flexDirection: 'row' } }}>
              <Grid item xs={6} sx={{ textAlign: 'left', '@media print': { textAlign: 'left' } }}>
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}> 
                  Date:
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}> 
                  Invoice No:
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}> 
                  Service ID:
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}> 
                  Payment Due Date:
                </Typography>
              </Grid>
              <Grid item xs={6} sx={{ textAlign: 'left', '@media print': { textAlign: 'left' } }}>
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}> 
                  12.05.2024
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}> 
                  Inv 001
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}> 
                  ser 1
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}> 
                  20.05.2024
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* Customer Details */}
      <Paper elevation={3} sx={{ mb: 3, p: 1 }}> {/* Reduced padding */}
        <Grid container justifyContent="space-between">
          <Grid item>
            <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: '1rem' }}> 
              Customer Details
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 1 }} /> 
        <Grid container spacing={1} sx={{p:1}}> 
        <Grid item xs={6} sx={{ textAlign: 'left', '@media print': { textAlign: 'left' } }}>
            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}> 
              Vehicle No: tN934893443
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}> 
              Client Name: Thushari
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}> 
              Service Date: 19.05.2024
            </Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'left', '@media print': { textAlign: 'left' } }}>
            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}> 
              Address: 28, Asgard, Twiste test address
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}> 
              Phone: 08462672367512
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Service and Rate */}
      <Paper elevation={3} sx={{ mb: 3, p: 1 }}> {/* Reduced padding */}
        <Grid container justifyContent="space-between">
          <Grid item>
            <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: '1rem' }}> 
              Service
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: '1rem' }}> 
              Rate (CHF)
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 1 }} /> {/* Reduced margin */}
        {bill.items.map((item, index) => (
          <Grid container key={index} justifyContent="space-between" sx={{ py: 1 , p:1}}>
            <Grid item>
              <Typography variant="body2" sx={{ fontSize: '0.75rem' }}> 
                {item.name}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2" sx={{ fontSize: '0.75rem' }}> 
                {item.price}
              </Typography>
            </Grid>
          </Grid>
        ))}
      </Paper>

      {/* Subtotal and Final Total */}
      <Paper elevation={3} sx={{ p: 1 }}> {/* Reduced padding */}
        <Grid container justifyContent="space-between" sx={{p:1}}>
          <Grid item sx={{ textAlign: 'left', '@media print': { width: 'auto' } }}>
            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}> 
              Tax rate:
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}> 
              Any Discount rate:
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}> 
              Sub Total:
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}> 
              Tax amount:
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}> 
              Discount amount:
            </Typography>
          </Grid>
          <Grid item sx={{ textAlign: 'right', '@media print': { width: 'auto' } }}>
            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}> 
              8%
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}> 
              10%
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}> 
              120
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}> 
              12
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}> 
              10
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 1 }} /> {/* Reduced margin */}
        <Grid container justifyContent="space-between">
          <Grid item>
            <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: '1rem' }}> 
              Final Total:
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: '1rem' }}> 
              100
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Footer */}
      <Paper elevation={3} sx={{ mt: 3, p: 2, bgcolor: 'black', color: 'white' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ color: "#FF2400", fontWeight: "bold", fontSize: '1.25rem' }}> 
            Thank you for having business with us!
          </Typography>
        </Box>
        <Divider sx={{ my: 1 }} /> {/* Reduced margin */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            '@media print': {
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap', 
              alignItems: 'flex-start' 
            }
          }}
        >
          <Typography variant="body2" sx={{ color: "white", fontSize: '0.775rem' }}> 
            info@theuniversalcarwash.ch
          </Typography>
          <Typography variant="body2" sx={{ color: "white", fontSize: '0.775rem' }}> 
            079 /327 00 36
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default BillView;
