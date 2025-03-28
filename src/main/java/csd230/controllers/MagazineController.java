package csd230.controllers;

import csd230.entities.Magazine;
import csd230.repositories.MagazineRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/magazines")
public class MagazineController {

    private final MagazineRepository magazineRepository;

    public MagazineController(MagazineRepository magazineRepository) {
        this.magazineRepository = magazineRepository;
    }

    @GetMapping
    public String magazines(Model model) {
        model.addAttribute("magazines", magazineRepository.findAll());
        return "magazines";
    }

    @GetMapping("/add-magazine")
    public String magazineForm(Model model) {
        model.addAttribute("magazine", new Magazine());
        return "add-magazine";
    }

    @PostMapping("/add-magazine")
    public String magazineSubmit(@ModelAttribute Magazine magazine) {
        magazineRepository.save(magazine);
        return "redirect:/magazines";
    }

    @GetMapping("/edit-magazine")
    public String editMagazine(@RequestParam(value = "id") Long id, Model model) {
        Magazine magazine = magazineRepository.findById(id)
                .orElseThrow(() -> new MagazineNotFoundException(id));
        model.addAttribute("magazine", magazine);
        return "edit-magazine";
    }

    @PostMapping("/edit-magazine")
    public String editMagazineSubmit(@ModelAttribute Magazine magazine) {
        magazineRepository.save(magazine);
        return "redirect:/magazines";
    }

    @PostMapping("/selection")
    public String processSelection(@RequestParam("selectedMagazines") List<Long> selectedIds) {
        for (Long id : selectedIds) {
            Magazine magazine = magazineRepository.findById(id)
                    .orElseThrow(() -> new MagazineNotFoundException(id));
            magazineRepository.delete(magazine);
        }
        return "redirect:/magazines";
    }
}
