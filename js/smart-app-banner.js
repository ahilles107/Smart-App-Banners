if (!window.localStorage) {
  window.localStorage = {
    getItem: function (sKey) {
      if (!sKey || !this.hasOwnProperty(sKey)) { return null; }
      return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
    },
    key: function (nKeyId) {
      return unescape(document.cookie.replace(/\s*\=(?:.(?!;))*$/, "").split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[nKeyId]);
    },
    setItem: function (sKey, sValue) {
      if(!sKey) { return; }
      document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
      this.length = document.cookie.match(/\=/g).length;
    },
    length: 0,
    removeItem: function (sKey) {
      if (!sKey || !this.hasOwnProperty(sKey)) { return; }
      document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      this.length--;
    },
    hasOwnProperty: function (sKey) {
      return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    }
  };
  window.localStorage.length = (document.cookie.match(/\=/g) || window.localStorage).length;
}

var origHtmlMargin = parseFloat($('html').css('margin-top'));

$(function() {
  var iPad = navigator.userAgent.match(/iPad/i) != null; // Check if using an iPad
  var iPhone = navigator.userAgent.match(/iPhone/i) != null; // Check if using an iPhone
  var safari = $.browser.safari; // Check if using Safari
  var standalone = navigator.standalone;
  var appBannerID = $('meta[name=tw-apple-itunes-app]').attr("content"); //Check if using smart app banners
  if (!standalone && safari) { safari = false}; //Chrome is just a re-skinning of iOS WebKit UIWebView
  if (appBannerID != null) {
    appBannerID = appBannerID.replace('app-id=','');
    if (true/*(iPad || iPhone) && (!safari)*/ && (!bannerIsClosed())) {
      $.getJSON('http://itunes.apple.com/lookup?id=' + appBannerID + '&callback=?', function(json) {
        if (json != null) {
          var artistName, artistViewUrl, artworkUrl60, averageUserRating, formattedPrice, trackCensoredName, averageUserRatingForCurrentVersion;
          artistName = json.results[0].artistName;
          artistViewUrl = json.results[0].artistViewUrl;
          artworkUrl60 = json.results[0].artworkUrl60;
          averageUserRating = json.results[0].averageUserRating;
          formattedPrice = json.results[0].formattedPrice;
          averageUserRatingForCurrentVersion = json.results[0].averageUserRatingForCurrentVersion;
          trackCensoredName = json.results[0].trackCensoredName;

          var banner = '<div class="smart-banner">';
          banner += '<a href="#" id="swb-close" onclick="closeSmartBanner()">X</a>';
          banner += '<img src="' + artworkUrl60 + '" alt="" class="smart-glossy-icon" />';
          banner += '<div id="swb-info"><strong>' + trackCensoredName + '</strong>';
          banner += '<span>' + artistName + '</span>';
          banner += '<span class="rating-static rating-' + averageUserRating.toString().replace(".", "") + '"></span>';
          banner += '<span>' + formattedPrice + '</span></div>';
          banner += '<a href="' + artistViewUrl + '" id="swb-save">VIEW</a></div>';

          $('body').append(banner);
          $('.smart-banner').stop().animate({top:0},300);
          $('html').animate({marginTop:origHtmlMargin+78},300);
        }
      });
    }
  }
});

function closeSmartBanner() {
  $('.smart-banner').stop().animate({top:-82},300);
  $('html').animate({marginTop:origHtmlMargin},300);

  localStorage.setItem('tw-close-smart-app-banner', 'true');
}

function bannerIsClosed() {
  if (localStorage.getItem('tw-close-smart-app-banner') === 'true') {
    return true;
  }

  return false;
}