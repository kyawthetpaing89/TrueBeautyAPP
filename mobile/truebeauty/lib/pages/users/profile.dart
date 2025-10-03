import 'package:flutter/material.dart';
import 'package:truebeauty/pages/users/userchangepassword.dart';
import 'package:truebeauty/pages/users/useredit.dart';
import 'package:truebeauty/pages/widgets/tb_menubar.dart';
import 'package:truebeauty/pages/users/userlogin.dart';
import 'package:truebeauty/services/auth_service.dart'; // AuthService created earlier

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  bool loggedIn = false;
  String? clientName;
  String? clientID;

  @override
  void initState() {
    super.initState();

    _loadUserInfo();
  }

  void _loadUserInfo() async {
    final userInfo = await AuthService.getUserInfo();
    if (!mounted) return;

    setState(() {
      loggedIn = userInfo["loggedIn"] as bool;
      clientID = userInfo["clientID"] as String?;
      clientName = userInfo["clientName"] as String?;
    });
  }

  void _handleLogout() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("Confirm Logout"),
        content: const Text("Are you sure you want to logout?"),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text("Cancel"),
          ),
          TextButton(
            onPressed: () => Navigator.of(context).pop(true),
            child: const Text("Logout"),
          ),
        ],
      ),
    );

    if (confirm == true) {
      await AuthService.logout();
      if (!mounted) return;

      setState(() {
        loggedIn = false;
        clientName = null;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Logged out successfully"),
          backgroundColor: Colors.green,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("My Profile", style: TextStyle(color: Colors.white)),
        backgroundColor: const Color(0xFFdf8284),
        centerTitle: true,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              // Profile Image with Edit Icon
              Stack(
                children: [
                  CircleAvatar(
                    radius: 60,
                    backgroundImage: AssetImage('assets/images/user.jpg'),
                    backgroundColor: Colors.grey[200],
                  ),
                  if (loggedIn)
                    Positioned(
                      bottom: 0,
                      right: 0,
                      child: GestureDetector(
                        onTap: () {},
                        child: Container(
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: Colors.teal,
                            border: Border.all(color: Colors.white, width: 2),
                          ),
                          padding: const EdgeInsets.all(6),
                          child: const Icon(
                            Icons.edit,
                            color: Colors.white,
                            size: 20,
                          ),
                        ),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 8),

              // Client Name
              Text(
                loggedIn && clientName != null ? clientName! : "",
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
              ),
              const SizedBox(height: 20),

              // Menu Options
              Card(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                elevation: 3,
                child: Column(
                  children: [
                    if (!loggedIn)
                      _profileMenuItem(
                        context,
                        icon: Icons.login,
                        label: "Login",
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const LoginPage(),
                            ),
                          );
                        },
                      ),
                    if (loggedIn) ...[
                      _profileMenuItem(
                        context,
                        icon: Icons.edit,
                        label: "Edit Info",
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const UserEditPage(),
                            ),
                          );
                        },
                      ),
                      const Divider(height: 1),
                      _profileMenuItem(
                        context,
                        icon: Icons.lock,
                        label: "Change Password",
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) =>
                                  const UserChangePasswordPage(),
                            ),
                          );
                        },
                      ),
                      const Divider(height: 1),
                      _profileMenuItem(
                        context,
                        icon: Icons.power_settings_new,
                        label: "Logout",
                        onTap: _handleLogout,
                      ),
                    ],
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: const TBMenuBar(currentIndex: 2),
    );
  }

  Widget _profileMenuItem(
    BuildContext context, {
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return ListTile(
      leading: Icon(icon, color: const Color(0xFFdf8284)),
      title: Text(label),
      trailing: const Icon(Icons.arrow_forward_ios, size: 16),
      onTap: onTap,
    );
  }
}
