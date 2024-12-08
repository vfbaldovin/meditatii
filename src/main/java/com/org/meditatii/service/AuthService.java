package com.org.meditatii.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.org.meditatii.exception.AppException;
import com.org.meditatii.exception.error.ApiHttpStatus;
import com.org.meditatii.model.NotificationEmail;
import com.org.meditatii.model.User;
import com.org.meditatii.model.VerificationToken;
import com.org.meditatii.model.dto.*;
import com.org.meditatii.repository.UserRepository;
import com.org.meditatii.repository.VerificationTokenRepository;
import com.org.meditatii.security.JwtProvider;
import com.org.meditatii.security.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Collections;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    @Value("${app.url}")
    private String URL;
    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String GOOGLE_CLIENT_ID;
    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String GOOGLE_CLIENT_SECRET;

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final MailService mailService;
    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;
    private final RefreshTokenService refreshTokenService;
    private final OAuth2UserService<OAuth2UserRequest, OAuth2User> customOAuth2UserService;
    private final UserDetailsServiceImpl userDetailsService;

    @Autowired
    public AuthService(PasswordEncoder passwordEncoder, UserRepository userRepository, VerificationTokenRepository verificationTokenRepository, MailService mailService, AuthenticationManager authenticationManager, JwtProvider jwtProvider, RefreshTokenService refreshTokenService, OAuth2UserService<OAuth2UserRequest, OAuth2User> customOAuth2UserService, UserDetailsServiceImpl userDetailsService) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.verificationTokenRepository = verificationTokenRepository;
        this.mailService = mailService;
        this.authenticationManager = authenticationManager;
        this.jwtProvider = jwtProvider;
        this.refreshTokenService = refreshTokenService;
        this.customOAuth2UserService = customOAuth2UserService;
        this.userDetailsService = userDetailsService;
    }

    public ApiResponse signup(RegisterRequest registerRequest) {
        Optional<User> userOptional = userRepository.findByEmail(registerRequest.getEmail());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (!user.getEnabled()) {
                String token = generateVerificationToken(user);
                System.out.println("Activation link = " + (URL + "/api/auth/accountVerification/" + token));

                mailService.sendMail(getSignupNotificationEmail(user.getEmail(), token));
                return ApiResponse.build(ApiHttpStatus.SUCCESS);
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

        mailService.sendMail(getSignupNotificationEmail(user.getEmail(), token));

        System.out.println("Activation link = " + (URL + "/api/auth/accountVerification/" + token));

        return ApiResponse.build(ApiHttpStatus.SUCCESS);
    }

    private NotificationEmail getSignupNotificationEmail(String email, String token) {
        return new NotificationEmail("Bine ai venit la meditatiianunturi.ro!", email,
                "<html><body><div>Bună ziua,</div><br><div>Felicitări! Ai făcut primul tău pas către noul tău student " +
                        "și suntem încântați să împărtășim cu tine serviciile noastre.\n</div><br>" +
                        "<div>Accesează următorul link pentru a-ți activa contul:</div><br><div><a href = '" + URL + "/login/" + token + "'>" +
                        URL + "accountVerification</a></div><br><div>Dacă ceva nu este clar, anunță-ne cum te putem ajuta." +
                        "</div><br><div>Cu stimă,</div><a href='" + URL + "'>Echipa Meditatii Anunturi</a></body></html>");
    }

    @Transactional(readOnly = true)
    public User getCurrentUser() {
        Jwt principal = (Jwt) SecurityContextHolder.
                getContext().getAuthentication().getPrincipal();
        return userRepository.findByEmail(principal.getSubject())
                .orElseThrow(() -> new UsernameNotFoundException(ApiHttpStatus.EMAIL_NOT_FOUND.getMessage()));
    }

    private String fetchUserAndEnable(VerificationToken verificationToken) {
        String username = verificationToken.getUser().getEmail();
        User user = userRepository.findByEmail(username).orElseThrow(() -> new AppException(ApiHttpStatus.EMAIL_NOT_FOUND.getMessage()));
        user.setEnabled(true);
        userRepository.save(user);

        return user.getEmail();
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

    public String verifyAccount(String token) {
        Optional<VerificationToken> verificationTokenOptional = verificationTokenRepository.findByToken(token);
        VerificationToken verificationToken = verificationTokenOptional.orElseThrow(() -> new AppException(ApiHttpStatus.INVALID_TOKEN.getMessage()));
        return fetchUserAndEnable(verificationToken);
    }

    public AuthenticationResponse login(LoginRequest loginRequest) {
        Authentication authenticate;
        User user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow(() -> new AppException(ApiHttpStatus.EMAIL_NOT_FOUND.getMessage()));
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
                .accessToken(token)
                .refreshToken(refreshTokenService.generateRefreshToken().getToken())
                .expiresAt(Instant.now().plusMillis(jwtProvider.getJwtExpirationDays()))
                .user(loginRequest.getEmail())
                .id(user.getId())
                .build();
    }

    public AuthenticationResponse googleLogin(String code) throws IOException, GeneralSecurityException {
        GoogleTokenResponse tokenResponse = new GoogleAuthorizationCodeTokenRequest(
                new NetHttpTransport(),
                JacksonFactory.getDefaultInstance(),
                "https://oauth2.googleapis.com/token",
                GOOGLE_CLIENT_ID,
                GOOGLE_CLIENT_SECRET,
                code,
                getUrl() + "/api/auth/oauth2-google")  // Specify the same redirect URI you use with your client
                .execute();

        String idToken = tokenResponse.getIdToken();

        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), JacksonFactory.getDefaultInstance())
                .setAudience(Collections.singletonList(GOOGLE_CLIENT_ID))
                .build();

        GoogleIdToken googleIdToken = verifier.verify(idToken);
        if (googleIdToken != null) {
            GoogleIdToken.Payload payload = googleIdToken.getPayload();
            String email = payload.getEmail();
            boolean emailVerified = payload.getEmailVerified();

            if (emailVerified) {
                // Check if the user already exists in your database
                User user = userRepository.findByEmail(email)
                        .orElseGet(() -> registerNewGoogleUser(email, payload));

                // Generate token
                Authentication authentication = new UsernamePasswordAuthenticationToken
                                (userDetailsService.loadUserByUsername(user.getEmail()), null, null);
                SecurityContextHolder.getContext().setAuthentication(authentication);

                // Return JWT token
                String token = jwtProvider.generateToken(authentication);
                return AuthenticationResponse.builder()
                        .accessToken(token)
                        .refreshToken(refreshTokenService.generateRefreshToken().getToken())
                        .expiresAt(Instant.now().plusMillis(jwtProvider.getJwtExpirationDays()))
                        .user(email)
                        .build();
            } else {
                throw new AppException("Email not verified with Google");
            }
        } else {
            throw new AppException("Invalid ID token");
        }
    }

    private User registerNewGoogleUser(String email, GoogleIdToken.Payload payload) {
        // Register a new user with the information from Google
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setEnabled(true); // Or false if you want email verification
        newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
        // Set other fields from payload
        newUser.setFirstName((String) payload.get("given_name"));
        newUser.setLastName((String) payload.get("family_name"));
        // ...
        userRepository.save(newUser);
        return newUser;
    }

    public String getSuccessfullyGoogleLoginUrl(AuthenticationResponse authenticationResponse) {
        return String.format(URL + "/login?accessToken=%s&refreshToken=%s&expiresAt=%s",
                authenticationResponse.getAccessToken(),
                authenticationResponse.getRefreshToken(),
                authenticationResponse.getExpiresAt()
        );
    }

    public String getGoogleRedirectUrl() {
        String redirectUri = getUrl() + "/api/auth/oauth2-google"; // This should be the URI where Google redirects after authorization
        String clientId = GOOGLE_CLIENT_ID;
        String responseType = "code";  // Request an authorization code
        String scope = "openid email profile";  // Only request basic scopes
        String accessType = "online";  // Do not request offline access (no refresh token)

        return "https://accounts.google.com/o/oauth2/v2/auth?" +
                "client_id=" + clientId +
                "&redirect_uri=" + redirectUri +
                "&response_type=" + responseType +
                "&scope=" + scope +
                "&access_type=" + accessType +
                "&prompt=select_account";  // Prompt the user to select their account (skip the consent screen)
    }



    public AuthenticationResponse refreshToken(RefreshTokenRequest refreshTokenRequest) {
        refreshTokenService.validateRefreshToken(refreshTokenRequest.getRefreshToken());
        String token = jwtProvider.generateTokenWithUserName(refreshTokenRequest.getUsername());
        return AuthenticationResponse.builder()
                .accessToken(token)
                .refreshToken(refreshTokenRequest.getRefreshToken())
                .expiresAt(Instant.now().plusMillis(jwtProvider.getJwtExpirationDays()))
                .user(refreshTokenRequest.getUsername())
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

    public String changePassword(ChangePasswordRequest changePasswordDto) {
        // Fetch the verification token
        VerificationToken verificationToken = verificationTokenRepository.findByToken(changePasswordDto.getToken())
                .orElseThrow(() -> new AppException(ApiHttpStatus.INVALID_TOKEN.getMessage()));

        // Check if the token is expired
        if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            // If expired, throw an exception
            throw new AppException(ApiHttpStatus.EXPIRED_TOKEN_RESET_PASSWORD.getMessage());
        }

        // Fetch the user associated with the token
        String username = verificationToken.getUser().getEmail();
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new AppException(ApiHttpStatus.EMAIL_NOT_FOUND.getMessage()));

        // Update the user's password
        user.setPassword(passwordEncoder.encode(changePasswordDto.getPassword()));
        userRepository.save(user);

        // Delete the token after successful password reset
        verificationTokenRepository.delete(verificationToken);

        // Return the username as a success message
        return username;
    }

    public boolean isTokenValid(String token) {
        Optional<VerificationToken> verificationTokenOptional = verificationTokenRepository.findByToken(token);
        if (verificationTokenOptional.isPresent()) {
            VerificationToken verificationToken = verificationTokenOptional.get();
            return verificationToken.getExpiryDate().isAfter(LocalDateTime.now());
        }
        return false;
    }

    public String getUrl() {
        return Objects.equals(URL, "http://localhost:3000") ? "http://localhost:8080" : "https://meditatiianunturi.ro";
    }

}