import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class AboutPage extends StatelessWidget {
  const AboutPage({super.key});

  // Launch phone call
  void _launchPhone(String phone) async {
    final uri = Uri(scheme: 'tel', path: phone);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  // Launch email
  void _launchEmail(String email) async {
    final uri = Uri(scheme: 'mailto', path: email);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  // Launch Google Maps
  void _launchMap() async {
    final Uri url = Uri.parse(
      'https://maps.app.goo.gl/aPxzqBig1z7N2jCFA?g_st=ipc',
    ); // your location
    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    }
  }

  // Launch Facebook page
  void _launchFacebook(String fbPageId, String fbPageUrl) async {
    final fbUri = Uri.parse('fb://page/$fbPageId'); // Open in app
    final webUri = Uri.parse(fbPageUrl); // Fallback web URL

    if (await canLaunchUrl(fbUri)) {
      await launchUrl(fbUri);
    } else if (await canLaunchUrl(webUri)) {
      await launchUrl(webUri);
    } else {
      throw 'Could not launch Facebook page';
    }
  }

  @override
  Widget build(BuildContext context) {
    const shopAddress = "14 Street, between 80 x 81 streets, Mandalay, Myanmar";
    const phoneNumber = "+95 9 957 222177";
    const email = "truebeautyaesthetic.mdy@gmail.com";
    const fbPageId = "19x2PF511U";
    const fbPageUrl =
        "https://www.facebook.com/share/19x2PF511U/?mibextid=wwXIfr";

    return Scaffold(
      appBar: AppBar(
        title: const Text("About Shop", style: TextStyle(color: Colors.white)),
        backgroundColor: const Color(0xFFdf8284),
        iconTheme: const IconThemeData(
          color: Colors.white,
        ), // <-- back button color
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 10),
            Center(
              child: CircleAvatar(
                radius: 40,
                backgroundImage: AssetImage(
                  'assets/images/truebeauty-logo.webp',
                ),
                backgroundColor: Colors.transparent,
              ),
            ),
            const SizedBox(height: 16),
            const Center(
              child: Text(
                "True Beauty Aesthetic & Wellness Center",
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                textAlign: TextAlign.center,
              ),
            ),
            const Divider(height: 40, thickness: 1),

            // Address
            const Text(
              "Address",
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 4),
            Text(
              shopAddress,
              style: const TextStyle(fontSize: 14, color: Colors.grey),
            ),
            const SizedBox(height: 8),
            GestureDetector(
              onTap: _launchMap,
              child: Row(
                children: const [
                  Icon(Icons.location_on, color: Colors.red),
                  SizedBox(width: 4),
                  Text(
                    "Open in Google Maps",
                    style: TextStyle(
                      color: Colors.blue,
                      fontSize: 14,
                      decoration: TextDecoration.underline,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Phone
            const Text(
              "Phone",
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 4),
            GestureDetector(
              onTap: () => _launchPhone(phoneNumber),
              child: Text(
                phoneNumber,
                style: const TextStyle(
                  fontSize: 14,
                  color: Colors.blue,
                  decoration: TextDecoration.underline,
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Email
            const Text(
              "Email",
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 4),
            GestureDetector(
              onTap: () => _launchEmail(email),
              child: Text(
                email,
                style: const TextStyle(
                  fontSize: 14,
                  color: Colors.blue,
                  decoration: TextDecoration.underline,
                ),
              ),
            ),

            const SizedBox(height: 16),
            const Text(
              "Facebook",
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 4),
            GestureDetector(
              onTap: () => _launchFacebook(fbPageId, fbPageUrl),
              child: const Text(
                "Visit our Facebook Page",
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.blue,
                  decoration: TextDecoration.underline,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
