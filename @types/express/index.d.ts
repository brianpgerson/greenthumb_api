declare namespace Express {
    export interface Request extends RequestI {
      user?: import('../../models/User').UserAttributes,
      loggedInUser?: import('../../middleware/auth/jwt-middleware').LoggedInUser,
    }
  }