package com.wbr.meditatii.model.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AnnouncementCard {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime createdDate;
    private Integer price;
    private Boolean promoted;
    private Long tutorId;
    private String tutorName;
}
