(function () {
    var main = document.querySelector("main");
    var clockIcon = document.querySelector(".clockIcon"); //clock on Header

    if (clockIcon) {
        var clockIconSpan = clockIcon.appendChild(document.createElement("span")); //digital time
        clockIconSpan.style.fontSize = "14px";
    }
    else {
        alert("no Dom Element with class 'clockIcon'");
        return;
    }

    clockIcon.addEventListener("click", function() {
        clock.open();
    });

    ////////////CLOCK///////////////

    var clock = {};
    clock.clockWrapper = {};
    clock.clockWrapper.node = "";
    clock.clockWrapper.attr = {"class":"clock-wrapper"};
    clock.closeBttn = {};
    clock.closeBttn.node = ""; //button to close clock
    clock.closeBttn.attr = {"class":"close-bttn"};
    clock.closeBttn.innerHTML = "X";
    clock.clockInn = {};
    clock.clockInn.node = "";
    clock.clockInn.attr = {"id":"clock"};
    clock.clockInn.innerHTML = "<img src='./images/hour.png' alt='hour' class='clock__array'>"+
        "<img src='./images/min.png' alt='minute' class='clock__array'>"+
        "<img src='./images/sec.png' alt='second' class='clock__array'>";

    clock.dateSec = "";
    clock.dateMin = "";
    clock.dateHour = "";
    clock.hourPr = "";
    clock.minPr = "";
    clock.sec = "";
    clock.min = "";
    clock.hour = "";

////////////METHODS//////////////////////
    clock.createDom = function (object, tagName) {
        var obj = object;
        if ("node" in obj) {
            //log("node" in obj);
            obj.node = document.createElement(tagName);
            //log("created div: " + obj.node.localName);
            if ("attr" in obj) {
                for (elem in obj.attr) {
                    obj.node.setAttribute(elem, obj.attr[elem]);
                }
            }
            if ("innerHTML" in obj) {
                obj.node.innerHTML = obj.innerHTML;
            }
        }
        else {
            alert("No 'node' in object");
        }
    };

    clock.sync = function() {
        var date = new Date();
        clock.dateSec = date.getSeconds();
        clock.dateMin = date.getMinutes();
        clock.dateHour = date.getHours();
        clock.hourPr = clock.dateHour;
        clock.minPr = clock.dateMin;
        clock.sec = clock.dateSec*6;
        clock.min = clock.dateMin*6;
        clock.hour = (clock.dateHour > 12) ? (clock.dateHour-12)*30 : clock.dateHour*30;

        if (clock.dateHour < 10) {
            clock.hourPr = "0" + clock.dateHour;
        }
        if (clock.dateMin < 10) {
            clock.minPr = "0" + clock.dateMin;
        }
        clockIconSpan.innerHTML = clock.hourPr + "<span class='blink'>&#58;</span>" + clock.minPr;

        setInterval(clock.sync, 60000);
    };

    clock.toggleClass = function (class1, class2) {    //if "off" then "on"
        if (clock.clockWrapper.node.classList.contains(class1)) {
            clock.clockWrapper.node.classList.replace(class1, class2);
        }
        else if (clock.clockWrapper.node.classList.contains(class2)) { //if "on" then "off"
            clock.clockWrapper.node.classList.replace(class2, class1);
        }
        else {
            clock.clockWrapper.node.classList.add(class2);  //if first opening (no "off" and "on") then "on"
        }
    };

    clock.run = function() {
        clock.secNode.style.transform = "rotate(" + clock.sec + "deg)";
        clock.minNode.style.transform = "rotate(" + clock.min + "deg)";
        clock.hourNode.style.transform = "rotate(" + clock.hour + "deg)";

        clock.sec += 6;
        //log(clock.sec);

        if (clock.sec === 366) {
            clock.sec = 0;
            clock.sec += 6;
            clock.min += 6;
        }
        if (clock.min === 366) {
            clock.min = 0;
            clock.min += 6;
            clock.hour += 30;
        }
        if (clock.hour === 366) {
            clock.hour = 0;
            clock.hour += 30;
        }
    };

    clock.open = function () {
        if (!clock.clockWrapper.node.parentNode && clock.clockWrapper.node === "") { //if not exist in DOM and first time?
            clock.createDom(clock.clockWrapper, "div");
            clock.createDom(clock.clockInn, "div");
            clock.clockWrapper.node.appendChild(clock.clockInn.node);
//setting closeButton
            clock.createDom(clock.closeBttn, "div");
            clock.clockWrapper.node.appendChild(clock.closeBttn.node);

            /*clock.clockWrapper.closeBttn.node = clock.clockWrapper.node.appendChild(document.createElement("span"));*/
            /*clock.clockWrapper.closeBttn.node.setAttribute("class", "close-bttn");*/
           /* clock.clockWrapper.closeBttn.node.textContent = "[X]";*/
///setting drag n drop
            clock.clockWrapper.node.onmousedown = function (point) {
                if (point.which !== 1) {
                    return;
                }
                clock.drag(point);
            };

            clock.closeBttn.node.addEventListener("click", clock.close);

            clock.hourNode = clock.clockInn.node.firstElementChild;     //!important line 30
            clock.minNode = clock.clockInn.node.firstElementChild.nextSibling;
            clock.secNode = clock.clockInn.node.lastElementChild;

            clock.run();
            setInterval(clock.run, 1000);

            clock.toggleClass("scaleDownZero", "scaleUpZero");
            document.body.appendChild(clock.clockWrapper.node);

            clock.clockWrapper.node.style.left = document.documentElement.clientWidth / 2 - clock.clockWrapper.node.offsetWidth / 2 + "px";
            clock.clockWrapper.node.style.top = document.documentElement.clientHeight / 2 - clock.clockWrapper.node.offsetHeight / 2 + "px";
        }
        else if (!clock.clockWrapper.node.parentNode && clock.clockWrapper.node !== "") {
            clock.toggleClass("scaleDownZero", "scaleUpZero");
            document.body.appendChild(clock.clockWrapper.node);
            //centering clock in the visible area of the page
            clock.clockWrapper.node.style.left = document.documentElement.clientWidth / 2 - clock.clockWrapper.node.offsetWidth / 2 + "px";
            clock.clockWrapper.node.style.top = document.documentElement.clientHeight / 2 - clock.clockWrapper.node.offsetHeight / 2 + "px";
        }
        else {
            clock.close();
        }
    };

    clock.close = function () {
        clock.toggleClass("scaleDownZero", "scaleUpZero");
        setTimeout(function () {
            clock.clockWrapper.node.parentNode.removeChild(clock.clockWrapper.node);
            clock.clockWrapper.node.style.top = ""; //resetting abs position of the object
            clock.clockWrapper.node.style.left = "";
        },400);
    };

    clock.drag = function(point) {
        var dragged = clock.clockWrapper.node;
        dragged.style.transform = "none"; //switching off the popup effect

        if (point.target === clock.closeBttn.node) {  //restricting closeButton area from moving action
            return false;
        }

        var coords = getCoords(dragged);
        var shiftX = point.pageX - coords.left;
        var shiftY = point.pageY - coords.top;

        /*document.body.appendChild(dragged); //absolute repositionning to document.body*/
        moveAt(point);

        document.onmousemove = function(point) {
            document.ondragstart = function () {
                return false;
            };
            moveAt(point);
        };

        dragged.onmouseup = function() {
            document.onmousemove = null;
            dragged.onmouseup = null;
        };

        function getCoords(elem) {      //getting object of coords
            var block = elem.getBoundingClientRect();
            return {
                top: block.top + pageYOffset,
                left: block.left + pageXOffset
            };
        }

        function moveAt(point) {
            var newLeft = point.pageX - shiftX;
            var newTop = point.pageY - shiftY;
            var newBottom = newTop + dragged.offsetHeight;
            var newRight = newLeft + dragged.offsetWidth;

            if (newLeft < 20) {
                newLeft = 20;
            }
            if (newRight > document.documentElement.clientWidth - 20) {
                newLeft = document.documentElement.clientWidth - 20 - calculator.node.offsetWidth;
            }
            if (newTop < 20) {
                newTop = 20;
            }

           /* var height = Math.max(document.body.scrollHeight, document.body.offsetHeight,
                document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);*/
            var height = document.documentElement.clientHeight; //limiting dragging in visible area

            if (newBottom > height - 20) {
                newTop = height - dragged.offsetHeight - 20;
            }

            dragged.style.left = newLeft + "px";
            dragged.style.top = newTop + "px";
        }
    };

    clock.sync(); //switching time on the clock icon
})();