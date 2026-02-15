package com.fabrica.helpdesk.services;

import com.fabrica.helpdesk.exceptions.ResourceNotFoundException;
import com.fabrica.helpdesk.exceptions.SolicitudCerradaException;
import com.fabrica.helpdesk.model.dto.SolicitudDTO;
import com.fabrica.helpdesk.model.entities.Solicitud;
import com.fabrica.helpdesk.model.mappers.SolicitudMapper;
import com.fabrica.helpdesk.repositories.SolicitudRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SolicitudService {
    @Autowired
    private SolicitudRepository solicitudRepository;
    @Autowired
    private SolicitudMapper solicitudMapper;

    public SolicitudDTO actualizarSolicitud(Long id, SolicitudDTO solicitudDTO) {
        Solicitud existente = solicitudRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Solicitud no encontrada con id: " + id)
        );
        Solicitud solicitudActualizada = solicitudMapper.toEntity(solicitudDTO);

        // Validar bloqueo de estado Cerrado
        if ("Cerrado".equals(existente.getEstado()) && !solicitudActualizada.getEstado().equals("Cerrado")) {
            throw new SolicitudCerradaException("No se puede cambiar el estado de una solicitud Cerrada");
        }

        existente.setTitulo(solicitudActualizada.getTitulo());
        existente.setDescripcion(solicitudActualizada.getDescripcion());
        existente.setEstado(solicitudActualizada.getEstado());
        existente.setSolicitante(solicitudActualizada.getSolicitante());
        existente.setPrioridad(solicitudActualizada.getPrioridad());


        return this.solicitudMapper.toDTO(solicitudRepository.save(existente));
    }

    public SolicitudDTO crearSolicitud(SolicitudDTO solicitudDTO) {
        Solicitud solicitudEntity = this.solicitudMapper.toEntity(solicitudDTO);
        Solicitud solicitudCreada = this.solicitudRepository.save(solicitudEntity);
        return this.solicitudMapper.toDTO(solicitudCreada);
    }

    public List<SolicitudDTO> listarSolicitudes() {
        List<Solicitud> solicitudes = this.solicitudRepository.findByActivo(true);
        List<SolicitudDTO> solicitudesDTO = solicitudes.stream().map(solicitud -> {
            return this.solicitudMapper.toDTO(solicitud);
        }).collect(Collectors.toList());
        return solicitudesDTO;
    }

    public void eliminarSolicitud(Long id) {
        Solicitud existente = solicitudRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Solicitud no encontrada con id: " + id)
        );
        existente.setActivo(false);
        solicitudRepository.save(existente);
    }

    public List<SolicitudDTO> filtrarPorEstadoPrioridad(String estado, String prioridad) {
        List<Solicitud> solicitudes = solicitudRepository.findByEstadoAndPrioridadAndActivo(estado, prioridad, true);
        List<SolicitudDTO> solicitudesDTO = solicitudes.stream().map(solicitud -> {
            return this.solicitudMapper.toDTO(solicitud);
        }).collect(Collectors.toList());
        return solicitudesDTO;
    }

    public SolicitudDTO obtenerSolicitudPorId(Long id) {
        Solicitud solicitud = solicitudRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Solicitud no encontrada con id: " + id)
        );
        return this.solicitudMapper.toDTO(solicitud);
    }
}
