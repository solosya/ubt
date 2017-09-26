var ListingController = function() {
    return new Listing();
}

Acme.jobsearch = Acme.Model.create({
    'url' : 'search'
});
    // Acme.jobsearch.listeners = {
    //     "regionSelect" : function(data) {
    //         console.log(data);
    //         var self = this;
    //         this.query = ['s', data.regionSelect]; //, 'migrate', 'true'
    //         this.fetch().done(
    //             function(r) {
    //                 if (r.data) {
    //                     self.data = r.data;
    //                     Acme.state.listener('update_state', {'jobsearch': self});
    //                 }
    //             }
    //         );
    //     }
    // };
    // Acme.jobsearch.subscriptions = Acme.PubSub.subscribe({
    //     'Acme.jobsearch.listener' : [ "state_changed",
    //                                   "update_state"]
    // });




Acme.searchArticles = new Acme._Collection(Acme.jobsearch);

    Acme.searchArticles.subscriptions = Acme.PubSub.subscribe({
        'Acme.searchArticles.listener' : [ "update_state" ]
    });
    Acme.searchArticles.listeners = {
        "regionSelect" : function(data) {
            return this.fetch('search/search?s='+data.regionSelect);
        }
    };
    Acme.searchArticles.fetch = function(url)
    {
        var self = this;
        console.log('fetching');
        var url = (url === undefined) ? this.url() : url;
        var data = Acme.server.request( url );
        data.done( function(response) {
            self.articles = [];
            for (var i=0; i<response.length; i++) {
                self.articles.push( Object.create(self.model,
                    {   'data' : {
                            'value': response[i],
                            'writable': true
                        }
                    }
                ));
            }
            Acme.PubSub.publish('update_state', {'search': self});
        });
        return data;
    };


    Acme.ListingForm = Acme.View.create(
    {
        "container"     : {
            'main'          : $('#listingForm')
        },
        "listeners"     : {
            "user listing" : function(data) {
                console.log(data);
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
        }
    });

    Acme.ListingForm.data = {
        'id': 0,
        'blogs': [110],
        'status': 'published',
        'media_ids': ''
    };
    Acme.ListingForm.subscriptions   = Acme.PubSub.subscribe({
        'Acme.ListingForm.listener' : ["state_changed", 'update_state']
    });


    Acme.ListingForm.addPulldowns = function() {
        this.regionMenu = new Acme.listMenu({
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

        this.propertyMenu = new Acme.listMenu({
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

        this.buyMenu = new Acme.listMenu({
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
    };


    Acme.ListingForm.render = function() {
        console.log('in the render function');
        console.log(this.data);
        var form = this.container.main;
        var address = form.find("#title");
        var content = form.find("#content");

        address.val(this.data.title);
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
            $('#'+key).val(this.data.extendedData[key]);
        }


        this.renderImageThumbs(this.data.mediaData);

    };


    Acme.ListingForm.renderImageThumbs = function(images) 
    {
        console.log(images);
        var imageArray = $('#imageArray');
        var html = "";
        for (var i=0;i<images.length;i++) {
            console.log(images[i].path);
            html += '<div class="formimage" style="background-image:url(' + images[i].path + ')"></div>';
        }
        console.log(html);
        imageArray.append(html);
    }   


    Acme.ListingForm.events = function() 
    {
        var self = this;
        $('input, textarea').on("change", function(e) {
            e.stopPropagation();
            e.preventDefault();
            var data = {};
            var elem = $(e.target);
            data[elem.attr('name')] = elem.val();
            self.updateData(data);
        });


        $('.uploadFileBtn').uploadFile({
               onSuccess: function(data, obj){
                    console.log(data);
                    var resultJsonStr = JSON.stringify(data);

                    var postdata = {
                        'blogs' : ["110"],
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

        $('#listingForm').submit(function(e) {
            e.preventDefault();

            if (self.data['title'] == "") {
                $.fn.General_ShowErrorMessage({message: "Article must have a title"});
            }
            if (self.data['content'] == "") {
                $.fn.General_ShowErrorMessage({message: "Article must contain content"});
            }
            Acme.server.create('article/create', self.data).done(function(r) {
                self.data.id = r.articleId;
                self.data.guid = r.articleGuid;
                console.log(r);
            }).fail(function(r) {
                console.log(r);
            });
            // console.log(self.data);
            // console.log('submitting form');
        });

    };

Acme.ListingForm.addPulldowns();
Acme.ListingForm.events();

var Listing = function() {
    this.events();
    this.status = 'published';
    this.blogs = ['110'];
};


Listing.prototype.events = function() 
{
    var self = this;
    console.log(_appJsConfig);
    if(_appJsConfig.isUserLoggedIn === 1) {
        init();
    }

    function init() {
        console.log('initing form thing');
        
        $('.listingCard').on('click', function(e) {
            var elem = $(this);
            var card = elem.find('a').first();
            var articleId = card.data('id');
            Acme.server.fetch('article/get-article?articleId='+articleId).done(function(r) {
                console.log('got the data!!');
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
                        console.log(d);
                        extendedData[d] = r.additionalInfo[d];
                    }
                    data['extendedData'] = extendedData;
                }
                
                console.log(data);
                Acme.PubSub.publish('state_changed', {'user listing': data});
                console.log(r);
            });
        });
    }  
};




