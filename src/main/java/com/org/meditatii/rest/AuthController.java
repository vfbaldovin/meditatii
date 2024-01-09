package com.org.meditatii.rest;

import com.org.meditatii.model.dto.*;
import com.org.meditatii.service.AuthService;
import com.org.meditatii.service.RefreshTokenService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
