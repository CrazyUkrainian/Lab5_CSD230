package csd230.controllers;

import csd230.entities.DiscMag;
import csd230.repositories.DiscMagRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/rest/discmag")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class DiscMagRestController {
    private final DiscMagRepository discMagRepository;

    public DiscMagRestController(DiscMagRepository discMagRepository) {
        this.discMagRepository = discMagRepository;
    }

    @GetMapping
    public List<DiscMag> getAllDiscMags() {
        return discMagRepository.findAll();
    }

    @GetMapping("/{id}")
    public DiscMag getDiscMag(@PathVariable Long id) {
        return discMagRepository.findById(id)
                .orElseThrow(() -> new DiscMagNotFoundException(id));
    }

    @PostMapping
    public DiscMag addDiscMag(@RequestBody DiscMag newDiscMag) {
        return discMagRepository.save(newDiscMag);
    }

    @PutMapping("/{id}")
    public DiscMag updateDiscMag(@RequestBody DiscMag newDiscMag, @PathVariable Long id) {
        return discMagRepository.findById(id)
                .map(discMag -> {
                    discMag.setTitle(newDiscMag.getTitle());
                    discMag.setPrice(newDiscMag.getPrice());
                    return discMagRepository.save(discMag);
                })
                .orElseGet(() -> discMagRepository.save(newDiscMag));
    }

    @DeleteMapping("/{id}")
    public void deleteDiscMag(@PathVariable Long id) {
        discMagRepository.deleteById(id);
    }
}
