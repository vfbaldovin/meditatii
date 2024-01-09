package com.org.meditatii.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "user_profile_image")
public class UserProfileImage {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @Lob
    @Column(name = "image")
    private byte[] image;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;
}