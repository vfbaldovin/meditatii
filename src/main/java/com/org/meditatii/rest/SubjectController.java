package com.org.meditatii.rest;

import com.org.meditatii.model.dto.SubjectSearch;
import com.org.meditatii.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/api/subject")
public class SubjectController {

    private final SubjectService service;

    @Autowired
    public SubjectController(SubjectService service) {
        this.service = service;
    }

    @GetMapping("/search")
    public ResponseEntity<List<SubjectSearch>> getSubjectSearch(@RequestParam(value = "q") String name) {
        return new ResponseEntity<>(service.getSubjectSearch(name), OK);
    }
}
