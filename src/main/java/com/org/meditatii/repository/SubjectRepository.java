package com.org.meditatii.repository;

import com.org.meditatii.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    @Query("SELECT DISTINCT s FROM Subject s JOIN s.listings")
    List<Subject> findSubjectsAttachedToListings();
}
