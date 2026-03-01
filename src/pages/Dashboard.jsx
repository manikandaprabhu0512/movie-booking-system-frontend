import React from "react";
import SectionHeader from "../components/SectionHeader";
import Card from "../components/Card";
import Badge from "../components/Badge";

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Movie Ticket Booking Console"
        description="Set up theatres, screens, seats, shows, and complete bookings end-to-end using the open API."
        action={<Badge variant="success">All endpoints wired</Badge>}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card
          title="Setup Flow"
          subtitle="Create your catalog before taking bookings."
        >
          <ol className="list-decimal pl-4 text-sm text-slate-600 space-y-2">
            <li>Add Movies, Theatres, and Screens.</li>
            <li>Create Seats and attach them to Screens.</li>
            <li>Schedule Shows and add Show Seats.</li>
          </ol>
        </Card>
        <Card title="Booking Flow" subtitle="From seat selection to payment.">
          <ol className="list-decimal pl-4 text-sm text-slate-600 space-y-2">
            <li>Query available show seats.</li>
            <li>Create booking with selected seat IDs.</li>
            <li>Collect payment and confirm booking.</li>
          </ol>
        </Card>
        <Card title="Payments" subtitle="Track and reconcile transactions.">
          <div className="space-y-2 text-sm text-slate-600">
            <p>Use the payments page to create, confirm, and refund.</p>
            <p>Pending payments can be fetched with a single click.</p>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Helpful Tips">
          <ul className="space-y-2 text-sm text-slate-600">
            <li>Idempotency keys prevent duplicate bookings and payments.</li>
            <li>Use comma-separated seat IDs when creating a booking.</li>
            <li>Status updates are handled via query params on the backend.</li>
          </ul>
        </Card>
        <Card title="Base URL">
          <div className="glass-panel rounded-2xl p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Current Target
            </p>
            <p className="mt-2 font-display text-lg font-semibold text-slate-900">
              http://deployment-ags-1-816947313.ap-south-1.elb.amazonaws.com/
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Override with <code>VITE_API_BASE_URL</code> if needed.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
