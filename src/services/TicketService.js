// src/services/TicketService.js
import TicketRepository from '../repository/TicketRepository.js';

class TicketService {
    async createTicket(amount, purchaser) {
        const ticketData = {
            code: uuidv4(),
            amount,
            purchaser
        };

        return await TicketRepository.createTicket(ticketData);
    }
}

export default new TicketService();
