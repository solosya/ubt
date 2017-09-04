var ListingController = function() {
    return new Listing();
}

var Listing = function() {
    console.log('construnctor');
    this.events();
};




Listing.prototype.events = function() 
{
    console.log('events loading for listings');
    var self = this;

    if(_appJsConfig.isUserLoggedIn === 1 && _appJsConfig.userHasBlogAccess === 1) {
        init();
    }

    function init() {
        console.log('initing');
        $('#listingForm').submit(function(e) {
            e.preventDefault();
            var form = $(this);
            var address = form.find("#address");
            var data = {};
            data['id'] = 0;
            data['guid'] = "";
            data['address'] = address.val();
            data['address'] = address.val();
            data['blogs'] = ["110"]; 
            data['status'] = 'draft';
            data['title'] = 'Property Listing YEAH!!';
            data['content'] = 'Some good details right here';
            console.log(data);
            app.server.create(_appJsConfig.appHostName + '/api/article/save-article', data).done(function(r) {
                console.log('checking r');
                console.log(r);
            });
            console.log(app.server);
            console.log('submitting form');
        });
    }  

};