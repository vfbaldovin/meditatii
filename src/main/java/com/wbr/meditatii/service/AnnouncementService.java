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

import java.util.ArrayList;
import java.util.List;

@Service
public class AnnouncementService {

    private final AnnouncementRepository repository;

    @Autowired
    public AnnouncementService(AnnouncementRepository repository) {
        this.repository = repository;
    }

    public List<Announcement> findAll() {
        return repository.findAll();
    }

    public Announcement findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new AppNotFoundException("Announcement not found with id: " + id));
    }

    public Announcement save(Announcement announcement) {
        return repository.save(announcement);
    }

    public Announcement update(Long id, Announcement announcementDetails) {
        Announcement existingAnnouncement = repository.findById(id)
                .orElseThrow(() -> new AppNotFoundException("Announcement not found with id: " + id));
        // Copy properties from details to existing
        // ...
        return repository.save(existingAnnouncement);
    }

    public void deleteById(Long id) {
        Announcement existingAnnouncement = repository.findById(id)
                .orElseThrow(() -> new AppNotFoundException("Announcement not found with id: " + id));
        repository.delete(existingAnnouncement);
    }

    public Page<AnnouncementCard> findAllPaginated(int page, int size, Long subjectId) {
        List<Sort.Order> sortOrders = new ArrayList<>();
        sortOrders.add(new Sort.Order(Sort.Direction.DESC, "promoted"));
        sortOrders.add(new Sort.Order(Sort.Direction.DESC, "createdDate"));

        Sort sort = Sort.by(sortOrders);
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        Page<Announcement> announcements = repository.findBySubjectId(subjectId, pageRequest);

        return announcements.map(this::announcementCardDto);
    }



    private AnnouncementCard announcementCardDto(Announcement announcement) {
        return AnnouncementCard.builder()
                .id(announcement.getId())
                .title(announcement.getTitle())
                .description(announcement.getDescription())
                .createdDate(announcement.getCreatedDate())
                .price(announcement.getPrice())
                .promoted(announcement.getPromoted())
                .city(announcement.getCity())
                .subject(announcement.getSubject().getName())
                .tutorId(announcement.getUser().getId())
                .tutorName(announcement.getUser().getTutorName())
                .build();
    }
}
