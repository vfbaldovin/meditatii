package com.org.meditatii.service;

import com.org.meditatii.exception.AppException;
import com.org.meditatii.exception.AppNotFoundException;
import com.org.meditatii.model.Listing;
import com.org.meditatii.model.User;
import com.org.meditatii.model.dto.ListingCard;
import com.org.meditatii.model.dto.ListingCreateRequest;
import com.org.meditatii.model.dto.ListingResponse;
import com.org.meditatii.model.dto.ListingUpdateRequest;
import com.org.meditatii.repository.ListingDescriptionRepository;
import com.org.meditatii.repository.ListingRepository;
import com.org.meditatii.repository.SubjectRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class ListingService {

    private final Logger log = LoggerFactory.getLogger(ListingService.class);
    private final ListingRepository repository;
    private final ListingDescriptionRepository descriptionRepository;
    private final AuthService authService;
    private final SubjectRepository subjectRepository;

    public ListingService(ListingRepository repository, ListingDescriptionRepository descriptionRepository, AuthService authService, SubjectRepository subjectRepository) {
        this.repository = repository;
        this.descriptionRepository = descriptionRepository;
        this.authService = authService;
        this.subjectRepository = subjectRepository;
    }

    public List<Listing> findAll() {
        return repository.findAll();
    }

    public ListingResponse findById(Long id, String username) {
            Listing listing = repository.findByIdAndUsername(id, username)
                    .orElseThrow(() -> new AppNotFoundException("Listing not found or access denied for id: " + id));
            return listingResponse(listing);
    }

    public ListingResponse findById(Long id) {
        Listing listing = repository.findById(id)
                .orElseThrow(() -> new AppNotFoundException("Listing not found or access denied for id: " + id));
        return listingResponse(listing);
    }

    public Listing save(Listing listing) {
        return repository.save(listing);
    }

    public Long createListing(ListingCreateRequest request) {
        User user = authService.getCurrentUser();
        Listing listing = new Listing();
        listing.setUser(user);
        listing.setSubject(subjectRepository.findById(request.subjectId()).orElseThrow(
                () -> new AppNotFoundException("Subject not found with id: " + request.subjectId())
        ));
        listing.setDescription(request.description());
        listing.setPrice(request.price());
        listing.setViews(0L);
        listing.setPromoted(false);
        listing.setRefreshDate(LocalDateTime.now());
        return save(listing).getId();
    }

    public void deleteById(Long id) {
        User user = authService.getCurrentUser();
        Listing existingListing = repository.findById(id)
                .orElseThrow(() -> new AppNotFoundException("Listing not found with id: " + id));
        if (!user.getId().equals(existingListing.getUser().getId())) {
            throw new AppException("Access denied");
        }
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

    public void streamDescription(Long subjectId, HttpServletResponse response) throws IOException {
        User user = authService.getCurrentUser();
        String description = descriptionRepository.findRandomBySubjectId(subjectId)
                .replace("{name}", user.getFullName())
                .replace("{experience}", user.getExperience() == null ? "5" : user.getExperience());

        // Set the response content type (with UTF-8 charset)
        response.setContentType("text/plain; charset=UTF-8");
        response.setCharacterEncoding("UTF-8");

        // Fetch the OutputStream
        try (OutputStream outputStream = response.getOutputStream()) {
            byte[] utf8Bytes = description.getBytes(StandardCharsets.UTF_8); // Convert string to UTF-8 bytes

            // Stream the description byte by byte or in small chunks (UTF-8 safe)
            for (byte utf8Byte : utf8Bytes) {
                outputStream.write(utf8Byte);
                outputStream.flush();  // Flush the output after writing each byte
                try {
                    Thread.sleep(new Random().nextInt(25));  // Simulate some delay
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        } catch (IOException e) {
//            log.error(e.getMessage());
        }
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
                    .city(listing.getUser().getCity())
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
                    .city(listing.getUser().getCity())
                    .county(listing.getCounty())
                    .area(listing.getArea())
                    .experience(listing.getUser().getExperience())
                    .online(listing.getOnline())
                    .studentHome(listing.getStudentHome())
                    .tutorHome(listing.getTutorHome())
                    .subjectId(listing.getSubject().getId())
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

    public void update(ListingUpdateRequest listingRequest) {
        Listing listing = repository.findById(listingRequest.listingId()).orElseThrow(() -> new AppNotFoundException("Listing not found"));
        User user = authService.getCurrentUser();
        if (!user.getId().equals(listing.getUser().getId())) {
            throw new AppException("Access denied");
        }
        listing.setDescription(listingRequest.description());
        listing.setPrice(listingRequest.price());
        repository.save(listing);
    }

}
