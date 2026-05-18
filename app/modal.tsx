import { useState } from 'react';
import {router} from 'expo-router';

import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert
} from 'react-native';

export default function Home() {

  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  

  const [estado, setEstado] = useState(
    'Esperando conexión con ROSE...'
  );

  const [conectado, setConectado] = useState(false);

  async function conectarRose() {

    try {

      setEstado('Enviando credenciales...');

      const response = await fetch(
        'http://192.168.4.1/wifi',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            ssid,
            password
          })
        }
      );

      const data = await response.json();

      console.log(data);

      setEstado('Esperando conexión WiFi...');

      verificarConexion();

    } catch (error) {

      console.log(error);

      setEstado('Error enviando datos');
    }
  }

  async function verificarConexion() {

    let intentos = 0;

    const intervalo = setInterval(async () => {

      try {

        const response = await fetch(
          'http://rose.local/status'
        );

        const data = await response.json();

        console.log(data);

        if (data.connected) {

          clearInterval(intervalo);

          setEstado(
            `ROSE conectada!\nIP: ${data.ip}`
          );

          router.push('/chat' as any);

          Alert.alert(
            'Conectado',
            'ROSE ya está online 😌'
          );
        }

      } catch (error) {

        console.log(error);
      }

      intentos++;

      if (intentos > 20) {

        clearInterval(intervalo);

        setEstado(
          'No se pudo conectar al WiFi'
        );
      }

    }, 2000);
  }

  if (conectado) {

  return (

    <View style={{
      flex: 1,
      backgroundColor: '#0B0F14',
      padding: 20
    }}>

      <Text style={{
        color: '#C2414C',
        fontSize: 34,
        fontWeight: '700',
        textAlign: 'center',
        marginTop: 60,
        marginBottom: 30
      }}>
        ROSE
      </Text>

      <View style={{
        flex: 1,
        backgroundColor: '#111827',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#1F2937'
      }}>

        <Text style={{
          color: '#F8FAFC',
          fontSize: 18
        }}>
          Chat conectado 😌
        </Text>

      </View>

    </View>
  );
}

  return (

    <View style={{
      flex: 1,
      backgroundColor: '#0B0F14',
      justifyContent: 'center',
      padding: 20
    }}>

      {/* TITULO */}

      <Text style={{
        color: '#C2414C',
        fontSize: 34,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 40
      }}>
        ROSE
      </Text>

      {/* CARD */}

      <View style={{
        backgroundColor: '#111827',
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#1F2937'
      }}>

        <Text style={{
          color: '#94A3B8',
          marginBottom: 8
        }}>
          Nombre del WiFi
        </Text>

        <TextInput
          value={ssid}
          onChangeText={setSsid}
          placeholder='Tu WiFi'
          placeholderTextColor="#6B7280"
          style={{
            backgroundColor: '#0B0F14',
            color: '#F8FAFC',
            padding: 14,
            borderRadius: 12,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: '#1F2937'
          }}
        />

        <Text style={{
          color: '#94A3B8',
          marginBottom: 8
        }}>
          Contraseña
        </Text>

        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder='********'
          placeholderTextColor="#6B7280"
          style={{
            backgroundColor: '#0B0F14',
            color: '#F8FAFC',
            padding: 14,
            borderRadius: 12,
            marginBottom: 25,
            borderWidth: 1,
            borderColor: '#1F2937'
          }}
        />

        {/* BOTON */}

        <Pressable
          onPress={conectarRose}
          style={({ pressed }) => ({

            backgroundColor:
              pressed
                ? '#9B2C36'
                : '#C2414C',

            padding: 16,

            borderRadius: 14,

            alignItems: 'center',

            transform: pressed
              ? [{ scale: 0.97 }]
              : [{ scale: 1 }]
          })}
        >

          <Text style={{
            color: '#F8FAFC',
            fontWeight: '700',
            fontSize: 15
          }}>
            Conectar ROSE
          </Text>

        </Pressable>

      </View>

      {/* ESTADO */}

      <View style={{
        marginTop: 25,
        padding: 18,
        backgroundColor: '#111827',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#1F2937'
      }}>

        <Text style={{
          color: '#F8FAFC',
          textAlign: 'center',
          lineHeight: 22
        }}>
          {estado}
        </Text>

      </View>

    </View>
  );
}