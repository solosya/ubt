(function ($) {


Acme.Signin = function(template, parent, layouts) {
    this.template = template;
    this.parentCont = parent;
    this.layouts = layouts;
    this.parent = Acme.modal.prototype;
};
Acme.Signin.prototype = new Acme.modal();
Acme.Signin.constructor = Acme.Signin;
Acme.Signin.prototype.errorMsg = function(msg) {
    $('.message').toggleClass('hide');
};
Acme.Signin.prototype.handle = function(e) {
    var self = this;
    var $elem = this.parent.handle.call(this, e);
    if ( $elem.is('img') ) {
        if ($elem.hasClass('close')) {
            this.closeWindow();
        }
    }
    if ($elem.is('button')) {
        if ($elem.hasClass('signin')) {
            e.preventDefault();
            var formData = {};
            $.each($('#fogotForm').serializeArray(), function () {
                formData[this.name] = this.value;
            });
            console.log(formData);
            Acme.server.create('/api/auth/login', formData).done(function(r) {
                if (r.success === 1) {
                    location.reload();
                } else {
                    self.errorMsg();
                }
            }).fail(function(r) { console.log(r);});
        }

        if ($elem.hasClass('forgot')) {
            e.preventDefault();
            var formData = {};
            $.each($('#forgotForm').serializeArray(), function () {
                formData[this.name] = this.value;
            });
            console.log(formData);
            Acme.server.create('/api/auth/forgot-password', formData).done(function(r) {
                console.log(r);
                if (r.success === 1) {
                    location.reload();
                } else {
                    self.errorMsg();
                }

            }).fail(function(r) { console.log(r);});
        }

    }
    if ($elem.hasClass('layout')) {
        var layout = $elem.data('layout');
        console.log(layout);
        this.renderLayout(layout);
    }
};

var layouts = {
    "signin"   : 'signinFormTmpl',
    "register" : 'registerTmpl',
    "forgot"   : 'forgotFormTmpl',
    "expired"  : 'expiredNotice'
}
var signin = new Acme.Signin('modal', 'signinFormTmpl', layouts);

$('#header_login_link').on('click', function() {
    signin.render("signin");
});






}(jQuery));