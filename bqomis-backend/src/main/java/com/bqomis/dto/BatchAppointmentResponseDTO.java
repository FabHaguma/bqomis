package com.bqomis.dto;

import java.util.List;
import java.util.Map;

public class BatchAppointmentResponseDTO {
    private int totalSubmitted;
    private int successfullyCreated;
    private int failedCount;
    private List<Failure> failures;

    public static class Failure {
        private int inputIndex;
        private Map<String, Object> data;
        private String error;

        public Failure(int inputIndex, Map<String, Object> data, String error) {
            this.inputIndex = inputIndex;
            this.data = data;
            this.error = error;
        }

        public int getInputIndex() {
            return inputIndex;
        }

        public Map<String, Object> getData() {
            return data;
        }

        public String getError() {
            return error;
        }

        public void setInputIndex(int inputIndex) {
            this.inputIndex = inputIndex;
        }

        public void setData(Map<String, Object> data) {
            this.data = data;
        }

        public void setError(String error) {
            this.error = error;
        }
    }

    public int getTotalSubmitted() {
        return totalSubmitted;
    }

    public int getSuccessfullyCreated() {
        return successfullyCreated;
    }

    public int getFailedCount() {
        return failedCount;
    }

    public List<Failure> getFailures() {
        return failures;
    }

    public void setTotalSubmitted(int totalSubmitted) {
        this.totalSubmitted = totalSubmitted;
    }

    public void setSuccessfullyCreated(int successfullyCreated) {
        this.successfullyCreated = successfullyCreated;
    }

    public void setFailedCount(int failedCount) {
        this.failedCount = failedCount;
    }

    public void setFailures(List<Failure> failures) {
        this.failures = failures;
    }
}
