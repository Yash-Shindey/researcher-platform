import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';
import { Types } from 'mongoose';

class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private readonly JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';

  async register(email: string, password: string) {
    try {
      console.log('Checking for existing user with email:', email);
      // Check if user already exists
      const existingUser = await UserModel.findOne({ email });
      
      if (existingUser) {
        console.log('User already exists with email:', email);
        throw new AuthError('User already exists');
      }

      console.log('No existing user found, creating new user');
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const user = await UserModel.create({
        email,
        password: hashedPassword
      });

      console.log('User created successfully:', user._id);

      // Generate tokens
      const { accessToken, refreshToken } = this.generateTokens(user._id.toString());

      return { user, accessToken, refreshToken };
    } catch (error) {
      console.error('Detailed registration error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new AuthError('Registration failed');
    }
  }

  async login(email: string, password: string) {
    try {
      console.log('Attempting login for email:', email);
      // Find user
      const user = await UserModel.findOne({ email });
      if (!user) {
        console.log('No user found with email:', email);
        throw new AuthError('User not found');
      }

      console.log('User found, verifying password');
      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        console.log('Invalid password for user:', email);
        throw new AuthError('Invalid password');
      }

      console.log('Password verified, generating tokens');
      // Generate tokens
      const { accessToken, refreshToken } = this.generateTokens(user._id.toString());

      return { user, accessToken, refreshToken };
    } catch (error) {
      console.error('Detailed login error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new AuthError('Login failed');
    }
  }

  private generateTokens(userId: string) {
    console.log('Generating tokens for userId:', userId);
    const accessToken = jwt.sign({ userId }, this.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId }, this.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }
}

export default new AuthService();
