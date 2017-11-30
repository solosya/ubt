Acme.infiniteScroll = function(limit, count) {
    this.count = count || 0;
    this.limit = limit || 0;
    console.log("setting up infinite");
    this.events();
};

    Acme.infiniteScroll.prototype.events = function() 
    {
        if (this.count >= this.limit) {
            var waypoint = new Waypoint({
                element: $('.loadMoreArticles'),
                offset: '80%',
                handler: function (direction) {
                    if (direction == 'down') {
                        window.Acme.cards.loadMore($(this.element), waypoint);
                    }
                }
            });
        }
    };