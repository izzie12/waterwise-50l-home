# WaterWise: A Water Conservation Education and Tracking Platform

## Dissertation Project for BSc (Hons) Computer Science
### University of East London
### Academic Year 2024-2025

## Project Overview
WaterWise is a comprehensive web application developed as part of my final year dissertation for the BSc (Hons) Computer Science degree. The project aims to address the critical issue of water conservation through education and user engagement, combining modern web technologies with sustainable practices.

## Problem Statement
Water scarcity and conservation have become increasingly important global issues. Many individuals lack awareness of their water consumption patterns and the impact of their daily water usage. This project seeks to bridge this knowledge gap by providing:
- Personalized water usage tracking
- Educational content on water conservation
- Real-time monitoring and feedback
- Gamification elements to encourage sustainable practices

## Technical Implementation

### Technology Stack
- **Frontend**: React.js with Vite
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Tailwind CSS
- **Testing**: Jest and React Testing Library

### Key Features
1. **User Authentication**
   - Secure registration and login
   - JWT-based authentication
   - User profile management

2. **Water Usage Tracking**
   - Daily water consumption logging
   - Multiple usage categories (shower, toilet, etc.)
   - Usage statistics and trends
   - Target setting and achievement tracking

3. **Educational Platform**
   - Interactive lessons on water conservation
   - Progress tracking
   - Quiz-based assessments
   - Achievement system

4. **Dashboard Analytics**
   - Real-time usage statistics
   - Historical data visualization
   - Progress tracking
   - Personalized recommendations

5. **Notification System**
   - Usage alerts
   - Educational reminders
   - Achievement notifications
   - Conservation tips

## Project Structure
```
waterwise/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── tests/        # Frontend tests
│   └── public/           # Static assets
├── server/                # Backend Node.js application
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── tests/            # Backend tests
└── docs/                 # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/waterwise.git
   cd waterwise
   ```

2. Install dependencies:
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables:
   - Create `.env` files in both client and server directories
   - Configure necessary environment variables (see `.env.example` files)

4. Start the development servers:
   ```bash
   # Start backend server
   cd server
   npm run dev

   # Start frontend server
   cd ../client
   npm run dev
   ```

## Testing
```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test
```

## Research Methodology
This project follows a systematic approach to software development and research:
1. Literature review of water conservation practices
2. User research and requirements gathering
3. System design and architecture planning
4. Implementation using modern web technologies
5. Testing and validation
6. User feedback and iteration

## Future Enhancements
- Mobile application development
- Integration with smart water meters
- Advanced data analytics and machine learning
- Community features and social sharing
- Gamification enhancements

## Acknowledgments
- University of East London Faculty
- Project Supervisor
- Open-source community
- Research participants

## Author
Isaac Ntegeka
BSc (Hons) Computer Science
University of East London

## License
This project is part of academic research and is not licensed for commercial use.

## Contact
For academic inquiries:
- LinkedIn: https://www.linkedin.com/in/isaacntegeka/
- My personal website: https://ntegeka.com

---

*This project was developed as part of the final year dissertation for the BSc (Hons) Computer Science degree at the University of East London. The research and development were conducted under the supervision of Ms. Halima Kure.* 