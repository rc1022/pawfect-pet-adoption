# Pawfect

Pawfect is a full-stack application for pet adoption, featuring a React Native (Expo) client and a Node.js/Express backend. It helps users browse, search, and manage adoptable pets from multiple shelters.

## Project Structure

```
Pawfect/
├── client/   # Frontend (Expo/React Native)
├── server/   # Backend (Node.js/Express)
├── docs/     # Documentation and guides
└── README.md # Project overview (this file)
```

### client/
- Built with Expo and React Native
- Contains mobile app source code and assets
- Uses file-based routing and modern React features

### server/
- Node.js with Express for RESTful APIs
- Handles authentication, database (MongoDB), and data scraping
- Contains environment variables in `.env` (excluded from version control)

### docs/
- Additional documentation and learning guides

## Getting Started

### Prerequisites
- Node.js and npm installed
- MongoDB connection string (for backend)
- Expo CLI (`npm install -g expo-cli`)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/pawfect.git
cd pawfect
```

### 2. Install dependencies
#### Client
```bash
cd client
npm install
```
#### Server
```bash
cd ../server
npm install
```

### 3. Configure Environment Variables
- Copy `.env.example` to `.env` in the `server/` directory and fill in your secrets (do not commit `.env` to git).

### 4. Run the Application
#### Start the backend server
```bash
cd server
node server.js
```
#### Start the mobile app
```bash
cd ../client
npx expo start
```

## Features
- Browse and search adoptable pets
- Multi-shelter support
- RESTful API backend
- Mobile-first, modern UI

## Future Features / In Development
- User authentication and pet adoption application tracking
- Push notifications for new pets and updates
- Admin dashboard for shelter management
- Favorites and saved searches
- In-app messaging between users and shelters
- Enhanced filtering and sorting options
- Integration with more shelters and pet databases
- Analytics dashboard for adoption trends
- Localization and multi-language support
- Improved accessibility and UI/UX enhancements

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)

---

**Note:**
- Do not commit sensitive files such as `.env` or credentials.
- Make sure all dependencies are installed before running the app.
- If you encounter missing image assets (e.g., `SPCA_logo.png`), add them to `client/assets/`.
