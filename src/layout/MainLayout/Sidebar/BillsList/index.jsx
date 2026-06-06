import React, { useEffect, useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Divider from '@mui/material/Divider';

// firebase
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from 'utils/firebase.config.jsx';

const BillsList = () => {
  const [bills, setBills] = useState([]);
  const navigate = useNavigate();

  const fetchBills = async () => {
    try {
      const billsCollection = collection(db, 'bills');
      const billsSnapshot = await getDocs(billsCollection);
      const billsList = billsSnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setBills(billsList);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch bills:', error);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleView = (bill) => {
    navigate('/bill-view', { state: { formData: bill, readOnly: true } });
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, 'bills', id));
      fetchBills();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to delete bill:', error);
    }
  };

  if (!bills || bills.length === 0) return null;

  return (
    <Fragment>
      <Divider sx={{ mt: 1.25, mb: 1 }} />
      <List
        dense
        subheader={
          <ListSubheader disableSticky component="div">
            Bills
          </ListSubheader>
        }
      >
        {bills.map((bill) => (
          <ListItemButton key={bill.id} onClick={() => handleView(bill)} sx={{ py: 0.75 }}>
            <ListItemText
              primary={bill.customerName || bill.bookingId || bill.id}
              secondary={
                bill.totalAmount !== undefined
                  ? `₹${bill.totalAmount} • ${new Date(bill.date || Date.now()).toLocaleDateString()}`
                  : new Date(bill.date || Date.now()).toLocaleDateString()
              }
            />
            <IconButton edge="end" color="error" aria-label="delete" onClick={(e) => handleDelete(e, bill.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </ListItemButton>
        ))}
      </List>
    </Fragment>
  );
};

export default BillsList;
