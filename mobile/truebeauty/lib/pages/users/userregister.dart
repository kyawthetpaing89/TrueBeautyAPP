import 'package:flutter/material.dart';
import 'package:truebeauty/pages/users/userotpcheck.dart';

class UserRegisterPage extends StatefulWidget {
  const UserRegisterPage({super.key});

  @override
  State<UserRegisterPage> createState() => _UserRegisterPageState();
}

class _UserRegisterPageState extends State<UserRegisterPage> {
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController =
      TextEditingController();

  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;

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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Register", style: TextStyle(color: Colors.white)),
        backgroundColor: const Color(0xFFdf8284),
        iconTheme: const IconThemeData(
          color: Colors.white,
        ), // <-- back button color
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              // User Name
              TextFormField(
                controller: _usernameController,
                decoration: _inputDecoration("User Name"),
                style: const TextStyle(fontSize: 14),
                validator: (value) => value!.isEmpty ? "Enter your name" : null,
              ),
              const SizedBox(height: 12),

              // Phone Number
              TextFormField(
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                decoration: _inputDecoration("Phone No"),
                style: const TextStyle(fontSize: 14),
                validator: (value) =>
                    value!.isEmpty ? "Enter phone number" : null,
              ),
              const SizedBox(height: 12),

              // Email
              TextFormField(
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
                decoration: _inputDecoration("Email"),
                style: const TextStyle(fontSize: 14),
                validator: (value) => value!.isEmpty
                    ? "Enter email"
                    : (!value.contains("@") ? "Enter valid email" : null),
              ),
              const SizedBox(height: 12),

              // Password
              TextFormField(
                controller: _passwordController,
                obscureText: _obscurePassword,
                decoration: _inputDecoration("Password").copyWith(
                  suffixIcon: IconButton(
                    icon: Icon(
                      _obscurePassword
                          ? Icons.visibility_off
                          : Icons.visibility,
                      size: 20,
                    ),
                    onPressed: () {
                      setState(() {
                        _obscurePassword = !_obscurePassword;
                      });
                    },
                  ),
                ),
                style: const TextStyle(fontSize: 14),
                validator: (value) =>
                    value!.length < 6 ? "Password must be 6+ chars" : null,
              ),
              const SizedBox(height: 12),

              // Confirm Password
              TextFormField(
                controller: _confirmPasswordController,
                obscureText: _obscureConfirmPassword,
                decoration: _inputDecoration("Confirm Password").copyWith(
                  suffixIcon: IconButton(
                    icon: Icon(
                      _obscureConfirmPassword
                          ? Icons.visibility_off
                          : Icons.visibility,
                      size: 20,
                    ),
                    onPressed: () {
                      setState(() {
                        _obscureConfirmPassword = !_obscureConfirmPassword;
                      });
                    },
                  ),
                ),
                style: const TextStyle(fontSize: 14),
                validator: (value) => value != _passwordController.text
                    ? "Passwords do not match"
                    : null,
              ),
              const SizedBox(height: 20),

              // Register Button
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
                  onPressed: () {
                    if (_formKey.currentState!.validate()) {
                      // Navigate to Otp Check Page
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const UserOtpCheckPage(),
                        ),
                      );
                    }
                  },
                  child: const Text(
                    "Register",
                    style: TextStyle(fontSize: 16, color: Colors.white),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
