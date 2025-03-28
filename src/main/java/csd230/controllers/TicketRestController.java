package csd230.controllers;

import csd230.entities.Ticket;
import csd230.repositories.TicketRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rest/ticket")
public class TicketRestController {
    private final TicketRepository ticketRepository;

    public TicketRestController(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    @CrossOrigin
    @GetMapping()
    List<Ticket> all() {
        return ticketRepository.findAll();
    }

    @GetMapping("/{id}")
    public Ticket getTicket(@PathVariable Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new TicketNotFoundException(id));
    }

    @PostMapping()
    Ticket newTicket(@RequestBody Ticket newTicket) {
        return ticketRepository.save(newTicket);
    }

    @PutMapping("/{id}")
    Ticket replaceTicket(@RequestBody Ticket newTicket, @PathVariable Long id) {
        return ticketRepository.findById(id)
                .map(ticket -> {
                    ticket.setPrice(newTicket.getPrice());
                    return ticketRepository.save(ticket);
                })
                .orElseGet(() -> ticketRepository.save(newTicket));
    }

    @DeleteMapping("/{id}")
    void deleteTicket(@PathVariable Long id) {
        ticketRepository.deleteById(id);
    }
}
