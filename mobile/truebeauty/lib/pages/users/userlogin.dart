import 'package:flutter/material.dart';
import 'package:truebeauty/pages/home/homepage.dart';
import 'package:truebeauty/pages/widgets/tb_appbar.dart';
import 'package:truebeauty/services/api_service.dart';
import 'package:truebeauty/services/auth_service.dart';
import 'package:truebeauty/utilities/api_url.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final ApiService apiService = ApiService();

  final _formKey = GlobalKey<FormState>();
  final TextEditingController _userController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  InputDecoration _inputDecoration(String label) {
    return InputDecoration(
      labelText: label,
      labelStyle: const TextStyle(fontSize: 14, color: Colors.black54),
      contentPadding: const EdgeInsets.symmetric(vertical: 10, horizontal: 14),

      // Default border
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(
          color: Colors.grey,
          width: 1,
        ), // visible grey border
      ),

      // Enabled border
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Colors.grey, width: 1),
      ),

      // Focused border
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Color(0xFFdf8284), width: 1.5),
      ),
    );
  }

  Future<bool> login() async {
    final params = {
      "LoginID": _userController.text,
      "LoginPassword": _passwordController.text,
    };

    try {
      final data = await apiService.post(ApiUrls.login, params);
      if (data is Map &&
          data.containsKey('data') &&
          data['data'] is Map &&
          data['data'].containsKey('data')) {
        final userData = data['data']['data'] as List<dynamic>;

        if (userData.isNotEmpty) {
          final user = userData[0];
          await AuthService.saveUser(user);

          return true;
        }
      }
      return false;
    } catch (exception) {
      return false;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const TBAppBar(title: "Log-in"),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              const SizedBox(height: 20),

              // ✅ Logo image
              CircleAvatar(
                radius: 50,
                backgroundImage: AssetImage(
                  'assets/images/truebeauty-logo.webp',
                ),
                backgroundColor: Colors.transparent,
              ),
              const SizedBox(height: 30),
              TextFormField(
                controller: _userController,
                decoration: _inputDecoration("Phone No or Email"),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return "Please enter your phone or email";
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _passwordController,
                decoration: _inputDecoration("Password"),
                obscureText: true,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return "Please enter your password";
                  }
                  return null;
                },
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFdf8284),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                  onPressed: () async {
                    if (!_formKey.currentState!.validate()) return;

                    final success = await login();

                    if (success) {
                      if (mounted) {
                        setState(() {
                          Navigator.pushReplacement(
                            context,
                            MaterialPageRoute(builder: (_) => const HomePage()),
                          );
                        });
                      }
                    } else {}
                  },
                  child: const Text(
                    "Log-in",
                    style: TextStyle(fontSize: 16, color: Colors.white),
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Continue as Guest button
              SizedBox(
                width: double.infinity,
                child: OutlinedButton(
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(
                      color: Color(0xFFdf8284),
                      width: 1.5,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                  onPressed: () {
                    // Navigate to About Page
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(builder: (context) => const HomePage()),
                    );
                  },
                  child: const Text(
                    "Continue as Guest",
                    style: TextStyle(fontSize: 16, color: Color(0xFFdf8284)),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              TextButton(
                onPressed: () {
                  // Navigate to forgot password page
                },
                child: const Text(
                  "Forgot Password?",
                  style: TextStyle(color: Color(0xFFdf8284)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
