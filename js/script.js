
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var streetString = $("#street").val();
    var cityString = $("#city").val();
    var addr = streetString + ", " + cityString;

    $greeting.text("So, you want to live at " + addr + "?");

    var streetviewURL = "http://maps.googleapis.com/maps/api/streetview?size=600x400&location="
    						+ addr + "";
    $body.append("<img class='bgimg' src='"+streetviewURL+"'>");

    //NYTIMES AJAX request

    var nytimesURL = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q="
    + cityString + "&sort=newest&api-key=5ef42faf14294c03981fdab4e83e602f";
    var articles;
    $.getJSON(nytimesURL, function(data){
    	$nytHeaderElem.text("NEW YORK TIMES ARTICLES ABOUT "+ cityString);
    	console.log(data);
    	articles = data.response.docs;
    	for(var i=0;i<articles.length;i++){
    		var article = articles[i];
    		$nytElem.append("<li class='article'>"+
    			'<a href="'+article.web_url+'">'+article.headline.main+
    			'</a>'+
    			'<p>' + article.snippet+'</p>'
    			+'</li>');
    	}
    }).error(function(e){
    	$nytHeaderElem.text("SOMETHING WENT WRONG !! NEW YORK TIMES ARTICLES COULD NOT BE LOADED");
    });

    //WIKIPEDIA AJAX

    var wikiUrl = 'http://en.wikipedia.org/w/api.php?format=json&action=opensearch&callback=wikiCallback&search="'+cityString+'"';

    var wikiRequestTimeout = setTimeout(function(){
    	$wikiElem.text("Failed to load wikipedia resources !!");
    },2000);

    $.ajax({
    	url : wikiUrl,
    	dataType : "jsonp",
    	success : function(response){
    		var articleList = response[1];

    		for(var i=0;i<articleList.length;i++){
    			articleStr = articleList[i];
    			var url = "http://en.wikipedia.org/wiki/"+articleStr;
    			$wikiElem.append("<li><a href='" + url +"'>"
    				+ articleStr + '</a></li>');
    		}
    		clearTimeout(wikiRequestTimeout);
    	}
    });
    return false;
};

$('#form-container').submit(loadData);
