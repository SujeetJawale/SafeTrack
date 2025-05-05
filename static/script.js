function loco() {
  gsap.registerPlugin(ScrollTrigger);

  // Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll

  const locoScroll = new LocomotiveScroll({
    el: document.querySelector("#main"),
    smooth: true,
  });
  // each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
  locoScroll.on("scroll", ScrollTrigger.update);

  // tell ScrollTrigger to use these proxy methods for the "#main" element since Locomotive Scroll is hijacking things
  ScrollTrigger.scrollerProxy("#main", {
    scrollTop(value) {
      return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
    }, // we don't have to define a scrollLeft because we're only scrolling vertically.
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
    // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
    pinType: document.querySelector("#main").style.transform ? "transform" : "fixed",
  });

  // each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll.
  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

  // after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
  ScrollTrigger.refresh();
}
loco();
//------------------------------------------------------------------------------------------------------------
function loading() {
  var t1 = gsap.timeline();

  t1.to("#yellow1", {
    top: "-100%",
    delay: 0.5,
    duration: 0.9,
    ease: "expo.out",
  });

  t1.from(
    "#yellow2",
    {
      top: "100%",
      delay: 0.6,
      duration: 0.9,
      ease: "expo.out",
    },
    "anim"
  );

  t1.to(
    "#loader h1",
    {
      delay: 0.6,
      duration: 4,
      color: "black",
    },
    "anim"
  );

  t1.to("#loader", {
    opacity: 0,
  });

  t1.to("#loader", {
    display: "none",
  });
}
loading();
//------------------------------------------------------------------------------------------------------------

function submitForm() {
  const form = document.getElementById("apiForm");
  const clearBtn = document.getElementById("clearBtn");

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      // Get the form values
      let macid = document.getElementById("macid").value;
      let time = document.getElementById("time").value;
      let zone = document.getElementById("zone").value;

      // Make an API call to Flask backend
      fetch("/get_image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ macid: macid, time: time, zone: zone }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.image_url) {
            document.getElementById("responseImage").src = data.image_url;
            document.getElementById("responseImage").style.display = "block";
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      document.getElementById("macid").value = "";
      document.getElementById("time").value = "";
      document.getElementById("zone").value = "";
      document.getElementById("responseImage").style.display = "none";
    });
  }
}
submitForm();
//------------------------------------------------------------------------------------------------------------

function animatePage2HeadingMovement() {
  var t1 = gsap.timeline({
    scrollTrigger: {
      trigger: "#page2",
      scroller: "#main",
      start: "top 40%",
      end: "bottom 40%",
      scrub: 1,
    },
  });

  t1.to(
    "#page2 h1",
    {
      x: -200,
      duration: 1,
    },
    "anim" // Common label
  );

  t1.to(
    "#page2 h2",
    {
      x: 200,
      duration: 1,
    },
    "anim"
  );
}
animatePage2HeadingMovement();
//---------------------------------------------------------------------------------------------------------------------------------------
var crsr = document.querySelector("#cursor");

document.addEventListener("mousemove", function (dets) {
  crsr.style.left = dets.x - 20 + "px";
  crsr.style.top = dets.y - 20 + "px";
});

// Check if cursor is inside page11
page11.addEventListener("mouseenter", function () {
  crsr.style.backgroundColor = "#1f73ff"; // blue color
});

page11.addEventListener("mouseleave", function () {
  crsr.style.backgroundColor = "white"; // reset color (or set to default)
});

//------------------------------------------------------------------------------------------------------------

function canvas() {
  const canvas = document.querySelector("#page3>canvas");
  const context = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render();
  });

  function files(index) {
    var data = `
  /static/bridges/bridges00004.png
  /static/bridges/bridges00007.png
  /static/bridges/bridges00010.png
  /static/bridges/bridges00013.png
  /static/bridges/bridges00016.png
  /static/bridges/bridges00019.png
  /static/bridges/bridges00022.png
  /static/bridges/bridges00025.png
  /static/bridges/bridges00028.png
  /static/bridges/bridges00031.png
  /static/bridges/bridges00034.png
  /static/bridges/bridges00037.png
  /static/bridges/bridges00040.png
  /static/bridges/bridges00043.png
  /static/bridges/bridges00046.png
  /static/bridges/bridges00049.png
  /static/bridges/bridges00052.png
  /static/bridges/bridges00055.png
  /static/bridges/bridges00058.png
  /static/bridges/bridges00061.png
  /static/bridges/bridges00064.png
  /static/bridges/bridges00067.png
  /static/bridges/bridges00070.png
  /static/bridges/bridges00073.png
  /static/bridges/bridges00076.png
  /static/bridges/bridges00079.png
  /static/bridges/bridges00082.png
  /static/bridges/bridges00085.png
  /static/bridges/bridges00088.png
  /static/bridges/bridges00091.png
  /static/bridges/bridges00094.png
  /static/bridges/bridges00097.png
  /static/bridges/bridges00100.png
  /static/bridges/bridges00103.png
  /static/bridges/bridges00106.png
  /static/bridges/bridges00109.png
  /static/bridges/bridges00112.png
  /static/bridges/bridges00115.png
  /static/bridges/bridges00118.png
  /static/bridges/bridges00121.png
  /static/bridges/bridges00124.png
  /static/bridges/bridges00127.png
  /static/bridges/bridges00130.png
  /static/bridges/bridges00133.png
  /static/bridges/bridges00136.png
  /static/bridges/bridges00139.png
  /static/bridges/bridges00142.png
  /static/bridges/bridges00145.png
  /static/bridges/bridges00148.png
  /static/bridges/bridges00151.png
  /static/bridges/bridges00154.png
  /static/bridges/bridges00157.png
`;
    return data.split("\n")[index];
  }

  const frameCount = 52;

  const images = [];
  const imageSeq = {
    frame: 1,
  };

  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = files(i);
    images.push(img);
  }

  gsap.to(imageSeq, {
    frame: frameCount - 1,
    snap: "frame",
    ease: `none`,
    scrollTrigger: {
      scrub: 0.5,
      trigger: `#page3`,
      start: `top 10%`,
      end: `200% top`,
      scroller: `#main`,
    },
    onUpdate: render,
  });

  images[1].onload = render;

  function render() {
    scaleImage(images[imageSeq.frame], context);
  }

  function scaleImage(img, ctx) {
    var canvas = ctx.canvas;
    var hRatio = canvas.width / img.width;
    var vRatio = canvas.height / img.height;
    var ratio = Math.max(hRatio, vRatio);
    var centerShift_x = (canvas.width - img.width * ratio) / 2;
    var centerShift_y = (canvas.height - img.height * ratio) / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      centerShift_x,
      centerShift_y,
      img.width * ratio,
      img.height * ratio
    );
  }
  ScrollTrigger.create({
    trigger: "#page3",
    pin: true,
    scroller: `#main`,
    start: `top top`,
    end: `200% top`,
  });
}
canvas();
