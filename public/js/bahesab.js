var Err_clock = !1,
  A = document.querySelectorAll(".date-22")[0].textContent.split("-"),
  Yt = parseFloat(A[2]),
  Mt = parseFloat(A[1]),
  Dt = parseFloat(A[0]),
  time = {
    H: 0,
    M: 0,
    S: 0,
  },
  coktime = "";
try {
  coktime = document.cookie.match(/clock=\d+:\d+:\d+/g);
} catch (e) {
  (Err_clock = !0),
    (document.getElementById("bahesab-clock").style.visibility = "hidden");
}
null != coktime
  ? ((A = coktime[0].replace(/clock=/, "").split(":")),
    (time.H = parseFloat(A[0])),
    (time.M = parseFloat(A[1])),
    (time.S = parseFloat(A[2])))
  : ((time.H = 0),
    (time.M = 0),
    (time.S = 0),
    (document.getElementById("bahesab-clock").style.visibility = "hidden"));
var T1 = new Date().valueOf(),
  T3 = 60 * time.H * 6e4 + 6e4 * time.M + 1e3 * time.S,
  CHeck = 1,
  T1_mem = new Date().valueOf();
function clock() {
  var e = new Date().valueOf(),
    t =
      ((2e4 < e - T1_mem || e - T1_mem < 0) &&
        ((Err_clock = !0),
        (document.getElementById("bahesab-clock").style.visibility = "hidden")),
      T3 + e - T1),
    n = parseInt(t / 36e5),
    a = parseInt((t - 60 * n * 60 * 1e3) / 6e4),
    t = parseInt((t - 60 * n * 60 * 1e3 - 60 * a * 1e3) / 1e3);
  if (
    ((document.querySelectorAll(".am")[0].innerHTML = 12 <= n ? "" : "am"),
    (24 <= n || 59 < a || 60 < t) &&
      ((Err_clock = !0),
      (document.getElementById("bahesab-clock").style.visibility = "hidden")),
    (n < 0 || a < 0 || t < 0) &&
      ((Err_clock = !0),
      (document.getElementById("bahesab-clock").style.visibility = "hidden")),
    24 <= n)
  )
    throw (location.reload(!0), new Error());
  (T1_mem = e),
    (document.getElementById("hour").innerHTML =
      "&nbsp;" + en2fa(num_zero(n)) + "&nbsp;"),
    (document.getElementById("minut").innerHTML =
      "&nbsp;" + en2fa(num_zero(a)) + "&nbsp;"),
    (document.getElementById("second").innerHTML =
      "&nbsp;" + en2fa(num_zero(t)) + "&nbsp;"),
    setTimeout(function () {
      clock();
    }, 160);
}
clock();
var day_count = 0,
  Core =
    ((Today = document.querySelectorAll(".bahesab-wait")[0].innerHTML),
    {
      run: function (n) {
        setTimeout(function () {
          if (0 == day_count)
            (document.querySelectorAll(".bahesab-wait")[0].innerHTML = Today),
              (document.getElementById("bahesab-clock").style.display =
                "block"),
              1 == Err_clock &&
                (document.getElementById("bahesab-clock").style.visibility =
                  "hidden");
          else {
            const e = new DOMParser(),
              t = e.parseFromString(n, "text/html");
            (document.querySelectorAll(".bahesab-wait")[0].innerHTML =
              t.querySelectorAll(".bahesab-wait")[0].innerHTML),
              1 == day_count &&
                (document.querySelectorAll(".w-today-t")[0].textContent =
                  "فردا"),
              -1 == day_count &&
                (document.querySelectorAll(".w-today-t")[0].textContent =
                  "دیروز"),
              1 < day_count &&
                (document.querySelectorAll(".w-today-t")[0].innerHTML =
                  en2fa(Math.abs(day_count)) + "&nbsp;روز آینده"),
              day_count < -1 &&
                (document.querySelectorAll(".w-today-t")[0].innerHTML =
                  en2fa(Math.abs(day_count)) + "&nbsp;روز گذشته"),
              (document.getElementById("bahesab-clock").style.display = "none"),
              (document.getElementById("bazgasht").style.display = "block");
          }
          (document.querySelectorAll(".bahesab-wait")[0].style.opacity = "1"),
            (CHeck = 1);
        }, 250);
      },
      KHata: function () {
        CHeck = 1;
      },
    });
function JPost(e, t) {
  json_str = "string_o=" + (json_str = encodeURIComponent(JSON.stringify(t)));
  var n = new XMLHttpRequest();
  (n.onreadystatechange = function () {
    4 == n.readyState && 200 == n.status && Core.run(n.responseText),
      4 == n.readyState && 200 != n.status && Core.KHata();
  }),
    n.open("POST", e, !0),
    n.setRequestHeader("Content-type", "application/x-www-form-urlencoded"),
    n.send(json_str);
}
function num_zero(e) {
  return 9 == e
    ? "09"
    : 8 == e
    ? "08"
    : 7 == e
    ? "07"
    : 6 == e
    ? "06"
    : 5 == e
    ? "05"
    : 4 == e
    ? "04"
    : 3 == e
    ? "03"
    : 2 == e
    ? "02"
    : 1 == e
    ? "01"
    : 0 == e
    ? "00"
    : e;
}
function en2fa(e) {
  var t = e.toString().split("");
  for (q = 0; q < t.length; q++)
    "0" == t[q] && (t[q] = "۰"),
      "1" == t[q] && (t[q] = "۱"),
      "2" == t[q] && (t[q] = "۲"),
      "3" == t[q] && (t[q] = "۳"),
      "4" == t[q] && (t[q] = "۴"),
      "5" == t[q] && (t[q] = "۵"),
      "6" == t[q] && (t[q] = "۶"),
      "7" == t[q] && (t[q] = "۷"),
      "8" == t[q] && (t[q] = "۸"),
      "9" == t[q] && (t[q] = "۹");
  return t.join("");
}
document.addEventListener("click", function (e) {
  var t,
    n,
    a,
    o,
    e = e.target || e.srcElement,
    l = e.id,
    e = e.className;
  ("n-day" != e && "p-day" != e) ||
    !CHeck ||
    ((o = document.querySelectorAll(".date-22")[0].textContent.split("-")),
    (n = parseFloat(o[2])),
    (a = parseFloat(o[1])),
    (o = parseFloat(o[0])),
    "n-day" == e && (t = new Date(n, a - 1, o, 5, 5, 5, 5).valueOf() + 864e5),
    "p-day" == e && (t = new Date(n, a - 1, o, 5, 5, 5, 5).valueOf() - 864e5),
    (n = (e = new Date(t)).getFullYear()),
    (a = e.getMonth() + 1),
    (o = e.getDate()),
    (day_count = parseInt(
      (new Date(n, a - 1, o, 5, 5, 5, 5).valueOf() -
        new Date(Yt, Mt - 1, Dt, 5, 5, 5, 5).valueOf()) /
        864e5
    )),
    (document.querySelectorAll(".bahesab-wait")[0].style.opacity = ".5"),
    0 == day_count
      ? Core.run("")
      : ((CHeck = 0),
        JPost((url = "https://www.bahesab.ir/cdn/time/today/"), {
          y: n,
          m: a,
          d: o,
        }))),
    ("bazgasht" != l && "bazgasht-text" != l) ||
      ((document.querySelectorAll(".bahesab-wait")[0].style.opacity = ".5"),
      (day_count = 0),
      Core.run(""));
});
try {
  (ver = (ver = (ver = (os = navigator.userAgent).split("Android")[1]).split(
    ";"
  )[0]).split(".")[0]),
    5 <= (ver = parseInt(ver)) &&
      ((document.getElementById("app").style.display = "block"),
      document.getElementById("app").addEventListener("click", function () {
        window.location.assign("https://www.bahesab.ir/appd/");
      }));
} catch (e) {}
try {
  var os, ver;
  -1 != (ver = (os = window.navigator.userAgent).search(/iphone/gi)) &&
    ((document.getElementById("app-1").innerHTML = "@"),
    (document.getElementById("app-2").innerHTML = "وب اپلیکیشن آیفون"),
    (document.getElementById("app-3").innerHTML =
      "تقویم ، مناسبت ، تبدیل تاریخ ، سن"),
    document.getElementById("app").addEventListener("click", function () {
      window.location.assign("https://www.bahesab.ir/pwa/");
    }),
    (document.getElementById("app").style.display = "block"));
} catch (e) {}
