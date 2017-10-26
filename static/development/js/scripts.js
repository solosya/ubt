$('document').ready(function() {
    var isMenuBroken, isMobile;
    var sbCustomMenuBreakPoint = 992;
    var mobileView = 620;
    var desktopView = 1119;
    var pageWindow = $(window);
    var scrollMetric = [pageWindow.scrollTop()];
    var menuContainer = $("#mainHeader");
    var masthead = $('#masthead');

    $('.video-player').videoPlayer();
    
    $("img.lazyload").lazyload({
        effect : "fadeIn"
    });





    // var result = server.request("https://weather.pagemasters.com.au/weather", {'q':'melbourne'})
    //     .done(function(r) {
    //         console.log(r);
    //         var weather = $('#weather');
    //         var location = weather.find('.location');
    //         var icon = weather.children('.icon');
    //         var description = weather.find('.description');
    //         var temperature = weather.children('.temp');

    //         location.text(r.location.split('/')[1]);
    //         description.text(r.description);
    //         temperature.html(parseInt(r.temperature) + "&deg;");
    //         console.log(location, icon, description, temperature);

    //     });






    function formatTo12hrTime(date) {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12;
      minutes = minutes < 10 ? '0'+minutes : minutes;
      return hours + '.' + minutes + ampm;
    }


    function formatDate(date) {
        var monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];

        var dayNames = [
            "Monday", "Tuesday", "Wednesday",
            "Thursday", "Friday", "Saturday", "Sunday"
        ];

        var day = date.getDate();
        var daystring = dayNames[date.getDay()];
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
        var time = formatTo12hrTime(date);
        var output = [day, monthNames[monthIndex], year, time];
        return output.join(' ');
    }

    // 4:32PM WEDNESDAY JULY 4, 2017
    var date = new Date();
        datetime = date.toISOString().substring(0, 16),
        field = document.getElementById('screentime');
        if (field) {
            field.setAttribute('datetime', datetime);
            field.innerHTML = formatDate(date);
        }


    // var isMobile = function(){
    //     if (window.innerWidth < mobileView) {
    //         return true;
    //     }
    //     return false;
    // };

    // var isDesktop = function(){
    //     if (window.innerWidth > desktopView) {
    //         return true;
    //     }
    //     return false;
    // };


    // var isScolledPast = function(position){
    //     if (scrollMetric[0] >= position) {
    //         return true;
    //     }
    //     return false;
    // };


    // var scrollUpMenu = function() {
    //     if ( scrollMetric[1] === 'up' && isScolledPast(70)){
    //         menuContainer.addClass('showOnScroll');
    //     } 
    //     else if ( scrollMetric[1] === 'down' && isScolledPast(70)) {
    //         menuContainer.addClass('fixHeader');
    //         menuContainer.removeClass('showOnScroll');

    //     }
    //     else {
    //         menuContainer.removeClass('fixHeader');
    //         menuContainer.removeClass('showOnScroll');
    //     }
    // }

    var removeMobileMenuStyles = function() {
        var menu = $('#sb-custom-menu');

        if (pageWindow.width() > 620 ) {
            masthead.removeClass('mobile-menu-active')
                    .removeClass('fixHeader');
        } else if (pageWindow.width() < 620 && menu.hasClass('open')) {
            masthead.addClass('mobile-menu-active')
                    .addClass('fixHeader'); 
        }
    }


    // Onload and resize events
    pageWindow.on("resize", function () {
        // stickHeader();
        removeMobileMenuStyles();
        // scrollUpMenu();
    }).resize();

    //On Scroll
    // pageWindow.scroll(function() {
    //     console.log('scrolling');
    //     var direction = 'down';
    //     var scroll = pageWindow.scrollTop();
    //     if (scroll < scrollMetric[0]) {
    //         direction = 'up';
    //     }
    //     scrollMetric = [scroll, direction];
    //     scrollUpMenu();
    // });




    // $("#menu-foldaway").on("click", function (e) {
    //     menu_top_foldaway.toggleClass('hide');
    //     menu_bottom_foldaway.toggleClass('hide');
    // });

    $("#menu-mobile").on("click", function (e) {
        var thisMenuElem = $( $(this).parent('.sb-custom-menu') );
        $(this).toggleClass("active");
        thisMenuElem
        thisMenuElem.find('.menuContainer').toggleClass("show-on-tablet");
        thisMenuElem.toggleClass('open');
        if (pageWindow.width() < 620) {
            masthead.toggleClass('mobile-menu-active')
                    .toggleClass('fixHeader');
        }
        e.preventDefault();
    });


    $("li.menu-item-search").bind("mouseenter focus mouseleave",function () {
        if (window.innerWidth > sbCustomMenuBreakPoint) {
            $("input#header-search").focus();
            return false;
        }
    });

    console.log('latest script');
    $("ul > li.menu-item-search").on("click", function (e) {
        console.log('clicked search');
        if (window.innerWidth > sbCustomMenuBreakPoint) {
            $("#searchpanel").toggleClass('active');
            e.preventDefault();
        }
    });



    // $(".sb-custom-menu > ul > li").hover(function (e) {
    // // $(".sb-custom-menu > .menuContainer > ul > li").bind("mouseenter", function (e) {
    //     if (pageWindow.width() > sbCustomMenuBreakPoint) {
    //         $('#searchpanel').stop(true, false).slideToggle(0);
    //         $('#searchpanel').toggleClass('now-active');
    //         e.preventDefault();
    //     }
    // });


    $(".sb-custom-menu > .menuContainer > ul > li > span").on("click", function(e) {
        e.preventDefault();

        var elem = $(this);

        if (elem.hasClass('selected')) {
            elem.removeClass('selected');
            elem.parent().children('ul.sub-menu').stop(true,true).slideUp('fast');
            return;
        }

        var listItems = $('ul.menu.mobile > li');
        listItems.find('span').removeClass('selected');
        elem.addClass('selected');

        listItems.each(function(i) {
            var item = $(this);
            if ( !item.find('span').hasClass('selected') ) {
                item.children('ul.sub-menu').stop(true,true).slideUp('fast');
            }
        });
        

        if (elem.hasClass('selected')) {
            elem.parent().children('ul').stop(true,true).slideDown('fast');
        }

    });






    var cardHolder = '';
    clearTimeout(cardHolder);
    cardHolder = setTimeout((function() {
        $('.card .content > p, .card h2').dotdotdot({
            watch: true
        });
    }), 750);


    $("#owl-thumbnails").owlCarousel({
        items: 1,
        thumbs: true,
        thumbsPrerendered: true,
        URLhashListener:true,
        startPosition: 'URLHash',
        pagination: true,
        dots: false,
        nav: true,
        navText: ["",""]
    });   




});
