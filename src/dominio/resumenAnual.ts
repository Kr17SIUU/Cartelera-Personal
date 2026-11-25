import { ItemLista } from '../types';

export interface ResumenAnual {
  anio: number;
  totalObras: number;
  peliculas: number;
  series: number;
  horas: number;
  peliculasSinDuracion: number;
  obrasSinDatos: number;
  generoTop: { nombre: string; obras: number } | null;
  directorTop: { nombre: string; obras: number } | null;
  obrasPorMes: number[];
  mesTop: number | null;
  destacada: ItemLista | null;
}

function fecha(item: ItemLista): Date | null {
  if (item.estado !== 'vista' || !item.vistaEn) return null;
  const value = new Date(item.vistaEn);
  return Number.isFinite(value.getTime()) ? value : null;
}

export function aniosDisponibles(items: ItemLista[], anioActual: number): number[] {
  const years = new Set([anioActual]);
  for (const item of items) {
    const value = fecha(item);
    if (value) years.add(value.getFullYear());
  }
  return [...years].sort((a, b) => b - a);
}

function superior(items: ItemLista[], nombres: (item: ItemLista) => string[]): { nombre: string; obras: number } | null {
  const grupos = new Map<string, { cantidad: number; total: number; calificadas: number }>();
  for (const item of items) {
    for (const nombre of new Set(nombres(item).filter(Boolean))) {
      const previous = grupos.get(nombre) ?? { cantidad: 0, total: 0, calificadas: 0 };
      previous.cantidad++;
      if (item.calificacionPersonal !== null) {
        previous.total += item.calificacionPersonal;
        previous.calificadas++;
      }
      grupos.set(nombre, previous);
    }
  }
  const sorted = [...grupos.entries()].sort(([nameA, a], [nameB, b]) =>
    b.cantidad - a.cantidad ||
    (b.calificadas ? b.total / b.calificadas : -1) - (a.calificadas ? a.total / a.calificadas : -1) ||
    nameA.localeCompare(nameB, 'es'));
  return sorted.length ? { nombre: sorted[0][0], obras: sorted[0][1].cantidad } : null;
}

export function resumenAnual(items: ItemLista[], anio: number): ResumenAnual {
  const vistas = items.filter(item => fecha(item)?.getFullYear() === anio);
  const peliculas = vistas.filter(item => item.tipo === 'movie');
  const meses = Array.from({ length: 12 }, () => 0);
  for (const item of vistas) {
    const value = fecha(item);
    if (value) meses[value.getMonth()]++;
  }
  const puntuadas = vistas.filter(item => item.calificacionPersonal !== null).sort((a, b) =>
    (b.calificacionPersonal ?? 0) - (a.calificacionPersonal ?? 0) ||
    (fecha(b)?.getTime() ?? 0) - (fecha(a)?.getTime() ?? 0));
  const max = Math.max(...meses);
  const minutos = peliculas.reduce((sum, item) => sum + (item.duracionMin ?? 0), 0);
  return {
    anio, totalObras: vistas.length, peliculas: peliculas.length, series: vistas.length - peliculas.length,
    horas: Math.round(minutos / 6) / 10,
    peliculasSinDuracion: peliculas.filter(item => !item.duracionMin).length,
    obrasSinDatos: vistas.filter(item => !item.generos || !item.directores || item.duracionMin === undefined).length,
    generoTop: superior(vistas, item => item.generos ?? []),
    directorTop: superior(peliculas, item => item.directores ?? []),
    obrasPorMes: meses, mesTop: max ? meses.lastIndexOf(max) : null,
    destacada: puntuadas[0] ?? null,
  };
}
