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
