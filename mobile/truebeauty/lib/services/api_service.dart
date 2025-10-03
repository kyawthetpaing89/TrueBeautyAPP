import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:truebeauty/utilities/api_url.dart';

class ApiService {
  final String baseUrl = ApiUrls.baseUrl;

  ApiService();

  Future<dynamic> get(String endpoint) async {
    final response = await http.get(Uri.parse('$baseUrl$endpoint'));

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('GET request failed: ${response.statusCode}');
    }
  }

  Future<dynamic> post(String endpoint, Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse('$baseUrl$endpoint'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(data),
    );

    if (response.statusCode == 200 || response.statusCode == 201) {
      return jsonDecode(response.body);
    } else {
      throw Exception('POST request failed: ${response.statusCode}');
    }
  }

  Future<dynamic> put(String endpoint, Map<String, dynamic> data) async {
    final response = await http.put(
      Uri.parse('$baseUrl$endpoint'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(data),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('PUT request failed: ${response.statusCode}');
    }
  }

  Future<void> delete(String endpoint) async {
    final response = await http.delete(Uri.parse('$baseUrl$endpoint'));

    if (response.statusCode != 200) {
      throw Exception('DELETE request failed: ${response.statusCode}');
    }
  }
}
