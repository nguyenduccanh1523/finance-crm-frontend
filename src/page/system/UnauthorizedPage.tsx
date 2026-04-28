import { useNavigate } from "react-router-dom";
import { Lock, ArrowLeft } from "lucide-react";

export function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-col items-center justify-center text-center gap-6 px-6">
        {/* Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-red-200 dark:bg-red-900/30 rounded-full blur-2xl animate-pulse" />
          <Lock className="relative h-20 w-20 text-red-600 dark:text-red-400" />
        </div>

        {/* Status Code */}
        <div>
          <h1 className="text-6xl font-bold text-red-600 dark:text-red-400">
            401
          </h1>
          <p className="text-lg font-semibold text-gray-900 dark:text-white mt-2">
            Unauthorized
          </p>
        </div>

        {/* Message */}
        <div className="max-w-md">
          <p className="text-base text-gray-600 dark:text-gray-300 mb-2">
            Phiên đăng nhập của bạn đã hết hạn hoặc bạn không có quyền truy cập
            tài nguyên này.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Vui lòng đăng nhập lại để tiếp tục.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-900 dark:text-white font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("user");
              sessionStorage.removeItem("user");
              navigate("/auth/login", { replace: true });
            }}
            className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition text-white font-medium"
          >
            Đăng nhập lại
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-xs text-gray-500 dark:text-gray-400">
          <p>Nếu vấn đề vẫn tiếp diễn, vui lòng liên hệ với bộ phận hỗ trợ.</p>
        </div>
      </div>
    </div>
  );
}
