(function ($) {


Acme.Signin = function(template, parent){
    this.template = template;
    this.parentCont = parent;
    this.parent = Acme.modal.prototype;
    console.log('created new signning');
};
Acme.Signin.prototype = new Acme.modal();
Acme.Signin.constructor = Acme.Signin;
Acme.Signin.prototype.events = function(e) {
    this.parent.events.call(this);

    $('#signinBtn').on("click", function(e) {
        e.preventDefault();
        var formData = {};
        var password = 
        $.each($('#loginForm').serializeArray(), function () {
            console.log(this);
            formData[this.name] = this.value;
        });
        console.log($("#loginName").val());
        formData['username'] = $("#loginName").val();
        formData['password'] = $("#loginPass").val();
        console.log(formData);
        // Acme.server.create('/api/auth/login', formData).done(function(r) {
        //     location.reload();
        // }).fail(function(r) {
        //     console.log(r);
        // });

    });
};
Acme.Signin.prototype.handle = function(e) {
    var $elem = this.parent.handle.call(this, e);
    if ( $elem.is('img') ) {
        if ($elem.hasClass('close')) {
            this.closeWindow();
        }
    }
};

var signin = new Acme.Signin('signinForm', '#signin');

$('#header_login_link').on('click', function() {
    signin.render();
})
// loginForm






}(jQuery));