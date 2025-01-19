package com.org.meditatii.rest;

import com.org.meditatii.model.dto.AvailableUserSubjects;
import com.org.meditatii.model.dto.ListingCreateRequest;
import com.org.meditatii.model.dto.PersonalListingRow;
import com.org.meditatii.model.dto.UserPersonalInfoResponse;
import com.org.meditatii.schedulers.ListingPriceScheduler;
import com.org.meditatii.service.AuthService;
import com.org.meditatii.service.ListingService;
import com.org.meditatii.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final UserService userService;
    private final AuthService authService;
    private final ListingService listingService;

    public DashboardController(UserService userService, AuthService authService, ListingService listingService) {
        this.userService = userService;
        this.authService = authService;
        this.listingService = listingService;
    }

    @GetMapping("/listings")
    public ResponseEntity<List<PersonalListingRow>> getPersonalListings() {
        return ResponseEntity.ok(userService.findPersonalListingsByUserId());
    }

    @GetMapping("/listings/{id}")
    public ResponseEntity<?> getListing(@PathVariable Long id, Principal principal) {
        return ResponseEntity.ok(listingService.findById(id, principal.getName()));
    }

    @PostMapping("/listings/create")
    public ResponseEntity<?> createListing(@RequestBody ListingCreateRequest listingRequest) {
        return ResponseEntity.ok(Map.of("id",listingService.createListing(listingRequest)));
    }

    @GetMapping("/subjects/available")
    public ResponseEntity<List<AvailableUserSubjects>> getUserAvailableSubjects() {
        return ResponseEntity.ok(userService.findAvailableUserSubjects());
    }

    @GetMapping("/subjects/{subjectId}/description")
    public void getListingDescription(@PathVariable Long subjectId, HttpServletResponse response) throws IOException {
        listingService.streamDescription(subjectId, response);
    }


    @GetMapping("/subjects/{subjectId}/price")
    public ResponseEntity<Map<String, Integer>> getListingDescription(@PathVariable Long subjectId) {
        Map<String, Integer> response = new HashMap<>();
        response.put("id", ListingPriceScheduler.medianPricesBySubject.get(subjectId));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/update-avatar")
    public ResponseEntity<Map<String, String>> updateAvatar(@RequestParam("avatar") MultipartFile file) {
        try {
            userService.updateUserAvatar(authService.getCurrentUser().getId(), file);

            Long userId = authService.getCurrentUser().getId();
            String updatedAvatarUrl = authService.getUrl() + "/api/user/" + userId + "/profile-image";

            Map<String, String> response = new HashMap<>();
            response.put("updatedAvatarUrl", updatedAvatarUrl);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @GetMapping("/profile/info")
    public ResponseEntity<UserPersonalInfoResponse> getPersonalInfo() {
        return ResponseEntity.ok(userService.getPersonalInfo());
    }

    @PostMapping("/profile/info/save")
    public ResponseEntity<?> saveProfileInfo(@RequestBody UserPersonalInfoResponse personalInfo) {
        userService.savePersonalInfo(personalInfo);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
}
