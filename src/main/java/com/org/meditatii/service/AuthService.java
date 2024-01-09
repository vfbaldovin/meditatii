package com.org.meditatii.service;

import com.org.meditatii.exception.AppException;
import com.org.meditatii.exception.error.ApiHttpStatus;
import com.org.meditatii.model.NotificationEmail;
import com.org.meditatii.model.User;
import com.org.meditatii.model.VerificationToken;
import com.org.meditatii.model.dto.*;
import com.org.meditatii.repository.UserRepository;
import com.org.meditatii.repository.VerificationTokenRepository;
import com.org.meditatii.security.JwtProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    @Value("${app.url}")
    private String URL;

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final MailService mailService;
    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;
    private final RefreshTokenService refreshTokenService;

    @Autowired
    public AuthService(PasswordEncoder passwordEncoder, UserRepository userRepository, VerificationTokenRepository verificationTokenRepository, MailService mailService, AuthenticationManager authenticationManager, JwtProvider jwtProvider, RefreshTokenService refreshTokenService) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.verificationTokenRepository = verificationTokenRepository;
        this.mailService = mailService;
        this.authenticationManager = authenticationManager;
        this.jwtProvider = jwtProvider;
        this.refreshTokenService = refreshTokenService;
    }

    public ApiResponse signup(RegisterRequest registerRequest) {
        Optional<User> userOptional = userRepository.findByEmail(registerRequest.getEmail());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (!user.getEnabled()) {
                resendMailActivation(user);
                throw new AppException(ApiHttpStatus.RESEND_ACTIVATION_MAIL.getMessage());
            }
            throw new AppException(ApiHttpStatus.EMAIL_TAKEN.getMessage());
        }

        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRegistrationDate(LocalDateTime.now(ZoneOffset.UTC));
        user.setEnabled(false);

        userRepository.save(user);

        String token = generateVerificationToken(user);

        mailService.sendMail(new NotificationEmail("Bine ai venit la meditatiianunturi.ro!", user.getEmail(),
                "<html><body><div>Bună ziua,</div><br><div>Felicitări! Ai făcut primul tău pas către noul tău student " +
                        "și suntem încântați să împărtășim cu tine serviciile noastre.\n</div><br>" +
                        "<div>Accesează următorul link pentru a-ți activa contul:</div><br><div><a href = '" + URL + "/accountVerification/" + token + "'>" +
                        URL +"accountVerification</a></div><br><div>Dacă ceva nu este clar, anunță-ne cum te putem ajuta." +
                        "</div><br><div>Cu stimă,</div><a href='"+ URL +"'>Echipa Meditatii Anunturi</a></body></html>"));

        System.out.println("Activation link = " + (URL + "/api/auth/accountVerification/" + token));

        return ApiResponse.build(ApiHttpStatus.SUCCESS);
    }

    @Transactional(readOnly = true)
    public User getCurrentUser() {
        Jwt principal = (Jwt) SecurityContextHolder.
                getContext().getAuthentication().getPrincipal();
        return userRepository.findByEmail(principal.getSubject())
                .orElseThrow(() -> new UsernameNotFoundException(ApiHttpStatus.EMAIL_NOT_FOUND.getMessage()));
    }

    private ApiResponse fetchUserAndEnable(VerificationToken verificationToken) {
        String username = verificationToken.getUser().getEmail();
        User user = userRepository.findByEmail(username).orElseThrow(() -> new AppException(ApiHttpStatus.EMAIL_NOT_FOUND.getMessage()));
        user.setEnabled(true);
        userRepository.save(user);

        return ApiResponse.build(ApiHttpStatus.SUCCESS);
    }

    public void resendMailActivation(User user) {
        String token = generateVerificationToken(user);
        System.out.println("Activation link = " + (URL + "/api/auth/accountVerification/" + token));

        mailService.sendMail(new NotificationEmail("Bine ai venit la meditatiianunturi.ro!", user.getEmail(),
                "<html><body><div>Bună ziua,</div><br><div>Felicitări! Ai făcut primul tău pas către noul tău student " +
                        "și suntem încântați să împărtășim cu tine serviciile noastre.\n</div><br>" +
                        "<div>Accesează următorul link pentru a-ți activa contul:</div>" +
                        "<br><div><a href = '" + URL + "/accountVerification/" + token + "'>" + URL + "/accountVerification</a></div>" +
                        "<br><div>Dacă ceva nu este clar, anunță-ne cum te putem ajuta.</div><br><div>Cu stimă,</div><a href='"+ URL +"'>Echipa Meditatii Anunturi</a></body></html>"));

    }

    protected String generateVerificationToken(User user) {
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setToken(token);
        verificationToken.setUser(user);
        LocalDateTime timestamp = LocalDateTime.now().plusHours(1);
        verificationToken.setExpiryDate(timestamp);
        verificationTokenRepository.save(verificationToken);
        return token;
    }

    public ApiResponse verifyAccount(String token) {
        Optional<VerificationToken> verificationTokenOptional = verificationTokenRepository.findByToken(token);
        VerificationToken verificationToken = verificationTokenOptional.orElseThrow(() -> new AppException(ApiHttpStatus.INVALID_TOKEN.getMessage()));
        return fetchUserAndEnable(verificationToken);
    }

    public AuthenticationResponse login(LoginRequest loginRequest) {
        Authentication authenticate;
        userRepository.findByEmail(loginRequest.getEmail()).orElseThrow(() -> new AppException(ApiHttpStatus.EMAIL_NOT_FOUND.getMessage()));
        try {
            authenticate = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(),
                    loginRequest.getPassword()));
        } catch (BadCredentialsException e) {
            throw new AppException(ApiHttpStatus.INVALID_PASSWORD.getMessage());
        } catch (DisabledException e) {
            throw new AppException(ApiHttpStatus.USER_NOT_ENABLED.getMessage());
        }

        SecurityContextHolder.getContext().setAuthentication(authenticate);
        String token = jwtProvider.generateToken(authenticate);
        return AuthenticationResponse.builder()
                .authenticationToken(token)
                .refreshToken(refreshTokenService.generateRefreshToken().getToken())
                .expiresAt(Instant.now().plusMillis(jwtProvider.getJwtExpirationInMillis()))
                .username(loginRequest.getEmail())
                .build();
    }

    public AuthenticationResponse refreshToken(RefreshTokenRequest refreshTokenRequest) {
        refreshTokenService.validateRefreshToken(refreshTokenRequest.getRefreshToken());
        String token = jwtProvider.generateTokenWithUserName(refreshTokenRequest.getUsername());
        return AuthenticationResponse.builder()
                .authenticationToken(token)
                .refreshToken(refreshTokenRequest.getRefreshToken())
                .expiresAt(Instant.now().plusMillis(jwtProvider.getJwtExpirationInMillis()))
                .username(refreshTokenRequest.getUsername())
                .build();
    }

    public boolean isLoggedIn() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return !(authentication instanceof AnonymousAuthenticationToken) && authentication.isAuthenticated();
    }

    public ApiResponse resetPassword(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new AppException(ApiHttpStatus.EMAIL_NOT_FOUND.getMessage()));
        if (!user.getEnabled()) {
            throw new AppException(ApiHttpStatus.USER_NOT_ENABLED.getMessage());
        }

        String token = generateVerificationToken(user);

        mailService.sendMail(new NotificationEmail("Recuperare parolă", user.getEmail(),
                "<html><body><div>Bună ziua,</div><br><div>Vă mulțumim că folosiți meditatiianunturi.ro!\n</div><br>" +
                        "<div>Vă rugăm să accesați următorul link pentru a vă reseta parola:</div>" +
                        "<br><div><a href = '" + URL + "/reset/" + token + "'>" + URL + "/reset</a></div>" +
                        "<br><div>Dacă ceva nu este clar, anunță-ne cum vă putem ajuta.</div><br><div>Cu stimă,</div><a href='" + URL + "'>Echipa Meditatii Anunturi</a></body></html>"));
        return ApiResponse.build(ApiHttpStatus.SUCCESS);
    }

    public ApiResponse changePassword(ChangePasswordRequest changePasswordDto) {
        VerificationToken verificationToken = verificationTokenRepository.findByToken(changePasswordDto.getToken())
                .orElseThrow(() -> new AppException(ApiHttpStatus.INVALID_TOKEN.getMessage()));
        String username = verificationToken.getUser().getEmail();
        User user = userRepository.findByEmail(username).orElseThrow(() -> new AppException(ApiHttpStatus.EMAIL_NOT_FOUND.getMessage()));
        user.setPassword(passwordEncoder.encode(changePasswordDto.getPassword()));
        userRepository.save(user);
        return ApiResponse.build(ApiHttpStatus.SUCCESS);
    }
}