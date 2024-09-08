package com.org.meditatii.service;

import com.org.meditatii.exception.AppNotFoundException;
import com.org.meditatii.model.Listing;
import com.org.meditatii.model.dto.ListingCard;
import com.org.meditatii.model.dto.ListingResponse;
import com.org.meditatii.repository.ListingRepository;
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
public class ListingService {

    Logger log = LoggerFactory.getLogger(ListingService.class);
    private final ListingRepository repository;

    @Autowired
    public ListingService(ListingRepository repository) {
        this.repository = repository;
    }

    public List<Listing> findAll() {
        return repository.findAll();
    }

    public ListingResponse findById(Long id) {
        return this.listingResponse(repository.findById(id)
                .orElseThrow(() -> new AppNotFoundException("Listing not found with id: " + id)));
    }

    public Listing save(Listing listing) {
        return repository.save(listing);
    }

    public Listing update(Long id, Listing listingDetails) {
        Listing existingListing = repository.findById(id)
                .orElseThrow(() -> new AppNotFoundException("Listing not found with id: " + id));
        // Copy properties from details to existing
        // ...
        return repository.save(existingListing);
    }

    public void deleteById(Long id) {
        Listing existingListing = repository.findById(id)
                .orElseThrow(() -> new AppNotFoundException("Listing not found with id: " + id));
        repository.delete(existingListing);
    }

    public Page<ListingCard> findAllPaginated(int page, int size, Long subjectId, String priceSortDirection) {
        List<Sort.Order> sortOrders = new ArrayList<>();
        sortOrders.add(new Sort.Order(Sort.Direction.DESC, "promoted"));
        addOtherSorts(priceSortDirection, sortOrders);

        Sort sort = Sort.by(sortOrders);
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        Page<Listing> listings = repository.findBySubjectId(subjectId, pageRequest);

        return listings.map(this::listingsCard);
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


    private ListingCard listingsCard(Listing listing) {
        try {
            return ListingCard.builder()
                    .id(listing.getId())
                    .title(listing.getTitle())
                    .description(listing.getDescription())
                    .createdDate(listing.getCreatedDate())
                    .price(listing.getPrice())
                    .promoted(listing.getPromoted())
                    .city(listing.getCity())
                    .subject(listing.getSubject().getName())
                    .tutorId(listing.getUser().getId())
                    .tutorName(listing.getUser().getTutorName())
                    .build();
        }
        catch (Exception e) {
            log.error(e.getMessage());
            return ListingCard.builder().build();
        }
    }

    private ListingResponse listingResponse(Listing listing) {
        try {
            return ListingResponse.builder()
                    .id(listing.getId())
                    .title(listing.getTitle())
                    .description(listing.getDescription())
                    .createdDate(listing.getCreatedDate())
                    .price(listing.getPrice())
                    .promoted(listing.getPromoted())
                    .city(listing.getCity())
                    .county(listing.getCounty())
                    .area(listing.getArea())
                    .experience(listing.getExperience())
                    .online(listing.getOnline())
                    .studentHome(listing.getStudentHome())
                    .tutorHome(listing.getTutorHome())
                    .subject(listing.getSubject().getName())
                    .tutorId(listing.getUser().getId())
                    .tutorName(listing.getUser().getTutorName())
                    .phone(listing.getUser().getPhone())
                    .email(listing.getUser().getEmail())
                    .occupation(listing.getUser().getOccupation())
                    .education(listing.getUser().getEducation())
                    .age(listing.getUser().getAge())
                    .build();
        }
        catch (Exception e) {
            log.error(e.getMessage());
            return ListingResponse.builder().build();
        }
    }
}
