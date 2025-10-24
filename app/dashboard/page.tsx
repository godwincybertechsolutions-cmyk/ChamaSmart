'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Wallet, TrendingUp, Users, DollarSign, 
  ArrowUpRight, ArrowDownRight, Plus
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data
const stats = [
  { name: 'Total Balance', value: 'KES 450,000', change: '+12.5%', icon: Wallet, trend: 'up' },
  { name: 'Active Members', value: '24', change: '+2', icon: Users, trend: 'up' },
  { name: 'Monthly Contributions', value: 'KES 75,000', change: '+8.2%', icon: TrendingUp, trend: 'up' },
  { name: 'Outstanding Loans', value: 'KES 120,000', change: '-5.3%', icon: DollarSign, trend: 'down' },
];

const chartData = [
  { month: 'Jan', contributions: 65000, payouts: 45000 },
  { month: 'Feb', contributions: 68000, payouts: 52000 },
  { month: 'Mar', contributions: 70000, payouts: 48000 },
  { month: 'Apr', contributions: 72000, payouts: 55000 },
  { month: 'May', contributions: 75000, payouts: 50000 },
  { month: 'Jun', contributions: 78000, payouts: 58000 },
];

const recentActivity = [
  { id: 1, type: 'contribution', member: 'John Doe', amount: 5000, status: 'completed', time: '2 hours ago' },
  { id: 2, type: 'loan', member: 'Jane Smith', amount: 20000, status: 'approved', time: '5 hours ago' },
  { id: 3, type: 'contribution', member: 'Peter Mwangi', amount: 5000, status: 'completed', time: '1 day ago' },
  { id: 4, type: 'payout', member: 'Mary Wanjiru', amount: 15000, status: 'pending', time: '2 days ago' },
];

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Dashboard</h1>
          <p className="text-neutral-600 dark:text-neutral-400">Welcome back! Here&apos;s your chama overview.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Contribution
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs flex items-center mt-1">
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="h-4 w-4 text-success-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-danger-500 mr-1" />
                )}
                <span className={stat.trend === 'up' ? 'text-success-500' : 'text-danger-500'}>
                  {stat.change}
                </span>
                <span className="text-neutral-500 ml-1">from last month</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contributions vs Payouts</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="contributions" 
                  stackId="1"
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="payouts" 
                  stackId="1"
                  stroke="#14b8a6" 
                  fill="#14b8a6" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`h-2 w-2 rounded-full ${
                      activity.status === 'completed' ? 'bg-success-500' :
                      activity.status === 'approved' ? 'bg-primary-500' :
                      'bg-warning-500'
                    }`} />
                    <div>
                      <p className="text-sm font-medium">{activity.member}</p>
                      <p className="text-xs text-neutral-500">
                        {activity.type === 'contribution' ? 'Made contribution' :
                         activity.type === 'loan' ? 'Loan request' :
                         'Payout scheduled'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(activity.amount)}</p>
                    <p className="text-xs text-neutral-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}