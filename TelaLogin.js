import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, StyleSheet, Text, View, KeyboardAvoidingView, TextInput, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importando AsyncStorage

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
      // Recuperando email e senha armazenados no AsyncStorage
      const storedEmail = await AsyncStorage.getItem('@userEmail');
      const storedSenha = await AsyncStorage.getItem('@userSenha');
  
      // Verificando os dados armazenados
      console.log('Dados armazenados no login:', { storedEmail, storedSenha });
      console.log('Dados inseridos no login:', { email, senha });
  
      // Comparando os dados inseridos com os armazenados
      if (email === storedEmail && senha === storedSenha) {
        alert('Login bem-sucedido');
        navigation.navigate('Agenda'); // Navegar para a tela Agenda
      } else {
        alert('Usuário e/ou Senha inválidos');
      }
    } catch (error) {
      alert('Erro ao realizar o login');
      console.error('Erro ao realizar o login:', error); // Log para depuração
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.imagem} resizeMode="stretch" source={require('./Imagens/logo.png')} />
      
      <Text style={styles.formTitle}>TRD{"\n"}Gestão das Áreas Condominiais</Text>
      <Text style={styles.formSubtitle}></Text>

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

      {/* Alteração no botão Cadastre-se */}
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

  formSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00b0ff',
    textAlign: 'center',
    marginBottom: 40,
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