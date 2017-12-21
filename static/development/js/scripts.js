$('document').ready(function() {
    var isMenuBroken, isMobile;
    var sbCustomMenuBreakPoint = 992;
    var mobileView = 620;
    var desktopView = 1119;
    var pageWindow = $(window);
    var scrollMetric = [pageWindow.scrollTop()];
    var menuContainer = $("#mainHeader");
    var masthead = $('#masthead');
    var articleAd = $('#articleAdScroll');
    var articleTopAd = $('#articleTopAdScroll');

    $('.video-player').videoPlayer();
    
    $("img.lazyload").lazyload({
        effect : "fadeIn"
    });
    







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
        removeMobileMenuStyles();
    }).resize();

    var isScrolledPast = function(position){
        if (scrollMetric[0] >= position) {
            return true;
        }
        return false;
    };

var adScroll = function() {
        if ( scrollMetric[1] === 'up' && !isScrolledPast(1610)) {
            articleAd.removeClass('fixad').addClass('lockad');
            // console.log(scrollMetric[0]);
        }
        else if ( scrollMetric[1] === 'down' && isScrolledPast(1610)) {
            articleAd.removeClass('lockad').addClass('fixad');
            // console.log(scrollMetric[1]);
        }
        if ( scrollMetric[1] === 'up' && !isScrolledPast(370)) {
            articleTopAd.removeClass('fixad').addClass('lockad');
            // console.log(scrollMetric[0]);
        }
        else if ( scrollMetric[1] === 'down' && isScrolledPast(370)) {
            articleTopAd.removeClass('lockad').addClass('fixad');
            // console.log(scrollMetric[1]);
        }
        
    }

    //On Scroll
    pageWindow.scroll(function() {
        var direction = 'down';
        var scroll = pageWindow.scrollTop();
        if (scroll < scrollMetric[0]) {
            direction = 'up';
        }
        scrollMetric = [scroll, direction];
        adScroll();
    });


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


    $("ul > li.menu-item-search").on("click", function (e) {
        console.log('clicked search');
        if (window.innerWidth > sbCustomMenuBreakPoint) {
            $("#searchpanel").toggleClass('active');
            e.preventDefault();
        }
    });



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
