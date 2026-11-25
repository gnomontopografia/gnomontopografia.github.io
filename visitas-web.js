// Contadores GNOMON: una visita por pagina y sesion de pestana.
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getFirestore, doc, getDoc, runTransaction } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";
const firebaseConfig = {
      apiKey: "AIzaSyDJnOSbkHZp5i87-TARh98GDLnRjEophqY",
      authDomain: "gnomon-store.firebaseapp.com",
      projectId: "gnomon-store",
      storageBucket: "gnomon-store.firebasestorage.app",
      messagingSenderId: "120541257174",
      appId: "1:120541257174:web:26537253d626918f1d9877",
      measurementId: "G-ZCQV6QTRQ2"
    };
const app = initializeApp(firebaseConfig, "gnomon-visitas-web");
const db = getFirestore(app);
const counter = document.querySelector("[data-visit-counter]");
if (counter) {
  const page = counter.dataset.visitCounter;
  const key = page === "sitio" ? "visitaGnomonContada" : "visitaGnomonProductosContada";
  const ref = doc(db, "estadisticas", page);
  async function registrar() {
    try {
      let total;
      let counted = false;
      try { counted = sessionStorage.getItem(key) === "si"; } catch (_) {}
      if (counted) {
        const snap = await getDoc(ref);
        total = snap.exists() ? Number(snap.data().visitas) || 0 : 0;
      } else {
        total = await runTransaction(db, async tx => {
          const snap = await tx.get(ref);
          const next = (snap.exists() ? Number(snap.data().visitas) || 0 : 0) + 1;
          tx.set(ref, { visitas: next }, { merge: true });
          return next;
        });
        try { sessionStorage.setItem(key, "si"); } catch (_) {}
      }
      counter.textContent = total.toLocaleString("es-CO");
    } catch (err) {
      console.warn("Contador GNOMON:", err.code || err.message);
      counter.textContent = "—";
      counter.title = "Contador temporalmente no disponible";
    }
  }
  registrar();
}
