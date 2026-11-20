import React, { useState } from 'react';
import { Users, UserPlus, Trash2, Shield, Lock, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const OwnerStaffPage: React.FC = () => {
  const { staff, addStaff, deleteStaff, ownerUser } = useStore();

  const isOwner = ownerUser?.role === 'owner';

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'manager' | 'sales'>('manager');

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) return;
    if (phone.length !== 10) return;

    addStaff({
      name,
      phone,
      role,
    });

    setName('');
    setPhone('');
    setRole('manager');
  };

  const handleDeleteStaff = (id: string, staffName: string) => {
    if (!isOwner) return;
    if (window.confirm(`Revoke staff credentials for "${staffName}"?`)) {
      deleteStaff(id);
    }
  };

  if (!isOwner) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-2xl text-ink">Owner Access Only</h2>
        <p className="text-xs text-ink-500 max-w-sm mx-auto">
          Staff accounts cannot view or modify administrative employee rosters.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-ivory-400">
        <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
          Role-Based Access
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl text-ink font-normal mt-0.5">
          Staff & Team Accounts
        </h1>
        <p className="text-xs text-ink-500 mt-1">
          Registered staff can log in at /owner/login using their phone number to process orders.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Add Staff Form (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-ivory rounded-xl border border-ivory-400 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-ivory-300">
              <UserPlus className="w-5 h-5 text-terracotta" />
              <h3 className="font-serif text-lg font-medium text-ink">Add Staff Member</h3>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink">Staff Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Shalini Roy"
                  className="w-full bg-ivory-100 border border-ivory-400 rounded px-3 py-2 text-ink focus:outline-none focus:border-terracotta"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink">10-Digit Mobile Number</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l border border-r-0 border-ivory-400 bg-ivory-300 text-ink text-sm font-semibold">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="9876543210"
                    className="w-full bg-ivory-100 border border-ivory-400 rounded-r px-3 py-2 text-sm text-ink font-medium focus:outline-none focus:border-terracotta"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink">Assigned Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'manager' | 'sales')}
                  className="w-full bg-ivory-100 border border-ivory-400 rounded px-3 py-2 text-ink focus:outline-none focus:border-terracotta font-medium"
                >
                  <option value="manager">Manager (Can process orders & advance status)</option>
                  <option value="sales">Sales Assistant (Can view orders & contact patrons)</option>
                </select>
              </div>

              <div className="bg-ivory-200 p-3 rounded text-[11px] text-ink-600">
                Staff members can view the dashboard and advance order statuses, but <strong>cannot</strong> edit products, stock, staff, or offers.
              </div>

              <button
                type="submit"
                disabled={phone.length !== 10 || !name.trim()}
                className="w-full touch-tap-target py-2.5 px-4 rounded bg-terracotta text-white text-xs font-semibold uppercase tracking-wider hover:bg-terracotta-600 transition-colors disabled:opacity-50 shadow"
              >
                Create Staff Account
              </button>
            </form>
          </div>
        </div>

        {/* Staff Members List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-ivory rounded-xl border border-ivory-400 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-ivory-300">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-terracotta" />
                <h3 className="font-serif text-lg font-medium text-ink">
                  Active Staff Accounts ({staff.length})
                </h3>
              </div>
              <span className="text-xs text-ink-500">Owner-only control</span>
            </div>

            <div className="divide-y divide-ivory-300">
              {staff.map((member) => (
                <div
                  key={member.id}
                  className="py-3 flex items-center justify-between gap-3 text-xs sm:text-sm"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-medium text-ink text-base">
                        {member.name}
                      </span>
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          member.role === 'manager'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {member.role}
                      </span>
                    </div>
                    <span className="text-xs text-ink-500 block mt-0.5">
                      Phone: +91 {member.phone}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteStaff(member.id, member.name)}
                    className="touch-tap-target p-2 text-ink-400 hover:text-red-600 transition-colors"
                    title="Remove Staff Member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
