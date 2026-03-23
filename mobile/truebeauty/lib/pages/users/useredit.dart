import 'package:flutter/material.dart';
import 'package:truebeauty/pages/widgets/tb_textfield.dart';
import 'package:truebeauty/services/api_service.dart';
import 'package:truebeauty/services/auth_service.dart';
import 'package:truebeauty/utilities/api_url.dart';
import 'package:intl/intl.dart';
// import your TBTextField widget file here
// import 'tb_textfield.dart';

class UserEditPage extends StatefulWidget {
  const UserEditPage({super.key});

  @override
  State<UserEditPage> createState() => _UserEditPageState();
}

class _UserEditPageState extends State<UserEditPage> {
  final TextEditingController _clientIdController = TextEditingController(
    text: "12345",
  ); // Example prefilled
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _addressController = TextEditingController();
  final TextEditingController _dobController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();

  String? _gender;
  bool loading = false;

  @override
  void initState() {
    super.initState();
    _loadClientInfo();
  }

  void _loadClientInfo() async {
    try {
      final userInfo = await AuthService.getUserInfo();
      _clientIdController.text = userInfo["clientID"] ?? '';
      final Map<String, dynamic> params = {
        "ClientID": userInfo["clientID"] ?? '',
      };
      final ApiService apiService = ApiService();

      final response = await apiService.post(ApiUrls.getclientinfo, params);

      if (response is Map &&
          response.containsKey('data') &&
          response['data'] is Map &&
          response['data'].containsKey('data')) {
        // Drill down to the actual list
        var data = response['data']['data'][0];

        setState(() {
          _nameController.text = data['Name'] ?? '';
          _addressController.text = data['Address'] ?? '';
          _dobController.text = data['FormattedDOB'] ?? '';
          _phoneController.text = data['PhoneNo'] ?? '';
          _gender = data['Gender'] ?? '';
        });
      } else {
        if (mounted) {
          showDialog(
            context: context,
            builder: (context) {
              return AlertDialog(
                title: const Text("Error"),
                content: Text('Error: No data found.'),
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
    }
  }

  Future<void> _pickDate() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime(2000),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
    );

    if (picked != null) {
      setState(() {
        _dobController.text = DateFormat('dd MMM yyyy', 'en_US').format(picked);
      });
    }
  }

  void _saveForm() async {
    setState(() => loading = true);
    try {
      final params = {
        "ClientID": _clientIdController.text,
        "ClientName": _nameController.text,
        "Address": _addressController.text,
        "DOB": _dobController.text,
        "PhoneNo": _phoneController.text,
        "Gender": _gender,
      };

      final ApiService apiService = ApiService();

      final response = await apiService.post(ApiUrls.clientinfoupdate, params);

      if (response is Map && response['status'] == true) {
        if (mounted) {
          showDialog(
            context: context,
            builder: (context) {
              return AlertDialog(
                title: const Text("Success"),
                content: Text('Saved Successfully!'),
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
      } else {
        if (mounted) {
          showDialog(
            context: context,
            builder: (context) {
              return AlertDialog(
                title: const Text("Error"),
                content: Text('Error: Saved Failed.'),
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
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Edit Info")),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: SingleChildScrollView(
          child: Column(
            children: [
              // Client ID (disabled)
              TBTextField(
                label: "Client ID",
                controller: _clientIdController,
                enabled: false,
              ),
              const SizedBox(height: 12),

              // Client Name
              TBTextField(label: "Client Name", controller: _nameController),
              const SizedBox(height: 12),

              // Address
              TBTextField(label: "Address", controller: _addressController),
              const SizedBox(height: 12),

              // DOB with Date Picker
              TBTextField(
                label: "DOB",
                controller: _dobController,
                enabled: true,
                suffixIcon: IconButton(
                  icon: const Icon(Icons.calendar_today),
                  onPressed: _pickDate,
                ),
              ),
              const SizedBox(height: 12),

              // Phone Number
              TBTextField(
                label: "Phone No",
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                readOnly: true,
              ),
              const SizedBox(height: 12),

              // Gender Dropdown
              // Gender selection using compact Radio buttons
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "Gender",
                    style: TextStyle(fontSize: 14, color: Colors.black54),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Row(
                        children: [
                          Radio<String>(
                            value: "1",
                            groupValue: _gender,
                            onChanged: (value) {
                              setState(() {
                                _gender = value;
                              });
                            },
                          ),
                          const Text("Male"),
                        ],
                      ),
                      const SizedBox(width: 16),
                      Row(
                        children: [
                          Radio<String>(
                            value: "2",
                            groupValue: _gender,
                            onChanged: (value) {
                              setState(() {
                                _gender = value;
                              });
                            },
                          ),
                          const Text("Female"),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 20),

              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: loading ? null : _saveForm,
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
                          "Save",
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
