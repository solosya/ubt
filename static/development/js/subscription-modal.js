(function ($) {
  Acme.cancelSubscription = function (template, parent, layouts) {
    this.template = template;
    this.parentCont = parent || null;
    this.layouts = layouts || null;
    this.parent = Acme.modal.prototype;
  };
  Acme.cancelSubscription.prototype = new Acme.modal();
  Acme.cancelSubscription.constructor = Acme.cancelSubscription;
  Acme.cancelSubscription.prototype.errorMsg = function (msg) {
    $(".message").removeClass("hide");
  };
  Acme.cancelSubscription.prototype.handle = function (e) {
    var self = this;
    var $elem = this.parent.handle.call(this, e);

    if ($elem.is("a")) {
      if ($elem.hasClass("close")) {
        e.preventDefault();
        $("body").removeClass("active");
        this.closeWindow();
      }
    }
    if ($elem.is("button")) {
      $(".message").addClass("hide");
      if ($elem.hasClass("close")) {
        $("body").removeClass("active");
        this.closeWindow();
      }
    }

    if ($elem.hasClass("close")) {
      $("body").removeClass("active");
      this.closeWindow();
      var url = window.location.href;
      window.location.href = url.split("?")[0];
    }

    if ($elem.hasClass("layout")) {
      var layout = $elem.data("layout");
      this.renderLayout(layout);
    }
  };

  var layouts = {
    cancel_subscription: "cancelSubscriptionTmpl",
  };
  Acme.cancelSubscriptionView = new Acme.cancelSubscription(
    "modal",
    "signin",
    layouts
  );
})(jQuery);
