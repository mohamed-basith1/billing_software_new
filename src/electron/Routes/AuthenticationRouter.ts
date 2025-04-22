import { ipcMain } from "electron";
import nodemailer from "nodemailer";
import AuthendicationModel from "../models/AuthenticationModel.js";
export function AuthenticationRouter() {
  // Create Account
  ipcMain.handle("create-account", async (_, data) => {
    try {
      const { username, password, adminPassword } = data;
      // Check if an administrator exists
      const admin = await AuthendicationModel.findOne({
        role: "administrator",
      });
      if (!admin) {
        // No admin exists → Create the first admin account
        const newAdmin = await AuthendicationModel.create({
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
      const existingUser = await AuthendicationModel.findOne({ username });
      if (existingUser) {
        return {
          status: 409,
          message: "User already exists.",
        };
      }
      // Create new employee account
      const newUser = await AuthendicationModel.create({
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

  ipcMain.handle("update-account", async (_, data) => {
    try {
      const { username, newUserName, newPassword, currentPassword } = data;

      // Find the user by current username
      const user = await AuthendicationModel.findOne({ username });
      if (!user) {
        return {
          status: 404,
          message: "User not found.",
        };
      }

      // Validate current password
      if (user.password !== currentPassword) {
        return {
          status: 403,
          message: "Wrong current password.",
        };
      }

      // If username is being changed, check if new one already exists
      if (newUserName !== username) {
        const existingUser = await AuthendicationModel.findOne({
          username: newUserName,
        });
        if (existingUser) {
          return {
            status: 409,
            message: "New username is already taken.",
          };
        }
      }

      // Update user data
      user.username = newUserName || user.username;
      user.password = newPassword || user.password;

      await user.save();

      return {
        status: 200,
        message: "User details updated successfully.",
        data: {
          username: user.username,
        },
      };
    } catch (error: any) {
      console.error("Error updating account:", error);
      return {
        status: 500,
        message: "Internal server error.",
        error: error.message,
      };
    }
  });

  //updateAccount
  // Login
  ipcMain.handle("login-api", async (_, data) => {
    try {
      const { username, password } = data;
      // Find user by username
      const user = await AuthendicationModel.findOne({ username });
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

  ipcMain.handle("get-employee-list", async (_, data) => {
    try {
      const employee = await AuthendicationModel.find({
        role: "employee",
      });

      return {
        status: 201,
        message: "Employee List",
        data: JSON.parse(JSON.stringify(employee)),
      };
    } catch (error) {
      return {
        status: 500,
        message: "Internal server error.",
        // error: error.message,
      };
    }
  });

  ipcMain.handle("send-key", async (_, key) => {
    try {
      console.log("key", key);
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "posapplication123@gmail.com",
          pass: "huugbxihnpcijitv",
        },
      });

      let mailOptions = {
        from: "posapplication123@gmail.com",
        to: "basithjibri123@gmail.com",
        subject: "Your License Key",
        text: `Hey boss 😎! Here's your license key to activate the app: ${key}`,
      };

      let test = await transporter.sendMail(mailOptions);
      console.log("suscdfj", test);
      return {
        status: 200,
        message: "key successfully sended",
      };
    } catch (error) {
      console.log("error", error);
      return {
        status: 500,
        message: "Failed to send key",
      };
    }
  });
}
