# Preparar Firebase propio (sin compartir credenciales)

1. En Firebase Console, crear un proyecto personal y registrar una aplicación **web** (el SDK de Expo usa esa configuración).
2. En Authentication > Sign-in method, habilitar **Email/Password**.
3. En Firestore Database, crear la base de datos en una región adecuada y mantener reglas restrictivas, no modo abierto permanente.
4. Desde la raíz del proyecto, copiar `.env.example` a `.env` y llenar **localmente** los campos `EXPO_PUBLIC_FIREBASE_*` con la configuración de tu propia aplicación web.
5. Completar `EXPO_PUBLIC_TMDB_TOKEN` con tu propio API Read Access Token de TMDB. No enviarlo por chat ni subirlo al repositorio.
6. Desactivar emuladores en uso normal (`EXPO_PUBLIC_USE_EMULATORS=false`).
7. Comprobar que la CLI apunta al proyecto correcto antes de publicar reglas. **Las reglas actuales son del Proyecto 3**, no cubren aún los cuatro campos de «Mi año en cine»; actualizarlas y probarlas antes de publicar los cambios de la épica.
8. Reiniciar Expo con `npx expo start -c` al cambiar `.env`.
9. Probar registro, inicio de sesión y lectura/escritura de una obra. Más adelante, repetir las pruebas con dos cuentas distintas para verificar aislamiento.

La configuración web de Firebase no es una contraseña del usuario; sin embargo, para esta entrega no se debe compartir ni subir `.env`. `EXPO_PUBLIC_TMDB_TOKEN` quedará incluido en el cliente Expo, de modo que no es un secreto realmente protegido: tenerlo en `.env` evita publicarlo en Git, pero no lo oculta a quien examine la aplicación.

**No se ha conectado ni desplegado ningún proyecto Firebase durante esta preparación.**
