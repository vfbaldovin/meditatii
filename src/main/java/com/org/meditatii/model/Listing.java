package com.org.meditatii.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "listing")
public class Listing {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column(name = "subject")
    private String subjectOld;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "session_duration")
    private String sessionDuration;

    @Column(name = "price")
    private Integer price;

    @Column(name = "county")
    private String county;

    @Column(name = "area")
    private String area;

    @Column(name = "experience")
    private String experience;

    @Column(name = "is_online")
    private Boolean online;

    @Column(name = "student_home")
    private Boolean studentHome;

    @Column(name = "tutor_home")
    private Boolean tutorHome;

    @Column(name = "views")
    private Long views;

    @Column(name = "promoted")
    private Boolean promoted;

    @Column(name = "promotion_date")
    private LocalDateTime promotionDate;

    @Column(name = "promotion_expiry_date")
    private LocalDateTime promotionExpiryDate;

    @ManyToOne
    @JoinColumn(name = "subject_id", referencedColumnName = "id")
    private Subject subject;

    @Column(name = "refresh_date", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime refreshDate;

    @Column(name = "created_date", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdDate;

}
