import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Solicitud, SolicitudFilters } from '../../models/solicitud.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/ApiResponse.model';

@Injectable({
  providedIn: 'root',
})
export class SolicitudesService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiBaseUrl;

  getSolicitudes(): Observable<ApiResponse<Solicitud[]>> {
    return this.http.get<ApiResponse<Solicitud[]>>(`${this.API_URL}/solicitudes`);
  }
  getSolicitudById(id: number): Observable<ApiResponse<Solicitud | undefined>> {
    return this.http.get<ApiResponse<Solicitud>>(`${this.API_URL}/solicitudes/${id}`);
  }

  createSolicitud(solicitud: Omit<Solicitud, 'id' | 'fechaCreacion' | 'fechaActualizacion'>): Observable<ApiResponse<Solicitud>> {
    return this.http.post<ApiResponse<Solicitud>>(`${this.API_URL}/solicitudes`, solicitud);
  }

  updateSolicitud(id: number, solicitud: Solicitud): Observable<ApiResponse<Solicitud | null>> {
    return this.http.put<ApiResponse<Solicitud>>(`${this.API_URL}/solicitudes/${id}`, solicitud);
  }

  deleteSolicitud(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.API_URL}/solicitudes/${id}`);
  }

  filterSolicitudes(filters: SolicitudFilters): Observable<ApiResponse<Solicitud[]>> {
    return this.http.get<ApiResponse<Solicitud[]>>(`${this.API_URL}/solicitudes?estado=${filters.estado ?? ''}&prioridad=${filters.prioridad ?? ''}`);
  }

}
