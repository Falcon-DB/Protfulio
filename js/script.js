/* =========================================================
   Frontend behaviour for the portfolio of Gourab Karmakar
   Handles navigation, sliders, and interactive elements.
   ========================================================= */

(function ($) {

  "use strict";

  // -------------------------------------
  // Swiper Sliders
  // -------------------------------------
  var init_slider = function() {
    // Navigation slider
    var nav_swiper = new Swiper(".swiper.banner-nav-slider", {
      slidesPerView: "auto",
      spaceBetween: 10,
    });

    // Banner (main) slider
    var banner_swiper = new Swiper(".swiper.banner-slider", {
      slidesPerView: 1,
      speed: 900,
      autoplay: { delay: 4000 },
      thumbs: { swiper: nav_swiper },
    });

    // Background image slider
    var image_slider = new Swiper(".swiper.image-slider", {
      slidesPerView: 1,
      speed: 900,
    });

    banner_swiper.on("slideChange", () => {
      image_slider.slideTo(banner_swiper.activeIndex);
    });

    // Portfolio slider
    new Swiper(".portfolio-Swiper", {
      slidesPerView: 4,
      spaceBetween: 30,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        300: { slidesPerView: 2 },
        768: { slidesPerView: 2, spaceBetween: 20 },
        1200: { slidesPerView: 3, spaceBetween: 30 }
      }
    });
  };

  // -------------------------------------
  // Text Animation
  // -------------------------------------
  var initTextFx = function () {
    $('.txt-fx').each(function () {
      var newstr = "";
      var count = 0;
      var delay = 300;
      var stagger = 10;
      var words = this.textContent.split(/\s/);
      var arrWords = [];

      $.each(words, function(_, value) {
        newstr = '<span class="word">';

        for (var i = 0; i < value.length; i++) {
          newstr += "<span class='letter' style='transition-delay:" + 
                    (delay + stagger * count) + "ms;'>" + value[i] + "</span>";
          count++;
        }

        newstr += '</span>';
        arrWords.push(newstr);
        count++;
      });

      this.innerHTML = arrWords.join(" <span class='letter'>&nbsp;</span> ");
    });
  };

  // -------------------------------------
  // Isotope Grid
  // -------------------------------------
  var initIsotope = function() {
    $('.grid').each(function(){
      var $buttonGroup = $('.button-group');
      var $checked = $buttonGroup.find('.is-checked');
      var filterValue = $checked.attr('data-filter');

      var $grid = $('.grid').isotope({
        itemSelector: '.portfolio-item',
        filter: filterValue
      });

      $buttonGroup.on('click', 'a', function(e) {
        e.preventDefault();
        var filterValue = $(this).attr('data-filter');
        $grid.isotope({ filter: filterValue });
        $buttonGroup.find('.is-checked').removeClass('is-checked');
        $(this).addClass('is-checked');
      });
    });
  };

  // -------------------------------------
  // Chocolat Lightbox
  // -------------------------------------
  var initChocolat = function() {
    Chocolat(document.querySelectorAll('.image-link'), {
      imageSize: 'contain',
      loop: true,
    });
  };

  // -------------------------------------
  // On Document Ready
  // -------------------------------------
  $(document).ready(function () {
    init_slider();
    initTextFx();
    initChocolat();
    initIsotope();

    AOS.init({ duration: 1200 });
  });

  $(window).on("load", function() {
    $('body').addClass('loaded');
    initIsotope();
  });

})(jQuery);


// =========================================================
// Hide “Hire Me” button when Contact section is visible
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
  const hireBtn = document.querySelector(".btn-special");
  const contactSection = document.getElementById("contact");

  if (!hireBtn || !contactSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        hireBtn.style.opacity = "0";
        hireBtn.style.pointerEvents = "none";
        hireBtn.style.transform = "translateY(20px)";
      } else {
        hireBtn.style.opacity = "1";
        hireBtn.style.pointerEvents = "auto";
        hireBtn.style.transform = "translateY(0)";
      }
    });
  }, { threshold: 0.1 });

  observer.observe(contactSection);
});


// =========================================================
// SUPABASE FORM SUBMISSION
// =========================================================
const SUPABASE_URL = "https://ljqeqsgkdvvpplkctqeu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqcWVxc2drZHZ2cHBsa2N0cWV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MjEwMzEsImV4cCI6MjA3OTI5NzAzMX0.TVFht2nO3NlZfvLoFShhnjOyjsokJm0C5e7yRh0H8Ok";
const contactForm = document.getElementById("contact-form");
const statusEl = document.getElementById("contact-status");

contactForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const payload = {
    name: contactForm.name.value.trim(),
    email: contactForm.email.value.trim(),
    message: contactForm.message.value.trim(),
  };

  statusEl.style.display = "none";

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/contact_messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Prefer": "return=minimal"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error("Supabase error");

    contactForm.reset();
    statusEl.textContent = "Message sent successfully!";
    statusEl.style.color = "lightgreen";
    statusEl.style.display = "block";

  } catch (err) {
    statusEl.textContent = "Something went wrong. Please try again later.";
    statusEl.style.color = "red";
    statusEl.style.display = "block";
    console.error(err);
  }
});
