import React, { useRef } from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Divider, 
  Button, 
  TableContainer, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow,
  Card,
  CardContent,
  Stack,
  Chip,
  Container
} from "@mui/material";
import { 
  PictureAsPdf as PdfIcon, 
  Print as PrintIcon, 
  ArrowBack as BackIcon,
  Receipt as ReceiptIcon 
} from '@mui/icons-material';
import logo from "../../assets/images/Carwash.png";
import qrcode from "../../assets/images/QRCODE.jpg";
import { useLocation } from 'react-router-dom';
import html2pdf from "html2pdf.js";

const BillView = () => {
  const location = useLocation();
  const formData = location.state;
  console.log('Received Form Data:', formData);

  const billRef = useRef();
  const buttonRef = useRef(null);
  
  const handleGeneratePDF = () => {
    const element = billRef.current;
    if (buttonRef.current) {
      buttonRef.current.style.display = 'none';
    }
    const options = {
      margin: 0.3,
      filename: `Bill_${formData.id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf()
      .set(options)
      .from(element)
      .save()
      .then(() => {
        if (buttonRef.current) {
          buttonRef.current.style.display = 'flex';
        }
      });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Print-specific CSS to keep .no-break on one page */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .no-break {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          .payment-break {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          .print-bg {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Ensure entire bill fits on one page */
          body {
            margin: 0 !important;
          }
          .MuiContainer-root {
            padding: 8px !important;
            max-width: none !important;
          }
          .MuiPaper-root {
            padding: 8px !important;
            margin: 0 !important;
          }
        }
      `}</style>
      <Container maxWidth="md" sx={{ py: { xs: 1, sm: 2 } }}>
        {/* Action Buttons - Outside Print Area */}
        <Box
          ref={buttonRef}
          className="no-print"
          sx={{
            mb: 1,
            display: 'flex',
            justifyContent: 'center',
            gap: { xs: 1, sm: 2 },
            flexWrap: 'wrap',
            '@media print': {
              display: 'none'
            }
          }}
        >
          <Button 
            variant="outlined" 
            startIcon={<BackIcon />} 
            onClick={() => window.history.back()}
            sx={{ borderRadius: 2, px: { xs: 2, sm: 3 } }}
          >
            Retour
          </Button>
          <Button 
            variant="contained" 
            startIcon={<PdfIcon />} 
            onClick={handleGeneratePDF}
            sx={{ borderRadius: 2, bgcolor: 'error.main', '&:hover': { bgcolor: 'error.dark' }, px: { xs: 2, sm: 3 } }}
          >
            Convertir en PDF
          </Button>
          <Button 
            variant="contained" 
            startIcon={<PrintIcon />} 
            onClick={handlePrint}
            sx={{ borderRadius: 2, bgcolor: 'success.main', '&:hover': { bgcolor: 'success.dark' }, px: { xs: 2, sm: 3 } }}
          >
            Imprimer
          </Button>
        </Box>

        {/* Main Bill Content: Company Header to Bill Summary (no-break) */}
        <Paper ref={billRef} elevation={1} sx={{ overflow: 'hidden', borderRadius: 2, '@media print': { boxShadow: 'none', borderRadius: 0 }, minHeight: 'auto', p: { xs: 1, sm: 2 } }}>
          <Grid container direction="column" spacing={1} className="no-break" sx={{ minHeight: 'auto' }}>
            {/* Company Header */}
            <Grid item>
              <Box className="print-bg" sx={{ bgcolor: 'black', color: 'white', p: { xs: 1, sm: 1.5 }, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', borderRadius: 1 }}>
                <Box sx={{ flexShrink: 0 }}>
                  <img src={logo} alt="Company Logo" style={{ width: '100%', maxWidth: '90px', height: 'auto' }} />
                </Box>
                <Box sx={{ flexGrow: 1, textAlign: { xs: 'left', sm: 'right' } }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: { xs: '0.85rem', sm: '0.95rem' }, mb: 0.2, color: 'white' }}>
                    Universal car wash sàrl
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' }, color: 'white', opacity: 0.9 }}>
                    Rte de Saint-Georges 77, 1213 Petit-Lancy, Geneva
                  </Typography>
                </Box>
              </Box>
            </Grid>
            {/* Bill Info */}
            <Grid item>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 0.5, px: { xs: 0, sm: 0.5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <ReceiptIcon color="primary" fontSize="small" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main', fontSize: { xs: '0.95rem', sm: '1.05rem' } }}>
                    Facture n° {formData?.billReference}
                  </Typography>
                </Box>
                <Stack spacing={0.2} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                  <Typography variant="caption" color="text.secondary">
                    Date: {new Intl.DateTimeFormat('fr-CH', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(formData?.serviceDate))}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Échéance: {new Intl.DateTimeFormat('fr-CH', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(formData?.paymentDueDate))}
                  </Typography>
                </Stack>
              </Box>
            </Grid>
            {/* Customer Details */}
            <Grid item>
              <Grid container spacing={0.5}>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={0.2}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>Nom</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{formData?.name}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>Référence client</Typography>
                    <Typography variant="body2">{formData?.customerReference || 'N/A'}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>Date du service</Typography>
                    <Typography variant="body2">{new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(formData?.serviceDate))}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={0.2}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>Adresse</Typography>
                    <Typography variant="body2">{formData?.customerAddress || 'N/A'}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>Téléphone</Typography>
                    <Typography variant="body2">{formData?.phoneNumber}</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
            {/* Services Table */}
            <Grid item>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'primary.main' }}>
                      <TableCell sx={{ fontWeight: 700, color: 'white', fontSize: { xs: '0.7rem', sm: '0.8rem' }, py: 0.5 }}>Véhicule</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'white', fontSize: { xs: '0.7rem', sm: '0.8rem' }, py: 0.5 }}>Service</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: 'white', fontSize: { xs: '0.7rem', sm: '0.8rem' }, py: 0.5 }}>Tarif (CHF)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData?.vehicles?.map((vehicle, vIndex) =>
                      vehicle?.services?.map((service, sIndex) => (
                        <TableRow key={`${vIndex}-${sIndex}`} sx={{ '&:nth-of-type(odd)': { bgcolor: 'grey.50' } }}>
                          <TableCell sx={{ py: 0.3 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>{vehicle.vehicleType}</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' } }}>{vehicle.vehicleNumber}</Typography>
                          </TableCell>
                          <TableCell sx={{ py: 0.3 }}>
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>{service.name}</Typography>
                          </TableCell>
                          <TableCell align="right" sx={{ py: 0.3 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>{service.price} CHF</Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            {/* Bill Summary */}
            <Grid item>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="body2">Sous-total:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{formData?.subTotal} CHF</Typography>
                </Box>
                {formData?.discountValue > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2" color="error.main">Remise:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }} color="error.main">-{formData?.discountValue} CHF</Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.7, bgcolor: 'primary.main', color: 'white', borderRadius: 1, px: 1.5 }}>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>Total Final:</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{formData?.total} CHF</Typography>
                </Box>
              </Box>
            </Grid>
             {/* Payment Information Section (always new page, compact) */}
          <Box className="payment-break" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 2, md: 3 }, p: { xs: 1, sm: 2 }, mt: 1 }}>
            {/* QR Code */}
            <Box sx={{ flex: 1, display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <Card variant="outlined" sx={{ p: 1, maxWidth: 250, boxShadow: 0 }}>
                <CardContent sx={{ textAlign: 'center', p: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Code QR de paiement</Typography>
                  <img src={qrcode} alt="QR Code de paiement" style={{ width: '100%', maxWidth: '250px', height: 'auto' }} />
                </CardContent>
              </Card>
            </Box>
            {/* Payment Details */}
            <Box sx={{ flex: 1 }}>
              <Card variant="outlined" sx={{ height: 'fit-content', boxShadow: 0 }}>
                <CardContent sx={{ p: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>Informations de paiement</Typography>
                  <Stack spacing={0.7}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>Compte/Payable à</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.2 }}>CH55 3000 5279 3451 7401 A</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>Bénéficiaire</Typography>
                      <Stack sx={{ mt: 0.2 }}>
                        <Typography variant="body2">Universal Car Wash Sàrl</Typography>
                        <Typography variant="caption" color="text.secondary">Route de Saint-Georges 77</Typography>
                        <Typography variant="caption" color="text.secondary">1213 Petit-Lancy</Typography>
                      </Stack>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>Référence</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.2 }}>00 00000 00000 00002 30828 00017</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>Informations supplémentaires</Typography>
                      <Typography variant="body2" sx={{ mt: 0.2 }}>Numéro 23082800017</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          </Box>
            {/* Footer */}
            <Grid item>
              <Box className="print-bg" sx={{ bgcolor: 'black', color: 'white', p: { xs: 1, sm: 1.5 }, mt: 1, borderRadius: 1 }}>
                <Box sx={{ textAlign: 'center', mb: 0.5 }}>
                  <Typography variant="subtitle1" sx={{ color: '#FF2400', fontWeight: 700, fontSize: { xs: '1rem', sm: '1.1rem' } }}>Merci pour votre confiance !</Typography>
                </Box>
                <Divider sx={{ my: 0.5, bgcolor: 'grey.600' }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 0.5, sm: 0 }, textAlign: { xs: 'center', sm: 'left' } }}>
                  <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' }, color: 'white', opacity: 0.9 }}>info@theuniversalcarwash.ch</Typography>
                  <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' }, color: 'white', opacity: 0.9 }}>+41 793270036</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

         
        </Paper>
      </Container>
    </>
  );
};

export default BillView;
