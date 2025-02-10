import { Check, X, Eye, Trash2, FileText } from "lucide-react";
import Link from "next/link";
const PostsTable = ({ 
  currentPosts, 
  currentUser, 
  onApprove, 
  onReject, 
  onView, 
  onDelete, 
  onDocument 
}) => {
  return (
    <div className="bg-slate-50 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">รายการ</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-300/80">
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">ชื่อเต็ม</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">ประเภทบุคลากร</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">รวม</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-slate-600">เอกสาร</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-slate-600">สถานะ</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-slate-600">การกระทำ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/50">
            {currentPosts.map((post) => (
              <tr key={post._id} className="hover:bg-white/50 transition-colors">
                <td className="px-6 py-4">
                  <Link href={`/viewPost?id=${post._id}`}>
                    <div className="cursor-pointer">
                      <div className="font-medium text-slate-800">{post.fullname}</div>
                      <div className="text-xs text-slate-500">
                        {new Date(post.updatedAt).toLocaleString('th-TH')}
                      </div>
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4 text-slate-600">{post.personnel_type}</td>
                <td className="px-6 py-4 text-slate-600">{post.total_budget}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => onDocument(post)}
                    className="mx-auto flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-slate-600" />
                  </button>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                    post.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    post.status === "Approved" ? "bg-emerald-100 text-emerald-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {post.status === "pending" ? "รอการอนุมัติ" :
                     post.status === "Approved" ? "อนุมัติแล้ว" :
                     "ไม่อนุมัติ"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center space-x-2">
                    {currentUser && currentUser.role === "dean" && (
                      <>
                        <button
                          onClick={() => onApprove(post)}
                          className="p-1.5 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition-colors"
                          title="อนุมัติ"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onReject(post)}
                          className="p-1.5 rounded-full bg-red-100 hover:bg-red-200 text-red-700 transition-colors"
                          title="ปฏิเสธ"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => onView(post)}
                      className="p-1.5 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors"
                      title="ดูรายละเอียด"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {post.status !== "pending" && (
                      <button
                        onClick={() => onDelete(post)}
                        className="p-1.5 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 transition-colors"
                        title="ลบ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default PostsTable;