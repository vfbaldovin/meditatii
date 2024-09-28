package com.org.meditatii.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthenticationResponse {
    private String accessToken;
    private String refreshToken;
    private Instant expiresAt;
    private String user;
    private Long id;
}
