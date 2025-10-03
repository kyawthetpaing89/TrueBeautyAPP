import 'package:flutter/material.dart';

class TBTextField extends StatelessWidget {
  final String label;
  final TextEditingController? controller;
  final bool obscureText;
  final bool enabled;
  final String? Function(String?)? validator;
  final String? initialValue;
  final Widget? suffixIcon; // 👈 new
  final TextInputType? keyboardType; // 👈 new
  final bool readOnly; // 👈 optional for date picker

  const TBTextField({
    super.key,
    required this.label,
    this.controller,
    this.obscureText = false,
    this.enabled = true,
    this.validator,
    this.initialValue,
    this.suffixIcon,
    this.keyboardType,
    this.readOnly = false,
  });

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      initialValue: initialValue,
      obscureText: obscureText,
      enabled: enabled,
      validator: validator,
      keyboardType: keyboardType,
      readOnly: readOnly,
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(fontSize: 14, color: Colors.black54),
        contentPadding: const EdgeInsets.symmetric(
          vertical: 10,
          horizontal: 14,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Colors.grey, width: 1),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Colors.grey, width: 1),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFFdf8284), width: 1.5),
        ),
        suffixIcon: suffixIcon, // 👈 new
      ),
    );
  }
}
