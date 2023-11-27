package com.wbr.meditatii.service;

import com.wbr.meditatii.exception.AppNotFoundException;
import com.wbr.meditatii.model.Announcement;
import com.wbr.meditatii.model.dto.AnnouncementCard;
import com.wbr.meditatii.repository.AnnouncementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;

    @Autowired
    public AnnouncementService(AnnouncementRepository announcementRepository) {
        this.announcementRepository = announcementRepository;
    }

    public List<Announcement> findAll() {
        return announcementRepository.findAll();
    }

    public Announcement findById(Long id) {
        return announcementRepository.findById(id)
                .orElseThrow(() -> new AppNotFoundException("Announcement not found with id: " + id));
    }

    public Announcement save(Announcement announcement) {
        return announcementRepository.save(announcement);
    }

    public Announcement update(Long id, Announcement announcementDetails) {
        Announcement existingAnnouncement = announcementRepository.findById(id)
                .orElseThrow(() -> new AppNotFoundException("Announcement not found with id: " + id));
        // Copy properties from details to existing
        // ...
        return announcementRepository.save(existingAnnouncement);
    }

    public void deleteById(Long id) {
        Announcement existingAnnouncement = announcementRepository.findById(id)
                .orElseThrow(() -> new AppNotFoundException("Announcement not found with id: " + id));
        announcementRepository.delete(existingAnnouncement);
    }

    public Page<AnnouncementCard> findAllPaginated(int page, int size) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdDate");
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        return announcementRepository.findAll(pageRequest)
                .map(this::announcementCardDto);
    }

    private AnnouncementCard announcementCardDto(Announcement announcement) {
        return AnnouncementCard.builder()
                .id(announcement.getId())
                .title(announcement.getTitle())
                .description(announcement.getDescription())
                .createdDate(announcement.getCreatedDate())
                .price(announcement.getPrice())
                .promoted(announcement.getPromoted())
                .tutorId(announcement.getUser().getId())
                .tutorName(announcement.getUser().getTutorName())
                .build();
    }
}
