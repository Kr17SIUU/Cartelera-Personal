import assert from 'node:assert/strict';
import { test } from 'node:test';
import { aniosDisponibles, resumenAnual } from '../src/dominio/resumenAnual';
import { ItemLista } from '../src/types';
function obra(id: number, fecha: string | null, extra: Partial<ItemLista> = {}): ItemLista {
  return { id: `movie_${id}`, tmdbId: id, tipo: 'movie', titulo: `Obra ${id}`, anio: '2025', posterPath: null,
    estado: 'vista', calificacionPersonal: null, comentario: '', agregadoEn: '2025-01-01T00:00:00Z',
    actualizadoEn: '2025-01-01T00:00:00Z', vistaEn: fecha && fecha.length === 10 ? `${fecha}T12:00:00` : fecha, generos: [], duracionMin: null, directores: [], ...extra };
}
test('D3 y D4: años locales únicos con el actual, sin obras no vistas', () => {
  const a = obra(1, '2025-08-01T13:00:00Z');
  assert.deepEqual(aniosDisponibles([a, obra(2, '2024-09-03T10:00:00Z'), { ...a, estado: 'por_ver' }], 2026), [2026, 2025, 2024]);
  assert.equal(resumenAnual([a], 2024).totalObras, 0);
});
test('D7: películas suman duración, series no y las faltantes se registran', () => {
  const items = [obra(1, '2025-01-01', { duracionMin: 105 }), obra(2, '2025-01-02'),
    obra(3, '2025-01-03', { tipo: 'tv', id: 'tv_3', duracionMin: null })];
  const r = resumenAnual(items, 2025);
  assert.equal(r.totalObras, 3); assert.equal(r.peliculas, 2); assert.equal(r.series, 1);
  assert.equal(r.horas, 1.8); assert.equal(r.peliculasSinDuracion, 1);
});
test('D8: desempate de géneros por promedio y alfabeto', () => {
  const a = obra(1, '2025-02-01', { generos: ['Drama', 'Acción'], calificacionPersonal: 3 });
  const b = obra(2, '2025-02-02', { generos: ['Acción'], calificacionPersonal: 5 });
  const d = obra(3, '2025-02-03', { generos: ['Drama'], calificacionPersonal: 2 });
  assert.deepEqual(resumenAnual([a, b, d], 2025).generoTop, { nombre: 'Acción', obras: 2 });
  assert.equal(resumenAnual([obra(4, '2025-01-01', { generos: ['Zeta', 'Alfa'] })], 2025).generoTop?.nombre, 'Alfa');
});
test('D9: solo películas participan en directores', () => {
  const a = obra(1, '2025-01-01', { directores: ['Ana'] });
  const b = obra(2, '2025-01-01', { id: 'tv_2', tipo: 'tv', directores: ['Beto'] });
  assert.equal(resumenAnual([a, b], 2025).directorTop?.nombre, 'Ana');
  assert.equal(resumenAnual([b], 2025).directorTop, null);
});
test('D10: muestra 12 meses, empate gana el último', () => {
  const r = resumenAnual([obra(1, '2025-01-01'), obra(2, '2025-12-01')], 2025);
  assert.equal(r.obrasPorMes.length, 12); assert.equal(r.obrasPorMes[1], 0); assert.equal(r.mesTop, 11);
});
test('D11: destacada mayor nota y luego fecha más reciente', () => {
  const a = obra(1, '2025-04-01', { calificacionPersonal: 5 });
  const b = obra(2, '2025-09-01', { calificacionPersonal: 5 });
  assert.equal(resumenAnual([a, b], 2025).destacada?.id, 'movie_2');
  assert.equal(resumenAnual([obra(3, '2025-01-01')], 2025).destacada, null);
});
test('D6 y D12: campos faltantes y año vacío', () => {
  const incomplete = obra(1, '2025-01-01', { generos: undefined });
  assert.equal(resumenAnual([incomplete], 2025).obrasSinDatos, 1);
  assert.equal(resumenAnual([incomplete], 2026).totalObras, 0);
});
