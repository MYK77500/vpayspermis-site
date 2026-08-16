/* =========================================================
   Auto-École Horizon — interactions du site
   JavaScript natif, sans dépendance. Chargé en `defer`.
   Le site reste entièrement lisible si ce fichier ne se
   charge pas (progressive enhancement).
   ========================================================= */
(function () {
  "use strict";

  /* --- Menu mobile --------------------------------------------------- */
  var burger = document.querySelector(".burger");
  var nav = document.getElementById("navigation");

  if (burger && nav) {
    burger.addEventListener("click", function () {
      var ouvert = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!ouvert));
      nav.setAttribute("data-ouvert", String(!ouvert));
    });

    // Fermeture au clic sur un lien puis à la touche Échap
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        burger.setAttribute("aria-expanded", "false");
        nav.setAttribute("data-ouvert", "false");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && burger.getAttribute("aria-expanded") === "true") {
        burger.setAttribute("aria-expanded", "false");
        nav.setAttribute("data-ouvert", "false");
        burger.focus();
      }
    });
  }

  /* --- Ombre de l'en-tête au défilement ------------------------------ */
  var entete = document.querySelector(".entete");
  if (entete) {
    var majOmbre = function () {
      entete.classList.toggle("entete--defile", window.scrollY > 8);
    };
    majOmbre();
    window.addEventListener("scroll", majOmbre, { passive: true });
  }

  /* --- Apparition au défilement -------------------------------------- */
  var aAnimer = document.querySelectorAll(".apparait");
  if (aAnimer.length && "IntersectionObserver" in window) {
    var observateur = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (entree) {
        if (entree.isIntersecting) {
          entree.target.classList.add("visible");
          observateur.unobserve(entree.target);
        }
      });
    }, { rootMargin: "0px 0px -60px 0px", threshold: 0.08 });

    aAnimer.forEach(function (el) { observateur.observe(el); });
  } else {
    aAnimer.forEach(function (el) { el.classList.add("visible"); });
  }

  /* --- Année courante dans le pied de page ---------------------------- */
  document.querySelectorAll("[data-annee]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* --- Validation du formulaire de contact ---------------------------- */
  var formulaire = document.querySelector("[data-formulaire-contact]");
  if (formulaire) {
    var regles = {
      nom:       function (v) { return v.trim().length >= 2 || "Merci d'indiquer votre nom."; },
      email:     function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Adresse e-mail invalide."; },
      telephone: function (v) { return v.trim() === "" || /^(?:\+33|0)[1-9](?:[\s.-]?\d{2}){4}$/.test(v.trim()) || "Numéro de téléphone invalide."; },
      message:   function (v) { return v.trim().length >= 10 || "Votre message est un peu court."; }
    };

    var valide = function (champ) {
      var regle = regles[champ.name];
      if (!regle) return true;
      var bloc = champ.closest(".champ");
      var resultat = regle(champ.value);
      var messageErreur = bloc ? bloc.querySelector(".champ__erreur") : null;

      if (resultat === true) {
        if (bloc) bloc.classList.remove("champ--invalide");
        champ.removeAttribute("aria-invalid");
        return true;
      }
      if (bloc) bloc.classList.add("champ--invalide");
      if (messageErreur) messageErreur.textContent = resultat;
      champ.setAttribute("aria-invalid", "true");
      return false;
    };

    formulaire.querySelectorAll("input, textarea, select").forEach(function (champ) {
      champ.addEventListener("blur", function () { valide(champ); });
      champ.addEventListener("input", function () {
        var bloc = champ.closest(".champ");
        if (bloc && bloc.classList.contains("champ--invalide")) valide(champ);
      });
    });

    formulaire.addEventListener("submit", function (e) {
      var champs = Array.prototype.slice.call(formulaire.querySelectorAll("input, textarea, select"));
      var premierInvalide = null;

      champs.forEach(function (champ) {
        if (!valide(champ) && !premierInvalide) premierInvalide = champ;
      });

      var consentement = formulaire.querySelector("[name='consentement']");
      if (consentement && !consentement.checked) {
        premierInvalide = premierInvalide || consentement;
      }

      if (premierInvalide) {
        e.preventDefault();
        premierInvalide.focus();
        return;
      }

      // Aucun back-end sur un site statique : on affiche une confirmation.
      // À remplacer par l'action serveur réelle (Formspree, Netlify Forms,
      // script PHP…) au moment de la mise en ligne — voir README.md.
      e.preventDefault();
      var confirmation = formulaire.querySelector(".form-message");
      formulaire.reset();
      if (confirmation) {
        confirmation.classList.add("form-message--succes");
        confirmation.setAttribute("role", "status");
        confirmation.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }

  /* --- Simulateur de budget (page Tarifs) ----------------------------- */
  var simulateur = document.querySelector("[data-simulateur]");
  if (simulateur) {
    var sortie = simulateur.querySelector("[data-total]");
    var detail = simulateur.querySelector("[data-detail]");

    var recalcule = function () {
      var total = 0;
      var lignes = [];

      simulateur.querySelectorAll("[data-prix]").forEach(function (entree) {
        var prix = parseFloat(entree.getAttribute("data-prix")) || 0;
        if (entree.type === "checkbox") {
          if (entree.checked) { total += prix; lignes.push(entree.getAttribute("data-libelle")); }
        } else if (entree.type === "number" || entree.type === "range") {
          var quantite = parseInt(entree.value, 10) || 0;
          if (quantite > 0) {
            total += prix * quantite;
            lignes.push(quantite + " × " + entree.getAttribute("data-libelle"));
          }
          var affichage = simulateur.querySelector("[data-affiche='" + entree.id + "']");
          if (affichage) affichage.textContent = String(quantite);
        } else if (entree.type === "radio" && entree.checked) {
          total += prix;
          lignes.push(entree.getAttribute("data-libelle"));
        }
      });

      if (sortie) sortie.textContent = total.toLocaleString("fr-FR") + " €";
      if (detail) detail.textContent = lignes.length ? lignes.join(" · ") : "Sélectionnez vos options ci-dessus.";
    };

    simulateur.addEventListener("input", recalcule);
    simulateur.addEventListener("change", recalcule);
    recalcule();
  }
})();
