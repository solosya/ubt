Acme.Article = function() {
    this.events();
};


Acme.Article.prototype.lightbox = function(articleId)
{
    var csrfToken = $('meta[name="csrf-token"]').attr("content");
    var url = '/api/article/get-article';
    var payload = {articleId: articleId, _csrf: csrfToken}
    console.log(payload);
    Acme.server.fetch(_appJsConfig.appHostName + url, payload)
    .then(function(data) {
        
        data.templatePath = _appJsConfig.templatePath;

        var articleTemplate = Handlebars.compile(socialPostPopupTemplate);
        var article = articleTemplate(data);
        $('.modal').html(article);

        setTimeout(function () {
            $('.modal').modal('show');
        }, 500);

    });
}


Acme.Article.prototype.events = function() {
    var self = this;
    $('#LightboxArticlePageBtn').on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        // console.log($(e.target));
        var id = $(e.target).data('id');
        console.log(id);
        self.lightbox(id);
        return;
    });
    
};



