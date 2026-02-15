package com.fabrica.helpdesk.repositories;

import com.fabrica.helpdesk.model.entities.Solicitud;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface SolicitudRepository extends JpaRepository<Solicitud, Long> {
    List<Solicitud> findByActivo(Boolean activo);
    @Query("""
        SELECT s FROM Solicitud s
        WHERE s.activo = :activo
        AND (
            :estado IS NULL 
            OR :estado = '' 
            OR s.estado = :estado
        )
        AND (
            :prioridad IS NULL 
            OR :prioridad = '' 
            OR s.prioridad = :prioridad
        )
    """)
    List<Solicitud> findByEstadoAndPrioridadAndActivo(String estado, String prioridad, Boolean activo);
}
