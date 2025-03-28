package csd230.controllers;

import csd230.entities.Cart;
import csd230.entities.CartItem;
import csd230.repositories.CartRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rest/cart")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class CartRestController {
    private final CartRepository cartRepository;

    public CartRestController(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }

    @GetMapping
    public List<Cart> getAllCarts() {
        return cartRepository.findAll();
    }

    @GetMapping("/{id}")
    public Cart getCart(@PathVariable Long id) {
        return cartRepository.findById(id)
                .orElseThrow(() -> new CartNotFoundException(id));
    }

    @PostMapping
    public Cart addCart(@RequestBody Cart newCart) {
        return cartRepository.save(newCart);
    }

    @PutMapping("/{id}")
    public Cart updateCart(@RequestBody Cart newCart, @PathVariable Long id) {
        return cartRepository.findById(id)
                .map(cart -> {
                    for (CartItem item : newCart.getItems()) {
                        item.setCart(cart); // 🔥 this is key
                    }
                    cart.setItems(newCart.getItems());
                    return cartRepository.save(cart);
                })
                .orElseThrow(() -> new CartNotFoundException(id));
    }


    @DeleteMapping("/{id}")
    public void deleteCart(@PathVariable Long id) {
        cartRepository.deleteById(id);
    }
}
