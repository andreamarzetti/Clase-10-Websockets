// src/repository/TicketRepository.js
import TicketModel from '../dao/mongodb/models/TicketModel.js';

class TicketRepository {
    async createTicket(ticketData) {
        const ticket = new TicketModel(ticketData);
        await ticket.save();
        return ticket;
    }
}

export default new TicketRepository();
