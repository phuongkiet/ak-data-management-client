export interface SettingDto {
  id: string;
  emailToSend: string;
  emailToCC: string[];
  googleDriveFileId: string;
  googleDriveStorageLinkId: string;
}

export interface UpdateSettingDto {
  emailToSend: string;
  emailToCC: string[];
  googleDriveFileId: string;
  googleDriveStorageLinkId: string;
}