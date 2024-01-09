package com.org.meditatii.model.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SubjectSearch {
    private Long id;
    private String name;
}
