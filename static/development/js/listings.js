(function ($) {


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
        "ACT",
        "New South Wales",
        "Northern Territory",
        "Queensland",
        "South Australia",
        "Tasmania",
        "Victoria",
        "Western Australia"
    ],
    "uk" : [
        "England",
        "Ireland",
        "Scotland",
        "Wales",
        "Other"
    ],
    "test" : [
        "New York",
        "Bangkok",
        "Healsville",
        "Paris",
        "London",
        "Ballarat"
    ]
}
var workType = ["Casual", "Part time", "Full time"];

var domain = _appJsConfig.appHostName.split('.').reverse()[0];

if (domain == 'uk') {
    var listingSalary = ["10k","20k","30k", "40k", "50k", "60k", "70k", "80k", "90k","100k","150k+"];

    var propertyList = [
        { 'label': "House", 'value': "House"},
        { 'label': "Flat / Apartment", 'value': "Flat / Apartment"},
        { 'label': "Commercial", 'value': "Commercial"},
        { 'label': "Office", 'value': "Office"},
        { 'label': "Retail", 'value': "Retail"},
        { 'label': "Land", 'value': "Land"},
        { 'label': "Other", 'value': "Other"}
    ];

    var contractList = [
        { 'label': "For Sale", 'value': "For Sale"},
        { 'label': "For Rent", 'value': "For Rent"}
    ];
    var forLease = 'rent';
    var forRegion = 'Country';
    var forCurr = "£"
} else {
    var listingSalary = ["30k", "40k", "50k", "60k", "70k", "80k", "100k", "120k", "150k", "200k", "200k+"];
    var propertyList = [
        { 'label': "Industrial / Warehouse", 'value': "Industrial / Warehouse"},
        { 'label': "Residential", 'value': "Residential"},
        { 'label': "Offices", 'value': "Offices"},
        { 'label': "Development / Land", 'value': "Development / Land"},
        { 'label': "Hotel / Leisure", 'value': "Hotel / Leisure"},
        { 'label': "Medical / Consulting", 'value': "Medical / Consulting"},
        { 'label': "Serviced Offices", 'value': "Serviced Offices"},
        { 'label': "Parking / Car Space", 'value': "Parking / Car Space"},
        { 'label': "Rural / Farming", 'value': "Rural / Farming"},
        { 'label': "Showrooms / Bulky Goods", 'value': "Showrooms / Bulky Goods"},
        { 'label': "Retail", 'value': "Retail"},
        { 'label': "Other", 'value': "Other"}
    ];

    var contractList = [
        { 'label': "For Sale", 'value': "For Sale"},
        { 'label': "For Lease", 'value': "For Lease"}
    ];
     var forLease = 'lease';
     var forRegion = 'Region';
     var forCurr = "$"
}

var regionList = listingRegions[domain] || listingRegions["test"];








/***                    ****
      SEARCH PULLDOWNS
***                     ****/
Acme.regionSearchView = function() {
    this.container = $('#regionSelect');
    this.subscriptions = Acme.PubSub.subscribe({
        'Acme.jobRegionFilter.listener' : ["update_state"]
    });
    this.render();
};
    Acme.regionSearchView.prototype = new Acme._View();

    Acme.regionSearchView.prototype.listeners =  {
        "regionSelect" : function(data) {
            var data = {
                "region": data.regionSelect
            }
            Acme.PubSub.publish('update_state', data);
        }
    };
    Acme.regionSearchView.prototype.render = function() {
        this.regionMenu = new Acme.listMenu({
            'parent'        : this.container,
            'list'          : regionList,
            'defaultSelect' : {"label": 'Select '+forRegion},
            'name'          : 'regionSelect',
            'key'           : 'regionSelect',
            'allowClear'    : true
        }).init().render();
    };
    Acme.regionSearchView.prototype.reset = function() {
        this.menu.reset();
    };

Acme.propertyTypeSearchView = function() {
    this.container = $('#typeSelect');
    this.subscriptions = Acme.PubSub.subscribe({
        'Acme.propertyTypeFilter.listener' : ["update_state"]
    });
    this.render();
};
    Acme.propertyTypeSearchView.prototype = new Acme._View();

    Acme.propertyTypeSearchView.prototype.listeners =  {
        "typeSelect" : function(data) {
            var data = {
                "type": data.typeSelect
            };
            Acme.PubSub.publish('update_state', data);
        }
    };
    Acme.propertyTypeSearchView.prototype.render = function() {
        this.regionMenu = new Acme.listMenu({
            'parent'        : this.container,
            'list'          : propertyList,
            'defaultSelect' : {"label": 'Type of property'},
            'name'          : 'typeSelect',
            'key'           : 'typeSelect',
            'allowClear'    : true
        }).init().render();
    };
    Acme.propertyTypeSearchView.prototype.reset = function() {
        this.menu.reset();
    };

Acme.saleTypeSearchView = function() {
    this.container = $('#saleSelect');
    this.subscriptions = Acme.PubSub.subscribe({
        'Acme.saleTypeFilter.listener' : ["update_state"]
    });
    this.render();
};
    Acme.saleTypeSearchView.prototype = new Acme._View();

    Acme.saleTypeSearchView.prototype.listeners =  {
        "saleSelect" : function(data) {
            var data = {
                "contracttype": data.saleSelect
            };
            Acme.PubSub.publish('update_state', data);
        }
    };
    Acme.saleTypeSearchView.prototype.render = function() {
        this.regionMenu = new Acme.listMenu({
            'parent'        : this.container,
            'list'          : contractList,
            'defaultSelect' : {"label": 'Buy/'+forLease},
            'name'          : 'saleSelect',
            'key'           : 'saleSelect',
            'allowClear'    : true
        }).init().render();
    };
    Acme.saleTypeSearchView.prototype.reset = function() {
        this.menu.reset();
    };





/***                    ****
  FETCHES SEARCH RESULTS
***                     ****/
Acme.searchCollectionClass = function(blogId)
{
    this.blogId = blogId;
    this.searchTerms = {};
};
    Acme.searchCollectionClass.prototype = new Acme._Collection(Acme.jobsearch);
    Acme.searchCollectionClass.prototype.constructor=Acme.searchCollectionClass;

    Acme.searchCollectionClass.prototype.subscriptions = Acme.PubSub.subscribe({
        'Acme.searchCollection.listener' : [ "update_state" ]
    });
   
    Acme.searchCollectionClass.prototype.listeners = {
        "region" : function(data) {
            if (data.region === "") {
                delete this.searchTerms['region'];
                return;
            }
            this.searchTerms['region'] = data.region;
        },
        "type" : function(data) {
            if (data.type === "") {
                delete this.searchTerms['type'];
                return;
            }
            this.searchTerms['type'] = data.type;
        },
        "contracttype" : function(data) {
            if (data.contracttype === "") {
                delete this.searchTerms['contracttype'];
                return;
            }
            this.searchTerms['contracttype'] = data.contracttype;
        },
        "fetch" :  function() {
            var searchTerms = [];
            var loader = $('#article-load');

            for (search in this.searchTerms) {
                searchTerms.push( search + ":" + this.searchTerms[search]);
            }        
            function setLocationForSearch(data) {

                if (data[0] != undefined) {
                    if (data[0].value === "") {
                        return;
                    }
                    searchTerms.push("location:"+data[0].value);
                } else {
                    return
                }
            }
            setLocationForSearch($('#location'));
            var searchString = searchTerms.join(",");
            if (searchString) {
                return loader.data('loadtype', 'api/search')
                             .data('rendertype', 'write')
                             .data('searchterm', searchString)
                             .data('offset', '0')
                             .data('non-pinned-offset', '0')
                             .click();
            }
            var params = loader.data('loadtype', '')
                         .data('rendertype', 'write')
                         .data('searchterm', '')
                         .data('offset', '0')
                         .data('non-pinned-offset', '0')
                         .click();
            return params;
        },
    };

$('#searchButton').on('click', function(e) {
    e.preventDefault();
    Acme.PubSub.publish('update_state', {'fetch': self});
});







/***                             ****
    Base Class for all Forms
***                              ****/
Acme.Form = function(validators, rules) {
    this.errorField;
    this.validators = validators || null;
    this.validateRules = rules || {};
};
    Acme.Form.prototype = new Acme._View();
    Acme.Form.constructor = Acme.Form;
    Acme.Form.prototype.clearInlineErrors = function()
    {
        if (this.errorField) {
            this.errorField.removeClass('active');
        }
        for (var field in this.validateFields) {
            var fieldname = this.validateFields[field].split('.').reverse()[0];
            $('#'+fieldname).removeClass('formError');
        }
    };
    Acme.Form.prototype.addInlineErrors = function()
    {
        if (this.errorFields.length > 0 && this.errorField) {
            this.errorField.addClass('active');
        }
        for (var field in this.errorFields) {
            $('#'+this.errorFields[field]).addClass('formError');
        }
    };

    Acme.Form.prototype.validate = function( /* Array */ checkFields)  {
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
        if (checkFields && this.validateFields) {
            var fields = intersect(this.validateFields, checkFields);
            for (var j=0; j<fields.length;j++) {
                var fieldName = fields[j].split('.').reverse()[0];
                var index = this.errorFields.indexOf(fieldName);
                if (index === -1) break;
                this.errorFields.splice(index, 1);
            }
        } else {
            var fields = this.validateFields || [];
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

            // DO THE VALIDATE!!!
            var fieldValidators = this.validateRules[key];
            if (fieldValidators.length > 0) {

                var fieldname = fields[i].split('.').reverse()[0];
                for (var k=0; k<fieldValidators.length; k++) {
                    if ( !this.validators[ fieldValidators[k] ](scope) ) {
                        this.errorFields.push(fieldname); 
                        validated = false;
                        break;
                    }
                }
            }
        }
        return validated;
    };




Acme.Validators = {
    'notEmpty' : function(input) {
        return !input ? false : true;
    },
    'isNumeric' : function(n) {
        var ret = !isNaN(parseFloat(n)) && isFinite(n);
        return !isNaN(parseFloat(n)) && isFinite(n);
    },
    'isTrue' : function(data) {
        return (data === 'true' || data === true) ? true : false;
    }
};


/***                             ****
  Base Class job and property forms
        Extends Form Class
***                              ****/
var ListingForm = function() {};
    ListingForm.prototype = new Acme.Form(Acme.Validators);
    ListingForm.constructor = ListingForm;
    ListingForm.prototype.init = function(blogId, layout) 
    {
        this.blogId = blogId;
        this.errorField = $('#formerror');
        this.data = {
            'id': 0,
            'blogs':this.blogId,
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
        "delete listing" : function(data, topic) {
            return this.deleteListing();
        },
        "delete image" : function(data, topic) {
            return this.deleteImage(data);
        },
        "extendedData.region" : function(data, topic) {
            this.updateData(data);
        },
        "extendedData.contracttype" : function(data, topic) {
            this.updateData(data);
        },
        "extendedData.type" : function(data, topic) {
            this.updateData(data);
        },
        "extendedData.salaryfrom" : function(data, topic) {
            this.updateData(data);
        },
        "extendedData.salaryto" : function(data, topic) {
            this.updateData(data);
        },
        "extendedData.worktype" : function(data, topic) {
            this.updateData(data);
        },
        "extendedData.listingclose" : function(data, topic) {
            this.updateData(data);
        },
        "extendedData.availability" : function(data, topic) {
            this.updateData(data);
        },
        "after" : function(data, topic) {
            var keys = Object.keys(data);

            if(keys[0] === 'user listing' || keys[0] === 'delete image') return;
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
                    'defaultSelect' : {"label": forRegion+'*'},
                    'name'          : 'region',
                    'key'           : 'extendedData.region',
                    'class'         : 'formPulldowns'
        }).init().render();

        this.menus.propertyMenu = new Acme.listMenu({
                    'parent'        : $('#propertySelect'),
                    'list'          : propertyList,
                    'defaultSelect' : {"label": 'Type of property'},
                    'name'          : 'type',
                    'key'           : 'extendedData.type',
                    'class'         : 'formPulldowns'

        }).init().render();

        this.menus.buyMenu = new Acme.listMenu({
                    'parent'        : $('#buySelect'),
                    'list'          : contractList,
                    'defaultSelect' : {"label": 'For sale/'+forLease},
                    'name'          : 'contracttype',
                    'key'           : 'extendedData.contracttype',
                    'class'         : 'formPulldowns'
        }).init().render();

        this.menus.SalaryFromMenu = new Acme.listMenu({
                    'parent'        : $('#salarySelectFrom'),
                    'list'          : listingSalary,
                    'defaultSelect' : {"label": 'Salary range from '+forCurr},
                    'name'          : 'salaryfrom',
                    'key'           : 'extendedData.salaryfrom',
                    'class'         : 'formPulldowns'
        }).init().render();

        this.menus.SalaryToMenu = new Acme.listMenu({
                    'parent'        : $('#salarySelectTo'),
                    'list'          : listingSalary,
                    'defaultSelect' : {"label": 'to '+forCurr},
                    'name'          : 'salaryto',
                    'key'           : 'extendedData.salaryto',
                    'class'         : 'formPulldowns'
        }).init().render();

        this.menus.workType = new Acme.listMenu({
                    'parent'        : $('#worktypeSelect'),
                    'list'          : workType,
                    'defaultSelect' : {"label": 'Work type*'},
                    'name'          : 'worktype',
                    'key'           : 'extendedData.worktype',
                    'class'         : 'formPulldowns'
        }).init().render();
    };
    ListingForm.prototype.render = function() 
    {
        var form = this.container.main;
        var title = form.find("#title");
        var content = form.find("#content");

        title.val(this.data.title);
        content.val(this.data.content);

        this.clearInlineErrors();

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
            if (key === 'salaryfrom') {
                this.menus.SalaryFromMenu.select(this.data.extendedData[key]);
                continue;
            }
            if (key === 'salaryto') {
                this.menus.SalaryToMenu.select(this.data.extendedData[key]);
                continue;
            }
            if (key === 'worktype') {
                this.menus.workType.select(this.data.extendedData[key]);
                continue;
            }

            if (key === 'city') {
                // console.log(this.data.extendedData[key]);

                $('#'+key).val(this.data.extendedData[key]);
                continue;
            }

            $('#'+key).val(this.data.extendedData[key]);
        }

        this.addInlineErrors();

        if (this.data.id) {
            $('#listingFormSubmit').text('UPDATE');
            $('#listingFormDelete').show();
        }

        if (this.data.mediaData){
            this.renderImageThumbs(this.data.mediaData);
        }
    };
    ListingForm.prototype.renderImageThumbs = function(images) 
    {
        // console.log('rendering image array');
        var imageArray = $('#imageArray');
        console.log(imageArray.children().length, images.length);
        if ( imageArray.children().length != images.length ) {
            var html = "";
            var temp = Handlebars.compile(window.templates.carousel_item); 
    
            for (var i=0;i<images.length;i++) {
                var imagePath = images[i].url || images[i].path;
                html += temp({"imagePath": imagePath, 'imageid' : images[i].media_id});
            }
            imageArray.append(html);
    
        }
    };
    ListingForm.prototype.clear = function() 
    {
        if (this.menus) {
            var menus = Object.keys(this.menus);
            for(var i=0;i<menus.length;i++) {
                this.menus[menus[i]].reset();
            }
        }
        $('#listingFormDelete').hide();
        $('#imageArray').empty();
        this.clearInlineErrors();
        this.resetData();
    };
    ListingForm.prototype.resetData = function() 
    {
        this.data = {
            'id': 0,
            'blogs': this.blogId,
            'media_ids': ''
        };
    };
    ListingForm.prototype.deleteListing = function() 
    {

        return Acme.server.create('/api/article/delete-user-article', {"articleguid": this.data.guid}).done(function(r) {
            $('#listingFormClear').click();
            Acme.PubSub.publish('update_state', {'closeConfirm': ''});
            // Acme.PubSub.publish('update_state', {'userArticles': ''});

        }).fail(function(r) {
            // Acme.PubSub.publish('update_state', {'confirm': r});
            console.log(r);
        });
    };
    ListingForm.prototype.saveImage = function(r, data)
    {
        var newImageId = r.media.media_id;
        data.media_id = newImageId;
        var mediaids = [];
        if (this.data.media_ids != "") {
            mediaids = this.data.media_ids.split(',');
        }
        mediaids.push(newImageId);
        this.data.media_ids = mediaids.join(',');
        this.data.media_id = mediaids[0];

        this.renderImageThumbs([data]);
        return true;
    }
    ListingForm.prototype.deleteImage = function(data) 
    {
        var info = data['delete image'].confirmDeleteImage;
        var elem = info.elem;
        var id = info.id;
        elem.parent().remove();

        mediaids = this.data.media_ids.split(',');

        var index = mediaids.indexOf(id.toString());
        if (index > -1) {
            mediaids.splice(index, 1);
        }
        
        if (mediaids.length > 0) {
            this.data.media_id = mediaids[0];
            this.data.media_ids = mediaids.join(',');
        } else {
            this.data.media_id = '';
            this.data.media_ids = '-1';
        }

        // console.log(this.data.media_ids, this.data.media_id);
        Acme.PubSub.publish('update_state', {'closeConfirm': ''});

    };
    ListingForm.prototype.submit = function()
    {
        var validated = this.validate();
        if (!validated) {
            this.render();
            return;
        }

        this.data.theme_layout_name = this.layout;
        // console.log(this.data);
        Acme.server.create('/api/article/create', this.data).done(function(r) {
            $('#listingFormClear').click();
            Acme.PubSub.publish('update_state', {'confirm': r});
            Acme.PubSub.publish('update_state', {'userArticles': ''});
        }).fail(function(r) {
            Acme.PubSub.publish('update_state', {'confirm': r});
            console.log(r);
        });
    };
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
            var validated = self.validate([elemid]);
            self.render();
        });


        $('.uploadFileBtn').uploadFile({
               onSuccess: function(data, obj){

                    var resultJsonStr = JSON.stringify(data);

                    var postdata = {
                        'blogs' : self.blogId,
                        'imgData' : resultJsonStr
                    };

                    var outer = $("#uploadFileBtn");
                    var inner = $("#InnerUploadFileBtn");
                    inner.hide();
                    outer.addClass("spinner");

                    Acme.server.create('/api/article/save-image', postdata).done(function(r) {
                        // console.log(r);
                        if (self.saveImage(r, data) ) {
                            outer.removeClass("spinner");
                            inner.show();
                        }
                    }).fail(function(r) {
                        console.log(r);
                    });
                }
        });

        $('#imageArray').on('click', '.carousel-tray__delete', function(e) {
            var elem = $(e.target);
            var mediaId = elem.data('id');
            Acme.PubSub.publish('update_state', {'confirmDeleteImage': {elem:elem, id:mediaId}});
        });

        $('#listingFormClear').on('click', function(e) {
            $('#listingFormSubmit').text('SUBMIT');
            self.clear();
        });

        $('#listingFormDelete').on('click', function(e) {
            Acme.PubSub.publish('update_state', {'confirmDelete': ""});
        });

        $('#listingForm').submit(function(e) {
            e.preventDefault();
            self.submit();
        });
    }




Acme.JobForm = function(blogId, layout) {
    this.subscriptions = Acme.PubSub.subscribe({
        'Acme.jobForm.listener' : ['state_changed', 'update_state']
    });

    this.parent = ListingForm.prototype;

    this.errorFields = [];

    this.validateRules = {
        "title"                     : ["notEmpty"], 
        "content"                   : ["notEmpty"], 
        "extendedData.company"      : ["notEmpty"], 
        "extendedData.location"     : ["notEmpty"],
        "extendedData.region"       : ["notEmpty"],
        "extendedData.worktype"     : ["notEmpty"],
        "extendedData.contactname"  : ["notEmpty"],
        "extendedData.contactemail" : ["notEmpty"]
    };

    this.validateFields = Object.keys(this.validateRules);

    this.init(blogId, layout);
};
    Acme.JobForm.prototype = new ListingForm();
    Acme.JobForm.prototype.constructor=Acme.JobForm;
        Acme.JobForm.prototype.events = function() 
        {
            var self = this;
            this.parent.events.call(this);

            $('#listingclose').datetimepicker({
                format: "DD-MM-YYYY h:mm A",
                useCurrent: false,
                icons: {
                    time: "fa fa-clock-o",
                    date: "fa fa-calendar",
                    up: "fa fa-angle-up",
                    down: "fa fa-angle-down"
                },
                tooltips: {selectTime: ''}
            }).on('dp.change', function (e) {
                var data = {};
                data[e.target.name] = e.date.format('YYYY-MM-DD HH:mm');
                Acme.PubSub.publish("update_state", data);
            });

            $('#salary1').on('click', function(e) {
                $("#salaryRangeMenus").toggle();
                $("#hourlyRateInputs").hide();
            });
            $('#salary2').on('click', function(e) {
                $("#hourlyRateInputs").toggle();
                $("#salaryRangeMenus").hide();
            });
            $('#salary3').on('click', function(e) {
                $("#hourlyRateInputs").hide();
                $("#salaryRangeMenus").hide();
            });
        };

Acme.PropertyForm = function(blogId, layout) 
{
    this.subscriptions = Acme.PubSub.subscribe({
        'Acme.propertyForm.listener' : ['state_changed', 'update_state']
    });

    this.parent = ListingForm.prototype;

    this.errorFields = [];

    this.validateRules = {
        "title"                     : ["notEmpty"], 
        "content"                   : ["notEmpty"], 
        "extendedData.pricerange"   : ["notEmpty"], 
        "extendedData.region"       : ["notEmpty"],
        "extendedData.type"         : ["notEmpty"],
        "extendedData.contracttype" : ["notEmpty"],
        "extendedData.contactname"  : ["notEmpty"],
        "extendedData.contactphone" : ["notEmpty"]
    };

    this.validateFields = Object.keys(this.validateRules);

    this.init(blogId, layout);
};
    Acme.PropertyForm.prototype = new ListingForm();
    Acme.PropertyForm.prototype.constructor=Acme.PropertyForm;
        Acme.PropertyForm.prototype.events = function() 
        {
            var self = this;
            this.parent.events.call(this);

            $('#availability').datetimepicker({
                format: "DD-MM-YYYY",
                useCurrent: false,
                icons: {
                    time: "fa fa-clock-o",
                    date: "fa fa-calendar",
                    up: "fa fa-angle-up",
                    down: "fa fa-angle-down"
                },
                tooltips: {selectTime: ''}
            }).on('dp.change', function (e) {
                var data = {};
                data[e.target.name] = e.date.format('YYYY-MM-DD');
                Acme.PubSub.publish("update_state", data);
            });
        };

Acme.EventForm = function(blogId) 
{
    this.subscriptions = Acme.PubSub.subscribe({
        'Acme.eventForm.listener' : ['state_changed', 'update_state']
    });

    this.errorFields = [];

    this.validateRules = {
        "title"         : ["notEmpty"], 
        "content"       : ["notEmpty"], 
        "start_date"    : ["notEmpty"], 
    };

    this.validateFields = Object.keys(this.validateRules);

    this.blogId = blogId;

    this.data = {
        'id': 0,
        'blogs': this.blogId,
        'media_ids': '',
        'type': 'event'
    };

    this.events();
    this.events2();
};
    Acme.EventForm.prototype = new ListingForm();
    Acme.EventForm.prototype.constructor=Acme.EventForm;
    Acme.EventForm.prototype.listeners = 
    {
        "start_date" : function(data, topic) {
            this.data.start_date = data['start_date'];
        },
        "end_date" : function(data, topic) {
            this.data.end_date = data['end_date'];
        },
        "after" : function(data, topic) {
        }
    };
    Acme.EventForm.prototype.resetData = function() 
    {
        this.data = {
            'id': 0,
            'blogs': this.blogId,
            'media_ids': '',
            'type': 'event'
        };
    };
    Acme.EventForm.prototype.events2 = function() {

        $('#start_date, #end_date').datetimepicker({
            format: "DD-MM-YYYY h:mm A",
            useCurrent: false,
            icons: {
                time: "fa fa-clock-o",
                date: "fa fa-calendar",
                up: "fa fa-angle-up",
                down: "fa fa-angle-down"
            },
            tooltips: {selectTime: ''}
        }).on('dp.change', function (e) {
            var data = {};
            data[e.target.id] = e.date.format('YYYY-MM-DD HH:mm');
            if(data['start_date'] || data['end_date']) {
                $('#end_date').data("DateTimePicker").minDate(e.date);
                Acme.PubSub.publish("update_state", data);
            }
        });
    }








Acme.listing = Acme.Model.create({
    'url' : 'user'
});
    Acme.listing.subscriptions = Acme.PubSub.subscribe({
        'Acme.listing.listener' : [ "state_changed",
                                      "update_state"]
    });




Acme.listingCollectionClass = function(name, blogId) {
    this.blogId = blogId || "";
    this.name = name || "";
    this.listeners = {
        "userArticles" : function(data) {
            return this.fetch('/api/user/user-articles?userguid='+Acme.currentUser+'&blogs='+this.blogId+'&status=-1');
        }
    };
};
    Acme.listingCollectionClass.prototype = new Acme._Collection(Acme.listing);
    Acme.listingCollectionClass.prototype.constructor = Acme.listingCollectionClass;
    Acme.listingCollectionClass.subscriptions = Acme.PubSub.subscribe({
        'Acme.listingCollection.listener' : [ "update_state" ]
    });



Acme.listingViewClass = function() {
};
    Acme.listingViewClass.prototype = new Acme._View();

    Acme.listingViewClass.prototype.init =  function(blogId, type) {
        this.events();
        this.blogs = blogId;
        this.type = type || "";
    };
    Acme.listingViewClass.prototype.container = {
        'main' : $('#userListings')
    };
    Acme.listingViewClass.prototype.listeners = {
        "listingCollection" : function(data) {
            this.data = data.listingCollection.data;
            this.render();
        }
    };
    Acme.listingViewClass.prototype.events = function() 
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
                var status = card.data('status');
                Acme.server.fetch('/api/article/get-article?articleId='+articleId+"&status="+status).done(function(r) {
                    // console.log(r);
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
                        // console.log(extendedData);
                        data['extendedData'] = extendedData;
                    }

                    Acme.PubSub.publish('state_changed', {'user listing': data});
                });
            });


            $("#userlistingsrefresh").on('click',function(e) {
                Acme.PubSub.publish('update_state', {"userArticles":''});
            });
        }  
    },
    Acme.listingViewClass.prototype.render = function()
    {
        var container = this.container.main;
        var cardClass = "card-form-"+this.type+"-listing card-form-"+this.type+"-listing-tablet card-form-"+this.type+"-listing-mobile listingCard";

        var html = "";
        for (var i=0;i<this.data.length;i++) {
            html += window.Acme.cards.renderCard(this.data[i].data, cardClass, this.type + 'CardTemplate');
        }
        container.empty().append(html);

        $(".card .content > p, .card h2").dotdotdot();
    };

Acme.listingView = new Acme.listingViewClass();
    Acme.listingView.subscriptions = Acme.PubSub.subscribe({
        'Acme.listingView.listener' : ["state_changed", 'update_state']
    });






/***                      ****
  Dialog Confirmation Box
***                       ****/

Acme.Confirm = function(template, parent, layouts) {

    this.template = template;
    this.parentCont = parent;
    this.layouts = layouts;
    this.parent = Acme.modal.prototype;
    this.data = {};
};
    Acme.Confirm.prototype = new Acme.modal();
    Acme.Confirm.constructor = Acme.Confirm;
    Acme.Confirm.prototype.errorMsg = function(msg) {
        $('.message').toggleClass('hide');
    };
    Acme.Confirm.prototype.handle = function(e) {
        var self = this;
        this.parent.handle.call(this, e);
        var $elem = $(e.target);

        if ( $elem.is('a') ) {
            if ($elem.hasClass('close')) {
                $('body').removeClass("active");
                this.closeWindow();
            }
        }
        if ($elem.is('button')) {
            if ($elem.hasClass('signin')) {
                e.preventDefault();
                var formData = {};
                $.each($('#loginForm').serializeArray(), function () {
                    formData[this.name] = this.value;
                });
                Acme.server.create('/api/auth/login', formData).done(function(r) {
                    if (r.success === 1) {
                        window.location.href = location.origin;
                    } else {
                        self.errorMsg();
                    }
                }).fail(function(r) { console.log(r);});
            }


            if ($elem.hasClass('register')) {
                e.preventDefault();
                var formData = {};
                $.each($('#registerForm').serializeArray(), function () {
                    formData[this.name] = this.value;
                });

                if (formData['email'] !== '' && formData['name'] !== ''){
                    $.get( 'https://submit.pagemasters.com.au/ubt/submit.php?email='+encodeURI(formData['email'])+'&name='+encodeURI(formData['name']) );
                    $elem.addClass('spinner');
                    function close() {
                        self.closeWindow();
                    };
                    setTimeout(close, 2000);

                } else {
                    alert ("Please fill out all fields.");
                }
            }


            if ($elem.hasClass('forgot')) {
                e.preventDefault();
                var formData = {};
                $.each($('#forgotForm').serializeArray(), function () {
                    formData[this.name] = this.value;
                });

                Acme.server.create('/api/auth/forgot-password', formData).done(function(r) {
                    if (r.success === 1) {
                        location.reload();
                    } else {
                        self.errorMsg();
                    }

                }).fail(function(r) { console.log(r);});
            }

            if ($elem.hasClass('default-weather')) {
                var newDefault = Acme.State.Country + '/' + Acme.State.City;

                localStorage.setItem('city', newDefault);
                function close() {

                    Acme.PubSub.publish("update_state", {'localweather': newDefault });                

                    self.closeWindow();
                };
                setTimeout(close, 500);            
            }        

            if ($elem.data('role') === 'delete') {
                $elem.addClass("spinner");
                Acme.PubSub.publish("update_state", {'delete listing': "" });
            }

            if ($elem.data('role') === 'deleteImage') {
                // console.log('you want to delete an image???');
                // console.log(self.data);
                Acme.PubSub.publish("update_state", {'delete image': self.data });

                // $elem.addClass("spinner");
                // Acme.PubSub.publish("update_state", {'delete listing': "" });
            }


        }
        if ($elem.hasClass('layout')) {
            var layout = $elem.data('layout');
            this.renderLayout(layout);
        }
    };

var layouts = {
    "listing"  : 'listingSavedTmpl',
    "delete"   : 'listingDeleteTmpl',
};

Acme.confirmView = new Acme.Confirm('modal', 'signin', layouts);
    Acme.confirmView.subscriptions = Acme.PubSub.subscribe({
        'Acme.confirmView.listener' : ['update_state']
    });

    Acme.confirmView.listeners = 
    {
        "confirm" : function(data, topic) {
            this.render("listing", "Listing saved");
        },
        "confirmDelete" : function(data, topic) {
            this.render("delete", "Warning", { msg: "Are you sure you want to permanently delete this listing?", role:"delete"});
        },
        "confirmDeleteImage" : function(data, topic) {
            // console.log(data, topic);
            this.data = data;
            // console.log(this.data);
            this.render("delete", "Warning", 
                {
                     msg: "Are you sure you want to permanently delete this image?", 
                     role:"deleteImage"
                 }
            );
        },
        "closeConfirm" : function(data, topic) {
            this.closeWindow();
        }

    };


}(jQuery));