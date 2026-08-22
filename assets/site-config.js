/*
 * Fuente única de los datos públicos del local.
 * Teléfono, dirección, horarios y mapas se cambian solamente acá.
 */
(function () {
  "use strict";

  const hours = [
    {
      label: "Lunes a jueves y domingos",
      opens: "11:00",
      closes: "23:30",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Sunday"],
    },
    {
      label: "Viernes y sábado",
      opens: "11:00",
      closes: "00:30",
      days: ["Friday", "Saturday"],
    },
  ];

  window.SITE = Object.freeze({
    name: "Heladería Los Trovadores",
    phoneDisplay: "(+598) 2707 51 65",
    phoneHref: "+59827075165",
    whatsapp: "59898388553",
    email: "info@lostrovadores.com.uy",
    address: Object.freeze({
      street: "Gabriel Pereira 3202",
      corner: "Pedro Berro",
      neighborhood: "Pocitos",
      city: "Montevideo",
      region: "Montevideo",
      country: "Uruguay",
      countryCode: "UY",
    }),
    hours: Object.freeze(
      hours.map((schedule) =>
        Object.freeze({
          ...schedule,
          days: Object.freeze(schedule.days),
        }),
      ),
    ),
    maps: Object.freeze({
      searchUrl:
        "https://www.google.com/maps/search/?api=1&query=Helader%C3%ADa+Los+Trovadores+Gabriel+Pereira+3202+Montevideo",
      embedUrl:
        "https://maps.google.com/maps?q=Gabriel%20Pereira%203202%20Montevideo&t=&z=15&ie=UTF8&iwloc=&output=embed",
      title: "Mapa de Heladería Los Trovadores",
    }),
    instagram: "https://www.instagram.com/heladerialostrovadores/",
    facebook: "https://www.facebook.com/heladeria.lostrovadores",
    tiktok: "https://www.tiktok.com/@heladerialostrovadores",

    /*
     * Medicion. Pegar aca el identificador de Google Analytics 4
     * (tiene la forma "G-XXXXXXXXXX"). Mientras este vacio, no se carga
     * ningun script de Google ni se escribe ninguna cookie.
     */
    analytics: Object.freeze({
      ga4Id: "",
      medirEnPruebas: false,
    }),
  });
})();
