import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform, Alert } from 'react-native';

async function requestLocationPermission() {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  return true;
}

async function obtenerUbicacion() {
  const tienePermiso = await requestLocationPermission();

  if (!tienePermiso) {
    Alert.alert('Permiso denegado', 'No se puede acceder a la ubicación');
    return;
  }

  Geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      // solicitud al backend
      fetch('se agrega la direccion http', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude, longitude }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('Respuesta del backend:', data);
        })
        .catch((error) => {
          console.error('Error al enviar coordenadas:', error);
        });
    },
    (error) => {
      console.error('Error al obtener ubicación:', error);
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  );
}
