import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { 
  ArrowLeft, 
  BarChart as BarChartIcon, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  Clock,
  AlertTriangle,
  FileText,
  Ban,
  Menu
} from 'lucide-react';

// ฟังก์ชันประมวลผลข้อมูลแดชบอร์ด
const processDashboardData = (posts) => {
  // คำนวณสถานะ
  const statusCounts = posts.reduce((acc, post) => {
    acc[post.status] = (acc[post.status] || 0) + 1;
    return acc;
  }, {});

  // คำนวณแผนก
  const departmentCounts = posts.reduce((acc, post) => {
    acc[post.sendTo] = (acc[post.sendTo] || 0) + 1;
    return acc;
  }, {});

  const departmentBudgets = posts.reduce((acc, post) => {
    acc[post.sendTo] = (acc[post.sendTo] || 0) + post.total_budget;
    return acc;
  }, {});

  // แนวโน้มงบประมาณรายเดือน
  const monthlyBudgetTrend = posts.reduce((acc, post) => {
    const month = new Date(post.updatedAt).toLocaleString('th-TH', { month: 'short' });
    acc[month] = (acc[month] || 0) + post.total_budget;
    return acc;
  }, {});

  // จัดข้อมูลสำหรับกราฟ
  const statusData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status === 'pending' ? 'รอการอนุมัติ' : 
           status === 'Approved' ? 'อนุมัติแล้ว' : 'ไม่อนุมัติ',
    count
  }));

  const departmentData = Object.entries(departmentCounts).map(([dept, count]) => ({
    name: {
      dean: 'คณบดี',
      head: 'หัวหน้าภาควิชา',
      director: 'ผู้อำนวยการ'
    }[dept],
    count,
    budget: departmentBudgets[dept]
  }));

  const budgetTrendData = Object.entries(monthlyBudgetTrend)
    .sort((a, b) => new Date(`2024 ${a[0]}`) - new Date(`2024 ${b[0]}`))
    .map(([month, budget]) => ({ month, budget }));

  // ข้อมูลรายการที่ไม่อนุมัติ
  const rejectedData = posts
    .filter(post => post.status !== 'Approved')
    .map(post => ({
      reason: post.reject_reason || 'ไม่ระบุเหตุผล',
      department: {
        dean: 'คณบดี',
        head: 'หัวหน้าภาควิชา',
        director: 'ผู้อำนวยการ'
      }[post.sendTo],
      total_budget: post.total_budget,
      fullname: post.fullname
    }));

  // จัดกลุ่มเหตุผลการไม่อนุมัติ
  const rejectedReasons = rejectedData.reduce((acc, item) => {
    acc[item.reason] = (acc[item.reason] || 0) + 1;
    return acc;
  }, {});

  const rejectedReasonData = Object.entries(rejectedReasons).map(([reason, count]) => ({
    name: reason,
    count
  }));

  return { 
    statusData, 
    departmentData, 
    budgetTrendData, 
    rejectedData,
    rejectedReasonData 
  };
};

const PostsDashboard = ({ 
  posts, 
  currentUser, 
  onNavigateToPostsTable 
}) => {
  // State สำหรับ responsive
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // ฟังก์ชันตรวจสอบขนาดหน้าจอ
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { 
    statusData, 
    departmentData, 
    budgetTrendData, 
    rejectedData,
    rejectedReasonData 
  } = processDashboardData(posts);

  const COLORS = ['#FFC107', '#4CAF50', '#F44336'];
  const DEPARTMENT_COLORS = ['#3B82F6', '#10B981', '#8B5CF6'];
  const REJECTED_COLORS = ['#EF4444', '#F97316', '#FBBF24', '#10B981'];

  // คำนวณสถิติสรุป
  const calculateSummaryStats = () => {
    const totalBudget = posts.reduce((sum, post) => sum + post.total_budget, 0);
    const averageBudgetPerPost = totalBudget / posts.length;
    const pendingCount = posts.filter(post => post.status === 'pending').length;
    const approvedCount = posts.filter(post => post.status === 'Approved').length;

    return {
      totalBudget,
      averageBudgetPerPost,
      pendingCount,
      approvedCount,
      pendingPercentage: (pendingCount / posts.length * 100).toFixed(2),
      approvedPercentage: (approvedCount / posts.length * 100).toFixed(2)
    };
  };

  const summaryStats = calculateSummaryStats();

  // Component สำหรับแท็บและการจัดวาง
  const CustomTabs = ({ children }) => {
    return (
      <div className="w-full">
        {children}
      </div>
    );
  };

  const CustomTabsList = ({ children }) => {
    // เปลี่ยนเลย์เอาท์สำหรับมือถือ
    return (
      <div className={`
        ${isMobile 
          ? 'flex flex-col space-y-2' 
          : 'grid grid-cols-4 gap-2 mb-6'}
      `}>
        {children}
      </div>
    );
  };

  const CustomTabsTrigger = ({ value, children, isActive, onClick }) => {
    return (
      <button
        onClick={() => {
          onClick(value);
          // ปิด side menu บนมือถือ
          if (isMobile) setIsSideMenuOpen(false);
        }}
        className={`
          py-2 px-4 rounded-lg flex items-center justify-center
          ${isActive 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
          ${isMobile ? 'w-full' : ''}
        `}
      >
        {children}
      </button>
    );
  };

  const CustomTabsContent = ({ value, activeTab, children }) => {
    return activeTab === value ? <>{children}</> : null;
  };

  // Layout สำหรับการ์ด
  const CustomCard = ({ children, className = '' }) => {
    return (
      <div className={`
        bg-white rounded-lg shadow-md p-4 
        ${isMobile ? 'w-full' : ''}
        ${className}
      `}>
        {children}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 space-y-8 relative">
      {/* ปุ่มย้อนกลับ */}
      <div className="flex justify-between items-center">
        <button 
          onClick={onNavigateToPostsTable}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
          title="กลับไปยังตาราง"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* เมนูแฮมเบอร์เกอร์สำหรับมือถือ */}
        {isMobile && (
          <button 
            onClick={() => setIsSideMenuOpen(!isSideMenuOpen)}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* เมนูแบบ slide-in สำหรับมือถือ */}
      {isMobile && isSideMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="p-4">
            <button 
              onClick={() => setIsSideMenuOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <CustomTabsList>
              <CustomTabsTrigger 
                value="overview" 
                isActive={activeTab === 'overview'}
                onClick={setActiveTab}
              >
                <BarChartIcon className="mr-2 w-4 h-4" /> ภาพรวม
              </CustomTabsTrigger>
              <CustomTabsTrigger 
                value="details" 
                isActive={activeTab === 'details'}
                onClick={setActiveTab}
              >
                <PieChartIcon className="mr-2 w-4 h-4" /> รายละเอียด
              </CustomTabsTrigger>
              <CustomTabsTrigger 
                value="trends" 
                isActive={activeTab === 'trends'}
                onClick={setActiveTab}
              >
                <TrendingUp className="mr-2 w-4 h-4" /> แนวโน้ม
              </CustomTabsTrigger>
              <CustomTabsTrigger 
                value="rejected" 
                isActive={activeTab === 'rejected'}
                onClick={setActiveTab}
              >
                <Ban className="mr-2 w-4 h-4" /> รายการไม่อนุมัติ
              </CustomTabsTrigger>
            </CustomTabsList>
          </div>
        </div>
      )}

      <h1 className={`
        text-2xl md:text-3xl font-bold text-gray-800 mb-6
        ${isMobile ? 'text-center' : ''}
      `}>
        แดชบอร์ดการจัดการงบประมาณ
      </h1>

      <CustomTabs>
        {/* เมนูแท็บสำหรับเดสก์ท็อป */}
        {!isMobile && (
          <CustomTabsList>
            <CustomTabsTrigger 
              value="overview" 
              isActive={activeTab === 'overview'}
              onClick={setActiveTab}
            >
              <BarChartIcon className="mr-2 w-4 h-4" /> ภาพรวม
            </CustomTabsTrigger>
            <CustomTabsTrigger 
              value="details" 
              isActive={activeTab === 'details'}
              onClick={setActiveTab}
            >
              <PieChartIcon className="mr-2 w-4 h-4" /> รายละเอียด
            </CustomTabsTrigger>
            <CustomTabsTrigger 
              value="trends" 
              isActive={activeTab === 'trends'}
              onClick={setActiveTab}
            >
              <TrendingUp className="mr-2 w-4 h-4" /> แนวโน้ม
            </CustomTabsTrigger>
            <CustomTabsTrigger 
              value="rejected" 
              isActive={activeTab === 'rejected'}
              onClick={setActiveTab}
            >
              <Ban className="mr-2 w-4 h-4" /> รายการไม่อนุมัติ
            </CustomTabsTrigger>
          </CustomTabsList>
        )}

        {/* เนื้อหาแต่ละแท็บ */}
        <CustomTabsContent value="overview" activeTab={activeTab}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <CustomCard>
              <div className="text-sm font-medium text-gray-500 mb-2">จำนวนรายการทั้งหมด</div>
              <div className="text-2xl font-bold text-blue-600">
                {posts.length}
              </div>
            </CustomCard>
            <CustomCard>
              <div className="text-sm font-medium text-gray-500 mb-2">งบประมาณรวม</div>
              <div className="text-2xl font-bold text-green-600">
                {summaryStats.totalBudget.toLocaleString('th-TH')} บาท
              </div>
            </CustomCard>
            <CustomCard>
              <div className="text-sm font-medium text-gray-500 mb-2">งบประมาณเฉลี่ย/รายการ</div>
              <div className="text-2xl font-bold text-purple-600">
                {summaryStats.averageBudgetPerPost.toLocaleString('th-TH', { maximumFractionDigits: 2 })} บาท
              </div>
            </CustomCard>
            <CustomCard>
              <div className="text-sm font-medium text-gray-500 mb-2">รอการอนุมัติ</div>
              <div className="text-2xl font-bold text-yellow-600">
                {summaryStats.pendingCount} ({summaryStats.pendingPercentage}%)
              </div>
            </CustomCard>
          </div>
        </CustomTabsContent>

        {/* แท็บรายละเอียด */}
        <CustomTabsContent value="details" activeTab={activeTab}>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">สถานะการอนุมัติ</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">งบประมาณตามแผนก</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value.toLocaleString('th-TH')} บาท`, 'งบประมาณ']} />
                  <Legend />
                  <Bar dataKey="budget" fill="#8884d8">
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={DEPARTMENT_COLORS[index % DEPARTMENT_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CustomTabsContent>

        {/* แท็บแนวโน้ม */}
        <CustomTabsContent value="trends" activeTab={activeTab}>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">แนวโน้มงบประมาณรายเดือน</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={budgetTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value.toLocaleString('th-TH')} บาท`, 'งบประมาณ']} />
                  <Line type="monotone" dataKey="budget" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">สรุปสถานะการอนุมัติ</h2>
              <div className="space-y-4">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-yellow-800">รอการอนุมัติ</h3>
                      <p className="text-2xl font-bold text-yellow-600">
                        {summaryStats.pendingCount} รายการ
                      </p>
                    </div>
                    <Clock className="w-10 h-10 text-yellow-500" />
                  </div>
                  <p className="text-sm text-yellow-700 mt-2">
                    คิดเป็น {summaryStats.pendingPercentage}% ของรายการทั้งหมด
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-green-800">อนุมัติแล้ว</h3>
                      <p className="text-2xl font-bold text-green-600">
                        {summaryStats.approvedCount} รายการ
                      </p>
                    </div>
                    <TrendingUp className="w-10 h-10 text-green-500" />
                  </div>
                  <p className="text-sm text-green-700 mt-2">
                    คิดเป็น {summaryStats.approvedPercentage}% ของรายการทั้งหมด
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CustomTabsContent>

        {/* แท็บรายการไม่อนุมัติ */}
        <CustomTabsContent value="rejected" activeTab={activeTab}>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">เหตุผลการไม่อนุมัติ</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={rejectedReasonData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {rejectedReasonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={REJECTED_COLORS[index % REJECTED_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">รายละเอียดรายการที่ไม่อนุมัติ</h2>
              <div className="bg-slate-50 rounded-lg overflow-x-auto max-h-[300px] overflow-y-auto">
                <table className="w-full">
                  <thead className="sticky top-0 bg-slate-100">
                    <tr>
                      <th className="p-3 text-left">ชื่อ</th>
                      <th className="p-3 text-left">แผนก</th>
                      <th className="p-3 text-left">งบประมาณ</th>
                      <th className="p-3 text-left">เหตุผล</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rejectedData.map((item, index) => (
                      <tr key={index} className="border-b border-slate-200 hover:bg-slate-100">
                        <td className="p-3">{item.fullname}</td>
                        <td className="p-3">{item.department}</td>
                        <td className="p-3">{item.total_budget.toLocaleString('th-TH')} บาท</td>
                        <td className="p-3">{item.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ซัมเมอรี่การไม่อนุมัติ */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-red-800">จำนวนรายการไม่อนุมัติ</h3>
                  <p className="text-2xl font-bold text-red-600">
                    {rejectedData.length} รายการ
                  </p>
                </div>
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>
              <p className="text-sm text-red-700 mt-2">
                คิดเป็น {((rejectedData.length / posts.length) * 100).toFixed(2)}% ของรายการทั้งหมด
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-orange-800">งบประมาณที่ไม่ได้รับอนุมัติ</h3>
                  <p className="text-2xl font-bold text-orange-600">
                    {rejectedData.reduce((sum, item) => sum + item.total_budget, 0).toLocaleString('th-TH')} บาท
                  </p>
                </div>
                <FileText className="w-10 h-10 text-orange-500" />
              </div>
              <p className="text-sm text-orange-700 mt-2">
                เฉลี่ย {(rejectedData.reduce((sum, item) => sum + item.total_budget, 0) / rejectedData.length).toLocaleString('th-TH', { maximumFractionDigits: 2 })} บาท/รายการ
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800">แผนกที่ไม่อนุมัติมากที่สุด</h3>
                  <p className="text-2xl font-bold text-yellow-600">
                    {(() => {
                      const departmentCounts = rejectedData.reduce((acc, item) => {
                        acc[item.department] = (acc[item.department] || 0) + 1;
                        return acc;
                      }, {});
                      const mostRejectedDept = Object.entries(departmentCounts)
                        .reduce((a, b) => b[1] > a[1] ? b : a, ['', 0])[0];
                      return mostRejectedDept || 'ไม่มีข้อมูล';
                    })()}
                  </p>
                </div>
                <Ban className="w-10 h-10 text-yellow-500" />
              </div>
              <p className="text-sm text-yellow-700 mt-2">
                จำนวนรายการไม่อนุมัติต่อแผนก
              </p>
            </div>
          </div>
        </CustomTabsContent>
      </CustomTabs>

      {/* ตารางรายการล่าสุด */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">รายการล่าสุด</h2>
        <div className="bg-slate-50 rounded-lg overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-100">
                <th className="p-3 text-left">ชื่อ</th>
                <th className="p-3 text-left">แผนก</th>
                <th className="p-3 text-left">งบประมาณ</th>
                <th className="p-3 text-left">สถานะ</th>
                <th className="p-3 text-left">วันที่</th>
              </tr>
            </thead>
            <tbody>
              {posts.slice(-5).map((post) => (
                <tr key={post._id} className="border-b border-slate-200 hover:bg-slate-100">
                  <td className="p-3">{post.fullname}</td>
                  <td className="p-3">
                    {{
                      dean: 'คณบดี',
                      head: 'หัวหน้าภาควิชา',
                      director: 'ผู้อำนวยการ'
                    }[post.sendTo]}
                  </td>
                  <td className="p-3">{post.total_budget.toLocaleString('th-TH')} บาท</td>
                  <td className="p-3">
                    <span className={`
                      px-2 py-1 rounded-full text-xs 
                      ${post.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        post.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                        'bg-red-100 text-red-800'}
                    `}>
                      {post.status === 'pending' ? 'รอการอนุมัติ' : 
                       post.status === 'Approved' ? 'อนุมัติแล้ว' : 
                       'ไม่อนุมัติ'}
                    </span>
                  </td>
                  <td className="p-3">{new Date(post.updatedAt).toLocaleString('th-TH')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PostsDashboard;