
$( document ).ready(function(e) {

    $('#search-btn').click(function(){
        //reset()
        $("#movie-details").html('');
        $("#tv-details").html('');

        var userInput = $('#input').val();
        var url1 = "https://api.themoviedb.org/3/search/movie"
        var url2 = "https://api.themoviedb.org/3/search/tv"
        ricerca(userInput,url1,'Film');
        ricerca(userInput,url2,'TV');

        $('input').val('');
    });

    $(document).keydown(function(e) {
        if (e.keycode == 13 || e.which == 13) {
            //reset()
            $("#movie-details").html('');
            $("#tv-details").html('');

            var userInput = $('#input').val();
            var url1 = "https://api.themoviedb.org/3/search/movie"
            var url2 = "https://api.themoviedb.org/3/search/tv"
            ricerca(userInput,url1,'Film');
            ricerca(userInput,url2,'TV');

            $('input').val('');
        }
    });
});

//**************FUNZIONI

function ricerca(data,url,type) {
    $.ajax(
        {
            url: url,
            method: "GET",
            data: {
                api_key: "57d971dc9f1c534367f2c21507e580d4",
                query: data,
                language: "it-IT"
            },
            success: function(risposta) {
                if(risposta.total_results > 0) {
                    printResult(risposta.results, type);
                    // printResult(risposta.results, 'TV');
                } else if (type == 'TV'){
                    var elementi = $('#movie-details').html();
                    if (elementi == '') {
                        noResults(type);
                    }
                }
            },
            error: function() {
                alert('Attenzione! Errore.');
            }
        }
    )
}

function printResult(data, type) {
    if (type == 'Film') {
        var source = $("#entry-template").html();
    } else {
        var source = $("#tv-template").html();
    }
    // var source = $("#entry-template").html();
    var template = Handlebars.compile(source);

    for (var i = 0; i < data.length; i++) {
        if(type == 'Film') {
            var title = data[i].title;
            var original_title = data[i].original_title;
        } else if (type == 'TV') {
            var title = data[i].name;
            var original_title = data[i].original_name;
        }
        var context = {
            tipo: type,
            titolo: title,
            original_title: original_title,
            original_language: flags(data[i].original_language),
            vote_average: stars(data[i].vote_average),
            poster_path: poster(data[i].poster_path)
        };
        var html = template(context);
        if (type == 'Film') {
            $('#movie-details').append(html);
        } else {
            $('#tv-details').append(html);
        }
    }
}

function noResults(type) {
    var source = $("#no-results-template").html();
    var template = Handlebars.compile(source);
    var context = {
        noResults: 'Non ci sono risultati'
    };
    var html = template(context);
    if (type == 'Film') {
        $('#movie-details').append(html);
    } else {
        $('#tv-details').append(html);
    }
}

function stars(num) {
    var resto = num % 2;
    //var votoCinque = num / 2;
    var stella = Math.ceil(num/2);
    var votoStella = '';
    for (var i = 0; i < 5; i++) {
        if (i < stella) {
            votoStella += '<i class="fas fa-star"></i>';
        } else if (resto !=0){
            votoStella += '<i class="fas fa-star-half-alt"></i>';
        } else {
            votoStella += '<i class="far fa-star"></i>';
        }
    }
    return votoStella;
}

function flags(elemento) {
    //***METODO 1
    // var language = ['en', 'it'];
    // if (language.includes(elemento)){
    //     return '<img src="img/' + elemento + '.png" id="flag">';
    // }
    // return elemento;

    //***METODO 2
    var bandiera = '';
    if (elemento == 'it') {
        var bandiera = '<img src="img/it.png" id="flag" alt="Italian flag">';
    } else if (elemento == 'en') {
        var bandiera = '<img src="img/en.png" id="flag" alt="English flag">';
    } else {
        var bandiera = elemento;
    }
    return bandiera
}

function poster(loc) {
    if (loc == null) {
        return 'img/not-found.png';
    }
    return 'https://image.tmdb.org/t/p/w300' + loc;
}

// function reset() {
//     //$('#movie-details').val('')
//     $('#movie-details').html('');
//     $('#input').val('');
// }
