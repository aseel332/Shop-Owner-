# Shop Owner App

A React Native (Expo) mobile app that helps local shop owners put their store online: register the shop, verify ownership, add products with prices, and manage stock.

## Features

- **Account:** sign up and log in with Firebase Authentication.
- **Shop onboarding:** a step-by-step flow for shop name and photo, location (with GPS), shop description, and owner verification (ID card and shop document uploads).
- **Products:** add products with details and prices, then view them in a catalog.
- **Stock management:** track and update inventory.
- **Subscription screen** for the shop's plan.

## Tech stack

| Layer | Tools |
| --- | --- |
| Mobile | React Native, Expo, React Navigation (stack + drawer), Expo Location, Expo Image/Document Picker |
| Auth | Firebase Authentication |
| Backend | Node.js, Express, Multer (file uploads) |
| Database | MongoDB (Mongoose) |

## Getting started

```bash
git clone https://github.com/aseel332/Shop-Owner-.git
cd Shop-Owner-
npm install

# start the API (needs MongoDB running on localhost:27017)
node server.js

# start the app (new terminal)
npx expo start
```

Add your own Firebase config in `app/firebase.js`.

## Project structure

```
app/screens/      onboarding, auth, product, stock and subscription screens
app/navigation/   app navigator
server.js         Express + MongoDB API for shop details, locations and documents
```
