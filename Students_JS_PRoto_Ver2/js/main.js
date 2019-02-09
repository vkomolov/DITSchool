window.onload = function() {
	if(confirm("Приступим?")) {
        let groupQnty = isIntegerCycle("Сколько у нас студентов?", null);
        if (groupQnty) {
            log("В группе " + groupQnty + " " + ending(groupQnty, ["студент", "студента", "студентов"]));
            let gradeQnty = isIntegerCycle("Сколько оценок у студентов?", null);
            if (gradeQnty) {
                log("Всего получено " + gradeQnty + " " + ending(gradeQnty, ["оценка", "оценки", "оценок"]));
                log("\n");

                initConstructor(groupQnty, gradeQnty);
            }
            else {
                return log("Работа прервана");
            }
        }
        else {
            return log("Работа прервана");
        }

        ///////////////////////////CONSOLE LOGS////////////////////////////////////////////

        log("//////////////////////////////////\n");
        log("Получаем массив студентов через 'Student.group()'");
        log(Student.group());
        log("\n");
        log("Метод любого студента '.getFullName()'");
        log(Student.stack[0].getFullName());
        log("\n");
        log("Метод любого студента '.getAvgGrade()'");
        log(Student.stack[0].getAvgGrade());
        log("\n");
        log("Получаем список студентов с сортировкой по имени через 'Student.list()'");
        Student.list();
        log("\n");
        log("Получаем список студентов с сортировкой по оценкам через 'Student.gradeSort()'");
        Student.gradeSort();
        log("\n");
        log("Получаем лучшего студента через 'Student.getBest()'");
        log(Student.getBest());
        log("\n");
        log("Получаем худшего студента через 'Student.getWorst()'");
        log(Student.getWorst());
        log("\n");
        log("Получаем средний уровень оценок в группе через 'Student.getAvrGroupGrade()'");
        log(Student.getAvrGroupGrade());
        log("\n");
        log("Пробуем добавлять оценку '100' студенту через '.setGrade(100)'");
        Student.stack[0].setGrade(100);
        log("Смотрим перечень оценок студента через .whatGrades");
        log(Student.stack[0].whatGrades());
        log("\n");
        log("Снова смотрим уровень оценок в группе через 'Student.getAvrGroupGrade()'");
        log(Student.getAvrGroupGrade());
        log("Средний балл по группе стал выше");
        log("\n");
        log("//////////////YOUR LOGS...//////////////");
        //////////////////////////////////PLACE FOR YOUR CODE/////////////////////////////////////////


        ///////////////////////////////////END OF LOGS///////////////////////////////////////////////////
    }
    else {
	    return log("Работа прекращена");
    }
};

///////////////////////////////////////////METHODS///////////////////////////////////////////////////
/**
 * @description to generate grades from 1-100, pushing to gradeArr with gradeQnty times
 * initiates new Student, using Constructor Student
 *@param {number} groupQnty - quantity of students in group
 *@param {number} gradeQnty - number of grades for each student
 *
 * */
function initConstructor(groupQnty, gradeQnty) {
    var gradeQnty = gradeQnty;
    for (let i = 0; i < groupQnty; i++) {
        let gradeArr = renderArr(gradeQnty);
        /*log(gradeArr);*/
        let student = new Student(gradeArr);
        /*log(student);*/
    }
}

/**
 * @description Constructor which pushes new students in its .prototype property
 *@param {array} gradeArr - array of newly randomized grades
 * *
 * */
function Student(gradeArr) {
    if (!Student.stack) {
        Student.stack = [];
    }
    this.gradeArr = gradeArr;
	this.name = "name_" + (Student.stack.length + 1); //getting rid of "student_0"
	this.surname = "surname_" + (Student.stack.length + 1);
	Student.stack.push(this);

	/////////STATIC METHODS////////////
    Student.group = function() {
        return Student.stack;
    };

    Student.list = function() {
        sortGroupArr(Student.stack, "name");   //sorting the Arr of students by "name"
        for(let i = 0; i < Student.stack.length; i++) {
            log(Student.stack[i].getFullName() + ":: средняя оценка: " + (Student.stack[i].getAvgGrade()).toFixed(2));
        }
    };

    Student.gradeSort = function() {
        sortGroupArr(Student.stack, "gradeArr");   //sorting the Arr of students by "grade"
        for(let i = 0; i < Student.stack.length; i++) {
            log(Student.stack[i].getFullName() + ":: средняя оценка: " + (Student.stack[i].getAvgGrade()).toFixed(2));
        }
    };

    Student.getAvrGroupGrade = function () {
        let sum = 0;
        Student.stack.forEach(function (obj) {
            sum += obj.getAvgGrade();
        });
        return (Math.round((sum / Student.stack.length)*100) / 100).toFixed(2);
    };

    //to get the best student with the index '0' from preliminary sorted array of group suffers time for sorting array...
    //so, making method for comparing avgGrade to each object student
    Student.getBest = function () {
        let maxGrade = 0;
        let index = 0;
        for (let i = 0; i < Student.stack.length; i++) {
            if (maxGrade > Student.stack[i].getAvgGrade()) {
                index = i;
            }
        }
        return Student.stack[index].getFullName() + ":: средняя оценка: " + (Student.stack[index].getAvgGrade()).toFixed(2);
    };

    Student.getWorst = function () {
        let minGrade = 100;
        let index = 0;
        for (let i = 0; i < Student.stack.length; i++) {
            if (minGrade > Student.stack[i].getAvgGrade()) {
                index = i;
            }
        }
        return Student.stack[index].getFullName() + ":: средняя оценка: " + (Student.stack[index].getAvgGrade()).toFixed(2);
    };

    /////////////////////.PROTOTYPE METHODS /////////////////////////
    Student.prototype.getFullName = function () {
        if (this.name && this.surname) {
            return this.name + " " + this.surname;
        }
    };

    Student.prototype.getAvgGrade = function () {
        if (this.gradeArr) {
            return avgArr(this.gradeArr);
        }
    };

    Student.prototype.setGrade = function (value) {
        if (this.gradeArr && arguments.length) {
            this.gradeArr.push(value);
        }
    };

    Student.prototype.whatGrades = function () {
        if (this.gradeArr) {
            return (this.gradeArr.join(", "));
        }
    };

}   //END OF CONSTRUCTOR STUDENT

function sortGroupArr(arr, attr) {
    let objArr = arr;
    let compare = "";
    switch (attr) {
        case "name": {
            compare = function (obj1, obj2) {
                return obj1["name"].toLowerCase() > obj2["name"].toLowerCase();
            };
            break;
        }
        case "gradeArr": {
            compare = function (obj1, obj2) {
                return obj2.getAvgGrade() - obj1.getAvgGrade();
            };
            break;
        }
        default: {
            log("no param in object");
            break;
        }
    }
    objArr.sort(compare);
}

//////////////OPTION SUGAR//////////////////
function log(content) {
	console.log(content);
}

function isIntegerCycle (title, sample) {
    let string;
    do {
        string = prompt("Введите " + title, sample);
        if (string == null) {
            let conf = confirm("Вы хотите выйти?");
            if (conf) {
                return false;
            }
        }
    } while (!+string && string !== "0");
    return +(string);
}

function ending(n, option) {    //ending for numerics ("элемент", "элемента", "элементов")
    return option[(n%10 === 1 && n%100 !== 11) ? 0 : n%10 >= 2 && n%10 <= 4 && (n%100 < 10 || n%100 >= 20) ? 1 : 2];
}

function randomize(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function renderArr(elQnty) {
    let arr = [];
    for (let i = 0; i < elQnty; i++) {
        arr.push(randomize(100,1));
    }
    return arr;
}

function avgArr(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return Math.round((sum / arr.length)*100) / 100;    //getting 2 digits in decimals
}