Acme.View.articleFeed = function(cardModel, limit, offset, infinite) {
    this.cardModel = cardModel;
    this.offset    = offset || 0;
    this.limit     = limit || 10;
    this.infinite  = infinite || false;
    this.waypoint  = false;
    this.events();
};

Acme.View.articleFeed.prototype.fetch = function(elem, waypoint)
{
    var self = this;
    elem.html("Please wait...");

    var container = $('#'+elem.data('container'));

    // blogfeed makes 2 sql calls.  
    //      Offset is to get pinned contect 
    //      nonPinnedOffset gets the rest
    //      They're combined to return full result
    var options = {
        'container'         :   container,
        'limit'             :   elem.data('limit'),
        'offset'            :   elem.data('offset') || elem.data('limit'),
        'nonPinnedOffset'   :   elem.data('non-pinned-offset') || -1,
        'blogid'            :   elem.data('blogguid'),
        'loadtype'          :   elem.data('loadtype')      || "home",
        'search'            :   elem.data('searchterm')    || null,
    };
    if (options.search != null) {
        options.blogid = elem.data("blogid"); // search takes an id instead of a guid
    }


    var cardClass  =   elem.data('card-class'),
        template   =   elem.data('card-template') || null,
        label      =   elem.data('button-label')  || "Load more",
        ads_on     =   elem.data('ads')           || null,
        rendertype =   elem.data('rendertype')    || null;


    $.fn.Ajax_LoadBlogArticles(options).done(function(data) {

        if (data.success == 1) {

            elem.html(label);

            (data.articles.length < options.limit) 
                ? elem.css('display', 'none')
                : elem.show();
            
            // add counts to the dom for next request
            elem.data('non-pinned-offset', data.existingNonPinnedCount);
            elem.data('offset', (options.offset + options.limit));
            
            var html = [];
            if (ads_on == "yes") {
                html.push( window.templates.ads_infinite );
            }

            for (var i in data.articles) {
                html.push( self.cardModel.renderCard(data.articles[i], cardClass, template) );
            }

            (rendertype === "write")
                ? container.empty().append( html.join('') )
                : container.append( html.join('') );
                
            if (self.waypoint) {
                (data.articles.length < options.limit)
                    ? self.waypoint.disable()
                    : self.waypoint.enable();
            }

            $(".card .content > p, .card h2").dotdotdot();     
            // $('.video-player').videoPlayer();
            $("div.lazyload").lazyload({
                effect: "fadeIn"
            });
        }
    });
};

Acme.View.articleFeed.prototype.events = function() 
{
    var self = this;
    $('.loadMoreArticles').unbind().on('click', function(e) {
        e.preventDefault();
        self.fetch($(e.target));
    });


    if (this.infinite && this.offset >= this.limit) {
        self.waypoint = new Waypoint({
            element: $('.loadMoreArticles'),
            offset: '80%',
            handler: function (direction) {
                if (direction == 'down') {
                    self.fetch($(this.element));
                }
            }
        });
    }
};

