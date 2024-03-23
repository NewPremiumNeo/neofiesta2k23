
//Color Pallete Selection on the basis of user's mode
function detectColorScheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }
}

// to detect changes in user's mode
window.matchMedia('(prefers-color-scheme: dark)').addListener(detectColorScheme);

// first detection of mode
detectColorScheme();



// CountDown Timer
function getTimeRemaining(endtime) {
  const total = Date.parse(endtime) - Date.parse(new Date());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return {
    total,
    days,
    hours,
    minutes,
    seconds
  };
}

function initializeClock(id, endtime) {
  const clock = document.getElementById(id);
  const daysSpan = clock.querySelector('.days');
  const hoursSpan = clock.querySelector('.hours');
  const minutesSpan = clock.querySelector('.minutes');
  const secondsSpan = clock.querySelector('.seconds');

  function updateClock() {
    const t = getTimeRemaining(endtime);

    daysSpan.innerHTML = t.days;
    hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

    if (t.total <= 0) {
      clearInterval(timeinterval);
    }
  }

  updateClock();
  const timeinterval = setInterval(updateClock, 1000);
}
// End date of the countdown
const deadline = new Date(Date.parse(new Date("April 07,2024 00:00:00")));
initializeClock('clockdiv', deadline);

//scroll triggers on nav and main section
var t1 = gsap.timeline()
gsap.to("#navbar", {
  backgroundColor: "#000",
  duration: 0.5,
  height: "70px",
  scrollTrigger: {
    trigger: "#navbar",
    scroller: "body",
    // markers:true,
    start: "top -1vh",
    end: "top -1.1vh",
    scrub: 1,
  },
});
t1.from("#navbar h1, #navbar a", {
  y: -100,
  opacity: 0,
  stagger: 0.2
})

t1.from(".imp-heading>h1,.btn", {
  duration: 1,
  opacity: 0,
  scale: 0
})


gsap.from(".person", {
  y: 50,
  opacity: 0,
  duration: 1.5,
  stagger: 0.4,
  scrollTrigger: {
    trigger: ".person",
    scroller: "body",
    scrub: 1,
  },
});

gsap.from(".event", {
  y: 100,
  opacity: 0,
  duration: 1.5,
  stagger: 0.4,
  scrollTrigger: {
    trigger: ".event",
    scroller: "body",
  },
});
// gsap.from(".cont-event>ui l1", {
//   x: 100,
//   opacity: 0,
//   duration: 1.5,
//   stagger: 0.4,
//   scrollTrigger: {
//     trigger: ".event",
//     scroller: "body",
//     markers:true
//   },
// });





function hamwork() {
  const hambox = document.querySelector(".ham-box");
  const hambarbox = document.querySelector(".ham-bar-box");
  const hambarboxa = document.querySelectorAll(".ham-bar-box-contant a");

  let hamopen = false;
  hambox.addEventListener("click", function () {
    if (!hamopen) {
      hambox.classList.add("open");
      hamopen = true;
      gsap.to(hambarbox, {
        duration: 0.01,
        opacity: 1,
        scale: 1,
      });
      document.body.style.overflow = 'hidden';
    } else {
      hambox.classList.remove("open");
      hamopen = false;
      gsap.to(hambarbox, {
        duration: 0.2,
        opacity: 0,
        scale: 0,
      });
      document.body.style.overflow = '';

    }
  });

  hambarboxa.forEach(function (elem) {
    elem.addEventListener("click", function () {
      if (!hamopen) {
        hambox.classList.add("open");
        hamopen = true;
        gsap.to(hambarbox, {
          duration: 0.2,
          opacity: 1,
          scale: 1,
        });
        document.body.style.overflow = 'hidden';
      }
      else {
        hambox.classList.remove("open");
        hamopen = false;
        gsap.to(hambarbox, {
          duration: 0.2,
          opacity: 0,
          scale: 0,
        });
        document.body.style.overflow = '';

      }
    });
  });
}
hamwork();

function hambarboxHeight() {
  const navHeight = document.querySelector("#navbar").offsetHeight;
  document.documentElement.style.setProperty('--scroll-padding', navHeight + 'px');
}
hambarboxHeight();



var loader = document.getElementById("mainLoader");

window.addEventListener("load", function load(event) {
  /* Page has finished loading. */
  "use strict";
  event.preventDefault();
  //gsap.to(loader, {duration: .5, autoAlpha:  0});
  setTimeout(() => {
    gsap.to(loader, { autoAlpha: 0, duration: .3 })
      .then(() => {
        loader.style.display = "none"
      })
  }, 100);

  let pageContent = document.getElementsByClassName("page-content")[0];
  if (pageContent) {
    gsap.fromTo(pageContent, { y: -window.innerHeight / 4 }, { y: 0, duration: 1 });
  }

  let tl = new gsap.timeline({ paused: true, onComplete: doneLoading });
  tl.add("start");
  tl.add(gsap.utils.toChars("loading"), "start");
  tl.timeScale(2).progress(0).eventCallback("onUpdate", updateProgressBar, [tl]);

  var imgs = document.querySelectorAll(".img-lazyload");
  for (var i = 0; i < imgs.length; i++) {
    addLazyLoad(imgs[i], tl);
  };

  var links = document.querySelectorAll("a[data-link]");
  for (var j = 0; j < links.length; j++) {
    links[j].addEventListener("click", linkClicked);
  }
});


//Organisers section

function openDialog(role) {
  const members = {
    'technical': ['Prince Kumar', 'Ankit Raj'],
    'management': ['Aaryan', 'Abhishek', 'Akshansh', 'Ankit', 'Divyanshu', 'Hariom', 'Jayanyika', 'Muskan', 'Naina', 'Pavan', 'Prince', 'Raj', 'Rajeev', 'Rishab', 'Riteek', 'Rohit', 'Adarsh', 'Aarya', 'Rohit', 'Saurav', 'Vishal'],
    'catering': ['Adarsh', 'Raj', 'Rajeev', 'Saurav', 'Hariom'],
    'stage': ['Naina', 'Jayantika', 'Arya', 'Riteek', 'Akshansh', 'Rishab'],
    'backstage': ['Ankit'],
    'finance': ['Prince'],
    'performance': ['Abhishek', 'Raj', 'Jayantika', 'Muskan', 'Divyanshu'],
    'decoration': ['Riteek', 'Aaryan', 'Naina']
    // Add more roles and members as needed
  };

  const memberList = members[role];
  const dialogMemberList = document.getElementById('dialogMemberList');

  // Clear previous member list if any
  dialogMemberList.innerHTML = '';

  // Populate the dialog with members
  memberList.forEach(member => {
    const listItem = document.createElement('li');
    listItem.textContent = member;
    dialogMemberList.appendChild(listItem);
    listItem.style.color = '#000';
  });

  // Display the dialog
  const dialog = document.getElementById('dialog');
  dialog.style.display = 'block';
  document.body.style.overflowY = "hidden";
}

function closeDialog() {
  // Hide the dialog
  const dialog = document.getElementById('dialog');
  dialog.style.display = 'none';
  document.body.style.overflowY = "auto";
}