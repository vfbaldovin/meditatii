package com.wbr.meditatii.model;

import javax.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;

@Data
@Entity
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "phone")
    private String phone;

    @Column(name = "email")
    private String email;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "registration_date")
    private LocalDateTime registrationDate;

    @Column(name = "gender")
    private String gender;

    @Column(name = "occupation")
    private String occupation;

    @Column(name = "education")
    private String education;

    @Lob
    @Column(name = "image")
    private byte[] image;

    @Column(name = "coupon_applied")
    private Boolean couponApplied;

    @Column(name = "password")
    private String password;

    @Column(name = "enabled")
    private Boolean enabled;

    @Column(name = "reset_token")
    private String resetToken;

    @Column(name = "expiry_date")
    private LocalDateTime expiryDate;

    public String getTutorName() {
        if (firstName == null) {
            return "Unknown";
        }
        return firstName +
                (lastName != null && !lastName.isEmpty() ? " " + lastName.charAt(0) + "." : "");
    }

    public int getAge() {
        if (dateOfBirth == null) {
            return 42;
        }
        return Period.between(dateOfBirth, LocalDate.now()).getYears();
    }

}
