// billview.js
import React, { useRef, useState } from 'react';
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
  Container,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { PictureAsPdf as PdfIcon, Print as PrintIcon, ArrowBack as BackIcon, Receipt as ReceiptIcon } from '@mui/icons-material';
import logo from '../../assets/images/Carwash.png';
import qrcode from '../../assets/images/QRCODE.jpg';
import { useLocation } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import BillPDF from './BillPDF';

const BRAND_RED = '#CC1F2A';

const BillView = () => {
  const location = useLocation();
  // Support both: state = bill (from bills list) and state = { formData: bill, readOnly } (from sidebar)
  const formData = location.state?.formData ?? location.state ?? {};
  const isDevisBill = formData?.isDevisBill === true;
  const isRappelEligible = !isDevisBill; // Rappel = reminder for completed bills only
  console.log('Received Form Data:', formData);

  const billRef = useRef();
  const buttonRef = useRef(null);

  // NEW: toggle to include QR in the downloaded PDF
  const [showQR, setShowQR] = useState(false);
  const [showRappel, setShowRappel] = useState(false);

  // Chunk services into pages of 6 services each
  const chunkServices = (vehicles, servicesPerPage = 6) => {
    const allServices = [];
    vehicles?.forEach((vehicle) => {
      vehicle?.services?.forEach((service) => {
        allServices.push({
          vehicle,
          service
        });
      });
    });

    const chunks = [];
    for (let i = 0; i < allServices.length; i += servicesPerPage) {
      chunks.push(allServices.slice(i, i + servicesPerPage));
    }
    return chunks;
  };

  const serviceChunks = chunkServices(formData?.vehicles);

  const toSafeDate = (value) => {
    if (!value) return null;
    try {
      if (value?.toDate) return value.toDate();
      if (typeof value === 'number') return new Date(value);
      const parsed = new Date(value);
      return isNaN(parsed.getTime()) ? null : parsed;
    } catch (_) {
      return null;
    }
  };

  const formatDate = (value) => {
    const d = toSafeDate(value);
    if (!d) return '—';
    return new Intl.DateTimeFormat('fr-CH', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
  };

  const handlePrint = () => {
    window.print();
  };

  // Reusable Header Component
  const BillHeader = () => (
    <Box
      className="print-bg"
      sx={{
        bgcolor: 'black',
        color: 'white',
        p: { xs: 1, sm: 1.5 },
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        flexWrap: 'wrap',
        borderRadius: 1,
        mb: 1
      }}
    >
      <Box sx={{ flexShrink: 0 }}>
        <img src={logo} alt="Company Logo" style={{ width: '100%', maxWidth: '150px', height: 'auto' }} />
      </Box>
      <Box sx={{ flexGrow: 1, textAlign: { xs: 'left', sm: 'right' } }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: { xs: '0.8rem', sm: '0.9rem' }, mb: 0.2, color: 'white' }}>
          Universal car wash sàrl
        </Typography>
        <Typography variant="caption" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, color: 'white', opacity: 0.9 }}>
          Rte de Saint-Georges 77, 1213 Petit-Lancy, GE
        </Typography>
      </Box>
    </Box>
  );

  // Reusable Footer Component (with page numbers)
  const BillFooter = ({ pageNumber, totalPages }) => (
    <Box className="print-bg bill-footer" sx={{ bgcolor: 'black', color: 'white', p: { xs: 1, sm: 1.5 }, mt: 1, borderRadius: 1 }}>
      <Box sx={{ textAlign: 'center', mb: 0.5 }}>
        <Typography variant="subtitle1" sx={{ color: '#FF2400', fontWeight: 700, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
          Merci pour votre confiance !
        </Typography>
      </Box>
      <Divider sx={{ my: 0.5, bgcolor: 'grey.600' }} />

      {/* 3 equal columns: left (email), center (phone), right (page) */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 0.5, sm: 0 }
        }}
      >
        <Box sx={{ flex: 1, textAlign: 'left' }}>
          <Typography variant="caption" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, color: 'white', opacity: 0.9 }}>
            info@theuniversalcarwash.ch
          </Typography>
        </Box>

        <Box sx={{ flex: 1, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, color: 'white', opacity: 0.9 }}>
            +41 793270036
          </Typography>
        </Box>

        <Box sx={{ flex: 1, textAlign: 'right' }}>
          <Typography variant="caption" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, color: 'white', opacity: 0.9 }}>
            Page {pageNumber} / {totalPages}
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  // Reusable Payment Information Component
  const PaymentInformation = () => (
    <Box
      className="payment-section"
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        mt: 1
      }}
    >
      {/* QR Code */}
      <Box sx={{ flex: '0 0 auto', width: '35%' }}>
        <Card variant="outlined" sx={{ p: 0.5, boxShadow: 0 }}>
          <CardContent sx={{ textAlign: 'center', p: 0.5 }}>
            <Typography variant="caption" sx={{ mb: 0.5, fontWeight: 600, fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
              Code QR de paiement
            </Typography>
            <img src={qrcode} alt="QR Code de paiement" style={{ width: '100%', height: 'auto' }} />
          </CardContent>
        </Card>
      </Box>
      {/* Payment Details */}
      <Box sx={{ flex: '1 1 auto', width: '65%' }}>
        <Card variant="outlined" sx={{ height: 'fit-content', boxShadow: 0 }}>
          <CardContent sx={{ p: 0.8 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main', mb: 1, fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
              Informations de paiement
            </Typography>
            <Stack spacing={0.5}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                  Compte/Payable à
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 600, mt: 0.1, display: 'block', fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
                  CH55 3000 5279 3451 7401 A
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                  Bénéficiaire
                </Typography>
                <Stack sx={{ mt: 0.1 }}>
                  <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
                    Universal Car Wash Sàrl
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem' } }}>
                    Route de Saint-Georges 77
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem' } }}>
                    1213 Petit-Lancy
                  </Typography>
                </Stack>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                  Référence
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 600, mt: 0.1, display: 'block', fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
                  00 00000 00000 00002 30828 00017
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                  Informations supplémentaires
                </Typography>
                <Typography variant="caption" sx={{ mt: 0.1, display: 'block', fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
                  Numéro 23082800017
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Print-specific CSS to keep .no-break on one page */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .page-break {
            break-after: always !important;
            page-break-after: always !important;
          }
          .no-break {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          .print-bg {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            margin: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .MuiContainer-root {
            padding: 4px !important;
            max-width: none !important;
          }
          .MuiPaper-root {
            padding: 6px !important;
            margin: 0 !important;
            box-shadow: none !important;
          }
          /* Fixed A4 page box */
          .bill-page {
            width: 210mm !important;
            height: 297mm !important;
            min-height: 297mm !important;
            max-height: 297mm !important;
            display: flex !important;
            flex-direction: column !important;
            box-sizing: border-box !important;
            position: relative !important;
            overflow: hidden !important;
            page-break-after: always !important;
            padding: 10mm !important;
          }
          /* Fixed positions for header and footer */
          .bill-header {
            position: relative !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            height: 28mm !important;
            min-height: 28mm !important;
            max-height: 28mm !important;
            margin-bottom: 10mm !important;
          }
          /* Content area with fixed height */
          .services-section {
            position: relative !important;
            flex: none !important;
            height: 135mm !important;
            min-height: 135mm !important;
            max-height: 135mm !important;
            overflow: visible !important;
          }
          /* Fixed bottom section */
          .bottom-section {
            position: absolute !important;
            bottom: 10mm !important;
            left: 10mm !important;
            right: 10mm !important;
            height: 94mm !important;
          }
          .payment-section {
            height: 70mm !important;
            min-height: 70mm !important;
            max-height: 70mm !important;
          }
          .bill-footer {
            height: 24mm !important;
            min-height: 24mm !important;
            max-height: 24mm !important;
          }
          /* Ensure table doesn't overflow */
          .MuiTableContainer-root {
            overflow: visible !important;
          }
          /* Force page breaks */
          .bill-page:not(:last-child) {
            page-break-after: always !important;
          }
        }
        @media screen {
          .bill-page {
            min-height: auto;
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

          {/* QR option only for non-Devis (invoices); Devis never shows QR */}
          {!isDevisBill && (
            <FormControlLabel
              control={<Checkbox checked={showQR} onChange={(e) => setShowQR(e.target.checked)} color="primary" />}
              label="Inclure le QR dans le PDF"
            />
          )}

          {isRappelEligible && (
            <FormControlLabel
              control={<Checkbox checked={showRappel} onChange={(e) => setShowRappel(e.target.checked)} color="primary" />}
              label="Rappel Bill"
            />
          )}

          <PDFDownloadLink
            document={<BillPDF formData={formData} isDevisBill={isDevisBill} showQR={showQR} showRappel={showRappel} />}
            fileName={`Bill_${formData?.billReference || 'invoice'}.pdf`}
          >
            {({ blob, url, loading, error }) => (
              <Button
                variant="contained"
                startIcon={<PdfIcon />}
                disabled={loading}
                sx={{ borderRadius: 2, bgcolor: 'error.main', '&:hover': { bgcolor: 'error.dark' }, px: { xs: 2, sm: 3 } }}
              >
                {loading ? 'Chargement...' : 'Convertir en PDF'}
              </Button>
            )}
          </PDFDownloadLink>
        </Box>

        {/* Paginated Bill Content */}
        <Box ref={billRef}>
          {serviceChunks.map((serviceChunk, pageIndex) => (
            <Paper
              key={pageIndex}
              elevation={1}
              className={pageIndex < serviceChunks.length - 1 ? 'page-break bill-page' : 'bill-page'}
              sx={{
                overflow: 'hidden',
                borderRadius: 2,
                '@media print': { boxShadow: 'none', borderRadius: 0 },
                p: { xs: 1, sm: 2 },
                mb: pageIndex < serviceChunks.length - 1 ? 2 : 0,
                display: 'flex',
                flexDirection: 'column',
                minHeight: pageIndex === serviceChunks.length - 1 ? { xs: '297mm', sm: '297mm' } : 'auto'
              }}
            >
              {/* Header */}
              <BillHeader />

              {/* Devis section: title centered, booking date on the right (same as BillPDF) */}
              {pageIndex === 0 && isDevisBill && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1.5,
                    mb: 0.5
                  }}
                >
                  <Box sx={{ flex: 1 }} />
                  <Typography variant="h1" sx={{ fontWeight: 500, color: 'black', letterSpacing: 1, fontSize: '60px' }}>
                    Devis
                  </Typography>
                  <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <Typography variant="caption" sx={{ color: 'black', fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                      Date : {formatDate(formData?.bookingdate || formData?.bookingDate)}
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Bill Info - Only on first page */}
              {pageIndex === 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 0.5,
                    mb: 1
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {!isDevisBill && <ReceiptIcon color="primary" fontSize="small" />}
                    {!isDevisBill && (
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, color: 'primary.main', fontSize: { xs: '0.9rem', sm: '1rem' } }}
                      >
                        Facture n° {formData?.billReference}
                      </Typography>
                    )}
                  </Box>
                  <Stack spacing={0.2} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                    {!isDevisBill && (
                      <>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
                          Date: {formatDate(formData?.serviceDate)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
                          Échéance: {formatDate(formData?.paymentDueDate)}
                        </Typography>
                      </>
                    )}
                  </Stack>
                </Box>
              )}

              {/* Customer Details - Only on first page */}
              {pageIndex === 0 && (
                <Grid container spacing={0.5} sx={{ mb: 1 }}>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={0.2}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontWeight: 500, fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
                      >
                        Nom
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                        {formData?.name}
                      </Typography>
                      {!isDevisBill && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontWeight: 500, fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
                        >
                          N° Client
                        </Typography>
                      )}
                      <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                        {formData?.customerReference || 'N/A'}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={0.2}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontWeight: 500, fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
                      >
                        Adresse
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                        {formData?.customerAddress || 'N/A'}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontWeight: 500, fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
                      >
                        Téléphone
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                        {formData?.phoneNumber}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              )}

              {/* Services Table for this page */}
              <Box className="services-section" sx={{ flexGrow: 1 }}>
                <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: BRAND_RED }}>
                          {!isDevisBill && (
                            <TableCell
                              sx={{ fontWeight: 700, color: 'white', fontSize: { xs: '0.7rem', sm: '0.8rem' }, py: 0.5, width: '20%' }}
                            >
                              Date du service
                            </TableCell>
                          )}
                          <TableCell
                            sx={{ fontWeight: 700, color: 'white', fontSize: { xs: '0.7rem', sm: '0.8rem' }, py: 0.5, width: '30%' }}
                          >
                            Véhicule
                          </TableCell>
                          <TableCell
                            sx={{ fontWeight: 700, color: 'white', fontSize: { xs: '0.7rem', sm: '0.8rem' }, py: 0.5, width: '35%' }}
                          >
                            Désignation
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ fontWeight: 700, color: 'white', fontSize: { xs: '0.7rem', sm: '0.8rem' }, py: 0.5, width: '15%' }}
                          >
                            Montant HT
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {serviceChunk.map((item, index) => (
                          <TableRow key={index} sx={{ '&:nth-of-type(odd)': { bgcolor: 'grey.50' } }}>
                            {!isDevisBill && (
                              <TableCell sx={{ py: 0.3 }}>
                                <Typography variant="body2" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
                                  {formatDate(item?.service?.serviceDate || formData?.serviceDate)}
                                </Typography>
                              </TableCell>
                            )}
                            <TableCell sx={{ py: 0.3 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
                                {item.vehicle.vehicleType}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' } }}>
                                {item.vehicle.vehicleNumber}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ py: 0.3 }}>
                              <Typography variant="body2" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
                                {item.service.name}
                              </Typography>
                            </TableCell>
                            <TableCell align="right" sx={{ py: 0.3 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
                                {item.service.price.toFixed(2)} CHF
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Box>

              {/* Bill Summary and Payment Information */}
              <Box
                className="bottom-section"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  minHeight: { xs: 0, print: '94mm' }
                }}
              >
                {/* Summary + Payment (when QR shown); spacer below pushes footer to bottom */}
                <Box sx={{ flex: '0 0 auto' }}>
                  {/* Show Bill Summary only on last page */}
                  {pageIndex === serviceChunks.length - 1 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          py: 0.3,
                          borderBottom: '1px solid',
                          borderColor: 'divider'
                        }}
                      >
                        <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                          Sous-total:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                          {formData?.subTotal} CHF
                        </Typography>
                      </Box>
                      {formData?.discountValue > 0 && (
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            py: 0.3,
                            borderBottom: '1px solid',
                            borderColor: 'divider'
                          }}
                        >
                          <Typography variant="body2" color="error.main" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                            Remise:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: { xs: '0.8rem', sm: '0.9rem' } }} color="error.main">
                            -{formData?.discountValue} CHF
                          </Typography>
                        </Box>
                      )}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          py: 0.7,
                          bgcolor: BRAND_RED,
                          color: 'white',
                          borderRadius: 1,
                          px: 1.5
                        }}
                      >
                        <Typography variant="body1" sx={{ fontWeight: 700, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                          Net à Payer TTC
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                          {formData?.total} CHF
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {/* Show Payment Information only on the last page; Devis never shows QR/payment */}
                  {pageIndex === serviceChunks.length - 1 && !isDevisBill && <PaymentInformation />}
                </Box>

                {/* Spacer: keeps footer at bottom of page when QR is hidden */}
                <Box sx={{ flex: 1, minHeight: 0 }} />

                {/* Footer on all pages with page numbers — always at bottom */}
                <BillFooter pageNumber={pageIndex + 1} totalPages={serviceChunks.length} />
              </Box>
            </Paper>
          ))}
        </Box>
      </Container>
    </>
  );
};

export default BillView;
