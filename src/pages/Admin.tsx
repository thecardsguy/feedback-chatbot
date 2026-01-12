import { FeedbackDashboard } from '@/feedback';
import { STANDARD_PRESET } from '@/feedback/config/feedback.config';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminGuard } from '@/components/AdminGuard';

const Admin = () => {
  // SECURITY: demoMode is false by default for production security
  // Set to true only for local development/testing purposes
  return (
    <AdminGuard demoMode={false}>
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Demo
              </Link>
            </Button>
            <div className="h-6 w-px bg-border" />
            <h1 className="text-lg font-semibold text-foreground">Feedback Dashboard</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>Protected in Production</span>
          </div>
        </div>
      </header>

      {/* Dashboard */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <FeedbackDashboard config={STANDARD_PRESET} />
      </main>
    </AdminGuard>
  );
};

export default Admin;
