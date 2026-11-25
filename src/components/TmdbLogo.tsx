import React from 'react';
import { SvgXml } from 'react-native-svg';
// SVG oficial sin redibujar ni alterar; funciona también sin conexión.
import { xml } from '../tema/tmdbLogo';
export function TmdbLogo() {
  return <SvgXml xml={xml} width={112} height={35} accessibilityLabel="Logo oficial de TMDB" />;
}
