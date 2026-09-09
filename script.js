// Poner automáticamente el año actual en el footer
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}


// =====================================================
// COMPRA DYNAMO CON WOMPI
// =====================================================

const btnComprarDynamo = document.getElementById("btn-comprar-dynamo");

if (btnComprarDynamo) {
  btnComprarDynamo.addEventListener("click", async () => {

    const textoOriginal = btnComprarDynamo.textContent;

    try {

      // Evita que el usuario presione varias veces mientras se prepara el pago
      btnComprarDynamo.disabled = true;
      btnComprarDynamo.textContent = "Preparando pago...";

      // Solicita a Firebase una referencia y firma segura para esta compra
      const respuesta = await fetch(
        "https://southamerica-east1-gnomon-store.cloudfunctions.net/crearPagoDynamo"
      );

      if (!respuesta.ok) {
        throw new Error("Firebase no pudo preparar el pago.");
      }

      const pago = await respuesta.json();

      // Abre el checkout de Wompi
      const checkout = new WidgetCheckout({
        currency: pago.currency,
        amountInCents: pago.amountInCents,
        reference: pago.reference,

        // Llave pública de Wompi Sandbox
        publicKey: "pub_test_CbEJ01nfapecGbSr0gwDQz5udor7OsTm",

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
