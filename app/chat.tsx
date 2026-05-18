import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  ScrollView
} from 'react-native';

export default function Chat() {

  type Mensaje = {
  tipo: 'user' | 'bot';
  texto: string;
};

const [mensaje, setMensaje] = useState('');
const [mensajes, setMensajes] = useState<Mensaje[]>([]);

  async function enviarMensaje() {
    console.log("ENVIANDO:", mensaje);
    try {
      const response = await fetch(
        'http://192.168.110.143:3000/procesar',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            texto: mensaje
          })
        }
      );

      const text = await response.text();
      console.log("RAW:", text);

      const data = JSON.parse(text);
      setMensajes(prev => [
  ...prev,
  { tipo: 'user', texto: mensaje },
  { tipo: 'bot', texto: data.respuesta }
]);
setMensaje('');

    } catch (error) {
      console.log(error);
      alert('Error conectando');
    }
  }

  return (
    <View style={{
      flex: 1,
      backgroundColor: "#0B0F14",
      padding: 20,
      justifyContent: "flex-start"
    }}>

     
      <Text style={{
        color: "#C2414C",
        fontSize: 28,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 30
      }}>
        ROSE
      </Text>

      <View style={{
        backgroundColor: "#111827",
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#1F2937",
        marginBottom: 20
      }}>

        <Text style={{
          color: "#94A3B8",
          marginBottom: 10,
          fontSize: 13
        }}>
          Escribe tu mensaje
        </Text>

        <TextInput
          placeholder='Escribe algo...'
          placeholderTextColor="#6B7280"
          value={mensaje}
          onChangeText={setMensaje}
          style={{
            color: "#F8FAFC",
            padding: 12,
            borderRadius: 12,
            backgroundColor: "#0B0F14",
            borderWidth: 1,
            borderColor: "#1F2937"
          }}
        />

      </View>

      
      <Pressable
        onPress={enviarMensaje}
        style={({ pressed }) => ({
          backgroundColor: pressed ? "#9B2C36" : "#C2414C",
          padding: 14,
          borderRadius: 14,
          alignItems: "center",
          transform: pressed ? [{ scale: 0.97 }] : [{ scale: 1 }]
        })}
      >
        <Text style={{
          color: "#F8FAFC",
          fontWeight: "700",
          letterSpacing: 0.5
        }}>
          Preguntarle a Rose
        </Text>
      </Pressable>

      
      <View style={{
        flex: 1,
        marginTop: 30,
        padding: 16,
        borderRadius: 16,
        backgroundColor: "#111827",
        borderWidth: 1,
        borderColor: "#1F2937"
      }}>

        <Text style={{
          color: "#94A3B8",
          fontSize: 12,
          marginBottom: 8
        }}>
          Respuesta de Rose
        </Text>

      <ScrollView
  style={{ flex: 1 }}
  contentContainerStyle={{ padding: 10 }}
>

  {mensajes.map((item, i) => (
    <View
      key={i}
      style={{
        alignSelf: item.tipo === 'user' ? 'flex-end' : 'flex-start',
        backgroundColor: item.tipo === 'user' ? '#C2414C' : '#1F2937',
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
        maxWidth: '80%'
      }}
    >
      <Text style={{ color: '#F8FAFC' }}>
        {item.texto}
      </Text>
    </View>
  ))}

</ScrollView>

      </View>

    </View>
  );
}