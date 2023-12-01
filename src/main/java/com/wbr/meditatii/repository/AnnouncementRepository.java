package com.wbr.meditatii.repository;

import com.wbr.meditatii.model.Announcement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    @Query("SELECT a FROM Announcement a WHERE (:subjectId IS NULL OR a.subject.id = :subjectId)")
    Page<Announcement> findBySubjectId(@Param("subjectId") Long subjectId, Pageable pageable);
}