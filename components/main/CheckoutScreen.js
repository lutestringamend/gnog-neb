export function openCheckout(
  navigation,
  isReplace,
  token,
  currentUser,
  jumlah_produk,
  validationOTP
) {
  console.log({jumlah_produk, currentUser, validationOTP});
  if (token === null || token === "") {
    navigation.navigate("Login");
  } else if (
    (currentUser?.nomor_telp_verified_at === "" ||
      currentUser?.nomor_telp_verified_at === null ||
      currentUser?.nomor_telp_verified_at === undefined) &&
    (validationOTP === null || validationOTP === undefined || validationOTP !== "success")
  ) {
    navigation.navigate("VerifyPhone");
  } else if (jumlah_produk !== null && jumlah_produk < 1) {
    navigation.navigate("Main");
  } else {
    if (isReplace) {
      navigation.replace("Checkout");
    } else {
      navigation.navigate("Checkout");
    }
  }
}
