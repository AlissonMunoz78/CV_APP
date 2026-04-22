// PARTE 3 Validadores reutilizables de formulario y migracion a TanStack Form
export const requiredText = (value: string, message: string) => {
  if (!value || !value.trim()) return message;
  return undefined;
};

export const sanitizeName = (value: string) =>
  value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");

export const validateFullName = (value: string) => {
  const requiredError = requiredText(
    value,
    "El nombre completo es obligatorio",
  );
  if (requiredError) return requiredError;
  if (value.trim().length < 3) return "Minimo 3 caracteres";
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value))
    return "Solo se permiten letras";
  return undefined;
};

export const sanitizeLocation = (value: string) =>
  value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ,\s]/g, "");

export const validateLocation = (value: string) => {
  const requiredError = requiredText(value, "La ubicacion es obligatoria");
  if (requiredError) return requiredError;
  if (value.trim().length < 3) return "Minimo 3 caracteres";
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ,\s]+$/.test(value)) {
    return "Solo se permiten letras, espacios y coma";
  }
  return undefined;
};

export const validateEmail = (value: string) => {
  const requiredError = requiredText(value, "El email es obligatorio");
  if (requiredError) return requiredError;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    return "Ingresa un email valido";
  return undefined;
};

export const sanitizePhone = (value: string) =>
  value.replace(/[^\d\s\-()+]/g, "");

export const validatePhone = (value: string) => {
  if (!value) return undefined;
  if (!/^[+]?[\d\s\-()]{7,15}$/.test(value))
    return "Formato invalido. Ej: +593 99 999 9999";
  return undefined;
};
