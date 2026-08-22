/*
 * Medición · Google Analytics 4
 * ---------------------------------------------------------------------------
 * El identificador vive en `assets/site-config.js` (SITE.analytics.ga4Id).
 * Si está vacío, este archivo no hace absolutamente nada: no carga scripts,
 * no abre conexiones y no escribe cookies. Así el sitio se puede publicar
 * antes de tener la cuenta creada.
 *
 * Además del pageview automático, se registran los eventos que para esta
 * heladería SON la conversión: clics a WhatsApp, llamadas, cómo llegar,
 * envíos de formulario, aperturas del chatbot y navegación del catálogo.
 * Sin esto GA4 mostraría visitas pero no consultas, que es lo que importa.
 */
(function () {
  "use strict";

  const config = (window.SITE && window.SITE.analytics) || {};
  const measurementId = String(config.ga4Id || "").trim();

  /* Sin ID configurado no se carga nada. */
  if (!measurementId) return;

  /* Vista previa local o en GitHub Pages: no ensuciamos los datos reales. */
  const host = window.location.hostname;
  const esEntornoDePrueba =
    window.location.protocol === "file:" ||
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.endsWith(".local") ||
    host.endsWith("github.io");

  if (esEntornoDePrueba && !config.medirEnPruebas) return;

  /* ---------------------------------------------------------------- gtag */

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag("js", new Date());
  gtag("config", measurementId, {
    send_page_view: true,
    anonymize_ip: true,
  });

  const script = document.createElement("script");
  script.async = true;
  script.src =
    "https://www.googletagmanager.com/gtag/js?id=" +
    encodeURIComponent(measurementId);
  document.head.appendChild(script);

  const registrar = (nombre, parametros) => {
    try {
      gtag("event", nombre, parametros || {});
    } catch (error) {
      /* La medición nunca debe romper la página. */
    }
  };

  window.trovaTrack = registrar;

  /* ------------------------------------------------- eventos de contacto */

  /*
    Delegación en `document`: el header, el footer y las tarjetas se generan
    por JavaScript, así que escuchar acá es lo único que funciona siempre,
    sin importar en qué momento se dibuja cada componente.
  */
  document.addEventListener(
    "click",
    (event) => {
      const enlace = event.target.closest("a[href]");
      if (!enlace) return;

      const href = enlace.getAttribute("href") || "";
      const seccion = enlace.closest("footer")
        ? "pie"
        : enlace.closest("header")
          ? "cabecera"
          : "contenido";
      const pagina = document.body.dataset.page || "otra";

      if (href.includes("wa.me") || href.includes("api.whatsapp.com")) {
        registrar("contacto_whatsapp", { origen: seccion, pagina });
        return;
      }

      if (href.startsWith("tel:")) {
        registrar("contacto_telefono", { origen: seccion, pagina });
        return;
      }

      if (href.startsWith("mailto:")) {
        registrar("contacto_email", { origen: seccion, pagina });
        return;
      }

      if (href.includes("google.com/maps") || href.includes("maps.google.com")) {
        registrar("como_llegar", { origen: seccion, pagina });
        return;
      }

      if (
        href.includes("instagram.com") ||
        href.includes("facebook.com") ||
        href.includes("tiktok.com")
      ) {
        const red = href.includes("instagram.com")
          ? "instagram"
          : href.includes("facebook.com")
            ? "facebook"
            : "tiktok";
        registrar("click_red_social", { red, origen: seccion, pagina });
      }
    },
    true,
  );

  /* --------------------------------------------------------- formularios */

  document.addEventListener(
    "submit",
    (event) => {
      const formulario = event.target;
      if (!(formulario instanceof HTMLFormElement)) return;

      const tipo = formulario.hasAttribute("data-email-form")
        ? "sugerencia_sabor"
        : formulario.hasAttribute("data-whatsapp-form")
          ? "consulta_whatsapp"
          : "otro";

      registrar("envio_formulario", {
        tipo,
        pagina: document.body.dataset.page || "otra",
        asunto: formulario.dataset.heading || "",
      });
    },
    true,
  );

  /* ------------------------------------------------ catálogo y chatbot */

  document.addEventListener(
    "click",
    (event) => {
      const categoria = event.target.closest("[data-category]");
      if (categoria) {
        registrar("ver_categoria", {
          categoria: categoria.dataset.category || "",
        });
        return;
      }

      const chatbot = event.target.closest("trovito-chat");
      if (chatbot && chatbot.dataset.open !== "true") {
        registrar("abrir_chatbot", {
          pagina: document.body.dataset.page || "otra",
        });
      }
    },
    true,
  );
})();
