package com.org.meditatii.repository;

import com.org.meditatii.model.Listing;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ListingRepository extends JpaRepository<Listing, Long> {
    @Query("SELECT a FROM Listing a WHERE (:subjectId IS NULL OR a.subject.id = :subjectId) ORDER BY a.promotionDate DESC")
    Page<Listing> findBySubjectId(@Param("subjectId") Long subjectId, Pageable pageable);
    List<Listing> findByUserId(Long id);
    @Query("SELECT l FROM Listing l WHERE l.id = :id AND l.user.email = :username")
    Optional<Listing> findByIdAndUsername(@Param("id") Long id, @Param("username") String username);


}