package com.wbr.meditatii.service;

import com.wbr.meditatii.model.Subject;
import com.wbr.meditatii.model.dto.SubjectSearch;
import com.wbr.meditatii.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

import static com.wbr.meditatii.utils.AppUtils.removeDiacritics;

@Service
public class SubjectService {

    private final SubjectRepository repository;

    @Autowired
    public SubjectService(SubjectRepository repository) {
        this.repository = repository;
    }

    public List<SubjectSearch> getSubjectSearch(String name) {
        if (!StringUtils.hasLength(name) || name.length() < 2) {
            return Collections.emptyList();
        }

        String normalizedInputName = removeDiacritics(name.toLowerCase());

        return this.repository.findSubjectsAttachedToAnnouncements().stream()
                .map(this::getSubjectSearch)
                .filter(value -> removeDiacritics(value.getName().toLowerCase()).contains(normalizedInputName))
                .collect(Collectors.toList());
    }

    private SubjectSearch getSubjectSearch(Subject subject) {
        return SubjectSearch.builder()
                .id(subject.getId())
                .name(subject.getName())
                .build();
    }
}
