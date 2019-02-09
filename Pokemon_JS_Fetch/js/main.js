'use strict';
window.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("pokemon-wrapper")) {
        initInterface(document.getElementById("pokemon-wrapper"));
    }
});

function initInterface(domObj) {
    const wrapper = domObj;
    const url = "https://pokeapi.co/api/v2/pokemon/";
    initFetch(url);

    function initFetch(url) {
        fetch(url)
            .then(status)
            .then(parseJson)
            .catch(error => {
                alert(error);
            })
            .then(data => {
                operate(data);

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

    function operate(innData, recQnty=10) {
        let dataArr = innData["results"];
        let ul = wrapper.appendChild(document.createElement("ul"));
        for (let i = 0; i < recQnty; i++) {
            generateLink(dataArr[i],ul);
        }
    }

    function generateLink(obj, parent) {
        let li = parent.appendChild(document.createElement("li"));
        let link = li.appendChild(document.createElement("a"));
        let hash = "#" + obj.url.split("pokemon")[1].replace(/\//g,"");

        link.href = `detail.html${hash}`;
        link.textContent = obj.name[0].toUpperCase() + obj.name.slice(1);
    }
}

//////////////////DEV/////////////////////
function log(item) {
    console.log(item);
}

function ping(item) {
    console.log(item);
}