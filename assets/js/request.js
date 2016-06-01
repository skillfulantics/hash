/****************
GLOBAL FUNCTIONS
*****************/

// change numbers to weekday
function weekDay(object) {
  if (object.match(/[a-z]/i)) {
    return object;
  } else {
    object = object * 1000;
  }

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
  if (object.match(/[a-z]/i)) {
    object = object;; 
  } else {
    object = object * 1000;
  }

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

/****************
FETCH INSTA/TWITTER POSTS
*****************/

function getTags(count, max, hashtag) {

  // access token for instagram
  var instaToken = '3274259718.520c083.a5e03fb27e50489ca733d7b19dbb90bb';
  
  // urls to be pushed in
  var twitterUrl = 'proxy.php?url='+encodeURIComponent('search/tweets.json?q=%23' + hashtag + '&count=' + count + '&result_type=recent');
  var instaUrl = 'https://api.instagram.com/v1/tags/' + hashtag + '/media/recent?&access_token=' + instaToken + '&count=' + count + '&callback=?';
  
  // twitter call    
  $.getJSON(twitterUrl, function(response, data){
    console.log(response);
    $.each(response.statuses, function( i, item ){
      // object variables
      var tweetID = this.id;
      var tweetUserPic = this.user.profile_image_url;
      var tweetText = this.text.split('http')[0].replace(RegExp('#' + hashtag, "gi"), '<strong>#' + hashtag.charAt(0).toUpperCase() + hashtag.slice(1) + '</strong>');
      var tweetName = this.user.name;
      var tweetDay = weekDay(this.created_at).substr(0,3);
      var tweetTime = formatTime(this.created_at);
      var listText = '<li id="' + tweetID + '" class="twitter card card--' + i + '">';

      listText += '<div class="card-left"><img class="img img--' + i + '" src="' + tweetUserPic.replace("normal", "bigger") + '"/></div>';
      listText += '<div class="card-right"><div class="card-meta"><span class="name name--' + i + '">' + tweetName + '</span>';
      listText += '<span class="date date--' + i + '"> ' + tweetDay + ' ' + tweetTime + '</span></div>';
      listText += '<p class="text text--' + i + '">' + tweetText + '</p>';

      if (typeof this.entities.media != 'undefined') {
        listText += '<img class="media" src = "' + this.entities.media[0].media_url + '"/></div></li>';
      } else {
        listText += '</div></li>';
      }

      if ($('.card').is('#' + tweetID)) {
        return true;
      } else if ($('#card-list > *').length === max) {
        $(listText).css("opacity", "0").prependTo('#card-list').toggleClass('animate');
        $('#card-list li:last').remove();
      } else {
        $('#card-list').append(listText);
      };
    });
  });

  //instagram call
  // $.getJSON(instaUrl, function(response, data){
  //   console.log(response);
  //   $.each(response.data, function( i, item ){
  //     // object variables
  //     var instaID = this.id;
  //     var instaUserPic = this.user.profile_picture;
  //     var instaText = this.caption.text.replace(RegExp('#' + hashtag, "gi"), '<strong>#' + hashtag.charAt(0).toUpperCase() + hashtag.slice(1) + '</strong>');
  //     var instaName = this.user.username;
  //     var instaDay = weekDay(this.caption.created_time).substr(0,3);
  //     var instaTime = formatTime(this.caption.created_time);
  //     var instaPic = this.images.standard_resolution.url;
  //     var listText = '<li id="' + instaID + '" class="instagram card card--' + i + '">';

  //     listText += '<div class="card-left"><img class="img width="73" height="73" img--' + i + '" src="' + instaUserPic + '"/></div>';
  //     listText += '<div class="card-right"><div class="card-meta"><span class="name name--' + i + '">' + instaName + '</span>';
  //     listText += '<span class="date date--' + i + '"> ' + instaDay + ' ' + instaTime + '</span></div>';
  //     listText += '<p class="text text--' + i + '">' + instaText + '</p>';
  //     listText += '<img class="media" src = "' + instaPic + '"/></div></li>';
      
  //     if ($('.card').is('#' + instaID)) {
  //       return true;
  //     } else if ($('#card-list > *').length === max) {
  //       $(listText).css("opacity", "0").prependTo('#card-list').toggleClass('animate');
  //       $('#card-list li:last').remove();
  //     } else {
  //       $('#card-list').prepend(listText);
  //     };
  //   });
  // });
}

/****************
we are go for launch, cap'n
*****************/

// pushing the big red button
getTags(6, 6, 'dropyourexcuse');

// repeatedly pushing the big red button
setInterval(function(){
  getTags(1, 6, 'dropyourexcuse');
}, 6000);