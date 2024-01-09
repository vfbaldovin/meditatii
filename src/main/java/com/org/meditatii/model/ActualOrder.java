package com.org.meditatii.model;

import lombok.Data;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "actual_order")
public class ActualOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_order")
    private Long idOrder;

    @Column(name = "id_anunt", insertable = false, updatable = false)
    private Long idAnunt;

    @Column(name = "id_perioada")
    private Integer idPerioada;

    @Column(name = "data_order")
    private LocalDateTime dataOrder;

    @Column(name = "done")
    private Boolean done;

}
