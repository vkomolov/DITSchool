window.onload = function() {
    if(confirm("Приступим?")) {
        var student1 = new Student({name: 'Ivan', surname: 'Ivanov', grades: [4,5,5]});
        var student2 = new Student ({name: 'Semen', surname: 'Semenov', grades: [3,5,5]});
        var student3 = new Student ({name: 'Petr', surname: 'Petrov', grades: [4,3,5]});

//////////////////////////////////////////////////////////////////////////////////////////////
        log("//////////////////////////////////\n");
        log("Получаем массив студентов через 'Student.group()'");
        log(Student.group());
        log("\n");
        log("Метод любого студента '.getFullName()'");
        log(student2.getFullName());
        log("\n");
        log("Метод любого студента '.getAvgGrade()'");
        log(student3.getAvgGrade());
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
        log("Средний уровень оценок в группе через 'Student.getAvrGroupGrade()'");
        log(Student.getAvrGroupGrade());
        log("\n");
        log("Пробуем добавлять оценку '5' студенту через '.setGrade(5)'");
        student1.setGrade(5);
        log("Смотрим перечень оценок студента через .whatGrades");
        log(student1.whatGrades());
        /*log(student1.grades); //equal turn to one and the same object
        log(Student.groupArr[0].grades);*/ //equal
        log("\n");
        log("Средний уровень оценок в группе через 'Student.getAvrGroupGrade()'");
        log(Student.getAvrGroupGrade());
        log("Средний балл по группе стал выше");
        log("\n");
    }
};
/**@description to create obj from attr values. To collect .prototype methods and to collect objects made
 * */
function Student(obj) {
    if (!Student.groupArr) {
        Student.groupArr = [];
    }
    this.name = obj.name;
    this.surname = obj.surname;
    this.grades = obj.grades;

    Student.groupArr.push(this); //pushing not attr obj, but 'this'

    Student.group = function() {
        return Student.groupArr;
    };

    Student.list = function() {
        sortGroupArr(Student.groupArr, "name");   //sorting the Arr of students by "name"
        for(let i = 0; i < Student.groupArr.length; i++) {
            log(Student.groupArr[i].getFullName() + ":: средняя оценка: " + (Student.groupArr[i].getAvgGrade()).toFixed(2));
        }
    };

    Student.gradeSort = function() {
        sortGroupArr(Student.groupArr, "gradeArr");   //sorting the Arr of students by "grade"
        for(let i = 0; i < Student.groupArr.length; i++) {
            log(Student.groupArr[i].getFullName() + ":: средняя оценка: " + (Student.groupArr[i].getAvgGrade()).toFixed(2));
        }
    };

    //to get the best student with the index '0' from preliminary sorted array of group suffers time for sorting array...
//so, making cycles for comparing avgGrade to each object student
    Student.getBest = function () {
        let maxGrade = 0;
        let index = 0;
        for (let i = 0; i < Student.groupArr.length; i++) {
            if (maxGrade > Student.groupArr[i].getAvgGrade()) {
                index = i;
            }
        }
        return Student.groupArr[index].getFullName() + ":: средняя оценка: " + (Student.groupArr[index].getAvgGrade()).toFixed(2);
    };

    Student.getWorst = function () {
        let minGrade = 100;
        let index = 0;
        for (let i = 0; i < Student.groupArr.length; i++) {
            if (minGrade > Student.groupArr[i].getAvgGrade()) {
                index = i;
            }
        }
        return Student.groupArr[index].getFullName() + ":: средняя оценка: " + (Student.groupArr[index].getAvgGrade()).toFixed(2);
    };

    Student.getAvrGroupGrade = function () {
        let sum = 0;
        Student.groupArr.forEach(function (obj) {
            sum += obj.getAvgGrade();
        });
        return (Math.round((sum / Student.groupArr.length)*100) / 100).toFixed(2);
    };

    function sortGroupArr(arr, attr) {
        let objArr = arr;
        let compare = "";
        switch (attr) {
            case "name": {
                compare = function (obj1, obj2) {
                    return obj1["name"].toLowerCase() > obj2["name"].toLowerCase();  //TO DO additional numeric sort for string value tales (1,15,2..)
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

//////////////INNER PROTOTYPE FUNCTIONS//////////// inside the Constuctor Scope to use methods higher in code

    Student.prototype.getFullName = function () {
        if (this.name && this.surname) {
            return this.name + " " + this.surname;
        }
    };

    Student.prototype.getAvgGrade = function () {
        if (this.grades) {
            return avgArr(this.grades);
        }
    };

    Student.prototype.setGrade = function (value) {
        if (this.grades && arguments.length) {
            this.grades.push(value);
        }
    };

    Student.prototype.whatGrades = function () {
        if (this.grades) {
            return (this.grades.join(", "));
        }
    };

///////////////////////////////////END OF CONSTRUCTOR METHODS////////////////////////////////////
}



//////////////OPTION SUGAR//////////////////
function log(content) {
    console.log(content);
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