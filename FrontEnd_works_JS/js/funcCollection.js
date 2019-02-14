window.addEventListener("DOMContentLoaded", function () {
    if (document.querySelector("#header__saying")) {    //querySelector returns true/false (not getElements..)
        var lightText = new LightingText("header__saying", 3);
        lightText.getLetters();
        lightText.lightOn(lightText.lightOnClassNorm, lightText.lightOnClassLow);
        //arrangeNavItems(".nav-wrapper__list"); //СДЕЛАТЬ ВКЛЮЧЕНИЕ ЭЛЕМЕНТОВ В MENU ЧЕРЕЗ arrangeNavItems()
    }

    if (document.querySelector(".slider-wrapper")) {
        var heroSlider = new Slider("slider-wrapper", "slide-radio__input-label", 3, "prev", "next");
        heroSlider.initSlider();
    }

    if (document.getElementsByClassName("flex-box__item_task-block").length !== 0) {
        initTaskBlocks();
    }
});

//////////////////////////////////////FUNCTION COLLECTION/////////////////////////////////////

function initTaskBlocks() {     //making equal height to 'p' elements of all taskblocks. !equalCols located in global
    var taskBlockArr = document.getElementsByClassName("flex-box__item_task-block");
    var textElArr = []; //array of 'p' elements in taskBlockArr for equalCols() of 'p' heights
    var errorArr = []; //will compile errors

    for (var i = 0; i < taskBlockArr.length; i++) {
        if (taskBlockArr[i].querySelector("p")) {
            textElArr.push(taskBlockArr[i].querySelector("p"));
        }
        else {
            alert("no 'p' element in taskBlock:" + i);
            return;
        }

        if (taskBlockArr[i].querySelector(".button.submit")) {
            taskBlockArr[i].querySelector(".button.submit").addEventListener("click", function (ev) {
                renderBlock(ev.currentTarget);
            });
        }
        else {
            alert("no button with '.button.submit' in taskBlock: " + i);
            return;
        }
    }
    equalCols(textElArr);   //making heights of taskblocks equal

    function renderBlock(submitButton) {
        var submitBttn = submitButton;
        var taskVar = submitBttn.dataset.task;    //data-task attribute of the submit button
        var taskBlock = submitBttn.parentElement;
        var heading = taskBlock.querySelector("h2");
        var textP = taskBlock.querySelector("p");
        var taskBoard = null;                       //the object, constructed by new TaskContainer

        if (!document.getElementById("popup-block")) {
            taskBoard = new TaskContainer();
            taskBoard.open();
            taskBoard.listen();
        }
        else {
            log("taskBoard already exists");
        }
        function TaskContainer() {
            var self = this;
            this.wrapper = {
                "node" : null,
                "attr" : {"id" : "popup-block"}
            };
            this.closeBttn = {
                "node" : null,
                "attr" : {"class" : "close-bttn"},
                "innerHTML" : "X"
            };
            this.heading = {
                "node" : null,
                "innerHTML" : heading.innerHTML
            };
            this.taskText = {
                "node" : null,
                "innerHTML" : textP.innerHTML
            };
            this.inputBlock = {
                "node" : null,
                "task" : {
                    "task1" : "<div class=\"input_block\">\n" +
                    "             <input type=\"text\" name=\"number\" placeholder=\"От 1 до 9\"\n" +
                    "                    title=\"Введите количество элементов массива\" maxlength=\"1\" class=\"input_block__input\" required>\n" +
                    "             <span>Ввести число</span>\n" +
                    "          </div>\n" +
                    "          <div class=\"result-block\">\n" +
                    "             <h3>Будет сгенерирован массив из введенного количества элементов</h3>\n" +
                    "             <table id=\"result-table\">\n" +
                    "                <caption></caption>\n" +
                    "                <tr>\n" +
                    "                    <th>Результат</th><th>Время (мс)</th>\n" +
                    "                </tr>\n" +
                    "                <tr>\n" +
                    "                    <td colspan=\"2\">Использование метода arr.reverse()</td>\n" +
                    "                </tr>\n" +
                    "                <tr>\n" +
                    "                    <td id=\"solution1\"></td><td id=\"solution1-time\"></td>\n" +
                    "                </tr>\n" +
                    "                <tr>\n" +
                    "                    <td colspan=\"2\">Копирование обратным циклом в новый массив через .push</td>\n" +
                    "                </tr>\n" +
                    "                <tr>\n" +
                    "                    <td id=\"solution2\"></td><td id=\"solution2-time\"></td>\n" +
                    "                </tr>\n" +
                    "                <tr>\n" +
                    "                    <td colspan=\"2\">Замена крайних значений до середины через отдельную переменную</td>\n" +
                    "                </tr>\n" +
                    "                <tr>\n" +
                    "                    <td id=\"solution3\"></td><td id=\"solution3-time\"></td>\n" +
                    "                </tr>\n" +
                    "                <tr>\n" +
                    "                    <td colspan=\"2\">Создание нового массива через newArr[i] = arr[arr.length - 1 - i];</td>\n" +
                    "                </tr>\n" +
                    "                <tr>\n" +
                    "                    <td id=\"solution4\"></td><td id=\"solution4-time\"></td>\n" +
                    "                </tr>\n" +
                    "                <tr>\n" +
                    "                    <td colspan=\"2\">Применение цикла arr.forEach(function(item, i, array) и нового массива</td>\n" +
                    "                </tr>\n" +
                    "                <tr>\n" +
                    "                    <td id=\"solution5\"></td><td id=\"solution5-time\"></td>\n" +
                    "                </tr>\n" +
                    "            </table>\n" +
                    "        </div>",
                    "task2" : "<form name=\"formText\" id=\"formText\" class=\"flex-box around\">\n" +
                    "              <div>\n" +
                    "                  <div class=\"input_block\">\n" +
                    "                      <input type=\"text\" name=\"searchText\" placeholder=\"Искомое слово\"\n" +
                    "                             title=\"Введите искомое слово\" class=\"input_block__input\" required>\n" +
                    "                      <span>Поиск</span>\n" +
                    "                  </div>\n" +
                    "                  <div class=\"input_block\">\n" +
                    "                      <input type=\"text\" name=\"changeText\" placeholder=\"Заменить на ...\"\n" +
                    "                             title=\"На что меняем слово\" class=\"input_block__input\" required>\n" +
                    "                      <span>Замена на ...</span>\n" +
                    "                  </div>\n" +
                    "              </div>\n" +
                    "              <div class=\"button reset\" data-type = \"reset\">Reset</div>\n" +
                    "              <div class=\"textarea-wrapper rel\">\n" +
                    "                  <div class=\"abs-top-left\">\n" +
                    "                      <span id=\"formText__comments\" class=\"formText__span\">Comments of the actions</span>\n" +
                    "                  </div>\n" +
                    "                  <div class=\"abs-top-right\">\n" +
                    "                      <span id=\"formText__span-length\" class=\"formText__span\">1110 chars</span>\n" +
                    "                      <span id=\"formText__span-found\" class=\"formText__span\">1000 found</span>\n" +
                    "                  </div>\n" +
                    "                  <div class=\"textarea-container\">\n" +
                    "                      <textarea name=\"formTextArea\" title=\"Введите текст\" maxlength=\"1110\"></textarea>\n" +
                    "                      <div id=\"ps-textarea\"></div>\n" +
                    "                  </div>\n" +
                    "              </div>\n" +
                    "         </form>",
                    "task3" : "<form name=\"reg_driver\" id=\"form-regDriver\" action=\"#\" method=\"post\" enctype=\"multipart/form-data\">\n" +
                    "                    <h3>Регистрация Водителя</h3>\n" +
                    "                    <div class=\"flex-box center end\">\n" +
                    "                        <div class=\"flex-box__item_2-3 flex-box center padding_top_2em rel\">\n" +
                    "                            <span id=\"recordSpan\"></span>\n" +
                    "                            <div class=\"inl_block\">\n" +
                    "                                <div class=\"regDriver__image-wrapper\" title=\"Загрузить фото\" data-type=\"fload\">\n" +
                    "                                    <input type=\"file\" name=\"inputUserPhoto\">\n" +
                    "                                    <input type=\"reset\" name=\"resetForm\">\n" +
                    "                                </div>\n" +
                    "                                <div class=\"button submit\" data-type=\"autofill\" title=\"Автозаполнение формы\">Заполнить</div>\n" +
                    "                            </div>\n" +
                    "                            <div class=\"flex-box_column center\">\n" +
                    "                                <div class=\"input_block\">\n" +
                    "                                    <input type=\"text\" name=\"driverName\" placeholder=\"Имя Водителя\"\n" +
                    "                                           title=\"Введите имя\" maxlength=\"15\" class=\"input_block__input\" required>\n" +
                    "                                    <span>Имя Водителя</span>\n" +
                    "                                </div>\n" +
                    "                                <div class=\"input_block\">\n" +
                    "                                    <input type=\"text\" name=\"driverSurname\" placeholder=\"Фамилия водителя\"\n" +
                    "                                           title=\"Введите фамилию\" maxlength=\"15\" class=\"input_block__input\" required>\n" +
                    "                                    <span>Фамилия Водителя</span>\n" +
                    "                                </div>\n" +
                    "                                <div class=\"input_block\">\n" +
                    "                                    <input type=\"text\" name=\"driverExperience\" placeholder=\"Стаж\"\n" +
                    "                                           title=\"Введите стаж водителя\" maxlength=\"2\" class=\"input_block__input\" required>\n" +
                    "                                    <span>стаж Водителя (лет)</span>\n" +
                    "                                </div>\n" +
                    "                                <div class=\"switch-block\" title=\"Пол Водителя?\">\n" +
                    "                                    <input type=\"radio\" name=\"gender\" value=\"male\" class=\"reg-form__radio reg-form__radio_m\" checked>\n" +
                    "                                    <input type=\"radio\" name=\"gender\" value=\"female\" class=\"reg-form__radio reg-form__radio_f\">\n" +
                    "                                    <span class=\"switch\"></span>\n" +
                    "                                </div>\n" +
                    "                            </div>\n" +
                    "                        </div>\n" +
                    "                        <div class=\"flex-box__item_1-3 push-top_2em\">\n" +
                    "                            <fieldset>\n" +
                    "                                <legend>Регистрация Авто</legend>\n" +
                    "                                <div class=\"inl_block\">\n" +
                    "                                    <div class=\"input_block\">\n" +
                    "                                        <input type=\"text\" name=\"carManuf\" placeholder=\"Производитель\"\n" +
                    "                                               title=\"Введите Производителя\" maxlength=\"15\" " +
                    "                                               class=\"input_block__input\" required>\n" +
                    "                                        <span>Производитель</span>\n" +
                    "                                    </div>\n" +
                    "                                    <div class=\"input_block\">\n" +
                    "                                        <input type=\"text\" name=\"carModel\" placeholder=\"Марка Авто\"\n" +
                    "                                               title=\"Введите марку Авто\" class=\"input_block__input\" " +
                    "                                               maxlength=\"15\" required>\n" +
                    "                                        <span>Марка Авто</span>\n" +
                    "                                    </div>\n" +
                    "                                </div>\n" +
                    "                                <div class=\"inl_block\">\n" +
                    "                                    <div class=\"input_block\">\n" +
                    "                                        <input type=\"text\" name=\"carColor\" placeholder=\"цвет Авто\"\n" +
                    "                                               title=\"Введите цвет Авто\" maxlength=\"15\" " +
                    "                                               class=\"input_block__input\" required>\n" +
                    "                                        <span>Цвет Авто</span>\n" +
                    "                                    </div>\n" +
                    "                                    <div class=\"input_block\">\n" +
                    "                                        <input type=\"text\" name=\"carDate\" placeholder=\"год производства\"\n" +
                    "                                               title=\"Введите год производства 'гггг'\" " +
                    "                                               class=\"input_block__input\" maxlength=\"4\" required>\n" +
                    "                                        <span>Год Производства</span>\n" +
                    "                                    </div>\n" +
                    "                                </div>\n" +
                    "                            </fieldset>\n" +
                    "                        </div>\n" +
                    "                    </div>\n" +
                    "                    <div class=\"flex-box center push-top_2em\">\n" +
                    "                        <div class=\"button reset\" data-type=\"reset\">Очистить</div>\n" +
                    "                        <div class=\"button submit\" data-type=\"nextRec\">Записать</div>\n" +
                    "                        <div class=\"button result\" data-type=\"result\">Результат</div>\n" +
                    "                        <div class=\"button submit\" data-type=\"submit\">Отправить</div>\n" +
                    "                    </div>\n" +
                    "                </form>"
                }
            };

            ////////////////end of task blocks//////////////////////////////////////////////////////////

            ////////////////Methods////////////////////////////////////////////////////////////////////

            function createDom(object, tag) {       /*private function*/
                var obj = object;
                if ("node" in obj) {
                    obj.node = document.createElement(tag);

                    if ("attr" in obj) {
                        for (elem in obj.attr) {
                            obj.node.setAttribute(elem, obj.attr[elem]);
                        }
                    }
                    if ("innerHTML" in obj) {
                        obj.node.innerHTML = obj.innerHTML;
                    }
                    if ("task" in obj) {
                        switch (taskVar) {
                            case "task1": {
                                obj.node.innerHTML = obj.task.task1;
                                break;
                            }
                            case "task2": {
                                obj.node.innerHTML = obj.task.task2;
                                break;
                            }
                            case "task3": {
                                obj.node.innerHTML = obj.task.task3;
                                break;
                            }
                            default: {
                                errorArr.push("no dataset.task in submit button of the task block");
                            }
                        }
                    }
                }
                else {
                    errorArr.push("No 'node' in object");
                }
            }

            TaskContainer.prototype.open = function () {
                createDom(this.wrapper, "div");
                createDom(this.closeBttn, "span");
                this.wrapper.node.appendChild(this.closeBttn.node);
                this.closeBttn.node.addEventListener("click", function() {
                    if (!document.querySelector(".popup-msg.table")) {  //when new popup absDomOpen, closeBttn is closed
                        absDomClose(self.wrapper.node)
                    }
                });
                createDom(this.heading, "h2");
                this.wrapper.node.appendChild(this.heading.node);
                createDom(this.taskText, "p");
                this.wrapper.node.appendChild(this.taskText.node);
                createDom(this.inputBlock, "div");
                this.wrapper.node.appendChild(this.inputBlock.node);

                if (errorArr.length) {    //if errors in elements
                    alert(errorArr.join(", "));
                    return;
                }
                else {
                    absDomOpen(this.wrapper.node);
                }
            };

            TaskContainer.prototype.listen = function () {      //will process operations as to the dataset.task
                var taskArr = {};       //comprising the task solutions
                taskArr.task1 = function () {
                    var inputText = self.inputBlock.node.querySelector(".input_block__input");  //the only input for the task1
                    //var inputTextSpan = inputText.nextElementSibling;
                    var inputTextSpan = self.inputBlock.node.querySelector("span");
                    var numArr = [];                    //Future Array of numbers with the length of this input.value
                    var resultTable = self.inputBlock.node.querySelector("#result-table");
                    var resultH3 = self.inputBlock.node.querySelector(".result-block>h3");
                    var resultTableCaption = resultTable.querySelector("caption");
                    var solution1 = resultTable.querySelector("#solution1");
                    var solution1Time = resultTable.querySelector("#solution1-time");
                    var solution2 = resultTable.querySelector("#solution2");
                    var solution2Time = resultTable.querySelector("#solution2-time");
                    var solution3 = resultTable.querySelector("#solution3");
                    var solution3Time = resultTable.querySelector("#solution3-time");
                    var solution4 = resultTable.querySelector("#solution4");
                    var solution4Time = resultTable.querySelector("#solution4-time");
                    var solution5 = resultTable.querySelector("#solution5");
                    var solution5Time = resultTable.querySelector("#solution5-time");

                    if (init()) {
                        inputText.onchange = function () {
                            if (isNumber(this.value) && +this.value !== 0 && +this.value !== 1) {
                                positive(inputTextSpan);
                                inputTextSpan.style.transform = "scale(1)";
                                inputTextSpan.textContent = "Число введено";
                                this.blur();

                                numArr = renderArr(+this.value);
                                var temp = numArr.slice(); //making copy of numArr for .reverse

                                resultH3.innerHTML = "Сгенерирован массив из " + this.value + " " +
                                    ending(this.value, ["элемент", "элемента", "элементов"]); //global function ending
                                resultTableCaption.innerHTML = "[" + numArr.join(",") + "]";
                                solution1.innerHTML = "[" + reverse(temp) + "]";
                                temp = numArr.slice(); //resetting temp
                                solution1Time.textContent = benchmark(reverse, numArr) + " ms";
                                solution2.innerHTML = "[" + newPush(numArr) + "]";
                                solution2Time.textContent = benchmark(newPush, numArr) + " ms";
                                solution3.innerHTML = "[" + revHalf(temp) + "]";
                                solution3Time.textContent = benchmark(revHalf, temp) + " ms";
                                solution4.innerHTML = "[" + newReverse(numArr) + "]";
                                solution4Time.textContent = benchmark(newReverse, numArr) + " ms";
                                solution5.innerHTML = "[" + revForEach(numArr) + "]";
                                solution5Time.textContent = benchmark(revForEach, numArr) + " ms";
                            }
                            else {
                                negative(inputTextSpan);
                                inputTextSpan.textContent = "Не введено";
                                inputTextSpan.style.transform = "scale(1)";
                                this.value = "";
                            }
                        };
                    }
                    else {
                        alert(errorArr.join(", "));
                        return;
                    }

                    function init() {
                        errorArr = [];
                        if (!resultH3) {
                            errorArr.push("No H3 element in resultBlock");
                        }
                        if (!resultTableCaption) {
                            errorArr.push("No caption element in resultTable");
                        }
                        if (!solution1) {
                            errorArr.push("No #solution1 in resultTable");
                        }
                        if (!solution1Time) {
                            errorArr.push("No #solution1Time in resultTable");
                        }
                        if (!solution2) {
                            errorArr.push("No #solution2 in resultTable");
                        }
                        if (!solution2Time) {
                            errorArr.push("No #solution2Time in resultTable");
                        }
                        if (!solution3) {
                            errorArr.push("No #solution3 in resultTable");
                        }
                        if (!solution3Time) {
                            errorArr.push("No #solution3Time in resultTable");
                        }
                        if (!solution4) {
                            errorArr.push("No #solution4 in resultTable");
                        }
                        if (!solution4Time) {
                            errorArr.push("No #solution4Time in resultTable");
                        }
                        if (!solution5) {
                            errorArr.push("No #solution4 in resultTable");
                        }
                        if (!solution5Time) {
                            errorArr.push("No #solution4Time in resultTable");
                        }
                        else {
                            return true;
                        }
                    }

                    function renderArr(elQnty) {
                        var arr = [];
                        for (var i = 0; i < elQnty; i++) {
                            arr.push(randomize(1000,0)); //rangomize - global function
                        }
                        return arr;
                    }

                    function reverse(arr) {
                        return arr.reverse();
                    }

                    function newPush(arr) {
                        var newArr = [];
                        for (var i = arr.length - 1; i >= 0; i--) {
                            newArr.push(arr[i]);
                        }
                        return newArr;
                    }

                    function revHalf(arr) {
                        for (var i = 0; i <= (arr.length / 2).toFixed(0); i++) {
                            var aside = arr[arr.length - 1 - i];
                            arr[arr.length - 1 - i] = arr[i];
                            arr[i] = aside;
                        }
                        return arr;
                    }

                    function newReverse(arr) {
                        var newArr = [];
                        for (var i = arr.length - 1; i >= 0; i--) {
                            newArr[i] = arr[arr.length - 1 - i];
                        }
                        return newArr;
                    }

                    function revForEach(arr) {
                        var newArr = [];
                        arr.forEach(function(item, i, array) {
                            newArr[array.length - 1 - i] = item;
                        });
                        return newArr;
                    }
                };  //end of task1

                taskArr.task2 = function () {
                    var formText = document.forms.formText;         //form name="formText"
                    var searchText = formText.elements.searchText;  //input of searching chars name="searchText"
                    var changeText = formText.elements.changeText; //input of chars used for changing
                    var formTextComments = formText.querySelector("#formText__comments"); //comments of actions
                    var spanLength = formText.querySelector("#formText__span-length");    //span showing text length
                    var spanFound = formText.querySelector("#formText__span-found");   //span showing found times
                    var foundArr;         //the array of found words wrapped in span
                    var foundTextOrigin;  //original found words before change
                    var textArea = formText.elements.formTextArea;  //textarea name="formTextArea" for input text
                    var psTextArea = formText.querySelector("#ps-textarea");    //pseudo textarea for stylinig chars
                    var textAreaLength; //textarea length of chars
                    var originText; //origin textarea.value for resetting
                    var buttonReset = formText.querySelector(".button.reset");

                    if (init()) {
                        textArea.addEventListener("change", function () {
                            textArea.value = cleanString(textArea.value);
                            psTextArea.textContent = textArea.value;
                            textAreaLength = psTextArea.textContent.length;

                            if (textAreaLength !== 0) {
                                originText = psTextArea.textContent;    //saving cleaned origin text
                                spanLength.textContent = textAreaLength + " chars"; //not innerHTML to avoid HTML code
                                spanLength.style.transform = "scaleX(1)";
                                positive(formTextComments);
                                formTextComments.textContent = "Текст введен";
                                formTextComments.style.transform = "scaleX(1)";

                                if (searchText.value.length !== 0) {     //if textArea changed after input in search
                                    searchMarkStr();
                                }

                            }
                            else {
                                spanLength.style.transform = "";
                                clear();
                                negative(formTextComments);
                                formTextComments.textContent = "Текст не введен";
                                formTextComments.style.transform = "scaleX(1)";
                            }
                        });

                        searchText.addEventListener("input", searchMarkStr);

                        changeText.addEventListener("input", changeMarkStr);

                        buttonReset.addEventListener("click", clear);
                    }
                    else {
                        alert(errorArr.join(", "));
                        return;
                    }

                    ////INNER FUNCTIONS task2//////

                    function init() {
                        errorArr = [];
                        if (!formText) {
                            errorArr.push("no form by name='formText'");
                        }

                        if (!searchText) {
                            errorArr.push("no input name='searchText'");
                        }

                        if (!changeText) {
                            errorArr.push("no input name='changeText'");
                        }

                        if (!formTextComments) {
                            errorArr.push("no span #formText__comments");
                        }

                        if (!spanLength) {
                            errorArr.push("no span #formText__span-length");
                        }

                        if (!spanFound) {
                            errorArr.push("no span #formText__span-found");
                        }

                        if (!textArea) {
                            errorArr.push("no textarea name='formTextArea'");
                        }

                        if (!buttonReset) {
                            errorArr.push("no button with .button .reset");
                        }

                        if (errorArr.length) {
                            alert(errorArr.join(", "));
                            return;
                        }

                        else {
                            return true;
                        }
                    }

                    function searchMarkStr() {
                        if (textAreaLength && textAreaLength > 0) {
                            var strTrimmed = searchText.value.trim();
                            //searchText.value = searchText.value.trim(); //deleting first space of searching char
                            if (strTrimmed.length > 0) {
                                var search = "/" + searchText.value + "/gi";

                                psTextArea.textContent = originText; //resetting textArea content from previous changes
                                psTextArea.innerHTML = psTextArea.innerHTML.replace(eval(search), function (str) {
                                    return "<span class=\"text_found\">" + str + "</span>";
                                });

                                foundArr = formText.querySelectorAll(".text_found");

                                if (foundArr.length !== 0) {       //if found spans from replacing text
                                    foundTextOrigin = foundArr[0].textContent; //found chars are the same
                                    positive(formTextComments);
                                    formTextComments.textContent = "Текст введен";
                                }

                                spanFound.textContent = foundArr.length + " found";
                                spanFound.style.transform = "scaleX(1)";

                                if (changeText.value.length > 0) {
                                    changeMarkStr();
                                }
                            }
                            else {      //resetting
                                psTextArea.textContent = originText;
                                searchText.value = "";     //resetting empty spaces
                                spanFound.style.transform = "scaleX(0)";
                                changeText.value = "";
                                foundArr = [];
                                foundTextOrigin = "";
                            }
                        }
                        else {
                            clear();
                            negative(formTextComments);
                            formTextComments.textContent = "А где искать?";
                            formTextComments.style.transform = "scaleX(1)";
                        }
                    }

                    function changeMarkStr() {
                        if (foundArr && foundArr.length > 0) {
                            var strTrimmed = changeText.value.trim();

                            if (changeText.value.length >= 1 && strTrimmed.length !== 0) {
                                foundArr.forEach(function (item) {
                                    item.textContent = changeText.value;
                                });

                                changeText.onblur = function () {
                                    textArea.value = psTextArea.textContent;
                                }
                            }
                            else {
                                for (var i = 0; i < foundArr.length; i++) {
                                    foundArr[i].textContent = foundTextOrigin; //resetting to original found words
                                }
                                changeText.value = "";
                            }
                        }
                        else {
                            changeText.value = "";
                            psTextArea.textContent = originText;
                            negative(formTextComments);
                            formTextComments.textContent = "А что заменить?";
                            formTextComments.style.transform = "scaleX(1)";
                        }
                    }

                    function clear() {
                        textArea.value = "";
                        textAreaLength = "";
                        psTextArea.textContent = "";
                        searchText.value = "";
                        changeText.value = "";
                        spanLength.textContent = "";
                        spanFound.textContent = "";
                        foundArr = [];
                        foundTextOrigin = "";
                        originText = "";
                        formTextComments.textContent = "";
                    }
                };  //end of task2

                taskArr.task3 = function () {
                    var regForm = document.forms.reg_driver;
                    var imageWrapper = regForm.querySelector(".regDriver__image-wrapper");
                    var inputArr = regForm.querySelectorAll(".input_block__input"); //array of inputs
                    var inputImage = regForm.elements.inputUserPhoto; //input type="file"
                    var inputGender = regForm.elements.gender; //radioNodeList for getting attr value checked
                    var resetForm = regForm.elements.resetForm; //input type="reset"
                    var recordArr = []; //array of new Driver records
                    var recordSpan = document.getElementById("recordSpan");
                    var formSample = {
                        driverName: "Name",
                        driverSurname: "Surname",
                        carManuf: "Manufacturer",
                        carModel: "Model",
                        carDate: "2010",
                        carColor: "color",
                        driverExperience: "05"
                    };
                    var inputSpan; //span mixed with input for the cases
                    var regExpArr = []; //pattern for cases
                    var reg = ""; //body for regExp in some cases
                    var regExpStr = /^[а-яa-zё]{1,15}$/i; //regExp for input String
                    var regArrDate = ["[1,2]", "[9,0]", "[\\d]", "[\\d]"]; // regExp for input Date
                    var regArrExp = /^[0-9]{1,2}$/;
                    var alarmMsg = {
                        "node": null,
                        "attr" : {"id" : "alarm-wrapper"},
                        "innerHTML" : "<div class=\"alarm\">\n" +
                        "                <span>Вы уверены???</span>\n" +
                        "                <div class=\"flex-box center\">\n" +
                        "                    <div class=\"button reset\" data-task=\"reset\">Назад</div>\n" +
                        "                    <div class=\"button submit\" data-task=\"submit\">Приступить</div>\n" +
                        "                </div>\n" +
                        "            </div>"
                    };

                    /////////////////////////////////////////////////////

                    if (regForm) {
                        regForm.addEventListener("input", function (evt) {
                            var target = evt.target;
                            inputSpan = target.parentElement.querySelector("span");
                            defaultStyle(target);

                            if (target.name) {
                                switch (target.name) {
                                    case "driverName":
                                    case "driverSurname":
                                    case "carManuf":
                                    case "carModel":
                                    case "carColor": {
                                        if (!regExpStr.test(target.value)) {
                                            errorInput(target, inputSpan);
                                        }
                                        else {
                                            target.value = target.value[0].toUpperCase() + target.value.slice(1);
                                            positive(inputSpan);
                                            inputSpan.textContent = "ввод...";
                                        }
                                        break;
                                    }
                                    case "carDate": {
                                        var i = target.value.length - 1;
                                        if (i !== -1) {
                                            regExpArr[i] = regArrDate[i];
                                        }
                                        regExpArr.length = target.value.length;
                                        reg = "/^" + regExpArr.join("") + "$/";

                                        if (!eval(reg).test(target.value)) {
                                            errorInput(target, inputSpan);
                                        }
                                        else {
                                            positive(inputSpan);
                                            inputSpan.textContent = "ввод...";
                                        }
                                        break;
                                    }
                                    case "driverExperience": {
                                        if (!regArrExp.test(target.value)) {
                                            errorInput(target, inputSpan);
                                        }
                                        else {
                                            positive(inputSpan);
                                            inputSpan.textContent = "ввод...";
                                        }
                                        break;
                                    }
                                    case "gender":
                                    case "inputUserPhoto":
                                    case "resetForm": {
                                        break;
                                    }
                                    default: {
                                        alert("switch case not included");
                                        break;
                                    }
                                }
                            }
                            else {
                                alert("no attribute 'name' in tag 'input'");
                            }
                        });

                        regForm.addEventListener("change", function (evt) {
                            var target = evt.target;
                            inputSpan = target.parentElement.querySelector("span");
                            switch (target.name) {
                                case "driverName":
                                case "driverSurname":
                                case "carManuf":
                                case "carModel":
                                case "carColor": {
                                    validChange(target, 2, inputSpan);
                                    break;
                                }
                                case "driverExperience": {
                                    validChange(target, 2, inputSpan);
                                    break;
                                }
                                case "carDate": {
                                    validChange(target, regArrDate.length, inputSpan);
                                    break;
                                }
                                case "gender":
                                case "resetForm": {
                                    break;
                                }
                                case "inputUserPhoto": {
                                    if (target.files[0]) {
                                        var fReader = new FileReader();
                                        fReader.addEventListener("load", function () {
                                            imageWrapper.style.backgroundImage = "url(" + fReader.result + ")";
                                        });
                                        fReader.readAsDataURL(target.files[0]);
                                    }
                                    break;
                                }
                                default: {
                                    alert("switch case not included");
                                    break;
                                }
                            }
                        });

                        regForm.addEventListener("click", function (evt) {
                            if (!document.querySelector(".popup-msg.table")) {
                                var target = evt.target;
                                if (target.dataset.type === "fload") {
                                    if (inputImage) {
                                        inputImage.click();
                                    }
                                    else alert("no name='inputUserPhoto' on the input");
                                }
                                else if (target.dataset.type === "reset") {
                                    resetAll();
                                }
                                else if (target.dataset.type === "autofill") {
                                    autofill();
                                }
                                else if (target.dataset.type === "nextRec") {
                                    if (checkForm()) {
                                        /*var driver = new Driver();
                                        log(driver.init("carManuf"));
                                        log(driver.init("gender"));
                                        log(inputGender.value);*/
                                        ///////////////////////////////
                                        recordArr.push(new Driver());

                                        imageWrapper.style.backgroundImage = ""; //resetting image to default
                                        if (recordSpan) {
                                            recordSpan.textContent = "Получили " + recordArr.length + " " +
                                                ending(recordArr.length, ["запись", "записи", "записей"]); //global function ending
                                            recordSpan.style.transform = "scaleX(1)";
                                        }
                                        else {
                                            alert("no #recordSpan found");
                                        }
                                        resetAll();
                                    }
                                }
                                else if (target.dataset.type === "result") {
                                    if (recordArr.length) {
                                        var table = new RegTable(recordArr);
                                        //log(table.keyArr);
                                        table.open();
                                        table.listen();
                                    }
                                    else {
                                        alert("Нет записей");
                                        resetAll();
                                    }
                                }

                                else if (target.dataset.type === "submit") {
                                    var serArr = JSON.stringify(recordArr);
                                    log(serArr);
                                    log(recordArr);
                                }
                                else return false;
                            }
                        });
                    }

                    /////////////////////inner funcs////////////////////////////
                    function errorInput(obj, inputSpan) {       //throwing error and resetting
                        obj.value = obj.value.slice(0,-1);
                        //obj.preventDefault(); //avoid form supply on 'Enter' when entering value
                        negative(inputSpan);
                        inputSpan.textContent = "Ошибка";

                        if (obj.value.length) {
                            setTimeout(function () {
                                positive(inputSpan);
                                inputSpan.textContent = "ввод...";
                            },200);
                        }
                        else {
                            resetInput(obj, inputSpan, 200);
                        }
                    }

                    function validChange(obj, number, inputSpan) {  //validating input on change
                        if (obj.value.length < number) {
                            if (obj.name === "driverExperience") {
                                obj.value = "0" + obj.value;
                                if (obj.value < 1) {
                                    negative(inputSpan);
                                    inputSpan.textContent = "недостаточно";
                                    resetInput(obj, inputSpan, 1000);
                                    return;
                                }
                                positive(inputSpan);
                                positive(obj);
                                inputSpan.textContent = "Принято";
                                obj.style.borderColor = "rgba(157, 255, 0,1)";
                                obj.blur();
                            }
                            else {
                                negative(inputSpan);
                                inputSpan.textContent = "недостаточно";
                                resetInput(obj, inputSpan, 1000);
                            }
                        }
                        else {
                            if (obj.name === "carDate") {
                                var curYear = new Date().getFullYear();
                                var carAge = curYear - obj.value;

                                if (carAge > 0 && carAge < 40) {
                                    positive(inputSpan);
                                    positive(obj);
                                    inputSpan.textContent = "Принято";
                                    obj.style.borderColor = "rgba(157, 255, 0,1)";
                                    obj.blur();
                                }
                                else {
                                    negative(inputSpan);
                                    inputSpan.textContent = "недопустимый год";
                                    resetInput(obj, inputSpan, 1000);
                                }
                                regExpArr = [];
                                return;
                            }

                            else if (obj.name === "driverExperience") {
                                if (obj.value > 50) {
                                    negative(inputSpan);
                                    inputSpan.textContent = "Многовато";
                                    resetInput(obj, inputSpan, 1000);
                                    return;
                                }
                                positive(inputSpan);
                                positive(obj);
                                inputSpan.textContent = "Принято";
                                obj.style.borderColor = "rgba(157, 255, 0,1)";
                                obj.blur();
                            }

                            else {
                                positive(inputSpan);
                                positive(obj);
                                inputSpan.textContent = "Принято";
                                obj.style.borderColor = "rgba(157, 255, 0,1)";
                                obj.blur();
                            }
                        }
                    }

                    function resetInput(obj, inputSpan, delay) {    //resetting input to initial
                        setTimeout(function () {
                            defaultStyle(inputSpan);    //returning to initial state of input
                            defaultStyle(obj);
                            inputSpan.textContent = "Ввести значение";
                            obj.value = "";

                        }, delay);
                    }

                    function resetAll() {
                        if (resetForm) {
                            resetForm.click();  //initializing input type="reset"
                            imageWrapper.style.backgroundImage = ""; //resetting image to default
                            if (inputArr.length) {
                                inputArr.forEach(function(element) {
                                    inputSpan = element.parentElement.querySelector("span");
                                    resetInput(element, inputSpan, 200);
                                });
                            }
                            else alert("no inputs with .input_block__input");
                        }
                        else alert("no name='resetForm' on the input");
                    }

                    function autofill() {
                        if (inputArr.length) {
                            inputArr.forEach(function(element) {
                                if (element.name in formSample) {
                                    //var temp = element.name;
                                    //element.setAttribute("value", formSample[temp]);
                                    //element.setAttribute("value", formSample[element.name]); //attributes change properties, not vice versa
                                    if (!+formSample[element.name]) {   //if this is not numeric
                                        element.value = formSample[element.name] + (recordArr.length + 1);  //adding No to string attribute
                                    }
                                    else {
                                        element.value = formSample[element.name];
                                    }
                                    inputSpan = element.parentElement.querySelector("span");
                                    positive(inputSpan);
                                    defaultStyle(element);
                                    positive(element);
                                    inputSpan.textContent = "Принято";
                                    element.style.borderColor = "rgba(157, 255, 0,1)";
                                }
                                else alert("no input.name in formSample");
                            });
                        }
                        else alert("no inputs with .input_block__input");
                    }

                    function checkForm() {
                        var errorArr = [];
                        if (inputArr.length) {
                            inputArr.forEach(function(element) {
                                if (!element.value.length) {
                                    element.style.borderColor = "rgba(180, 14, 220, 1)";
                                    element.style.backgroundColor = "rgba(180, 14, 220, .5)";
                                    errorArr.push("no value in " + element.name);
                                }
                            });
                        }
                        else errorArr.push("no inputs with .input_block__input");
                        if (!errorArr.length) {
                            return true;
                        }
                        else {
                            log(errorArr.join(", "));
                            return false;
                        }
                    }

                    function makeRows(parent, regRecord) {
                        //var parent = self.tBody.node;
                        if (arguments.length) {
                            for (var i = 0; i < regRecord.length; i++) {
                                var tr = parent.appendChild(document.createElement("tr"));
                                for (elem in regRecord[i]) {
                                    if (regRecord[i].hasOwnProperty(elem) && elem !== "photo") {
                                        tr.appendChild(document.createElement("td")).textContent = regRecord[i][elem];
                                    }
                                }
                            }
                        }
                        else log("for additional method using makeRow() without arguments");
                    }

                    function Car() {
                        this.carManuf = regForm.elements.carManuf.value;
                        this.carModel = regForm.elements.carModel.value;
                        this.carDate = regForm.elements.carDate.value;
                        this.carColor = regForm.elements.carColor.value;
                        //ver.3 to put methods inside Parent Obj then only Car.call(this) OR Object.create(Car);
                        /*this.init = function(args, value) {
                                if (this[args]) {
                                    if (arguments.length > 1) {
                                        this[args] = value;
                                    }
                                    log(this[args]);
                                }
                                else alert("no such attr in Car");
                            };*/
                        }
                    Car.prototype.init = function(args, value) {    //methods to .prototype for ver.1 and ver.2
                        if (this[args]) {
                            if (arguments.length > 1) {
                                this[args] = value;
                            }
                            return this[args];
                        }
                        else alert("no such attr in Car");
                    };

                    function Driver() {
                        this.driverName = regForm.elements.driverName.value;
                        this.driverSurname = regForm.elements.driverSurname.value;
                        this.driverExperience = regForm.elements.driverExperience.value;
                        this.gender = inputGender.value;    //radioNodeList has value attribute
                        this.photo = regForm.elements.inputUserPhoto;
                        Car.call(this); //writing vars of Parent for ver.1 and ver.2
                    }
                    Driver.prototype = Object.create(Car.prototype);    //ver.1 using Object.create for proto
                    //Driver.prototype = new Car();   //var.2 additional unnecessary object
                    Driver.prototype.constructor = Driver;  //back to constructor name Driver

                    function RegTable(recordArr) {
                        this.objArr = [].slice.call(recordArr);   //array of records new Driver is copied in new sample
                        this.closeBttn = {
                            node : null,
                            attr : {"class" : "close-bttn"},
                            innerHTML : "X"
                        };
                        this.popup = {      //for inner absDomOpen() with absolute pos
                            node: null,
                            attr: {"class" : "popup-msg table"}
                        };      //the outer wrapper of the table on DOM absolute middle pos;
                        this.regTable = {   //will be in DOM relative pos for absolute this.regPanel
                            node: null, //here will be DOM element
                            attr: {"id" : "regTable-wrapper"} //attributes of DOM element
                        };  //the inner wrapper of the table on DOM relative pos for regPanel
                        this.caption = {
                            node: null, //here will be DOM element
                            innerHTML : "Результат регистрации Водителей"
                        };
                        this.regPanel = {
                            node: null, //here will be DOM element
                            attr: {"class" : "panel flex-box_column between"}, //attributes of DOM element
                            innerHTML : "<div class=\"table__icon up\"></div>\n" +
                            "            <div class=\"table__icon del\"></div>\n" +
                            "            <div class=\"table__icon ins\"></div>\n" +
                            "            <div class=\"table__icon down\"></div>"
                        };
                        this.buttBlock = {
                            node: null,
                            attr: {"class" : "butt-panel flex-box around"},
                            innerHTML : "<div class=\"button reset\" data-reg=\"reset\">Заново</div>\n" +
                            "            <div class=\"button submit\" data-reg=\"submit\">Готово</div>"
                        };
                        this.tHead = {
                            node: null //here will be DOM element
                        };
                        this.tBody = {
                            node: null //here will be DOM element
                        };
                        this.keyArr = Object.keys(this.objArr[0]);   //th values
                    }
                    RegTable.prototype.open = function() {
                        var self = this;
                        errorArr = [];
                        createDom(this.popup, "div");
                        createDom(this.closeBttn, "div");
                        this.popup.node.appendChild(this.closeBttn.node);
                        this.closeBttn.node.addEventListener("click", function() {
                            absDomClose(self.popup.node);
                        });
                        createDom(this.regTable, "table");  //inner function TaskContainer
                        this.popup.node.appendChild(this.regTable.node);
                        createDom(this.regPanel, "div");
                        this.regTable.node.appendChild(this.regPanel.node);
                        createDom(this.caption, "caption");
                        this.regTable.node.appendChild(this.caption.node);
                        createDom(this.tHead, "thead");
                        makeHeadRow(this.keyArr);
                        this.regTable.node.appendChild(this.tHead.node);
                        createDom(this.tBody, "tbody");
                        makeRows(this.tBody.node, this.objArr);
                        this.regTable.node.appendChild(this.tBody.node);
                        createDom(this.buttBlock, "div");
                        this.popup.node.appendChild(this.buttBlock.node);

                        if (errorArr.length) {
                            alert(errorArr.join(", "));
                        }
                        else {
                            absDomOpen(this.popup.node);
                        }

                        function makeHeadRow(keyArr) {
                            var parent = self.tHead.node;
                            var tr = parent.appendChild(document.createElement("tr"));
                            for (var i = 0; i < keyArr.length; i++) {
                                if (keyArr[i] !== "photo") {
                                    var th = tr.appendChild(document.createElement("th"));
                                    switch (keyArr[i]) {
                                        case "driverName": {
                                            th.setAttribute("data-type", "text");
                                            th.textContent = "Имя Водителя";
                                            break;
                                        }
                                        case "driverSurname": {
                                            th.setAttribute("data-type", "text");
                                            th.textContent = "Фамилия";
                                            break;
                                        }
                                        case "driverExperience": {
                                            th.setAttribute("data-type", "exper");
                                            th.textContent = "Опыт";
                                            break;
                                        }
                                        case "gender": {
                                            th.setAttribute("data-type", "gender");
                                            th.textContent = "Пол";
                                            break;
                                        }
                                        case "carManuf": {
                                            th.setAttribute("data-type", "text");
                                            th.textContent = "Производитель";
                                            break;
                                        }
                                        case "carModel": {
                                            th.setAttribute("data-type", "text");
                                            th.textContent = "Модель";
                                            break;
                                        }
                                        case "carDate": {
                                            th.setAttribute("data-type", "carDate");
                                            th.textContent = "Дата";
                                            break;
                                        }
                                        case "carColor": {
                                            th.setAttribute("data-type", "text");
                                            th.textContent = "Цвет";
                                            break;
                                        }
                                        default: {
                                            alert("no case in Obj");
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    };

                    RegTable.prototype.listen = function () {
                        var self = this;
                        errorArr = [];
                        var up = this.regPanel.node.querySelector(".up");    //initiating table interface
                        var down = this.regPanel.node.querySelector(".down");
                        var del = this.regPanel.node.querySelector(".del");
                        var ins = this.regPanel.node.querySelector(".ins");
                        var selRowArr = this.tBody.node.rows;   //selected row of the table
                        var selRowCopy = []; //copy of selRowArr for sorting
                        var selRowIndex = 0;    //selected row.index
                        //var selIndex = 0;   //selected cell.index
                        var tdTextArea = null; //textarea inside selected cell
                        //var tdTarget = null; //td selected for textarea to append
                        var typeTh = null; //type of TH for repExp test

                        markRow(); //selected default pos of selRowIndex (0)

                        if (init()) {
                            this.popup.node.addEventListener("click", function (ev) {
                                var target = ev.target || window.event.srcElement;

                                if (target.closest(".up")) {
                                    markRow("up");
                                }
                                if (target.closest(".down")) {
                                    markRow("down");
                                }
                                if (target.closest(".del")) {
                                    delRow();
                                }
                                if (target.closest(".ins")) {
                                    insRow();
                                }
                                if (target.getAttribute("data-reg") === "reset") {
                                    rewrite();
                                }
                                if (target.getAttribute("data-reg") === "submit") {
                                    createDom(alarmMsg, "div");
                                    alarmMsg.node.addEventListener("click", function (ev) {
                                        var target = ev.target;
                                        if (target.dataset.task === "reset") {
                                            absDomClose(alarmMsg.node);
                                        }
                                        if (target.dataset.task === "submit") {
                                            writeIn();
                                            var alarmSpan = alarmMsg.node.querySelector("span");
                                            var remove = function () {
                                                absDomClose(alarmMsg.node);
                                                absDomClose(self.popup.node);
                                            };
                                            if (alarmSpan) {
                                                alarmSpan.textContent = "Записи произведены";
                                            }
                                            else {
                                                log("No span in alarmMsg.node");
                                            }
                                            setTimeout(remove, 1000);
                                        }
                                    });
                                    absDomOpen(alarmMsg.node);
                                }
                                if (target.dataset.type) {
                                    selRowCopy = [].slice.call(selRowArr);
                                    markRow(); //switching off the selection of row
                                    var compare; //function by case
                                    switch (target.dataset.type) {   //by type of th (num,string) setting compare()
                                        case "carDate":
                                        case "exper":
                                        case "num": {
                                            compare = function (rowA, rowB) {
                                                return rowA.cells[target.cellIndex].textContent - rowB.cells[target.cellIndex].textContent;
                                            };
                                            break;
                                        }
                                        case "gender":
                                        case "text": {
                                            compare = function (rowA, rowB) {
                                                return rowA.cells[target.cellIndex].textContent > rowB.cells[target.cellIndex].textContent;
                                            };
                                            break;
                                        }
                                        default: {
                                            alert("no dataset.type in cell");
                                            break;
                                        }
                                    }
                                    selRowCopy.sort(compare);
                                    self.regTable.node.removeChild(self.tBody.node);
                                    selRowCopy.forEach(function (el) {
                                        self.tBody.node.appendChild(el);
                                    });
                                    self.regTable.node.appendChild(self.tBody.node);
                                    selRowArr = self.tBody.node.rows;
                                    selRowIndex = 0;
                                    markRow();
                                }
                                if (target.closest("td")) {
                                    //log("selRowIndex" + selRowIndex);
                                    //log("CellIndex" + target.cellIndex);

                                    markRow();   //switching off selection of initial row
                                    selRowIndex = target.parentElement.sectionRowIndex; //!!!! .rowIndex gives index + 1 ??????
                                        //selRowIndex = target.parentNode.rowIndex;
                                        //log("selected rowIndex: " + selRowIndex);
                                    markRow();   //new selectin of row

                                    //log("selRowIndex" + selRowIndex);
                                    //log("CellIndex" + target.cellIndex);
                                  //////////////////////////////

                                    setArea(target);    //setting textarea in selected TD

                                    var tdDomArr = this.querySelectorAll("textarea");
                                    log(tdDomArr);

                                    if (tdTextArea) {
                                        tdTextArea.addEventListener("input", function () {
                                            switch (typeTh) {
                                                case "text": {
                                                    log("text oninput");
                                                    if (!regExpStr.test(this.value)) {
                                                        errorCell(this);
                                                    }
                                                    else {
                                                        this.value = this.value[0].toUpperCase() + this.value.slice(1);
                                                        positive(this);
                                                    }
                                                    break;
                                                }
                                                case "exper": {
                                                    log("exper oninput");
                                                    if (!regArrExp.test(this.value)) {
                                                        errorCell(this);
                                                    }
                                                    else {
                                                        positive(this);
                                                    }
                                                    break;
                                                }
                                                case "gender": {
                                                    log("gender oninput");
                                                    if (this.value.length === 1) {   //if edited "femа.." on delete
                                                        if (this.value === "f") {
                                                            positive(this);
                                                            this.value = "female";
                                                        }
                                                        else if (this.value === "m") {
                                                            positive(this);
                                                            this.value = "male";
                                                        }
                                                        else {
                                                            errorCell(this);
                                                        }
                                                    }
                                                    else {
                                                        this.value = "";
                                                        defaultStyle(this);
                                                    }
                                                    break;
                                                }
                                                case "carDate": {
                                                    log("carDate oninput");
                                                    //log(regExpArr.length); //regExpArr for start needs to be empty
                                                    var i = this.value.length - 1;
                                                    if (i !== -1) {
                                                        regExpArr[i] = regArrDate[i];
                                                    }
                                                    regExpArr.length = this.value.length;
                                                    reg = "/^" + regExpArr.join("") + "$/";

                                                    if (!eval(reg).test(this.value)) {
                                                        errorCell(this);
                                                    }
                                                    else {
                                                        positive(this);
                                                    }
                                                    break;
                                                }
                                            }
                                        });
                                        tdTextArea.addEventListener("blur", function () {
                                            log("on blur");
                                            //var locType = this.dataset.th;
                                            log(typeTh);

                                            switch (typeTh) {
                                                case "text": {
                                                    valChange(this, 2, typeTh);
                                                    break;
                                                }
                                                case "exper": {
                                                    valChange(this, 2, typeTh);
                                                    break;
                                                }
                                                case "gender": {
                                                    valChange(this, 1, typeTh);
                                                    break;
                                                }
                                                case "carDate": {
                                                    valChange(this, regArrDate.length, typeTh);
                                                    break;
                                                }
                                            }
                                            //this.parentNode.style.position = "static";    //already no parentNode
                                        });
                                    }
                                } //end of .closest("td")
                            });
                        }
                        else {
                            alert(errorArr.join(", "));
                        }

                        function markRow(upDown) {     //if exist argument("up","down) selRowIndex will be set
                            if (arguments.length) { //if second argument in function
                                if (upDown === "up") {
                                    if (selRowIndex !== 0) {
                                        selRowArr[selRowIndex].classList.toggle("selected"); //deSelect element

                                        selRowIndex -= 1;
                                        selRowArr[selRowIndex].classList.toggle("selected"); //select element

                                        //log("selRowIndex" + selRowIndex);
                                    }
                                }
                                if (upDown === "down") {
                                    if (selRowIndex !== self.tBody.node.rows.length - 1) {
                                        selRowArr[selRowIndex].classList.toggle("selected"); //deSelect element
                                        selRowIndex += 1;
                                        selRowArr[selRowIndex].classList.toggle("selected"); //select element

                                       // log("selRowIndex" + selRowIndex);

                                    }
                                }
                            }
                            else {
                                selRowArr[selRowIndex].classList.toggle("selected");
                                //log("selRowIndex" + selRowIndex);
                            }
                        }

                        function init() {
                            if (!up) {
                                errorArr.push("no 'up' icon in table");
                            }
                            if (!down) {
                                errorArr.push("no 'down' icon in table");
                            }
                            if (!del) {
                                errorArr.push("no 'del' icon in table");
                            }
                            if (!ins) {
                                errorArr.push("no 'ins' icon in table");
                            }
                            if (errorArr.length) {
                                return false;
                            }
                            return true;
                        }

                        function delRow() {
                            if (selRowArr.length !== 1) {
                                if (selRowIndex === selRowArr.length - 1) {
                                    self.tBody.node.removeChild(selRowArr[selRowIndex]);
                                    self.objArr.splice(selRowIndex, 1);
                                    selRowIndex -= 1;
                                    markRow();
                                }
                                else {
                                    self.tBody.node.removeChild(selRowArr[selRowIndex]);
                                    self.objArr.splice(selRowIndex, 1);
                                    markRow();
                                }
                            }
                        }

                        function makeRow(obj) {     //adding row from obj
                            var newTr = document.createElement("tr");
                            for (elem in obj) {
                                if (elem !== "photo") {
                                    var td = newTr.appendChild(document.createElement("td"));
                                    td.textContent = obj[elem];
                                }
                            }
                            self.tBody.node.insertBefore(newTr, selRowArr[selRowIndex].nextElementSibling);
                            markRow("down");
                        }

                        function insRow() {     //inserting tr with default attributes
                            var copy = clone(self.objArr[selRowIndex]);
                            for (elem in copy) {
                                for (rec in formSample) {
                                    if (rec === elem) {     //copying default attributes to clone obj
                                        if (!+formSample[rec]) {    //if string
                                            copy[elem] = formSample[rec] + (self.objArr.length + 1); //adding number of record
                                        }
                                        else {
                                            copy[elem] = formSample[rec];
                                        }
                                    }
                                }
                            }
                            self.objArr.splice(selRowIndex, 0, copy);   //objArr added with new clone obj at selRowIndex
                            makeRow(copy);
                        }

                        function rewrite() {
                            self.objArr = [].slice.call(recordArr);
                            self.regTable.node.removeChild(self.tBody.node);
                            self.tBody.node = null;
                            createDom(self.tBody, "tbody");
                            makeRows(self.tBody.node, self.objArr);
                            self.regTable.node.appendChild(self.tBody.node);
                            selRowIndex = 0;
                            selRowArr = self.tBody.node.rows;
                            markRow();
                        }

                        function writeIn() {
                            recordArr = [].slice.call(self.objArr);     //putting objArr from table to recordArr
                            if (recordSpan) {
                                recordSpan.textContent = "Получили " + recordArr.length + " " +
                                    ending(recordArr.length, ["запись", "записи", "записей"]); //global function ending
                                recordSpan.style.transform = "scaleX(1)";
                            }
                            else {
                                alert("no #recordSpan found");
                            }
                            resetAll();
                        }

                       function setArea(target) { //event.target - TD
                           if (tdTextArea) {
                               tdTextArea.blur();
                           }
                           target.style.position = "relative";
                           tdTextArea = target.appendChild(document.createElement("textarea"));
                           typeTh = self.tHead.node.rows[0].cells[target.cellIndex].dataset.type; //type of TH
                           tdTextArea.setAttribute("class", "td__textarea");
                           tdTextArea.setAttribute("wrap", "off");     //swithes off /n and Enter for /n
                           tdTextArea.setAttribute("overflow", "auto"); //to prevent scroll of IE
                           //tdTextArea.setAttribute("data-th", typeTh);
                           tdTextArea.focus();
                       }

                       function delArea(obj) {
                           //obj.parentNode.style.position = "static";
                           //obj.parentNode.removeChild(obj);  //не видит, ссука, родителя... новый прописывается при клике на другой клетке
                           obj.remove();
                           obj = null;
                       }

                        function errorCell(obj) {       //obj = tdTextArea
                            obj.value = obj.value.slice(0,-1);
                            negative(obj);

                            if (obj.value.length) {
                                setTimeout(function () {
                                    positive(obj);
                                },200);
                            }
                            else {
                                defaultStyle(obj);
                                obj.value = "";
                            }
                        }

                        function valChange(obj, number, typeTh) {  //validating tdTextArea on change
                           if (obj.value.length < number) {
                               if (typeTh === "exper") {
                                   obj.value = "0" + obj.value;
                                   if (obj.value < 1) {
                                       negative(obj);
                                       obj.value = "мало";
                                       setTimeout(function () {
                                           delArea(obj);    //removing tdTextArea from selected TD
                                           }, 1500);
                                       }
                                       else {
                                       positive(obj);
                                       obj.parentNode.textContent = obj.value;
                                       delArea(obj);    //removing tdTextArea from selected TD
                                       }
                               }
                               else {
                                   negative(obj);
                                   obj.value = "мало";
                                   setTimeout(function () {
                                       delArea(obj);    //removing tdTextArea from selected TD
                                       }, 1500);
                               }
                           }
                           else {
                               if (typeTh === "carDate") {
                                   var curYear = new Date().getFullYear();
                                   var carAge = curYear - obj.value;
                                   if (carAge > 0 && carAge < 40) {
                                       positive(obj);
                                       obj.parentNode.textContent = obj.value;
                                       delArea(obj);    //removing tdTextArea from selected TD
                                       regExpArr = [];  //resetting regExpArr to initial
                                   }
                                   else {
                                       negative(obj);
                                       obj.value = "Много";
                                       setTimeout(function () {
                                           delArea(obj);    //removing tdTextArea from selected TD
                                           }, 1500);
                                       }
                                       regExpArr = [];  //resetting regExpArr to initial
                                   return;
                               }
                               else if (typeTh === "exper") {
                                   if (obj.value > 50) {
                                       negative(obj);
                                       obj.value = "Много";
                                       setTimeout(function () {
                                           delArea(obj);    //removing tdTextArea from selected TD
                                           }, 1500);
                                       return;
                                   }
                                   else {
                                       positive(obj);
                                       obj.parentNode.textContent = obj.value;
                                       delArea(obj);    //removing tdTextArea from selected TD
                                   }
                               }
                               else if (typeTh === "gender") {
                                   if (obj.value === "male" || obj.value === "female") {
                                       positive(obj);
                                       obj.parentNode.textContent = obj.value;
                                       delArea(obj);    //removing tdTextArea from selected TD
                                   }
                               }
                               else {
                                   positive(obj);
                                   obj.parentNode.textContent = obj.value;
                                   delArea(obj);    //removing tdTextArea from selected TD
                               }
                           }
                        }
                    }; // end of regTable.prototype.listen()

                }; //end of task3;

                ////////////////////////////////////////////////////////////////////////////////
                //After declaration of task1, task2, task3 we can init function of solutions

                if (this.wrapper.node.parentNode && this.inputBlock.node.querySelector("input")) {
                    taskArr[taskVar](); //switching the input data-task to taskArr[dataset.task]
                }
                else {
                    alert("no input in block");
                }
                ////////////////////////functions ////////////////////////////////////////////////
                function positive(objDom) {
                    objDom.style.textShadow = "0 0 1em rgba(157, 255, 0,1)";
                    objDom.style.color = "rgba(157, 255, 0,1)";
                    objDom.style.transform = "";
                }

                function negative(objDom) {
                    objDom.style.textShadow = "0 0 1em rgba(180, 14, 220, 1)";
                    objDom.style.color = "rgba(180, 14, 220, 1)";
                    objDom.style.transform = "scale(1)";
                }

                function defaultStyle(objDom) {
                    objDom.style.textShadow = "";
                    objDom.style.color = "";
                    objDom.style.borderColor = "";
                    objDom.style.transform = "";
                    objDom.style.backgroundColor = "";
                }
            } //end of TaskContainer.prototype.listen()
        }   //end of taskContainer()
    } //end of renderBlock()
}   //end of initTaskBlocks()

/***************Attributes for Slider**************************
 * slideContainer: slider wrapper with relative position, comprising absolute slides
 * labelClass: CSS class of label elems for radio inputs
 * qntyLabels: amount of visible labels in interface
 * prevClass, nextClass are buttons for label shiftings*/
function Slider(slideContainer, labelClass, qntyLabels, prevClass, nextClass) {
    var self = this;
    this.qntyLabels = qntyLabels;
    this.sliderWrapper = document.querySelector("." + slideContainer);
    this.radioDomArray = this.sliderWrapper.getElementsByTagName("input");
    this.prevCheckedPos = "";
    this.labelRange = [];
    this.intervalHandler = "";
    this.labelDomArray = this.sliderWrapper.getElementsByClassName(labelClass);
    this.labelWrapper = this.labelDomArray[0].parentElement;
    this.leftButton = this.sliderWrapper.querySelector("." + prevClass);
    this.rightButton = this.sliderWrapper.querySelector("." + nextClass);


//******************__proto__*************************/
    Slider.prototype.getRadioChecked = function () {
        for (var i = 0; i < self.radioDomArray.length; i++) {
            if (self.radioDomArray[i].checked) {
                //log("radioChecked: " + self.radioDomArray[i].checked);
                //log("current checkedPos: " + i);
                //log("previous checkedPos: " + self.prevCheckedPos);
                self.setLabels2Show(i); // setting the range of labels to show in necessary qnty
                self.toggleLabels();    //giving visible to the setted LabelsArray
                //log("Array Pos of displayed slides");
                //log(self.labelRange);

                if (self.prevCheckedPos !== "") {
                    self.labelDomArray[self.prevCheckedPos].classList.toggle("label-checked");
                }

                self.labelDomArray[i].classList.toggle("label-checked");

                if (i === 0) {
                    self.leftButton.style.display = "none";
                }

                else if (i === self.radioDomArray.length - 1) {
                    self.rightButton.style.display = "none";
                }

                else {
                    self.leftButton.style.display = "";
                    self.rightButton.style.display = "";
                }
                self.prevCheckedPos = i; //     Setting prevPos Position
            }
        }
    };

    Slider.prototype.setLabels2Show = function (checkPos) { //operates the range of labels to display
        if (self.labelRange.indexOf(checkPos) === -1) {     //if checked radio is not in labelRange
            //log("input not in labelRange");
            self.labelRange.push(checkPos);
            //log("labelRange with pushed Pos");
            //log(self.labelRange);
            self.labelRange.sort(function(a, b) {           //sorting labelRange in order +1
                return a - b;
            });
            //log("After sorting");
            //log(self.labelRange);
        }

        if (self.labelRange.length < self.qntyLabels) {     // at first radio clicked
            var diff = self.qntyLabels - self.labelRange.length;
            for (var i = 1; i <= diff; i++) {
                self.labelRange.push(checkPos + i);
            }
            //log("added new labels");
            self.labelRange.sort(function(a, b) {
                return a - b;
            });
        }

        if (self.labelRange.length > self.qntyLabels) {
            if (checkPos === self.labelRange[0]) {      //the first number in labelRange Array
                //log("checkPos = labelRange[0]");
                //log(self.labelRange);
                self.labelRange.pop();
                //log("after popping");
                //log(self.labelRange);
            }
            if (checkPos === self.labelRange[self.labelRange.length - 1]) {
                //log("if checkPos === labelRange[last]");
                //log(self.labelRange);
                self.labelRange.shift();
                //log("after shifting");
                //log(self.labelRange);
                //log("lableRange qnty: " + self.labelRange.length);
            }
        }
    };

    Slider.prototype.toggleLabels = function() {            //hiding and displaying the chosen labels
        for (var i = 0; i < self.labelDomArray.length; i++) {
            self.labelDomArray[i].style.display = "none";
        }
        for (var s = 0; s < self.labelRange.length; s++) {
            self.labelDomArray[self.labelRange[s]].style.display = "block";
        }
    };

    Slider.prototype.listenRadio = function () {    //four usage, by clicking labels. Also works without JS
        for (var i = 0; i < self.radioDomArray.length; i++) {
            self.radioDomArray[i].addEventListener("click", function () {
                self.getRadioChecked();
            });
        }
    };

    Slider.prototype.nextSlide = function () {  //for next button shifting radios
        if (self.prevCheckedPos !== "") {
            self.radioDomArray[self.prevCheckedPos].checked = false;//prev radio checked:false
            }

        if (self.prevCheckedPos + 1 <= self.radioDomArray.length - 1) {
            //log("radio is the last in radioDomArray");
            self.radioDomArray[self.prevCheckedPos + 1].checked = true; //next radio checked:true
        }

        if (self.prevCheckedPos + 1 > self.radioDomArray.length - 1) {
            self.labelRange = [];
            self.radioDomArray[0].checked = true;   //next circle from the beginning
        }
        self.getRadioChecked();
    };

    Slider.prototype.prevSlide = function () {  //for previous button shifting radios
        if (self.prevCheckedPos !== "") {
            self.radioDomArray[self.prevCheckedPos].checked = false;//prev radio checked:false
        }

        if (self.prevCheckedPos - 1 >= 0) {
            //log("radio is the first in radioDomArray");
            self.radioDomArray[self.prevCheckedPos - 1].checked = true; //next radio checked:true
        }
        self.getRadioChecked();
    };

    Slider.prototype.runSlider = function () {
        self.intervalHandler = setInterval(function () {
            self.nextSlide();
        }, 10000);
        /*self.intervalHandler = setInterval(self.nextSlide, 5000);*/
    };

    Slider.prototype.initSlider = function () {
        self.getRadioChecked();
        self.rightButton.addEventListener("click", function () {
            self.nextSlide();
        });
        self.leftButton.addEventListener("click", function () {
            self.prevSlide();
        });
        self.listenRadio();
        self.runSlider();   //starting slider until over mouse

        self.labelWrapper.onmouseover =  function () {
             clearInterval(self.intervalHandler);
        };
        self.labelWrapper.onmouseout =  function () {
            self.runSlider();
        };
    };
}

//////////////////////////END OF SLIDER///////////////////////

function LightingText(domId, qntyLetters) {
    var self = this;
    this.domNode = document.getElementById(domId);
    this.domText = this.domNode.textContent;
    this.textArr = this.domText.split("");
    this.qnty = qntyLetters;            // quantity of letters to blink
    this.indexArr = [];                 //textArr.indexes of chosen letters to blink
    this.spanLetterArr = [];            //got all span elements in Arr
    //this.toggle = "";                   //letterIndex on toggle
    //this.timeOutArr = [];
    //this.randArr = [];
    this.lightOnClassNorm = "light_on"; //color options of the letters
    this.lightOnClassLow = "light_low"; //color options of chosed letters

    LightingText.prototype.getLetters = function () {
//Getting randomized indexes of letters in need quantity
        for (var i = 0; i < this.qnty; i++) {
            var letterIndex = randomize(this.textArr.length - 1, 0);
            if (this.indexArr.indexOf(letterIndex) === -1 && this.textArr[letterIndex] !== " ") {
                this.indexArr.push(letterIndex);
            }
            else {
                i--;
                //log("repeating");
            }
        }
        //log(this.indexArr);

//Giving spans to letters
        for (var i = 0; i < this.textArr.length; i++) {
                if (this.indexArr.indexOf(i) === -1) {
                    this.textArr[i] = "<span>" + this.textArr[i] + "</span>";
                }
                else {
                    this.textArr[i] = "<span class=\"light_off\">" + this.textArr[i] + "</span>";
                }
        }
//Put in DOM and getting span elements in Array

        this.domNode.innerHTML = this.textArr.join("");
        //log(this.domNode.innerHTML);
        this.spanLetterArr = this.domNode.getElementsByTagName("span");
        //log(this.domNode.innerHTML);
        //log(this.spanLetterArr);
    };

    LightingText.prototype.lightOn = function (normLight, lowLight) {
        //ПРОПИСАТЬ АТТРИБУТ ПО УМОЛЧАНИЮ И ОТДЕЛЬНУЮ ЗАДЕРЖКУ БУКВ
        this.domNode.classList.toggle(normLight);
        toggle();

        function toggle() {
            for (var i = 0; i < self.spanLetterArr.length; i++) {
                if (self.spanLetterArr[i].classList.contains("light_off")) {
                    self.spanLetterArr[i].classList.toggle(lowLight);
                }
            }
            var rand = randomize(1000, 50);
            var delay = setTimeout(toggle, rand);
        }
    };
}

///////////////////////OPTION/////////////////////////////////

function log(content) {
    console.log(content);
}

function logDir(content) {
    console.dir(content);
}

function randomize(max, min) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function changeClass(node, class1, class2) {
    if (node.classList.contains(class1)) {      //if "off" then "on"
        node.classList.replace(class1, class2);
    }
    else if (node.classList.contains(class2)) {     //if "on" then "off"
        node.classList.replace(class2, class1);
    }
    else {
        node.classList.add(class2);  //if first opening (no "off" and "on") then "on"
    }
}

function absDomOpen(obj) {     //to open obj in DOM abs center
    document.body.appendChild(obj);
    obj.style.position = "absolute";
    if (document.documentElement.clientHeight <= obj.offsetHeight) {
        obj.style.top = 20 + document.documentElement.scrollTop + "px";
    }
    else {
        obj.style.top = document.documentElement.clientHeight / 2 + document.documentElement.scrollTop
            - obj.offsetHeight / 2 + "px";
    }
    obj.style.left = document.documentElement.clientWidth / 2 - obj.offsetWidth / 2 + "px";
    changeClass(obj, "scaleDownZero", "scaleUpZero");     //global function (in OPTION)
}

function absDomClose(obj) { //to close obj in DOM
    changeClass(obj, "scaleDownZero", "scaleUpZero");     //global function (in OPTION)
    var remove = function () {
        if (!!obj.parentNode) {   //if exists in DOM
            obj.parentNode.removeChild(obj);
            obj = null;
        }
    };
    setTimeout(remove, 400);
}

function equalCols(colsArr) {   //for making DOM blocks` height to be equal. Put them in array colsArr
    var highestCal = 0;
    for (var i = 0; i < colsArr.length; i++) {
        if (colsArr[i].offsetHeight >= highestCal) {
            highestCal = colsArr[i].offsetHeight;
        }
    }
    for (i = 0; i < colsArr.length; i++) {
        colsArr[i].style.height = highestCal + "px";
    }
}

function clone(obj) {
    var copy = Object.assign({}, obj);
    return copy;
    /*var copy = {};      //gives additional attributes to clone obj: Constructor and init ????!!!!!
    if (typeof obj === "object") {
        for (elem in obj) {
            copy[elem] = obj[elem];
        }
        return copy;
    }*/

}

function ending(n, option) {    //ending for numerics (элемента, элемента, элементов)
    return option[(n%10 == 1 && n%100 != 11) ? 0 : n%10 >= 2 && n%10 <= 4 && (n%100 < 10 || n%100 >= 20) ? 1 : 2];
}

function cleanString(text) {
    str = text.replace(/\r?\n/g, " ");  //cleaning /n
    str = str.replace(/\s+/g," ").trim();   //cleaning spaces between/after text
    return str;
}

function isNumber(it) {     //isFininte(it) checks numbers, parseFloat(it) checks boolean and space to "string" then checks number
    return !isNaN(parseFloat(it) && isFinite(it));

}

function logArray (Arr) {
    for (var i = 0; i < Arr.length; i++) {
        console.log(Arr[i]);
    }
}

function objectToArray(object) {
    var obj = Array.prototype.slice.call(object);
    if (obj.length !== 0) {
        return obj;
    }
    else return console.log("obj.length: " + obj.length);
}

function isNumber(it) {     //isFininte(it) checks numbers, parseFloat(it) checks boolean and space to "string" then checks number
    return !isNaN(parseFloat(it) && isFinite(it));

}

///////////////BENCHMARKING FUNCTION/////////////////////////////////
function benchmark(func, args) {
    var timeArr = [];
    for (var i = 0; i < 1000; i++) {
        var start = performance.now();
        func(args);
        var end = performance.now();
        timeArr.push(end - start);
        //log(end - start);
    }
    //log(timeArr);
    function median(timeArr) {
        timeArr.sort(); //collecting to get the middle variable (timeArr.length/2
        return timeArr[Math.ceil(timeArr.length / 2)]; //returning the middle of the array which sorted
    }   //getting the middle result arr[arr.length/2] after arr.sort()
    function average (timeArr) {
        var sum = 0;
        for (var i = 0; i < timeArr.length; i++) {
            sum += timeArr[i];
        }
        return sum / timeArr.length;
    } //getting the average result of total sum results / arr.length

    return average(timeArr).toFixed(4);
}

/////////////CREATE SCRIPT IN DOM/////////////////////////
function makeScript(path) {
    var head = document.documentElement.firstChild;
    var script = document.createElement("script");
    script.setAttribute("src", path);
    head.appendChild(script);
}


/*function isIntegerCycle (title, sample) {
    var string;
    do {
        string = prompt("Введите " + title, sample);
        if (string == null) {
            var conf = confirm("Вы хотите выйти?");
            if (conf) {
                return false;
            }
        }
    } while (!+string && string !== "0");
    return +(string);
}*/

/*function isDateYearCycle (title, sample) {
    var string;
    do {
        string = prompt("Введите " + title, sample);
        if (string == null) {
            var conf = confirm("Вы хотите выйти?");
            if (conf) {
                return false;
            }
        }
    } while (!+string || string.length !== 4 || +string > 2018 || +string < 1900); //newDate.getFullYear()???? вместо 2018
    return string;
    //var carDate = new Date();
    //carDate.setFullYear(+string);
    //return carDate.getFullYear();
}

function isOperatCycle(str1, str2) {
    do {
        var sign = prompt("Для нового цикла введите: " + str1 + " или к выводу результата: " + str2, str1);
        if (sign == null) {
            var conf = confirm("Вы хотите выйти?");
            if (conf) {
                return false;
            }
        }
    } while (sign !== str1 && sign !== str2);
    return sign;
}

function isStringCycle (title, sample) {
    var string;
    do {
        string = prompt("Введите " + title, sample);
        if (string == null) {
            var conf = confirm("Вы хотите выйти?");
            if (conf) {
                return false;
            }
        }
    } while (!string.trim() || parseInt(string) || parseInt(string) === 0); //если после .trim пусто, то false
    return string.trim(); //.trim не изменяет строку!!!
}*/