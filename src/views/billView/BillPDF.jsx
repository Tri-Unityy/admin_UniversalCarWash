import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import logo from '../../assets/images/Carwash.png';
import qrcode from '../../assets/images/QRCODE.jpg';

// Register fonts if needed
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', fontWeight: 300 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf', fontWeight: 500 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 }
  ]
});

const BRAND_RED = '#CC1F2A';
const PURE_BLACK = '#000000';
const PURE_WHITE = '#FFFFFF';
const LIGHT_GREY = '#F2F2F2';
const BORDER_GREY = '#D9D9D9';

const styles = StyleSheet.create({
  page: {
    padding: '10mm',
    paddingBottom: '30mm',
    fontFamily: 'Roboto',
    color: PURE_BLACK
  },
  header: {
    flexDirection: 'row',
    backgroundColor: PURE_BLACK,
    marginBottom: '5mm',
    borderRadius: 4
  },
  headerLogo: {
    width: '40mm'
  },
  headerText: {
    color: PURE_WHITE,
    flex: 1,
    textAlign: 'right',
    fontSize: 10,
    padding: '4mm'
  },
  billInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '5mm'
  },
  devisInfo: {
    width: '100%',
    paddingVertical: 5,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },

  devisTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: 'black',
    letterSpacing: 2
  },
  customerInfo: {
    marginBottom: '5mm'
  },
  servicesTable: {
    marginBottom: '5mm'
  },
  tableOuter: {
    borderWidth: 1,
    borderColor: BORDER_GREY,
    borderRadius: 3
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: BRAND_RED,
    padding: '2mm',
    color: PURE_WHITE,
    fontSize: 9,
    fontWeight: 'bold',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3
  },
  tableRow: {
    flexDirection: 'row',
    padding: '2mm',
    borderBottomWidth: 1,
    borderBottomColor: BORDER_GREY,
    fontSize: 9
  },
  col1: { width: '20%' },
  col2: { width: '30%' },
  col3: { width: '35%' },
  col4: { width: '15%', textAlign: 'right' },
  summary: {
    marginTop: '5mm',
    borderTopWidth: 1,
    borderTopColor: BORDER_GREY,
    paddingTop: '2mm'
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '1.5mm'
  },
  summaryText: {
    fontSize: 10
  },

  total: {
    backgroundColor: BRAND_RED,
    paddingVertical: '1mm',
    paddingHorizontal: '2mm',
    marginTop: '1.5mm',
    borderRadius: 2,
    color: PURE_WHITE
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  totalLabel: {
    fontWeight: 'bold',
    fontSize: 12
  },
  totalValue: {
    fontWeight: 'bold',
    fontSize: 12
  },
  paymentSection: {
    flexDirection: 'row',
    marginTop: '5mm',
    marginBottom: 0
  },
  qrCode: {
    width: '35%',
    height: 'auto',
    marginRight: '5mm'
  },
  paymentDetails: {
    width: '65%',
    fontSize: 8
  },
  footer: {
    position: 'absolute',
    bottom: '10mm',
    left: '10mm',
    right: '10mm',
    backgroundColor: PURE_BLACK,
    padding: '4mm',
    color: PURE_WHITE,
    borderRadius: 4
  }
});

const BillPDF = ({ formData, isDevisBill = false, showQR = false, showRappel = false }) => {
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
    return new Intl.DateTimeFormat('fr-CH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(d);
  };

  // Flatten services so they naturally flow across pages
  const getAllServices = (vehicles) => {
    const list = [];
    vehicles?.forEach((vehicle) => {
      vehicle?.services?.forEach((service) => list.push({ vehicle, service }));
    });
    return list;
  };

  const allServices = getAllServices(formData?.vehicles);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header — fixed on all pages */}
        <View style={styles.header} fixed>
          <Image src={logo} style={styles.headerLogo} />
          <View style={styles.headerText}>
            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Universal Car Wash Sàrl</Text>
            <Text style={{ fontSize: 8 }}>Rte de Saint-Georges 77, 1213 Petit-Lancy, GE</Text>
          </View>
        </View>

        {showRappel && (
          <View style={styles.devisInfo}>
            <Text style={styles.devisTitle}>RAPPEL</Text>
          </View>
        )}

        {/* Devis header: black, centered (estimation bill) */}
        {isDevisBill && (
          <View style={[styles.devisInfo, { borderColor: PURE_BLACK, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
            <View style={{ flex: 1 }} />
            <Text style={[styles.devisTitle, { color: PURE_BLACK, fontSize: 28 }]}>Devis</Text>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 9, color: PURE_BLACK }}>Date : {formatDate(formData?.bookingdate || formData?.bookingDate)}</Text>
            </View>
          </View>
        )}

        {/* Bill Info: for completed bills show Facture n°, Date, Échéance; for Devis (estimation) hide them */}
        <View style={styles.billInfo}>
          {!isDevisBill && (
            <Text style={{ fontSize: 12, color: BRAND_RED, fontWeight: 'bold' }}>N° client {formData?.customerReference}</Text>
          )}
          <View>
            {!isDevisBill && (
              <>
                <Text style={{ fontSize: 8 }}>Date : {formatDate(formData?.serviceDate)}</Text>
                <Text style={{ fontSize: 8 }}>Échéance : {formatDate(formData?.paymentDueDate)}</Text>
                <Text style={{ fontSize: 12, color: BRAND_RED, fontWeight: 'bold' }}>Facture n° {formData?.billReference}</Text>
              </>
            )}
          </View>
        </View>

        <View style={styles.customerInfo}>
          <View style={{ marginBottom: '3mm' }}>
            <Text style={{ fontSize: 8, color: '#666666' }}>Nom</Text>
            <Text style={{ fontSize: 9, fontWeight: 'bold' }}>{formData?.name}</Text>
          </View>
          {!isDevisBill && (
            <View style={{ marginBottom: '3mm' }}>
              <Text style={{ fontSize: 8, color: '#666666' }}>N° Client</Text>
              <Text style={{ fontSize: 9 }}>{formData?.customerReference || 'N/A'}</Text>
            </View>
          )}
          <View style={{ marginBottom: '3mm' }}>
            <Text style={{ fontSize: 8, color: '#666666' }}>Adresse</Text>
            <Text style={{ fontSize: 9 }}>{formData?.customerAddress || 'N/A'}</Text>
          </View>
          <View>
            <Text style={{ fontSize: 8, color: '#666666' }}>Téléphone</Text>
            <Text style={{ fontSize: 9 }}>{formData?.phoneNumber}</Text>
          </View>
        </View>

        {/* Services Table: hide "Date du service" column for Devis (estimation) */}
        <View style={styles.servicesTable}>
          <View style={styles.tableOuter}>
            <View style={styles.tableHeader}>
              {!isDevisBill && <Text style={styles.col1}>Date du service</Text>}
              <Text style={styles.col2}>Véhicule</Text>
              <Text style={styles.col3}>Désignation</Text>
              <Text style={styles.col4}>Montant HT</Text>
            </View>

            {allServices.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.tableRow,
                  index % 2 === 0 && { backgroundColor: LIGHT_GREY },
                  index === allServices.length - 1 && { borderBottomWidth: 0 }
                ]}
                wrap={false}
              >
                {!isDevisBill && (
                  <Text style={styles.col1}>{formatDate(item?.service?.serviceDate || formData?.serviceDate)}</Text>
                )}
                <View style={styles.col2}>
                  <Text style={{ fontWeight: 'bold' }}>{item.vehicle.vehicleType}</Text>
                  <Text style={{ fontSize: 8, color: '#666666' }}>{item.vehicle.vehicleNumber}</Text>
                </View>
                <Text style={styles.col3}>{item.service.name}</Text>
                <Text style={styles.col4}>{Number(item.service.price).toFixed(2)} CHF</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Summary (naturally lands on last page after services) */}
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Sous-total :</Text>
            <Text style={styles.summaryText}>{formData?.subTotal.toFixed(2)} CHF</Text>
          </View>

          {formData?.discountValue > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryText, { color: BRAND_RED }]}>Remise :</Text>
              <Text style={[styles.summaryText, { color: BRAND_RED }]}>-{formData?.discountValue.toFixed(2)} CHF</Text>
            </View>
          )}

          <View style={styles.total}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Net à payer (TTC) </Text>
              <Text style={styles.totalValue}>{formData?.total.toFixed(2)} CHF</Text>
            </View>
          </View>
        </View>

        {/* Spacer pushes QR/payment to bottom of final page */}
        <View style={{ flexGrow: 1 }} />

        {/* Payment Section — only for invoices; Devis never shows QR */}
        {showQR && !isDevisBill && (
          <View style={styles.paymentSection}>
            <Image src={qrcode} style={styles.qrCode} />
            <View style={styles.paymentDetails}>
              <Text style={{ fontWeight: 'bold', marginBottom: '2mm' }}>Informations de paiement</Text>
              <Text>Compte/Payable à</Text>
              <Text style={{ fontWeight: 'bold', marginBottom: '2mm' }}>CH55 3000 5279 3451 7401 A</Text>
              <Text>Bénéficiaire</Text>
              <Text>Universal Car Wash Sàrl</Text>
              <Text style={{ color: '#666666' }}>Route de Saint-Georges 77</Text>
              <Text style={{ color: '#666666', marginBottom: '2mm' }}>1213 Petit-Lancy</Text>
              <Text>Référence</Text>
              <Text style={{ fontWeight: 'bold' }}>00 00000 00000 00002 30828 00017</Text>
            </View>
          </View>
        )}

        {/* Footer — fixed on every page with left/center/right alignment */}
        <View style={styles.footer} fixed>
          {/* Top tagline (centered) */}
          <View style={{ alignItems: 'center', marginBottom: 4 }}>
            <Text style={{ color: '#FF2400', fontWeight: 'bold', fontSize: 10 }}>Merci pour votre confiance !</Text>
          </View>

          {/* Divider */}
          <View style={{ height: 1, backgroundColor: '#666666', marginBottom: 4 }} />

          {/* Three equal columns: email (left), phone (center), page (right) */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 8, color: '#FFFFFF', flex: 1, textAlign: 'left' }}>info@theuniversalcarwash.ch</Text>

            <Text style={{ fontSize: 8, color: '#FFFFFF', flex: 1, textAlign: 'center' }}>+41 793270036</Text>

            <Text
              style={{ fontSize: 8, color: '#FFFFFF', flex: 1, textAlign: 'right' }}
              render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`}
            />
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default BillPDF;
