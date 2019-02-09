window.addEventListener("DOMContentLoaded", () => {
    //using ES-6 maps, generators, distructions
    const buttonWrapper = new Map([["tagName", "div"], ["id", "button-block"]]);
    const buttonEl = new Map();
    buttonEl
        .set("tagName", "button")
        .set("class", "button")
        .set("textContent", "Button");
    const spanAlert = new Map([["tagName", "span"], ["class", "spanAlert"]]);
    const topWrapper = document.querySelector(".top-wrapper");

    if (topWrapper) {
        const buttonBlock = createDomEl(buttonWrapper, topWrapper);
        const buttonArr = [...funcsGenerator(createDomEl,[buttonEl, buttonBlock], 10)];
        buttonArr.forEach((elem, index) => {
            elem.addEventListener("click", () => {
                let span = createDomEl(spanAlert, elem);
                span.textContent = index;
                setTimeout(() => elem.removeChild(span), 500);
            });
        });
    }
});

////////////////FUNCTIONS
function* funcsGenerator(func, funcArgs, times) {
    for (let i = 0; i < times; i++) {
        yield func(...funcArgs);
    }
}

function createDomEl(map, parent="document.body") {
    if (map.constructor.name === "Map" && map.has("tagName")) { //the vital key for creating element in DOM
        let node = document.createElement(map.get("tagName"));
        for (let [key, value] of map) {
            if (key === "textContent") {
                node[key] = value;
            }
            if (key !== "tagName") {
                node.setAttribute(key, value);
            }
        }
        parent.appendChild(node);
        return node;
    }
    else throw new Error("no 'tagName' property in Object");
}

///DEV
function log(item) {
    console.log(item);
}
function ping() {
    console.log(true);
}