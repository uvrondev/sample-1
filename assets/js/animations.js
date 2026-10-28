/* ==========================================================================
   Ivory & Sage Dental Studio — optional motion layer
   GSAP and ScrollTrigger are progressive enhancements. If either library
   fails to load, or the visitor prefers reduced motion, the site remains
   fully visible and usable.
   ========================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  var cleanup = null;

  if (prefersReducedMotion || !window.gsap || !window.ScrollTrigger) {
    root.classList.remove("js-motion");
    return;
  }

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;

  try {
    gsap.registerPlugin(ScrollTrigger);

    var revealElements = gsap.utils.toArray("[data-reveal]");
    var staggerGroups = gsap.utils.toArray("[data-stagger]");
    var heroElements = gsap.utils.toArray("[data-hero]");
    var heroMedia = document.querySelector("[data-hero-media] img");
    var heroFrame = document.querySelector("[data-hero-frame]");

    root.classList.add("js-motion");

    /* Hero entrance: short, sequential, and never blocks interaction. */
    if (heroElements.length) {
      gsap.from(heroElements, {
        y: 24,
        opacity: 0,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.09,
        delay: 0.08
      });
    }

    if (heroMedia) {
      gsap.from(heroMedia, {
        scale: 1.055,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.05
      });
    }

    if (heroFrame) {
      gsap.from(heroFrame, {
        opacity: 0,
        duration: 1.1,
        ease: "power2.out",
        delay: 0.35
      });
    }

    /* Gentle scroll reveals for stated content blocks. */
    revealElements.forEach(function (element) {
      gsap.set(element, { opacity: 0, y: 20 });

      gsap.to(element, {
        opacity: 1,
        y: 0,
        duration: 0.75,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 88%",
          once: true
        }
      });
    });

    /* Stagger child cards only once, when the group first enters view. */
    staggerGroups.forEach(function (group) {
      var children = Array.prototype.slice.call(group.children);

      if (!children.length) {
        return;
      }

      gsap.set(children, { opacity: 0, y: 18 });

      ScrollTrigger.batch(children, {
        start: "top 90%",
        once: true,
        onEnter: function (batch) {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "power2.out",
            stagger: 0.07,
            overwrite: true
          });
        }
      });
    });

    /* Keep trigger positions accurate after images and fonts settle. */
    var refresh = function () {
      ScrollTrigger.refresh();
    };

    if (document.readyState === "complete") {
      refresh();
    } else {
      window.addEventListener("load", refresh, { once: true });
    }

    cleanup = function () {
      ScrollTrigger.getAll().forEach(function (trigger) {
        trigger.kill();
      });
      gsap.killTweensOf(
        revealElements
          .concat(heroElements)
          .concat(heroMedia || [])
          .concat(heroFrame || [])
      );
      window.removeEventListener("load", refresh);
    };

    window.addEventListener("pagehide", function () {
      if (cleanup) {
        cleanup();
        cleanup = null;
      }
    });
  } catch (error) {
    root.classList.remove("js-motion");

    if (window.gsap) {
      window.gsap.set(
        "[data-reveal], [data-stagger] > *, [data-hero]",
        { clearProps: "opacity,transform" }
      );
    }

    if (window.ScrollTrigger) {
      window.ScrollTrigger.getAll().forEach(function (trigger) {
        trigger.kill();
      });
    }
  }
})();
