export const timeToMinutes = (time: string): number => {
    // 1. Séparer les heures et les minutes
    const parts = time.split(':');

    // 2. Convertir les chaines en nombres entiers
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);

    // 3. Retourner le total en minutes
    return hours * 60 + minutes;
}

export const minutesToTime = (totalMinutes: number): string => {
    // 1. Calculer les heures (arrondi vers le bas)
    const hours = Math.floor(totalMinutes / 60);

    // 2. Calculer les minutes (le reste)
    const minutes = totalMinutes % 60;

    // 3. Formater en chaine "HH:MM" avec le zéro devant si besoin
    const hoursStr = hours.toString().padStart(2, '0');
    const minutesStr = minutes.toString().padStart(2, '0');

    return `${hoursStr}:${minutesStr}`;
}