import appJson from "../app.json";
import { colors } from "../styles/base";

import MainScreen from "./screens/Main";


import LoginScreen from "./screens/auth/LoginScreen";

import HomeScreen from "./screens/Home/HomeScreen";

import History from "./screens/history/HistoryScreen";
import Dashboard from "./screens/dashboard/DashboardScreen";
import HistoryCheckoutScreen from "./components/history/Checkout";
import CheckoutItemScreen from "./screens/history/CheckoutItemScreen";
import DeliveryItemScreen from "./screens/history/DeliveryItemScreen";
import ProductScreen from "./screens/product/ProductScreen";
import NotificationsScreen from "./screens/notifications/NotificationsScreen";

import CheckoutScreen from "./screens/checkout/CheckoutScreen";
import VerifyPhone from "../components/auth/VerifyPhone";
import RegisterVerifyPhoneScreen from "./screens/auth/RegisterVerifyPhoneScreen";
import OTPScreen from "./screens/auth/OTPScreen";
import CompleteRegistrationScreen from "./screens/auth/CompleteRegistrationScreen";

import OpenMidtransScreen from "./screens/checkout/OpenMidtransScreen";
import WithdrawalScreen from "./screens/saldo/WithdrawalScreen";
import WithdrawalConfirmationScreen from "./screens/saldo/WithdrawalConfirmationScreen";

import WebviewScreen from "./screens/webview/WebviewScreen";
import FAQScreen from "./screens/Profile/FAQScreen";
import AboutScreen from "./screens/Profile/AboutScreen";
import PDFViewerScreen from "./screens/pdfviewer/PDFViewerScreen";

import PickAddress from "./screens/address/PickAddress";
import FillAddressScreen from "./screens/address/FillAddress";
import LocationPin from "./screens/address/LocationPin";

import EditProfileScreen from "./screens/Profile/EditProfileScreen";
import CameraView from "./screens/media/CameraView";
import ImageRotateView from "./screens/media/ImageRotateView";

import ImageViewerScreen from "./screens/imageviewer/ImageViewerScreen";
import MultipleImageSaveScreen from "./screens/imageviewer/MultipleImageSaveScreen";
import MultipleImageViewScreen from "./screens/imageviewer/MultipleImageViewScreen";
import MediaKitFiles from "./screens/StarterKit/StarterKitScreen";
import TutorialScreen from "./screens/StarterKit/TutorialScreen";
import WatermarkSettingsScreen from "./screens/StarterKit/WatermarkSettingsScreen";
import PhotosSegmentScreen from "./screens/StarterKit/PhotosSegmentScreen";
import FlyerSliderScreen from "./screens/StarterKit/FlyerSliderScreen";
import VideoPlayer from "../components/videoplayer/VideoPlayer";
import VideoLogs from "../components/videoplayer/VideoLogs";
import WmarkTestScreen from "../components/media/WmarkTestScreen";

import BlogFeedScreen from "./screens/blog/BlogFeedScreen";
import BlogScreen from "./screens/blog/BlogScreen";

import DeleteAccountScreen from "./screens/Profile/DeleteAccountScreen";
import PointReportScreen from "./screens/point/PointReportScreen";
import PointWithdrawal from "./screens/point/PointWithdrawalScreen";
import CreatePIN from "./screens/dashboard/CreatePINScreen";
import UserRoots from "./screens/userroot/UserRootScreen";
import BonusRoot from "./screens/dashboard/BonusRootScreen";
import SaldoReport from "./screens/saldo/SaldoReportScreen";
import Calculator from "./screens/dashboard/CalculatorScreen";
import TimerExplanation from "./screens/dashboard/TimerExplanationScreen";


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
  {
    name: "Home",
    screen: HomeScreen,
    options,
  },
  { name: "Dashboard", screen: Dashboard, options },
  {
    name: "Notifications",
    screen: NotificationsScreen,
    options: { ...options, title: "Notifikasi" },
  },
  {
    name: "History",
    screen: History,
    options: { ...options, title: "Riwayat Transaksi" },
  },
  {
    name: "HistoryCheckout",
    screen: HistoryCheckoutScreen,
    options: { ...options, title: "Riwayat Checkout" },
  },
  {
    name: "Product",
    screen: ProductScreen,
    options: { ...options, title: "Keterangan Produk" },
  },
  {
    name: "Checkout",
    screen: CheckoutScreen,
    options: { ...options, title: "Keranjang Belanja" },
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
    options: { ...options, title: "Isi OTP dari Whatsapp" },
  },
  { name: "LocationPin", screen: LocationPin, options },
  {
    name: "PickAddress",
    screen: PickAddress,
    options: { ...options, title: "Pilih Alamat" },
  },
  {
    name: "Address",
    screen: FillAddressScreen,
    options: { ...options, title: "Lengkapi Alamat" },
  },
  {
    name: "OpenMidtrans",
    screen: OpenMidtransScreen,
    options,
  },
  {
    name: "Withdrawal",
    screen: WithdrawalScreen,
    options: { ...options, title: "Penarikan Saldo" },
  },
  {
    name: "WithdrawalConfirmation",
    screen: WithdrawalConfirmationScreen,
    options,
  },
  {
    name: "CheckoutItem",
    screen: CheckoutItemScreen,
    options: { ...options, title: "Info Checkout" },
  },
  {
    name: "DeliveryItem",
    screen: DeliveryItemScreen,
    options: { ...options, title: "Info Pengiriman" },
  },
  { name: "BlogFeed", screen: BlogFeedScreen, options },
  {
    name: "Blog",
    screen: BlogScreen,
    options: { ...options, title: "Blog" },
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
  { name: "PDFViewer", screen: PDFViewerScreen, options },
  {
    name: "ImageViewer",
    screen: ImageViewerScreen,
    options: { ...options, title: "Foto Produk" },
  },
  {
    name: "MultipleImageView",
    screen: MultipleImageViewScreen,
    options: { ...options, title: "Download All" },
  },
  {
    name: "MultipleImageSave",
    screen: MultipleImageSaveScreen,
    options: { ...options, title: "Simpan Flyer" },
  },
  { name: "CameraView", screen: CameraView, options },
  { name: "ImageRotateView", screen: ImageRotateView, options },
  { name: "Login", screen: LoginScreen, options },
  
  {
    name: "EditProfile",
    screen: EditProfileScreen,
    options: { ...options, title: "Atur Profil" },
  },
  {
    name: "DeleteAccount",
    screen: DeleteAccountScreen,
    options: { ...options, title: "Hapus Akun Daclen" },
  },
  {
    name: "CreatePIN",
    screen: CreatePIN,
    options: { ...options, title: "Buat PIN Baru" },
  },
  {
    name: "MediaKitFiles",
    screen: MediaKitFiles,
    options: { ...options, title: "Materi Promosi" },
  },
  {
    name: "WatermarkSettings",
    screen: WatermarkSettingsScreen,
    options,
  },
  {
    name: "PhotosSegment",
    screen: PhotosSegmentScreen,
    options,
  },
  {
    name: "FlyerSliderScreen",
    screen: FlyerSliderScreen,
    options: { ...options, title: "Starter Kit" },
  },
  { name: "PointReportScreen", screen: PointReportScreen, options },
  {
    name: "PointWithdrawal",
    screen: PointWithdrawal,
    options: { ...options, title: "Penukaran Poin" },
  },
  {
    name: "UserRootsScreen",
    screen: UserRoots,
    options: { ...options, title: "Agen & Reseller" },
  },
  {
    name: "BonusRootScreen",
    screen: BonusRoot,
    options: { ...options, title: "Syarat Bonus Root" },
  },
  { name: "SaldoReportScreen", screen: SaldoReport, options },
  { name: "VideoPlayerScreen", screen: VideoPlayer, options },
  {
    name: "VideoLogsScreen",
    screen: VideoLogs,
    options: { ...options, title: "Logs" },
  },
  {
    name: "WmarkTestScreen",
    screen: WmarkTestScreen,
    options: { ...options, title: "Test" },
  },
  {
    name: "Tutorial",
    screen: TutorialScreen,
    options,
  },
  {
    name: "Calculator",
    screen: Calculator,
    options: { ...options, title: "Simulasi Saldo" },
  },
];
