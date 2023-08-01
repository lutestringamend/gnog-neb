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
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 1,
    textAlign: "center",
    top: 1,
    start: 1,
    backgroundColor: "transparent",
    color: colors.daclen_light,
    fontSize: 16,
    textHorizontalMargin: 0,
  };

export const sharingOptionsJPEG = {
  UTI: "JPEG",
  dialogTitle: "Share Foto Daclen",
  mimeType: "image/jpeg",
};

export const sharingOptionsMP4 = {
  UTI: "AVFileTypeMPEG4",
  dialogTitle: "Share Video Daclen",
  mimeType: "video/mp4",
}

export const camerafail = "Error dengan kamera: "
export const cameranopermissionmessage = "Anda tidak memberikan akses ke Kamera"
export const imagepickerfail = "Error mengambil dari galeri "
export const imagepickernopermissionmessage = "\nAnda tidak memberikan akses ke penyimpanan"
export const imagepickernocameralrollmessage = "\nAnda tidak memberikan akses ke Camera Roll"
export const bigmediafileerror = "Ukuran file tidak boleh melebihi 2 MB"
export const mediafileunusable = "File tidak valid"

export const defaultffmpegcodec = "-c:v libx264"
export const tempffmpegdesc = "FFmpeg includes built-in encoders for some popular formats. However, there are certain external libraries that needs to be enabled in order to encode specific formats/codecs. For example, to encode an mp3 file you need lame or shine library enabled. You have to install a ffmpeg-kit-react-native package that has at least one of them inside. To encode an h264 video, you need to install a package with x264 inside. To encode vp8 or vp9 videos, you need a ffmpeg-kit-react-native package with libvpx inside. ffmpeg-kit provides eight packages that include different sets of external libraries. These packages are named according to the external libraries included. Refer to the Packages wiki page to see the names of those packages and external libraries included in each one of them."
