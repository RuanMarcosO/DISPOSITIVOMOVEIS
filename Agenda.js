import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Modal, TextInput, FlatList, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [appointmentDetails, setAppointmentDetails] = useState('');
  const [password, setPassword] = useState('');
  const [appointments, setAppointments] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedAppointmentKey, setSelectedAppointmentKey] = useState(null);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);  
  const [isTimeModalVisible, setIsTimeModalVisible] = useState(false);

  const areas = ['Piscina', 'Salão de Festas', 'Churrasqueira', 'Quadra de Esportes'];
  const availableTimes = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',];

  const loadAppointments = async () => {
    try {
      const storedAppointments = await AsyncStorage.getItem('@Arealist');
      setAppointments(storedAppointments ? JSON.parse(storedAppointments) : {});
    } catch (e) {
      console.error('Erro ao carregar agendamentos', e);
    }
  };

  const saveAppointments = async (appointments) => {
    try {
      await AsyncStorage.setItem('@Arealist', JSON.stringify(appointments));
    } catch (e) {
      console.error('Erro ao salvar agendamentos', e);
    }
  };

  const handleDayPress = (day) => {
    const formattedDate = `${day.year}-${String(day.month).padStart(2, '0')}-${String(day.day).padStart(2, '0')}`;
    setSelectedDate(formattedDate);
    setIsModalVisible(true);
  };

  const handleSubmit = () => {
    if (!selectedDate || !selectedTime || !selectedArea || !appointmentDetails || !password) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const newAppointments = { ...appointments };
    const appointmentKey = `${selectedDate}-${selectedTime}-${selectedArea}-${Date.now()}`;

    if (!newAppointments[selectedDate]) {
      newAppointments[selectedDate] = [];
    }

    if (newAppointments[selectedDate].some(appointment => appointment.area === selectedArea && appointment.time === selectedTime)) {
      alert('A área selecionada já está ocupada neste horário.');
      return;
    }

    newAppointments[selectedDate].push({ area: selectedArea, details: appointmentDetails, time: selectedTime, password, key: appointmentKey });
    setAppointments(newAppointments);
    saveAppointments(newAppointments);
    resetForm();
  };

  const handleDeleteSubmit = () => {
    if (appointmentToDelete && password === appointmentToDelete.password) {
      const newAppointments = { ...appointments };
      newAppointments[selectedDate] = newAppointments[selectedDate].filter(appointment => appointment.key !== selectedAppointmentKey);

      if (newAppointments[selectedDate].length === 0) {
        delete newAppointments[selectedDate];
      }

      setAppointments(newAppointments);
      saveAppointments(newAppointments);
      alert('Agendamento excluído com sucesso.');
      resetForm();
    } else {
      alert('Senha incorreta.');
    }
  };

  const resetForm = () => {
    setSelectedArea('');
    setAppointmentDetails('');
    setPassword('');
    setSelectedTime('');
    setIsModalVisible(false);
    setIsDeleteModalVisible(false);
    setIsTimeModalVisible(false);
  };

  const getMarkedDates = () => {
    const markedDates = {};
    Object.keys(appointments).forEach((date) => {
      markedDates[date] = {
        selected: true,
        selectedColor: '#4682B4',
        selectedTextColor: '#FFFFFF',
        containerStyle: {
          borderWidth: 2,
          borderColor: 'blue',
          borderRadius: 10,
          backgroundColor: 'rgba(70, 130, 180, 0.2)',
        },
      };
    });
    return markedDates;
  };

  const renderAppointments = () => {
    const appointmentsForSelectedDate = appointments[selectedDate] || [];
    return (
      <FlatList
        data={appointmentsForSelectedDate}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <View style={styles.appointment}>
            <Text style={styles.appointmentArea}>Área: {item.area}</Text>
            <Text style={styles.appointmentTime}>Hora: {item.time}</Text>
            <Text style={styles.appointmentDetails}>Detalhes: {item.details}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => { 
              setSelectedAppointmentKey(item.key);
              setAppointmentToDelete(item);  
              setIsDeleteModalVisible(true); 
            }}>
              <Text style={styles.deleteButtonText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    );
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Calendar
        markedDates={getMarkedDates()}
        onDayPress={handleDayPress}
        style={styles.calendar}
      />
      {selectedDate && renderAppointments()}

      {/* Modal para agendamento */}
      <Modal animationType="slide" transparent visible={isModalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Agendar Área de Lazer</Text>
            <Text style={styles.dateText}>Data Selecionada: {selectedDate}</Text>
            <Text style={styles.label}>Escolha a Área:</Text>
            <View style={styles.areasContainer}>
              {areas.map(area => (
                <TouchableOpacity key={area} style={[styles.areaButton, selectedArea === area && styles.selectedAreaButton]} onPress={() => setSelectedArea(area)}>
                  <Text style={styles.areaText}>{area}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.input} onPress={() => setIsTimeModalVisible(true)}>
              <Text style={styles.inputText}>{selectedTime ? `Hora: ${selectedTime}` : "Escolha a hora"}</Text>
            </TouchableOpacity>

            <Modal animationType="slide" transparent visible={isTimeModalVisible}>
              <View style={styles.modalContainer}>
                <View style={styles.modal}>
                  <Text style={styles.modalTitle}>Selecione o Horário</Text>

                  {/* ScrollView para a lista de horários */}
                  <ScrollView contentContainerStyle={styles.timeListContainer}>
                    {availableTimes.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.timeButton}
                        onPress={() => { setSelectedTime(item); setIsTimeModalVisible(false); }}
                      >
                        <Text style={styles.timeButtonText}>{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <TouchableOpacity style={styles.closeButton} onPress={() => setIsTimeModalVisible(false)}>
                    <Text style={styles.closeButtonText}>Fechar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <TextInput style={styles.input} placeholder="Detalhes do Agendamento" value={appointmentDetails} onChangeText={setAppointmentDetails} />
            <TextInput style={styles.input} placeholder="Digite a senha" secureTextEntry value={password} onChangeText={setPassword} />
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Registrar Agendamento</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={resetForm}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal para exclusão */}
      <Modal animationType="slide" transparent visible={isDeleteModalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Excluir Agendamento</Text>
            {/* Exibir os detalhes do agendamento a ser excluído */}
            {appointmentToDelete && (
              <View style={styles.appointmentDetailsContainer}>
                <Text style={styles.appointmentArea}>Área: {appointmentToDelete.area}</Text>
                <Text style={styles.appointmentTime}>Hora: {appointmentToDelete.time}</Text>
                <Text style={styles.appointmentDetails}>Detalhes: {appointmentToDelete.details}</Text>
              </View>
            )}
            <TextInput style={styles.input} placeholder="Digite a senha para excluir" secureTextEntry value={password} onChangeText={setPassword} />
            <TouchableOpacity style={styles.submitButton} onPress={handleDeleteSubmit}>
              <Text style={styles.submitButtonText}>Excluir Agendamento</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={resetForm}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#F0F8FF' },
  calendar: { borderRadius: 10, marginBottom: 20, backgroundColor: '#FFFFFF', elevation: 4 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' },
  modal: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 15, width: 300, elevation: 6 },
  modalTitle: { fontSize: 20, fontWeight: '600', marginBottom: 10, color: '#003366' },
  dateText: { fontSize: 16, marginBottom: 10, color: '#555' },
  label: { fontSize: 14, marginBottom: 5, color: '#555' },
  areasContainer: { flexDirection: 'column', alignItems: 'center', marginBottom: 10 },
  areaButton: { width: '80%', padding: 12, backgroundColor: '#87CEEB', borderRadius: 10, margin: 8, alignItems: 'center' },
  selectedAreaButton: { backgroundColor: '#4682B4' },
  areaText: { color: '#FFFFFF', fontWeight: 'bold' },
  input: { height: 45, borderColor: '#B0C4DE', borderWidth: 1, borderRadius: 10, marginBottom: 15, paddingLeft: 10, fontSize: 16 },
  inputText: { fontSize: 16, color: '#555' },
  submitButton: { paddingVertical: 12, backgroundColor: '#32CD32', borderRadius: 10, marginBottom: 15 },
  submitButtonText: { color: '#FFFFFF', textAlign: 'center', fontWeight: 'bold' },
  closeButton: { paddingVertical: 12, backgroundColor: '#FF6347', borderRadius: 10 },
  closeButtonText: { color: '#FFFFFF', textAlign: 'center', fontWeight: 'bold' },
  timeListContainer: {
    flexGrow: 1, // Garante que o conteúdo do ScrollView se expanda quando necessário
    paddingBottom: 20,
  },
  timeButton: { padding: 12, backgroundColor: '#87CEEB', borderRadius: 10, margin: 8 },
  timeButtonText: { color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' },
  appointment: { backgroundColor: '#FFFFFF', padding: 20, marginVertical: 5, borderRadius: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
  appointmentArea: { fontSize: 18, fontWeight: 'bold', color: '#003366' },
  appointmentTime: { fontSize: 16, color: '#4682B4' },
  appointmentDetails: { fontSize: 14, color: '#555' },
  appointmentDetailsContainer: { marginBottom: 15 },
  deleteButton: { marginTop: 10, backgroundColor: '#FF6347', padding: 8, borderRadius: 8 },
  deleteButtonText: { color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' },
});