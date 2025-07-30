import { Request, Response } from 'express';
import { AuthUtils } from '@/utils/auth.js';
import { MockDataService } from '@/services/mockDataService.js';
import { ApiResponse, LoginResponse, RefreshTokenResponse } from '@/types/index.js';

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.validatedData;

      // Validate user credentials
      const user = await MockDataService.validatePassword(email, password);
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        } as ApiResponse);
        return;
      }

      // Generate tokens
      const accessToken = AuthUtils.generateAccessToken(user);
      const refreshToken = AuthUtils.generateRefreshToken(user.id);

      // Store refresh token
      MockDataService.storeRefreshToken(user.id, refreshToken);

      res.json({
        success: true,
        data: {
          user,
          token: accessToken,
          refreshToken,
        },
        message: 'Login successful',
      } as ApiResponse<LoginResponse>);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Login failed',
      } as ApiResponse);
    }
  }

  static async refresh(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.validatedData;

      // Verify refresh token
      const decoded = AuthUtils.verifyRefreshToken(refreshToken);
      const userId = decoded.userId;

      // Check if refresh token exists in storage
      const storedToken = MockDataService.getRefreshToken(userId);
      if (!storedToken || storedToken !== refreshToken) {
        res.status(401).json({
          success: false,
          message: 'Invalid refresh token',
        } as ApiResponse);
        return;
      }

      // Get user
      const user = await MockDataService.findUserById(userId);
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'User not found',
        } as ApiResponse);
        return;
      }

      // Generate new access token
      const newAccessToken = AuthUtils.generateAccessToken(user);

      res.json({
        success: true,
        data: {
          token: newAccessToken,
        },
        message: 'Token refreshed successfully',
      } as ApiResponse<RefreshTokenResponse>);
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      } as ApiResponse);
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (refreshToken) {
        // Try to decode to get user ID
        try {
          const decoded = AuthUtils.verifyRefreshToken(refreshToken);
          MockDataService.removeRefreshToken(decoded.userId);
        } catch (error) {
          // Token might be invalid, but we still want to respond with success
        }
      }

      res.json({
        success: true,
        message: 'Logged out successfully',
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Logout failed',
      } as ApiResponse);
    }
  }

  static async me(req: any, res: Response): Promise<void> {
    try {
      res.json({
        success: true,
        data: req.user,
        message: 'User profile retrieved successfully',
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve user profile',
      } as ApiResponse);
    }
  }
}
