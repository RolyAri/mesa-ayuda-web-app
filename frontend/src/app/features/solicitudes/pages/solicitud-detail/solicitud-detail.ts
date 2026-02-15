import { Component, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { Solicitud } from '../../../../core/models/solicitud.model';
import { SolicitudesService } from '../../../../core/services/solicitud/solicitudes.service';

@Component({
  selector: 'app-solicitud-detail',
  imports: [
    CardModule,
    ButtonModule,
    TagModule,
    ConfirmDialogModule,
    DatePipe
  ],
  providers: [ConfirmationService],
  templateUrl: './solicitud-detail.html',
  styleUrl: './solicitud-detail.scss'
})
export class SolicitudDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private solicitudesService = inject(SolicitudesService);
  private confirmationService = inject(ConfirmationService);

  solicitud = signal<Solicitud | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadSolicitud(id);
    }
  }

  loadSolicitud(id: number): void {
    this.loading.set(true);
    this.solicitudesService.getSolicitudById(id).subscribe({
      next: (response) => {
        this.solicitud.set(response.data || null);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/solicitudes']);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/solicitudes']);
  }

  editSolicitud(): void {
    const solicitud = this.solicitud();
    if (solicitud) {
      this.router.navigate(['/solicitudes'], { 
        queryParams: { edit: solicitud.id } 
      });
    }
  }

  deleteSolicitud(): void {
    const solicitud = this.solicitud();
    if (!solicitud) return;

    this.confirmationService.confirm({
      message: `¿Está seguro que desea eliminar la solicitud "${solicitud.titulo}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.solicitudesService.deleteSolicitud(solicitud.id).subscribe({
          next: () => {
            this.router.navigate(['/solicitudes']);
          }
        });
      }
    });
  }

  getEstadoSeverity(estado: string): 'success' | 'info' | 'warn' | 'danger' {
    switch (estado) {
      case 'Resuelto':
        return 'success';
      case 'En Proceso':
        return 'info';
      case 'Nuevo':
        return 'warn';
      case 'Cerrado':
        return 'danger';
      default:
        return 'info';
    }
  }

  getPrioridadSeverity(prioridad: string): 'success' | 'info' | 'warn' | 'danger' {
    switch (prioridad) {
      case 'Baja':
        return 'success';
      case 'Media':
        return 'info';
      case 'Alta':
        return 'warn';
      default:
        return 'info';
    }
  }

  getEstadoLabel(estado: string): string {
    const labels: Record<string, string> = {
      'Nuevo': 'Nuevo',
      'En Proceso': 'En Proceso',
      'Resuelto': 'Resuelto',
      'Cerrado': 'Cerrado'
    };
    return labels[estado];
  }

  getPrioridadLabel(prioridad: string): string {
    const labels: Record<string, string> = {
      'Baja': 'Baja',
      'Media': 'Media',
      'Alta': 'Alta'
    };
    return labels[prioridad];
  }
}
