var paywallController = function() {
    return new Paywall();
}

var Paywall = function() {
    this.events();
};

Paywall.prototype.events = function() 
{
    var self = this;
    $('#subscribe').on('submit', function(e) {
        console.log('clicked');
    });
};