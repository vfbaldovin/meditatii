package com.org.meditatii.model.dto;

import java.time.LocalDateTime;

public record PersonalListingRow(
        Long id,
        String subject,
        Long views,
        Boolean promoted,
        LocalDateTime refreshDate
) {
}
