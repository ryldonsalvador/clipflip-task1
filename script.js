document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM is fully loaded!");

  const main = document.getElementById("main-container");
  const slider = document.querySelector(".slider");
  const prev = document.getElementById("btn-left-click");
  const next = document.getElementById("btn-right-click");
  let index = 1;

  main.style.display = "block";
  // automatically move the last slide to the left side on load
  const lastSlide = slider.lastElementChild;
  const clone = lastSlide.cloneNode(true);
  slider.insertBefore(clone, slider.firstElementChild);
  slider.removeChild(lastSlide);

  function updateSlides() {
    const slides = document.querySelectorAll(".slide");
    slides.forEach((slide, i) => {
      slide.classList.remove("active", "inactive");
      if (i === 1) {
        slide.classList.add("active"); // Center active
      } else {
        slide.classList.add("inactive");
      }
    });

    let containerWidth = 300;
    let activeWidth = 130;
    let inactiveWidth = 68;
    let gap = 7;
    let totalInactiveWidth = inactiveWidth * 2 + gap * 2; // Width of 2 inactive slides + gaps
    let translateX =
      -(index * (inactiveWidth + gap)) +
      (containerWidth - activeWidth - totalInactiveWidth);

    slider.style.transform = `translateX(${translateX}px)`;
  }

  function disableControls() {
    prev.style.pointerEvents = "none";
    next.style.pointerEvents = "none";
  }
  function enableControls() {
    prev.style.pointerEvents = "auto";
    next.style.pointerEvents = "auto";
  }

  function detectSlides() {
    const activeSlide = document.querySelector(".slide.active");
    const dots = document.querySelectorAll(".lines");
    const contents = document.querySelectorAll(".slides-content");

    dots.forEach((dot) => dot.classList.remove("enable"));
    contents.forEach((content) => content.classList.remove("visible"));
    if (activeSlide) {
      dots[activeSlide.dataset.slide - 1].classList.add("enable");
      contents[activeSlide.dataset.slide - 1].classList.add("visible");
      setTimeout(() => {
        enableControls();
      }, 500);
    }

    if (activeSlide.dataset.slide == 1) {
      const vid1 = document.querySelector("#video-1");
      vid1.play();
    } else if (activeSlide.dataset.slide == 2) {
      // console.log(activeSlide.dataset.slide);
      const vid2 = document.querySelector("#video-2");
      vid2.play();
    } else if (activeSlide.dataset.slide == 3) {
      const vid3 = document.querySelector("#video-3");
      vid3.play();
    } else if (activeSlide.dataset.slide == 4) {
      const vid4 = document.querySelector("#video-4");
      vid4.play();
    }

    setTimeout(() => {
      document.querySelectorAll(".lazy-video").forEach((video) => {
        if (video.closest(".active")) {
          // console.log("video play");

          if (!video.src) {
            video.src = video.dataset.src;
          }
        } else {
          video.pause();
          video.currentTime = 0;
        }
      });

      // console.log("Active slide:", document.querySelector(".active"));
    }, 100); // Small delay to allow class changes
  }
  function moveSlide(direction) {
    const slides = document.querySelectorAll(".slide");
    const activeIndex = [...slides].findIndex((slide) =>
      slide.classList.contains("active")
    );

    pauseAllVideos();

    disableControls();

    let nextActiveIndex;
    if (direction === 1) {
      nextActiveIndex = (activeIndex + 1) % slides.length; // Move to the next slide
    } else {
      nextActiveIndex = (activeIndex - 1 + slides.length) % slides.length; // Move to the previous slide
    }

    // Apply the resizing and active state before the transition starts
    slides.forEach((slide, index) => {
      slide.classList.remove("active", "inactive");
      if (index === nextActiveIndex) {
        slide.classList.add("active"); // Set the next active slide
      } else {
        slide.classList.add("inactive");
      }
    });
    // Add transition for smooth sliding effect
    slider.style.transition = "transform 0.5s ease-in-out";

    if (direction === 1) {
      // Move the first slide to the end without jumping
      const firstSlide = slider.firstElementChild;
      const clone = firstSlide.cloneNode(true);
      slider.appendChild(clone); // Append cloned slide at the end
      slider.style.transform = `translateX(-130px)`; // Start shifted

      setTimeout(() => {
        slider.style.transition = "transform 0.5s ease-in-out"; // Re-enable transition
        detectSlides();
      }, 50);

      setTimeout(() => {
        // Remove the first slide (which is now at the end)
        slider.removeChild(firstSlide);
        slider.style.transition = "none";
        slider.style.transform = "translateX(-55px)";
        updateSlides();
      }, 500); // Wait for the transition duration
    } else {
      // Move the last slide to the front without jumping
      const lastSlide = slider.lastElementChild;
      const clone = lastSlide.cloneNode(true);
      slider.insertBefore(clone, slider.firstElementChild);
      slider.style.transition = "none"; // Disable transition for an instant shift
      slider.style.transform = `translateX(-130px)`; // Start shifted

      setTimeout(() => {
        updateSlides();
        slider.style.transition = "transform 0.5s ease-in-out"; // Re-enable transition
        slider.style.transform = "translateX(-55px)";
        detectSlides();
      }, 50);

      setTimeout(() => {
        slider.removeChild(lastSlide);
      }, 500); // Wait for the transition duration
    }
  }

  function pauseAllVideos() {
    let videos = document.querySelectorAll("video"); // Select all video elements
    videos.forEach((video) => video.pause()); // Pause each video
  }

  next.addEventListener("click", () => moveSlide(1));
  prev.addEventListener("click", () => moveSlide(-1));

  updateSlides();
  detectSlides();
});
