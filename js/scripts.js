let pokemonRepository = (function () {
    const pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

    function add(pokemon) {
        if (
            typeof pokemon === "object" &&
            "name" in pokemon
        ) {
            pokemonList.push(pokemon);
        } else {
            console.log("pokemon is not correct");
        }
    };

    function getAll() {
        return pokemonList
    };


    function addListItem(pokemon) {
        let pokemonList = document.querySelector('.pokemon-list')
        let listItem = document.createElement('li');
        let button = document.createElement('button');
        button.innerText = pokemon.name;
        button.classList.add('btn', 'btn-primary')
        button.setAttribute('data-target', '#exampleModal');
        button.setAttribute('data-toggle', 'modal');
        listItem.classList.add('list-group-item');
        listItem.appendChild(button);
        pokemonList.appendChild(listItem);
        // Event Listener that showDetails with a click
        button.addEventListener('click', function (event) {
            showDetails(pokemon);
        });
    };

    function loadList() {
        return fetch(apiUrl).then(function (response) {
            return response.json();
        }).then(function (json) {
            json.results.forEach(function (item) {
                let pokemon = {
                    name: item.name,
                    detailsUrl: item.url
                };
                add(pokemon);
            });
        }).catch(function (e) {
            console.error(e);
        })
    };

    function loadDetails(item) {
        let url = item.detailsUrl;
        return fetch(url).then(function (response) {
            return response.json();
        }).then(function (details) {
            // Now we add the details to the item
            item.imageUrl = details.sprites.front_default;
            item.height = details.height;
            item.types = details.types;
        }).catch(function (e) {
            console.error(e);
        });
    };

    let modalContainer = document.querySelector('#modal-container');

    function showModal(item) {
        
        let modalBody = $('.modal-body');
        let modalTitle = $('.modal-title');
        let modalHeader = $('.modal-header');

        modalTitle.empty();
        modalBody.empty();

        let nameElement = $('<h1>' + item.name + '</h1>');
        let imageElementFront = $('<img class=modal-img style=width:75%>');
        imageElementFront.attr('src', item.imageUrl);
        let srImage = $('<div class="sr-only sr-only-focusable">Image of this pokemon.</div>');
        let heightElement = $('<p>' + 'height: ' + item.height + '</p>');
        
        modalTitle.append(nameElement);
        modalBody.append(imageElementFront);
        modalBody.append(srImage);
        modalBody.append(heightElement);
        
    }


    function showDetails(item) {
        pokemonRepository.loadDetails(item).then(function () {
            showModal(item);
            console.log(item);
        });
    };

    return {
        add: add,
        getAll: getAll,
        addListItem: addListItem,
        loadList: loadList,
        loadDetails: loadDetails,
        showDetails: showDetails
    };
})();

pokemonRepository.loadList().then(function () {
    // Now the data is loaded
    pokemonRepository.getAll().forEach(function (pokemon) {
        pokemonRepository.addListItem(pokemon);
    });
});