package com.org.meditatii.model.dto;

public record ListingCreateRequest(
        Long subjectId,
        String description,
        Integer price
) {
}
