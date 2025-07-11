package com.rodiejacontable.rodiejacontable.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class EmpleadoNoEncontradoException extends RuntimeException {
    public EmpleadoNoEncontradoException(String message) {
        super(message);
    }
}
