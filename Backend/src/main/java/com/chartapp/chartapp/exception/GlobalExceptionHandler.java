package com.chartapp.chartapp.exception;

import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.http.converter.HttpMessageNotReadableException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {



    @ExceptionHandler(UserNotFound.class)
    public ResponseEntity<ErrorClass> userNotFound(UserNotFound ex) {

        ErrorClass error = new ErrorClass(
                HttpStatus.NOT_FOUND.value(),
                ex.getMessage(),
                null,
                LocalDateTime.now().toString()
        );

        return new ResponseEntity<>(
                error,
                HttpStatus.NOT_FOUND
        );
    }

    @ExceptionHandler(UserAlreadyExist.class)
    public ResponseEntity<ErrorClass> userAlreadyExist(
            UserAlreadyExist ex) {

        ErrorClass error = new ErrorClass(
                HttpStatus.BAD_REQUEST.value(),
                ex.getMessage(),
                null,
                LocalDateTime.now().toString()
        );

        return new ResponseEntity<>(
                error,
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorClass> handleValidationExceptions(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult()
                .getFieldErrors()
                .forEach(error -> {

                    errors.put(
                            error.getField(),
                            error.getDefaultMessage()
                    );

                });

        ErrorClass error = new ErrorClass(
                HttpStatus.BAD_REQUEST.value(),
                "Validation failed",
                errors,
                LocalDateTime.now().toString()
        );

        return new ResponseEntity<>(
                error,
                HttpStatus.BAD_REQUEST
        );
    }


    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorClass> handleConstraintViolation(
            ConstraintViolationException ex) {

        Map<String, String> errors = new HashMap<>();

        ex.getConstraintViolations()
                .forEach(violation -> {

                    errors.put(
                            violation.getPropertyPath().toString(),
                            violation.getMessage()
                    );

                });

        ErrorClass error = new ErrorClass(
                HttpStatus.BAD_REQUEST.value(),
                "Validation failed",
                errors,
                LocalDateTime.now().toString()
        );

        return new ResponseEntity<>(
                error,
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ErrorClass> handleUsernameNotFound(
            UsernameNotFoundException ex) {

        ErrorClass error = new ErrorClass(
                HttpStatus.NOT_FOUND.value(),
                ex.getMessage(),
                null,
                LocalDateTime.now().toString()
        );

        return new ResponseEntity<>(
                error,
                HttpStatus.NOT_FOUND
        );
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorClass> handleMessageNotReadable(
            HttpMessageNotReadableException ex) {

        String message =
                "Invalid request. Please provide valid data.";

        if (ex.getCause() != null &&
                ex.getCause().getMessage() != null &&
                ex.getCause().getMessage().contains("end-of-input")) {

            message =
                    "Request body is empty. Please fill the form before submitting.";
        }

        ErrorClass error = new ErrorClass(
                HttpStatus.BAD_REQUEST.value(),
                message,
                null,
                LocalDateTime.now().toString()
        );

        return new ResponseEntity<>(
                error,
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorClass> handleAll(Exception ex) {

        ErrorClass error = new ErrorClass(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal server error",
                null,
                LocalDateTime.now().toString()
        );

        return new ResponseEntity<>(
                error,
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    @ExceptionHandler(InvalidCredentials.class)
    public ResponseEntity<ErrorClass> handleInvalidCredentials(
            InvalidCredentials ex) {

        ErrorClass error = new ErrorClass(
                HttpStatus.UNAUTHORIZED.value(),
                ex.getMessage(),
                null,
                LocalDateTime.now().toString()
        );

        return new ResponseEntity<>(
                error,
                HttpStatus.UNAUTHORIZED
        );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorClass> handleIllegalArgumentException(
            IllegalArgumentException ex) {

        ErrorClass error = new ErrorClass(
                HttpStatus.BAD_REQUEST.value(),
                ex.getMessage(),
                null,
                LocalDateTime.now().toString()
        );

        return ResponseEntity.badRequest().body(error);
    }


}