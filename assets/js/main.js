/* ============================================================
   С днем рождения, пап
   1) мягкое появление блоков при прокрутке
   2) тихая музыка — только по нажатию кнопки
   Никаких внешних библиотек.
   ============================================================ */

(function () {
  "use strict";

  /* ---------- мягкое появление ---------- */

  var items = [];
  var nodes = document.querySelectorAll(".reveal");
  for (var i = 0; i < nodes.length; i++) { items.push(nodes[i]); }

  function check() {
    var h = window.innerHeight || document.documentElement.clientHeight || 800;
    for (var k = items.length - 1; k >= 0; k--) {
      var r = items[k].getBoundingClientRect();
      if (r.top < h * 0.92 && r.bottom > -40) {
        items[k].className += " in";
        items.splice(k, 1);
      }
    }
  }

  var pending = false;
  function onScroll() {
    if (pending) { return; }
    pending = true;
    (window.requestAnimationFrame || function (f) { setTimeout(f, 16); })(function () {
      pending = false;
      check();
    });
  }

  try {
    check();
    window.addEventListener("scroll", onScroll, false);
    window.addEventListener("touchmove", onScroll, false);
    window.addEventListener("resize", onScroll, false);
    window.addEventListener("orientationchange", onScroll, false);
    window.addEventListener("load", check, false);
    setTimeout(check, 150);
    setTimeout(check, 700);
    setTimeout(check, 1600);
  } catch (e) {
    for (var m = 0; m < items.length; m++) { items[m].className += " in"; }
    items = [];
  }

  /* страховка: через 6 секунд показать всё, что уже рядом с экраном */
  setTimeout(function () {
    var h = window.innerHeight || document.documentElement.clientHeight || 800;
    for (var k = items.length - 1; k >= 0; k--) {
      if (items[k].getBoundingClientRect().top < h * 1.3) {
        items[k].className += " in";
        items.splice(k, 1);
      }
    }
  }, 6000);

  /* если фотография почему-то не загрузилась — её блок всё равно показываем */
  var imgs = document.getElementsByTagName("img");
  for (var j = 0; j < imgs.length; j++) {
    imgs[j].onerror = (function (node) {
      return function () {
        var p = node;
        while (p && p !== document.body) {
          var cn = String(p.className || "");
          if (cn.indexOf("reveal") > -1 && cn.indexOf(" in") === -1) {
            p.className += " in";
          }
          p = p.parentNode;
        }
      };
    })(imgs[j]);
  }

  /* ---------- тихая музыка ---------- */

  var btn = document.getElementById("snd");
  var mus = document.getElementById("mus");

  if (btn && mus) {
    try { mus.volume = 0.55; } catch (e) {}

    function setOn(state) {
      btn.className = state ? "sound reveal in on" : "sound reveal in";
      btn.setAttribute("aria-label", state ? "Выключить тихую музыку" : "Включить тихую музыку");
    }

    mus.addEventListener("pause", function () { setOn(false); }, false);
    mus.addEventListener("play", function () { setOn(true); }, false);

    btn.addEventListener("click", function () {
      try {
        if (mus.paused) {
          var pr = mus.play();
          if (pr && typeof pr.then === "function") {
            pr.then(function () { setOn(true); })["catch"](function () { setOn(false); });
          } else {
            setOn(true);
          }
        } else {
          mus.pause();
          setOn(false);
        }
      } catch (e) {}
    }, false);
  } else if (btn) {
    btn.style.display = "none";
  }
})();
