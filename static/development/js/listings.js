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
            console.log('FETCHING!!');
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





var Listing = function() {
    this.events();
};


Listing.prototype.events = function() 
{
    var self = this;
    console.log(_appJsConfig);
    // if(_appJsConfig.isUserLoggedIn === 1) {
        init();
    // }

    function init() {
        console.log('initing form thing');
        
        $('.uploadFileBtn').uploadFile({
               onSuccess: function(data, obj){
                    console.log(data);
                    var resultJsonStr = JSON.stringify(data);

                    var postdata = {
                        'blogs' : ["406b3a91-f4b3-4a97-b52b-82f601a5b93e"],
                        'imgData' : resultJsonStr
                    };

                    console.log('calling server for image');
                    
                    Acme.server.create('article/save-image', postdata).done(function(r) {
                        console.log(r);

                        var arrayid = $(obj).data('id');
                        var imageArray = $('#' + arrayid);
                        var media = imageArray.attr('data-media');
                        var mediaids = [];
                        if (media != "") {
                            mediaids = media.split(',');
                        }
                        var childCount = imageArray.children().length;
                        var imgContainer = '<div id="formimage'+childCount+'" class="formimage"></div>';
                        imageArray.append(imgContainer);
                        var newimageid = '#formimage'+childCount;
                        var newImage = $(newimageid);
                        newImage.css('background-image', 'url(' + data.url + ')');
                        newImage.attr('data-info', resultJsonStr);

                        mediaids.push(r.media.media_id);
                        imageArray.attr('data-media', mediaids);
                        $().General_ShowNotification({message: 'Image added successfully' });

                    }).fail(function(r) {
                        console.log(r);
                    });

                    
                }
        });

        $('#listingForm').submit(function(e) {
            e.preventDefault();
            var form = $(this);
            var address = form.find("#title");
            var content = form.find("#content");
            var imageArray = $('#imageArray');
            var data = {};
            data['id'] = 0;
            data['guid'] = "";
            data['blogs'] = ["406b3a91-f4b3-4a97-b52b-82f601a5b93e"]; 
            data['status'] = 'published';
            data['title'] = address.val();
            data['content'] = content.val();
            data['media_ids'] = imageArray.attr('data-media');
            if (data['media_ids'] != '') {
                data['media_id'] = data['media_ids'].split(',')[0];
            }
            var extendedData = [];
            $.each($('.articleExtendedData'), function (index, formField) {
                console.log(formField);
                formField = $(formField);
                if(formField.is("select")) {
                  var selectKey = formField.attr('name');
                  var selectVal =  formField.find("option:selected").val();
                  extendedData[selectKey] = selectVal;
                }
                else if(formField.is(":radio")) {
                  var radioKey = formField.attr('name');
                  var radioVal =  $("input[name='"+radioKey+"']:checked").val();
                  extendedData[radioKey] = radioVal;
                }
                else if(formField.is(":checkbox")) {
                    var checkboxKey =  formField.attr('name').slice(0, formField.attr('name').length - 2);
                    var checkElement = [];
                    $.each($("input[name='" + checkboxKey + "[]']:checked"), function (index, checkField) {
                        var checkboxVal = $(checkField).val();
                        checkElement.push(checkboxVal);
                    });
                  extendedData[checkboxKey] = checkElement;
                }
                else if(formField.is("ul")) {
                    var checkboxKey =  formField.data('key');
                    console.log(checkboxKey);
                    var checkElement = [];
                    var list = formField.find('li');
                    $.each(list, function (index, checkField) {
                        if ($(checkField).attr('checked') == 'checked') {
                            extendedData[checkboxKey] = $(checkField).data('value');
                            return;
                        }
                    });
                  
                }
                else {
                  var inputKey = formField.attr('name');
                  var inputVal =  formField.val();
                  extendedData[inputKey] = inputVal;
                }
            });

            data['extendedData'] = extendedData;
            console.log(data);

            if (data['title'] == "") {
                $.fn.General_ShowErrorMessage({message: "Article must have a title"});
            }
            if (data['content'] == "") {
                $.fn.General_ShowErrorMessage({message: "Article must contain content"});
            }
            Acme.server.create('article/create', data).done(function(r) {
                console.log('checking r');
                console.log(r);
            }).fail(function(r) {
                console.log(r);
            });
            console.log('submitting form');
        });
    }  

};



var regionMenu = new Acme.listMenu({
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
            'name'          : 'regionSelectMenu',
            'key'           : 'region'
}).init().render();

var propertyMenu = new Acme.listMenu({
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
            'name'          : 'propertySelectMenu',
            'key'           : 'type'

}).init().render();

var buyMenu = new Acme.listMenu({
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
            'name'          : 'buySelectMenu',
            'key'           : 'contracttype'
}).init().render();
