jQuery(document).ready(function ($) {

  // change numbers to weekday
  function weekDay(object) {
    var d = new Date(object);
    var weekday = new Array(7);
    weekday[0]=  "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    var n = weekday[d.getDay()];
    return n;
  }

  // change time to 12hr format
  function formatTime(object) {
    var d = new Date(object);
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

    // ajax call
  function getTweets(count, max, hashtag) {    
    // url to be pushed in
    var url = 'proxy.php?url='+encodeURIComponent('search/tweets.json?q=%23' + hashtag + '&count=' + count + '&result_type=recent'); 
    $.getJSON(url, function(response, data, jqXHR){
      console.log(response);
      $.each(response.statuses, function( i, item ){
        //check if there's a picture
        function checkPicture(object) {
          if (typeof object != 'undefined') {
            listText += '<img class="media" src = "' + object[0].media_url + '"/></div></li>'
          } else {
            return;
          }
        }
        // object variables
        var tweetID = this.id;
        var tweetUserPic = this.user.profile_image_url;
        var tweetText = this.text.split('http')[0].replace(RegExp('#' + hashtag, "gi"), '<strong>#' + hashtag.charAt(0).toUpperCase() + hashtag.slice(1) + '</strong>');
        var tweetName = this.user.name;
        var tweetDay = weekDay(this.created_at).substr(0,3);
        var tweetTime = formatTime(this.created_at);
        var listText = '<li id="' + tweetID + '" class="card card--' + i + '">';

        console.log(i);

        listText += '<div class="card-left"><img class="img img--' + i + '" src="' + tweetUserPic.replace("normal", "bigger") + '"/></div>';
        listText += '<div class="card-right"><div class="card-meta"><span class="name name--' + i + '">' + tweetName + '</span>';
        listText += '<span class="date date--' + i + '"> ' + tweetDay + ' ' + tweetTime + '</span></div>';
        listText += '<p class="text text--' + i + '">' + tweetText + '</p>';
        checkPicture(this.entities.media);
        
        if ($('.card').is('#' + tweetID)) {
          return true;
        } else if ($('#card-list > *').length === max) {
          $(listText).css("opacity", "0").prependTo('#card-list').toggleClass('animate');
          $('#card-list li:last').remove();
        } else {
          $('#card-list').prepend(listText);
        };
      });
    });
  }

  getTweets(6, 6, 'trump');

  setInterval(function(){
    getTweets(1, 6, 'trump');
  }, 6000);

});