package com.chartapp.chartapp.exception;

import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

public class SuccessClass {

    private int status;
    private String message;
    private Object data;
    private String timestamp;

    public SuccessClass() {
    }
    public static SuccessClass success(String message, Object data) {

        return new SuccessClass(
                HttpStatus.OK.value(),
                message,
                data,
                LocalDateTime.now().toString()
        );
    }

    public SuccessClass(
            int status,
            String message,
            Object data,
            String timestamp) {

        this.status = status;
        this.message = message;
        this.data = data;
        this.timestamp = timestamp;
    }

    public int getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }

    public Object getData() {
        return data;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}

