package com.org.meditatii.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "announcement")
public class Announcement {
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

    @Column(name = "created_date")
    private LocalDateTime createdDate;

    @Column(name = "price")
    private Integer price;

    @Column(name = "county")
    private String county;

    @Column(name = "city")
    private String city;

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

    @Column(name = "announcement_views")
    private Integer announcementViews;

    @Column(name = "promoted")
    private Boolean promoted;

    @Column(name = "promotion_date")
    private LocalDateTime promotionDate;

    @Column(name = "promotion_expiry_date")
    private LocalDateTime promotionExpiryDate;

    @ManyToOne
    @JoinColumn(name = "subject_id", referencedColumnName = "id")
    private Subject subject;

}
