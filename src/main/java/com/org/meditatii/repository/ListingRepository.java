package com.org.meditatii.repository;

import com.org.meditatii.model.Listing;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ListingRepository extends JpaRepository<Listing, Long> {
    @Query("SELECT a FROM Listing a WHERE (:subjectId IS NULL OR a.subject.id = :subjectId) ORDER BY a.promotionDate DESC")
    Page<Listing> findBySubjectId(@Param("subjectId") Long subjectId, Pageable pageable);
    List<Listing> findByUserId(Long id);
}