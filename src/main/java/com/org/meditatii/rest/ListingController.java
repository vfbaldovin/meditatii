package com.org.meditatii.rest;

import com.org.meditatii.model.Listing;
import com.org.meditatii.model.dto.ListingCard;
import com.org.meditatii.model.dto.ListingResponse;
import com.org.meditatii.service.ListingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/listing")
public class ListingController {

    private final ListingService listingService;

    @Autowired
    public ListingController(ListingService listingService) {
        this.listingService = listingService;
    }

    @GetMapping
    public ResponseEntity<List<Listing>> getAllListings() {
        List<Listing> listings = listingService.findAll();
        return ResponseEntity.ok(listings);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ListingResponse> getListingById(@PathVariable Long id) {
        return ResponseEntity.ok(listingService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Listing> createListing(@RequestBody Listing listing) {
        Listing createdListing = listingService.save(listing);
        return new ResponseEntity<>(createdListing, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Listing> updateListing(@PathVariable Long id,
                                                      @RequestBody Listing listing) {
        Listing updatedListing = listingService.update(id, listing);
        return ResponseEntity.ok(updatedListing);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteListing(@PathVariable Long id) {
        listingService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<ListingCard>> getAllListingPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam @Nullable Long subjectId,
            @RequestParam(defaultValue = "CREATED.DESC") String sort) {
        Page<ListingCard> listingPage =
                listingService.findAllPaginated(page, size, subjectId, sort);
        return ResponseEntity.ok(listingPage);
    }

}
