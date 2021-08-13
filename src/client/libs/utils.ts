export class Utils {
  static randString(len = 10): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randString = '';
    for (let i = 0, n = charset.length; i < len; ++i) {
      randString += charset.charAt(Math.floor(Math.random() * n));
    }
    return randString;
  }
}
