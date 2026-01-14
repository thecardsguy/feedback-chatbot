import { FeedbackDashboard } from '@/feedback';
import { STANDARD_PRESET } from '@/feedback/config/feedback.config';
import { Shield } from 'lucide-react';
import { AdminGuard } from '@/components/auth';
import { Navbar } from '@/components/common';

const Admin = () => {
  return (
    <AdminGuard demoMode={false}>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        {/* Background effects */}
        <div className="fixed inset-0 gradient-mesh opacity-30 pointer-events-none" />

        {/* Dashboard Header */}
        <div className="relative border-b border-border/50 glass">
          <div className="container-custom py-4 flex items-center justify-between">
            <h1 className="text-lg font-semibold text-foreground">Feedback Dashboard</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground glass px-3 py-1.5 rounded-full">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="hidden sm:inline">Protected in Production</span>
            </div>
          </div>
        </div>

        {/* Dashboard */}
        <main className="container-custom py-8">
          <FeedbackDashboard config={STANDARD_PRESET} />
        </main>
      </div>
    </AdminGuard>
  );
};

export default Admin;
