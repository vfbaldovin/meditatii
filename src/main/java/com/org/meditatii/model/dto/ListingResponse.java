package com.org.meditatii.model.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ListingResponse {
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
    private String county;
    private String area;
    private String experience;
    private Boolean online;
    private Boolean studentHome;
    private Boolean tutorHome;
    private String phone;
    private String email;
    private String occupation;
    private String education;
    private Integer age;
}
