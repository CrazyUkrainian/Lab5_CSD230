package csd230.controllers;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import csd230.entities.Ticket;
import csd230.repositories.TicketRepository;
import java.util.List;

@Controller
@RequestMapping("/tickets")
public class TicketController {

    private final TicketRepository ticketRepository;

    public TicketController(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    @GetMapping
    public String tickets(Model model) {
        model.addAttribute("tickets", ticketRepository.findAll());
        return "tickets";
    }

    @GetMapping("/add-ticket")
    public String ticketForm(Model model) {
        model.addAttribute("ticket", new Ticket());
        return "add-ticket";
    }

    @PostMapping("/add-ticket")
    public String ticketSubmit(@ModelAttribute Ticket ticket) {
        ticketRepository.save(ticket);
        return "redirect:/tickets";
    }

    @GetMapping("/edit-ticket")
    public String editTicket(@RequestParam(value = "id") Long id, Model model) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new TicketNotFoundException(id));
        model.addAttribute("ticket", ticket);
        return "edit-ticket";
    }

    @PostMapping("/edit-ticket")
    public String editTicketSubmit(@ModelAttribute Ticket ticket) {
        ticketRepository.save(ticket);
        return "redirect:/tickets";
    }

    @PostMapping("/selection")
    public String processSelection(@RequestParam("selectedTickets") List<Long> selectedIds) {
        for (Long id : selectedIds) {
            Ticket ticket = ticketRepository.findById(id)
                    .orElseThrow(() -> new TicketNotFoundException(id));
            ticketRepository.delete(ticket);
        }
        return "redirect:/tickets";
    }
}

