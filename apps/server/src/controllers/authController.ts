import { Request, Response } from 'express';
import AuthService from '../services/authService';

// Define custom error type
class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppError';
  }
}

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      console.log('Register request:', { email, password });
      
      const result = await AuthService.register(email, password);
      
      // Set refresh token in http-only cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      // Send access token in response
      res.json({
        user: { email: result.user.email },
        accessToken: result.accessToken
      });
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof AppError || error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'Registration failed' });
      }
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      console.log('Login request:', { email, password });
      
      const result = await AuthService.login(email, password);
      
      // Set refresh token in http-only cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      // Send access token in response
      res.json({
        user: { email: result.user.email },
        accessToken: result.accessToken
      });
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof AppError || error instanceof Error) {
        res.status(401).json({ message: error.message });
      } else {
        res.status(401).json({ message: 'Login failed' });
      }
    }
  }
}

export default new AuthController();
