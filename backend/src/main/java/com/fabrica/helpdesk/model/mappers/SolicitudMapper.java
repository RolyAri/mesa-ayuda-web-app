package com.fabrica.helpdesk.model.mappers;

import com.fabrica.helpdesk.model.dto.SolicitudDTO;
import com.fabrica.helpdesk.model.entities.Solicitud;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SolicitudMapper {

    Solicitud toEntity(SolicitudDTO dto);

    SolicitudDTO toDTO(Solicitud entity);
}
