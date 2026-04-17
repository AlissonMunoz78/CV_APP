import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

type FormData = {
  nombre: string;
  email: string;
  password: string;
  edad: number;
  fechaNacimiento: Date;
};

export default function ExampleForm() {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { control, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>({
    defaultValues: {
      nombre: '',
      email: '',
      password: '',
      edad: 0,
      fechaNacimiento: new Date(),
    },
  });

  const onSubmit = (data: FormData) => {
    console.log('Formulario enviado:', data);
    alert('Formulario enviado correctamente');
    reset();
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setValue('fechaNacimiento', selectedDate, { shouldValidate: true });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Formulario de Ejemplo</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Nombre</Text>
          <Controller
            control={control}
            name="nombre"
            rules={{
              required: 'El nombre es obligatorio',
              minLength: { value: 2, message: 'Mínimo 2 caracteres' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.nombre && styles.inputError]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Ingresa tu nombre"
              />
            )}
          />
          {errors.nombre && <Text style={styles.error}>{errors.nombre.message}</Text>}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <Controller
            control={control}
            name="email"
            rules={{
              required: 'El email es obligatorio',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email inválido',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="correo@ejemplo.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />
          {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Contraseña</Text>
          <Controller
            control={control}
            name="password"
            rules={{
              required: 'La contraseña es obligatoria',
              minLength: { value: 8, message: 'Mínimo 8 caracteres' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Mínimo 8 caracteres"
                secureTextEntry
              />
            )}
          />
          {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Edad (1-100)</Text>
          <Controller
            control={control}
            name="edad"
            rules={{
              required: 'La edad es obligatoria',
              min: { value: 1, message: 'Mínimo 1 año' },
              max: { value: 100, message: 'Máximo 100 años' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.edad && styles.inputError]}
                onBlur={onBlur}
                onChangeText={(text) => onChange(Number(text))}
                value={value ? String(value) : ''}
                placeholder="Ingresa tu edad"
                keyboardType="numeric"
              />
            )}
          />
          {errors.edad && <Text style={styles.error}>{errors.edad.message}</Text>}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Fecha de Nacimiento</Text>
          <Controller
            control={control}
            name="fechaNacimiento"
            rules={{
              required: 'La fecha de nacimiento es obligatoria',
              validate: (value) => {
                const today = new Date();
                return value <= today || 'No se permiten fechas futuras';
              },
            }}
            render={({ field: { value } }) => (
              <>
                <TouchableOpacity
                  style={[styles.input, errors.fechaNacimiento && styles.inputError]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={value ? styles.dateText : styles.datePlaceholder}>
                    {value ? formatDate(value) : 'Selecciona tu fecha de nacimiento'}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={value || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onDateChange}
                    maximumDate={new Date()}
                  />
                )}
              </>
            )}
          />
          {errors.fechaNacimiento && <Text style={styles.error}>{errors.fechaNacimiento.message}</Text>}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20, paddingTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  field: { marginBottom: 16 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16,
  },
  inputError: { borderColor: '#e74c3c' },
  error: { color: '#e74c3c', fontSize: 12, marginTop: 4 },
  button: {
    backgroundColor: '#3498db', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 20,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  dateText: { fontSize: 16, color: '#000' },
  datePlaceholder: { fontSize: 16, color: '#999' },
});