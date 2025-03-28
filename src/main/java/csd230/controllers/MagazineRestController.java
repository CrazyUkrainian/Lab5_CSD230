package csd230.controllers;

import csd230.entities.Magazine;
import csd230.repositories.MagazineRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rest/magazine")
public class MagazineRestController {
    private final MagazineRepository magazineRepository;

    public MagazineRestController(MagazineRepository magazineRepository) {
        this.magazineRepository = magazineRepository;
    }

    @CrossOrigin
    @GetMapping()
    List<Magazine> all() {
        return magazineRepository.findAll();
    }

    @GetMapping("/{id}")
    public Magazine getMagazine(@PathVariable Long id) {
        return magazineRepository.findById(id)
                .orElseThrow(() -> new MagazineNotFoundException(id));
    }

    @PostMapping()
    Magazine newMagazine(@RequestBody Magazine newMagazine) {
        return magazineRepository.save(newMagazine);
    }

    @PutMapping("/{id}")
    Magazine replaceMagazine(@RequestBody Magazine newMagazine, @PathVariable Long id) {
        return magazineRepository.findById(id)
                .map(magazine -> {
                    magazine.setTitle(newMagazine.getTitle());
                    magazine.setPrice(newMagazine.getPrice());
                    return magazineRepository.save(magazine);
                })
                .orElseGet(() -> magazineRepository.save(newMagazine));
    }

    @DeleteMapping("/{id}")
    void deleteMagazine(@PathVariable Long id) {
        magazineRepository.deleteById(id);
    }
}
