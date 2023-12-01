package com.wbr.meditatii.rest;

import com.wbr.meditatii.model.Announcement;
import com.wbr.meditatii.model.dto.AnnouncementCard;
import com.wbr.meditatii.service.AnnouncementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/announcement")
public class AnnouncementController {

    private final AnnouncementService announcementService;

    @Autowired
    public AnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    @GetMapping
    public ResponseEntity<List<Announcement>> getAllAnnouncements() {
        List<Announcement> announcements = announcementService.findAll();
        return ResponseEntity.ok(announcements);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Announcement> getAnnouncementById(@PathVariable Long id) {
        Announcement announcement = announcementService.findById(id);
        return ResponseEntity.ok(announcement);
    }

    @PostMapping
    public ResponseEntity<Announcement> createAnnouncement(@RequestBody Announcement announcement) {
        Announcement createdAnnouncement = announcementService.save(announcement);
        return new ResponseEntity<>(createdAnnouncement, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Announcement> updateAnnouncement(@PathVariable Long id, @RequestBody Announcement announcement) {
        Announcement updatedAnnouncement = announcementService.update(id, announcement);
        return ResponseEntity.ok(updatedAnnouncement);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAnnouncement(@PathVariable Long id) {
        announcementService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<AnnouncementCard>> getAllAnnouncementsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam @Nullable Long subjectId) {
        Page<AnnouncementCard> announcementPage = announcementService.findAllPaginated(page, size, subjectId);
        return ResponseEntity.ok(announcementPage);
    }
}
