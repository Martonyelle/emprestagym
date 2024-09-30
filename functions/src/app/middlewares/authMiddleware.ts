import {User} from "@firebase/auth";
import {Request, Response} from "express";
import {jwtDecode} from "jwt-decode";
import {admin} from "../../config/firebase";

interface CustomUser extends User {
  user_id: string;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
  customer_id?: string;
  asaas_access_token?: string;
}

const checkToken = async (req: AuthenticatedRequest, res: Response, next: any) => {
  // Get the token from the request header
  const token = req.header("Authorization");
  const customerId = req.header("Customer_id");
  if (customerId) req.customer_id = customerId;

  try {
    // Check if the token is present
    if (!token) {
      return res.status(401).json({message: "Token not provided"});
    }
    // Check if the token is valid
    const decoded = jwtDecode(token) as CustomUser;

    const userEmail = decoded.email ? decoded.email : "";
    const userId = decoded.user_id ? decoded.user_id : (await admin.auth().getUserByEmail(userEmail)).uid;

    const isUserValid = await checkUser(userId, userEmail);

    if (isUserValid) {
      // Add the token payload to the request for use in protected routes
      req.user = decoded;
      return next();
    } else {
      throw new Error("Invalid Token");
    }
  } catch (error:any) {
    return res.status(401).json(error.message);
  }
};

const checkTokenByURL = async (req: AuthenticatedRequest, res: Response, next: any) => {
  // Get the token from the request header
  const token = req.query.token;
  const customerId = req.query.customer_id;
  if (customerId) req.customer_id = customerId.toString();

  try {
    if (!token) {
      throw new Error("Token not provided");
    }

    // Check if the token is valid
    const decoded = jwtDecode(token.toString()) as CustomUser;
    const userEmail = decoded.email ? decoded.email : "";
    const userId = decoded.user_id ? decoded.user_id : (await admin.auth().getUserByEmail(userEmail)).uid;

    const isUserValid = await checkUser(userId, userEmail);

    if (isUserValid) {
      // Add the token payload to the request for use in protected routes
      req.user = decoded;
      return next();
    } else {
      throw new Error("Invalid Token");
    }
  } catch (error:any) {
    return res.status(401).json(error.message);
  }
};

const checkUser = async (userId: string, email: string): Promise<boolean> => {
  try {
    // Get user information based on the ID
    const userRecord = await admin.auth().getUser(userId);
    // Check if the email matches the email associated with the user
    if (userRecord.email === email) {
      // Check if the user is active
      if (userRecord.disabled) {
        // console.log('The user is disabled.');
        return false;
      } else {
        // console.log('The user is active and valid.');
        return true;
      }
    } else {
      // console.log('The provided email does not match the user\'s email.');
      return false;
    }
  } catch (error) {
    // console.error('Error while checking the user:', error);
    return false;
  }
};

export {
  checkToken,
  checkTokenByURL,
};
