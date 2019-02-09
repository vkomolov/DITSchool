'use strict';
window.addEventListener("DOMContentLoaded", () => {
    if (location.hash) {
        initInterface(document.getElementById("pokemon-wrapper"));
    }
    else alert(`The page opens from "pokemon.html"`);

    function initInterface(domObj) {
        const wrapper = domObj;
        const h1 = wrapper.querySelector("h1");
        const hash = location.hash.slice(1);
        const url = `https://pokeapi.co/api/v2/pokemon/${hash}/`;

        initFetch(url);

        function initFetch(url) {
            fetch(url)
                .then(status)
                .then(parseJson)
                .catch(error => {
                    alert(error);
                })
                .then(data => {
                    h1.textContent += ` ${data.name}`;
                    initDomEl(data, wrapper);

                });

            function status(response) {
                if (response.status >= 200 && response.status < 300) { //if response.ok
                    return Promise.resolve(response);
                }
                else {
                    return Promise.reject(new Error(response.statusText));
                }
            }
            function parseJson(response) {
                return response.json();
            }
        }
    }
    function initDomEl(data, parent) {
        let ul = parent.appendChild(document.createElement("ul"));
        let liName = ul.appendChild(document.createElement("li"));
        liName.textContent = `Pokemon name: ${data.name}`;
        let liExp = ul.appendChild(document.createElement("li"));
        liExp.textContent = `Experience: ${data.base_experience}`;
        let liHeight = ul.appendChild(document.createElement("li"));
        liHeight.textContent = `Pokemon height: ${data.height}`;
        let liWeight = ul.appendChild(document.createElement("li"));
        liWeight.textContent = `Pokemon weight: ${data.weight}`;
    }
});

//////////////////DEV/////////////////////
function log(item) {
    console.log(item);
}

function ping() {
    console.log(true);
}