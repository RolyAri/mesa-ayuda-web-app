package com.fabrica.helpdesk.controllers;

import com.fabrica.helpdesk.model.dto.ApiResponse;
import com.fabrica.helpdesk.model.dto.SolicitudDTO;
import com.fabrica.helpdesk.model.entities.Solicitud;
import com.fabrica.helpdesk.services.SolicitudService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/solicitudes")
public class SolicitudController {
    @Autowired
    private SolicitudService solicitudService;

    @GetMapping
    private ResponseEntity<?> obtenerSolicitudes(){
        List<SolicitudDTO> soicitudes = this.solicitudService.listarSolicitudes();
        return ResponseEntity.ok(new ApiResponse<>(true, "Solicitudes encontradas", soicitudes));
    }

    @GetMapping("/{id}")
    private ResponseEntity<?> obtenerSoliciudPorId(@PathVariable Long id) {
        SolicitudDTO solicitud = this.solicitudService.obtenerSolicitudPorId(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Solicitud encontrada", solicitud));
    }

    @GetMapping(params = {"estado", "prioridad"})
    private ResponseEntity<?> filtrarPorEstadoPrioridad(@RequestParam String estado, @RequestParam String prioridad) {
        List<SolicitudDTO> solicitudes = this.solicitudService.filtrarPorEstadoPrioridad(estado, prioridad);
        return ResponseEntity.ok(new ApiResponse<>(true, "Solicitudes encontradas", solicitudes));
    }

    @PostMapping
    private ResponseEntity<?> crearSolicitud(@Valid @RequestBody SolicitudDTO solicitudDTO){
        SolicitudDTO solicitudCreada = this.solicitudService.crearSolicitud(solicitudDTO);
        return ResponseEntity.status(201).body(new ApiResponse<>(true, "Solicitud creada", solicitudCreada));
    }

    @PutMapping("/{id}")
    private ResponseEntity<?> actualizarSolicitud(@PathVariable Long id, @RequestBody SolicitudDTO solicitudDTO){
        SolicitudDTO solicitudActualizada = this.solicitudService.actualizarSolicitud(id, solicitudDTO);
        return ResponseEntity.ok(new ApiResponse<>(true, "Solicitud actualizada", solicitudActualizada));
    }

    @DeleteMapping("/{id}")
    private ResponseEntity<?> eliminarSolicitud(@PathVariable Long id) {
        this.solicitudService.eliminarSolicitud(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Solicitud eliminada", null));
    }


}
