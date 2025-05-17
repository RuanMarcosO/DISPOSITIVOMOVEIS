import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, StyleSheet, Text, View, TextInput, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TelaLogin() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    if (email === '' || senha === '') {
      alert('Informe seus dados!');
      return;
    }

    try {
      // Envia os dados para a API
      const response = await axios.post('http://192.168.0.109/api-condominio/login.php', {
        email,
        senha,
      });

      // Verifica se o login foi bem-sucedido
      if (response.data.success) {
        alert('Login bem-sucedido');
        await AsyncStorage.setItem('@token', JSON.stringify(response.data.hash));
        console.log(response.data);
        navigation.navigate('Agenda'); // Navega para a tela de Agenda
      } else {
        alert(response.data.message); // Exibe a mensagem de erro retornada do PHP
      }
    } catch (error) {
      alert('Erro ao realizar login.');
      console.error('Erro no login:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.imagem} resizeMode="stretch" source={require('./Imagens/logo.png')} />
      
      <Text style={styles.formTitle}>TRD{"\n"}Gestão das Áreas Condominiais</Text>

      <TextInput
        style={styles.formInput}
        placeholder="Informe o Email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        value={email}
        onChangeText={setEmail}
        textAlign="center"
      />

      <TextInput
        style={styles.formInput}
        placeholder="Informe a Senha"
        secureTextEntry
        autoCapitalize="none"
        value={senha}
        onChangeText={setSenha}
        textAlign="center"
      />

      <TouchableOpacity style={styles.formButton} onPress={handleLogin}>
        <Text style={styles.textButton}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.formButton2} onPress={() => navigation.navigate('CadAlunos')}>
        <Text style={styles.textButton}>Cadastre-se</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f6fc',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 90,
  },

  imagem: {
    width: 100,
    height: 90,
    marginTop: 80,
    marginBottom: 40,
  },

  formTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#006f9e',
    textAlign: 'center',
    marginBottom: 20,
  },

  formInput: {
    backgroundColor: '#ffffff',
    borderColor: '#00b0ff',
    borderWidth: 1,
    borderRadius: 30,
    fontSize: 16,
    width: '80%',
    padding: 12,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },

  formButton: {
    backgroundColor: '#00b0ff',
    borderRadius: 10,
    width: '50%',
    padding: 14,
    alignItems: 'center',
    margin: 10,
    shadowColor: '#00b0ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },

  formButton2: {
    backgroundColor: '#00b0ff',
    borderRadius: 10,
    width: '80%',
    padding: 14,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#00b0ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },

  textButton: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});