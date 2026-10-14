// Poner automáticamente el año actual en el footer
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}


// =====================================================
// FIREBASE
// =====================================================


const firebaseConfig = {
  apiKey: "AIzaSyDJnOSbkHZp5i87-TARh98GDlnRjEophqY",
  authDomain: "gnomon-store.firebaseapp.com",
  projectId: "gnomon-store",
  storageBucket: "gnomon-store.firebasestorage.app",
  messagingSenderId: "120541257174",
  appId: "1:120541257174:web:29c40bff654465f51d9877",
  measurementId: "G-27KWZ3JRLW"
};


firebase.initializeApp(firebaseConfig);


const auth = firebase.auth();
const proveedorGoogle = new firebase.auth.GoogleAuthProvider();
// Precios mostrados al comprador; Firebase valida el importe y genera la firma.
const purchaseProducts = {
  'btn-comprar-placa_huella_v1': {id:'placa_huella_v1', prefix:'PHV1', amount:5000000},
  'btn-comprar-placa_huella_v2': {id:'placa_huella_v2', prefix:'PHV2', amount:8000000},
  'btn-comprar-adoquines': {id:'adoquines', prefix:'ADOQUINES', amount:5000000},
  'btn-comprar-lisp': {id:'lisp_predial', prefix:'LISP', amount:2000000},
  'btn-comprar-dynamo': {id:'dynamo_volumen_capas', prefix:'DYNAMO', amount:2000000},
  'btn-comprar-dotnet-alineamiento': {id:'dotnet_alineamiento_2026', prefix:'ALINEAMIENTO', amount:1000000},
};
let preparingPurchase = false;
for (const [buttonId, product] of Object.entries(purchaseProducts)) {
  const button = document.getElementById(buttonId);
  if (!button) continue;
  button.addEventListener('click', async () => {
    if (preparingPurchase) return;
    preparingPurchase = true;
    const original = button.textContent;
    button.disabled = true;
    button.textContent = 'Preparando pago...';
    try {
      const user = auth.currentUser || (await auth.signInWithPopup(proveedorGoogle)).user;
      const token = await user.getIdToken();
      const response = await fetch('https://southamerica-east1-gnomon-store.cloudfunctions.net/crearPagoDynamo', {
        method:'POST', headers:{Authorization:'Bearer ' + token, 'Content-Type':'application/json'},
        body:JSON.stringify({productoId:product.id}),
      });
      if (!response.ok) throw Error('No fue posible preparar la compra.');
      const payment = await response.json();
      if (payment.currency !== 'COP' || payment.amountInCents !== product.amount ||
          !payment.reference.startsWith('GNOMON_' + product.prefix + '_') ||
          !/^[a-f0-9]{64}$/.test(payment.signature)) {
        throw Error('La información del pago no coincide con el producto.');
      }
      sessionStorage.setItem('gnomon_compra_reference',payment.reference);
      sessionStorage.setItem('gnomon_compra_producto',product.id);
      const checkout = new WidgetCheckout({
        publicKey:'pub_prod_DSOIGAWUi6AAWd3K3jR4p0QBa75HMoox',
        currency:payment.currency, amountInCents:payment.amountInCents,
        reference:payment.reference, signature:{integrity:payment.signature},
        redirectUrl:'https://gnomontopografia.com/compra-exitosa.html',
        customerData:{email:user.email},
      });
      checkout.open(result => {
        if (result?.transaction?.status === 'APPROVED') {
          location.assign('https://gnomontopografia.com/compra-exitosa.html');
        }
      });
    } catch (error) {
      console.error('No fue posible iniciar la compra:',error);
      alert('No fue posible iniciar el pago. Intenta nuevamente o contacta a GNOMON.');
    } finally {
      preparingPurchase = false;
      button.disabled = false;
      button.textContent = original;
    }
  });
}
