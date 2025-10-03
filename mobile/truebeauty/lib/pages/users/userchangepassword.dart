import 'package:flutter/material.dart';
import 'package:truebeauty/pages/widgets/tb_appbar.dart';
import 'package:truebeauty/pages/widgets/tb_textfield.dart';
import 'package:truebeauty/services/auth_service.dart';
import 'package:truebeauty/services/api_service.dart';
import 'package:truebeauty/utilities/api_url.dart';

class UserChangePasswordPage extends StatefulWidget {
  const UserChangePasswordPage({super.key});

  @override
  State<UserChangePasswordPage> createState() => _UserChangePasswordPageState();
}

class _UserChangePasswordPageState extends State<UserChangePasswordPage> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _clientNameController = TextEditingController();
  final TextEditingController _currentPasswordController =
      TextEditingController();
  final TextEditingController _newPasswordController = TextEditingController();
  final TextEditingController _confirmPasswordController =
      TextEditingController();

  bool loading = false;
  String? clientID;

  final ApiService apiService = ApiService();

  @override
  void initState() {
    super.initState();
    _loadClientInfo();
  }

  void _loadClientInfo() async {
    final userInfo = await AuthService.getUserInfo();
    setState(() {
      _clientNameController.text = userInfo["clientName"] ?? '';
      clientID = userInfo["clientID"];
    });
  }

  void _changePassword() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => loading = true);

    try {
      final params = {
        "ClientID": clientID,
        "CurrentPassword": _currentPasswordController.text,
        "NewPassword": _newPasswordController.text,
      };

      final response = await apiService.post(
        ApiUrls.clientchangepassword,
        params,
      );

      if (response is Map &&
          response.containsKey('data') &&
          response['data'] is Map &&
          response['data'].containsKey('data')) {
        final data = response['data']['data'] as List<dynamic>;

        if (data.isNotEmpty) {
          final result = data[0];

          if (mounted) {
            String title = "Error";

            if (result['MessageCD'] == "I001") {
              _newPasswordController.clear();
              _currentPasswordController.clear();
              _confirmPasswordController.clear();

              title = "Password Change";
            }

            showDialog(
              context: context,
              builder: (context) {
                return AlertDialog(
                  title: Text(title),
                  content: Text(result['MessageText'] ?? 'Password changed'),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.pop(context),
                      child: const Text("OK"),
                    ),
                  ],
                );
              },
            );
          }
        }
      }
    } catch (e) {
      if (mounted) {
        showDialog(
          context: context,
          builder: (context) {
            return AlertDialog(
              title: const Text("Error"),
              content: Text('Error: $e'),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text("OK"),
                ),
              ],
            );
          },
        );
      }
    } finally {
      if (mounted) {
        setState(() => loading = false);
      }
    }
  }

  @override
  void dispose() {
    _clientNameController.dispose();
    _currentPasswordController.dispose();
    _newPasswordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const TBAppBar(title: "Change Password"),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TBTextField(
                label: "Client Name",
                controller: _clientNameController,
                enabled: false,
              ),
              const SizedBox(height: 16),
              TBTextField(
                label: "Current Password",
                controller: _currentPasswordController,
                obscureText: true,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return "Please enter current password";
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TBTextField(
                label: "New Password",
                controller: _newPasswordController,
                obscureText: true,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return "Please enter new password";
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TBTextField(
                label: "Confirm Password",
                controller: _confirmPasswordController,
                obscureText: true,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return "Please confirm new password";
                  } else if (value != _newPasswordController.text) {
                    return "Passwords do not match";
                  }
                  return null;
                },
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: loading ? null : _changePassword,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFdf8284),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: loading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text(
                          "Change Password",
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
