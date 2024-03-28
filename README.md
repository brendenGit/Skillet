# Skillet
Skillet is live [here](https://skillet-1.onrender.com/) but keep in mind availability is limited until we run out of requests for the day from [Spoonacular](https://spoonacular.com/food-api). I'm on a small tier they offer!
## Overview
Skillet is a full-stack application that allows users to explore, save, and rate recipes. The backend is built with Node.js and Express, while the frontend is powered by Vite.

## Getting Started

### Prerequisites
- Node.js
- PostgreSQL
- A Spoonacular API key (obtain one from [Spoonacular](https://spoonacular.com/))

### Setting Up the Backend

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/skillet.git
   cd skillet/backend
2. ```bash
   cd skillet-backend
   npm install
   psql < skillet.sql
4. Set up environmental variables
    ### For development
    DB_USER=your_psql_username
    DB_PASSWORD=your_psql_password
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=skillet
    
    ### For testing
    DB_TEST_NAME=skillet_test
    
    SPOON_API_KEY=your_spoonacular_api_key
    FEATURED_RECIPE_ID=637876
    DAILY_QUOTA_LIMIT=1500

5. ```bash
   node server.js
6. The backend is ready to go. The cloned repo should have 100% test coverage checked with npm test (uses Jest)
   ```bash
   npm test
   
### Setting Up the Frontend
1. ```bash
   cd skillet-frontend
   npm install
   npm run dev

## Contributing
Contributions are welcome! Please feel free to submit a pull request.

## Tech Stack
- **Frontend**: React.js , React Native
- **Backend**: Node.js, Express.js , might also incorporate MongoDB

## Focus
- The project will have a slightly heavier focus on frontend development as it targets B2C interactions. However, backend development will also be given significant attention for a well-rounded application.
- Mobile app built with React Native.

## Goal
- To provide users with an application for finding, saving, and organizing food/drink recipes.

## Target Users
- Consumer audience, individuals seeking recipe organization and grocery planning solutions.

## Data Sources
- Utilizing APIs:
  - [Spoonacular](https://spoonacular.com/food-api/docs)
- User-generated recipes (potentially added in later stages).

## Approach
- **Database Schema**: 
  - Designed on dbdiagram.io.
  - Found in skillet-backend/skillet_schema.PNG
- **Possible API Issues**:
  - Mitigating excessive calls to external APIs through caching mechanisms.
  - Handling user recipe uploads and potential data cleanliness issues from web scraping.
- **Information Security**: 
  - Prioritizing secure authentication, possibly leveraging a more opinionated database framework.
- **Functionality**:
  - Account creation for application access.
  - Recipe management: viewing, saving, uploading.
  - Cooking mode: guided step-by-step instructions.
- **User Flow**:
  1. Download application.
  2. Create an account.
  3. Browse and save recipes.
  4. Cook recipes.
- **Beyond CRUD**:
  - Entirely mobile app using React and Material UI For responsive design.
  - Potential integration with Vision Pro for enhanced accessibility features.
