# Skillet - Prep
## Tech Stack
- **Frontend**: React.js , React Native
- **Backend**: Node.js, Express.js , might also incorporate MongoDB

## Focus
- The project will have a slightly heavier focus on frontend development as it targets B2C interactions. However, backend development will also be given significant attention for a well-rounded application.
- Mobile app built with React Native.

## Goal
- To provide users with an application for finding, saving, and organizing food/drink recipes. Additionally, the app will generate grocery lists based on saved recipes, simplifying the shopping process.

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
  - Grocery list creation and management.
- **User Flow**:
  1. Download application.
  2. Create an account.
  3. Browse and save recipes.
  4. Create and manage grocery lists.
  5. Cook recipes.
- **Beyond CRUD**:
  - Entirely mobile app using React Native.
  - Potential integration with Vision Pro for enhanced accessibility features.