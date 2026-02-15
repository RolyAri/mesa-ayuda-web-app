package com.fabrica.helpdesk.model.dto;

import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record SolicitudDTO (
        Long id,
        @Size(min = 5, message = "El título debe tener al menos 5 caracteres")
        String titulo,
        @Size(min = 10, message = "La descripción debe tener al menos 10 caracteres")
        String descripcion,
        String prioridad,
        String estado,
        String solicitante,
        Boolean activo,
        LocalDateTime fechaCreacion,
        LocalDateTime fechaActualizacion
) {
}
