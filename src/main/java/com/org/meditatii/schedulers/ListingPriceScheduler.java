package com.org.meditatii.schedulers;

import com.org.meditatii.model.Listing;
import com.org.meditatii.repository.ListingRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class ListingPriceScheduler {

    private final ListingRepository listingRepository;

    // Public static map to hold median prices for external access
    public static Map<Long, Integer> medianPricesBySubject = new HashMap<>();

    public ListingPriceScheduler(ListingRepository listingRepository) {
        this.listingRepository = listingRepository;
    }

    // Run the scheduler every 6 hours
    @Scheduled(fixedRate = 21600000)
    public void calculateMedianPrices() {
        // Retrieve all listings
        List<Listing> listings = listingRepository.findAll();

        // Group listings by subject ID
        Map<Long, List<Listing>> listingsBySubject = listings.stream()
                .filter(listing -> listing.getPrice() != null)  // Ensure price is not null
                .collect(Collectors.groupingBy(listing -> listing.getSubject().getId()));

        // Create a temporary map to store the median prices during this execution
        Map<Long, Integer> tempMedianPricesBySubject = new HashMap<>();

        // Iterate over each group and calculate the median price
        for (Map.Entry<Long, List<Listing>> entry : listingsBySubject.entrySet()) {
            Long subjectId = entry.getKey();
            List<Listing> subjectListings = entry.getValue();

            // Extract the prices and sort them
            List<Integer> prices = subjectListings.stream()
                    .map(Listing::getPrice)
                    .sorted()
                    .collect(Collectors.toList());

            // Calculate the median price
            int medianPrice = calculateMedian(prices);

            // Round the median to the nearest number divisible by 10
            int roundedMedianPrice = roundToNearestTen(medianPrice);

            // Store the result in the temporary map
            tempMedianPricesBySubject.put(subjectId, roundedMedianPrice);
        }

        // Update the public map after all calculations
        medianPricesBySubject = tempMedianPricesBySubject;

        // Output the map or do further processing with the result
        System.out.println("Median Prices by Subject ID: " + medianPricesBySubject);
    }

    // Method to calculate the median of a list of prices
    private int calculateMedian(List<Integer> prices) {
        int size = prices.size();
        if (size == 0) {
            return 0;  // No listings, return 0
        }
        if (size % 2 == 1) {
            return prices.get(size / 2);  // Odd size, take the middle element
        } else {
            int middle1 = prices.get((size / 2) - 1);
            int middle2 = prices.get(size / 2);
            return (middle1 + middle2) / 2;  // Even size, take the average of the two middle elements
        }
    }

    // Method to round a number to the nearest multiple of 10
    private int roundToNearestTen(int number) {
        return ((number + 5) / 10) * 10;
    }
}
