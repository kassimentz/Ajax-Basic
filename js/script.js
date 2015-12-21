
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

    // YOUR CODE GOES HERE!
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var adress = streetStr + ', ' + cityStr;

    $greeting.text('Então, você deseja morar em '+ adress + '?');

    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + adress + '';

    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');

    // NY Tymes code

    var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q='+cityStr+'&sort=newest&api-key=88899a35d77206c5b8ca58e332c6fb1f:8:73818039';
    //console.log(nytimesUrl);
    $.getJSON(nytimesUrl, function (data){

        //console.log(data);
        
        $nytHeaderElem.text('Artigos do New York Times Sobre ' + cityStr);
        articles = data.response.docs;
        for(var i = 0; i < articles.length; i++ ){
            var article = articles[i];
            $nytElem.append('<li class=article">'+
                '<a href="'+article.web_url+'">'+article.headline.main+'</a>'+
                '<p>' + article.snippet + '</p>' + 
                '</li>');
        };
    }).error(function(e){
        $nytHeaderElem.text('Artigos do New York Times não puderam ser carregados.')
    });

     //Wikipedia AJAX

    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';

    console.log(wikiUrl);
    
    var wikiRequestTimout = setTimeout(function(){
        $wikiElem.text("falha ao obter recursos da wikipedia");
    }, 8000);

    $.ajax({
        
        url: wikiUrl,
        dataType: "jsonp",
        //jsonp: "callback",
        success: function(response){
            console.log(response);
            var articleList = response[1];

            for (var i = 0; i < articleList.length; i++ ){
                
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' +
                    articleStr + '</a></li>');

            };

            clearTimeout(wikiRequestTimout);
        }
    });

    return false;
};

$('#form-container').submit(loadData);
