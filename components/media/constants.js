import { colors } from "../../styles/base"

export const CAMERA_COMPRESSION_QUALITY = 0.5
export const PICKER_COMPRESSION_QUALITY = 0.5 //0 lowest, 1 highest, 0.2 default
export const FILE_OVERSIZE = "FILE_OVERSIZE"
export const CAMERA_NO_PERMISSION = "CAMERA_NO_PERMISSION"
export const IMAGE_PICKER_ERROR = "IMAGE_PICKER_ERROR"
export const IMAGE_PICKER_NO_PERMISSION = "IMAGE_PICKER_NO_PERMISSION"
export const MAXIMUM_FILE_SIZE_IN_BYTES = 2048000
export const DEFAULT_ANDROID_CAMERA_RATIO = "4:3"

export const watermarkStyle = {
    paddingVertical: 1,
    paddingHorizontal: 2,
    borderRadius: 1,
    textAlign: "left",
    top: 1,
    start: 1,
    backgroundColor: "transparent",
    color: colors.daclen_red,
    fontSize: 16,
  };

export const camerafail = "Error dengan kamera: "
export const cameranopermissionmessage = "Anda tidak memberikan akses ke Kamera"
export const imagepickerfail = "Error mengambil dari galeri "
export const imagepickernopermissionmessage = "\nAnda tidak memberikan akses ke penyimpanan"
export const imagepickernocameralrollmessage = "\nAnda tidak memberikan akses ke Camera Roll"
export const bigmediafileerror = "Ukuran file tidak boleh melebihi 2 MB"
export const mediafileunusable = "File tidak valid"

