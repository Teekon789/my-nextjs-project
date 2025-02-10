const DashboardStats = ({ stats, onCardClick }) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {Object.entries(stats).map(([key, value]) => (
          <div
            key={key}
            className={`card hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer ${
              key === "totalPosts"
                ? "card-totalPosts"
                : key === "pendingApproval"
                ? "card-pendingApproval"
                : key === "approved"
                ? "card-approved"
                : key === "rejected"
                ? "card-rejected"
                : ""
            }`}
            onClick={() => onCardClick(key)}
          >
            <h3 className="text-muted-foreground text-xs font-medium mb-2">
              {key === "totalPosts" && "จำนวนโพสต์ทั้งหมด"}
              {key === "pendingApproval" && "รอการอนุมัติ"}
              {key === "approved" && "อนุมัติแล้ว"}
              {key === "rejected" && "ไม่อนุมัติ"}
            </h3>
            <p className="text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>
    );
  };
  export default DashboardStats;