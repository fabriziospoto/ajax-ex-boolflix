
$( document ).ready(function(e) {
    // RICHIAMO FUNZIONE DI RICERCA AL CLICK
    $('#search-btn').click(function(){
        $("#movie-details").html('');  //Pulisco valore #movie-details
        $("#tv-details").html('');  //Pulisco valore #tv-details

        init()  //Richiamo funzione film e Tv

        $('input').val('');  //Pulisco Input
    });
    // RICHIAMO FUNZIONE DI RICERCA PER INVIO
    $(document).keydown(function(e) {
        if (e.keycode == 13 || e.which == 13) {
            $("#movie-details").html('');
            $("#tv-details").html('');

            init()

            $('input').val('');
        }
    });
});

//**************FUNZIONI

function init() {
    var userInput = $('#input').val();  //Recupero valore input inserito da utente
    var url1 = "https://api.themoviedb.org/3/search/movie" //Var con Api film e tv
    var url2 = "https://api.themoviedb.org/3/search/tv"
    ricerca(userInput,url1,'Film');  //Richiamo Funzione Ricerca Film
    ricerca(userInput,url2,'TV');  //Richiamo Funzione Ricerca Tv
}

function ricerca(data,url,type) {  //Funzione unica per richiamo Api
    $.ajax(
        {
            url: url, //Indirizzo Api Film o Tv
            method: "GET",
            data: {
                api_key: "57d971dc9f1c534367f2c21507e580d4",
                query: data,  //Valore Input Utente
                language: "it-IT"
            },
            success: function(risposta) {  //Richiamo funzione per stampare a schermo informazioni film o serie più noResults
                if(risposta.total_results > 0) {
                    printResult(risposta.results, type);
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
    if (type == 'Film') {  //Uso Handlebars per recuperare struttura Film o Tv
        var source = $("#entry-template").html();
    } else {
        var source = $("#tv-template").html();
    }
    var template = Handlebars.compile(source);

    for (var i = 0; i < data.length; i++) {  //Richiamo titolo prodotto a seconda type sia Film o Tv
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
            original_language: flags(data[i].original_language),  //Funzione per icona bandiere
            vote_average: stars(data[i].vote_average), //Funzione per icone stelline
            poster_path: poster(data[i].poster_path),  //Funzione per locandine
            overview: data[i].overview.substring(0,249) + '[...]'  //Richiamo trama con limite 250 caratteri
        };
        var html = template(context);
        if (type == 'Film') {
            $('#movie-details').append(html);  //Se film appendo in #movie-details
        } else {
            $('#tv-details').append(html);  //Se tv appendo in #tv-details
        }
    }
}

function noResults(type) {   //Funzione nel caso non vi siano risultati
    var source = $("#no-results-template").html();
    var template = Handlebars.compile(source);
    var context = {
        noResults: 'Non ci sono risultati'
    };
    var html = template(context);
    if (type == 'Film') {
        $('#movie-details').append(html);  //Appendo no results in movie-details
    } else {
        $('#tv-details').append(html);  //Appendo no results in tv-details
    }
}

function stars(num) {
    var resto = num % 2;  //Ricavo decimali per mezze stelline
    var stella = Math.ceil(num/2); // Divido voto per due per evere voto su base 5
    var votoStella = '';
    for (var i = 0; i < 5; i++) {
        if (i < stella) {
            votoStella += '<i class="fas fa-star"></i>';  //Assegno tante stelline quanto è var = stella
        } else if (resto !=0){
            votoStella += '<i class="fas fa-star-half-alt"></i>';  //Se presente var = resto assegno mezza stella
        } else {
            votoStella += '<i class="far fa-star"></i>';  //Assegno stelle vuote
        }
    }
    return votoStella; //Ritorno voto stella con icone
}

function flags(elemento) {
    //***METODO 1
    // var language = ['en', 'it'];
    // if (language.includes(elemento)){
    //     return '<img src="img/' + elemento + '.png" id="flag">';
    // }
    // return elemento;

    //***METODO 2
    var bandiera = '';  //Se elemento corrisponde a it e en assegno bandiere corrispondenti
    if (elemento == 'it') {
        var bandiera = '<img src="img/it.png" id="flag" alt="Italian flag">';
    } else if (elemento == 'en') {
        var bandiera = '<img src="img/en.png" id="flag" alt="English flag">';
    } else {
        var bandiera = elemento;  //SE elemento corrisponde ad altra sigla lo lascio così com'è
    }
    return bandiera
}

function poster(loc) {
    if (loc == null) {  //Se non c'è locandina restituisco immagine salvata in cartella img
        return 'img/not-found.png';
    }
    return 'https://image.tmdb.org/t/p/w300' + loc;  //Se locandina è presente ricavo indirizzo completo da parziale + dato fornitomi da Api
}
