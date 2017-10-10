(function ($) {
var blogFormMap = {
    "115" : [114],
    "110" : [117],
    "118" : [119],
    "121" : [120],
    "114" : '652345a3-ec41-4b13-9ec2-684e00875657',
};

var classList = document.getElementsByTagName('body')[0].className.split(/\s+/);

var blogId = [];
for (var i = 0; i < classList.length; i++) {
    if (classList[i].indexOf('blog') > -1) {
        blogId = blogFormMap[ classList[i].split('-')[1] ];
    }
}



var listingRegions = {
    "nz" : [
        "Auckland",
        "Bay of Plenty",
        "Canterbury",
        "Christchurch",
        "Coromandel",
        "Dunedin",
        "Eastland",
        "Fiordland",
        "Hawke's Bay",
        "Manawatu",
        "Marlborough",
        "Mt Cook",
        "Nelson",
        "Northland",
        "Otago",
        "Queenstown",
        "Rotorua",
        "Ruapehu",
        "Southland",
        "Taranaki",
        "Taupo",
        "Waikato",
        "Wairarapa",
        "Wanaka",
        "Wanganui",
        "Wellington",
        "West Coast"
    ],
    "au" : [
        "Australian Capital Territory",
        "New South Wales",
        "Northern Territory",
        "Queensland",
        "South Australia",
        "Tasmania",
        "Victoria",
        "Western Australia"
    ]
}

var domain = _appJsConfig.appHostName.split('.').reverse()[0];
var regionList = listingRegions[domain];

Acme.jobsearch = Acme.Model.create({
    'url' : 'search'
});
    Acme.jobsearch.listeners = {
        "regionSelect" : function(data) {
            // console.log(data);
            var self = this;
            this.query = ['s', data.regionSelect]; //, 'migrate', 'true'
            this.fetch().done(
                function(r) {
                    if (r.data) {
                        self.data = r.data;
                        Acme.state.listener('update_state', {'jobsearch': self});
                    }
                }
            );
        }
    };
    Acme.jobsearch.subscriptions = Acme.PubSub.subscribe({
        'Acme.jobsearch.listener' : [ "state_changed"]
    });




Acme.searchArticles = new Acme._Collection(Acme.jobsearch);

    Acme.searchArticles.subscriptions = Acme.PubSub.subscribe({
        'Acme.searchArticles.listener' : [ "update_state" ]
    });
    Acme.searchArticles.listeners = {
        "region" : function(data) {
            console.log(blogId);
            // return this.fetch('/api/search?meta_info='+Object.keys(data)[0] + ":" + data.region);
            return this.fetch('/home/load-articles', {'limit': 10, 'offset':0, 'blogid': blogId});
        }
    };
    Acme.searchArticles.fetch = function(url, data)
    {
        var self = this;

        var url = (url === undefined) ? this.url() : url;
        console.log(data);
        var server = 'fetch';
        if (data) {
            server = 'create';
        }
        console.log(server);
        var data = Acme.server[server]( url, data );
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
            Acme.PubSub.publish('state_changed', {'search': self});
        });
        return data;
    };



Acme.regionFilter = function() {
    this.container = $('#regionSelect');
    this.subscriptions = Acme.PubSub.subscribe({
        'Acme.jobRegionFilter.listener' : ["update_state"]
    });
    this.render();
};
    Acme.regionFilter.prototype = new Acme._View();

    Acme.regionFilter.prototype.listeners =  {
        "regionSelect" : function(data) {

            var data = {
                "region": data.regionSelect
            }
            Acme.PubSub.publish('update_state', data);
        }
    };
    Acme.regionFilter.prototype.render = function() {
        this.regionMenu = new Acme.listMenu({
            'parent'        : this.container,
            'list'          : regionList,
            'defaultSelect' : {"label": 'Select region'},
            'name'          : 'regionSelect',
            'key'           : 'regionSelect'
        }).init().render();
    };
    Acme.regionFilter.prototype.reset = function() {
        this.menu.reset();
    };




Acme.filteredListingViewClass = function(){
    this.container = $('#job-listings');
    this.subscriptions = Acme.PubSub.subscribe({
        'Acme.filteredListingView.listener' : ['state_changed']
    });
};
Acme.filteredListingViewClass.prototype = new Acme._View();
Acme.filteredListingViewClass.prototype.listeners = {
    "search" : function(data) {
        console.log(data);
        this.data = data.search.data;
        console.log(this);
        this.render();
    }
};
Acme.filteredListingViewClass.prototype.render = function() {
    console.log('rendering after search');
    console.log(this.data);
    var container = this.container;
    var cardClass = "card-rec-jobs card-rec-jobs-tablet card-rec-jobs-mobile";

    var html = "";
    for (var i=0;i<this.data.length;i++) {
        html += window.Acme.cards.renderCard(this.data[i].data, cardClass, 'jobsCardTemplate');
    }
    container.empty().append(html);

    $(".card .content > p, .card h2").dotdotdot();

}








var ListingForm = function() {};
ListingForm.prototype = new Acme._View();
ListingForm.constructor = ListingForm;
    ListingForm.prototype.init = function(blogId, layout) 
    {
        this.data = {
            'id': 0,
            'blogs':blogId,
            'media_ids': ''
        };
        this.layout = layout;
        this.addPulldowns();
        this.events();
    };

    ListingForm.prototype.container = {
        'main' : $('#listingForm')
    };
    ListingForm.prototype.listeners = 
    {
        "user listing" : function(data, topic) {
            if (data['user listing'] == null) {
                this.clear();
                return;
            }
            this.data = data['user listing'];
            this.render();
        },
        "extendedData.region" : function(data, topic) {
            this.updateData(data);
        },
        "extendedData.contracttype" : function(data, topic) {
            this.updateData(data);
        },
        "extendedData.type" : function(data, topic) {
            console.log(this);
            this.updateData(data);
        },
        "after" : function(data, topic) {
            var keys = Object.keys(data);
            if(keys === 'user listing') return;
            var validated = this.validate(keys);

            // if (!validated) {
                this.render();
                // return;
            // }
        }
    };
    ListingForm.prototype.addPulldowns = function() 
    {
        this.menus = {};

        this.menus.regionMenu = new Acme.listMenu({
                    'parent'        : $('#regionSelect'),
                    'list'          : regionList,
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
    };
    ListingForm.prototype.render = function() 
    {
        var form = this.container.main;
        var title = form.find("#title");
        var content = form.find("#content");

        title.val(this.data.title);
        content.val(this.data.content);

        this.clearErrorHightlights();

        for (key in this.data.extendedData) {
            if (key === 'region') {
                this.menus.regionMenu.select(this.data.extendedData[key]);
                continue;
            }
            if (key === 'type') {
                this.menus.propertyMenu.select(this.data.extendedData[key]);
                continue;
            }
            if (key === 'contracttype') {
                this.menus.buyMenu.select(this.data.extendedData[key]);
                continue;
            }
            if (key === 'salary') {
                $('#'+key+this.data.extendedData[key]).prop("checked", true);
            }

            $('#'+key).val(this.data.extendedData[key]);
        }


        this.addErrorHightlights();

        if (this.data.id) {
            $('#listingFormSubmit').text('UPDATE');
        }
        if (this.data.mediaData){
            this.renderImageThumbs(this.data.mediaData);
        }
    };
    ListingForm.prototype.clearErrorHightlights = function()
    {
        $("#formerror").removeClass('active');
        for (var field in this.compulsoryFields) {
            var fieldname = this.compulsoryFields[field].split('.').reverse()[0];
            $('#'+fieldname).removeClass('formError');
        }
    }
    ListingForm.prototype.addErrorHightlights = function()
    {
        console.log(this.errorFields);
        if (this.errorFields.length > 0) {
            $("#formerror").addClass('active');
        }
        for (var field in this.errorFields) {
            $('#'+this.errorFields[field]).addClass('formError');
        }
    }
    ListingForm.prototype.renderImageThumbs = function(images) 
    {
        var imageArray = $('#imageArray');
        var html = "";
        for (var i=0;i<images.length;i++) {
            var imagePath = images[i].url || images[i].path;
            html += '<div class="formimage" style="background-image:url(' + imagePath + ')"></div>';
        }
        imageArray.append(html);
    },
    ListingForm.prototype.clear = function(images) 
    {
        if (this.menus) {
            var menus = Object.keys(this.menus);
            for(var i=0;i<menus.length;i++) {
                this.menus[menus[i]].reset();
            }
        }
        $('#imageArray').empty();
        this.clearErrorHightlights();
        this.data = {
            'id': 0,
            'blogs': blogId,
            'media_ids': ''
        };
    },
    ListingForm.prototype.events = function() 
    {
        var self = this;
        $('input, textarea').on("change", function(e) {
            e.stopPropagation();
            e.preventDefault();
            var data = {};
            var elem = $(e.target);
            var elemid = elem.attr('name');

            data[elemid] = elem.val();
            self.updateData(data);

            if (self.compulsoryFields.indexOf(elemid) > -1 ) {

                if (elem.val() == '') {
                    elem.addClass("formError");
                } else {
                    elem.removeClass("formError");
                }
            } 

        });


        $('.uploadFileBtn').uploadFile({
               onSuccess: function(data, obj){

                    var resultJsonStr = JSON.stringify(data);

                    var postdata = {
                        'blogs' : blogId,
                        'imgData' : resultJsonStr
                    };

                    Acme.server.create('/api/article/save-image', postdata).done(function(r) {

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
            $('#listingFormSubmit').text('SUBMIT');
            self.clear();
        });

        $('#listingForm').submit(function(e) {
            e.preventDefault();

            var validated = self.validate();

            if (!validated) {
                self.render();
                return;
            }

            self.data.theme_layout_name = self.layout;

            Acme.server.create('/api/article/create', self.data).done(function(r) {
                $('#listingFormClear').click();
                Acme.PubSub.publish('update_state', {'userArticles': ''});
                console.log(r);
            }).fail(function(r) {
                console.log(r);
            });
        });
    }
    ListingForm.prototype.validate = function(checkFields) {
        // checkFields is used to validate a single field, 
        // otherwise itereate through all compulsory fields

        // intersect used to clear the field we want to check 
        // from errorFields.  if still an error it will add again.
        function intersect(a, b) {
            var t;
            if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
            return a.filter(function (e) {
                return b.indexOf(e) > -1;
            });
        }

        var validated = true, fields = [];
        
        if (checkFields) {
            var fields = intersect(this.compulsoryFields, checkFields);
            for (var j=0; j<fields.length;j++) {
                var fieldName = fields[j].split('.').reverse()[0];
                var index = this.errorFields.indexOf(fieldName)
                this.errorFields.splice(index, 1);
            }
        } else {
            var fields = this.compulsoryFields;
            this.errorFields = []; // reset and re-calcuate all fields
        }


        for (var i=0;i<fields.length; i++) {
            var key = fields[i];
            var keySplit = key.split('.');
            var scope = this.data;
            for(var j=0; j<keySplit.length; j++) {

                if (!scope[keySplit[j]]) {
                    scope = false;
                    break;
                }
                if(j == keySplit.length -1 ) {
                    scope = scope[keySplit[j]];
                    break;
                }
                scope = scope[keySplit[j]];
            }

            if (!scope) {
                var fieldname = fields[i].split('.').reverse()[0];
                this.errorFields.push(fieldname); 
                validated = false;
            }
        }

        return validated;
    };










Acme.JobForm = function(blogId, layout) {
    this.subscriptions = Acme.PubSub.subscribe({
        'Acme.jobForm.listener' : ['state_changed', 'update_state']
    });

    this.compulsoryFields = [
        "title", 
        "content", 
        "extendedData.company", 
        "extendedData.location",
        "extendedData.region"
    ];

    this.init(blogId, layout);
}
Acme.JobForm.prototype = new ListingForm();
Acme.JobForm.prototype.constructor=Acme.JobForm;






Acme.PropertyForm = function(blogId, layout) {
    this.subscriptions = Acme.PubSub.subscribe({
        'Acme.propertyForm.listener' : ['state_changed', 'update_state']
    });

    this.errorFields = [];

    this.compulsoryFields = [
        "title", 
        "content", 
        "extendedData.pricerange", 
        "extendedData.region",
        "extendedData.type",
        "extendedData.contracttype",
        "extendedData.contactname",
        "extendedData.contactphone"
    ];

    this.init(blogId, layout);
};
Acme.PropertyForm.prototype = new ListingForm();
Acme.PropertyForm.prototype.constructor=Acme.PropertyForm;







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
            var blogs = blogId.join(',');
            return this.fetch('/api/user/user-articles?userguid='+Acme.currentUser+'&blogs='+blogs+'&status=all');
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





Acme.listingViewClass = function(){};
Acme.listingViewClass.prototype = new Acme._View();

    Acme.listingViewClass.prototype.init =  function(blogId) {
        this.events();
        this.blogs = blogId;
    };
    Acme.listingViewClass.prototype.container = {
        'main' : $('#userListings')
    };
    Acme.listingViewClass.prototype.listeners = {
        "userlistings" : function(data) {
            this.data = data.userlistings.data;
            this.render();
        }
    };
    Acme.listingViewClass.prototype.events = function() 
    {
        var self = this;
        console.log(_appJsConfig.isUserLoggedIn);
        if(_appJsConfig.isUserLoggedIn === 1) {
            init();
        }

        function init() {
            console.log('initing');
            self.container.main.on('click', '.listingCard', function(e) {
                e.preventDefault();
                $('#listingFormClear').click();
                var elem = $(this);
                var card = elem.find('a').first();
                var articleId = card.data('id');
                var status = card.data('status');
                Acme.server.fetch('/api/article/get-article?articleId='+articleId+"&status="+status).done(function(r) {
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
                    data.media_id = mediaids[0];
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


            $("#userlistingsrefresh").on('click',function(e) {
                console.log('clicked');
                Acme.PubSub.publish('update_state', {"userArticles":''});
            });
        }  
    },
    Acme.listingViewClass.prototype.render = function()
    {
        console.log(this.data);
        var container = this.container.main;
        var cardClass = "card-form-listing listingCard";

        var html = "";
        for (var i=0;i<this.data.length;i++) {
            html += window.Acme.cards.renderCard(this.data[i].data, cardClass, 'jobsCardTemplate');
        }
        container.empty().append(html);

        $(".card .content > p, .card h2").dotdotdot();
    };

Acme.listingView = new Acme.listingViewClass();
    Acme.listingView.subscriptions = Acme.PubSub.subscribe({
        'Acme.listingView.listener' : ["state_changed", 'update_state']
    });
    

}(jQuery));