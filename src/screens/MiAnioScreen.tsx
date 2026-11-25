import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabParams } from '../navigation/types';
import { useCartelera } from '../context/CarteleraContext';
import { aniosDisponibles, resumenAnual } from '../dominio/resumenAnual';
import { completarDatos, migrarFecha } from '../services/listaService';
import { Aviso, Boton, Cargando, Chip, Vacio } from '../components/UI';
import { Poster } from '../components/Poster';
import { c, s } from '../theme';
import { mensajeError } from '../utils/errors';

const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
function Dato({ titulo, valor }: { titulo: string; valor: string }) {
  return <View style={[s.panel, { flex: 1, minWidth: 125 }]}>
    <Text style={[s.body, { fontSize: 12 }]}>{titulo}</Text>
    <Text style={{ color: c.accent, fontSize: 23, fontWeight: '800' }}>{valor}</Text>
  </View>;
}
export function MiAnioScreen() {
  const nav = useNavigation<BottomTabNavigationProp<TabParams>>();
  const { usuario, lista, conectado, copiaLocal, cargandoLista, refrescar } = useCartelera();
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [ocupado, setOcupado] = useState(false);
  const [progreso, setProgreso] = useState('');
  const [error, setError] = useState<string | null>(null);
  const procesadas = useRef(new Set<string>());
  const ejecutando = useRef(false);
  const anios = useMemo(() => aniosDisponibles(lista, new Date().getFullYear()), [lista]);
  const resumen = useMemo(() => resumenAnual(lista, anio), [lista, anio]);
  const uid = usuario?.uid;
  useEffect(() => { procesadas.current.clear(); setAnio(new Date().getFullYear()); setError(null); }, [uid]);
  useEffect(() => {
    if (!uid || !conectado || cargandoLista || ejecutando.current) return;
    const pendienteFecha = lista.find(i => i.estado === 'vista' && !i.vistaEn && !procesadas.current.has(`fecha:${i.id}`));
    const pendienteDatos = !pendienteFecha && lista.find(i => i.estado === 'vista' && i.vistaEn &&
      new Date(i.vistaEn).getFullYear() === anio && (!i.generos || !i.directores || i.duracionMin === undefined) &&
      !procesadas.current.has(`datos:${i.id}`));
    const elegido = pendienteFecha ?? pendienteDatos;
    if (!elegido) return;
    const tipo = pendienteFecha ? 'fecha' : 'datos';
    procesadas.current.add(`${tipo}:${elegido.id}`);
    ejecutando.current = true;
    setOcupado(true); setError(null);
    setProgreso(tipo === 'fecha' ? `Recuperando fecha: ${elegido.titulo}` : `Completando datos: ${elegido.titulo}`);
    void (tipo === 'fecha' ? migrarFecha(uid, elegido) : completarDatos(uid, elegido))
      .then(() => refrescar())
      .catch(e => { setError(`No se pudo completar ${elegido.titulo}: ${mensajeError(e)}`); })
      .finally(() => { ejecutando.current = false; setOcupado(false); setProgreso(''); });
  }, [uid, lista, anio, conectado, cargandoLista, ocupado, refrescar]);
  const max = Math.max(1, ...resumen.obrasPorMes);
  return <ScrollView style={s.screen} contentContainerStyle={s.content}>
    <Text style={s.eyebrow}>TU HISTORIA EN PANTALLA</Text>
    <Text style={s.title}>Mi año en cine.</Text>
    <Text style={s.body}>Los momentos que viviste a través de las historias.</Text>
    <Text style={s.label}>Año del resumen</Text>
    <View style={s.wrap}>{anios.map(y => <Chip key={y} texto={`${y}`} activo={y === anio} onPress={() => setAnio(y)} />)}</View>
    {(!conectado || copiaLocal) && <Aviso texto="Estás viendo una copia guardada. Sin conexión no se completan fechas ni datos de TMDB." />}
    {ocupado && <Cargando texto={progreso} />}
    {error && <Aviso error texto={error} />}
    {cargandoLista ? <Cargando texto="Cargando tu colección…" /> : resumen.totalObras === 0 ?
      <View style={{ gap: 15 }}><Vacio titulo={`Aún no hay obras vistas en ${anio}`} texto="Cada película cuenta una historia. Marca una obra como vista para comenzar tu resumen." />
        <Boton texto="Ir a Mi lista" onPress={() => nav.navigate('MiLista')} /></View> : <>
      <View style={[s.row, { flexWrap: 'wrap' }]}>
        <Dato titulo="Obras vistas" valor={`${resumen.totalObras}`} />
        <Dato titulo="Películas" valor={`${resumen.peliculas}`} />
        <Dato titulo="Series" valor={`${resumen.series}`} />
      </View>
      <View style={s.row}>
        <Dato titulo="Horas de cine" valor={`${resumen.horas.toFixed(1).replace('.', ',')} h`} />
        <Dato titulo="Género más visto" valor={resumen.generoTop?.nombre ?? 'Sin datos'} />
      </View>
      <View style={s.panel}>
        <Text style={s.subtitle}>Tu director más visto</Text>
        <Text style={[s.body, { color: c.accent }]}>{resumen.directorTop?.nombre ?? 'No hay datos suficientes'}</Text>
      </View>
      <View style={s.panel}>
        <Text style={s.subtitle}>Actividad por mes</Text>
        <Text style={s.body}>Mes más activo: {resumen.mesTop === null ? 'Sin actividad' : meses[resumen.mesTop]}</Text>
        <View style={{ flexDirection: 'row', gap: 5, height: 140, alignItems: 'flex-end' }}>
          {resumen.obrasPorMes.map((n, i) => <View key={i} style={{ flex: 1, alignItems: 'center', gap: 7 }}>
            <Text style={{ color: c.muted, fontSize: 10 }}>{n || ''}</Text>
            <View accessible accessibilityLabel={`${meses[i]}: ${n} obras`} style={{ height: Math.max(3, n / max * 95), width: '100%', borderRadius: 5,
              backgroundColor: i === resumen.mesTop ? c.accent : c.accentDark }} />
            <Text style={{ color: c.muted, fontSize: 9 }}>{meses[i].slice(0, 1)}</Text>
          </View>)}
        </View>
      </View>
      <View style={s.panel}>
        <Text style={s.subtitle}>La obra destacada</Text>
        {resumen.destacada ? <View style={[s.row, { alignItems: 'flex-start' }]}>
          <Poster path={resumen.destacada.posterPath} titulo={resumen.destacada.titulo} ancho={85} />
          <View style={{ flex: 1, gap: 8 }}><Text style={[s.label, { fontSize: 17 }]}>{resumen.destacada.titulo}</Text>
            <Text style={{ color: c.accent }}>★ {resumen.destacada.calificacionPersonal}/5</Text></View>
        </View> : <Text style={s.body}>Califica alguna de tus obras vistas para descubrir tu favorita.</Text>}
      </View>
      {resumen.peliculasSinDuracion > 0 && <Aviso texto={`${resumen.peliculasSinDuracion} películas no tienen duración y no suman horas.`} />}
      {resumen.obrasSinDatos > 0 && <Aviso texto={`${resumen.obrasSinDatos} obras tienen información de TMDB incompleta.`} />}
    </>}
    <Boton texto="Actualizar datos" secundario onPress={() => { procesadas.current.clear(); void refrescar(); }} disabled={!conectado || ocupado} />
  </ScrollView>;
}
