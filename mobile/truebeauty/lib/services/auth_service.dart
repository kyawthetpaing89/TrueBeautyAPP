import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  static const String _keyClientID = "clientID";
  static const String _keyClientName = "clientName";

  /// Save user info after login
  static Future<void> saveUser(Map<String, dynamic> user) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyClientID, user["ClientID"].toString());
    await prefs.setString(_keyClientName, user["Name"].toString());
  }

  /// Clear user info (logout)
  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_keyClientID);
    await prefs.remove(_keyClientName);
  }

  /// Check if user is logged in
  static Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    final clientID = prefs.getString(_keyClientID);
    return clientID != null && clientID.isNotEmpty;
  }

  /// Get stored user info
  static Future<Map<String, dynamic>> getUserInfo() async {
    final prefs = await SharedPreferences.getInstance();
    final clientID = prefs.getString(_keyClientID);
    final clientName = prefs.getString(_keyClientName);

    return {
      "loggedIn": clientID != null && clientID.isNotEmpty,
      "clientID": clientID,
      "clientName": clientName,
    };
  }
}
