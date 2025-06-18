import { createTheme } from 'react-data-table-component';

export const appCurrency: string = '₫';

export function uploadWebsiteStatusToVietnamese(status: string | number): string {
  switch (status) {
    case 'Uploaded':
    case 1:
      return 'Đã đăng';
    case 'Captured':
    case 2:
      return 'Đã chụp';
    case 'Named':
    case 3:
      return 'Đã đặt tên';
    case 'ReAdded':
    case 4:
      return 'Đã thêm lại';
    case 'ReNameSupplier':
    case 5:
      return 'Đã đổi tên NCC';
    case 'NotCaptured':
    case 6:
      return 'Chưa chụp';
    case 'Cancel':
    case 7:
      return 'Đã huỷ';
    case 'RecheckSupplierCode':
    case 8:
      return 'Cần kiểm tra lại mã NCC';
    case 'Dropped':
    case 9:
      return 'Đã loại';
    case 'Stopped':
    case 10:
      return 'Đã dừng';
    case 'VideoMissing':
    case 11:
      return 'Thiếu video';
    default:
      return 'Không xác định';
  }
}

export function buildQueryString(params: Record<string, any>): string {
  return Object.entries(params)
    .filter(([_, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
}

// export function formatDate(dateString?: string | null) {
//   if (!dateString) return "";
//   const date = new Date(dateString);
//   if (isNaN(date.getTime())) return "";
//   const day = String(date.getDate()).padStart(2, "0");
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const year = date.getFullYear();
//   return `${day}/${month}/${year}`;
// }

export function formatDateLocal(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateLocalString(dateString?: string | null) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}/${month}/${year}`;
}

export function convertRoleToVietnamese(role: string): string {
  const roleMap: Record<string, string> = {
    Admin: "Quản trị viên",
    Strategist: "Chiến lược gia",
    Client: "Người dùng",
  };
  return roleMap[role] || role;
}

export const customDarkTheme = createTheme(
  'customDark',
  {
    background: { default: '#1c1f2d' },
    text: { primary: '#ffffff', secondary: '#bdbdbd' },
    rows: { default: '#1c1f2d', highlightOnHover: '#6bc1ff', striped: '#1f2536' },
    cells: {},
    header: { default: '#1c1f2d' },
    footer: { default: '#1c1f2d' },
    striped: { default: '#131827' },
  },
  'dark'
);