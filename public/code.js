to_add = ""
x = ""

function processPokeResp(data){
    console.log(data);

    to_add += `<div class="image_container">
    <a href="/profile/${x}">${data.name}
    <img src="${data.sprites.other["official-artwork"].front_default}"> </a></div>`
}

async function loadNineImages() {
    for (i = 1; i <= 9; i++) { // Nine times
        if (i % 3 == 1) { // only when i= 1, 4, 7
            to_add += `<div class="images_group">`
        }

        x = Math.floor(Math.random() * 890) + 1

        await $.ajax({
            type: "GET",
            url: `https://pokeapi.co/api/v2/pokemon/${x}`,
            success: processPokeResp
        })

            if (i % 3 == 0) { // only when i= 3, 6, 9
                to_add += `</div>`
            }
    }

    $("main").html(to_add)
}

function setup() {
    console.log("hi, document is ready")
    loadNineImages();
}


$(document).ready(setup)