import 'package:flutter/material.dart';
import 'package:truebeauty/services/api_service.dart';

class ItemListPage extends StatefulWidget {
  const ItemListPage({super.key});

  @override
  State<ItemListPage> createState() => _ItemListPageState();
}

class _ItemListPageState extends State<ItemListPage> {
  final ApiService apiService = ApiService();

  late Future<List<dynamic>> _itemsFuture;

  String itemType = 'T';
  String searchText = '';

  @override
  void initState() {
    super.initState();
    _itemsFuture = _fetchItems();
  }

  Future<List<dynamic>> _fetchItems() async {
    final Map<String, dynamic> params = {
      "ItemCD": "",
      "ItemName": "",
      "ItemType": itemType,
      "InstructionCD": "",
    };

    final data = await apiService.post("item/getitem", params);

    if (data is Map &&
        data.containsKey('data') &&
        data['data'] is Map &&
        data['data'].containsKey('data')) {
      // Drill down to the actual list
      return data['data']['data'] as List<dynamic>;
    } else {
      throw Exception("Unexpected API response format: $data");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () {
            Navigator.pop(context); // Go back to previous screen
          },
        ),
        title: const Text("Our Items", style: TextStyle(color: Colors.white)),
        backgroundColor: const Color(0xFFdf8284),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: SizedBox(
              height: 42,
              child: TextField(
                decoration: InputDecoration(
                  hintText: "Search items...",
                  prefixIcon: const Icon(Icons.search, size: 20),
                  filled: true,
                  fillColor: Colors.white,
                  contentPadding: const EdgeInsets.symmetric(vertical: 8),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide.none,
                  ),
                ),
                onChanged: (value) {
                  setState(() {
                    searchText = value; // new state variable
                  });
                },
              ),
            ),
          ),

          // ✅ List of items
          Expanded(
            child: FutureBuilder<List<dynamic>>(
              future: _itemsFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  return Center(
                    child: Text(
                      "Error: ${snapshot.error}",
                      style: const TextStyle(color: Colors.red),
                    ),
                  );
                } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return const Center(child: Text("No items found"));
                }

                // Apply search filter
                final items = snapshot.data!
                    .where(
                      (item) => item['ItemName']
                          .toString()
                          .toLowerCase()
                          .contains(searchText.toLowerCase()),
                    )
                    .toList();

                return ListView.builder(
                  padding: const EdgeInsets.all(8),
                  itemCount: items.length,
                  itemBuilder: (context, index) {
                    final item = items[index];

                    return Card(
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      elevation: 3,
                      margin: const EdgeInsets.symmetric(vertical: 6),
                      child: ListTile(
                        leading: CircleAvatar(
                          backgroundColor: const Color(0xFFdf8284),
                          child: Text(
                            (item['ItemName'] ?? '?')[0].toUpperCase(),
                            style: const TextStyle(color: Colors.white),
                          ),
                        ),
                        title: Text(
                          item['ItemName'] ?? 'No Name',
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            if (item['Description'] != null &&
                                item['Description'] != '')
                              Text(
                                item['Description'],
                                style: TextStyle(color: Colors.grey[600]),
                              ),
                            const SizedBox(height: 4),
                            Text(
                              "Price: ${item['Price'] != null ? item['Price'].toStringAsFixed(0) : '0'}",
                              style: const TextStyle(
                                color: Colors.black87,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                        trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                        onTap: () {
                          // Handle item click
                        },
                      ),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),

      // ✅ Bottom navigation menu
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        backgroundColor: const Color(0xFFdf8284),
        selectedItemColor: Colors.white,
        unselectedItemColor: Colors.black,
        currentIndex: itemType == 'T'
            ? 0
            : itemType == 'M'
            ? 1
            : 2,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.spa), label: "Treatments"),
          BottomNavigationBarItem(
            icon: Icon(Icons.medical_services),
            label: "Medicines",
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.face_retouching_natural),
            label: "Skincares",
          ),
        ],
        onTap: (index) {
          setState(() {
            if (index == 0) {
              itemType = 'T';
            } else if (index == 1) {
              itemType = 'M';
            } else if (index == 2) {
              itemType = 'S';
            }
            _itemsFuture = _fetchItems();
          });
        },
      ),
    );
  }
}
