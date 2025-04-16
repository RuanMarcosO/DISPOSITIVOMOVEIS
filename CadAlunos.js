import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, StyleSheet, Text, View, TextInput, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importando AsyncStorage
import axios from 'axios'; 

export default function CadAlunos() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const navigation = useNavigation();

  const cadastro = async () => {
    if (nome === '' || email === '' || senha === '') {
      alert('Preencha todos os campos!');
    } else {
      try {
        // Enviando dados para o backend
        const response = await axios.post('http://192.168.0.109:3000/gravar', {
          nome,
          email,
          senha
        });
  
        alert(response.data.message);
        navigation.navigate('TelaLogin'); // Navegar para a tela de login
      } catch (error) {
        alert('Erro ao salvar cadastro.');
        console.error('Erro ao salvar cadastro:', error);
      }
    }
  };
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <Image
        style={styles.imagem}
        resizeMode="stretch"
        source={require('./Imagens/logo.png')}
      />

      <Text style={styles.title}>Criar conta</Text>

      <TextInput
        style={styles.TextInput}
        placeholder="Seu nome..."
        autoCapitalize="none"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.TextInput}
        placeholder="Seu email..."
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.TextInput}
        placeholder="Sua senha..."
        secureTextEntry
        autoCapitalize="none"
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity
        style={styles.Button}
        onPress={cadastro}
      >
        <Text style={styles.textButton}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Fundo branco
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

  TextInput: {
    backgroundColor: '#ffffff',
    borderColor: '#00b0ff', // Cor do borda azul
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

  Button: {
    backgroundColor: '#00b0ff', // Cor azul no botão
    borderRadius: 10,
    width: '60%',
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

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#006f9e', // Azul mais escuro
    textAlign: 'center',
    marginBottom: 20,
  },
});