const subjects = [];

document.getElementById("subjectGrade").addEventListener("change", function () {
  const selectedOption = this.options[this.selectedIndex];
  const gpa = selectedOption.dataset.gpa;
  document.getElementById("subjectGPA").value = gpa;
});

function addSubject() {
  const subjectName = document.getElementById("subjectName").value;
  const subjectGrade = document.getElementById("subjectGrade").value;
  const subjectGPA = document.getElementById("subjectGrade").selectedOptions[0].getAttribute("data-gpa");

  if (subjectName && subjectGrade && subjectGPA) {
    // Create a subject object and push it to the subjects array
    const subject = {
      name: subjectName,
      grade: subjectGrade,
      gpa: subjectGPA
    };

    subjects.push(subject);  // Push the subject to the array

    // Create a new element to display the subject
    const subjectItem = document.createElement("div");
    subjectItem.classList.add("subject-item");
    subjectItem.setAttribute("data-index", subjects.length - 1);  // Store the index of the subject
    subjectItem.innerHTML = `
      <p>Subject: ${subjectName}, Grade: ${subjectGrade}, GPA: ${subjectGPA}</p>
      <button onclick="editSubject(${subjects.length - 1})">Edit</button>
      <button onclick="deleteSubject(${subjects.length - 1})">Delete</button>
    `;

    // Append the subject item to the subject list
    const subjectList = document.getElementById("subjectList");
    subjectList.appendChild(subjectItem);

    // Clear the input fields after adding the subject
    document.getElementById("subjectName").value = "";
    document.getElementById("subjectGrade").value = "";
    document.getElementById("subjectGPA").value = "";  // Clear GPA field
  } else {
    alert("Please select a subject, grade, and GPA.");
  }
}

function editSubject(index) {
  const subject = subjects[index];

  // Pre-fill the form fields with the subject's current details
  document.getElementById("subjectName").value = subject.name;
  document.getElementById("subjectGrade").value = subject.grade;
  document.getElementById("subjectGPA").value = subject.gpa;

  // Remove the subject from the list
  deleteSubject(index);
}

function deleteSubject(index) {
  // Remove the subject from the subjects array
  subjects.splice(index, 1);

  // Re-render the subject list
  const subjectList = document.getElementById("subjectList");
  subjectList.innerHTML = "";  // Clear the existing list
  subjects.forEach((subject, i) => {
    const subjectItem = document.createElement("div");
    subjectItem.classList.add("subject-item");
    subjectItem.setAttribute("data-index", i);  // Store the index of the subject
    subjectItem.innerHTML = `
      <p>Subject: ${subject.name}, Grade: ${subject.grade}, GPA: ${subject.gpa}</p>
      <button onclick="editSubject(${i})">Edit</button>
      <button onclick="deleteSubject(${i})">Delete</button>
    `;
    subjectList.appendChild(subjectItem);
  });
}

function calculateGPA() {
  let totalGPA = 0;
  let subjectCount = 0;

  subjects.forEach(subject => {
    totalGPA += parseFloat(subject.gpa);
    subjectCount++;
  });

  if (subjectCount === 0) {
    alert("Please add at least one subject.");
    return;
  }

  const avgGPA = totalGPA / subjectCount;
  const percentage = (avgGPA / 4) * 100;

  // Determine Pass/Fail based on GPA (threshold of 2.0 for Pass)
  const status = avgGPA >= 2.0 ? "Pass" : "Fail";

  // Define motivational message based on Pass/Fail status
  let motivationalMessage;
  if (status === "Pass") {
    motivationalMessage = "Great job! Keep up the good work!";
  } else {
    motivationalMessage = "Don't worry, keep pushing! You'll do better next time.";
  }

  const result = document.getElementById("output");
  result.innerHTML = `
    Total Subjects: ${subjectCount} <br>
    Average GPA: ${avgGPA.toFixed(2)} <br>
    Percentage: ${percentage.toFixed(2)}% <br>
    Status: ${status} <br>
    Motivation: ${motivationalMessage}
  `;
  result.style.display = "block";
}

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Title and institution name
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(20);
  doc.text("Nepali GPA Report Card", 20, 30);

  // Plain text for the results
  const avgGPA = (subjects.reduce((sum, subj) => sum + parseFloat(subj.gpa), 0) / subjects.length).toFixed(2);
  const percentage = (avgGPA / 4) * 100;
  const status = avgGPA >= 2.0 ? "Pass" : "Fail";
  const motivationalMessage = status === "Pass" ? "Great job! Keep up the good work!" : "Don't worry, keep pushing! You'll do better next time.";

  doc.setFontSize(12);
  doc.text(`Total Subjects: ${subjects.length}`, 20, 50);
  doc.text(`Average GPA: ${avgGPA}`, 20, 60);
  doc.text(`Percentage: ${percentage.toFixed(2)}%`, 20, 70);
  doc.text(`Status: ${status}`, 20, 80);
  doc.text(`Motivation: ${motivationalMessage}`, 20, 90);

  // Save the document as PDF
  doc.save("Nepali_GPA_Report_Card.pdf");
}

function shareResult() {
  const resultText = document.getElementById("output").innerText;
  navigator.clipboard.writeText(resultText).then(() => {
    alert("Result copied to clipboard!");
  });
}

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

document.addEventListener("DOMContentLoaded", function () {
  // Apply saved theme from localStorage
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }

  // Sync checkbox toggle if exists
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.checked = savedTheme === "dark";
    themeToggle.addEventListener("change", toggleTheme);
  }

  setLoadingState(false);
});

// Updated to save theme in localStorage
function toggleTheme() {
  const isDark = document.body.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

function setLoadingState(isLoading) {
  const loadingScreen = document.getElementById("loading-screen");
  if (isLoading) {
    loadingScreen.style.display = "flex";
  } else {
    loadingScreen.style.display = "none";
  }
}
