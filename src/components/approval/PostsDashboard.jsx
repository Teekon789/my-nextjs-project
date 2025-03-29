import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line,
  ReferenceLine
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
  Menu,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// สีที่ใช้ในกราฟต่างๆ
const COLORS = {
  approved: '#4CAF50',      // สีเขียว - อนุมัติแล้ว
  pending: '#FFC107',      // สีเหลือง - รออนุมัติ
  rejected: '#F44336',     // สีแดง - ไม่อนุมัติ
  departments: ['#3B82F6', '#10B981', '#8B5CF6'], // สีแผนกต่างๆ
  reasons: ['#EF4444', '#F97316', '#FBBF24', '#10B981'], // สีเหตุผลการไม่อนุมัติ
  trendLine: '#3B82F6',    // สีเส้นแนวโน้ม
  averageLine: '#EF4444'   // สีเส้นค่าเฉลี่ย
};

// ฟังก์ชันประมวลผลข้อมูลสำหรับแดชบอร์ด
const processDashboardData = (posts) => {
  if (!posts || posts.length === 0) {
    return {
      statusData: [],
      departmentData: [],
      budgetTrendData: [],
      rejectedData: [],
      rejectedReasonData: []
    };
  }

  // นับสถานะการอนุมัติ
  const statusCounts = posts.reduce((acc, post) => {
    const status = {
      'Approved': 'อนุมัติแล้ว',
      'pending': 'รอการอนุมัติ'
    }[post.status] || 'ไม่อนุมัติ';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // นับข้อมูลตามแผนก
  const departmentCounts = posts.reduce((acc, post) => {
    acc[post.sendTo] = (acc[post.sendTo] || 0) + 1;
    return acc;
  }, {});

  // คำนวณงบประมาณตามแผนก
  const departmentBudgets = posts.reduce((acc, post) => {
    acc[post.sendTo] = (acc[post.sendTo] || 0) + (post.total_budget || 0);
    return acc;
  }, {});

  // คำนวณแนวโน้มงบประมาณรายเดือน (รวมเดือนก่อนหน้า)
  const monthlyBudgetTrend = posts.reduce((acc, post) => {
    const date = new Date(post.updatedAt);
    const month = date.toLocaleString('th-TH', { month: 'short' });
    const year = date.getFullYear();
    const key = `${month} ${year}`;
    
    acc[key] = {
      monthYear: key,
      month,
      year,
      budget: (acc[key]?.budget || 0) + (post.total_budget || 0),
      count: (acc[key]?.count || 0) + 1
    };
    return acc;
  }, {});

  // จัดรูปแบบข้อมูล
  const statusData = Object.entries(statusCounts)
    .map(([name, count]) => ({
      name,
      count,
      percentage: ((count / posts.length) * 100).toFixed(2)
    }))
    .sort((a, b) => {
      const order = { 'อนุมัติแล้ว': 1, 'รอการอนุมัติ': 2, 'ไม่อนุมัติ': 3 };
      return order[a.name] - order[b.name];
    });

  const departmentData = Object.entries(departmentCounts)
    .map(([dept, count]) => ({
      name: {
        dean: 'คณบดี',
        head: 'หัวหน้าภาควิชา',
        director: 'ผู้อำนวยการ'
      }[dept] || dept,
      count,
      budget: departmentBudgets[dept] || 0
    }));

  // เรียงลำดับเดือนไทยตามปีและเดือน
  const monthsOrder = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  
  // 1. ตรวจสอบและปรับโครงสร้างข้อมูลจริง
const processedRealData = Object.values(monthlyBudgetTrend)
.map(item => ({
  monthYear: item.monthYear || `${item.month} ${item.year}`,
  month: item.month,
  year: item.year,
  budget: Number(item.budget) || 0,
  count: Number(item.count) || 0
}))
.filter(item => item.month && item.year)
// ลบข้อมูลที่ซ้ำกันโดยใช้ monthYear เป็น key
.reduce((acc, current) => {
  const x = acc.find(item => item.monthYear === current.monthYear);
  if (!x) {
    return acc.concat([current]);
  } else {
    return acc;
  }
}, []);

// 2. สร้างข้อมูลตัวอย่างแบบไดนามิก (ย้อนหลัง 4 เดือนจากเดือนปัจจุบัน)
const currentDate = new Date();
const sampleData = Array.from({ length: 4 }, (_, i) => {
const date = new Date();
date.setMonth(currentDate.getMonth() - (3 - i));
const month = date.toLocaleString('th-TH', { month: 'short' });
const year = date.getFullYear();
return {
  monthYear: `${month} ${year}`,
  month,
  year,
  budget: [200000, 150000, 100000, 50000][i], // งบประมาณตัวอย่าง
  count: [1, 2, 3, 1][i]
};
});

// 3. รวมข้อมูลและเรียงลำดับ
let budgetTrendData = [...processedRealData];

// เพิ่มข้อมูลตัวอย่างหากข้อมูลจริงน้อยกว่า 2 เดือน
if (budgetTrendData.length < 2) {
budgetTrendData = [...sampleData, ...budgetTrendData]
  .sort((a, b) => {
    // สร้างฟังก์ชันแปลงเดือนไทยเป็นเลขเดือน (0-11)
    const thaiMonthToNumber = (month) => {
      const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 
                     'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
      return months.indexOf(month);
    };
    
    // เปรียบเทียบปีก่อน ถ้าเท่ากันจึงเปรียบเทียบเดือน
    if (a.year !== b.year) return a.year - b.year;
    return thaiMonthToNumber(a.month) - thaiMonthToNumber(b.month);
  });
}
console.log('ข้อมูลหลังเพิ่มตัวอย่าง:', budgetTrendData);




  // ข้อมูลรายการที่ไม่อนุมัติ
  const rejectedData = posts
    .filter(post => post.status !== 'Approved' && post.status !== 'pending')
    .map(post => ({
      reason: post.reject_reason || 'ไม่ระบุเหตุผล',
      department: {
        dean: 'คณบดี',
        head: 'หัวหน้าภาควิชา',
        director: 'ผู้อำนวยการ'
      }[post.sendTo] || post.sendTo,
      total_budget: post.total_budget || 0,
      fullname: post.fullname || 'ไม่ระบุชื่อ'
    }));

  // เหตุผลการไม่อนุมัติ
  const rejectedReasons = posts
    .filter(post => post.status !== 'Approved' && post.status !== 'pending')
    .reduce((acc, post) => {
      const reason = post.reject_reason || 'อื่น ๆ';
      acc[reason] = (acc[reason] || 0) + 1;
      return acc;
    }, {});

  const rejectedReasonData = Object.entries(rejectedReasons)
    .map(([name, count]) => ({
      name,
      count,
      percentage: ((count / posts.length) * 100).toFixed(2)
    }))
    .sort((a, b) => b.count - a.count);

  return { 
    statusData, 
    departmentData, 
    budgetTrendData, 
    rejectedData,
    rejectedReasonData 
  };
};

const PostsDashboard = ({ posts, currentUser, onNavigateToPostsTable }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAllMonths, setShowAllMonths] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
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

  // คำนวณสถิติสรุป
  const calculateSummaryStats = () => {
    const totalBudget = posts.reduce((sum, post) => sum + (post.total_budget || 0), 0);
    const averageBudgetPerPost = posts.length > 0 ? totalBudget / posts.length : 0;
    const pendingCount = posts.filter(post => post.status === 'pending').length;
    const approvedCount = posts.filter(post => post.status === 'Approved').length;
    const rejectedCount = posts.length - pendingCount - approvedCount;

    return {
      totalBudget,
      averageBudgetPerPost,
      pendingCount,
      approvedCount,
      rejectedCount,
      pendingPercentage: posts.length > 0 ? (pendingCount / posts.length * 100).toFixed(2) : 0,
      approvedPercentage: posts.length > 0 ? (approvedCount / posts.length * 100).toFixed(2) : 0,
      rejectedPercentage: posts.length > 0 ? (rejectedCount / posts.length * 100).toFixed(2) : 0
    };
  };

  const summaryStats = calculateSummaryStats();

  // คำนวณค่าเฉลี่ยงบประมาณรายเดือน
  const calculateAverageBudget = () => {
    if (budgetTrendData.length === 0) return 0;
    const sum = budgetTrendData.reduce((total, item) => total + item.budget, 0);
    return sum / budgetTrendData.length;
  };

  // กรองข้อมูลเดือนที่จะแสดง (3 เดือนล่าสุดหรือทั้งหมด)
  const filteredBudgetTrendData = showAllMonths 
    ? budgetTrendData 
    : budgetTrendData.slice(-3);

  // คอมโพเนนต์ Custom Tooltip สำหรับกราฟแนวโน้ม
  const CustomTrendTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-md">
          <p className="font-bold text-blue-600">{data.monthYear}</p>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <span className="text-gray-600">งบประมาณ:</span>
            <span className="font-semibold text-right">
              {payload[0].value.toLocaleString('th-TH')} บาท
            </span>
            
            <span className="text-gray-600">จำนวนรายการ:</span>
            <span className="font-semibold text-right">
              {data.count} รายการ
            </span>
            
            <span className="text-gray-600">ค่าเฉลี่ย:</span>
            <span className="font-semibold text-right">
              {calculateAverageBudget().toLocaleString('th-TH')} บาท
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  // คอมโพเนนต์ Custom Tooltip สำหรับกราฟอื่นๆ
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-bold">{label}</p>
          {payload.map((item, index) => (
            <p key={index} className="flex items-center">
              <span 
                className="inline-block w-3 h-3 mr-2" 
                style={{ backgroundColor: item.color }}
              ></span>
              {`${item.name}: ${item.value.toLocaleString('th-TH')} บาท`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // คอมโพเนนต์ย่อย
  const CustomTabs = ({ children }) => <div className="w-full">{children}</div>;

  const CustomTabsList = ({ children }) => (
    <div className={isMobile ? 'flex flex-col space-y-2' : 'grid grid-cols-4 gap-2 mb-6'}>
      {children}
    </div>
  );

  const CustomTabsTrigger = ({ value, children, isActive, onClick }) => (
    <button
      onClick={() => {
        onClick(value);
        if (isMobile) setIsSideMenuOpen(false);
      }}
      className={`
        py-2 px-4 rounded-lg flex items-center justify-center
        ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
        ${isMobile ? 'w-full' : ''}
      `}
    >
      {children}
    </button>
  );

  const CustomTabsContent = ({ value, activeTab, children }) => (
    activeTab === value ? <>{children}</> : null
  );

  const CustomCard = ({ children, className = '', title = '', headerRight = null }) => (
    <div className={`bg-white rounded-lg shadow-md p-4 ${isMobile ? 'w-full' : ''} ${className}`}>
      {(title || headerRight) && (
        <div className="flex justify-between items-center mb-4">
          {title && <h2 className="text-xl font-semibold text-gray-700">{title}</h2>}
          {headerRight}
        </div>
      )}
      {children}
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 space-y-8 relative">
      {/* ส่วนหัวและปุ่มเมนู */}
      <div className="flex justify-between items-center">
        <button 
          onClick={onNavigateToPostsTable}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
          title="กลับไปยังตาราง"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {isMobile && (
          <button 
            onClick={() => setIsSideMenuOpen(!isSideMenuOpen)}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* เมนูสำหรับมือถือ */}
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

      <h1 className={`text-2xl md:text-3xl font-bold text-gray-800 mb-6 ${isMobile ? 'text-center' : ''}`}>
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
        {/* แท็บภาพรวม */}
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
            {/* กราฟวงกลมแสดงสถานะการอนุมัติ */}
            <CustomCard title="สถานะการอนุมัติ">
              {statusData.length > 0 ? (
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
                        <Cell 
                          key={`cell-${index}`} 
                          fill={
                            entry.name === 'อนุมัติแล้ว' ? COLORS.approved :
                            entry.name === 'รอการอนุมัติ' ? COLORS.pending : 
                            COLORS.rejected
                          } 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value} รายการ`, 'จำนวน']}
                      contentStyle={{ borderRadius: '8px' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-8 text-gray-500">ไม่มีข้อมูลสถานะการอนุมัติ</div>
              )}
            </CustomCard>

            {/* กราฟแท่งแสดงงบประมาณตามแผนก */}
            <CustomCard title="งบประมาณตามแผนก">
              {departmentData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value.toLocaleString('th-TH')} บาท`, 'งบประมาณ']}
                      contentStyle={{ borderRadius: '8px' }}
                    />
                    <Legend />
                    <Bar dataKey="budget" name="งบประมาณ">
                      {departmentData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS.departments[index % COLORS.departments.length]} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-8 text-gray-500">ไม่มีข้อมูลงบประมาณตามแผนก</div>
              )}
            </CustomCard>
          </div>
        </CustomTabsContent>

        {/* แท็บแนวโน้ม */}
        <CustomTabsContent value="trends" activeTab={activeTab}>
          <div className="grid md:grid-cols-2 gap-6">
            {/* กราฟเส้นแสดงแนวโน้มงบประมาณรายเดือน */}
            <CustomCard 
              title="แนวโน้มงบประมาณรายเดือน"
              headerRight={
                <div className="flex items-center space-x-2">
                  <div className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                    ค่าเฉลี่ย: {calculateAverageBudget().toLocaleString('th-TH')} บาท
                  </div>
                  <button 
                    onClick={() => setShowAllMonths(!showAllMonths)}
                    className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded flex items-center"
                  >
                    {showAllMonths ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-1" /> ย่อ
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-1" /> ดูทั้งหมด
                      </>
                    )}
                  </button>
                </div>
              }
            >
              {filteredBudgetTrendData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart
                    data={filteredBudgetTrendData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="monthYear"
                      tick={{ fill: '#555' }}
                    />
                    <YAxis 
                      tick={{ fill: '#555' }}
                      tickFormatter={(value) => `${value.toLocaleString()} บาท`}
                    />
                    <Tooltip 
                      content={<CustomTrendTooltip />}
                      contentStyle={{
                        background: '#fff',
                        borderRadius: '8px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend />
                    <ReferenceLine 
                      y={calculateAverageBudget()} 
                      stroke={COLORS.averageLine}
                      strokeDasharray="5 5"
                      label={{
                        position: 'top',
                        value: `ค่าเฉลี่ย: ${calculateAverageBudget().toLocaleString('th-TH')} บาท`,
                        fill: COLORS.averageLine,
                        fontSize: 12
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="budget"
                      name="งบประมาณ (บาท)"
                      stroke={COLORS.trendLine}
                      strokeWidth={3}
                      dot={{ r: 5, fill: COLORS.trendLine }}
                      activeDot={{ r: 8, stroke: "#2563EB", strokeWidth: 2 }}
                      connectNulls={true}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-500 mb-2">
                    <Ban className="w-10 h-10 inline-block" />
                  </div>
                  <p className="text-gray-600">ไม่มีข้อมูลงบประมาณ</p>
                  <p className="text-sm text-gray-500 mt-1">
                    ยังไม่มีข้อมูลงบประมาณในระบบ กรุณาเพิ่มข้อมูลเพื่อดูแนวโน้ม
                  </p>
                </div>
              )}
            </CustomCard>
            
            {/* สรุปสถานะการอนุมัติ */}
            <div className="space-y-4">
              <CustomCard>
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
              </CustomCard>

              <CustomCard>
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
              </CustomCard>

              <CustomCard>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-red-800">ไม่อนุมัติ</h3>
                      <p className="text-2xl font-bold text-red-600">
                        {summaryStats.rejectedCount} รายการ
                      </p>
                    </div>
                    <Ban className="w-10 h-10 text-red-500" />
                  </div>
                  <p className="text-sm text-red-700 mt-2">
                    คิดเป็น {summaryStats.rejectedPercentage}% ของรายการทั้งหมด
                  </p>
                </div>
              </CustomCard>
            </div>
          </div>
        </CustomTabsContent>

        {/* แท็บรายการไม่อนุมัติ */}
        <CustomTabsContent value="rejected" activeTab={activeTab}>
          <div className="grid md:grid-cols-2 gap-6">
            {/* กราฟวงกลมแสดงเหตุผลการไม่อนุมัติ */}
            <CustomCard title="เหตุผลการไม่อนุมัติ">
              {rejectedReasonData.length > 0 ? (
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
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS.reasons[index % COLORS.reasons.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value} รายการ`, 'จำนวน']}
                      contentStyle={{ borderRadius: '8px' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-8 text-gray-500">ไม่มีข้อมูลเหตุผลการไม่อนุมัติ</div>
              )}
            </CustomCard>

            {/* ตารางรายการที่ไม่อนุมัติ */}
            <CustomCard title="รายละเอียดรายการที่ไม่อนุมัติ">
              {rejectedData.length > 0 ? (
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
              ) : (
                <div className="text-center py-8 text-gray-500">ไม่มีรายการที่ไม่อนุมัติ</div>
              )}
            </CustomCard>
          </div>

          {/* สถิติการไม่อนุมัติ */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <CustomCard>
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
            </CustomCard>

            <CustomCard>
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
                  เฉลี่ย {rejectedData.length > 0 
                    ? (
                      (rejectedData.reduce((sum, item) => sum + item.total_budget, 0) / rejectedData.length)
                      .toLocaleString('th-TH', { maximumFractionDigits: 2 })
                    ) : 0} บาท/รายการ
                </p>
              </div>
            </CustomCard>

            <CustomCard>
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
            </CustomCard>
          </div>
        </CustomTabsContent>
      </CustomTabs>

      {/* ตารางรายการล่าสุด */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">รายการล่าสุด</h2>
        {posts.length > 0 ? (
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
                      }[post.sendTo] || post.sendTo}
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
        ) : (
          <div className="text-center py-8 text-gray-500">ไม่มีรายการล่าสุด</div>
        )}
      </div>
    </div>
  );
};

export default PostsDashboard;