package com.org.meditatii.service;

import com.org.meditatii.exception.AppNotFoundException;
import com.org.meditatii.model.Announcement;
import com.org.meditatii.model.dto.AnnouncementCard;
import com.org.meditatii.model.dto.AnnouncementResponse;
import com.org.meditatii.repository.AnnouncementRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AnnouncementService {

    Logger log = LoggerFactory.getLogger(AnnouncementService.class);
    private final AnnouncementRepository repository;

    @Autowired
    public AnnouncementService(AnnouncementRepository repository) {
        this.repository = repository;
    }

    public List<Announcement> findAll() {
        return repository.findAll();
    }

    public AnnouncementResponse findById(Long id) {
        return this.announcementResponse(repository.findById(id)
                .orElseThrow(() -> new AppNotFoundException("Announcement not found with id: " + id)));
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

    public Page<AnnouncementCard> findAllPaginated(int page, int size, Long subjectId, String priceSortDirection) {
        List<Sort.Order> sortOrders = new ArrayList<>();
        sortOrders.add(new Sort.Order(Sort.Direction.DESC, "promoted"));
        addOtherSorts(priceSortDirection, sortOrders);

        Sort sort = Sort.by(sortOrders);
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        Page<Announcement> announcements = repository.findBySubjectId(subjectId, pageRequest);

        return announcements.map(this::announcementCard);
    }

    private void addOtherSorts(String priceSortDirection, List<Sort.Order> sortOrders) {
        switch (priceSortDirection) {
            case "PRICE.ASC":
                sortOrders.add(new Sort.Order(Sort.Direction.ASC, "price"));
                break;
            case "PRICE.DESC":
                sortOrders.add(new Sort.Order(Sort.Direction.DESC, "price"));
                break;
            default:
                sortOrders.add(new Sort.Order(Sort.Direction.DESC, "createdDate"));
        }
    }


    private AnnouncementCard announcementCard(Announcement announcement) {
        try {
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
        catch (Exception e) {
            log.error(e.getMessage());
            return AnnouncementCard.builder().build();
        }
    }

    private AnnouncementResponse announcementResponse(Announcement announcement) {
        try {
            return AnnouncementResponse.builder()
                    .id(announcement.getId())
                    .title(announcement.getTitle())
                    .description(announcement.getDescription())
                    .createdDate(announcement.getCreatedDate())
                    .price(announcement.getPrice())
                    .promoted(announcement.getPromoted())
                    .city(announcement.getCity())
                    .county(announcement.getCounty())
                    .area(announcement.getArea())
                    .experience(announcement.getExperience())
                    .online(announcement.getOnline())
                    .studentHome(announcement.getStudentHome())
                    .tutorHome(announcement.getTutorHome())
                    .subject(announcement.getSubject().getName())
                    .tutorId(announcement.getUser().getId())
                    .tutorName(announcement.getUser().getTutorName())
                    .phone(announcement.getUser().getPhone())
                    .email(announcement.getUser().getEmail())
                    .occupation(announcement.getUser().getOccupation())
                    .education(announcement.getUser().getEducation())
                    .age(announcement.getUser().getAge())
                    .build();
        }
        catch (Exception e) {
            log.error(e.getMessage());
            return AnnouncementResponse.builder().build();
        }
    }

}
