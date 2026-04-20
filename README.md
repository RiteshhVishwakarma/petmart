# 🐾 PetMart - Pet Products E-Commerce App

A modern mobile e-commerce application for pet products, built with React Native and Firebase. Shop for your furry friends with ease!

![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)
![Expo](https://img.shields.io/badge/Expo-000020?style=flat-square&logo=expo&logoColor=white)

---

## 📱 About

PetMart is a full-featured mobile shopping app designed for pet owners. Browse through a wide range of pet products including food, toys, accessories, and healthcare items. The app provides a smooth shopping experience with features like product search, filtering, reviews, and secure checkout.

Built as a college project to demonstrate modern mobile app development practices using React Native, TypeScript, and Firebase.

---

## ✨ Features

- **Product Catalog** - Browse products by categories (Dogs, Cats, Birds, Fish, etc.)
- **Search & Filter** - Find products quickly with search and price filters
- **Product Reviews** - Read and write reviews with star ratings
- **Shopping Cart** - Add items, adjust quantities, and manage your cart
- **Wishlist** - Save your favorite products for later
- **User Accounts** - Sign up and manage your profile
- **Order History** - Track your past orders
- **Dark Mode** - Switch between light and dark themes
- **Admin Panel** - Manage products and orders (admin users only)

---

## 🛠️ Tech Stack

**Frontend:**
- React Native with Expo
- TypeScript for type safety
- React Navigation for routing
- Context API for state management

**Backend:**
- Firebase Authentication
- Cloud Firestore database
- Cloudinary for image storage

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:
- Node.js (v16+)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/petmart.git
cd petmart
```

2. Install dependencies
```bash
npm install
```

3. Set up Firebase
   - Create a project at [Firebase Console](https://console.firebase.google.com)
   - Enable Email/Password authentication
   - Create a Firestore database
   - Add your Firebase config to `config/firebase.ts`

4. Start the development server
```bash
npm start
```

5. Run on your device
   - Install Expo Go on your phone
   - Scan the QR code from the terminal
   - Or press `a` for Android emulator / `i` for iOS simulator

---

## 📂 Project Structure

```
petmart/
├── components/       # Reusable UI components
├── screens/          # App screens (Home, Cart, Profile, etc.)
├── context/          # React Context for state management
├── services/         # API calls and business logic
├── config/           # Configuration files
├── types/            # TypeScript type definitions
├── utils/            # Helper functions
└── App.tsx           # Root component
```

---

## 🎯 Key Functionality

### For Customers
- Browse products without login (guest mode)
- Search and filter products by category and price
- View detailed product information with images
- Read reviews from other customers
- Add products to cart and wishlist
- Secure checkout with address management
- Track order history

### For Admins
- Add and edit products
- Upload product images
- Manage orders and update status
- View sales analytics

---

## 🔧 Configuration

### Firebase Setup

Update `config/firebase.ts` with your Firebase credentials:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### Cloudinary Setup (Optional)

For image uploads, update `services/uploadService.ts`:

```typescript
const CLOUDINARY_CLOUD_NAME = "your-cloud-name";
const CLOUDINARY_UPLOAD_PRESET = "your-upload-preset";
```

---

## 📸 Screenshots

*Coming soon - Screenshots will be added here*

---

## 🤝 Contributing

This is a college project, but suggestions and improvements are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

---

## 📝 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Author

**Ritesh Vishwakarma**

BCA Student | Full Stack Developer

- GitHub: [@RiteshhVishwakarma](https://github.com/RiteshhVishwakarma)
- LinkedIn: [Ritesh Vishwakarma](https://www.linkedin.com/in/ritesh-vishwakarma-272907229/)
- Email: riteshsunstone@gmail.com

---

## 🙏 Acknowledgments

- Thanks to the React Native and Expo communities
- Firebase for the backend infrastructure
- All the open-source libraries used in this project

---

## 📊 Project Info

- **Development Time:** 2.5 months
- **Purpose:** College Project (BCA Final Year)
- **University:** Ajeenkya DY Patil University, Pune
- **Status:** Active Development

---

<div align="center">

**⭐ If you find this project helpful, please give it a star!**

Made with ❤️ for pet lovers

</div>
