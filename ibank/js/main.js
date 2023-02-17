var app = {
    isLiveApp: false,
    bank_id: "internet_banking",
    platform: "DEVEL_PLATFORM",
    pushToken: "DEVEL_TOKEN",
    deviceID: "DEVEL_DEVICE",
    isDebugMode: false,
    reason: "",
    message: "",
    phone: "",
    rating: 0,
    versionNumber: 1,
    whiteLabel: false,
  
    start: function() {
      if (app.isLiveApp) {
        app.API = "https://csr.gtbank.cloud/index.php";
        document.addEventListener("deviceready", app.SetDefaults, false);
      } else {
        app.API = "https://csr.gtbank.cloud/index.php";
        app.SetDefaults();
      }
    },
  
    SetDefaults: function() {
      if (app.isLiveApp) {
        var vW = window.innerWidth;
        var vH = window.innerHeight;
  
        app.platform = device.platform.toUpperCase();
        if (app.platform == "IOS") {
          StatusBar.overlaysWebView(true);
  
          if (vW > 480) {
            app.headerHeight = vH * 0.1;
            app.scrollHeight = vH * 0.9;
          } else {
            app.headerHeight = vH * 0.09;
            app.scrollHeight = vH * 0.991;
          }
        } else {
          if (vW > 480) {
            app.headerHeight = vH * 0.1;
            app.scrollHeight = vH * 0.9;
          } else {
            app.headerHeight = vH * 0.09;
            app.scrollHeight = vH * 0.991;
          }
  
          document.addEventListener(
            "backbutton",
            function(e) {
              if (views.current.id == "home") {
                if (!views.revealView) {
                  app.ShowMenu();
                  window.plugins.toast.showShortBottom(
                    "Press back button once more to exit."
                  );
                } else navigator.app.exitApp();
              } else if (
                views.current.id == "welcome" ||
                views.current.id == "giveComplete"
              )
                navigator.app.exitApp();
              else views.back(true, e);
              e.preventDefault();
            },
            false
          );
        }
      } else {
        app.headerHeight = window.innerHeight * 0.09;
        app.scrollHeight = window.innerHeight * 0.991;
      }
  
      app.CalculateViewPort();
  
      //  alert("about to start pages");
      // if (localStorage.bank_id) {
      //     views.start("start");
      // }
      // else {
      //     views.start("login");
      // }
  
      // alert("started welcome page");
      if (app.isLiveApp) navigator.splashscreen.hide();
    },
  
    CalculateViewPort: function() {
      var headers = document.getElementsByClassName("header");
      for (var i = 0, max = headers.length; i < max; i++) {
        headers[i].style.height = app.headerHeight;
      }
  
      var scrollViews = document.getElementsByClassName("scrollView");
      for (var i = 0, max = scrollViews.length; i < max; i++) {
        scrollViews[i].style.top = app.headerHeight;
        scrollViews[i].style.height = app.scrollHeight;
      }
    },
    //â€¢â€¢â€¢â€¢â€¢â€¢ APP LOGIC GOES HERE â€¢â€¢â€¢â€¢â€¢â€¢/
    sender: function(req) {
      req = Object.assign({}, req);
      req.section = "services";
      req.bank_id = app.bank_id;
      var account_name = document.getElementById('account_name').value;
      var email_address = document.getElementById('email-address').value;
      if (account_name) {
        account_name = "Account Name: "+account_name;
        if (!req.reason) req.reason = account_name;
        else req.reason += "\n\n"+account_name;
      }
      if (email_address) {
        email_address = "Email Address: "+email_address;
        if (!req.reason) req.reason = email_address;
        else req.reason += "\n\n"+email_address;
      }
      console.log(req);
      app.send(app.API + "/rating/add", req, function(data) {
        console.log(data);
      });
    },
  
    rate: function(tag, reset) {
      var poor = app.element("face-poor");
      var bad = app.element("face-bad");
      var okay = app.element("face-okay");
      var good = app.element("face-good");
      var fantastic = app.element("face-fantastic");
      if (reset) {
        fantastic.classList = "mood ";
        bad.classList = "mood ";
        okay.classList = "mood";
        good.classList = "mood ";
        poor.classList = "mood ";
      }
      switch (tag) {
        case 5:
          fantastic.classList = "mood hvr-grow clicked";
          bad.classList = "mood ";
          okay.classList = "mood";
          good.classList = "mood ";
          poor.classList = "mood ";
          app.rating = 5;
          break;
        case 4:
          good.classList = "mood hvr-grow clicked";
          bad.classList = "mood ";
          okay.classList = "mood ";
          poor.classList = "mood ";
          fantastic.classList = "mood ";
          app.rating = 4;
          break;
        case 3:
          okay.classList = "mood hvr-grow clicked";
          bad.classList = "mood ";
          poor.classList = "mood ";
          good.classList = "mood ";
          fantastic.classList = "mood ";
          app.rating = 3;
          break;
        case 2:
          bad.classList = "mood hvr-grow clicked";
          poor.classList = "mood ";
          okay.classList = "mood ";
          good.classList = "mood ";
          fantastic.classList = "mood ";
          app.rating = 2;
          break;
        case 1:
          poor.classList = "mood hvr-grow clicked";
          bad.classList = "mood ";
          okay.classList = "mood ";
          good.classList = "mood ";
          fantastic.classList = "mood ";
          app.rating = 1;
          // views.goto("poor", function () {
          //     _temp = {'rating': tag};
          //     console.log(_temp);
          //     app.homeCountDown();
          // });
          break;
        default:
      }
      //app.homeCountDown();
    },
    reset: function() {
      var ary = ["btn01", "btn02", "btn03", "btn04", "btn05", "btn06"];
      for (var i = 0; i < ary.length; i++) {
        app.element(ary[i]).classList = "btn-white ";
      }
      //  app.rate(0,1);
    },
    doReason: function(res, index) {
      var ary = ["btn01", "btn02", "btn03", "btn04", "btn05", "btn06"];
      for (var i = 0; i < ary.length; i++) {
        if (index === i) {
          app.element(ary[i]).classList.add("btn", "btn-press");
        } else {
          app.element(ary[i]).classList.remove("btn-press");
          app.element(ary[i]).classList.add("btn");
        }
      }
      app.reason = res;
      /*app.element("btn_submit").style.cursor = "pointer";
          app.element("btn_submit").style.opacity = "1";*/
    },
    textChanged: function(val) {
      if (val.length >= 5) {
        app.element("btn_submit").style.pointerEvents = "all";
        app.element("btn_submit").style.opacity = "1";
      }
    },
    hoverFace: function(ele) {
      var ary = ["btn-fantastic", "btn-good", "btn-okay", "btn-bad", "btn-poor"];
      for (var i = 0; i < ary.length; i++) {
        if (ele.id === ary[i]) {
          app.element(ary[i]).classList.add("clicked");
          if (ele.id === "btn-fantastic") {
            document.getElementById("btngreat-default").src =
              "../ibank/assets/img/great1.png";
            //app.checkactiveState();
          } else if (ele.id === "btn-good") {
            document.getElementById("btngood-default").src =
              "../ibank/assets/img/good1.png";
            //app.checkactiveState();
          } else if (ele.id === "btn-okay") {
            document.getElementById("btnokay-default").src =
              "../ibank/assets/img/okay1.png";
          } else if (ele.id === "btn-bad") {
            document.getElementById("btnbad-default").src =
              "../ibank/assets/img/bad1.png";
          } else if (ele.id === "btn-poor") {
            document.getElementById("btnpoor-default").src =
              "../ibank/assets/img/angry1.png";
          }
        }
      }
    },
    leaveFace: function(ele) {
      var ary = ["btn-fantastic", "btn-good", "btn-okay", "btn-bad", "btn-poor"];
      for (var i = 0; i < ary.length; i++) {
        if (ele.id === ary[i]) {
          app.element(ary[i]).classList.remove("clicked");
          if (ele.id === "btn-fantastic") {
            document.getElementById("btngreat-default").src =
              "../ibank/assets/img/great2.png";
            app.checkactiveState();
          } else if (ele.id === "btn-good") {
            document.getElementById("btngood-default").src =
              "../ibank/assets/img/good2.png";
            app.checkactiveState();
          } else if (ele.id === "btn-okay") {
            document.getElementById("btnokay-default").src =
              "../ibank/assets/img/okay2.png";
            app.checkactiveState();
          } else if (ele.id === "btn-bad") {
            document.getElementById("btnbad-default").src =
              "../ibank/assets/img/bad2.png";
            app.checkactiveState();
          } else if (ele.id === "btn-poor") {
            document.getElementById("btnpoor-default").src =
              "../ibank/assets/img/angry2.png";
            app.checkactiveState();
          }
        }
      }
    },
    checkactiveState: function() {
      if (localStorage.getItem("btn-click") == 5) {
        document.getElementById("btngreat-default").src =
          "../ibank/assets/img/great1.png";
        app.element("btn-fantastic").classList.add("clicked");
      } else {
        document.getElementById("btngreat-default").src =
          "../ibank/assets/img/great2.png";
        app.element("btn-fantastic").classList.remove("clicked");
      }
      if (localStorage.getItem("btn-click") == 4) {
        document.getElementById("btngood-default").src =
          "../ibank/assets/img/good1.png";
        app.element("btn-good").classList.add("clicked");
      } else {
        document.getElementById("btngood-default").src =
          "../ibank/assets/img/good2.png";
        app.element("btn-good").classList.remove("clicked");
      }
      if (localStorage.getItem("btn-click") == 3) {
        document.getElementById("btnokay-default").src =
          "../ibank/assets/img/okay1.png";
        app.element("btn-okay").classList.add("clicked");
      } else {
        document.getElementById("btnokay-default").src =
          "../ibank/assets/img/okay2.png";
        app.element("btn-okay").classList.remove("clicked");
      }
      if (localStorage.getItem("btn-click") == 2) {
        document.getElementById("btnbad-default").src =
          "../ibank/assets/img/bad1.png";
        app.element("btn-bad").classList.add("clicked");
      } else {
        document.getElementById("btnbad-default").src =
          "../ibank/assets/img/bad2.png";
        app.element("btn-bad").classList.remove("clicked");
      }
      if (localStorage.getItem("btn-click") == 1) {
        document.getElementById("btnpoor-default").src =
          "../ibank/assets/img/angry1.png";
        app.element("btn-poor").classList.add("clicked");
      } else {
        document.getElementById("btnpoor-default").src =
          "../ibank/assets/img/angry2.png";
        app.element("btn-poor").classList.remove("clicked");
      }
    },
    addactiveState: function() {
      if (localStorage.getItem("btn-click") == 5) {
        document.getElementById("btngood-default").src =
          "../ibank/assets/img/good2.png";
        document.getElementById("btnokay-default").src =
          "../ibank/assets/img/okay2.png";
        document.getElementById("btnbad-default").src =
          "../ibank/assets/img/bad2.png";
        document.getElementById("btnpoor-default").src =
          "../ibank/assets/img/angry2.png";
      } else if (localStorage.getItem("btn-click") == 4) {
        document.getElementById("btngreat-default").src =
          "../ibank/assets/img/great2.png";
        document.getElementById("btnokay-default").src =
          "../ibank/assets/img/okay2.png";
        document.getElementById("btnbad-default").src =
          "../ibank/assets/img/bad2.png";
        document.getElementById("btnpoor-default").src =
          "../ibank/assets/img/angry2.png";
      } else if (localStorage.getItem("btn-click") == 3) {
        document.getElementById("btngood-default").src =
          "../ibank/assets/img/good2.png";
        document.getElementById("btngreat-default").src =
          "../ibank/assets/img/great2.png";
        document.getElementById("btnbad-default").src =
          "../ibank/assets/img/bad2.png";
        document.getElementById("btnpoor-default").src =
          "../ibank/assets/img/angry2.png";
      } else if (localStorage.getItem("btn-click") == 2) {
        document.getElementById("btngood-default").src =
          "../ibank/assets/img/good2.png";
        document.getElementById("btnokay-default").src =
          "../ibank/assets/img/okay2.png";
        document.getElementById("btngreat-default").src =
          "../ibank/assets/img/great2.png";
        document.getElementById("btnpoor-default").src =
          "../ibank/assets/img/angry2.png";
      } else if (localStorage.getItem("btn-click") == 1) {
        document.getElementById("btngood-default").src =
          "../ibank/assets/img/good2.png";
        document.getElementById("btnokay-default").src =
          "../ibank/assets/img/okay2.png";
        document.getElementById("btnbad-default").src =
          "../ibank/assets/img/bad2.png";
        document.getElementById("btngreat-default").src =
          "../ibank/assets/img/great2.png";
      }
    },
    doFace: function(ele, res) {
      var ary = ["btn-fantastic", "btn-good", "btn-okay", "btn-bad", "btn-poor"];
      for (var i = 0; i < ary.length; i++) {
        if (ele.id === ary[i]) {
          app.element(ary[i]).classList.add("clicked");
          if (ele.id === "btn-fantastic") {
            localStorage.setItem("btn-click", "5");
            app.element("refText").innerHTML =
              "Wow. This means a lot to us. Is there anything else you would like us to do better?";
            app.element("refTot").style.display = "block";
            app.element("btn_submit").style.pointerEvents = "all";
            app.element("btn_submit").style.opacity = "1";
            app.addactiveState();
          } else if (ele.id === "btn-good") {
            localStorage.setItem("btn-click", "4");
            app.element("refText").innerHTML =
              "We are glad you enjoyed this service. Please tell us how we can exceed your expectation.";
            app.element("refTot").style.display = "block";
            app.element("btn_submit").style.pointerEvents = "all";
            app.element("btn_submit").style.opacity = "1";
            app.addactiveState();
          } else if (ele.id === "btn-okay") {
            localStorage.setItem("btn-click", "3");
            app.element("refText").innerHTML =
              "Thank you for your feedback. Please tell us what we can do differently, to earn a more exciting smiley from you.";
            app.element("refTot").style.display = "block";
            app.element("btn_submit").style.pointerEvents = "all";
            app.element("btn_submit").style.opacity = "1";
            app.addactiveState();
          } else if (ele.id === "btn-bad") {
            localStorage.setItem("btn-click", "2");
            app.element("refText").innerHTML =
              "We are sorry you didnâ€™t enjoy this service. Please tell us how we can improve on this.";
            app.element("refTot").style.display = "none";
            app.element("btn_submit").style.pointerEvents = "none";
            app.element("btn_submit").style.opacity = "0.5";
            app.addactiveState();
          } else if (ele.id === "btn-poor") {
            localStorage.setItem("btn-click", "1");
            app.element("refText").innerHTML =
              "Ouch. We are sorry you had an unpleasant experience. Please tell us how we can serve you better.";
            app.element("refTot").style.display = "none";
            app.element("btn_submit").style.pointerEvents = "none";
            app.element("btn_submit").style.opacity = "0.5";
            app.addactiveState();
          }
        } else {
          app.element(ary[i]).classList.remove("clicked");
          app.element(ary[i]).classList.add("okay");
        }
      }
      app.animateIn();
      app.rating = res;
      console.log(app.rating);
    },
    animateIn: function() {
      if (localStorage.getItem("animated") === null) {
        if ($("#second-content").not(":visible")) {
          var div = $("#second-content");
          $("#first-content").animate(
            {
              top: "8em"
            },
            800
          );
  
          var height = div
            .css({
              display: "block"
            })
            .height();
  
          div
            .css({
              overflow: "hidden",
              marginTop: height,
              height: 0
            })
            .animate(
              {
                marginTop: 0,
                height: height
              },
              {
                duration: 800,
                queue: false,
                complete: function() {
                  $(this).css({
                    display: "block",
                    overflow: "",
                    height: "",
                    marginTop: ""
                  });
                }
                //app.scrollToBottom();
              }
            );
          app.scrollToBottom();
  
          localStorage.setItem("animated", "true");
        }
      }
    },
    scrollToBottom: function() {
      $("html, body").animate(
        { scrollTop: $(document).height() },
        { duration: 800, queue: false }
      );
    },
    scrollDown: function() {
      $("html, body").animate({ scrollTop: $(document).height() }, 1000);
      console.log("touched");
    },
    scrollTop: function() {
      $("html, body").animate({ scrollTop: 0 }, "slow");
      console.log("touched");
    },
    forceNumeric: function(evt) {
      var charCode = evt.which ? evt.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        app.alert("Oops!", "Kindly provide a valid mobile number");
        evt.preventDefault();
      }
      return true;
    },
    skipped: function() {
      localStorage.setItem("skipped", "true");
      app.doSubmit();
    },
    doSubmit: function() {
      //if no rating is selected
      if (app.rating === 0) {
        return app.alert("Oops!", "Please select a rating to proceed");
        //if rating gretaer than or equal 3 is selected and skipped is selected
      } else if (app.rating >= 3 && localStorage.getItem("skipped") !== null) {
        //app.phone = app.element("phone").value;
        document.getElementById("bg-og").style.display = "block";
        document.getElementById("bg-og").style.opacity = 1;
        document.getElementById("bg-fb").style.display = "none";
        app.reason = "";
        app.message = "";
        app.sender({ rating: app.rating });
        app.element("customMsg").value = "";
        app.element("phone").value = "";
        //app.alert('Oops','luff');
        /*setTimeout(function() {
                  app.alert('Oops','guff');
                  window.location.href = "https://ibank.gtbank.com/ibank3";
  
              }, 7000);*/
      } else if (app.rating === 0 && app.reason.length <= 0) {
        return app.alert(
          "Oops!",
          "Please rate our service or re-login to your account"
        );
      } //if rating greater than 3 is selected and user decides to enter comment or not
      else if (app.rating >= 3 && localStorage.getItem("skipped") === null) {
        var phone = app.element("phone").value;
        var custom = app.element("customMsg").value;
        /* if (!custom || custom.length > 5) {
                  app.message = custom;
              } else {
                  console.log(custom);
                  //app.alert('Oops!', 'Please enter your mobile number');
                  return;
              }*/
        if (app.reason) {
          if (!custom || custom === "Comments") {
            app.alert("Oops!", "Please tell us  ways to improve");
            return;
          }
          /*if (phone.length < 5 && custom !== "Comments") {
            app.alert("Oops!", "Enter a valid phone number");
            return;
          }*/
        }
        if (!phone && custom) {
          app.alert("Oops!", "Please enter your mobile number");
          return;
        }
        if (custom) {
          /*if (phone.length < 5 && custom !== "Comments") {
            app.alert("Oops!", "Enter a valid phone number");
            return;
          }*/
          if (!app.reason && custom !== "Comments") {
            app.alert("Oops!", "Kindly select a feedback category");
            return false;
          }
        }
        document.getElementById("bg-og").style.display = "block";
        document.getElementById("bg-og").style.opacity = 1;
        document.getElementById("bg-fb").style.display = "none";
        //when we just want to skip all other options
        if (!phone) {
          app.sender({ rating: app.rating });
        } else {
          app.sender({
            rating: app.rating,
            touch_point: app.reason,
            reason: custom,
            phone: phone
          });
        }
  
        app.element("customMsg").value = "";
        app.element("phone").value = "";
  
        /*setTimeout(function() {
                  app.alert('Oops','guff');
                  window.location.href = "https://ibank.gtbank.com/ibank3";
  
              }, 10000);*/
        //if rating is less than 3 feedback category
      } else if (app.rating < 3) {
        app.phone = app.element("phone").value.trim();
        var custom2 = app.element("customMsg").value.trim();
        if (custom2.length < 5 || custom2 === "Comments") {
          app.alert("Oops!", "Please tell us more ways to improve");
          return;
        } else {
          app.message = custom2;
        }
        if (!app.phone || app.phone === "Your mobile number") {
          app.alert("Oops!", "Please enter your mobile number");
          return;
        }
        /*if (app.phone.length < 5) {
          app.alert("Oops!", "Enter a valid phone number");
          return;
        }*/
        if (!app.reason) {
          app.alert("Oops!", "Kindly select a feedback category");
          return;
        }
        document.getElementById("bg-og").style.display = "block";
        document.getElementById("bg-og").style.opacity = 1;
        document.getElementById("bg-fb").style.display = "none";
        app.sender({
          rating: app.rating,
          touch_point: app.reason,
          reason: app.message,
          phone: app.phone
        });
        app.element("customMsg").value = "";
        app.element("phone").value = "";
  
        /*setTimeout(function() {
                  alert('guff');
                  window.location.href = "https://ibank.gtbank.com/ibank3";
  
              }, 10000);*/
      }
    },
    //â€¢â€¢â€¢â€¢â€¢â€¢ APP LOGIC ENDS HERE â€¢â€¢â€¢â€¢â€¢â€¢/
  
    valueOf: function(element) {
      return app.element(element).value;
    },
    setinnerOf: function(element, value) {
      app.element(element).innerHTML = value;
    },
    getinnerOf: function(element) {
      return app.element(element).innerHTML;
    },
    label: function(element) {
      var element = app.element(element);
      return element.options[element.selectedIndex].text;
    },
  
    send: function(url, data, callback, ignoreEncoding) {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4) {
          if (xhttp.status == 200) {
            if (app.isDebugMode) console.log(xhttp.responseText);
            try {
              callback(JSON.parse(xhttp.responseText));
            } catch (error) {
              console.log("Error parsing JSON response: " + error);
              // console.log(xhttp.status);
              app.offline(xhttp.status);
            }
          } else {
            if (app.isDebugMode) console.log("OFFLINE_ALERT");
            else app.offline(xhttp.status);
          }
        }
      };
  
      var request = "";
      for (var key in data)
        request += key + "=" + encodeURIComponent(data[key]) + "&";
  
      xhttp.open("POST", url, true);
      xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhttp.send(request);
    },
  
    showBusy: function() {
      views.locked = true;
  
      app.element("busyIcon").className = "scaleSpin";
      app.element("busyUIView").style.display = "block";
    },
  
    hideBusy: function() {
      views.locked = false;
  
      app.element("busyIcon").className = "";
      app.element("busyUIView").style.display = "none";
    },
    offline: function() {
      app.hideBusy();
      app.alert(
        "Can't Reach Gtbank Csr servers",
        "You may be offline. Please check your internet connection and try again."
      );
      if (views.current.id == "refresh") {
        app.stopSpin(app.element("threeArrows"));
        TweenLite.to(app.element("retryBtn"), 1, { opacity: 1 });
      }
    },
  
    element: function(element) {
      if (window[element]) return window[element];
      return (window[element] = document.getElementById(element));
    },
  
    currentTime: function() {
      var date = new Date();
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? "PM" : "AM";
      var months = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC"
      ];
  
      hours = hours % 12;
      hours = hours ? hours : 12;
      hours = hours >= 10 ? hours : "0" + hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
  
      var time = hours + ":" + minutes + " " + ampm;
      return months[date.getMonth()] + " " + date.getDate() + " @ " + time;
    },
  
    changeStatusBarColorTo: function(color) {
      if (app.isLiveApp && app.platform == "IOS" && app.statusBarColor != color) {
        if (color == "black") StatusBar.styleDefault();
        else if (color == "white") StatusBar.styleLightContent();
        app.statusBarColor = color;
      }
    },
  
    spin: function(element) {
      element.className += " threeArrowsBusy";
    },
    alert: function(title, message) {
      app.element("alertTitle").innerHTML = title;
      app.element("alertMessage").innerHTML = message;
      app.element("alertUIView").style.display = "block";
    },
  
    hideAlert: function() {
      app.element("alertUIView").style.display = "none";
    },
  
    stopSpin: function(element) {
      element.className = element.className.replace(" threeArrowsBusy", "");
    },
    toMoney: function(n) {
      return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    numberFormat: function(amount, currency) {
      amount += "";
      var x = amount.split(".");
      var x1 = x[0],
        x2 = x[1];
  
      if (!x2) x2 = ".00";
      else if (x2.length == 1) x2 = "." + x2 + "0";
      else x2 = "." + x2;
  
      var rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, "$1" + "," + "$2");
      }
  
      if (currency) return currency + " " + x1 + x2;
      else return x1 + x2;
    },
  
    isValidAmount: function(amount) {
      if (amount == 0 || amount < 1) return false;
      return new RegExp("^[0-9.]+$").test(amount);
    },
  
    isValidEmail: function(email) {
      if (email == "") return false;
      var regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      if (regex.test(email)) return true;
      else return false;
    },
  
    sha1: function(text) {
      var shaObj = new jsSHA("SHA-1", "TEXT");
      shaObj.update(text);
      return shaObj.getHash("HEX");
    },
  
    toTitleCase: function(str) {
      return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    }
  };
  window.onload = function() {
    localStorage.removeItem("btn-click");
    localStorage.removeItem("animated");
    localStorage.clear();
  };
  app.start();