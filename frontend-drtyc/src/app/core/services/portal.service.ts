import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Noticia } from '../interfaces/noticia.model';
import { Resolucion } from '../interfaces/resolucion.model';
import { Convocatoria } from '../interfaces/convocatoria.model';

@Injectable({ providedIn: 'root' })
export class PortalService {

  private noticias: Noticia[] = [
    {
      id: 1,
      titulo: 'DRTC implementa nuevo sistema de fiscalización vehicular',
      resumen: 'La Dirección Regional de Transportes y Comunicaciones puso en marcha un sistema digital para la fiscalización de vehículos en la región, mejorando la eficiencia en los controles de tránsito.',
      fecha: '2026-09-10',
      imagen_url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800',
      slug: 'nuevo-sistema-fiscalizacion-vehicular'
    },
    {
      id: 2,
      titulo: 'Jornada de capacitación para conductores de transporte público',
      resumen: 'Se realizó una jornada de capacitación dirigida a conductores de transporte público sobre normas de seguridad vial y atención al usuario.',
      fecha: '2026-09-05',
      imagen_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800',
      slug: 'jornada-capacitacion-conductores'
    },
    {
      id: 3,
      titulo: 'Actualización del Registro Nacional de Vehículos Automotores',
      resumen: 'Se informa sobre la actualización del Registro Nacional de Vehículos Automotores, el cual entrará en vigencia a partir del próximo mes.',
      fecha: '2026-08-28',
      imagen_url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800',
      slug: 'actualizacion-registro-nacional-vehiculos'
    },
    {
      id: 4,
      titulo: 'Obras de mejoramiento en la vía La Oroya - Huancavelica',
      resumen: 'Se han iniciado las obras de mejoramiento de la vía La Oroya - Huancavelica,Beneficiando a miles de usuarios que diariamente transitan por esta ruta.',
      fecha: '2026-08-20',
      imagen_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
      slug: 'obras-mejoramiento-via-la-oroya-huancavelica'
    },
    {
      id: 5,
      titulo: 'Campaña de concienciación vial en instituciones educativas',
      resumen: 'La DRTC ejecutó una campaña de concienciación vial en 15 instituciones educativas de la región, alcanzando a más de 3,000 estudiantes.',
      fecha: '2026-08-15',
      imagen_url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800',
      slug: 'campana-concienciacion-vial-instituciones-educativas'
    }
  ];

  private resoluciones: Resolucion[] = [
    {
      id: 1,
      numero: '001-2026-DRTC/JUN',
      anio: 2026,
      descripcion: 'Aprueba el Reglamento de Funcionamiento de las Empresas de Transporte Público de Pasajeros en la Jurisdicción Regional.',
      fecha_publicacion: '2026-01-15',
      archivo_pdf_url: '/assets/docs/resolucion-001-2026.pdf'
    },
    {
      id: 2,
      numero: '002-2026-DRTC/JUN',
      anio: 2026,
      descripcion: 'Establece los lineamientos para la emisión de licencias de conducir categoría profesional y no profesional.',
      fecha_publicacion: '2026-02-20',
      archivo_pdf_url: '/assets/docs/resolucion-002-2026.pdf'
    },
    {
      id: 3,
      numero: '003-2026-DRTC/JUN',
      anio: 2026,
      descripcion: 'Modifica el Arancel de los Servicios Administrativos que otorga la Dirección Regional de Transportes y Comunicaciones.',
      fecha_publicacion: '2026-03-10',
      archivo_pdf_url: '/assets/docs/resolucion-003-2026.pdf'
    },
    {
      id: 4,
      numero: '001-2025-DRTC/JUN',
      anio: 2025,
      descripcion: 'Regula el funcionamiento de las plataformas digitales de transporte en la región.',
      fecha_publicacion: '2025-06-15',
      archivo_pdf_url: '/assets/docs/resolucion-001-2025.pdf'
    },
    {
      id: 5,
      numero: '002-2025-DRTC/JUN',
      anio: 2025,
      descripcion: 'Establece las condiciones técnicas para la habilitación de terminales de transporte.',
      fecha_publicacion: '2025-09-22',
      archivo_pdf_url: '/assets/docs/resolucion-002-2025.pdf'
    },
    {
      id: 6,
      numero: '003-2025-DRTC/JUN',
      anio: 2025,
      descripcion: 'Autoriza la implementación del corredor vial exclusivo para transporte público.',
      fecha_publicacion: '2025-11-05',
      archivo_pdf_url: '/assets/docs/resolucion-003-2025.pdf'
    }
  ];

  private convocatorias: Convocatoria[] = [
    {
      id: 1,
      titulo: 'Concurso Público de Méritos para cargos de Supervisión',
      fecha_inicio: '2026-09-01',
      fecha_fin: '2026-09-30',
      estado: 'Vigente',
      bases_url: '/assets/docs/bases-concurso-2026.pdf'
    },
    {
      id: 2,
      titulo: 'Selección de empresas para servicio de transporte interprovincial',
      fecha_inicio: '2026-08-15',
      fecha_fin: '2026-09-15',
      estado: 'Finalizada',
      bases_url: '/assets/docs/bases-seleccion-transporte.pdf'
    },
    {
      id: 3,
      titulo: 'Convocatoria para consultoría de estudio de demanda de transporte',
      fecha_inicio: '2026-10-01',
      fecha_fin: '2026-10-31',
      estado: 'Vigente',
      bases_url: '/assets/docs/bases-consultoria-transporte.pdf'
    },
    {
      id: 4,
      titulo: 'Proceso de habilitación de rutas de transporte rural',
      fecha_inicio: '2026-07-01',
      fecha_fin: '2026-08-01',
      estado: 'Finalizada',
      bases_url: '/assets/docs/bases-rutas-rurales.pdf'
    }
  ];

  // ===================== MÉTODOS =====================
  // NOTA: Para integrar con el Backend, reemplazar las líneas marcadas
  // con return this.http.get<Noticia[]>('/api/noticias');

  getNoticias(): Observable<Noticia[]> {
    // REEMPLAZAR CON: return this.http.get<Noticia[]>('/api/noticias');
    return of(this.noticias).pipe(delay(500));
  }

  getNoticiasRecientes(cantidad: number): Observable<Noticia[]> {
    return this.getNoticias().pipe(
      map(noticia => noticia.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).slice(0, cantidad))
    );
  }

  getResoluciones(): Observable<Resolucion[]> {
    // REEMPLAZAR CON: return this.http.get<Resolucion[]>('/api/resoluciones');
    return of(this.resoluciones).pipe(delay(500));
  }

  getResolucionesPorAnio(anio: number): Observable<Resolucion[]> {
    return this.getResoluciones().pipe(
      map(resoluciones => resoluciones.filter(r => r.anio === anio))
    );
  }

  getConvocatorias(): Observable<Convocatoria[]> {
    // REEMPLAZAR CON: return this.http.get<Convocatoria[]>('/api/convocatorias');
    return of(this.convocatorias).pipe(delay(500));
  }

  getConvocatoriasVigentes(): Observable<Convocatoria[]> {
    return this.getConvocatorias().pipe(
      map(convocatorias => convocatorias.filter(c => c.estado === 'Vigente'))
    );
  }
}
