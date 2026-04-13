export function isValidEmail(email: string | null): boolean {
  // Si la chaîne existe
  if (!email || email.length === 0) {return false;}

  // Split pour séparer le préfixe du domaine afin de chercher @
  const parts = email.split('@');

  // False s'il n'y a pas exactement UN seul '@'
  if (parts.length !== 2) {return false;}

  const prefix = parts[0];
  const domain = parts[1];

  // Vérifie qu'il y a quelque chose avant le @
  if (prefix.length === 0) {return false;}

  // Vérifie qu'il y a quelque chose après le @
  if (domain.length === 0) {return false;}

  // Le domaine doit contenir un point et ne doit pas être au début ou à la fin
  if (!domain.includes('.') || domain.startsWith('.') || domain.endsWith('.')) {return false;}

  return true;
}
export function isValidPassword(password: string | null): { valid: boolean; errors: string[] }{
    const errors: string[] = [];

    if(!password || password.length === 0 || password === null){
        return {
            valid: false,
            errors: ['Minimum 8 caracteres','Au moins 1 majuscule','Au moins 1 minuscule','Au moins 1 chiffre','Au moins 1 caractere special']
        };
    }
    if(password.length < 8){errors.push('Minimum 8 caracteres');}
    if(!/[a-z]/.test(password)){errors.push('Au moins 1 minuscule');}
    if(!/[A-Z]/.test(password)){errors.push('Au moins 1 majuscule');}
    if(!/[0-9]/.test(password)){errors.push('Au moins 1 chiffre');}
    if(!/[!@#$%^&*]/.test(password)){errors.push('Au moins 1 caractere special');}

    return {
        valid: errors.length === 0,
        errors: errors
    };
}

export function isValidAge(age: number | null): boolean{
    if(age === null || age < 0 || age > 150){
        return false;
    }
    if(age % 1 !== 0){
        return false;
    }
    if(!Number.isInteger(age)){
        return false;
    }

    return true;
}