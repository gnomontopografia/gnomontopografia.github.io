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
// =====================================================
// COMPRA DYNAMO CON WOMPI
// =====================================================

const btnComprarDynamo = document.getElementById("btn-comprar-dynamo");

if (btnComprarDynamo) {
  btnComprarDynamo.addEventListener("click", async () => {

    const textoOriginal = btnComprarDynamo.textContent;

    try {
// Verifica si el usuario ya inició sesión con Google
let usuario = auth.currentUser;

if (!usuario) {
  const resultadoLogin = await auth.signInWithPopup(proveedorGoogle);
  usuario = resultadoLogin.user;
}

console.log("Usuario autenticado:", usuario.email);
      // Obtiene el token seguro del usuario autenticado
      
const idToken = await usuario.getIdToken();
      
      // Evita que el usuario presione varias veces mientras se prepara el pago
      btnComprarDynamo.disabled = true;
      btnComprarDynamo.textContent = "Preparando pago...";

      // Solicita a Firebase una referencia y firma segura para esta compra
     const respuesta = await fetch(
  "https://southamerica-east1-gnomon-store.cloudfunctions.net/crearPagoDynamo",
  {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${idToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      productoId: "dynamo_volumen_capas"
    })
  }
);

      if (!respuesta.ok) {
        throw new Error("Firebase no pudo preparar el pago.");
      }

      const pago = await respuesta.json();
      // Guarda la referencia para recuperarla al regresar de Wompi
sessionStorage.setItem("gnomon_compra_reference", pago.reference);

      // Abre el checkout de Wompi
      const checkout = new WidgetCheckout({
        currency: pago.currency,
        amountInCents: pago.amountInCents,
        reference: pago.reference,
        redirectUrl: "https://gnomontopografia.com/compra-exitosa.html",

        // Llave pública de Wompi Producción
        publicKey: "pub_prod_DSOIGAWUi6AAWd3K3jR4p0QBa75HMoox",

        signature: {
          integrity: pago.signature
        }
      });

     checkout.open(function (resultado) {
  console.log("Resultado de la transacción:", resultado.transaction);
}); 
      
} catch (error) {
      console.error("Error preparando el pago:", error);

      alert(
        "No fue posible iniciar el pago. Por favor intenta nuevamente."
      );

    } finally {

      btnComprarDynamo.disabled = false;
      btnComprarDynamo.textContent = textoOriginal;

    }

  });
}
// =====================================================
// COMPRA PACK LISP PREDIAL CON WOMPI
// =====================================================

const btnComprarLisp = document.getElementById("btn-comprar-lisp");

if (btnComprarLisp) {
  btnComprarLisp.addEventListener("click", async () => {

    const textoOriginal = btnComprarLisp.textContent;

    try {
      // Verifica si el usuario ya inició sesión con Google
      let usuario = auth.currentUser;

      if (!usuario) {
        const resultadoLogin = await auth.signInWithPopup(proveedorGoogle);
        usuario = resultadoLogin.user;
      }

      console.log("Usuario autenticado:", usuario.email);

      // Obtiene el token seguro del usuario autenticado
      const idToken = await usuario.getIdToken();

      // Evita varios clics mientras se prepara el pago
      btnComprarLisp.disabled = true;
      btnComprarLisp.textContent = "Preparando pago...";

      // Solicita a Firebase la referencia y firma segura
      const respuesta = await fetch(
        "https://southamerica-east1-gnomon-store.cloudfunctions.net/crearPagoDynamo",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${idToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            productoId: "lisp_predial"
          })
        }
      );

      if (!respuesta.ok) {
        throw new Error("Firebase no pudo preparar el pago.");
      }

      const pago = await respuesta.json();

      // Guarda la compra para recuperarla al regresar de Wompi
      sessionStorage.setItem("gnomon_compra_reference", pago.reference);
      sessionStorage.setItem("gnomon_compra_producto", "lisp_predial");

      // Abre el checkout de Wompi
      const checkout = new WidgetCheckout({
        currency: pago.currency,
        amountInCents: pago.amountInCents,
        reference: pago.reference,
        redirectUrl: "https://gnomontopografia.com/compra-exitosa.html",

        // Llave pública de Wompi Producción
        publicKey: "pub_prod_DSOIGAWUi6AAWd3K3jR4p0QBa75HMoox",

        signature: {
          integrity: pago.signature
        }
      });

      checkout.open(function (resultado) {
        console.log("Resultado de la transacción:", resultado.transaction);
      });

    } catch (error) {
      console.error("Error preparando el pago LISP:", error);

      alert(
        "No fue posible iniciar el pago. Por favor intenta nuevamente."
      );

    } finally {
      btnComprarLisp.disabled = false;
      btnComprarLisp.textContent = textoOriginal;
    }

  });
}
