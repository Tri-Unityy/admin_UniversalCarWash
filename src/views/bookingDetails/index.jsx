import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore/lite";
import { Button, Typography, Paper, Box } from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
import { db } from "./../../utils/firebase.config";

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pickUp, setPickUp] = useState("No");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const bookingRef = doc(db, "universal-carwash-booking", id);
        const bookingSnap = await getDoc(bookingRef);

        if (bookingSnap.exists()) {
          setBooking({ id: bookingSnap.id, ...bookingSnap.data() });
        } else {
          setBooking(null); // Booking not found
        }
      } catch (error) {
        console.error("Error fetching booking:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const handleGenerateBill = () => {
    navigate(`/generateBill/${id}`, { state: booking });
  };




  if (loading) {
    return <Typography variant="h5">Loading booking details...</Typography>;
  }

  if (!booking) {
    return <Typography variant="h5">Booking not found</Typography>;
  }

  return (
    <MainCard title={`Booking Details for ID: ${booking.id}`}>
      <Paper sx={{ padding: 3 }}>
        <Box mb={2}>
          <Typography variant="h6">Customer Name: {booking.name}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="h6">Phone Number: {booking.phone}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="h6">Email: {booking.email}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="h6">Booking Date: {booking.date}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="h6">Booking Time Slot: {booking.timeslot}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="h6">Vehicle Type: {booking.carmodel}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="h6">Vehicle No: {booking.carnumber}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="h6">Pick UP: {booking.pickup ? "Yes" : "No"}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="h6">Pick UP Address: {booking.pickupAddress}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="h6">Status: {booking.status}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="h6">
            Services: {booking.services?.length ? booking.services.join(", ") : "None"}
          </Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="h6">Amount: ${booking.amount}</Typography>
        </Box>

        <Box mt={3}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/bookings")}
            sx={{ marginRight: 2 }}
          >
            Back to Bookings
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerateBill}
          >
            Generate Bill
          </Button>
        </Box>
      </Paper>
    </MainCard>
  );
};

export default BookingDetails;
