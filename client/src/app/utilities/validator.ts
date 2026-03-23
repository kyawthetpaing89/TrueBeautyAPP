export class Validator {
  static isEmpty(value: any): boolean {
    if (value === null || value === undefined) return true;
    return value.toString().trim() === '';
  }

  static isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  }

  static isPositiveNumber(value: any): boolean {
    if (value === null || value === undefined) return false;

    const strValue = value.toString();
    const num = Number(strValue.replace(/,/g, ''));

    return !isNaN(num) && num > 0;
  }
}
