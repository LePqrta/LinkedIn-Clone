package com.mrvalevictorian.backend.exceptions;

public class PostContentEmptyException extends RuntimeException {
    public PostContentEmptyException(String message) {
        super(message);
    }
}