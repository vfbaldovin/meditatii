package com.org.meditatii.model.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ListingCard {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime createdDate;
    private Integer price;
    private Boolean promoted;
    private String city;
    private String subject;
    private Long tutorId;
    private String tutorName;
}
