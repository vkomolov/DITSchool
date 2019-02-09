window.addEventListener("DOMContentLoaded", () => {
    const fetchedArr = [
        {name: 'Ivan', surname: 'Ivanov', grades: [4,5,5]},
        {name: 'Semen', surname: 'Semenov', grades: [3,5,5]},
        {name: 'Petr', surname: 'Petrov', grades: [4,3,5]}
    ];

    //Classes cannot be used before initialized, to use `em higher in code - they will be packed in the function
    initStudents(fetchedArr);
});

//////////////FUNCTIONS
function initStudents(objArr) {
    class Student {
        constructor (obj) {
            for (let prop in obj) {
                this[prop] = obj[prop];
            }
            Student.groupArr.push(this);
        }
        get fullName() {
            return `${this.name} ${this.surname}`;
        }
        get gradesAvarage() {
            let avgGrade = (this.grades.reduce((a, b) => a + b, 0)) / this.grades.length;
            avgGrade = Math.round(avgGrade * 100) / 100;
            return avgGrade.toFixed(2); //for nums like 4 to show 4.00
        }

        static get group() {
            return Student.groupArr;
        }
        static showAllStudents() {
            Student.groupArr.sort((a, b) => b.gradesAvarage - a.gradesAvarage);
            let times = Student.groupArr.length;
            function* listStudents(times) {
                for (let i = 0; i < times; i++) {
                    yield `${Student.groupArr[i].fullName}. Average grade = ${Student.groupArr[i].gradesAvarage}`;
                }
            }
            return [...listStudents(times)];
        }
        static showBestStudent() {
            Student.groupArr.sort((a, b) => b.gradesAvarage - a.gradesAvarage);
            let best = Student.groupArr[0];
            return `${best.fullName} - the best student. The average grade = ${best.gradesAvarage}`;
        }
        static bestStudent() {
            Student.groupArr.sort((a, b) => b.gradesAvarage - a.gradesAvarage);
            return Student.groupArr[0];
        }
    }
    Student.groupArr = [];

    objArr.forEach((obj) => {
        let student = new Student(obj);
    });
    console.log(Student.group);
    console.log(Student.showAllStudents());
    console.log(Student.showBestStudent());
    console.log(Student.bestStudent());
    console.log(Student.groupArr[0].fullName);
    console.log(Student.groupArr[0].gradesAvarage);
}

///DEV
function log(item) {
    console.log(item);
}
function ping() {
    console.log(true);
}