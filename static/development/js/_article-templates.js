/**
 * Handlebar Article templates for listing
 */

window.templates = {};
Handlebars.registerHelper('splitShift', function(text) {
  if (!text) return "";
  return text.split(" ")[0].toLowerCase();
});

Handlebars.registerHelper('draftStatus', function(text, date) {
    if (!text && !date) return "";
    if (!text) return "Posted " + date;
    if (!date) return "Pending Approval";
    return text.toLowerCase() === 'draft' ? "Pending Approval" : "Posted " + date; 
});

Handlebars.registerHelper('formatSalary', function(salaryType, hourlyRate) {
    var salaryPrefix = "";
    var salary = "";
    var domain = _appJsConfig.appHostName.split('.').reverse()[0];
    
    if (salaryType === "1") {
        salaryPrefix = "Salary ";
        salary = hourlyRate;
    } else if (salaryType == 2) {
        salaryPrefix = "Hourly rate ";
        salary = hourlyRate;
    } else if (salaryType == 3) {
        salaryPrefix = "Commission";
    }

    return salaryPrefix + salary
});

Handlebars.registerHelper('returnLoc', function(location, region) {
    
        return location +', ' + region;
});

Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});


window.templates.create_user = 
'<div class="" style="height:100%; overflow:auto"> \
    <div class="user-editor__input-container u-float-left"> \
        <input type="text" id="newuserfirstname" class="j-firstname user-editor__input" value="" placeholder="{{firstname}}"> \
        <input type="text" id="newuserlastname" class="j-lastname user-editor__input" value="" placeholder="{{lastname}}"> \
        <input type="text" id="newuserusername" class="j-username user-editor__input" value="" placeholder="{{username}} (between 5 and 15 characters)"> \
        <input type="text" id="newuseruseremail" class="j-email user-editor__input" value="" placeholder="{{useremail}}"> \
    </div> \
    <div id="user-editor-buttons" class="user-editor__input-container u-float-right"> \
        <a id="cancelUserCreate" class="userdetails__button userdetails__button--delete u-float-right"></a> \
        <a id="saveUser"       class="userdetails__button userdetails__button--save u-float-right">Save</a> \
    </div> \
</div>';


window.templates.edit_user = 
'<div class="" style="height:100%; overflow:auto"> \
    <div class="user-editor__input-container u-float-left"> \
        <input type="text" id="newuserfirstname" class="j-firstname user-editor__input" value="{{firstname}}" placeholder="First name"> \
        <input type="text" id="newuserlastname" class="j-lastname user-editor__input" value="{{lastname}}" placeholder="Last name"> \
        <input type="text" id="newuserusername" class="j-username user-editor__input" value="{{username}}" placeholder="Username (between 5 and 15 characters)"> \
        <input type="text" id="newuseruseremail" class="j-email user-editor__input" value="{{useremail}}" placeholder="Email"> \
    </div> \
    <div id="user-editor-buttons" class="user-editor__input-container u-float-right"> \
        <a id="cancelUserCreate" class="userdetails__button userdetails__button--delete u-float-right"></a> \
        <a id="saveUser"       class="userdetails__button userdetails__button--save u-float-right">Save</a> \
    </div> \
</div>';

window.templates.managed_user = 
'<div class="u-float-left"> \
    <p class="userdetails__name"> \
        <span class="j-firstname">{{firstname}}</span> \
        <span class="j-lastname">{{lastname}}</span> \
    </p> \
    <p class="j-username userdetails__username">{{username}}</p> \
</div>\
<a class="j-delete userdetails__button userdetails__button--delete u-float-right"></a> \
<a class="j-edit userdetails__button userdetails__button--edit u-float-right"></a> \
<p class="j-email  userdetails__email u-float-right">{{useremail}}</p>';

Acme.managed_user = 
'<li id="{{id}}" class="userdetails"> \
    <div class="u-float-left"> \
        <p class="userdetails__name"> \
            <span class="j-firstname">{{firstname}}</span> \
            <span class="j-lastname">{{lastname}}</span> \
        </p> \
        <p class="j-username userdetails__username">{{username}}</p> \
    </div>\
    <a class="j-delete userdetails__button userdetails__button--delete u-float-right"></a> \
    <a class="j-edit userdetails__button userdetails__button--edit u-float-right"></a> \
    <p class="j-email  userdetails__email u-float-right">{{email}}</p> \
</li>';


window.templates.carousel_item = 
'<li class="carousel-tray__item swap-images"> \
    <span data-id="{{imageid}}" class="carousel-tray__delete"></span> \
    <img class="carousel-tray__img" src="{{imagePath}}" /> \
</li>';

window.templates.ads_infinite = 
'<div class="advert"> \
    <div id="ajaxAd"></div> \
    <script>loadNextAd(invSpace,"ajaxAd","banner",bannerSize,bannerMap)</script> \
</div>';


window.templates.pulldown = 
'<div id="{{ name }}" class="Acme-pulldown {{class}}"> \
    <p class="Acme-pulldown__selected-item"></p> \
    <span class="Acme-pulldown__span"></span> \
    <ul class="Acme-pulldown__list" data-key="{{ key }}"></ul> \
</div>';

window.templates.spinner = 
'<div id="{{name}}" class="flex_col {{name}}"> \
    <div id="dialog"> \
        <div class="centerContent"> \
            <div class="head"> \
                <h2>{{title}}</h2> \
            </div> \
            <div class="dialogContent" id="dialogContent"></div> \
        </div> \
    </div> \
</div>';

window.templates.modal = 
// style="scrolling == unusable position:fixed element might be fixing login for ios safari
// also margin-top:10px
'<div id="signin" class="flex_col"> \
    <div id="dialog"> \
        <div class="centerContent" style="scrolling == unusable position:fixed element"> \
            <div class="head"> \
                <h2>{{{title}}}</h2> \
                <a class="close" href="#"></a> \
            </div> \
            <div class="dialogContent" id="dialogContent" style="scrolling == unusable position:fixed element"></div> \
        </div> \
    </div> \
</div>';




window.templates.spinnerTmpl = '<div class="spinner"></div>';


window.templates.listingSavedTmpl =  '<p>Thank you, your listing will be published in the next 24 hours</p><div><form><button class="_btn _btn--red">Okay</button></form></div>';
window.templates.listingDeleteTmpl =  
    '<p>{{msg}}</p> \
    <div> \
        <form> \
            <button class="_btn _btn--red" data-role="{{role}}">DELETE</button> \
            <button class="_btn _btn--gray">CANCEL</button> \
        </form> \
    </div>';

window.templates.subscribeTerms =  '<p>Please agree to the terms of use</p><div><form><button class="_btn _btn--red">Okay</button></form></div>';

window.templates.userPlanMessage = 
'<form name="loginForm" id="loginForm" class="active" action="javascript:void(0);" method="post" accept-charset="UTF-8" autocomplete="off"> \
     <button id="cancelbutton" class="_btn _btn--red close">OK</button> \
</form>';

window.templates.userPlanAuth = 
'<form name="loginForm" id="loginForm" class="active" action="javascript:void(0);" method="post" accept-charset="UTF-8" autocomplete="off"> \
    <button id="fix-auth" class="_btn _btn--red">Authenticate</button> \
    <button id="cancelbutton" class="_btn  close">Cancel</button> \
</form>';


window.templates.userPlanOkCancel = 
'<form name="loginForm" id="loginForm" class="active" action="javascript:void(0);" method="post" accept-charset="UTF-8" autocomplete="off"> \
     <button id="okaybutton" class="_btn _btn--red okay" data-role="okay">OK</button> \
     <button id="cancelbutton" class="_btn _btn--gray close" data-role="cancel">Cancel</button> \
</form>';


window.templates.userCancelPlan = 
'<form name="loginForm" id="loginForm" class="active" action="javascript:void(0);" method="post" accept-charset="UTF-8" autocomplete="off"> \
    <p class="u-font-bold">The frank team understands many of our valued <br />subscribers are facing hardship amid the <br />Covid-19 pandemic.</p> \
    <p>Please email hello@franknews.global to find out<br /> about options for continuing your subscription <br /> during this time.</p> \
    <p class="u-margin-bottom-25">Do you still wish to cancel your subscription?</p> \
    <button id="okaybutton" class="_btn _btn--gray okay u-margin-right-10" data-role="okay">YES, CANCEL NOW</button> \
    <button id="cancelbutton" class="_btn _btn--red close" data-role="cancel">DO NOT CANCEL</button> \
</form>';


window.templates.cancelSubscriptionTmpl = 
'<form name="loginForm" id="loginForm" class="active" action="javascript:void(0);" method="post" accept-charset="UTF-8" autocomplete="off"> \
    <p class="u-font-bold">Unsubscribed Successfully!</p>\
    <p>We\'re sorry to see you go.<br/>Please share the reason behind your cancellation</p>\
    <button id="okaybutton" class="_btn _btn--gray okay u-margin-right-10" data-role="okay">PROVIDE FEEDBACK</button> \
    <button id="cancelbutton" class="_btn _btn--red close" data-role="cancel">CANCEL</button> \
</form>';

window.templates.signinFormTmpl = 
// <script> tag possible ios safari login fix
'<form name="loginForm" id="loginForm" class="active" action="javascript:void(0);" method="post" accept-charset="UTF-8" autocomplete="off"> \
    \
    <input id="loginName" class="" type="text" name="username" placeholder="Username or email" value="" /> \
    <input id="loginPass" class="" type="password" name="password" placeholder="Password" value="" /> \
    \
    <div class="remember"> \
        <p class="layout" data-layout="forgot" class="">Forgot password</p> \
    </div> \
    \
    <div class="message active hide"> \
        <div class="account-modal__error_text">Invalid Username or Password</div> \
    </div> \
    \
    <button id="signinBtn" type="submit" class="_btn _btn--red signin">SIGN IN</button> \
    \
    <p class="u-no-margin u-margin-top-15 faq">Trouble signing in? <a class="faq__link" href="'+_appJsConfig.baseHttpPath +'/login-faq">Read our FAQ</a></p> \
    <script>$("#loginName").on("input", function() {window.scrollBy(0,1);window.scrollBy(0,-1);})</script>\
</form>';

window.templates.registerTmpl = 
'<form name="registerForm" id="registerForm" class="active" action="javascript:void(0);" method="post" accept-charset="UTF-8" autocomplete="off"> \
    \
    <input id="name" class="" type="text" name="name" placeholder="Name"> \
    <input id="email" class="" type="email" name="email" placeholder="Email"> \
    \
    <div class="message active hide"> \
        <div class="account-modal__error_text">Done!</div> \
    </div> \
    \
    <button id="signinBtn" type="submit" class="_btn _btn--red register">Register</button> \
</form>';


window.templates.forgotFormTmpl = 
'<form name="forgotForm" id="forgotForm" class="active" action="javascript:void(0);" method="post" accept-charset="UTF-8" autocomplete="off"> \
        <input type="hidden" name="_csrf" value="" /> \
        <p>Forgot your password? Enter your email below and we will send you a link to reset.</p> \
        <input id="email" class="" type="text" name="email" placehold="Email" value=""> \
        \
        <div class="remember"> \
            <p class="layout" data-layout="signin" class="">Remember password?</p> \
        </div> \
        \
        <div class="message active hide"> \
            <div class="account-modal__error_text">No user with that email found.</div> \
        </div> \
        \
        <button id="forgotBtn" type="submit" class="_btn _btn--red forgot">SEND EMAIL</button> \
    </form>';

window.templates.defaultWeatherTmpl = 
'<form name="registerForm" id="registerForm" class="active" action="javascript:void(0);" method="post" accept-charset="UTF-8" autocomplete="off"> \
    \
    <div id="country-dropdown"></div>\
    \
    <div id="weather-dropdown"></div>\
    \
    <div class="message active hide"> \
        <div class="account-modal__error_text">Done!</div> \
    </div> \
    \
    <button id="signinBtn" type="submit" class="_btn _btn--red default-weather">Save and Close</button> \
</form>';


var cardTemplateTop = 
'<div class="{{cardClass}} "> \
    <a  itemprop="url" \
        href="{{url}}" \
        class="card swap {{articleStatus}}" \
        data-id="{{articleId}}" \
        data-position="{{position}}" \
        data-status="{{articleStatus}}" \
        data-social="0" \
        data-article-image="{{{imageUrl}}}" \
        data-article-text="{{title}}"> \
        \
        <article class="">';

var cardTemplateBottom = 
        '</article>'+
        
        '{{#if userHasBlogAccess}}'+
            '<div class="btn_overlay articleMenu">'+
                '<button title="Hide" data-guid="{{guid}}" class="btnhide social-tooltip HideBlogArticle" type="button" data-social="0">'+
                    '<i class="fa fa-eye-slash"></i><span class="hide">Hide</span>'+
                '</button>'+
                '<button onclick="window.location=\'{{{editUrl}}}\'; return false;" title="Edit" class="btnhide social-tooltip" type="button">'+
                    '<i class="fa fa-edit"></i><span class="hide">Edit</span>'+
                '</button>'+
                '<button data-position="{{position}}" data-social="0" data-id="{{articleId}}" title="{{pinTitle}}" class="btnhide social-tooltip PinArticleBtn" type="button" data-status="{{isPinned}}">'+
                    '<i class="fa fa-thumb-tack"></i><span class="hide">{{pinText}}</span>'+
                '</button>'+
            '</div>'+
        "{{/if}}"+
    '</a>'+
'</div>';

Acme.jobCardTemplate = 
    cardTemplateTop + 
        '<div class="content"> \
            <div class="cat-time"> \
                <time datetime="{{publishDate}}">{{publishDate}}</time> \
                <div class="j-deleteListing edit"></div> \
            </div> \
            <h2 class="title">{{{ title }}}</h2> \
            <p class="company">{{{ additionalInfo.company }}}</p> \
            <p class="excerpt">{{{ excerpt }}}</p> \
        </div>' + 
    cardTemplateBottom;




Acme.communityJobCardTemplate = 
    cardTemplateTop + 
        '<div class="cat-time"> \
            <time datetime="{{publishDate}}">{{publishDate}}</time> \
        </div> \
        \
        <div class="content"> \
            <h2>{{ title }}</h2> \
            <p class="company">{{ additionalInfo.company }}</p> \
            \
            <p class="excerpt">{{{ excerpt }}}</p> \
        </div>' + 
    cardTemplateBottom;




Acme.propertyListingCardTemplate = 
    cardTemplateTop +  
        '{{#if hasMedia}} \
            <figure class="{{figureClass}}"> \
                <picture> \
                    <source media="(max-width: 620px)" srcset="{{imageUrl}}"> \
                    <img class="img-responsive" src="{{imageUrl}}" data-original="{{imageUrl}}"> \
                </picture> \
            </figure> \
        {{/if}} \
        \
        <div class="content"> \
            <div class="cat-time"> \
                <time datetime="{{publishDate}}">{{publishDate}}</time> \
            </div> \
            \
            <div class="property__left"> \
                <h1 class="price">{{ additionalInfo.pricerange }}</h1> \
                <h2>{{ title }}</h2> \
            </div> \
            \
            <div class="property__right"> \
                <p class="region">{{ returnLoc additionalInfo.location additionalInfo.region }}</p> \
                <p class="excerpt">{{{ excerpt }}}</p> \
            </div> \
            <div class="listing-type"> \
                <img class="listing-type__img" src="'+_appJsConfig.templatePath +'/static/icons/property/{{ splitShift additionalInfo.type }}.svg"> \
                <p class="listing-type__attribute listing-type__attribute--type">{{ additionalInfo.type }}</p> \
                <p class="listing-type__attribute listing-type__attribute--contract">{{ additionalInfo.contracttype }}</p> \
                <p class="region__below">{{ returnLoc additionalInfo.location additionalInfo.region }}</p> \
            </div> \
        </div>' +
    cardTemplateBottom;




Acme.userPropertyCardTemplate = 
    cardTemplateTop +  
        '{{#if hasMedia}} \
            <figure class="{{figureClass}}"> \
                <picture> \
                    <source media="(max-width: 620px)" srcset="{{imageUrl}}"> \
                    <img class="img-responsive" src="{{imageUrl}}" data-original="{{imageUrl}}"> \
                </picture> \
            </figure> \
        {{/if}} \
        \
        <div class="content"> \
            <div class="cat-time"> \
                <time datetime="{{publishDate}}">{{ draftStatus articleStatus publishDate }}</time> \
            </div> \
            <h2>{{ title }}, {{ returnLoc additionalInfo.location additionalInfo.region }}</h2> \
            <p class="propertyType">{{ additionalInfo.type }}</p> \
            <div> \
                <p class="contracttype">{{ additionalInfo.contracttype }}</p> \
                <p class="price">{{ additionalInfo.pricerange }}</p> \
            </div> \
        </div>' +
    cardTemplateBottom;

Acme.propertyCardTemplate = 
    cardTemplateTop +  
        '{{#if hasMedia}} \
            <figure class="{{figureClass}}"> \
                <picture> \
                    <source media="(max-width: 620px)" srcset="{{imageUrl}}"> \
                    <img class="img-responsive" src="{{imageUrl}}" data-original="{{imageUrl}}"> \
                </picture> \
            </figure> \
        {{/if}} \
        \
        <div class="content"> \
            <div class="cat-time"> \
                <time datetime="{{publishDate}}">{{ draftStatus articleStatus publishDate }}</time> \
                <div class="j-deleteListing edit"></div> \
            </div> \
            <h2 class="title">{{ title }}, {{ returnLoc additionalInfo.location additionalInfo.region }}</h2> \
            <p class="propertyType">{{ additionalInfo.type }}</p> \
            <div> \
                <p class="contracttype">{{ additionalInfo.contracttype }}</p> \
                <p class="price">{{ additionalInfo.pricerange }}</p> \
            </div> \
        </div>' +
    cardTemplateBottom;



Acme.communityPropertyCardTemplate = 
    cardTemplateTop +  
        '{{#if hasMedia}} \
            <figure class="{{figureClass}}"> \
                <picture> \
                    <source media="(max-width: 620px)" srcset="{{imageUrl}}"> \
                    <img class="img-responsive" src="{{imageUrl}}" data-original="{{imageUrl}}"> \
                </picture> \
            </figure> \
        {{/if}} \
        \
        <div class="content"> \
            <p class="region">{{ returnLoc additionalInfo.location additionalInfo.region }}</p> \
            <h1 class="price">{{ additionalInfo.pricerange }}</h1> \
            <h2>{{ params.articleTitle }}</h2> \
        </div>' +
    cardTemplateBottom;



Acme.systemCardTemplate = 
    cardTemplateTop + 
        '{{#if hasMedia}}\
            {{#if gifExtention}}\
                <figure>\
                    <video class="gif-video" autoplay loop muted playsinline>\
                        <source src="{{imageUrlMp4}}" type="video/mp4">\
                        <source src="{{imageUrlOgg}}" type="video/ogg">\
                    </video>\
                </figure>\
            {{else}}\
                <figure>\
                    <img class="img-responsive {{imgClass}}" data-original="{{imageUrl}}" src="{{imageUrl}}" {{imgBackgroundStyle}}">\
                </figure>\
            {{/if}} \
        {{/if}} \
        \
        <div class="content">\
            <div class="cat-time {{#ifCond blogTitle "!=" label}} cat-time--withLabel {{/ifCond}}">\
                {{#ifCond blogTitle "!=" label}}\
                    <p class="c-cards-view__labels">{{label}}</p>\
                {{/ifCond}}\
                <p class="category">{{blogTitle}}</p>\
                <time datetime="{{publishDate}}">{{publishDate}}</time>\
            </div>\
            <h2>{{{ title }}}</h2>\
            <p class="excerpt">{{{ excerpt }}}</p>\
            <div class="author">\
                <img src="{{profileImg}}" class="img-circle">\
                <p>{{ createdBy.displayName }}</p>\
            </div>\
        </div>' + 
    cardTemplateBottom;
                     




var socialCardTemplate =  
    '<div class="{{cardClass}}"> \
        <a href="{{social.url}}"\
            target="_blank"\
            class="card swap social {{social.source}} {{#if social.hasMedia}} withImage__content {{else }} without__image {{/if}} {{videoClass}}"\
            data-id="{{socialId}}"\
            data-position="{{position}}"\
            data-social="1"\
            data-article-image="{{{social.media.path}}}"\
            data-article-text="{{social.content}}">\
            <article class="">\
                {{#if social.hasMedia}}\
                    <figure class="{{videoClass}}">\
                        <img class="img-responsive" src="{{social.media.path}}" style="background-image:url(https://placeholdit.imgix.net/~text?txtsize=33&txt=Loading&w=450&h=250)">\
                    </figure>\
                {{/if}}\
                \
                <div class="content">\
                    <div class="category {{social.source}}">{{social.source}}</div>\
                    <p id="updateSocial{{article.socialId}}" data-update="0">{{{social.content}}}</p>\
                    <time datetime="2016-11-16"></time>\
                    <div class="author">\
                        <p class="">{{ social.user.name }}</p>\
                    </div>\
                </div>'+


                '{{#if userHasBlogAccess}}\
                    <div class="btn_overlay articleMenu">\
                        <button title="Hide" data-guid="{{social.guid}}" class="btnhide social-tooltip HideBlogArticle" type="button" data-social="1">\
                            <i class="fa fa-eye-slash"></i><span class="hide">Hide</span>\
                        </button>\
                        <button title="Edit" class="btnhide social-tooltip editSocialPost" type="button" data-url="/admin/social-funnel/update-social?guid={{blog.guid}}&socialguid={{social.guid}}">\
                        <i class="fa fa-edit"></i><span class="hide">Edit</span>\
                        </button>\
                        <button data-position="{{position}}" data-social="1" data-id="{{socialId}}" title="{{pinTitle}}" class="btnhide social-tooltip PinArticleBtn" type="button" data-status="{{isPinned}}">\
                            <i class="fa fa-thumb-tack"></i><span class="hide">{{pinText}}</span>\
                        </button>\
                    </div>\
                {{/if}}\
            </article>\
        </a>\
    </div>';


var socialPostPopupTemplate = 
'<div class="modal-content">'+
'<button type="button" class="close close__lg-modal" data-dismiss="modal" aria-label="Close">'+
        '<span aria-hidden="true">'+
            '<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">'+
                    '<title>Close</title>'+
                    '<g stroke-width="3" fill-rule="evenodd" stroke-linecap="round">'+
                            '<path d="M17.803 2L2 17.803M2.08 2.08l15.803 15.803"/>'+
                    '</g>'+
            '</svg>'+
            '<div class="close__text">esc</div>'+
        '</span>'+
    '</button>'+
    '<button type="button" class="close close__sm-modal" data-dismiss="modal" aria-label="Close">'+
        '<span aria-hidden="true">'+
                '<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Close</title><g stroke="#FFF" stroke-width="3" fill="none" fill-rule="evenodd" stroke-linecap="round"><path d="M17.803 2L2 17.803M2.08 2.08l15.803 15.803"/></g></svg>'+
        '</span>'+
    '</button>'+

    '<div class="social-modal__content {{blog.title}} {{#unless hasMedia}} no_image {{/unless}}">'+
                    '<div class="social-modal__channel social-modal__channel--technology ">{{blog.title}}</div>'+
                    '<div class="social-modal__overflow">'+

    '{{#if hasMedia}}'+
                        '<div class="social-modal__image_container">'+
                                '<div class="social-modal__image_wrap">'+
                                        '{{#if hasMediaVideo}}'+
                                                '<div class="social-modal__video-wrap">'+
                                                        '<iframe style="min-height:360px;width:100%;" src="{{media.videoUrl}}" frameborder="0" allowfullscreen></iframe>'+
                                                '</div>'+
                                        '{{else}}'+
                                                '<div class="social-modal__image" style="background-image: url(\'{{media.path}}\');" >'+
                                                        '<img class="social-modal__image_image" src="{{media.path}}" alt="" />'+
                                                '</div>'+
                                        '{{/if}}'+
                                '</div>'+
                        '</div>'+
    '{{/if}}'+

                    '<a href="{{url}}" target="_blank"><div class="social-modal__text"><br>{{{content}}}</div></a>'+
                    '</div>'+
                    '<div class="social-user">'+
                        '<span class="social-user__image" style="background-image: url(\'{{user.media.path}}\'); height: 56px; width: 56px; background-size: cover; display: inline-block; border-radius: 50%;"></span>'+
                        '<div class="social-user__author-wrap">'+
                            '<span class="social-user__author">@{{user.name}}</span>'+
                            '<div class="social-user__button-wrap">'+
                                ' <div class="button button-sm button__share button__share--borderless header_actions header_actions__share">'+
                                    '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'+
                                    '<svg width="13px" height="14px" viewBox="0 0 13 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'+
                                        '<title>Shape</title>'+
                                        '<desc>Created with Sketch.</desc>'+
                                        '<defs></defs>'+
                                        '<g id="Desktop" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">'+
                                            '<g id="Theme-3-Article---desktop" transform="translate(-1113.000000, -793.000000)" fill="#C0C2CA">'+
                                                '<g id="Article" transform="translate(215.000000, 216.000000)">'+
                                                    '<g id="Comments-Share" transform="translate(735.000000, 568.000000)">'+
                                                        '<g id="Share-button" transform="translate(151.000000, 0.000000)">'+
                                                            '<path d="M22.0625,18.3333333 C21.5305808,18.3333333 21.0420077,18.5150222 20.650499,18.8174222 L16.6106375,16.3818889 C16.6309173,16.2572889 16.6442308,16.1302 16.6442308,16 C16.6442308,15.8694889 16.6309173,15.7427111 16.6106375,15.6179556 L20.650499,13.1824222 C21.0420077,13.4851333 21.5305808,13.6666667 22.0625,13.6666667 C23.3447721,13.6666667 24.3846154,12.6218 24.3846154,11.3333333 C24.3846154,10.0448667 23.3447721,9 22.0625,9 C20.7802279,9 19.7403846,10.0448667 19.7403846,11.3333333 C19.7403846,11.4635333 19.7536981,11.5906222 19.7742875,11.7152222 L15.734426,14.1507556 C15.3429173,13.8483556 14.8543442,13.6666667 14.3221154,13.6666667 C13.0398433,13.6666667 12,14.7115333 12,16 C12,17.2884667 13.0398433,18.3333333 14.3221154,18.3333333 C14.8543442,18.3333333 15.3429173,18.1518 15.734426,17.8490889 L19.7742875,20.2846222 C19.7536981,20.4093778 19.7403846,20.5361556 19.7403846,20.6666667 C19.7403846,21.9551333 20.7802279,23 22.0625,23 C23.3447721,23 24.3846154,21.9551333 24.3846154,20.6666667 C24.3846154,19.3782 23.3447721,18.3333333 22.0625,18.3333333 L22.0625,18.3333333 Z" id="Shape"></path>'+
                                                        '</g>'+
                                                    '</g>'+
                                                '</g>'+
                                            '</g>'+
                                        '</g>'+
                                    '</svg>'+
                                    ' Share'+
                                    '<div class="share-popup" style="right: -166px;">'+
                                        '<input type="text" name="share-link" value="{{url}}" readonly class="share-popup__share-link share-link">'+
                                        '<div class="share-popup__social-wrap">'+
                                            '<div class="social-icon_wrap--colored">'+
                                                '<a href="https://plus.google.com/share?url={{url}}" target="_blank"><i class="fa fa-google-plus"></i></a>'+
                                                '<a href="http://www.facebook.com/sharer/sharer.php?u={{url}}" target="_blank" ><i class="fa fa-facebook"></i></a>'+
                                                '<a href="http://twitter.com/intent/tweet?status={{url}}" target="_blank"><i class="fa fa-twitter"></i></a>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
    '</div>'+
 '</div>'   ;   