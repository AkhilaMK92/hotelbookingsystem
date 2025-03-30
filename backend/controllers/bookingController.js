const Booking = require('../models/Booking');

// Get all bookings for a logged-in user
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new booking
const addBooking = async (req, res) => {
  const { hotelName, roomType, checkInDate, checkOutDate, guests } = req.body;
  try {
    const booking = await Booking.create({
      userId: req.user.id,
      hotelName,
      roomType,
      checkInDate,
      checkOutDate,
      guests
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing booking
const updateBooking = async (req, res) => {
  const { hotelName, roomType, checkInDate, checkOutDate, guests } = req.body;
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Only allow update if booking belongs to user
    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    booking.hotelName = hotelName || booking.hotelName;
    booking.roomType = roomType || booking.roomType;
    booking.checkInDate = checkInDate || booking.checkInDate;
    booking.checkOutDate = checkOutDate || booking.checkOutDate;
    booking.guests = guests || booking.guests;

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a booking
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Only allow delete if booking belongs to user
    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await booking.remove();
    res.json({ message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBookings,
  addBooking,
  updateBooking,
  deleteBooking
};
