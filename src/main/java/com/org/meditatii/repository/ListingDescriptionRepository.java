package com.org.meditatii.repository;

import com.org.meditatii.model.ListingDescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ListingDescriptionRepository extends JpaRepository<ListingDescription, Long> {
    @Query(value = "SELECT description FROM listing_descriptions WHERE subject_id = :subjectId ORDER BY RAND() LIMIT 1", nativeQuery = true)
    String findRandomBySubjectId(@Param("subjectId") Long subjectId);
}
