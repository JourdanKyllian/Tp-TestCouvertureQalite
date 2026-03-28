/**
 * Met la premiere lettre en majuscule, le reste en minuscule
 * @param str 
 * @returns 
 */
export function capitalize(str: string | null): string {
    if(!str || str.length === 0){
        return '';
    }

    const firstLetter = str.charAt(0).toUpperCase();
    const restOfWord = str.slice(1).toLowerCase();
    
    return firstLetter + restOfWord;
}

/**
 * Calcule la moyenne d'un tableau de nombres, arrondie a 2 decimales
 * @param numbers 
 * @returns 
 */
export function calculateAverage (numbers: number[] | null): number {
    if(!numbers || numbers.length === 0){
        return 0;
    }

    const sum = numbers.reduce((acc, num) => acc + num, 0);
    const average = sum / numbers.length;

    return Math.round(average * 100) / 100;
}

/**
 * Transforme un texte en slug URL : minuscules, espaces remplaces par des tirets en retirant les espaces en début et fin, caracteres speciaux supprimes
 * @param text 
 * @returns
 */
export function slugify(text: string | null): string {
    if (!text || text.length === 0) {
        return '';
    }

    // Remplace les espaces par des tirets en enlevant les espaces en début et fin de chaîne
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .trim()
        .replace(/ /g, '-');
}

/**
 * Limite une valeur entre un minimum et un maximum
 * @param value
 */
export function clamp(value: number, min: number, max: number): number {
    if (value < min ||value <= min) {
        const result: number = min;
        return result;
    }
    if (value > max || value >= max) {
        const result: number = max;
        return result;
    }

    return value;
}