export interface DigimonValidationError {
  field: string;
  message: string;
}

export function validateDigimonData(data: any): DigimonValidationError[] {
  const errors: DigimonValidationError[] = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'El nombre es requerido' });
  }

  if (!data.level || typeof data.level !== 'string') {
    errors.push({ field: 'level', message: 'El nivel es requerido' });
  }

  if (!data.type || typeof data.type !== 'string') {
    errors.push({ field: 'type', message: 'El tipo es requerido' });
  }

  if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
    errors.push({ field: 'description', message: 'La descripción es requerida' });
  }

  if (data.attackPower && (isNaN(parseInt(data.attackPower)) || parseInt(data.attackPower) < 0)) {
    errors.push({ field: 'attackPower', message: 'El poder de ataque debe ser un número válido' });
  }

  if (data.defenseValue && (isNaN(parseInt(data.defenseValue)) || parseInt(data.defenseValue) < 0)) {
    errors.push({ field: 'defenseValue', message: 'El valor de defensa debe ser un número válido' });
  }

  return errors;
}