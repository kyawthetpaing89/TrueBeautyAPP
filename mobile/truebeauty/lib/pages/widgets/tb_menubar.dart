import 'package:flutter/material.dart';
import 'package:truebeauty/pages/home/about.dart';
import 'package:truebeauty/pages/home/homepage.dart';
import 'package:truebeauty/pages/users/profile.dart';

class TBMenuBar extends StatelessWidget {
  final int currentIndex;

  const TBMenuBar({super.key, required this.currentIndex});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        child: Container(
          height: 60, // Slim height
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(30),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.08),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(30),
            child: BottomNavigationBar(
              currentIndex: currentIndex,
              type: BottomNavigationBarType.fixed,
              backgroundColor: Colors.white,
              selectedItemColor: const Color(0xFFdf8284),
              unselectedItemColor: Colors.grey[500],
              showUnselectedLabels: true,
              selectedLabelStyle: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 12,
              ),
              unselectedLabelStyle: const TextStyle(
                fontWeight: FontWeight.w400,
                fontSize: 12,
              ),
              iconSize: 24,
              items: const [
                BottomNavigationBarItem(
                  icon: Icon(Icons.home_outlined),
                  activeIcon: Icon(Icons.home),
                  label: "Home",
                ),
                BottomNavigationBarItem(
                  icon: Icon(Icons.notifications_outlined),
                  activeIcon: Icon(Icons.notifications),
                  label: "Noti",
                ),
                BottomNavigationBarItem(
                  icon: Icon(Icons.person_outline),
                  activeIcon: Icon(Icons.person),
                  label: "Profile",
                ),
              ],
              onTap: (index) {
                if (index == currentIndex) return;

                final destination = (index == 0)
                    ? const HomePage()
                    : (index == 1)
                    ? const AboutPage()
                    : const ProfilePage();

                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => destination),
                );
              },
            ),
          ),
        ),
      ),
    );
  }
}
