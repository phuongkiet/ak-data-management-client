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

