// src/dao/mongodb/models/TicketModel.js
import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    // Define tu esquema aquí
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: String, required: true },
    date: { type: Date, required: true },
    price: { type: Number, required: true },
});

const TicketModel = mongoose.model('Ticket', ticketSchema);

export default TicketModel;
