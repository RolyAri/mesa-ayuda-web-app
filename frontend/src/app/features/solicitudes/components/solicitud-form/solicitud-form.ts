import { Component, input, output, effect, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { Solicitud } from '../../../../core/models/solicitud.model';

@Component({
  selector: 'app-solicitud-form',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    Textarea,
    Select,
    ButtonModule
  ],
  templateUrl: './solicitud-form.html',
  styleUrl: './solicitud-form.scss'
})
export class SolicitudFormComponent {
  solicitud = input<Solicitud | null>(null);
  onSubmit = output<Solicitud>();
  onCancel = output<void>();

  form: FormGroup;
  isEditMode = signal(false);

  estadoOptions: string[] = ['Nuevo', 'En Proceso', 'Resuelto', 'Cerrado'];

  prioridadOptions: string[] = ['Baja', 'Media', 'Alta'];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      estado: ['Nuevo', Validators.required],
      prioridad: ['Media', Validators.required],
      solicitante: ['', Validators.required]
    });


    let previousSolicitudId: number | undefined = undefined;

    effect(() => {
      const solicitud = this.solicitud();
      const currentId = solicitud?.id;
      
      if (currentId !== previousSolicitudId) {
        previousSolicitudId = currentId;
        
        if (solicitud) {
          this.isEditMode.set(true);
          this.form.patchValue({
            titulo: solicitud.titulo,
            descripcion: solicitud.descripcion,
            estado: solicitud.estado,
            prioridad: solicitud.prioridad,
            solicitante: solicitud.solicitante
          });
        } else {
          this.isEditMode.set(false);
          this.form.reset({
            titulo: '',
            descripcion: '',
            estado: 'Nuevo',
            prioridad: 'Media'
          });
        }
      }
    });
  }

  handleSubmit(): void {
    if (this.form.valid) {
      this.onSubmit.emit(this.form.value);
      // Reiniciar formulario después del envío si se está creando uno nuevo (no editando)
      if (!this.isEditMode()) {
        this.form.reset({
          titulo: '',
          descripcion: '',
          estado: 'Nuevo',
          prioridad: 'Media',
          solicitante: ''
        });
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  handleCancel(): void {
    this.onCancel.emit();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return 'Este campo es requerido';
    if (field.errors['minlength']) {
      const minLength = field.errors['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    if (field.errors['maxlength']) {
      const maxLength = field.errors['maxlength'].requiredLength;
      return `Máximo ${maxLength} caracteres`;
    }

    return '';
  }
}
