package com.org.meditatii.model.dto;

public record UserPersonalInfoRequest(
        String firstName,
        String lastName,
        String occupation,
        String education,
        String experience,
        String phone,
        String city,
        String dateOfBirth
){
}