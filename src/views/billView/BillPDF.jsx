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

const styles = StyleSheet.create({
  page: {
    padding: '10mm',
    fontFamily: 'Roboto'
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    padding: '4mm',
    marginBottom: '5mm',
    borderRadius: 4
  },
  headerLogo: {
    width: '20mm',
    height: 'auto'
  },
  headerText: {
    color: 'white',
    flex: 1,
    textAlign: 'right',
    fontSize: 10
  },
  billInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '5mm'
  },
  customerInfo: {
    marginBottom: '5mm'
  },
  servicesTable: {
    marginBottom: '5mm'
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#FF0000',
    padding: '2mm',
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold'
  },
  tableRow: {
    flexDirection: 'row',
    padding: '2mm',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    fontSize: 9
  },
  col1: { width: '20%' },
  col2: { width: '30%' },
  col3: { width: '35%' },
  col4: { width: '15%', textAlign: 'right' },
  summary: {
    marginTop: '5mm',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: '2mm'
  },
  total: {
    backgroundColor: '#FF0000',
    padding: '3mm',
    color: 'white',
    marginTop: '3mm',
    borderRadius: 2
  },
  paymentSection: {
    flexDirection: 'row',
    marginTop: '5mm',
    gap: '5mm',
    marginBottom: '5mm'
  },
  qrCode: {
    width: '35%', // Match the web view ratio
    height: 'auto'
  },
  paymentDetails: {
    width: '65%', // Match the web view ratio
    fontSize: 8
  },
  footer: {
    position: 'absolute',
    bottom: '10mm',
    left: '10mm',
    right: '10mm',
    backgroundColor: '#000000',
    padding: '4mm',
    color: 'white',
    borderRadius: 4
  }
});

const BillPDF = ({ formData }) => {
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

  // Split services into chunks of 6 for pagination
  const chunkServices = (vehicles, servicesPerPage = 6) => {
    const allServices = [];
    vehicles?.forEach((vehicle) => {
      vehicle?.services?.forEach((service) => {
        allServices.push({ vehicle, service });
      });
    });

    const chunks = [];
    for (let i = 0; i < allServices.length; i += servicesPerPage) {
      chunks.push(allServices.slice(i, i + servicesPerPage));
    }
    return chunks;
  };

  const serviceChunks = chunkServices(formData?.vehicles);

  return (
    <Document>
      {serviceChunks.map((chunk, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          {/* Header */}
          <View style={styles.header}>
            <Image src={logo} style={styles.headerLogo} />
            <View style={styles.headerText}>
              <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Universal car wash sàrl</Text>
              <Text style={{ fontSize: 8 }}>Rte de Saint-Georges 77, 1213 Petit-Lancy, Geneva</Text>
            </View>
          </View>

          {/* Bill Info - Only on first page */}
          {pageIndex === 0 && (
            <>
              <View style={styles.billInfo}>
                <Text style={{ fontSize: 12, color: '#1976d2', fontWeight: 'bold' }}>Facture n° {formData?.billReference}</Text>
                <View>
                  <Text style={{ fontSize: 8 }}>Date: {formatDate(formData?.serviceDate)}</Text>
                  <Text style={{ fontSize: 8 }}>Échéance: {formatDate(formData?.paymentDueDate)}</Text>
                </View>
              </View>

              {/* Customer Info */}
              <View style={styles.customerInfo}>
                <View style={{ marginBottom: '3mm' }}>
                  <Text style={{ fontSize: 8, color: '#666' }}>Nom</Text>
                  <Text style={{ fontSize: 9, fontWeight: 'bold' }}>{formData?.name}</Text>
                </View>
                <View style={{ marginBottom: '3mm' }}>
                  <Text style={{ fontSize: 8, color: '#666' }}>Adresse</Text>
                  <Text style={{ fontSize: 9 }}>{formData?.customerAddress || 'N/A'}</Text>
                </View>
                <View>
                  <Text style={{ fontSize: 8, color: '#666' }}>Téléphone</Text>
                  <Text style={{ fontSize: 9 }}>{formData?.phoneNumber}</Text>
                </View>
              </View>
            </>
          )}

          {/* Services Table */}
          <View style={styles.servicesTable}>
            <View style={styles.tableHeader}>
              <Text style={styles.col1}>Date du service</Text>
              <Text style={styles.col2}>Véhicule</Text>
              <Text style={styles.col3}>Désignation</Text>
              <Text style={styles.col4}>Montant HT</Text>
            </View>
            {chunk.map((item, index) => (
              <View key={index} style={[styles.tableRow, index % 2 === 0 && { backgroundColor: '#f5f5f5' }]}>
                <Text style={styles.col1}>{formatDate(item?.service?.serviceDate || formData?.serviceDate)}</Text>
                <View style={styles.col2}>
                  <Text style={{ fontWeight: 'bold' }}>{item.vehicle.vehicleType}</Text>
                  <Text style={{ fontSize: 8, color: '#666' }}>{item.vehicle.vehicleNumber}</Text>
                </View>
                <Text style={styles.col3}>{item.service.name}</Text>
                <Text style={styles.col4}>{Number(item.service.price).toFixed(2)} .-CHF</Text>
              </View>
            ))}
          </View>

          {/* Summary - Only on last page */}
          {pageIndex === serviceChunks.length - 1 && (
            <View style={styles.summary}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: '2mm' }}>
                <Text>Sous-total:</Text>
                <Text>{formData?.subTotal.toFixed(2)} .-CHF</Text>
              </View>
              {formData?.discountValue > 0 && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: '2mm' }}>
                  <Text style={{ color: '#f44336' }}>Remise:</Text>
                  <Text style={{ color: '#f44336' }}>-{formData?.discountValue.toFixed(2)} .-CHF</Text>
                </View>
              )}
              <View style={styles.total}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontWeight: 'bold' }}>Net à Payer:</Text>
                  <Text style={{ fontWeight: 'bold' }}>{formData?.total.toFixed(2)} .-CHF</Text>
                </View>
              </View>
            </View>
          )}

          {/* Payment Section - Show on all pages */}
          <View style={styles.paymentSection}>
            <Image src={qrcode} style={styles.qrCode} />
            <View style={styles.paymentDetails}>
              <Text style={{ fontWeight: 'bold', marginBottom: '2mm' }}>Informations de paiement</Text>
              <Text>Compte/Payable à</Text>
              <Text style={{ fontWeight: 'bold', marginBottom: '2mm' }}>CH55 3000 5279 3451 7401 A</Text>
              <Text>Bénéficiaire</Text>
              <Text>Universal Car Wash Sàrl</Text>
              <Text style={{ color: '#666' }}>Route de Saint-Georges 77</Text>
              <Text style={{ color: '#666', marginBottom: '2mm' }}>1213 Petit-Lancy</Text>
              <Text>Référence</Text>
              <Text style={{ fontWeight: 'bold' }}>00 00000 00000 00002 30828 00017</Text>
            </View>
          </View>

          {/* Footer - Show on all pages */}
          <View style={styles.footer}>
            <Text style={{ color: '#FF2400', fontWeight: 'bold', textAlign: 'center', marginBottom: '2mm' }}>
              Merci pour votre confiance !
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 8 }}>info@theuniversalcarwash.ch</Text>
              <Text style={{ fontSize: 8 }}>+41 793270036</Text>
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default BillPDF;
