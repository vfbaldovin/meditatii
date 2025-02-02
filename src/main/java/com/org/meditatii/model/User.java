package com.org.meditatii.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.List;

@Data
@Entity
@Table(name = "user")
public class  User {

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

    @Column(name = "experience")
    private String experience;

    @Column(name = "county")
    private String city;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private UserProfileImage userProfileImage;

    @Column(name = "coupon_applied")
    private Boolean couponApplied;

    @Column(name = "password")
    private String password;

    @Column(name = "enabled")
    private Boolean enabled;

    @Column(name = "promoted")
    private Boolean promoted;

    @Column(name = "promotion_date")
    private LocalDateTime promotionDate;

    @Column(name = "verified")
    private Boolean verified;

    @OneToMany(mappedBy = "user")
    private List<Listing> listings;

    @Column(name = "stripe_customer_id", unique = true)
    private String stripeCustomerId;

//    @Column(name = "reset_token")
//    private String resetToken;

//    @Column(name = "expiry_date")
//    private LocalDateTime expiryDate;

    public String getTutorName() {
        if (firstName != null && lastName != null) {
            return firstName + " " + lastName;
        } else if (firstName != null) {
            return firstName;
        } else if (lastName != null) {
            return lastName;
        } else {
            return email.substring(0, email.indexOf("@"));
        }
    }

    public String getFullName() {
        if (firstName != null && lastName != null) {
            return firstName + " " + lastName;
        } else if (firstName != null) {
            return firstName;
        } else if (lastName != null) {
            return lastName;
        } else {
            return email.substring(0, email.indexOf("@"));
        }
    }

    public int getAge() {
        if (dateOfBirth == null) {
            return 42;
        }
        return Period.between(dateOfBirth, LocalDate.now()).getYears();
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", phone='" + phone + '\'' +
                ", email='" + email + '\'' +
                ", dateOfBirth=" + dateOfBirth +
                ", registrationDate=" + registrationDate +
                ", gender='" + gender + '\'' +
                ", occupation='" + occupation + '\'' +
                ", education='" + education + '\'' +
                ", couponApplied=" + couponApplied +
                ", password='" + password + '\'' +
                ", enabled=" + enabled +
                '}';
    }
}
