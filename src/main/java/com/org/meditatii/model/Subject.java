package com.org.meditatii.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;

@Data
@Entity
@Table(name = "subject")
public class Subject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "subject_category_id", referencedColumnName = "id")
    private SubjectCategory subjectCategory;

    @OneToMany(mappedBy = "subject")
    private Set<Listing> listings;
}