package csd230.controllers;

public class DiscMagNotFoundException extends RuntimeException {
    public DiscMagNotFoundException(Long id) {
        super("Could not find DiscMag with ID " + id);
    }
}
