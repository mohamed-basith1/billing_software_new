import { ipcMain } from "electron";
import Authendication from "../models/Authentication.js";

export function AuthenticationRouter() {
  // Create Account
  ipcMain.handle("create-account", async (_, data) => {
    try {
      const { username, password, adminPassword } = data;

      // Check if an administrator exists
      const admin = await Authendication.findOne({
        role: "administrator",
      });

      if (!admin) {
        // No admin exists → Create the first admin account
        const newAdmin = await Authendication.create({
          username,
          password,
          role: "administrator",
        });

        return {
          status: 201,
          message: "Administrator account created successfully.",
          data: {
            username: newAdmin.username,
            role: newAdmin.role,
          },
        };
      }

      // Validate Admin Password
      if (admin.password !== adminPassword) {
        return {
          status: 403,
          message: "Invalid administrator password.",
        };
      }

      // Check if username already exists
      const existingUser = await Authendication.findOne({ username });
      if (existingUser) {
        return {
          status: 409,
          message: "User already exists.",
        };
      }

      // Create new employee account
      const newUser = await Authendication.create({
        username,
        password,
        role: "employee",
      });

      return {
        status: 201,
        message: "Employee account created successfully.",
        data: {
          username: newUser.username,
          role: newUser.role,
        },
      };
    } catch (error: any) {
      console.error("Error creating account:", error);
      return {
        status: 500,
        message: "Internal server error.",
        error: error.message,
      };
    }
  });

  // Login
  ipcMain.handle("login-api", async (_, data) => {
    try {
      const { username, password } = data;

      // Find user by username
      const user = await Authendication.findOne({ username });

      if (!user) {
        return {
          status: 404,
          message: "User not found.",
        };
      }

      // Check password (no encryption)
      if (user.password !== password) {
        return {
          status: 401,
          message: "Incorrect password.",
        };
      }

      return {
        status: 200,
        message: "Login successful.",
        data: {
          username: user.username,
          role: user.role,
        },
      };
    } catch (error: any) {
      console.error("Error logging in:", error);
      return {
        status: 500,
        message: "Internal server error.",
        error: error.message,
      };
    }
  });
}
