import appJson from "../app.json";
import { colors } from "../styles/base";

import MainScreen from "../components/Main";
import Splash from "../components/Splash";
import History from "../components/history/History";
import Dashboard from "../components/dashboard/Dashboard";
import HistoryCheckoutScreen from "../components/history/Checkout";
import CheckoutItemScreen from "../components/history/CheckoutItem";
import DeliveryItemScreen from "../components/history/DeliveryItem";
import BlogFeedScreen from "../components/blog/BlogFeed";
import BlogScreen from "../components/blog/Blog";
import ProductScreen from "../components/main/Product";
import Notifications from "../components/notifications/Notifications";

import CheckoutScreen from "../components/main/Checkout";
import VerifyPhone from "../components/auth/VerifyPhone";
import RegisterVerifyPhoneScreen from "../components/auth/RegisterVerifyPhoneScreen";
import OTPScreen from "../components/auth/OTPScreen";
import CompleteRegistrationScreen from "./screens/auth/CompleteRegistrationScreen";

import OpenMidtrans from "../components/checkout/OpenMidtrans";
import Withdrawal from "../components/dashboard/saldo/Withdrawal";
import WebviewScreen from "../components/webview/Webview";
import FAQScreen from "../components/profile/FAQ";
import AboutScreen from "../components/profile/About";
import PDFViewer from "../components/pdfviewer/PDFViewer";
import LoginScreen from "../components/auth/Login";

import PickAddress from "../components/address/PickAddress";
import FillAddressScreen from "../components/address/FillAddress";
import LocationPin from "../components/address/LocationPin";

import EditProfileScreen from "../components/profile/EditProfile";
import CameraView from "../components/media/CameraView";
import ImageRotateView from "../components/media/ImageRotateView";
import ImageViewer from "../components/imageviewer/ImageViewer";
import MultipleImageView from "../components/imageviewer/MultipleImageView";
import MultipleImageSave from "../components/imageviewer/MultipleImageSave";
import MediaKitFiles from "../components/mediakit/MediaKitFiles";
import WatermarkSettings from "../components/mediakit/WatermarkSettings";
import PhotosSegment from "../components/mediakit/photos/PhotosSegment";
import FlyerSliderView from "../components/media/FlyerSliderView";
import QRScreen from "../components/qrscreen/QRScreen";
import VideoPlayer from "../components/videoplayer/VideoPlayer";
import VideoLogs from "../components/videoplayer/VideoLogs";
import Tutorial from "../components/mediakit/tutorial/Tutorial";
import Calculator from "../components/dashboard/Calculator";

import Profile from "../components/profile/Profile";
import DeleteAccountScreen from "../components/auth/DeleteAccount";
import PointReportScreen from "../components/dashboard/PointReport";
import PointWithdrawal from "../components/dashboard/PointWithdrawal";
import CreatePIN from "../components/profile/CreatePIN";
import UserRoots from "../components/dashboard/UserRoots";
import BonusRoot from "../components/dashboard/BonusRoot";
import SaldoReport from "../components/dashboard/saldo/SaldoReport";
import TimerExplanation from "../components/dashboard/components/TimerExplanation";
import WmarkTestScreen from "../components/media/WmarkTestScreen";

const options = {
  headerTitleStyle: {
    color: colors.daclen_light,
  },
  headerStyle: {
    backgroundColor: colors.daclen_bg,
  },
  headerTintColor: colors.daclen_light,
  headerShown: false,
  title: appJson.expo.name,
};

export const Screens = [
  {
    name: "Main",
    screen: MainScreen,
    options,
  },
  { name: "Dashboard", screen: Dashboard, options },
  {
    name: "Notifications",
    screen: Notifications,
    options: { ...options, headerShown: true, title: "Notifikasi" },
  },
  {
    name: "History",
    screen: History,
    options: { ...options, headerShown: true, title: "Riwayat Transaksi" },
  },
  {
    name: "HistoryCheckout",
    screen: HistoryCheckoutScreen,
    options: { ...options, headerShown: true, title: "Riwayat Checkout" },
  },
  {
    name: "Product",
    screen: ProductScreen,
    options: { ...options, headerShown: true, title: "Keterangan Produk" },
  },
  {
    name: "Checkout",
    screen: CheckoutScreen,
    options: { ...options, headerShown: true, title: "Keranjang Belanja" },
  },
  {
    name: "VerifyPhone",
    screen: VerifyPhone,
    options: {
      ...options,
      headerShown: true,
      title: "Verifikasi Nomor Handphone",
    },
  },
  {
    name: "RegisterVerifyPhone",
    screen: RegisterVerifyPhoneScreen,
    options: {
      ...options,
      headerShown: true,
      title: "Verifikasi Nomor Handphone",
    },
  },
  {
    name: "CompleteRegistration",
    screen: CompleteRegistrationScreen,
    options: {
      ...options,
      headerShown: true,
      title: "Lengkapi Identitas",
    },
  },
  {
    name: "OTPScreen",
    screen: OTPScreen,
    options: { ...options, headerShown: true, title: "Isi OTP dari Whatsapp" },
  },
  { name: "LocationPin", screen: LocationPin, options },
  {
    name: "PickAddress",
    screen: PickAddress,
    options: { ...options, headerShown: true, title: "Pilih Alamat" },
  },
  {
    name: "Address",
    screen: FillAddressScreen,
    options: { ...options, headerShown: true, title: "Lengkapi Alamat" },
  },
  {
    name: "OpenMidtrans",
    screen: OpenMidtrans,
    options: {
      ...options,
      headerShown: false,
    },
  },
  {
    name: "Withdrawal",
    screen: Withdrawal,
    options: { ...options, headerShown: true, title: "Penarikan Saldo" },
  },
  {
    name: "CheckoutItem",
    screen: CheckoutItemScreen,
    options: { ...options, headerShown: true, title: "Info Checkout" },
  },
  {
    name: "DeliveryItem",
    screen: DeliveryItemScreen,
    options: { ...options, headerShown: true, title: "Info Pengiriman" },
  },
  { name: "BlogFeed", screen: BlogFeedScreen, options },
  {
    name: "Blog",
    screen: BlogScreen,
    options: { ...options, headerShown: true, title: "Blog" },
  },
  { name: "Webview", screen: WebviewScreen, options },
  {
    name: "TimerExplanation",
    screen: TimerExplanation,
    options: {
      ...options,
      title: "Countdown Recruitment",
    },
  },
  {
    name: "FAQ",
    screen: FAQScreen,
    options: {
      ...options,
      title: "Frequently Asked Questions",
    },
  },
  {
    name: "About",
    screen: AboutScreen,
    options: {
      ...options,
      title: "Tentang Daclen",
      headerShown: false,
    },
  },
  { name: "PDFViewer", screen: PDFViewer, options },
  {
    name: "ImageViewer",
    screen: ImageViewer,
    options: { ...options, headerShown: true, title: "Foto Produk" },
  },
  {
    name: "MultipleImageView",
    screen: MultipleImageView,
    options: { ...options, headerShown: true, title: "Download All" },
  },
  {
    name: "MultipleImageSave",
    screen: MultipleImageSave,
    options: { ...options, headerShown: true, title: "Simpan Flyer" },
  },
  { name: "CameraView", screen: CameraView, options },
  { name: "ImageRotateView", screen: ImageRotateView, options },
  { name: "Login", screen: LoginScreen, options },
  { name: "Profile", screen: Profile, options },
  {
    name: "EditProfile",
    screen: EditProfileScreen,
    options: { ...options, headerShown: true, title: "Atur Profil" },
  },
  {
    name: "DeleteAccount",
    screen: DeleteAccountScreen,
    options: { ...options, headerShown: true, title: "Hapus Akun Daclen" },
  },
  {
    name: "CreatePIN",
    screen: CreatePIN,
    options: { ...options, headerShown: true, title: "Buat PIN Baru" },
  },
  {
    name: "MediaKitFiles",
    screen: MediaKitFiles,
    options: { ...options, headerShown: true, title: "Materi Promosi" },
  },
  {
    name: "WatermarkSettings",
    screen: WatermarkSettings,
    options: { ...options, headerShown: true, title: "Setting Watermark" },
  },
  {
    name: "PhotosSegment",
    screen: PhotosSegment,
    options: { ...options, headerShown: true, title: "Foto Promosi" },
  },
  {
    name: "FlyerSliderView",
    screen: FlyerSliderView,
    options: { ...options, headerShown: true, title: "Starter Kit" },
  },
  { name: "PointReportScreen", screen: PointReportScreen, options },
  {
    name: "PointWithdrawal",
    screen: PointWithdrawal,
    options: { ...options, headerShown: true, title: "Penukaran Poin" },
  },
  {
    name: "UserRootsScreen",
    screen: UserRoots,
    options: { ...options, headerShown: true, title: "Agen & Reseller" },
  },
  {
    name: "BonusRootScreen",
    screen: BonusRoot,
    options: { ...options, headerShown: true, title: "Syarat Bonus Root" },
  },
  { name: "SaldoReportScreen", screen: SaldoReport, options },
  {
    name: "QRScreen",
    screen: QRScreen,
    options: { ...options, headerShown: true, title: "QR Code" },
  },
  { name: "VideoPlayerScreen", screen: VideoPlayer, options },
  {
    name: "VideoLogsScreen",
    screen: VideoLogs,
    options: { ...options, headerShown: true, title: "Logs" },
  },
  {
    name: "WmarkTestScreen",
    screen: WmarkTestScreen,
    options: { ...options, headerShown: true, title: "Test" },
  },
  {
    name: "Tutorial",
    screen: Tutorial,
    options: { ...options, headerShown: true, title: "Tutorial" },
  },
  {
    name: "Calculator",
    screen: Calculator,
    options: { ...options, headerShown: true, title: "Simulasi Saldo" },
  },
];
