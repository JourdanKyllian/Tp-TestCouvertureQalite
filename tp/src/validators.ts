export function isValidEmail(email: string | null): boolean{
    if(!email){
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
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