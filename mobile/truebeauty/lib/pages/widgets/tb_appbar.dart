import 'package:flutter/material.dart';

class TBAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final bool centerTitle;
  final Color backgroundColor;

  const TBAppBar({
    super.key,
    required this.title,
    this.centerTitle = true,
    this.backgroundColor = const Color(0xFFdf8284),
  });

  @override
  Widget build(BuildContext context) {
    return AppBar(
      title: Text(
        title,
        style: const TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.bold,
        ),
      ),
      centerTitle: centerTitle,
      backgroundColor: backgroundColor,
      iconTheme: const IconThemeData(
        color: Colors.white, // back button color
      ),
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
