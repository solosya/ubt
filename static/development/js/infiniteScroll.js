Acme.infiniteScroll = function(limit, count, feedModel) {
    this.count = count || 0;
    this.limit = limit || 0;
    this.feedModel = feedModel;
    this.events();
};


    Acme.infiniteScroll.prototype.events = function() 
    {
        console.log('moo');
        var self = this;
        if (this.count >= this.limit) {
            var waypoint = new Waypoint({
                element: $('.loadMoreArticles'),
                offset: '80%',
                handler: function (direction) {
                    if (direction == 'down') {
                        self.feedModel.fetch($(this.element), waypoint);
                        this.element = $('.loadMoreArticles');
                    }
                }
            });
        }
    };