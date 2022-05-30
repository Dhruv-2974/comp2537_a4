type_g = ""
pokemon_name = ""
pokemon_photo = ""
pokemon_id = ""

button_code = "<button class = 'remove_class'> Remove me!</button>";


function find_photo(data) {
    pokemon_photo = data.sprites.other["official-artwork"].front_default;
    pokemon_name = data.name;
    pokemon_id = data.id;
}

async function find_list(pokemonTypeList) {
    console.log(pokemonTypeList)
    show_pokemon = ""

    pokemonList = pokemonTypeList.pokemon;

    for (i = 0; i < pokemonList.length; i++) {
        pokemon = pokemonList[i].pokemon.url;

        //        pokemon_name = pokemonList[i].pokemon.name

        if (i % 5 == 0) { // only when i= 1, 4, 7
            show_pokemon += `<div class="images_group">`
        }

        await $.ajax({
            type: "get",
            url: pokemon,
            success: find_photo
        })
        show_pokemon += `<div class='image_container'> <a href="/profile/${pokemon_id}"> ${pokemon_name} <img src="${pokemon_photo}"></a> </div>`
        //console.log(pokemonPhoto);
        if (i % 5 == 4) { // only when i= 3, 6, 9
            show_pokemon += `</div>`
        }
        //+ "<br>" + `<img src=${pokemonPhoto}>`
    }
    $("main").html(show_pokemon);

    console.log(pokemonList)
}

function processPokemonResp(data) {

    for (i = 0; i < data.results.length; i++) {
        if (type_g == data.results[i].name) {
            type_url = data.results[i].url;
        }
    }

    $.ajax({
        type: "get",
        url: type_url,
        success: find_list
    })

}

function find_type(type) {
    $("main").empty()
    type_g = type

    $.ajax({
        type: "get",
        url: `https://pokeapi.co/api/v2/type/`,
        success: processPokemonResp
    })
}

async function load_all() {
    show_pokemon = ""
    for (i = 1; i <= 100; i++) {
        // pokemon = pokemonList[i].pokemon.url;

        //        pokemon_name = pokemonList[i].pokemon.name

        if (i % 5 == 1) {
            show_pokemon += `<div class="images_group">`
        }

        await $.ajax({
            type: "get",
            url: `https://pokeapi.co/api/v2/pokemon/${i}`,
            success: find_photo
        })
        show_pokemon += `<div class='image_container'> <a href="/profile/${i}"> ${pokemon_name} <img src="${pokemon_photo}"></a> </div>`
        if (i % 5 == 0) {
            show_pokemon += `</div>`
        }
    }

    $("main").html(show_pokemon);

}

async function show_searched_pokemon(data) {
    $("main").empty(show_pokemon);

    console.log(data);
    show_pokemon = ""


    find_photo(data);

    show_pokemon += `<div class='image_container'> <a href="/profile/${pokemon_id}"> ${pokemon_name} <img src="${pokemon_photo}"></a> </div>`

    $("main").html(show_pokemon);

}

function search_pokemon() {

    nameOrID = $("#searchByNameOrID").val();

    history_remove = "<p>"+nameOrID  + button_code+"</p>"

    if (nameOrID == ""){
        load_all();
    }

    else{
    $.ajax(
        {
            "url": `https://pokeapi.co/api/v2/pokemon/${nameOrID}`,
            "type": "GET",
            "success": show_searched_pokemon
        }
    )}

    jQuery("#history").append(history_remove)


}

function hide_(){
    $(this).parent().remove();
}

function setup() {
    load_all()
    $("#pokemon_type").change(() => {
        poke_type = $("#pokemon_type option:selected").val();
        find_type(poke_type)
    })
    $("body").on("click", "#search", search_pokemon);
    jQuery('body').on('click','.remove_class',hide_)

}

$(document).ready(setup)