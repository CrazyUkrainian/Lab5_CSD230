package csd230.controllers;

public class CartNotFoundException extends RuntimeException {
    public CartNotFoundException(Long id) {
        super("Could not find Cart with ID " + id);
    }
}
