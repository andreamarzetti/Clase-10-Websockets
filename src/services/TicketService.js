// src/services/TicketService.js
import TicketRepository from '../repository/TicketRepository.js';
import { v4 as uuidv4 } from 'uuid';

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
