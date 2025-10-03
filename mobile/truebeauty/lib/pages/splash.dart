import 'package:flutter/material.dart';
import 'package:truebeauty/pages/users/userlogin.dart';
// The import for home_page.dart has been removed.

class SplashPage extends StatefulWidget {
  const SplashPage({super.key});

  @override
  State<SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends State<SplashPage>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _animation;

  @override
  void initState() {
    super.initState();

    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    );

    _animation = Tween<double>(
      begin: 0.9,
      end: 1.1,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeInOut));

    // This is the crucial line: it rebuilds the widget on every animation tick.
    _controller.addListener(() {
      if (mounted) {
        setState(() {});
      }
    });

    _controller.repeat(reverse: true);

    // Navigate to item list after 3 seconds
    Future.delayed(const Duration(seconds: 3), () {
      if (mounted) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => LoginPage()),
        );
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: ScaleTransition(
          scale: _animation,
          child: ClipOval(
            child: Image.asset(
              'assets/images/truebeauty-logo.webp',
              width: 150,
              height: 150,
              fit: BoxFit.cover,
            ),
          ),
        ),
      ),
    );
  }
}
