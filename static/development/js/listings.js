
var classList = document.getElementsByTagName('body')[0].className.split(/\s+/);
for (var i = 0; i < classList.length; i++) {
    if (classList[i].indexOf('blog') > -1) {
        classList = classList[i].split('-')[1];
    }
}


Acme.jobsearch = Acme.Model.create({
    'url' : 'search'
});
    Acme.jobsearch.listeners = {
        // "regionSelect" : function(data) {
        //     // console.log(data);
        //     var self = this;
        //     this.query = ['s', data.regionSelect]; //, 'migrate', 'true'
        //     this.fetch().done(
        //         function(r) {
        //             if (r.data) {
        //                 self.data = r.data;
        //                 Acme.state.listener('update_state', {'jobsearch': self});
        //             }
        //         }
        //     );
        // }
    };
    Acme.jobsearch.subscriptions = Acme.PubSub.subscribe({
        'Acme.jobsearch.listener' : [ "state_changed",
                                      "update_state"]
    });




Acme.searchArticles = new Acme._Collection(Acme.jobsearch);

    Acme.searchArticles.subscriptions = Acme.PubSub.subscribe({
        'Acme.searchArticles.listener' : [ "update_state" ]
    });
    Acme.searchArticles.listeners = {
        "region" : function(data) {
            console.log('fetching!!!!', data);
            return this.fetch('search/search?s='+Object.keys(data)[0] + ":" + data.region);
        }
    };
    Acme.searchArticles.fetch = function(url)
    {
        var self = this;
        console.log('fetching');
        var url = (url === undefined) ? this.url() : url;
        var data = Acme.server.fetch( url );
        data.done( function(response) {
            self.data = [];
            for (var i=0; i<response.length; i++) {
                self.data.push( Object.create(self.model,
                    {   'data' : {
                            'value': response[i],
                            'writable': true
                        }
                    }
                ));
            }
            console.log(self.data);
            Acme.PubSub.publish('update_state', {'search': self});
        });
        return data;
    };




Acme.jobRegionFilter = Acme.View.create(
{
    "container"     : $('#regionSelect'),
    "listeners"     : {
        regionSelect : function(data) {

            var data = {
                "region": data.regionSelect
            }
            Acme.PubSub.publish('update_state', data);
        }
    },
    render: function() {
        this.regionMenu = new Acme.listMenu({
            'parent'        : this.container,
            'list'          : [
                {
                    'label': "one",
                    'value': "one"
                },
                {
                    'label': "two",
                    'value': "two"
                },
                {
                    'label': "three",
                    'value': "three"
                },
            ],
            'defaultSelect' : {"label": 'Select region'},
            'name'          : 'regionSelect',
            'key'           : 'regionSelect'
        }).init().render();
    },
    reset: function() {
        this.menu.reset();
    },
    construct: function() {
        this.render();
        this.subscriptions = Acme.PubSub.subscribe({
            'Acme.jobRegionFilter.listener' : ["update_state"]
        });

    }
});



Acme.ListingForm = Acme.View.create(
{
    "container"     : {
        'main'          : $('#listingForm')
    },
    "listeners"     : {
        "user listing" : function(data) {

            if (data['user listing'] == null) {
                this.clear();
                return;
            }
            this.data = data['user listing'];
            this.render();
        },
        "extendedData.region" : function(data) {
            this.updateData(data);
        },
        "extendedData.contracttype" : function(data) {
            this.updateData(data);
        },
        "extendedData.type" : function(data) {
            this.updateData(data);
        }
    },
    "addPulldowns": function() {
        this.menus = {};

        this.menus.regionMenu = new Acme.listMenu({
                    'parent'        : $('#regionSelect'),
                    'list'          : [
                        {
                            'label': "one",
                            'value': "one"
                        },
                        {
                            'label': "two",
                            'value': "two"
                        },
                        {
                            'label': "three",
                            'value': "three"
                        },
                    ],
                    'defaultSelect' : {"label": 'Select region'},
                    'name'          : 'region',
                    'key'           : 'extendedData.region'
        }).init().render();

        this.menus.propertyMenu = new Acme.listMenu({
                    'parent'        : $('#propertySelect'),
                    'list'          : [
                        {
                            'label': "Warehouse",
                            'value': "warehouse"
                        },
                        {
                            'label': "Factory",
                            'value': "factory"
                        }
                    ],
                    'defaultSelect' : {"label": 'Type of property'},
                    'name'          : 'type',
                    'key'           : 'extendedData.type'

        }).init().render();

        this.menus.buyMenu = new Acme.listMenu({
                    'parent'        : $('#buySelect'),
                    'list'          : [
                        {
                            'label': "Buy",
                            'value': "buy"
                        },
                        {
                            'label': "Lease",
                            'value': "lease"
                        }
                    ],
                    'defaultSelect' : {"label": 'Bye/lease'},
                    'name'          : 'contracttype',
                    'key'           : 'extendedData.contracttype'
        }).init().render();
    },
    "render": function() {
        console.log('in the render function');
        console.log(this.data);
        var form = this.container.main;
        var title = form.find("#title");
        var content = form.find("#content");

        title.val(this.data.title);
        content.val(this.data.content);

        for (key in this.data.extendedData) {
            if (key === 'region') {
                this.regionMenu.select(this.data.extendedData[key]);
                continue;
            }
            if (key === 'type') {
                this.propertyMenu.select(this.data.extendedData[key]);
                continue;
            }
            if (key === 'contracttype') {
                this.buyMenu.select(this.data.extendedData[key]);
                continue;
            }
            if (key === 'salary') {
                $('#'+key+this.data.extendedData[key]).prop("checked", true);
            }

            $('#'+key).val(this.data.extendedData[key]);
        }


        this.renderImageThumbs(this.data.mediaData);
    },
    "renderImageThumbs": function(images) 
    {
        console.log(images);
        var imageArray = $('#imageArray');
        var html = "";
        for (var i=0;i<images.length;i++) {
            var imagePath = images[i].url || images[i].path;
            html += '<div class="formimage" style="background-image:url(' + imagePath + ')"></div>';
        }
        imageArray.append(html);
    },
    "clear": function(images) 
    {
        if (this.menus.length > 0) {
            for(var i=0;i<this.menus.length;i++) {
                this.menus[i].reset();
            }
        }
        $('#imageArray').empty();
        this.data = {
            'id': 0,
            'blogs': [114],
            'status': 'published',
            'media_ids': ''
        };
    },
    "events": function() 
    {
        var self = this;
        $('input, textarea').on("change", function(e) {
            e.stopPropagation();
            e.preventDefault();
            var data = {};
            var elem = $(e.target);
            data[elem.attr('name')] = elem.val();
            self.updateData(data);
            console.log(self.data);
        });


        $('.uploadFileBtn').uploadFile({
               onSuccess: function(data, obj){

                    var resultJsonStr = JSON.stringify(data);

                    var postdata = {
                        'blogs' : [114],
                        'imgData' : resultJsonStr
                    };

                    Acme.server.create('article/save-image', postdata).done(function(r) {

                        var newImageId = r.media.media_id;
                        var arrayid = $(obj).data('id');
                        var mediaids = [];
                        if (self.data.media_ids != "") {
                            mediaids = self.data.media_ids.split(',');
                        }
                        mediaids.push(newImageId);
                        self.data.media_ids = mediaids.join(',');
                        self.data.media_id = mediaids[0];

                        self.renderImageThumbs([data]);
                        $().General_ShowNotification({message: 'Image added successfully' });

                    }).fail(function(r) {
                        console.log(r);
                    });

                    
                }
        });

        $('#listingFormClear').on('click', function(e) {
            self.clear();
        });

        $('#listingForm').submit(function(e) {
            e.preventDefault();

            if (self.data['title'] === undefined || self.data['title'] == "") {
                Acme.dialog.show("Article must have a title");
                return;
            }
            if (self.data['content'] === undefined || self.data['content'] == "") {
                Acme.dialog.show("Article must contain content", "Error");
                return;
            }

            Acme.server.create('article/create', self.data).done(function(r) {
                $('#listingFormClear').click();
                Acme.PubSub.publish('update_state', {'userArticles': ''});
                console.log(r);
            }).fail(function(r) {
                console.log(r);
            });
        });
    },
    "construct": function() 
    {
        this.data = {
            'id': 0,
            'blogs': [114],
            'status': 'published',
            'media_ids': ''
        };
        this.subscriptions = Acme.PubSub.subscribe({
            'Acme.ListingForm.listener' : ["state_changed", 'update_state']
        });

        this.addPulldowns();
        this.events();
    }
});













Acme.listing = Acme.Model.create({
    'url' : 'user'
});
    Acme.listing.subscriptions = Acme.PubSub.subscribe({
        'Acme.listing.listener' : [ "state_changed",
                                      "update_state"]
    });





Acme.listingCollection = new Acme._Collection(Acme.listing);

    Acme.listingCollection.subscriptions = Acme.PubSub.subscribe({
        'Acme.listingCollection.listener' : [ "update_state" ]
    });
    Acme.listingCollection.listeners = {
        "userArticles" : function(data) {
            console.log('getting user listings');
            return this.fetch('user/user-articles?userguid='+Acme.currentUser+'&blogs='+114);
        }
    };
    Acme.listingCollection.fetch = function(url)
    {
        var self = this;
        var url = (url === undefined) ? this.url() : url;
        var data = Acme.server.fetch( url );
        data.done( function(response) {
            self.data = [];
            for (var i=0; i<response.length; i++) {
                self.data.push( Object.create(self.model,
                    {   'data' : {
                            'value': response[i],
                            'writable': true
                        }
                    }
                ));
            }
            Acme.PubSub.publish('update_state', {'userlistings': self});
        });
        return data;
    };







Acme.listingView = Acme.View.create({
    "container"     : {
        'main'          : $('#userListings')
    },
    "listeners"     : {
        "userlistings" : function(data) {
            console.log('LISTING VIEW');
            console.log(data);
            this.data = data.userlistings.data;
            this.render();
        }
    },
    "init": function() {
        this.events();
        this.status = 'published';
        this.blogs = [114];
        this.subscriptions = Acme.PubSub.subscribe({
            'Acme.listingView.listener' : ["state_changed", 'update_state']
        });
    },
    "events": function() 
    {
        var self = this;
        if(_appJsConfig.isUserLoggedIn === 1) {
            init();
        }

        function init() {
            
            self.container.main.on('click', '.listingCard', function(e) {
                e.preventDefault();
                $('#listingFormClear').click();
                var elem = $(this);
                var card = elem.find('a').first();
                var articleId = card.data('id');
                Acme.server.fetch('article/get-article?articleId='+articleId).done(function(r) {
                    console.log(r);
                    var data = {
                        'id': r.id,
                        'guid':r.guid,
                        'status':self.status,
                        'blogs': self.blogs,
                        'title': r.title,
                        'content': r.content,
                        'mediaData':r.media
                    };
                    var mediaids = [];
                    for (var i=0;i<r.media.length;i++) {
                        mediaids.push(r.media[i].media_id);
                    }
                    data.media_ids = mediaids.join(',');

                    if (r.additionalInfo) {
                        var extendedData = {};
                        for (d in r.additionalInfo) {
                            extendedData[d] = r.additionalInfo[d];
                        }
                        data['extendedData'] = extendedData;
                    }
                    
                    Acme.PubSub.publish('state_changed', {'user listing': data});
                });
            });
        }  
    },
    "render": function()
    {
        console.log(this.data);
        var container = this.container.main;
        var cardClass = "card-rec card-rec-table card-rec-mobile listingCard";

        var html = "";
        for (var i=0;i<this.data.length;i++) {

            html += window.Acme.cards.renderCard(this.data[i].data, cardClass);
        }
        container.empty().append(html);

        $(".card .content > p, .card h2").dotdotdot();
    }
});

