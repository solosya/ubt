$("document").ready(function () {
  var isMenuBroken, isMobile;
  var sbCustomMenuBreakPoint = 992;
  var mobileView = 620;
  var desktopView = 1119;
  var pageWindow = $(window);
  var scrollMetric = [pageWindow.scrollTop()];
  var menuContainer = $("#mainHeader");
  var masthead = $("#masthead");
  var articleAd = $("#articleAdScroll");
  var articleTopAd = $("#articleTopAdScroll");

  // $('.video-player').videoPlayer();

  $("img.lazyload").lazyload({
    effect: "fadeIn",
  });

  var removeMobileMenuStyles = function () {
    var menu = $("#sb-custom-menu");

    if (pageWindow.width() > 620) {
      masthead.removeClass("mobile-menu-active").removeClass("fixHeader");
    } else if (pageWindow.width() < 620 && menu.hasClass("open")) {
      masthead.addClass("mobile-menu-active").addClass("fixHeader");
    }
  };

  // Onload and resize events
  pageWindow
    .on("resize", function () {
      removeMobileMenuStyles();
    })
    .resize();

  var isScrolledPast = function (position) {
    if (scrollMetric[0] >= position) {
      return true;
    }
    return false;
  };

  var adScroll = function () {
    if (scrollMetric[1] === "up" && !isScrolledPast(1610)) {
      articleAd.removeClass("fixad").addClass("lockad");
      // console.log(scrollMetric[0]);
    } else if (scrollMetric[1] === "down" && isScrolledPast(1610)) {
      articleAd.removeClass("lockad").addClass("fixad");
      // console.log(scrollMetric[1]);
    }
    if (scrollMetric[1] === "up" && !isScrolledPast(370)) {
      articleTopAd.removeClass("fixad").addClass("lockad");
      // console.log(scrollMetric[0]);
    } else if (scrollMetric[1] === "down" && isScrolledPast(370)) {
      articleTopAd.removeClass("lockad").addClass("fixad");
      // console.log(scrollMetric[1]);
    }
  };

  //On Scroll
  pageWindow.scroll(function () {
    var direction = "down";
    var scroll = pageWindow.scrollTop();
    if (scroll < scrollMetric[0]) {
      direction = "up";
    }
    scrollMetric = [scroll, direction];
    adScroll();
  });

  $("#menu-mobile").on("click", function (e) {
    $(this).toggleClass("active");
    var thisMenuElem = $($(this).parent(".sb-custom-menu"));
    thisMenuElem.find(".menuContainer").toggleClass("show-on-tablet");
    thisMenuElem.toggleClass("open");

    if (pageWindow.width() < 620) {
      masthead.toggleClass("mobile-menu-active").toggleClass("fixHeader");
    }
    e.preventDefault();
  });

  $("li.menu-item-search").bind("mouseenter focus mouseleave", function () {
    if (window.innerWidth > sbCustomMenuBreakPoint) {
      $("input#header-search").focus();
      return false;
    }
  });

  $("ul > li.menu-item-search").on("click", function (e) {
    if (window.innerWidth > sbCustomMenuBreakPoint) {
      $("#searchpanel").toggleClass("active");
      $(".site-header").toggleClass("search_box_active");
      e.preventDefault();
    }
  });

  $(".sb-custom-menu > .menuContainer > ul > li > span").on(
    "click",
    function (e) {
      e.preventDefault();

      var elem = $(this);

      if (elem.hasClass("selected")) {
        elem.removeClass("selected");
        elem.parent().children("ul.sub-menu").stop(true, true).slideUp("fast");
        return;
      }

      var listItems = $("ul.menu.mobile > li");
      listItems.find("span").removeClass("selected");
      elem.addClass("selected");

      listItems.each(function (i) {
        var item = $(this);
        if (!item.find("span").hasClass("selected")) {
          item.children("ul.sub-menu").stop(true, true).slideUp("fast");
        }
      });

      if (elem.hasClass("selected")) {
        elem.parent().children("ul").stop(true, true).slideDown("fast");
      }
    }
  );

  var cardHolder = "";
  clearTimeout(cardHolder);
  cardHolder = setTimeout(function () {
    $(".card .content > p, .card h2").dotdotdot({
      watch: true,
    });
  }, 750);

  // $("#owl-thumbnails").owlCarousel({
  //     items: 1,
  //     thumbs: true,
  //     thumbsPrerendered: true,
  //     URLhashListener:true,
  //     startPosition: 'URLHash',
  //     pagination: true,
  //     dots: false,
  //     nav: true,
  //     navText: ["",""]
  // });

  $("#owl-gallery-image").owlCarousel({
    items: 1,
    thumbs: true,
    thumbsPrerendered: true,
    URLhashListener: true,
    startPosition: "URLHash",
    pagination: true,
    dots: false,
    nav: true,
    navText: ["", ""],
  });

  console.log("loading owl");
  $("#testimonials").owlCarousel({
    items: 1,
    autoplay: true,
    autoplaySpeed: 600,
    autoplayTimeout: 20000,
    // thumbs: true,
    // thumbsPrerendered: true,
    // nav: true,
    // navText: ["",""]
  });

  $("#batch-add").on("click", function (e) {
    var input = $("#batch-user-input").val();
    var send = JSON.parse(input);
    var url = _appJsConfig.baseHttpPath + "/api/user/batch-add";

    return $.ajax({
      type: "post",
      url: url,
      dataType: "json",
      data: send,
    })
      .done(function (r) {
        console.log(r);
        alert("Users added");
      })
      .fail(function (r) {
        console.log(r);
        alert(r.responseText);
      });
  });
});

// var audio = document.getElementById("background-music");
// var playPauseButton = document.getElementById("play-pause-button");
// var playIcon = document.getElementById("play-music");
// var pauseIcon = document.getElementById("pause-music");

// var isPlaying = false;

// function togglePlayPause() {
//   if (isPlaying) {
//     audio.pause();
//     playIcon.classList.remove("hidden");
//     pauseIcon.classList.add("hidden");
//   } else {
//     audio.play();
//     playIcon.classList.add("hidden");
//     pauseIcon.classList.remove("hidden");
//   }
//   isPlaying = !isPlaying;
// }

// // Add an event listener for when the music ends
// audio.addEventListener("ended", function () {
//   audio.currentTime = 0;
//   audio.play();
// });

// playPauseButton.addEventListener("click", togglePlayPause);
