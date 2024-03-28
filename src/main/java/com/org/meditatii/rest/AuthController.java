package com.org.meditatii.rest;

import com.org.meditatii.model.User;
import com.org.meditatii.model.dto.*;
import com.org.meditatii.service.AuthService;
import com.org.meditatii.service.RefreshTokenService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.io.IOException;
import java.security.GeneralSecurityException;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody RegisterRequest registerRequest) {
        authService.signup(registerRequest);
        return new ResponseEntity<>("User Registration Successful",
                OK);
    }

    @GetMapping("accountVerification/{token}")
    public ResponseEntity<String> verifyAccount(@PathVariable String token) {
        authService.verifyAccount(token);
        return new ResponseEntity<>("Account Activated Successfully", OK);
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
    public ResponseEntity<ApiResponse> resetPassword(@RequestBody String email) {
        ApiResponse apiResponse = authService.resetPassword(email);
        return new ResponseEntity<>(apiResponse, OK);
    }

    @PostMapping("/changePassword")
    public ResponseEntity<ApiResponse> changePassword(@RequestBody ChangePasswordRequest changePasswordDto) {
        ApiResponse apiResponse = authService.changePassword(changePasswordDto);
        return new ResponseEntity<>(apiResponse, OK);
    }
}
