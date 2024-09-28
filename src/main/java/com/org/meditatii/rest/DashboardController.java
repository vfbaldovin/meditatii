package com.org.meditatii.rest;

import com.org.meditatii.model.dto.AvailableUserSubjects;
import com.org.meditatii.model.dto.PersonalListingRow;
import com.org.meditatii.service.AuthService;
import com.org.meditatii.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final UserService userService;
    private final AuthService authService;

    public DashboardController(UserService userService, AuthService authService) {
        this.userService = userService;
        this.authService = authService;
    }

    @GetMapping("/listings")
    public ResponseEntity<List<PersonalListingRow>> getPersonalListings() {
        return ResponseEntity.ok(userService.findPersonalListingsByUserId());
    }

    @GetMapping("/subjects/available")
    public ResponseEntity<List<AvailableUserSubjects>> getUserAvailableSubjects() {
        return ResponseEntity.ok(userService.findAvailableUserSubjects());
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


}
