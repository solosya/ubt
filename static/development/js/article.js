Acme.Article = function() {
    this.events();
};


Card.prototype.lightbox = function(elem)
{
    var csrfToken = $('meta[name="csrf-token"]').attr("content");
    var url = '/api/article/get-article';
    var articleId = elem.data('id');
    var payload = {articleId: articleId, _csrf: csrfToken}

    Acme.Server.fetch(_appJsConfig.appHostName + url, payload)
    .then(function(r) {
        data.hasMediaVideo = false;
        if (data.media['type'] === 'video') {
            data.hasMediaVideo = true;
        }1
        
        if (data.source == 'youtube') {
            var watch = data.media.videoUrl.split("=");
            data.media.videoUrl = "https://www.youtube.com/embed/" + watch[1];
        }
        
        data.templatePath = _appJsConfig.templatePath;

        var articleTemplate = Handlebars.compile(socialPostPopupTemplate);
        var article = articleTemplate(data);
        $('.modal').html(article);

        setTimeout(function () {
            $('.modal').modal('show');
        }, 500);

    });
}


Acme.Article.protoptype.events = function() {
    
    $('.LightboxArticleBtn').on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var parentElement = $(this).parent().parent();
        self.lightbox(parentElement);
        return;
    });
    
};


