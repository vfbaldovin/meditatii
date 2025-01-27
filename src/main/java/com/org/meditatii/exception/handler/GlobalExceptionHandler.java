package com.org.meditatii.exception.handler;

import com.org.meditatii.exception.AppException;
import com.org.meditatii.exception.AppNotFoundException;
import com.org.meditatii.exception.error.ErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {


    @ExceptionHandler(AppNotFoundException.class)
    public ResponseEntity<String> handleNotFoundException(AppNotFoundException ex) {
        log.error("AppNotFoundException occurred: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(AppException.class)
    public ResponseEntity<ErrorResponse> handleException(AppException ex) {
        log.error("AppException occurred: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse.builder().message(ex.getMessage()).build());
    }
}
