package com.org.meditatii.rest;

import com.org.meditatii.exception.error.ApiHttpStatus;
import com.org.meditatii.model.User;
import com.org.meditatii.model.dto.*;
import com.org.meditatii.service.AuthService;
import com.org.meditatii.service.RefreshTokenService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Map;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody RegisterRequest registerRequest) {
        authService.signup(registerRequest);
        return new ResponseEntity<>(Map.of("message", "success"), OK);
    }

    @GetMapping("/accountVerification/{token}")
    public ResponseEntity<?> verifyAccount(@PathVariable String token) {
        String email = authService.verifyAccount(token);
        return new ResponseEntity<>(Map.of("message", email), OK);
    }

    @PostMapping("/login")
    public AuthenticationResponse login(@RequestBody LoginRequest loginRequest) {
        return authService.login(loginRequest);
    }

    @PostMapping("/google/login")
    public ResponseEntity<AuthenticationResponse> googleLogin(@RequestBody GoogleLoginRequest googleLoginRequest) throws GeneralSecurityException, IOException {
        AuthenticationResponse response = authService.googleLogin(googleLoginRequest.getCode());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/google/redirect")
    public RedirectView redirectToGoogle() {

        return new RedirectView(authService.getGoogleRedirectUrl());
    }

    @GetMapping("/oauth2-google")
    public ResponseEntity<?> handleGoogleCallback(@RequestParam("code") String code, HttpServletResponse response) throws IOException, GeneralSecurityException {
        // Use the code to request tokens
        AuthenticationResponse authResponse = authService.googleLogin(code);
        // Redirect user or return response as needed
        response.sendRedirect(authService.getSuccessfullyGoogleLoginUrl(authResponse)); // Redirect to your frontend application as needed
        return ResponseEntity.ok(authResponse);
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(
            /*needed for authenticate*/
            @AuthenticationPrincipal Jwt principal) {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(
                UserResponse.builder()
                        .id(currentUser.getId())
                        .email(currentUser.getEmail())
                        .fullName(currentUser.getTutorNameFull())
                        .build()
        );
    }

    @PostMapping("/refresh/token")
    public AuthenticationResponse refreshTokens(@Valid @RequestBody RefreshTokenRequest refreshTokenRequest) {
        return authService.refreshToken(refreshTokenRequest);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@Valid @RequestBody RefreshTokenRequest refreshTokenRequest) {
        refreshTokenService.deleteRefreshToken(refreshTokenRequest.getRefreshToken());
        return ResponseEntity.status(OK).body("Refresh Token Deleted Successfully!!");
    }

    @PostMapping("/reset")
    public ResponseEntity<ApiResponse> resetPassword(@RequestBody RecoverPasswordRequest email) {
        ApiResponse apiResponse = authService.resetPassword(email.getEmail());
        return new ResponseEntity<>(apiResponse, OK);
    }

    @PostMapping("/changePassword")
    public ResponseEntity<Map<String, String>> changePassword(@RequestBody ChangePasswordRequest changePasswordDto) {
        String email = authService.changePassword(changePasswordDto);
        return new ResponseEntity<>(Map.of("message", email), OK);
    }

    @GetMapping("/validateToken/{token}")
    public ResponseEntity<ApiResponse> validateToken(@PathVariable String token) {
        boolean isValid = authService.isTokenValid(token);
        if (isValid) {
            return ResponseEntity.ok(ApiResponse.build(ApiHttpStatus.SUCCESS));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.build(ApiHttpStatus.INVALID_TOKEN));
        }
    }
}
