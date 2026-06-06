import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import { subscribeToBills, deleteBill } from '../../../api/bills';

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

const BillsList = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = subscribeToBills(
      (items) => {
        setBills(items);
        setLoading(false);
      },
      (e) => {
        setError('Failed to load bills');
        // eslint-disable-next-line no-console
        console.error(e);
        setLoading(false);
      }
    );
    return () => unsub && unsub();
  }, []);

  const handleOpenBill = (bill) => {
    navigate('/bill-view', { state: bill });
  };

  const handleDelete = async (e, bill) => {
    e.stopPropagation();
    try {
      await deleteBill(bill);
    } catch (err) {
      setError('Failed to delete bill');
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  return (
    <>
      <List
        dense
        sx={{ pt: 0 }}
        subheader={
          <ListSubheader component="div" disableSticky>
            <Typography variant="caption" sx={{ textTransform: 'uppercase', opacity: 0.7 }}>
              Bills
            </Typography>
          </ListSubheader>
        }
      >
        {loading && (
          <Box sx={{ py: 1.5, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress size={18} />
          </Box>
        )}
        {!loading && error && (
          <Box sx={{ py: 1.5, display: 'flex', justifyContent: 'center' }}>
            <Typography variant="caption" color="error">
              {error}
            </Typography>
          </Box>
        )}
        {!loading && !error && bills.length === 0 && (
          <Box sx={{ py: 1.0, display: 'flex', justifyContent: 'center' }}>
            <Typography variant="caption">No bills</Typography>
          </Box>
        )}
        {!loading &&
          !error &&
          bills.map((bill) => (
            <ListItemButton key={bill.id} onClick={() => handleOpenBill(bill)} sx={{ borderRadius: 1 }}>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {bill.billReference || bill.bookingId || bill.id}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {(bill.name || bill.customerName || 'Customer') +
                      ' • ' +
                      (toSafeDate(bill.date || bill.serviceDate || Date.now())?.toLocaleDateString('fr-CH') || '—')}
                  </Typography>
                }
              />
              <Stack direction="row" alignItems="center" spacing={0.5} onClick={(e) => e.stopPropagation()}>
                <Tooltip title="Delete">
                  <IconButton size="small" edge="end" color="error" onClick={(e) => handleDelete(e, bill)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </ListItemButton>
          ))}
      </List>
      <Divider sx={{ mt: 0.5, mb: 1 }} />
    </>
  );
};

export default BillsList;
