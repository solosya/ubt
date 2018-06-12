Acme.Feed = function() {};
Acme.Feed.prototype.fetch = function()
{
    var self = this;
    self.elem.html("Please wait...");

    var container = $('#'+self.elem.data('container'));

    // blogfeed makes 2 sql calls.  
    //      Offset is to get pinned contect 
    //      nonPinnedOffset gets the rest
    //      They're combined to return full result
    self.options = {
        'container'         :   container,
        'limit'             :   self.elem.data('limit'),
        'offset'            :   self.elem.data('offset') || self.elem.data('limit'),
        'nonPinnedOffset'   :   self.elem.data('non-pinned-offset') || -1,
        'blogid'            :   self.elem.data('blogguid'),
        'loadtype'          :   self.elem.data('loadtype')      || "home",
        'search'            :   self.elem.data('searchterm')    || null,
    };
    if (self.options.search != null) {
        self.options.blogid = self.elem.data("blogid"); // search takes an id instead of a guid
    }

    $.fn.Ajax_LoadBlogArticles(self.options).done(function(data) {
        if (data.success == 1) {
            self.render(data);
        }
    });
};

Acme.Feed.prototype.events = function() 
{
    var self = this;
    self.elem.unbind().on('click', function(e) {
        e.preventDefault();
        self.fetch();
    });


    if (this.infinite && this.offset >= this.limit) {
        self.waypoint = new Waypoint({
            element: self.elem,
            offset: '80%',
            handler: function (direction) {
                if (direction == 'down') {
                    self.fetch();
                }
            }
        });
    }
};






Acme.View.articleFeed = function(feedModel, limit, offset, infinite, failText, controller)
{
    this.feedModel = feedModel;
    this.offset    = offset || 0;
    this.limit     = limit || 10;
    this.controller= controller || null;
    this.infinite  = infinite || false;
    this.waypoint  = false;
    this.options   = {};
    this.elem      = $('.loadMoreArticles');
    this.failText  = failText || null;
    this.events();
};

Acme.View.articleFeed.prototype = new Acme.Feed();
Acme.View.articleFeed.constructor = Acme.View.articleFeed;

Acme.View.articleFeed.prototype.render = function(data) 
{
    var self = this;

    var cardClass  =   self.elem.data('card-class'),
        template   =   self.elem.data('card-template') || null,
        label      =   self.elem.data('button-label')  || "Load more",
        ads_on     =   self.elem.data('ads')           || null,

        imgWidth   =   self.elem.data('imgwidth')      || null,
        imgHeight  =   self.elem.data('imgheight')     || null,

        rendertype =   self.elem.data('rendertype')    || null;

    self.elem.html(label);

    (data.articles.length < self.options.limit) 
        ? self.elem.css('display', 'none')
        : self.elem.show();

    // add counts to the dom for next request
    self.elem.data('non-pinned-offset', data.existingNonPinnedCount);
    self.elem.data('offset', (self.options.offset + self.options.limit));

    var html = [];
    if (ads_on == "yes") {
        html.push( window.templates.ads_infinite );
    }


    if (data.articles.length === 0 && self.failText) {
        html = ["<p>" + self.failText + "</p>"];
    } else {
        for (var i in data.articles) {
            data.articles[i].imageOptions = {'width': imgWidth, 'height': imgHeight};
            html.push( self.feedModel.renderCard(data.articles[i], cardClass, template) );
        }
    }

    (rendertype === "write")
        ? self.options.container.empty().append( html.join('') )
        : self.options.container.append( html.join('') );
        
    if (self.waypoint) {
        (data.articles.length < self.options.limit)
            ? self.waypoint.disable()
            : self.waypoint.enable();
    }

    $(".card .content > p, .card h2").dotdotdot();     
    // $('.video-player').videoPlayer();
    $("div.lazyload").lazyload({
        effect: "fadeIn"
    });

    self.elem.data('rendertype', '');
    this.feedModel.events();
};





Acme.View.userFeed = function(feedModel, limit, offset, infinite, failText, controller)
{
    this.feedModel = feedModel;
    this.controller = controller || null;
    this.offset    = offset || 0;
    this.limit     = limit || 10;
    this.infinite  = infinite || false;
    this.waypoint  = false;
    this.options   = {};
    this.elem      = $('.loadMoreArticles');
    this.failText  = failText || null;
    this.events();
};

Acme.View.userFeed.prototype = new Acme.Feed();
Acme.View.userFeed.constructor = Acme.View.userFeed;

Acme.View.userFeed.prototype.render = function(data) 
{
    var self = this;
    var cardClass  =   self.elem.data('card-class'),
        template   =   self.elem.data('card-template') || null,
        label      =   self.elem.data('button-label')  || "Load more",
        ads_on     =   self.elem.data('ads')           || null,
        rendertype =   self.elem.data('rendertype')    || null;

    self.elem.html(label);

    (data.users.length < self.options.limit) 
        ? self.elem.css('display', 'none')
        : self.elem.show();

    // add counts to the dom for next request
    self.elem.data('offset', (self.options.offset + self.options.limit));

    var html = [];
    if (ads_on == "yes") {
        html.push( window.templates.ads_infinite );
    }


    if (data.users.length === 0 && self.failText) {
        html = ["<p>" + self.failText + "</p>"];
    } else {
        for (var i in data.users) {
            html.push( self.feedModel.render(data.users[i], cardClass, template) );
        }
    }

    (rendertype === "write")
        ? self.options.container.empty().append( html.join('') )
        : self.options.container.append( html.join('') );
        
    if (self.waypoint) {
        (data.users.length < self.options.limit)
            ? self.waypoint.disable()
            : self.waypoint.enable();
    }

    this.controller.userEvents();

    $(".card .content > p, .card h2").dotdotdot();     
    // $('.video-player').videoPlayer();
    $("div.lazyload").lazyload({
        effect: "fadeIn"
    });

    self.elem.data('rendertype', '');
};


Acme.Usercard = function(){
};
Acme.Usercard.prototype.render = function(user, cardClass, template, type)
{
    var self = this;
    var template = (template) ? Acme[template] : Acme.systemCardTemplate;
    userTemplate = Handlebars.compile(template);
    return userTemplate(user);
}


