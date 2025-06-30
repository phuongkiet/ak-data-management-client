export interface SettingDto {
  id: string;
  emailToSend: string;
  emailToCC: string[];
}

export interface UpdateSettingDto {
  emailToSend: string;
  emailToCC: string[];
}