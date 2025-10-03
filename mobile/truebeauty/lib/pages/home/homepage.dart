import 'package:flutter/material.dart';
import 'package:truebeauty/pages/home/about.dart';
import 'package:truebeauty/pages/items/itemlist.dart';
import 'package:truebeauty/pages/widgets/tb_menubar.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  List<CategoryItem> categories(BuildContext context) => [
    CategoryItem(
      icon: Icons.spa,
      label: "Products",
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => const ItemListPage()),
        );
      },
    ),
    CategoryItem(
      icon: Icons.event,
      label: "Booking",
      onTap: () {
        // Navigate to Booking page
      },
    ),
    CategoryItem(
      icon: Icons.star,
      label: "Favorites",
      onTap: () {
        // Navigate to Favorites page
      },
    ),
    CategoryItem(
      icon: Icons.history,
      label: "Treatment History",
      onTap: () {
        // Navigate to Treatment History page
      },
    ),
    CategoryItem(
      icon: Icons.store,
      label: "About Shop",
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => const AboutPage()),
        );
      },
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        leading: Padding(
          padding: const EdgeInsets.all(8.0), // optional padding
          child: CircleAvatar(
            backgroundImage: AssetImage('assets/images/user.jpg'),
            radius: 20, // adjust size
          ),
        ),
        title: const Text(
          "TrueBeauty",
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        backgroundColor: const Color(0xFFdf8284),
        automaticallyImplyLeading: false,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications, color: Colors.white),
            onPressed: () {},
          ),
        ],
      ),

      body: SafeArea(
        child: Column(
          children: [
            // ✅ Banner image
            Container(
              width: double.infinity,
              height: 180, // Banner height
              margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(16),
                image: const DecorationImage(
                  image: AssetImage(
                    "assets/images/sampleproduct.jpg",
                  ), // Your banner image
                  fit: BoxFit.cover,
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withValues(alpha: 0.2),
                    blurRadius: 5,
                    offset: const Offset(0, 3),
                  ),
                ],
              ),
            ),

            // ✅ Category Menu (Two Lines)
            Padding(
              padding: const EdgeInsets.only(top: 8.0),
              child: SizedBox(
                // Adjust height to fit two lines
                height: 200,
                child: SingleChildScrollView(
                  child: Wrap(
                    spacing: 10,
                    runSpacing: 12,
                    children: categories(context).map((item) {
                      return _categoryCard(
                        item.icon,
                        item.label,
                        onTap: item.onTap,
                      );
                    }).toList(),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),

      // ✅ Bottom Navigation
      bottomNavigationBar: const TBMenuBar(currentIndex: 0),
    );
  }

  // ================== Category Card Widget ==================
  Widget _categoryCard(IconData icon, String label, {VoidCallback? onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(right: 0), // handled by Wrap spacing
        child: Column(
          children: [
            // Circle for the icon
            Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withValues(alpha: 0.2),
                    blurRadius: 4,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Center(
                child: Icon(icon, size: 24, color: const Color(0xFFdf8284)),
              ),
            ),
            const SizedBox(height: 4),
            SizedBox(
              width: 60,
              child: Text(
                label,
                textAlign: TextAlign.center,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class CategoryItem {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  CategoryItem({required this.icon, required this.label, required this.onTap});
}
