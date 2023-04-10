import { MIDTRANS_CLIENT_KEY } from "../../axios/constants";

export const snapHTML =`
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script type="text/javascript"
            src="https://app.midtrans.com/snap/snap.js"
            data-client-key=${MIDTRANS_CLIENT_KEY}"></script>
</head>

<body>
<!--button id="pay-button">Pay!</button-->
<!--img src="midtrans.png" alt="Midtrans"-->
<p>Sedang memanggil halaman Midtrans...</p>

<script type="text/javascript">
      /*var payButton = document.getElementById('pay-button');
      payButton.addEventListener('click', function () {});*/

      window.snap.pay('#SNAP_TOKEN#', {
          onSuccess: function(result){
            /* You may add your own implementation here */
            alert("Pembayaran berhasil!"); console.log(result);
          },
          onPending: function(result){
            /* You may add your own implementation here */
            alert("Masih menunggu pembayaran Anda"); console.log(result);
          },
          onError: function(result){
            /* You may add your own implementation here */
            alert("Pembayaran gagal"); console.log(result);
          },
          onClose: function(){
            /* You may add your own implementation here */
            alert('Anda menutup halaman sebelum menyelesaikan pembayaran Anda');
          }
        })
    </script>
</body>
</html>`;