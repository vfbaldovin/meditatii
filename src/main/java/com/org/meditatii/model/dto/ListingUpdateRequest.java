package com.org.meditatii.model.dto;

public record ListingUpdateRequest(
        Long listingId,
        String description,
        Integer price
) {
}
