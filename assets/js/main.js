/* ==========================================================================
   Ivory & Sage Dental Studio — shared interactions
   Vanilla JavaScript. No data from the demo form is sent or stored.
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  /* ----------------------------------------------------------------------
     Footer year
     ---------------------------------------------------------------------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ----------------------------------------------------------------------
     Header state
     ---------------------------------------------------------------------- */
  var header = document.querySelector("[data-header]");

  if (header) {
    var scrollTicking = false;

    var updateHeader = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
      scrollTicking = false;
    };

    window.addEventListener(
      "scroll",
      function () {
        if (!scrollTicking) {
          window.requestAnimationFrame(updateHeader);
          scrollTicking = true;
        }
      },
      { passive: true }
    );

    updateHeader();
  }

  /* ----------------------------------------------------------------------
     Responsive navigation
     ---------------------------------------------------------------------- */
  var navToggle = document.querySelector("[data-nav-toggle]");
  var siteNav = document.getElementById("primary-nav");
  var mobileQuery = window.matchMedia("(max-width: 1080px)");
  var menuOpen = false;

  if (navToggle && siteNav) {
    var navLinks = Array.prototype.slice.call(siteNav.querySelectorAll("a[href]"));
    var firstNavLink = navLinks[0];

    var focusableInMenu = function () {
      return [navToggle].concat(
        Array.prototype.filter.call(
          siteNav.querySelectorAll("a[href], button:not([disabled])"),
          function (el) {
            return el.offsetParent !== null;
          }
        )
      );
    };

    var setMenu = function (open, restoreFocus) {
      if (!mobileQuery.matches) {
        return;
      }

      menuOpen = open;
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute(
        "aria-label",
        open ? "Close navigation menu" : "Open navigation menu"
      );
      document.body.classList.toggle("menu-open", open);
      siteNav.inert = !open;

      if (open) {
        /* Wait for the panel to become visible before moving focus into it. */
        var focusFirstLink = function () {
          if (menuOpen && firstNavLink) {
            firstNavLink.focus();
          }
        };

        window.requestAnimationFrame(focusFirstLink);
        window.setTimeout(focusFirstLink, 80);
      } else if (restoreFocus !== false) {
        navToggle.focus();
      }
    };

    var syncNavigationMode = function () {
      if (mobileQuery.matches) {
        if (!menuOpen) {
          siteNav.inert = true;
        }
      } else {
        menuOpen = false;
        siteNav.inert = false;
        document.body.classList.remove("menu-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open navigation menu");
      }
    };

    syncNavigationMode();

    navToggle.addEventListener("click", function () {
      setMenu(!menuOpen, true);
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        if (mobileQuery.matches && menuOpen) {
          setMenu(false, false);
        }
      });
    });

    document.addEventListener("keydown", function (event) {
      if (!menuOpen) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        setMenu(false, true);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      var items = focusableInMenu();

      if (!items.length) {
        return;
      }

      var first = items[0];
      var last = items[items.length - 1];
      var active = document.activeElement;

      if (event.shiftKey && (active === first || !siteNav.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    });

    if (mobileQuery.addEventListener) {
      mobileQuery.addEventListener("change", syncNavigationMode);
    } else if (mobileQuery.addListener) {
      mobileQuery.addListener(syncNavigationMode);
    }
  }

  /* ----------------------------------------------------------------------
     Treatment filters
     ---------------------------------------------------------------------- */
  var treatmentFilters = document.querySelectorAll("[data-treatment-filter]");
  var treatmentCards = document.querySelectorAll("[data-treatment-card]");
  var treatmentStatus = document.getElementById("treatment-status");

  if (treatmentFilters.length && treatmentCards.length) {
    var applyTreatmentFilter = function (filter, label) {
      var visibleCount = 0;

      treatmentCards.forEach(function (card) {
        var categories = (card.getAttribute("data-category") || "").split(" ");
        var show = filter === "all" || categories.indexOf(filter) !== -1;
        card.hidden = !show;

        if (show) {
          visibleCount += 1;
        }
      });

      treatmentFilters.forEach(function (button) {
        button.setAttribute(
          "aria-pressed",
          button.getAttribute("data-treatment-filter") === filter ? "true" : "false"
        );
      });

      if (treatmentStatus) {
        treatmentStatus.textContent =
          visibleCount +
          (visibleCount === 1 ? " treatment" : " treatments") +
          (filter === "all" ? " in the full list" : " in " + label);
      }
    };

    treatmentFilters.forEach(function (button) {
      button.addEventListener("click", function () {
        applyTreatmentFilter(
          button.getAttribute("data-treatment-filter"),
          button.textContent.trim()
        );
      });
    });
  }

  /* ----------------------------------------------------------------------
     Gallery filters and accessible lightbox
     ---------------------------------------------------------------------- */
  var galleryFilters = document.querySelectorAll("[data-gallery-filter]");
  var galleryItems = Array.prototype.slice.call(
    document.querySelectorAll("[data-gallery-item]")
  );
  var galleryStatus = document.getElementById("gallery-status");

  if (galleryFilters.length && galleryItems.length) {
    galleryFilters.forEach(function (button) {
      button.addEventListener("click", function () {
        var filter = button.getAttribute("data-gallery-filter");
        var visibleCount = 0;

        galleryItems.forEach(function (item) {
          var categories = (item.getAttribute("data-category") || "").split(" ");
          var show = filter === "all" || categories.indexOf(filter) !== -1;
          item.hidden = !show;

          if (show) {
            visibleCount += 1;
          }
        });

        galleryFilters.forEach(function (filterButton) {
          filterButton.setAttribute(
            "aria-pressed",
            filterButton === button ? "true" : "false"
          );
        });

        if (galleryStatus) {
          galleryStatus.textContent =
            visibleCount + (visibleCount === 1 ? " image" : " images") + " shown";
        }
      });
    });
  }

  var lightbox = document.getElementById("gallery-lightbox");

  if (lightbox && galleryItems.length) {
    var lightboxImage = document.getElementById("lightbox-image");
    var lightboxCaption = document.getElementById("lightbox-caption");
    var lightboxCounter = document.getElementById("lightbox-counter");
    var lightboxClose = lightbox.querySelector("[data-lightbox-close]");
    var lightboxPrev = lightbox.querySelector("[data-lightbox-prev]");
    var lightboxNext = lightbox.querySelector("[data-lightbox-next]");
    var currentIndex = 0;
    var lastTrigger = null;
    var visibleGalleryItems = [];

    var getVisibleItems = function () {
      return galleryItems.filter(function (item) {
        return !item.hidden;
      });
    };

    var renderLightbox = function () {
      var item = visibleGalleryItems[currentIndex];

      if (!item) {
        return;
      }

      var image = item.querySelector("img");
      var caption = item.getAttribute("data-caption") || "";

      lightboxImage.src = item.getAttribute("data-full") || (image && image.src) || "";
      lightboxImage.alt = caption;
      lightboxCaption.textContent = caption;
      lightboxCounter.textContent =
        currentIndex + 1 + " / " + visibleGalleryItems.length;
    };

    var openLightbox = function (trigger) {
      visibleGalleryItems = getVisibleItems();
      currentIndex = visibleGalleryItems.indexOf(trigger);

      if (currentIndex < 0) {
        currentIndex = 0;
      }

      lastTrigger = trigger;
      renderLightbox();

      if (typeof lightbox.showModal === "function") {
        lightbox.showModal();
        document.body.classList.add("lightbox-open");
        if (lightboxClose) {
          lightboxClose.focus();
        }
      } else {
        var fallbackImage = trigger.getAttribute("data-full");
        if (fallbackImage) {
          window.open(fallbackImage, "_blank", "noopener");
        }
      }
    };

    var closeLightbox = function () {
      if (lightbox.open && typeof lightbox.close === "function") {
        lightbox.close();
      }
    };

    var showPrevious = function () {
      if (!visibleGalleryItems.length) {
        return;
      }
      currentIndex =
        (currentIndex - 1 + visibleGalleryItems.length) % visibleGalleryItems.length;
      renderLightbox();
    };

    var showNext = function () {
      if (!visibleGalleryItems.length) {
        return;
      }
      currentIndex = (currentIndex + 1) % visibleGalleryItems.length;
      renderLightbox();
    };

    galleryItems.forEach(function (item) {
      item.addEventListener("click", function () {
        openLightbox(item);
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener("click", closeLightbox);
    }

    if (lightboxPrev) {
      lightboxPrev.addEventListener("click", showPrevious);
    }

    if (lightboxNext) {
      lightboxNext.addEventListener("click", showNext);
    }

    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    lightbox.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPrevious();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        showNext();
      }
    });

    lightbox.addEventListener("close", function () {
      document.body.classList.remove("lightbox-open");

      if (lastTrigger) {
        lastTrigger.focus();
      }
    });
  }

  /* ----------------------------------------------------------------------
     Appointment request form — front-end demonstration only
     ---------------------------------------------------------------------- */
  var appointmentForm = document.getElementById("appointment-form");

  if (appointmentForm) {
    var successPanel = document.getElementById("form-success");
    var formStatus = document.getElementById("form-status");
    var submitButton = appointmentForm.querySelector('button[type="submit"]');
    var dateField = document.getElementById("preferred-date");
    var serviceField = document.getElementById("service");
    var attemptedSubmit = false;

    var todayValue = function () {
      var now = new Date();
      var year = now.getFullYear();
      var month = String(now.getMonth() + 1).padStart(2, "0");
      var day = String(now.getDate()).padStart(2, "0");
      return year + "-" + month + "-" + day;
    };

    if (dateField) {
      dateField.min = todayValue();
    }

    var serviceParam = new URLSearchParams(window.location.search).get("service");

    if (serviceParam && serviceField) {
      var matchingOption = Array.prototype.find.call(
        serviceField.options,
        function (option) {
          return option.value === serviceParam;
        }
      );

      if (matchingOption) {
        serviceField.value = serviceParam;
      }
    }

    var fields = {
      name: {
        el: document.getElementById("full-name"),
        error: document.getElementById("full-name-error"),
        validate: function (value) {
          if (!value.trim()) {
            return "Please enter your name.";
          }
          if (value.trim().length < 2) {
            return "Please enter at least two characters.";
          }
          if (value.length > 80) {
            return "Please keep your name under 80 characters.";
          }
          return "";
        }
      },
      email: {
        el: document.getElementById("email"),
        error: document.getElementById("email-error"),
        validate: function (value) {
          if (!value.trim()) {
            return "Please enter an email address.";
          }
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())) {
            return "Please enter a valid email address.";
          }
          return "";
        }
      },
      phone: {
        el: document.getElementById("phone"),
        error: document.getElementById("phone-error"),
        validate: function (value) {
          if (!value.trim()) {
            return "";
          }
          if (!/^[+\d][\d\s().-]{6,}$/.test(value.trim())) {
            return "Please use a phone number with at least seven digits.";
          }
          return "";
        }
      },
      service: {
        el: serviceField,
        error: document.getElementById("service-error"),
        validate: function (value) {
          return value ? "" : "Please choose a treatment or “Not sure yet”.";
        }
      },
      date: {
        el: dateField,
        error: document.getElementById("preferred-date-error"),
        validate: function (value) {
          if (!value) {
            return "Please choose a preferred date.";
          }

          var chosen = new Date(value + "T00:00:00");

          if (Number.isNaN(chosen.getTime())) {
            return "Please choose a valid date.";
          }

          if (value < todayValue()) {
            return "Please choose today or a future date.";
          }

          if (chosen.getDay() === 0) {
            return "This sample schedule is Monday–Saturday. Please choose another day.";
          }

          return "";
        }
      },
      time: {
        el: document.getElementById("preferred-time"),
        error: document.getElementById("preferred-time-error"),
        validate: function (value) {
          return value ? "" : "Please choose a preferred time window.";
        }
      },
      consent: {
        el: document.getElementById("consent"),
        error: document.getElementById("consent-error"),
        validate: function (value, el) {
          return el.checked
            ? ""
            : "Please confirm that you understand this is a demonstration form.";
        }
      }
    };

    var setFieldError = function (field, message) {
      var el = field.el;

      if (!el) {
        return;
      }

      if (message) {
        el.setAttribute("aria-invalid", "true");
      } else {
        el.removeAttribute("aria-invalid");
      }

      if (field.error) {
        field.error.textContent = message;
      }
    };

    var validateField = function (field) {
      if (!field.el) {
        return true;
      }

      var message = field.validate(field.el.value, field.el);
      setFieldError(field, message);
      return !message;
    };

    var validateAll = function () {
      var invalid = [];

      Object.keys(fields).forEach(function (key) {
        if (!validateField(fields[key])) {
          invalid.push(fields[key].el);
        }
      });

      return invalid;
    };

    Object.keys(fields).forEach(function (key) {
      var field = fields[key];

      if (!field.el) {
        return;
      }

      var eventName = field.el.type === "checkbox" || field.el.tagName === "SELECT"
        ? "change"
        : "input";

      field.el.addEventListener(eventName, function () {
        if (attemptedSubmit || field.el.getAttribute("aria-invalid") === "true") {
          validateField(field);
        }
      });

      field.el.addEventListener("blur", function () {
        if (field.el.value || attemptedSubmit) {
          validateField(field);
        }
      });
    });

    appointmentForm.addEventListener("submit", function (event) {
      event.preventDefault();
      attemptedSubmit = true;

      if (formStatus) {
        formStatus.hidden = true;
        formStatus.textContent = "";
      }

      if (successPanel) {
        successPanel.hidden = true;
      }

      var invalidFields = validateAll();

      if (invalidFields.length) {
        if (formStatus) {
          formStatus.hidden = false;
          formStatus.textContent = "Please review the highlighted fields and try again.";
          formStatus.focus();
        }

        invalidFields[0].focus();
        return;
      }

      appointmentForm.reset();
      attemptedSubmit = false;

      Object.keys(fields).forEach(function (key) {
        setFieldError(fields[key], "");
      });

      if (dateField) {
        dateField.min = todayValue();
      }

      if (successPanel) {
        successPanel.hidden = false;

        if (typeof successPanel.focus === "function") {
          successPanel.focus();
        }
      }

      if (submitButton) {
        submitButton.blur();
      }
    });
  }

  /* ----------------------------------------------------------------------
     Gallery thumbnail hover: only use non-essential effects on fine pointers
     ---------------------------------------------------------------------- */
  if (!finePointer.matches) {
    document.documentElement.classList.add("is-touch");
  }

  if (reduceMotion.matches) {
    document.documentElement.classList.add("reduced-motion");
  }
})();
