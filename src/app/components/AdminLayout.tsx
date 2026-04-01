import { useState } from 'react';
import { Calendar, LogOut, Settings } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  userName: string;
  onLogout: () => void;
}

export function AdminLayout({ children, userName, onLogout }: AdminLayoutProps) {
  const [activeTab, setActiveTab] = useState('events');

  const menuItems = [
    { id: 'events', label: 'Past Events', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-red-700">TSD Admin</h1>
          <p className="text-sm text-gray-600 mt-2">Welcome, {userName}</p>
        </div>

        {/* Menu Items */}
        <nav className="p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  activeTab === item.id
                    ? 'bg-red-100 text-red-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t absolute bottom-0 w-64">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white font-medium py-2 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b shadow-sm p-6">
          <h2 className="text-3xl font-bold text-gray-800">
            {activeTab === 'events' && 'Past Events Management'}
            {activeTab === 'settings' && 'Settings'}
          </h2>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
