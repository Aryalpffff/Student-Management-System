let students = JSON.parse(localStorage.getItem("students")) || [];
let currentPage = 1;
const studentsPerPage = 5;

document.getElementById("student-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const grade = document.getElementById("grade").value;
    const studentId = document.getElementById("student-id").value;

    const student = { firstName, lastName, grade, studentId };
    students.push(student);
    localStorage.setItem("students", JSON.stringify(students));

    document.getElementById("student-form").reset();
    renderStudents();
    updateStats();
});

function renderStudents() {
    const start = (currentPage - 1) * studentsPerPage;
    const end = start + studentsPerPage;
    const currentStudents = students.slice(start, end);

    const studentList = document.getElementById("student-list");
    studentList.innerHTML = "";
    currentStudents.forEach((student, index) => {
        const li = document.createElement("li");
        li.classList.add("student-item");

        // Check if grade is less than 10 and apply the red class
        const gradeClass = student.grade < 10 ? 'grade-low' : '';

        li.innerHTML = `
            <p><strong>${student.firstName} ${student.lastName}</strong></p>
            <p class="${gradeClass}">نمره: ${student.grade}</p>
            <p>شماره دانشجویی: ${student.studentId}</p>
            <button class="edit-btn" onclick="editStudent(${start + index})">ویرایش</button>
            <button class="delete-btn" onclick="deleteStudent(${start + index})">حذف</button>
        `;
        studentList.appendChild(li);
    });

    renderPagination();
}

function deleteStudent(index) {
    students.splice(index, 1);
    localStorage.setItem("students", JSON.stringify(students));
    renderStudents();
    updateStats();
}

function editStudent(index) {
    const student = students[index];
    document.getElementById("first-name").value = student.firstName;
    document.getElementById("last-name").value = student.lastName;
    document.getElementById("grade").value = student.grade;
    document.getElementById("student-id").value = student.studentId;

    deleteStudent(index);
}

function searchStudents() {
    const searchTerm = document.getElementById("search").value.toLowerCase();
    const filteredStudents = students.filter(student => {
        return student.firstName.toLowerCase().includes(searchTerm) ||
            student.lastName.toLowerCase().includes(searchTerm) ||
            student.studentId.toString().includes(searchTerm);
    });
    renderFilteredStudents(filteredStudents);
}

function renderFilteredStudents(filteredStudents) {
    const studentList = document.getElementById("student-list");
    studentList.innerHTML = "";
    filteredStudents.forEach((student, index) => {
        const li = document.createElement("li");
        li.classList.add("student-item");

        // بررسی نمره زیر 10 و اعمال اعلان قرمز
        const gradeClass = student.grade < 10 ? 'grade-low' : '';

        li.innerHTML = `
            <p><strong>${student.firstName} ${student.lastName}</strong></p>
            <p class="${gradeClass}">نمره: ${student.grade}</p>
            <p>شماره دانشجویی: ${student.studentId}</p>
        `;
        studentList.appendChild(li);
    });
}

function renderPagination() {
    const totalPages = Math.ceil(students.length / studentsPerPage);
    let pagination = "";

    for (let i = 1; i <= totalPages; i++) {
        pagination += `<button onclick="goToPage(${i})">${i}</button>`;
    }

    document.getElementById("pagination").innerHTML = pagination;
}

function goToPage(page) {
    currentPage = page;
    renderStudents();
}

function updateStats() {
    const totalStudents = students.length;
    const totalGrade = students.reduce((acc, student) => acc + Number(student.grade), 0);
    const highGradeStudents = students.filter(student => student.grade >= 15).length;

    const averageGrade = totalStudents === 0 ? 0 : (totalGrade / totalStudents).toFixed(2);

    document.getElementById("student-count").textContent = `تعداد دانش‌آموزان: ${totalStudents}`;
    document.getElementById("average-grade").textContent = `میانگین نمرات: ${averageGrade}`;
    document.getElementById("high-grade-students").textContent = `دانش‌آموزان با نمره بالا (۱۵ به بالا): ${highGradeStudents}`;
}

// بارگذاری اولیه داده‌ها
renderStudents();
updateStats();
