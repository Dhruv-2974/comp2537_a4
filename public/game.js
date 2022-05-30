const pokeapiUrl = "https://pokeapi.co/api/v2/";
const pokemonCardsActive = {};
firstCard = undefined;
secondCard = undefined;
cardFlipped = false;


function createPokeCardDeck(numOfPokemon, gridsize) {
    let arr = [];
    for (p = 0; p < numOfPokemon; p++) arr.push(Math.trunc(Math.random() * 900));
    while (arr.length < gridsize / 2) arr = arr.concat(arr);
    arr = arr.slice(0, gridsize / 2);
    arr = arr.concat(arr);
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * i);
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

async function createBoard() {
    const rows = parseInt($("#game-dims").val());
    const cols = rows == 6 ? 6 : 4;
    const numOfPokemon = parseInt($("#game-pokemons").val());

    $("#game-grid").empty();
    let pokemonList = createPokeCardDeck(numOfPokemon, rows * cols);
    for (let i = 0; i < rows * cols; i++) {
        await $.ajax({
            type: "GET",
            url: `${pokeapiUrl}pokemon/${pokemonList[i]}`,
            success: (pokemon) => {
                pokemonImage = pokemon.sprites.other["official-artwork"].front_default;
                $("#game-grid").append(
                    `
        <div class="game-card">
          <img class="card-face" id="card-${i}" src="${pokemonImage}" alt="" />
          <img class="card-cover" src="poke_card.png" alt="" />
        </div>
      `
                );
                pokemonCardsActive[`card-${i}`] = true;
            },
        });
    }
    $("#game-grid").css(
        "grid-template",
        `repeat(${rows}, 1fr) / repeat(${cols}, 1fr)`
    );
    $("#game-grid").css("aspect-ratio", `${cols}/${rows} `);
    $(".game-card").on("click", game);
}

function game() {

    // flip the card and disable all cards
    $(this).toggleClass("flip");
    $(".game-card").off("click");

    if (!cardFlipped) {
        firstCard = $(this).find(".card-face")[0];
        pokemonCardsActive[firstCard.id] = false;
        cardFlipped = true;
    } else {
        secondCard = $(this).find(".card-face")[0];
        $(`#${secondCard.id}`).parent().off("click", game);
        cardFlipped = false;

        if (
            $(`#${firstCard.id}`).attr("src") == $(`#${secondCard.id}`).attr("src")
        ) {

            pokemonCardsActive[firstCard.id] = false;
            pokemonCardsActive[secondCard.id] = false;
        } else {

            pokemonCardsActive[firstCard.id] = true;
            pokemonCardsActive[secondCard.id] = true;
            setTimeout(() => {
                $(`#${firstCard.id}`).parent().removeClass("flip");
                $(`#${secondCard.id}`).parent().removeClass("flip");
            }, 300);
        }
    }

    setTimeout(() => {
        for (const [key, value] of Object.entries(pokemonCardsActive)) {
            if (value) $(`#${key}`).parent().on("click", game);
        }
    }, 301);
}

function deactivateAllCards() {
    for (key of Object.keys(pokemonCardsActive)) {
        pokemonCardsActive[key] = false;
    }
}


function disableGameSettings() {
    $("#game-dims").prop("disabled", true);
    $("#game-pokemons").prop("disabled", true);
}


function setup() {
    createBoard();
    $("#game-dims").on("change", createBoard);
    $("#game-pokemons").on("change", createBoard);
}

$(document).ready(setup);