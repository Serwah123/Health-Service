import { Request, Response, NextFunction } from 'express';
import { AuthUtils } from '@/utils/auth.js';
import { ApiResponse, User } from '@/types/index.js';

// Extend Express Request interface
export interface AuthenticatedRequest extends Request {
  user?: User;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = AuthUtils.extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access token is required',
      } as ApiResponse);
      return;
    }

    const decoded = AuthUtils.verifyAccessToken(token);
    
    // In a real application, you would fetch the user from the database
    // For now, we'll create a mock user based on the token
    const user: User = {
      id: decoded.userId,
      email: decoded.email,
      firstName: 'Demo',
      lastName: 'User',
      role: decoded.role || 'researcher',
      permissions: ['read:studies', 'write:studies', 'read:patients'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    } as ApiResponse);
  }
};

export const authorize = (requiredPermissions: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      } as ApiResponse);
      return;
    }

    const userPermissions = req.user.permissions || [];
    const hasPermission = requiredPermissions.some(permission =>
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      } as ApiResponse);
      return;
    }

    next();
  };
};

export const requireRole = (requiredRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      } as ApiResponse);
      return;
    }

    if (!requiredRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient role permissions',
      } as ApiResponse);
      return;
    }

    next();
  };
};

// Alias for backward compatibility
export const requireAuth = authenticate;
