import React, { useRef } from "react";
import { Box, Typography, Grid, Paper, Divider, Button } from "@mui/material";
import logo from "../../assets/images/Carwash.png";
import { useLocation } from 'react-router-dom';
import html2pdf from "html2pdf.js";

const BillView = () => {
  const location = useLocation();
  const formData = location.state; // Receiving form data from previous component
  console.log('Received Form Data:', formData);

  // Reference for the bill container
  const billRef = useRef();

  // Function to generate PDF
  const handleGeneratePDF = () => {
    const element = billRef.current; // Reference to the bill container
    const options = {
      margin: 0.5,
      filename: `Bill_${formData.id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(options).from(element).save();
  };

  // Function to print the receipt
  const handlePrint = () => {
    window.print();
  };

  // Calculate final total with discount (if applicable)
  const calculateFinalTotal = () => {
    const discount = formData.discount || 0; // Default to 0 if no discount is provided
    return formData.subTotal - discount;
  };

  return (
    <Box sx={{ fontFamily: "Arial, sans-serif", textAlign: "center", p: 4 }}>
      {/* Data Preview Section */}
      <div ref={billRef}>
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
              flexDirection: 'row',
              flexWrap: 'nowrap',
              alignItems: 'center'
            }
          }}
        >
          <Grid
            container
            sx={{
              flexDirection: 'row',
              flexWrap: 'nowrap',
              alignItems: 'center',
              padding: '10px',
              width: '100%',
              '@media print': {
                flexWrap: 'nowrap'
              }
            }}
          >
            <Grid item xs={12} md={2} sx={{ textAlign: 'left', '@media print': { width: 'auto' } }}>
              <Box>
                <img src={logo} alt="Company Logo" width={150} />
              </Box>
            </Grid>
            <Grid item xs={12} md={10} sx={{ textAlign: 'right', '@media print': { width: 'auto' } }}>
              <Typography variant="body2" sx={{ fontSize: '0.775rem', color: 'white' }}>
              Universal car wash sàrl
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.775rem', color: 'white' }}>
              Rte de Saint-Georges 77, 1213 Petit-Lancy
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Main Information */}
        <Paper elevation={3} sx={{ mb: 3, p: 1 }}>
          <Grid container>
            <Grid item xs={12} md={6}></Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
              <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                Date:{' '}
                {new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(
                  new Date(formData.serviceDate)
                )}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                Invoice No: {formData.id}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                Due Date:{' '}
                {new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(
                  new Date(formData.paymentDueDate)
                )}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Customer Details */}
        <Paper elevation={3} sx={{ mb: 3, p: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
            Customer Details
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="body2">Vehicle No: {formData.vehicleNumber}</Typography>
              <Typography variant="body2">Client Name: {formData.name}</Typography>
              <Typography variant="body2">
                Service Date:{' '}
                {new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(
                  new Date(formData.serviceDate)
                )}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Address: {formData.customerAddress}</Typography>
              <Typography variant="body2">Phone: {formData.phoneNumber}</Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Service Details */}
        <Paper elevation={3} sx={{ mb: 3, p: 1 ,minHeight:250}}>
          <Grid container justifyContent="space-between">
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Service
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Rate (CHF)
            </Typography>
          </Grid>
          <Divider sx={{ my: 1 }} />
          {formData.services.map((item, index) => (
            <Grid container key={index} justifyContent="space-between" sx={{ py: 1 }}>
              <Typography>{item.name}</Typography>
              <Typography>{item.price}</Typography>
            </Grid>
          ))}
        </Paper>

        {/* Subtotal, Discount, and Final Total */}
        <Paper elevation={3} sx={{ p: 1 ,minHeight:150}}>
          <Grid container justifyContent="space-between">
            <Typography>Sub Total:</Typography>
            <Typography>{formData.subTotal} CHF</Typography>
          </Grid>
          {formData.discount > 0 && (
            <>
              <Divider sx={{ my: 1 }} />
              <Grid container justifyContent="space-between">
                <Typography>Discount:</Typography>
                <Typography>-{formData.discount} CHF</Typography>
              </Grid>
            </>
          )}
          <Divider sx={{ my: 1 }} />
          <Grid container justifyContent="space-between">
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Final Total:
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {calculateFinalTotal()} CHF
            </Typography>
          </Grid>
        </Paper>

            {/* Footer */}
      <Paper elevation={3} sx={{ mt: 3, p: 2, bgcolor: 'black', color: 'white',mb:0}}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ color: '#FF2400', fontWeight: 'bold', fontSize: '1.25rem' }}>
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
          <Typography variant="body2" sx={{ color: 'white', fontSize: '0.775rem' }}>
            info@theuniversalcarwash.ch
          </Typography>
          <Typography variant="body2" sx={{ color: 'white', fontSize: '0.775rem' }}>
          +41 793270036
          </Typography>
        </Box>
      </Paper>
      </div>

      {/* Buttons for PDF and Print */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button variant="contained" color="secondary" onClick={() => window.history.back()}>
          Back
        </Button>
        <Button variant="contained" color="primary" onClick={handleGeneratePDF}>
          Convert to PDF
        </Button>
        <Button variant="contained" color="secondary" onClick={handlePrint}>
          Print Receipt
        </Button>
      </Box>
    </Box>
  );
};

export default BillView;
