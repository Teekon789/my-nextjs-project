const DeletePermanentlyPopup = ({ post, onDelete, onClose }) => {
  return (
    // Overlay with dark background
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      {/* Popup content */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto p-6 animate-fade-in">
        {/* Header */}
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
          ยืนยันการลบโพสต์
        </h2>
        
        {/* Message */}
        <p className="text-gray-600 mb-6">
          คุณต้องการลบโพสต์ "
          <strong className="text-gray-800 font-medium">
            {post?.fullname}
          </strong>
          " ใช่หรือไม่?
        </p>
        
        {/* Buttons */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={() => onDelete(post)}
            className="w-full sm:w-auto px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            ลบ
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePermanentlyPopup;