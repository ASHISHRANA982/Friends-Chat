package com.chartapp.chartapp.exception;
import java.util.Map;


public class ErrorClass {

    private int status;
    private String message;
    private Map<String, String> errors;
    private String timestamp;

    public ErrorClass() {
        super();
    }

    public ErrorClass(
            int status,
            String message,
            Map<String, String> errors,
            String timestamp) {

        this.status = status;
        this.message = message;
        this.errors = errors;
        this.timestamp = timestamp;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Map<String, String> getErrors() {
        return errors;
    }

    public void setErrors(Map<String, String> errors) {
        this.errors = errors;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}