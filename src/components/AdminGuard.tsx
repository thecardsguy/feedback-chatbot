/**
 * Admin Guard Component
 * 
 * Protects admin routes. For this template:
 * - Demo mode: Shows content with a banner explaining security
 * - Production: Should check auth and admin status
 */

import React from 'react';
import { Shield, AlertTriangle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface AdminGuardProps {
  children: React.ReactNode;
  /** Set to true to allow demo access without auth */
  demoMode?: boolean;
}

export function AdminGuard({ children, demoMode = true }: AdminGuardProps) {
  // In demo mode, show content with security notice
  if (demoMode) {
    return (
      <div className="min-h-screen bg-background">
        {/* Security Notice Banner */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-700 dark:text-amber-400">
              <strong>Demo Mode:</strong> This admin dashboard is publicly accessible for demonstration. 
              In production, enable authentication and add yourself to the <code className="px-1 py-0.5 bg-amber-500/20 rounded">admin_users</code> table.
            </p>
          </div>
        </div>
        {children}
      </div>
    );
  }

  // Production mode - would show auth gate
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Admin Access Required</h1>
        <p className="text-muted-foreground mb-6">
          You need to be logged in as an admin to access this dashboard.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild variant="outline">
            <Link to="/">Back to Home</Link>
          </Button>
          <Button asChild>
            <Link to="/login">
              <Shield className="w-4 h-4 mr-2" />
              Sign In
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AdminGuard;
