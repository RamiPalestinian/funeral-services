type ValidationResult = {
  isValid: boolean;
  error: string | null;
};

type RegistrationData = {
  name: string;
  email: string;
  password: string;
};

type LoginData = {
  email: string;
  password: string;
};

export class UserValidator {
  static validateEmail(email: string): boolean {
    const emailPattern = /^[A-z0-9!-_%.]+@[A-z0-9.-]+\.[A-z]{2,}$/;
    return emailPattern.test(email);
  }

  static validatePassword(password: string): boolean {
    const hasUpperCase = /[A-Z]/;
    const hasLowerCase = /[a-z]/;
    const hasDigits = /\d/;
    const hasSpecialSymbols = /[!@#$%^&*()-+,.""<>{}]/;
    const isValidLength = password.length >= 8;

    if (
      !hasUpperCase.test(password) ||
      !hasLowerCase.test(password) ||
      !hasDigits.test(password) ||
      !hasSpecialSymbols.test(password) ||
      !isValidLength
    ) {
      return false;
    }
    return true;
  }

  static validateRegistrationData(userData: RegistrationData): ValidationResult {
    const { name, email, password } = userData;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return { isValid: false, error: 'Некорректное имя пользователя' };
    }

    if (
      !email ||
      typeof email !== 'string' ||
      email.trim().length === 0 ||
      !this.validateEmail(email)
    ) {
      return {
        isValid: false,
        error: 'Некорректный адрес электронной почты',
      };
    }

    if (
      !password ||
      typeof password !== 'string' ||
      password.trim().length === 0 ||
      !this.validatePassword(password)
    ) {
      return {
        isValid: false,
        error: 'Пароль не соответствует критериям валидации',
      };
    }

    return { isValid: true, error: null };
  }

  static validateLoginData(userData: LoginData): ValidationResult {
    const { email, password } = userData;

    if (
      !email ||
      typeof email !== 'string' ||
      email.trim().length === 0 ||
      !this.validateEmail(email)
    ) {
      return {
        isValid: false,
        error: 'Некорректный адрес электронной почты',
      };
    }

    if (
      !password ||
      typeof password !== 'string' ||
      password.trim().length === 0 ||
      password.length < 8
    ) {
      return {
        isValid: false,
        error: 'Пароль должен содержать не менее 8 символов',
      };
    }

    return { isValid: true, error: null };
  }

  static validateName(name: string): ValidationResult {
    if (!name || typeof name !== 'string' || name.trim().length < 3) {
      return { isValid: false, error: 'Имя должно содержать не менее 3 символов' };
    }

    return { isValid: true, error: null };
  }

  static validatePasswordChange(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): ValidationResult {
    const { currentPassword, newPassword, confirmPassword } = data;

    if (!currentPassword || currentPassword.trim().length === 0) {
      return { isValid: false, error: 'Введите текущий пароль' };
    }

    if (!this.validatePassword(newPassword)) {
      return {
        isValid: false,
        error: 'Новый пароль не соответствует критериям валидации',
      };
    }

    if (newPassword !== confirmPassword) {
      return { isValid: false, error: 'Пароли не совпадают' };
    }

    return { isValid: true, error: null };
  }
}
