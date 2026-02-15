import { Component, signal, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { Solicitud, SolicitudFilters } from '../../core/models/solicitud.model';
import { SolicitudesService } from '../../core/services/solicitud/solicitudes.service';
import { SolicitudFormComponent } from './components/solicitud-form/solicitud-form';

interface DropdownOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-solicitudes',
  imports: [
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    Select,
    DatePicker,
    DialogModule,
    TagModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule,
    DatePipe,
    SolicitudFormComponent
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './solicitudes.html',
  styleUrl: './solicitudes.scss',
})
export class Solicitudes implements OnInit {
  private solicitudesService = inject(SolicitudesService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  solicitudes = signal<Solicitud[]>([]);
  loading = signal(false);
  
  // Estados del diálogo
  showFormDialog = signal(false);
  selectedSolicitud = signal<Solicitud | null>(null);
  
  // Filtros
  filters = signal<SolicitudFilters>({});
  filtroTitulo = signal('');
  filtroEstado = signal<string | undefined>(undefined);
  filtroPrioridad = signal<string | undefined>(undefined);
  filtroFechaDesde = signal<Date | undefined>(undefined);
  filtroFechaHasta = signal<Date | undefined>(undefined);

  estadoOptions: DropdownOption[] = [
    { label: 'Todos', value: '' },
    { label: 'Nuevo', value: 'Nuevo' },
    { label: 'En Proceso', value: 'En Proceso' },
    { label: 'Resuelto', value: 'Resuelto' },
    { label: 'Cerrado', value: 'Cerrado' }
  ];

  prioridadOptions: DropdownOption[] = [
    { label: 'Todas', value: '' },
    { label: 'Baja', value: 'Baja' },
    { label: 'Media', value: 'Media' },
    { label: 'Alta', value: 'Alta' }
  ];

  ngOnInit(): void {
    this.loadSolicitudes();
    
    // Verificar si hay parámetro de consulta para editar
    this.route.queryParams.subscribe(params => {
      if (params['edit']) {
        const id = Number(params['edit']);
        this.solicitudesService.getSolicitudById(id).subscribe(response => {
          if (response.data) {
            this.openEditDialog(response.data);
          }
        });
      }
    });
  }

  loadSolicitudes(): void {
    this.loading.set(true);
    this.solicitudesService.getSolicitudes().subscribe({
      next: (response) => {
        this.solicitudes.set(response.data);
        this.loading.set(false);
        this.applyFilters();
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  applyFilters(): void {
    this.loading.set(true);
    
    const estado = this.filtroEstado();
    const prioridad = this.filtroPrioridad();
    
    // Construir objeto de filtros para el backend (solo estado y prioridad son soportados)
    const filters: SolicitudFilters = {};
    if (estado) {
      filters.estado = estado;
    }
    if (prioridad) {
      filters.prioridad = prioridad;
    }
    
    this.solicitudesService.filterSolicitudes(filters).subscribe({
      next: (response) => {
        let filtered = response.data;
        
        // Aplicar filtros del lado del cliente para título y fechas (no soportados por el backend)
        const titulo = this.filtroTitulo();
        if (titulo && titulo.trim()) {
          filtered = filtered.filter(s => 
            s.titulo.toLowerCase().includes(titulo.toLowerCase())
          );
        }
        
        // Filtrar por fecha desde
        const fechaDesde = this.filtroFechaDesde();
        if (fechaDesde) {
          filtered = filtered.filter(s => {
            const fechaCreacion = new Date(s.fechaCreacion);
            fechaCreacion.setHours(0, 0, 0, 0);
            return fechaCreacion.getTime() >= fechaDesde.getTime();
          });
        }
        
        // Filtrar por fecha hasta
        const fechaHasta = this.filtroFechaHasta();
        if (fechaHasta) {
          filtered = filtered.filter(s => {
            const fechaCreacion = new Date(s.fechaCreacion);
            fechaCreacion.setHours(0, 0, 0, 0);
            return fechaCreacion.getTime() <= fechaHasta.getTime();
          });
        }
        
        this.solicitudes.set(filtered);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  clearFilters(): void {
    this.filtroTitulo.set('');
    this.filtroEstado.set(undefined);
    this.filtroPrioridad.set(undefined);
    this.filtroFechaDesde.set(undefined);
    this.filtroFechaHasta.set(undefined);
    this.loadSolicitudes();
  }

  openCreateDialog(): void {
    this.selectedSolicitud.set(null);
    this.showFormDialog.set(true);
  }

  openEditDialog(solicitud: Solicitud): void {
    this.selectedSolicitud.set(solicitud);
    this.showFormDialog.set(true);
  }

  closeFormDialog(): void {
    this.showFormDialog.set(false);
    this.selectedSolicitud.set(null);
    // Limpiar parámetros de consulta
    this.router.navigate([], {
      queryParams: {},
      queryParamsHandling: 'merge'
    });
  }

  handleFormSubmit(formData: Solicitud): void {
    const currentSolicitud = this.selectedSolicitud();
    
    if (currentSolicitud) {
      // Actualizar existente
      this.solicitudesService.updateSolicitud(currentSolicitud.id, formData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Solicitud actualizada correctamente'
          });
          this.closeFormDialog();
          this.loadSolicitudes();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'No se pudo actualizar la solicitud'
          });
          console.error('Error al actualizar solicitud:', err);
        }
      });
    } else {
      // Crear nuevo
      this.solicitudesService.createSolicitud(formData as Omit<Solicitud, 'id' | 'fechaCreacion' | 'fechaActualizacion'>).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Solicitud creada exitosamente'
          });
          this.closeFormDialog();
          
          this.loadSolicitudes();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'No se pudo crear la solicitud'
          });
          console.error('Error al crear solicitud:', err);
        }
      });
    }
  }

  viewDetail(solicitud: Solicitud): void {
    this.router.navigate(['/solicitudes', solicitud.id]);
  }

  deleteSolicitud(solicitud: Solicitud): void {
    this.confirmationService.confirm({
      message: `¿Está seguro que desea eliminar la solicitud "${solicitud.titulo}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.solicitudesService.deleteSolicitud(solicitud.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Solicitud eliminada correctamente'
            });
            this.loadSolicitudes();
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar la solicitud'
            });
            console.error('Error al eliminar solicitud:', err);
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
