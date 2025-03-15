import { globalVars } from './timetable-support.js';
// Destructure the properties from the globalVars object
let {
    editSub,
    editTeacher,
    sortableIsActive,
    slotsExistInNonLectureFormat,
    clashMap,
} = globalVars;
window.clashMap = clashMap;
// add '' and 'SLOTS' in slotsExistInNonLectureFormat
// Assuming slotsExistInNonLectureFormat is a Set
slotsExistInNonLectureFormat.add('');
slotsExistInNonLectureFormat.add('SLOTS');
var lastMerge = null;
// ********************* Global Functions *********************

// ================== Sign in/Sign up ==================
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut,onAuthStateChanged} from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';


// Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyCqmS3KQq0P7EaiDknKZqZQe5nULWtOXf0',
    authDomain: 'ffcs-planner.firebaseapp.com',
    projectId: 'ffcs-planner',
    storageBucket: 'ffcs-planner.appspot.com',
    messagingSenderId: '552827627156',
    appId: '1:552827627156:web:a12e6d0c3a7fc11e89f681',
    measurementId: 'G-CEW2B6Z6MQ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app); // Firestore database reference


const userOptDiv = document.getElementById('user-opt');
const login = document.getElementById('login-btn');
// Create GoogleAuthProvider instance
const provider = new GoogleAuthProvider();

let userEmail = null;
onAuthStateChanged(auth, async (user) => {
    if (user) {
        userEmail = user.email;
        // Show user options and hide login button after successful login
        showUserOpt();
        login.style.display = 'none';
        // console.log('User already signed in: ', user.displayName);
        // // Show the user options div and hide the login button
        // const userDocSnapTable = await getUserTablePref(user.email); // Await the promise
        // const userDocRef = doc(db, 'users_tablepref', user.email);
        // if (userDocSnapTable !== false) {
        //     console.log('User data found:', userDocSnapTable);
        //     if (JSON.stringify(userDocSnapTable) === JSON.stringify(timetableStoragePref)) {
        //         return;
        //     } else {
        //         // Update the user's tablepref field
        //         const newData = JSON.stringify(mergeTables(userDocSnapTable, timetableStoragePref))
                
        //         await updateUserData(newData); // Await the update
        //         timetableStoragePref = JSON.parse(newData.tablepref);
        //         location.reload();
        //     }
        // } else {
        //     // Create a new user document if it doesn't exist
        //     const initialData = {
        //         tablepref: JSON.stringify(timetableStoragePref),
        //     };
        //     await setDoc(userDocRef, initialData);
        //     console.log('New user document created');
        // }
        
    } else {
        console.log('No user is signed in.');
        // Hide the user options div and show the login button
        hideUserOpt();
        login.style.display = 'block';
    }
});

function showUserOpt() {
    try {
        const userOptDiv = document.getElementById('user-opt');
        if (userOptDiv) {
            userOptDiv.style.setProperty('display', 'block', 'important');
        } else {
            throw new Error('Element with id "user-opt" not found');
        }
    } catch (error) {
        console.error('Error in showing user options div:', error);
    }
}

// Function to update the tablepref field in the user's document
const updateUserData = async (newTablePref) => {
    if (!userEmail) {
        console.error('No user logged in. Cannot update data.');
        return;
    }
    const userDocRef = doc(db, 'users_tablepref', userEmail);
    console.log('Updating user data...', lastMerge,'\n\n', newTablePref);
    // if (JSON.stringify(newTablePref) === JSON.stringify(lastMerge)) {
    //     console.log('No changes to user data');
    //     return;
        
    // }
    try {
        await updateDoc(userDocRef, { tablepref: JSON.stringify(newTablePref) });
        lastMerge = await getUserTablePref(userEmail);
        console.log('User data updated successfully');
    } catch (error) {
        console.error('Error updating user data:', error);
    }
};

// Function to hide the div
function hideUserOpt() {
    try {
        const userOptDiv = document.getElementById('user-opt');
        if (userOptDiv) {
            userOptDiv.style.setProperty('display', 'none', 'important');
        } else {
            throw new Error('Element with id "user-opt" not found');
        }
    } catch (error) {
        console.error('Error in hiding user options div:', error);
    }
}
// Function to handle sign-in
async function getUserTablePref(userEmail) {
    const userDocRef = doc(db, 'users_tablepref', userEmail);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const tablePref = userData.tablepref; // Access the tablepref field
        return JSON.parse(tablePref); // Do something with tablePref
    } else {
        return false;
    }
}

const mergeTables = (userTables, newTables) => {
    try {
        if (!Array.isArray(userTables)) {
            userTables = JSON.parse(userTables);
        }

        if (!Array.isArray(newTables)) {
            newTables = JSON.parse(newTables);
        }

        if (newTables.length === 1) {
            if (newTables[0].name === "Default Table" && Object.keys(newTables[0].subject).length === 0) {
                return userTables;
            }
        }

        const mergedTables = [...userTables];
        const tableNameSet = new Set(userTables.map(table => table.name));

        newTables.forEach(newTable => {
            let tableName = newTable.name;
            let counter = 1;

            // Ensure the table name is unique
            while (tableNameSet.has(tableName)) {
                tableName = `${newTable.name} ${counter}`;
                counter++;
            }

            // Add the unique table name to the set
            tableNameSet.add(tableName);

            // Update the table name and add to mergedTables
            mergedTables.push({
                ...newTable,
                name: tableName,
                id: mergedTables.length // Update the ID to be sequential
            });
        });

        return mergedTables;
    } catch (error) {
        console.error('Error merging tables:', error);
        return userTables; // Return the original userTables in case of an error
    }
};

const handleLogin = () => {
    signInWithPopup(auth, provider)
        .then(async (result) => {
            const user = result.user;
            console.log('Signed in as: ', user.email);
            // Try to get the user's document's field data from Firestore
            const userDocSnapTable = await getUserTablePref(user.email); // Await the promise
            const userDocRef = doc(db, 'users_tablepref', user.email);
            if (userDocSnapTable !== false) {
                console.log('User data found:', userDocSnapTable);
                if (JSON.stringify(userDocSnapTable) === JSON.stringify(timetableStoragePref)) {
                    return;
                } else {
                    // Update the user's tablepref field
                    const newData=mergeTables(userDocSnapTable, timetableStoragePref);
                    await updateUserData(newData); // Await the update
                    console.log("newData",newData)
                    timetableStoragePref = newData;
                    lastMerge = await getUserTablePref(user.email);
                    updateLocalForage();
                    location.reload();
                }
            } else {
                // Create a new user document if it doesn't exist
                const initialData = {
                    tablepref: JSON.stringify(timetableStoragePref),
                };
                await setDoc(userDocRef, initialData);
                lastMerge = await getUserTablePref(user.email);
                console.log('New user document created');
            }
            // Show user options and hide login button after successful login
            showUserOpt();
            login.style.display = 'none';
        })
        .catch((error) => {
            console.error('Login error: ', error);
            // Hide user options and show login button if login fails
            hideUserOpt();
            login.style.display = 'block';
        });
};
// Wait for DOM to load and then bind the login event
window.addEventListener('load', () => {
    const loginButton = document.getElementById('login-btn');
    const userOptDiv = document.getElementById('user-opt'); // Ensure this targets the correct div
    const loginDiv = loginButton; // Ensure this targets the correct login div

    if (loginButton) {
        loginButton.addEventListener('click', handleLogin);
    }
});
// Function to handle sign-out
const handleLogout = () => {
    signOut(auth)
        .then(() => {
            console.log('User signed out successfully.');
            login.style.display = 'block'; // Show login button if no user is signed in
            userOptDiv.style.display = 'none';
        })
        .catch((error) => {
            console.error('Error signing out: ', error);
            login.style.display = 'none'; // Show login button if no user is signed in
            userOptDiv.style.display = 'block';
        });
};

// Add event listener to the logout link
document.getElementById('logout-link').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the default link behavior
    handleLogout();
});


// ------------------ Firebase Auth Ends Here ------------------


// ================== Basic ==================
function openModalConditionallyForMultipleTeacher() {
    var selectElement = document.getElementById('course-select-add-teacher');
    const spanTeacherAddSuccess = document.getElementById('span-teacher-add');
    if (
        selectElement.value !== '' &&
        selectElement.value !== 'Select Course' &&
        selectElement.value !== 'You need to add courses'
    ) {
        // Manually open the modal if the condition is met
        var modal = new bootstrap.Modal(
            document.getElementById('multiple-teacher-modal'),
        );
        modal.show();
    } else {
        // Hide the 'hide_br' element
        document.getElementById('hide_br').style.display = 'none';
        // Set the error message properties
        spanTeacherAddSuccess.style.color = 'red'; // Assuming 'red' is the error message color
        spanTeacherAddSuccess.style.fontWeight = 'bolder';
        spanTeacherAddSuccess.textContent =
            'Please select a course before adding.';
        // After 5 seconds, clear the message and show 'hide_br' again
        setTimeout(() => {
            spanTeacherAddSuccess.textContent = '';
            document.getElementById('hide_br').style.display = 'inline';
        }, 5000);
    }
}
function parseTextToListForMultipleAdd(text) {
    // Split the input text by new lines
    const lines = text.trim().split('\n');

    // Map each line to an array of values
    const resultList = lines.map((line) => {
        // Split each line by tabs or multiple spaces
        const values = line.split(/\t+/);

        // Ensure each sublist has exactly 4 elements by filling missing values with empty strings
        while (values.length < 4) {
            values.push('');
        }

        return values;
    });

    return resultList;
}
function checkTeacherAndSlotsMatch(courseName, teacherName, slotString) {
    let slots = slotString.split('+');
    const teachers =
        timetableStoragePref[window.activeTable.id].subject[courseName].teacher;

    // Helper function to check if slots match
    function doSlotsMatch(teacherSlots, inputSlots) {
        const lowerCaseInputSlots = inputSlots.map((slot) =>
            slot.toLowerCase(),
        );
        const lowerCaseTeacherSlots = teacherSlots.map((slot) =>
            slot.toLowerCase(),
        );
        return lowerCaseInputSlots.every((slot) =>
            lowerCaseTeacherSlots.includes(slot),
        );
    }

    // Recursive helper function to generate a unique name and check slots
    function generateUniqueNameAndCheckSlots(baseName, counter = 1) {
        let uniqueName = counter === 1 ? baseName : `${baseName} ${counter}`;
        const uniqueNameSlots = teachers[uniqueName]
            ? teachers[uniqueName].slots.split('+')
            : [];
        if (doSlotsMatch(uniqueNameSlots, slots)) {
            // If the slots match, return false
            return false;
        } else if (teachers.hasOwnProperty(uniqueName)) {
            // If the unique name already exists, check for slots merge property
            let Tslots = getTeacherSlots(courseName, teacherName);

            if (isTheory(Tslots) && !isTheory(slotString)) {
                if (isMorningTheory(Tslots) && !isMorningLab(slotString)) {
                    updateTeacherSlots(
                        courseName,
                        teacherName,
                        Tslots + '+' + slotString,
                    );
                    return true;
                } else if (
                    !isMorningTheory(Tslots) &&
                    isMorningLab(slotString)
                ) {
                    updateTeacherSlots(
                        courseName,
                        teacherName,
                        Tslots + '+' + slotString,
                    );
                    return true;
                }
            } else if (!isTheory(Tslots) && isTheory(slotString)) {
                if (isMorningTheory(slotString) && !isMorningLab(Tslots)) {
                    updateTeacherSlots(
                        courseName,
                        teacherName,
                        slotString + '+' + Tslots,
                    );
                    return true;
                } else if (
                    !isMorningTheory(slotString) &&
                    isMorningLab(Tslots)
                ) {
                    updateTeacherSlots(
                        courseName,
                        teacherName,
                        slotString + '+' + Tslots,
                    );
                    return true;
                }
            }
            //recurse with incremented counter
            return generateUniqueNameAndCheckSlots(baseName, counter + 1);
        } else {
            // If the unique name is truly unique and slots don't match, return the unique name
            return uniqueName;
        }
    }

    // Initial check for the provided teacher name
    if (
        doSlotsMatch(
            teachers[teacherName] ? teachers[teacherName].slots.split('+') : [],
            slots,
        )
    ) {
        // If the original teacher's slots match the input slots, return false
        return false;
    } else {
        // If the original teacher's slots don't match, attempt to generate a unique name
        return generateUniqueNameAndCheckSlots(teacherName);
    }
}
function isTheory(slots) {
    let slot = slots.split('+')[0];
    if (slot.match(/[A-KM-Z]\d+/)) {
        return true;
    }
    return false;
}
function isMorningTheory(slots) {
    let isMTheory = null;
    let slotArray = slots.split('+');
    for (let slot of slotArray) {
        slot = slot.trim();
        if (slot.includes('V')) {
            const num = parseInt(slot.slice(1));
            if (num === 1 || num === 2) {
                if (isMTheory === false) {
                    return null;
                }
                isMTheory = true;
            }
        } else if (slot.startsWith('L')) {
            const num = parseInt(slot.slice(1));
            if (num >= 1 && num <= 30) {
                if (isMTheory === true) {
                    return null;
                }
                isMTheory = false;
            } else {
                if (isMTheory === false) {
                    return null;
                }
                isMTheory = true;
            }
        } else if (slot.match(/[A-ULW-Z]\d+/)) {
            // Check if it's a theory slot and ends with '1' (morning theory)
            if (slot.endsWith('1')) {
                if (isMTheory === false) {
                    return null;
                }
                isMTheory = true;
            }
        }
    }
    return isMTheory;
}
function isMorningLab(slots) {
    let slot = slots.split('+')[0];
    if (slot.startsWith('L')) {
        // Check if it's a lab slot and is between L1 and L30 (morning lab)
        return parseInt(slot.slice(1)) <= 30;
    }
    return false;
}
function addTeacher(courseName, teacherName, slotsInput, venueInput) {
    slotsInput = slotsInput.trim();
    slotsInput = slotsInput.toUpperCase();
    const isMorning = isMorningTheory(slotsInput);
    if (isMorning == null) {
        return null;
    }
    if (!teacherName.endsWith(' (E)')) {
        if (!isMorning) {
            teacherName = teacherName + ' (E)';
        }
    }
    // Check if the course or teacher name is empty, skip adding the teacher
    if (
        courseName === 'Select Course' ||
        teacherName === '' ||
        teacherName === 'Teacher Name' ||
        teacherName === ''
    ) {
        return; // Skip adding the teacher
    }

    // Check if the course exists
    if (
        !timetableStoragePref[window.activeTable.id].hasOwnProperty(
            'subject',
        ) ||
        Object.keys(timetableStoragePref[window.activeTable.id].subject)
            .length === 0 ||
        !Object.keys(timetableStoragePref[window.activeTable.id].subject)
            .map((key) => key.toLowerCase())
            .includes(courseName.toLowerCase())
    ) {
        return false; // Skip adding the teacher if the course does not exist
    }

    // Check if the slot exists, if not, skip adding the teacher
    if (isSlotExist(slotsInput) === false) {
        return false;
    }

    // Check if the teacher already exists for the course
    // Extract the current list of teachers for the course

    const teachers = Object.keys(
        timetableStoragePref[window.activeTable.id].subject[courseName].teacher,
    ).map((key) => key.toLowerCase());
    // check if the slot is mornign theory or eve theory

    // Check if the teacher already exists for the course
    let uniqueName = checkTeacherAndSlotsMatch(
        courseName,
        teacherName,
        slotsInput,
    );
    if (uniqueName == false) {
        return false;
    }
    if (uniqueName == true) {
        return true;
    } else if (uniqueName) {
        teacherName = uniqueName;

        // If the slots or venue input is empty, use default values
        slotsInput = slotsInput === '' ? 'SLOTS' : slotsInput;
        venueInput = venueInput === '' ? 'VENUE' : venueInput;

        // Add the teacher to the timetableStoragePref
        timetableStoragePref[window.activeTable.id].subject[courseName].teacher[
            teacherName
        ] = {
            slots: slotsInput,
            venue: venueInput,
            color: document.getElementById('color1-select').value, // Assuming color input is always valid
        };

        // Update UI to reflect the newly added teacher
        const li = createTeacherLI({
            courseName: courseName,
            slots: slotsInput,
            venue: venueInput,
            color: document.getElementById('color1-select').value,
            teacherName: teacherName,
        });
        li.addEventListener('click', liClick);
        const dropdownDivs = document.querySelectorAll('.dropdown');
        for (let dropdownDiv of dropdownDivs) {
            const cname = dropdownDiv.querySelector('.cname');
            if (cname && cname.textContent === courseName) {
                const ul = dropdownDiv.querySelector('ul');
                if (ul && ul.tagName === 'UL') {
                    ul.appendChild(li);
                }
                break; // Exit the loop once we've found the matching element
            }
        }
        return true;
    }
}
function addMultipleTeacher() {
    // Get the textarea element
    const textarea = document.getElementById('teachers-multiple-input');
    const course = document.getElementById('course-select-add-teacher').value;
    // Parse the text in the textarea to a list of values
    const teacherList = parseTextToListForMultipleAdd(textarea.value);

    // Iterate over the list of values
    teacherList.forEach((values) => {
        // Destructure the values into individual variables
        const [slots, venue, faculty, ct] = values;

        // Call the addTeacher function with the individual values
        addTeacher(course, faculty, slots, venue);
    });

    // Clear the textarea after adding all teachers
    textarea.value = '';
    var spanTeacherAddSuccess = document.getElementById('span-teacher-add');
    document.getElementById('hide_br').style.display = 'none';
    // Set the error message properties
    spanTeacherAddSuccess.style.color = 'green';
    spanTeacherAddSuccess.style.fontWeight = 'bolder';
    spanTeacherAddSuccess.textContent = 'Teaches added successfully.';
    // After 5 seconds, clear the message and show 'hide_br' again
    setTimeout(() => {
        spanTeacherAddSuccess.textContent = '';
        document.getElementById('hide_br').style.display = 'inline';
    }, 5000);
    updateDataJsonFromCourseList();
    revertRerrange();
    rearrangeTeacherRefresh();
    updateLocalForage();
}

// To toggle the dropdown
function toggleDropdown(dropdownHeading) {
    if (editSub === false) {
        var dropdownList = dropdownHeading.nextElementSibling;
        dropdownList.classList.toggle('show');
        dropdownHeading.classList.toggle('open');
    }
}

// To hide the radio input from the dropdown
function removeInputFieldsInSection(sectionId) {
    var section = document.getElementById(sectionId);
    var listItems = section.querySelectorAll('li');

    listItems.forEach(function (item) {
        var inputField = item.querySelector('input');
        inputField.style.display = 'none';
    });
}
function getTeacherSlots(courseName, teacherName) {
    const timetable = timetableStoragePref[window.activeTable.id].subject;
    if (
        timetable.hasOwnProperty(courseName) &&
        timetable[courseName].teacher.hasOwnProperty(teacherName)
    ) {
        let l = timetable[courseName].teacher[teacherName].slots;
        return l;
    }
    return null;
}
function updateTeacherSlots(courseName, teacherName, newSlots) {
    newSlots = newSlots.trim();
    newSlots = newSlots.toUpperCase();
    newSlots = slotsProcessingForCourseList(newSlots).join('+');
    if (isSlotExist(newSlots) === false) {
        return false;
    }
    const timetable = timetableStoragePref[window.activeTable.id].subject;
    if (
        timetable.hasOwnProperty(courseName) &&
        timetable[courseName].teacher.hasOwnProperty(teacherName)
    ) {
        timetable[courseName].teacher[teacherName].slots = newSlots;
        return true;
    }
    return false;
}

// To close and open all dropdowns
function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-list').forEach((dropdownList) => {
        dropdownList.classList.remove('show');
        dropdownList.previousElementSibling.classList.remove('open');
    });
}
function openAllDropdowns() {
    document.querySelectorAll('.dropdown-list').forEach((dropdownList) => {
        dropdownList.classList.add('show');
        dropdownList.previousElementSibling.classList.add('open');
    });
}

// on click of button with id 'tt-subject-collapse'
// button : 'Collapse All'
function editPrefCollapse() {
    closeAllDropdowns();
}

// ------------------ Basic Ends Here ------------------

// ================== Get From Something ==================

// to get the courseList from subject area
function getCourseListFromSubjectArea() {
    var subjectArea = document.getElementById('subjectArea');
    var allSpan = subjectArea.querySelectorAll('.cname');
    var courseList = [];
    for (const span of allSpan) {
        courseList.push(span.innerText);
    }
    return courseList;
}

function getCourseDivInSubjectArea(courseName) {
    var subjectArea = document.getElementById('subjectArea');
    var allSpan = subjectArea.querySelectorAll('.cname');
    for (const span of allSpan) {
        if (span.innerText.toLowerCase() === courseName.toLowerCase()) {
            return span.parentElement.parentElement;
        }
    }
}

// to get the UL element
// UL containing teachert list of perticular course
function getUlInSubjectArea(courseName) {
    var courseName = courseName.trim().toLowerCase();
    var subjectArea = document.getElementById('subjectArea');
    var allSpan = subjectArea.querySelectorAll('.cname');
    for (const span of allSpan) {
        if (span.innerText.toLowerCase() === courseName) {
            return span.parentElement.parentElement.parentElement.parentElement.querySelector(
                'ul',
            );
        }
    }
}

// Function to find the li element of the teacher
function getTeacherLiInSubjectArea(courseName, teacherName) {
    var subjectArea = document.getElementById('subjectArea');
    var allSpan = subjectArea.querySelectorAll('.cname');

    for (const span of allSpan) {
        if (span.innerText.toLowerCase() === courseName.toLowerCase()) {
            var allLi =
                span.parentElement.parentElement.parentElement.nextElementSibling.querySelectorAll(
                    'li',
                );
            for (const li of allLi) {
                const allDiv = li.querySelectorAll('div');
                if (
                    allDiv[0].innerText.toLowerCase() ===
                    teacherName.toLowerCase()
                ) {
                    return li;
                }
            }
        }
    }
}

function parseCreditValue(input) {
    let number = parseFloat(input);
    if (!isNaN(number)) {
        if (number % 1 !== 0) {
            // Check if it's a float
            return Number(number.toFixed(1));
        }
        return parseInt(number, 10); // It's an integer
    }
    return 0;
}
// function to get credits from course name in subject area
function getCreditsFromCourseName(courseName) {
    var subjectArea = document.getElementById('subjectArea');
    var allSpan = subjectArea.querySelectorAll('.cname');
    for (const span of allSpan) {
        if (span.innerText.toLowerCase() === courseName.toLowerCase()) {
            return parseCreditValue(
                span.parentElement.parentElement
                    .querySelector('h4')
                    .innerText.replace('[', '')
                    .replace(']', ''),
            );
        }
    }
}

// to get courseCode and Course Title from
// courseName(CourseCode+CourseTitle)
function getCourseCodeAndCourseTitle(courseName) {
    var courseName = courseName.split('-');
    if (courseName.length > 1) {
        var courseCode = courseName[0].trim();
        var part2 = '';
        for (var i = 1; i < courseName.length; i++) {
            part2 += courseName[i].trim() + '-';
        }
        var courseTitle = part2.slice(0, -1);
    } else {
        var courseTitle = courseName[0].trim();
        var courseCode = '';
    }
    return [courseCode, courseTitle];
}

// course name from course data
// course data is the object of activeTable.data
function getCourseNameFromCourseData(courseData) {
    var courseName = '';
    if (courseData.courseCode === '') {
        courseName = courseData.courseTitle;
    } else {
        courseName = courseData.courseCode + '-' + courseData.courseTitle;
    }
    return courseName;
}

// Function to find/get tr element of the course
function getCourseTrInCourseList(courseName, teacherName) {
    var courseList = document.getElementById('courseList-tbody');
    var trElements = courseList.querySelectorAll('tr');
    for (const trElement of trElements) {
        var tempData = getCourseNameAndFacultyFromTr(trElement); // [courseName,faculty]
        if (tempData[0] === courseName) {
            if (teacherName) {
                if (tempData[1] === teacherName) {
                    return trElement;
                }
            } else {
                return trElement;
            }
        }
    }
}

// get course from tr
function getCourseNameAndFacultyFromTr(trElement) {
    var td = trElement.querySelectorAll('td');
    if (td[1].innerText === '') {
        var courseName = td[2].innerText;
    } else {
        var courseName = td[1].innerText + '-' + td[2].innerText;
    }

    return [courseName, td[3].innerText];
}

// get the processed course name from input course name
// to process the raw course name from input field
function processRawCourseName(courseInput) {
    try {
        courseInput = courseInput.trim();
        courseInput = trimSign(courseInput, '-');
        var courseListStr = courseInput.split('-');
        let courseName = '';
        for (i = 0; i < courseListStr.length; i++) {
            if (courseListStr[i].trim() === '') {
                courseListStr.splice(i, 1);
            }
        }
        if (courseListStr.length > 1 && courseListStr[0] !== '') {
            var part2 = '';
            for (var i = 1; i < courseListStr.length; i++) {
                if (courseListStr[i].trim() !== '') {
                    part2 += '-' + courseListStr[i].trim();
                }
            }
            courseName = courseListStr[0].trim() + part2;
        } else {
            courseName = courseListStr[0].trim();
        }
        if (courseName) {
            courseName = trimSign(courseName, '-');
            courseName = courseName.replace(/\s+/g, ' ');
            return courseName;
        }
        return '';
    } catch (error) {
        return '';
    }
}

// ------------------ Get From Something Ends Here ------------------

// ================== Sortables ==================

// To activate and deactivate the sortable
function activateSortable() {
    // Detect whether the user is on a mobile device
    if (sortableIsActive === false) {
        sortableIsActive = true;
        var isMobile =
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent,
            );

        var leftBox = document.querySelector('.left-box');
        Sortable.create(leftBox, {
            animation: 150,
            delay: isMobile ? 170 : 5, // Different delay for mobile and desktop
            chosenClass: 'sortable-chosen',
        });

        var dropdownLists = document.querySelectorAll('.dropdown-list');
        dropdownLists.forEach((dropdownList) => {
            Sortable.create(dropdownList, {
                animation: 70,
                delay: isMobile ? 170 : 5, // Different delay for mobile and desktop
                chosenClass: 'sortable-chosen',
            });
        });
    }
}
function deactivateSortable() {
    if (sortableIsActive === true) {
        sortableIsActive = false;
        var leftBox = document.querySelector('.left-box');
        Sortable.get(leftBox).destroy();

        var dropdownLists = document.querySelectorAll('.dropdown-list');
        dropdownLists.forEach((dropdownList) => {
            Sortable.get(dropdownList).destroy();
        });
    }
}

// Sortable for course list after dropping should save that instance
function activateSortableForCourseList() {
    var isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent,
        );

    var courseList = document.querySelector('#course-list tbody');

    Sortable.create(courseList, {
        animation: 150,
        delay: isMobile ? 170 : 6, // Different delay for mobile and desktop
        chosenClass: 'sortable-chosen1',

        onEnd: function () {
            updateDataJsonFromCourseList();
            updateLocalForage();
        },
    });
}

// ------------------ Sortables Ends Here ------------------

// ================== Slots ==================

// from this function we got the ttDataStructureInLFormat
// Not in use, (Dead Function)
// to generate the ttDataStructureInLFormat use it when courselist is empty
// function getCourseTTDataObject() {
//     const timetableTable = document.querySelector('.table-bordered');
//     const rows = timetableTable.querySelectorAll('tr');

//     const timetable = {};

//     rows.forEach((row) => {
//         const cells = row.querySelectorAll('td.period'); // Only select cells with class 'period'

//         if (cells.length > 0) {
//             // Check if cells array is not empty
//             const day = cells[0].textContent.trim();

//             for (let i = 0; i < cells.length; i++) {
//                 // Start from 0 to include all periods
//                 const period = cells[i].textContent.trim();
//                 if (period) {
//                     const [course, lab] = period.split('/');
//                     const courseTrimmed = course ? course.trim() : '';
//                     const labTrimmed = lab ? lab.trim() : '';

//                     if (labTrimmed) {
//                         timetable[labTrimmed] = courseTrimmed;
//                     } else {
//                         timetable[courseTrimmed] = courseTrimmed;
//                     }
//                 }
//             }
//         }
//     });
//     return timetable;
// }

// check whether the slots exist in non lecture format
// if exist return true else false
function isSlotExist(slotsArray) {
    // if slotsArray is string convert it to array
    if (typeof slotsArray === 'string') {
        slotsArray = slotsProcessingForCourseList(slotsArray);
    }
    var result = true;
    slotsArray.forEach((slot) => {
        if (!slotsExistInNonLectureFormat.has(slot)) {
            result = false;
        }
    });
    return result;
}
// slots processing for course list
// for example param 'L1+L2+L3+L1' , return ['L1', 'L2', 'L3']
function slotsProcessingForCourseList(slotString) {
    var slots = (function () {
        var set = new Set();

        try {
            slotString.split(/\s*\+\s*/).forEach(function (el) {
                if (el && $('.' + el)) {
                    set.add(el);
                }
            });
        } catch (error) {
            set.clear();
        }

        return Array.from(set);
    })();
    return slots;
}

// function to update the array of slots if slot is in key of getCourseTTDataObject it will be replaced with its value
// No use of getCourseTTDataObject, clashMap is used
function updateSlots(slots) {
    var allSlots = slots;
    var thSlots = [];
    var labSlots = [];
    allSlots.forEach((slot) => {
        if (clashMap[slot]) {
            if (slot.includes('L')) {
                labSlots.push(slot);
            } else {
                thSlots.push(slot);
            }
            for (var i = 0; i < clashMap[slot].length; i++) {
                if (clashMap[slot][i].includes('L')) {
                    labSlots.push(clashMap[slot][i]);
                } else {
                    thSlots.push(clashMap[slot][i]);
                }
            }
        }
    });
    return thSlots.concat(labSlots);
}

// make the list of all slots in the activeTabe.data
function getSlots() {
    var slots = [];
    activeTable.data.forEach((el) => {
        el.slots.forEach((slot) => {
            if (slot === '' || slot === 'SLOTS') {
            } else {
                slots.push(slot);
            }
        });
    });
    slots = updateSlots(slots);
    return slots;
}

// get the slots of the course in activeTable.data with Course Name
function getSlotsOfCourse(courseName) {
    var slots = [];
    activeTable.data.forEach((el) => {
        const CourseNameData = getCourseNameFromCourseData(el);
        if (
            CourseNameData.toLocaleLowerCase() == courseName.toLocaleLowerCase()
        ) {
            el.slots.forEach((slot) => {
                if (slot === '' || slot === 'SLOTS') {
                } else if (!slots.includes(slot)) {
                    slots.push(slot);
                }
            });
        }
    });
    slots = updateSlots(slots);
    return slots;
}

// find the subtraction of two arrays
// Note: returns array2 - array1,
// prefered arr1 = getSlotsOfCourse, arr2 = getSlots()
function subtractArray(arr1, arr2) {
    //Array2 -Array1
    arr1.forEach((el) => {
        if (arr2.includes(el)) {
            let index = arr2.indexOf(el);
            if (index !== -1) {
                // Remove the first occurrence of the element using splice
                arr2.splice(index, 1);
            }
        }
    });
    return arr2;
}

// function to check is there any common slot between two arrays
function isCommonSlot(arr1, arr2) {
    var result = false;
    arr1.forEach((el) => {
        if (arr2.includes(el)) {
            result = true;
        }
    });
    return result;
}

// ------------------ Slots Ends Here ------------------

// ================== Build / Update ==================

function updateAttackDataOnCourseSave(oldCourseName, newCourseName, credits) {
    const courseTitle = getCourseCodeAndCourseTitle(newCourseName)[1];
    const courseCode = getCourseCodeAndCourseTitle(newCourseName)[0];
    activeTable.attackData.forEach((courseData) => {
        if (
            processRawCourseName(
                courseData.courseCode + '-' + courseData.courseTitle,
            ).toLocaleLowerCase() === oldCourseName.toLocaleLowerCase()
        ) {
            courseData.courseTitle = courseTitle;
            courseData.courseCode = courseCode;
            courseData.credits = credits;
        }
    });
    updateLocalForage();
}

function updateCourseList(courseTr, courseName, credits) {
    var td = courseTr.querySelectorAll('td');
    const courseTitle = getCourseCodeAndCourseTitle(courseName)[1];
    const courseCode = getCourseCodeAndCourseTitle(courseName)[0];
    td[1].innerText = courseCode;
    td[2].innerText = courseTitle;
    td[5].innerText = credits;
    updateDataJsonFromCourseList();
    var courseIdNum = courseTr.getAttribute('data-course');
    removeCourseFromTimetable(courseIdNum);
    updateLocalForage();
    courseIdNum = Number(courseIdNum.split(/(\d+)/)[1]);
    var activeData;

    if ($('#attack-toggle').is(':checked')) {
        activeData = activeTable.attackData;
    } else {
        activeData = activeTable.data;
    }
    for (var i = 0; i < activeData.length; ++i) {
        if (activeData[i].courseId == courseIdNum) {
            addCourseToTimetable(activeData[i]);
            break;
        }
    }
    updateCredits();
}

// Make input radio true on the bases of activeTable.data values
function makeRadioTrueOnPageLoad() {
    activeTable.data.forEach((courseData) => {
        if (courseData.courseCode === '') {
            var courseName = courseData.courseTitle;
        } else {
            var courseName =
                courseData.courseCode + '-' + courseData.courseTitle;
        }
        var faculty = courseData.faculty;
        var teacherLi = getTeacherLiInSubjectArea(courseName, faculty);
        teacherLi.querySelector('input[type="radio"]').checked = true;
    });
}

// Make Radio all radios false which were true according to activeTable.data
function makeRadioFalseOnNeed() {
    if (document.getElementById('attack-toggle').checked) {
        var dataToProcess = activeTable.attackData;
    } else {
        var dataToProcess = activeTable.data;
    }
    dataToProcess.forEach((courseData) => {
        if (courseData.courseCode === '') {
            var courseName = courseData.courseTitle;
        } else {
            var courseName =
                courseData.courseCode + '-' + courseData.courseTitle;
        }
        var faculty = courseData.faculty;
        var teacherLi = getTeacherLiInSubjectArea(courseName, faculty);
        teacherLi.querySelector('input[type="radio"]').checked = false;
    });
}

// Function to fill the timetable and course list/ subjectArea
function fillLeftBoxInCoursePanel() {
    const activeId = window.activeTable.id;
    const activeTable = timetableStoragePref[activeId];

    if (activeTable.subject && Object.keys(activeTable.subject).length > 0) {
        const leftBox = document.getElementById('subjectArea');
        leftBox.innerHTML = '';

        for (const courseName in activeTable.subject) {
            const subject = activeTable.subject[courseName];
            const dropdown = createSubjectDropdown(courseName, subject);
            leftBox.appendChild(dropdown);
        }
    } else {
        const leftBox = document.getElementById('subjectArea');
        leftBox.innerHTML = '';
    }
    rearrangeTeacherRefresh();
}

// to build the HTML for course/subject dropdown
// courseName is the key of activeTable.subject
// subject is the value of activeTable.subject
function createSubjectDropdown(courseName, subject) {
    const dropdown = document.createElement('div');
    dropdown.classList.add('dropdown');
    dropdown.classList.add('dropdown-teacher');

    const dropdownHeading = document.createElement('div');
    dropdownHeading.classList.add('dropdown-heading');
    dropdownHeading.setAttribute('onclick', 'toggleDropdown(this)');

    const h2sDiv = document.createElement('div');
    h2sDiv.classList.add('h2s');
    h2sDiv.style.display = 'flex';
    h2sDiv.style.flexDirection = 'row';

    const cName = document.createElement('span');
    cName.classList.add('cname');
    cName.innerText = courseName;
    const h2 = document.createElement('h2');
    h2.innerText = '';
    h2.appendChild(cName);

    const span = document.createElement('p');
    span.classList.add('arrow');

    const h4 = document.createElement('h4');
    h4.innerText = `[${subject.credits}]`;
    h2.appendChild(span);
    h2sDiv.appendChild(h2);
    h2sDiv.appendChild(h4);

    dropdownHeading.appendChild(h2sDiv);

    const dropdownList = document.createElement('ul');
    dropdownList.classList.add('dropdown-list');

    const allTeacherLi = constructTeacherLi(courseName, subject);
    allTeacherLi.forEach((li) => {
        dropdownList.appendChild(li);
    });
    dropdown.appendChild(dropdownHeading);
    dropdown.appendChild(dropdownList);

    return dropdown;
}

// To build the teacher li item from the teacher data
function createTeacherLI(teacherData) {
    const li = document.createElement('li');
    li.style.backgroundColor = teacherData.color;

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = teacherData.courseName;
    input.value = teacherData.teacherName;

    const teacherNameDiv = document.createElement('div');
    teacherNameDiv.style.paddingLeft = '4%';
    teacherNameDiv.style.width = '47%';
    teacherNameDiv.innerText = teacherData.teacherName;

    const slotsDiv = document.createElement('div');
    slotsDiv.style.width = '38%';
    slotsDiv.style.opacity = '70%';
    slotsDiv.innerText = teacherData.slots;

    const venueDiv = document.createElement('div');
    venueDiv.style.width = '15%';
    venueDiv.style.opacity = '70%';
    venueDiv.innerText = teacherData.venue;

    li.appendChild(input);
    li.appendChild(teacherNameDiv);
    li.appendChild(slotsDiv);
    li.appendChild(venueDiv);
    return li;
}

// to build the teacher li item from course name and subject element
// activeTable.subject['CourseName'] is the subject element
function constructTeacherLi(courseName, subject) {
    var result = [];
    for (const teacherName in subject.teacher) {
        var slotsInput = subject.teacher[teacherName].slots;
        var venueInput = subject.teacher[teacherName].venue;
        const colorInput = subject.teacher[teacherName].color;
        if (slotsInput === '') {
            slotsInput = 'SLOTS';
        }
        if (venueInput === '') {
            venueInput = 'VENUE';
        }
        const teacherData = {
            courseName: courseName,
            slots: slotsInput,
            venue: venueInput,
            color: colorInput,
            teacherName: teacherName,
        };
        const li = createTeacherLI(teacherData);
        result.push(li);
    }
    return result;
}

// to build the json format of current state of the subject area & save it
function createSubjectJsonFromHtml() {
    let result = {};
    let dropdowns = document.querySelectorAll('.dropdown-teacher');

    dropdowns.forEach((dropdown) => {
        let courseNameElement = dropdown.querySelector('h2 .cname');
        let courseName = courseNameElement
            ? courseNameElement.textContent
            : null;
        let credits = parseCreditValue(
            dropdown
                .querySelector('h4')
                .textContent.replace('[', '')
                .replace(']', ''),
        );
        let teachers = dropdown.querySelectorAll('li');

        let teacherData = {};

        teachers.forEach((teacher) => {
            let teacherName = teacher.querySelectorAll('div')[0].textContent;
            let slots = teacher.querySelectorAll('div')[1].textContent;
            let venue = teacher.querySelectorAll('div')[2].textContent;
            let color = teacher.style.backgroundColor;

            teacherData[teacherName] = {
                slots: slots,
                venue: venue,
                color: color,
            };
        });

        result[courseName] = {
            teacher: teacherData,
            credits: credits,
        };
    });
    timetableStoragePref[window.activeTable.id].subject = result;
    updateLocalForage();
}

// to create activeTable.data json from the course list and save
// the that instance of course list
function updateDataJsonFromCourseList() {
    let courseList = document.getElementById('courseList-tbody');
    let trElements = courseList.querySelectorAll('tr');
    if (document.getElementById('attack-toggle').checked) {
        activeTable.attackData = [];
        var activeData = activeTable.attackData;
    } else {
        activeTable.data = [];
        var activeData = activeTable.data;
    }

    trElements.forEach((trElement) => {
        let td = trElement.querySelectorAll('td');
        let courseName = td[2].innerText;
        let faculty = td[3].innerText;
        let courseCode = td[1].innerText;
        let slots = slotsProcessingForCourseList(td[0].innerText);
        let venue = td[4].innerText;
        let credits = parseCreditValue(td[5].innerText);
        let isProject = trElement.getAttribute('data-is-project');
        let dataCourseValue = trElement.getAttribute('data-course');
        let courseId = Number(dataCourseValue.split(/(\d+)/)[1]);

        let courseData = {
            courseId: courseId,
            courseTitle: courseName,
            faculty: faculty,
            slots: slots,
            venue: venue,
            credits: credits,
            isProject: isProject,
            courseCode: courseCode,
        };
        activeData.push(courseData);
    });
    updateLocalForage();
}

function updateTeacherInAttackDataOnTeacherSave(
    courseName,
    teacherNamePre,
    teacherName,
    slotsInput,
    venueInput,
) {
    activeTable.attackData.forEach((courseData) => {
        if (
            processRawCourseName(
                courseData.courseCode + '-' + courseData.courseTitle,
            ).toLocaleLowerCase() === courseName.toLocaleLowerCase()
        ) {
            if (
                teacherNamePre.toLowerCase() ===
                courseData.faculty.toLowerCase()
            ) {
                var slotsOfCourse = slotsInput.trim().split(/\s*\+\s*/);
                var activeSlots = slotsForAttack();
                var consideredSlots = subtractArray(
                    courseData.slots,
                    activeSlots,
                );
                if (isCommonSlot(slotsOfCourse, consideredSlots)) {
                    // delete this courseData from activeTable.attackData
                    var index = activeTable.attackData.indexOf(courseData);
                    activeTable.attackData.splice(index, 1);
                } else {
                    courseData.faculty = teacherName;
                    courseData.slots = slotsOfCourse;
                    courseData.venue = venueInput;
                }
            }
        }
    });
    updateLocalForage();
}

function updateTeacherInCourseList(
    trElementCourseList,
    teacherName,
    slotsInput,
    venueInput,
) {
    var td = trElementCourseList.querySelectorAll('td');
    td[3].innerText = teacherName;
    td[0].innerText = slotsInput;
    td[4].innerText = venueInput;
    updateDataJsonFromCourseList();
    var courseIdNum = trElementCourseList.getAttribute('data-course');
    removeCourseFromTimetable(courseIdNum);
    updateLocalForage();
    courseIdNum = Number(courseIdNum.split(/(\d+)/)[1]);
    for (var i = 0; i < activeTable.data.length; ++i) {
        if (activeTable.data[i].courseId == courseIdNum) {
            addCourseToTimetable(activeTable.data[i]);
            break;
        }
    }
}

// to build couse div in subject area
// used while adding new subject
function addSubDiv(subjectName, credits) {
    const div = document.createElement('div');
    div.classList.add('dropdown');
    div.classList.add('dropdown-teacher');
    const divHeading = document.createElement('div');
    divHeading.classList.add('dropdown-heading');
    divHeading.setAttribute('onclick', 'toggleDropdown(this)');
    const divH2s = document.createElement('div');
    divH2s.classList.add('h2s');
    divH2s.style.display = 'flex';
    divH2s.style.flexDirection = 'row';
    const h2 = document.createElement('h2');
    const spanCname = document.createElement('span');
    spanCname.c;
    lassList.add('cname');
    spanCname.textContent = subjectName;

    const pArrow = document.createElement('p');
    pArrow.classList.add('arrow');

    const h4 = document.createElement('h4');
    h4.textContent = `[${credits}]`;
    divH2s.appendChild(h2);
    divH2s.appendChild(h4);
    h2.appendChild(spanCname);
    h2.appendChild(pArrow);
    divHeading.appendChild(divH2s);
    div.appendChild(divHeading);
    const ul = document.createElement('ul');
    ul.classList.add('dropdown-list');
    div.appendChild(ul);
    document.getElementById('subjectArea').appendChild(div);
}
// ------------------ Build / Update Ends Here ------------------

// ================== Add / Remove ==================

// double click on tr of course list
function doubleClickOnTrOfCourseList() {
    // Get the course name and faculty from the tr element
    editPref();
    editPrefAddOn();
    var courseName_Faculty = getCourseNameAndFacultyFromTr(this);
    var courseName = courseName_Faculty[0];
    var faculty = courseName_Faculty[1];

    // Get the li element corresponding to the course name and faculty
    if (editSub === true) {
        closeAllDropdowns();
        document.getElementById('div-for-edit-teacher').style.display = 'none';
        document.getElementById('edit_msg_').style.display = 'block';
        document.getElementById('edit_msg_').innerText =
            'Click on the Course to edit it.';
        var div = getCourseDivInSubjectArea(courseName);
        div.click();
        div.focus();
    } else {
        var li = getTeacherLiInSubjectArea(courseName, faculty);
        closeAllDropdowns();
        li.parentElement.previousElementSibling.click();
        li.click();
        li.focus();
    }

    // scroll to the top
    window.scrollTo(0, 0);
}

// Add double click event listener to course list
function addEventListnerToCourseList() {
    // Get the course name and faculty from the tr element
    if (document.getElementById('attack-toggle').checked === true) {
        return;
    }
    var lastTouchTime = 0;
    var timeout;
    var eventTr;
    // try to remove all eventlistner from course list first
    document.querySelectorAll('#course-list tbody tr').forEach((tr) => {
        tr.removeEventListener('dblclick', doubleClickOnTrOfCourseList);
        tr.removeEventListener('click', handleClick);
    });

    function handleClick(event) {
        // Prevent the event listener from running if eventTr is already defined
        var currentTime = new Date().getTime();
        var tapLength = currentTime - lastTouchTime;

        clearTimeout(timeout);
        if (tapLength < 215 && tapLength > 0) {
            // Double tap action
            if (eventTr === event.target.parentElement) {
                doubleClickOnTrOfCourseList.call(eventTr);
            }
        } else {
            // Single tap action

            timeout = setTimeout(function () {
                clearTimeout(timeout);
            }, 215);
        }
        eventTr = event.target.parentElement;
        lastTouchTime = currentTime;
    }

    // on double click or double tap on tr element do something
    document.querySelectorAll('#course-list tbody tr').forEach((tr) => {
        tr.addEventListener('dblclick', doubleClickOnTrOfCourseList);
        tr.addEventListener('click', handleClick);
    });
}

// Targets the li to make it toggable when clicked anywhere on the li element eg the teacher name list
function addEventListeners() {
    var listItems = document.querySelectorAll('#subjectArea li');
    for (var i = 0; i < listItems.length; i++) {
        listItems[i].addEventListener('click', liClick);
    }
}

// Function to add to timetable and in course table when clicked on radio button
function addOnRadioTrue(radioButton) {
    var current = radioButton; // This radio button is now the currently selected one
    var courseToRemove =
        current.parentElement.parentElement.parentElement.querySelector(
            'h2 .cname',
        ).innerText;
    var courseTitle = getCourseCodeAndCourseTitle(courseToRemove)[1];
    var courseCode = getCourseCodeAndCourseTitle(courseToRemove)[0];
    courseRemove(courseToRemove);

    var faculty = current.parentElement.querySelectorAll('div')[0].innerText;
    var slotString = current.parentElement.querySelectorAll('div')[1].innerText;
    var venue = current.parentElement.querySelectorAll('div')[2].innerText;
    var credits = getCreditsFromCourseName(courseToRemove);

    var isProject = false;

    var slots = slotsProcessingForCourseList(slotString);
    var courseId = 0;
    if (activeTable.data.length != 0) {
        var lastAddedCourse = activeTable.data[activeTable.data.length - 1];
        courseId = lastAddedCourse.courseId + 1;
    }
    var courseData = {
        courseId: courseId,
        courseTitle: courseTitle,
        faculty: faculty,
        slots: slots,
        venue: venue,
        credits: credits,
        isProject: isProject,
        courseCode: courseCode,
    };
    activeTable.data.push(courseData);
    addCourseToCourseList(courseData);
    addCourseToTimetable(courseData);
    updateLocalForage();
}

// Function to remove all liClick event listeners from teacher li elements
function removeEventListeners() {
    var listItems = document.querySelectorAll('.dropdown li');
    for (var i = 0; i < listItems.length; i++) {
        listItems[i].removeEventListener('click', liClick);
    }
}

// delete from subject
function removeCourseFromSubject(dataCourseValue) {
    var activeData;

    if ($('#attack-toggle').is(':checked')) {
        activeData = activeTable.attackData;
    } else {
        activeData = activeTable.data;
    }
    var courseId = Number(dataCourseValue.split(/(\d+)/)[1]);
    for (var i = 0; i < activeData.length; ++i) {
        if (activeData[i].courseId == courseId) {
            activeData.splice(i, 1);
            break;
        }
    }
}

// Remove Course
// Removing all element related to that course code from tt and course list
function courseRemove(courseToRemove) {
    var courseList = document.getElementById('courseList-tbody');
    // Loop through each <tr> element and log the value of the data-course attribute
    var trElements = courseList.querySelectorAll('tr');
    trElements.forEach(function (trElement) {
        var dataCourseValue = trElement.getAttribute('data-course');
        var courseII = getCourseNameAndFacultyFromTr(trElement)[0];
        if (courseToRemove === courseII) {
            removeCourseFromTimetable(dataCourseValue);
            updateLocalForage();
            removeCourseFromCourseList(dataCourseValue);
            removeCourseFromSubject(dataCourseValue);
        }
    });
}

// Remove the course from time table on deselection of radio button
function removeRadioFalse(radioButton) {
    var courseToRemove =
        radioButton.parentElement.parentElement.parentElement.querySelector(
            'h2 .cname',
        ).innerText;
    courseRemove(courseToRemove);
}

// Removal of selection background (purple color on editing)
// Removal from course name dropdown
function selectBackgroundRemovalOfPreviousH2s() {
    let courseDiv = document.getElementById('div-for-edit-course');
    var courseNameToRemoveBlueFrom = courseDiv.querySelector(
        '#course-input-edit-pre',
    ).innerText;
    var courseDivPre = getCourseDivInSubjectArea(courseNameToRemoveBlueFrom);
    if (courseDivPre) {
        courseDivPre.classList.remove('select_background');
    }
}
// Removal from teacher list
function selectBackgroundRemovalOfPreviousLi() {
    let teacherDiv = document.getElementById('div-for-edit-teacher');
    var teacherNameToRemoveSelectFrom = teacherDiv.querySelector(
        '#teacher-input_remove-edit-pre',
    ).value;
    let courseNameOfRemovalTeacher = document.getElementById(
        'teacher-edit-course',
    ).value;
    var teacherDivPre = getTeacherLiInSubjectArea(
        courseNameOfRemovalTeacher,
        teacherNameToRemoveSelectFrom,
    );
    if (teacherDivPre) {
        teacherDivPre.classList.remove('select_background');
    }
}

// ------------------ Add / Remove Ends Here ------------------

// ================== Click ==================

// on click of button with id 'tt-subject-edit'
// button : 'Edit'
function editPrefAddOn() {
    activateSortable();
    document.getElementById('edit_msg_').style.display = 'block';
    document.getElementById('div-for-edit-teacher').style.display = 'none';
}
function editPref() {
    if ($('#attack-toggle').is(':checked')) {
        document.getElementById('attack-toggle').click();
    } else {
    }

    editTeacher = true;
    document.getElementById('tt-subject-edit').style.display = 'none';
    document.getElementById('tt-subject-add').style.display = 'none';
    document.getElementById('tt-teacher-add').style.display = 'none';
    document.getElementById('div-for-add-teacher').style.display = 'none';
    document.getElementById('div-for-add-course').style.display = 'none';
    document.getElementById('tt-subject-collapse').style.display = 'block';
    document.getElementById('tt-subject-done').style.display = 'block';
    document.getElementById('tt-sub-edit-switch-div').style.display = 'block';
    document.getElementById('edit_msg_').style.display = 'block';
    openAllDropdowns();
    removeEventListeners();
    revertRerrange();
    removeInputFieldsInSection('subjectArea');
    // Add event listeners to .h2s div elements
    document.querySelectorAll('.h2s').forEach((div) => {
        div.addEventListener('click', function () {
            if (editSub === true) {
                document.getElementById('edit_msg_').style.display = 'none';
                const subjectName = this.querySelector('.cname').innerText;
                let credit = this.querySelector('h4')
                    .innerText.replace('[', '')
                    .replace(']', '');
                credit = parseCreditValue(credit);
                let courseDiv = document.getElementById('div-for-edit-course');
                selectBackgroundRemovalOfPreviousH2s();
                // add class to this
                this.classList.add('select_background');

                courseDiv.style.display = 'block';
                courseDiv.querySelector('#course-input_edit').value =
                    subjectName;
                courseDiv.querySelector('#credits-input-edit').value = credit;
                courseDiv.querySelector('#course-input-edit-pre').innerText =
                    subjectName;
                courseDiv.querySelector('#credit-input-edit-pre').innerText =
                    credit;
            }
        });
    });

    // Add event listeners to li items
    document.querySelectorAll('li').forEach((li) => {
        li.addEventListener('click', function () {
            if (editSub === false && editTeacher === true) {
                document.getElementById('edit_msg_').style.display = 'none';
                document.getElementById('div-for-edit-teacher').style.display =
                    'block';
                var allDivInLi = this.querySelectorAll('div');
                const courseName =
                    this.parentElement.parentElement.querySelector(
                        '.cname',
                    ).innerText;
                const teacherName = allDivInLi[0].innerText;
                let slot = allDivInLi[1].innerText;
                let venue = allDivInLi[2].innerText;
                const color = this.style.backgroundColor;
                if (slot === 'SLOTS') {
                    slot = '';
                }
                if (venue === 'VENUE') {
                    venue = '';
                }

                selectBackgroundRemovalOfPreviousLi();
                this.classList.add('select_background');
                document.getElementById('teacher-input_remove-edit').value =
                    teacherName;
                document.getElementById('slot-input-edit').value = slot;
                document.getElementById('venue-input-edit').value = venue;
                document.getElementById('teacher-edit-course').value =
                    courseName;
                document.getElementById('color1-select-edit').value = color;
                document.getElementById('teacher-input_remove-edit-pre').value =
                    teacherName;
            }
        });
    });
}

// on click of button with id 'tt-subject-done'
// button : 'Done'
function closeEditPref1() {
    editTeacher = false;
    deactivateSortable();

    document.getElementById('edit_msg_').style.display = 'none';
    document.getElementById('div-for-edit-teacher').style.display = 'none';
    selectBackgroundRemovalOfPreviousH2s();
}

// close the edit view
function closeEditPref() {
    document.getElementById('tt-subject-edit').style.display = 'block';
    document.getElementById('tt-subject-add').style.display = 'block';
    document.getElementById('tt-teacher-add').style.display = 'block';
    document.getElementById('tt-subject-collapse').style.display = 'none';
    document.getElementById('tt-subject-done').style.display = 'none';
    document.getElementById('div-for-add-teacher').style.display = 'block';
    document.getElementById('tt-sub-edit-switch-div').style.display = 'none';
    document.getElementById('tt-sub-edit-switch').checked = false;
    document.getElementById('div-for-edit-course').style.display = 'none';
    document.getElementById('div-for-edit-teacher').style.display = 'none';
    editSub = false;
    createSubjectJsonFromHtml();
    addEventListeners();
    revertRerrange();
    rearrangeTeacherRefresh();
    showAddTeacherDiv();
    document.getElementById('edit_msg_').innerText =
        'Click on the Teacher to edit it.';
}

// What happens after clicking on li element anywhere
function liClick() {
    try {
        // Get the radio button inside this list item
        var radioButton = this.querySelector('input[type="radio"]');
        
        if (!radioButton) {
            throw new Error('No radio button found inside the list item');
        }

        if (radioButton.checked) {
            radioButton.checked = false;
            removeRadioFalse(radioButton);
            updateDataJsonFromCourseList();
            revertRerrange();
            rearrangeTeacherRefresh();
        } else {
            radioButton.checked = true; // This radio button is now the currently selected one
            addOnRadioTrue(radioButton);
            updateDataJsonFromCourseList();
            revertRerrange();
            rearrangeTeacherRefresh();
        }
    } catch (error) {
        console.error('Error in liClick function:', error);
    }
}

// ------------------ Click Ends Here ------------------

// ================== Arrange ==================

function rearrangeTeacherLiInSubjectArea(courseName) {
    var ul = getUlInSubjectArea(courseName);
    var allTeacherLi = ul.querySelectorAll('li');
    var slotsOfCourse = getSlotsOfCourse(courseName);
    var activeSlots = getSlots();
    var consideredSlots = subtractArray(slotsOfCourse, activeSlots);
    var nonActiveTeacherLi = [];
    var activeTeacherLi = [];
    var actGreen = [];
    var actRed = [];
    var actOrange = [];
    var nactGreen = [];
    var nactRed = [];
    var nactOrange = [];
    allTeacherLi.forEach((teacherLi) => {
        const teacherSlot = slotsProcessingForCourseList(
            teacherLi.querySelectorAll('div')[1].innerText,
        );
        if (isCommonSlot(teacherSlot, consideredSlots)) {
            teacherLi.classList.add('clashLi');
            teacherLi.querySelector('div').classList.add('clash');
            nonActiveTeacherLi.push(teacherLi);
        } else {
            try {
                teacherLi.classList.remove('clashLi');
                teacherLi.querySelector('div').classList.remove('clash');
            } catch (error) {}
            activeTeacherLi.push(teacherLi);
        }
    });
    // get the ul under that course name in subject area
    activeTeacherLi.forEach((teacherLi) => {
        var color = teacherLi.style.backgroundColor;
        switch (color) {
            case 'rgb(214, 255, 214)': // Green
                return actGreen.push(teacherLi);
            case 'rgb(255, 228, 135)': // Orange
                return actOrange.push(teacherLi);
            case 'rgb(255, 205, 205)': // Red
                return actRed.push(teacherLi);
            default:
                return actGreen.push(teacherLi); // Unknown color
        }
    });
    nonActiveTeacherLi.forEach((teacherLi) => {
        var color = teacherLi.style.backgroundColor;
        switch (color) {
            case 'rgb(214, 255, 214)': // Green
                return nactGreen.push(teacherLi);
            case 'rgb(255, 228, 135)': // Orange
                return nactOrange.push(teacherLi);
            case 'rgb(255, 205, 205)': // Red
                return nactRed.push(teacherLi);
            default:
                return nactGreen.push(teacherLi); // Unknown color
        }
    });

    ul.innerHTML = '';
    actGreen.forEach((teacherLi) => {
        ul.appendChild(teacherLi);
    });
    actOrange.forEach((teacherLi) => {
        ul.appendChild(teacherLi);
    });
    actRed.forEach((teacherLi) => {
        ul.appendChild(teacherLi);
    });
    nactGreen.forEach((teacherLi) => {
        ul.appendChild(teacherLi);
    });
    nactOrange.forEach((teacherLi) => {
        ul.appendChild(teacherLi);
    });
    nactRed.forEach((teacherLi) => {
        ul.appendChild(teacherLi);
    });
}

//rearrange the teacherli within the subjectArea if slots are clashing
function rearrangeTeacherRefresh() {
    const courseList = getCourseListFromSubjectArea();
    courseList.forEach((courseName) => {
        rearrangeTeacherLiInSubjectArea(courseName);
    });
    addEventListeners();
}

function revertRerrange() {
    if (activeTable.subject === undefined) {
        return;
    }
    if (Object.keys(activeTable.subject).length === 0) {
        return;
    }
    var allSubject = activeTable.subject;
    Object.keys(allSubject).forEach((subjectName) => {
        const subjectNameStr = subjectName.toString();
        const ulToUpdate = getUlInSubjectArea(subjectNameStr);
        const TeacherLi = constructTeacherLi(
            subjectNameStr,
            allSubject[subjectNameStr],
        );
        ulToUpdate.innerHTML = '';
        var teacherLiGreen = [];
        var teacherLiOrange = [];
        var teacherLiRed = [];
        TeacherLi.forEach((li) => {
            var color = li.style.backgroundColor;
            switch (color) {
                case 'rgb(214, 255, 214)': // Green
                    return teacherLiGreen.push(li);
                case 'rgb(255, 228, 135)': // Orange
                    return teacherLiOrange.push(li);
                case 'rgb(255, 205, 205)': // Red
                    return teacherLiRed.push(li);
                default:
                    return teacherLiGreen.push(li); // Unknown color
            }
        });
        teacherLiGreen.forEach((li) => {
            ulToUpdate.appendChild(li);
        });
        teacherLiOrange.forEach((li) => {
            ulToUpdate.appendChild(li);
        });
        teacherLiRed.forEach((li) => {
            ulToUpdate.appendChild(li);
        });
        makeRadioTrueOnPageLoad();
    });
}
// ------------------ Arrange Ends Here ------------------

// ================== Attack Mode Function ==================

// function addEventListenersAttack() {
//     var listItems = document.querySelectorAll('.dropdown li');
//     for (var i = 0; i < listItems.length; i++) {
//         listItems[i].addEventListener('click', attackLiClick);
//     }
// }
function rearrangeTeacherRefreshAttack() {
    const courseList = getCourseListFromSubjectArea();
    courseList.forEach((courseName) => {
        rearrangeTeacherLiInSubjectAreaAttack(courseName);
    });
}

function rearrangeTeacherLiInSubjectAreaAttack(courseName) {
    var ul = getUlInSubjectArea(courseName);
    var allTeacherLi = ul.querySelectorAll('li');
    var slotsOfCourse = getCourseSlotsAttack(courseName);
    var activeSlots = slotsForAttack();
    var consideredSlots = subtractArray(slotsOfCourse, activeSlots);
    var nonActiveTeacherLi = [];
    var activeTeacherLi = [];
    var attackActGreen = [];
    var attackActRed = [];
    var attackActOrange = [];
    var attackNonActGreen = [];
    var attackNonActRed = [];
    var attackNonActOrange = [];
    allTeacherLi.forEach((teacherLi) => {
        const teacherSlot = slotsProcessingForCourseList(
            teacherLi.querySelectorAll('div')[1].innerText,
        );
        if (isCommonSlot(teacherSlot, consideredSlots)) {
            teacherLi.classList.add('clashLi');
            teacherLi.removeEventListener('click', attackLiClick);
            teacherLi.querySelector('div').classList.add('clash');
            nonActiveTeacherLi.push(teacherLi);
        } else {
            teacherLi.addEventListener('click', attackLiClick);
            try {
                teacherLi.classList.remove('clashLi');
                teacherLi.querySelector('div').classList.remove('clash');
            } catch (error) {}
            activeTeacherLi.push(teacherLi);
        }
    });
    // get the ul under that course name in subject area
    activeTeacherLi.forEach((teacherLi) => {
        var color = teacherLi.style.backgroundColor;
        switch (color) {
            case 'rgb(214, 255, 214)': // Green
                return attackActGreen.push(teacherLi);
            case 'rgb(255, 228, 135)': // Orange
                return attackActOrange.push(teacherLi);
            case 'rgb(255, 205, 205)': // Red
                return attackActRed.push(teacherLi);
            default:
                return attackActGreen.push(teacherLi); // Unknown color
        }
    });
    nonActiveTeacherLi.forEach((teacherLi) => {
        var color = teacherLi.style.backgroundColor;
        switch (color) {
            case 'rgb(214, 255, 214)': // Green
                return attackNonActGreen.push(teacherLi);
            case 'rgb(255, 228, 135)': // Orange
                return attackNonActOrange.push(teacherLi);
            case 'rgb(255, 205, 205)': // Red
                return attackNonActRed.push(teacherLi);
            default:
                return attackNonActGreen.push(teacherLi); // Unknown color
        }
    });
    ul.innerHTML = '';
    attackActGreen.forEach((teacherLi) => {
        ul.appendChild(teacherLi);
    });
    attackActOrange.forEach((teacherLi) => {
        ul.appendChild(teacherLi);
    });
    attackActRed.forEach((teacherLi) => {
        ul.appendChild(teacherLi);
    });
    attackNonActGreen.forEach((teacherLi) => {
        ul.appendChild(teacherLi);
    });
    attackNonActOrange.forEach((teacherLi) => {
        ul.appendChild(teacherLi);
    });
    attackNonActRed.forEach((teacherLi) => {
        ul.appendChild(teacherLi);
    });
}

// Make input radio true on the basis of attackData values
function makeRadioTrueAttack() {
    var attackData = activeTable.attackData;
    attackData.forEach((courseData) => {
        var courseName = getCourseNameFromCourseData(courseData);
        var faculty = courseData.faculty;
        var teacherLi = getTeacherLiInSubjectArea(courseName, faculty);
        teacherLi.querySelector('input[type="radio"]').checked = true;
    });
}
function revertRerrangeAttack() {
    var allSubject = activeTable.subject;
    Object.keys(allSubject).forEach((subjectName) => {
        const subjectNameStr = subjectName.toString();
        const ulToUpdate = getUlInSubjectArea(subjectNameStr);
        const TeacherLi = constructTeacherLi(
            subjectNameStr,
            allSubject[subjectNameStr],
        );
        var attackTeacherLiGreen = [];
        var attackTeacherLiOrange = [];
        var attackTeacherLiRed = [];
        TeacherLi.forEach((li) => {
            var color = li.style.backgroundColor;
            switch (color) {
                case 'rgb(214, 255, 214)': // Green
                    return attackTeacherLiGreen.push(li);
                case 'rgb(255, 228, 135)': // Orange
                    return attackTeacherLiOrange.push(li);
                case 'rgb(255, 205, 205)': // Red
                    return attackTeacherLiRed.push(li);
                default:
                    return attackTeacherLiGreen.push(li); // Unknown color
            }
        });

        ulToUpdate.innerHTML = '';
        attackTeacherLiGreen.forEach((li) => {
            ulToUpdate.appendChild(li);
        });
        attackTeacherLiOrange.forEach((li) => {
            ulToUpdate.appendChild(li);
        });
        attackTeacherLiRed.forEach((li) => {
            ulToUpdate.appendChild(li);
        });
        makeRadioTrueAttack();
    });
}

function slotsForAttack() {
    var attackData = activeTable.attackData;
    var activeQuick = activeTable.attackQuick;
    var slots = [];
    for (var i = 0; i < attackData.length; i++) {
        slots = slots.concat(attackData[i].slots);
    }
    var thSlots = new Set();
    var labSlots = new Set();
    slots = updateSlots(slots);
    // traversing through quick slots and adding them to slots
    if (
        document.getElementById('quick-toggle').getAttribute('data-state') ===
        'enabled'
    ) {
        activeQuick.forEach((el) => {
            var rows = document
                .getElementById('timetable')
                .getElementsByTagName('tr');
            var cells = rows[el[0]].getElementsByTagName('td');
            const x = cells[el[1]].innerText.split(' / ');
            if (el.length == 3) {
                if (x.length == 1) {
                    if (x[0].includes('L')) {
                        labSlots.add(x[0]);
                    } else {
                        thSlots.add(x[0]);
                        if (x[0] in clashMap) {
                            clashMap[x[0]].forEach((lec) => {
                                labSlots.add(lec);
                            });
                        }
                    }
                } else {
                    thSlots.add(x[0]);
                    if (x[0] in clashMap) {
                        clashMap[x[0]].forEach((lec) => {
                            labSlots.add(lec);
                        });
                    }
                }
            } else {
                if (x.length == 1) {
                    if (x[0].includes('L')) {
                        labSlots.add(x[0]);
                        if (x[0] in clashMap) {
                            clashMap[x[0]].forEach((lec) => {
                                thSlots.add(lec);
                            });
                        }
                    } else {
                        thSlots.add(x[0]);
                    }
                } else {
                    labSlots.add(x[1].split('\n')[0]);
                    if (x[1].split('\n')[0] in clashMap) {
                        clashMap[x[1].split('\n')[0]].forEach((lec) => {
                            thSlots.add(lec);
                        });
                    }
                }
            }
        });
    }
    slots = slots.concat(Array.from(thSlots));
    slots = slots.concat(Array.from(labSlots));
    return slots;
}

function getCourseSlotsAttack(courseName) {
    var slots = [];
    var attackData = activeTable.attackData;
    attackData.forEach((el) => {
        const CourseNameData = getCourseNameFromCourseData(el);
        if (
            CourseNameData.toLocaleLowerCase() == courseName.toLocaleLowerCase()
        ) {
            el.slots.forEach((slot) => {
                if (!slots.includes(slot)) {
                    slots.push(slot);
                }
            });
        }
    });
    slots = updateSlots(slots);
    return slots;
}

function removeRadioFalseAttack(radioButton) {
    var attackData = activeTable.attackData;
    var courseToRemove =
        radioButton.parentElement.parentElement.parentElement.querySelector(
            'h2 .cname',
        ).innerText;
    courseRemove(courseToRemove);
    for (var i = 0; i < attackData.length; ++i) {
        var attackCourse = getCourseNameFromCourseData(attackData[i]);
        if (
            attackCourse.toLocaleLowerCase() ===
            courseToRemove.toLocaleLowerCase()
        ) {
            attackData.splice(i, 1);
            break;
        }
    }
}

function addOnRadioAttack(radioButton) {
    var current = radioButton; // This radio button is now the currently selected one
    var courseToRemove =
        current.parentElement.parentElement.parentElement.querySelector(
            'h2 .cname',
        ).innerText;

    var courseTitle = getCourseCodeAndCourseTitle(courseToRemove)[1];
    var courseCode = getCourseCodeAndCourseTitle(courseToRemove)[0];
    courseRemove(courseToRemove);
    if ($('#tt-auto-focus-switch').is(':checked')) {
        var currentDropdown =
            current.parentElement.parentElement.previousElementSibling;
        currentDropdown.click();
        closeAllDropdowns();
        try {
            var nextDropdown =
                currentDropdown.parentElement.nextElementSibling.querySelector(
                    'div',
                );

            if ($(nextDropdown).hasClass('open')) {
            } else {
                nextDropdown.click();
            }
        } catch (error) {}
    }

    var faculty = current.parentElement.querySelectorAll('div')[0].innerText;
    var slotString = current.parentElement.querySelectorAll('div')[1].innerText;
    var venue = current.parentElement.querySelectorAll('div')[2].innerText;
    var credits = getCreditsFromCourseName(courseToRemove);

    var isProject = false;

    var slots = slotsProcessingForCourseList(slotString);
    var courseId = 0;
    var attackData = activeTable.attackData;
    if (attackData.length != 0) {
        var lastAddedCourse = attackData[attackData.length - 1];
        courseId = lastAddedCourse.courseId + 1;
    }
    var courseData = {
        courseId: courseId,
        courseTitle: courseTitle,
        faculty: faculty,
        slots: slots,
        venue: venue,
        credits: credits,
        isProject: isProject,
        courseCode: courseCode,
    };
    addCourseToCourseList(courseData);
    addCourseToTimetable(courseData);
    attackData.push(courseData);
}

function removeEventListenersAttack() {
    var listItems = document.querySelectorAll('.dropdown li');
    for (var i = 0; i < listItems.length; i++) {
        listItems[i].removeEventListener('click', attackLiClick);
    }
}

function attackLiClick() {
    // Get the radio button inside this list item
    var radioButton = this.querySelector('input[type="radio"]');
    if (radioButton.checked) {
        try {
            radioButton.checked = false;
            removeRadioFalseAttack(radioButton);
            revertRerrangeAttack();
            rearrangeTeacherRefreshAttack();
            showOccupiedSlots();
            updateLocalForage();
        } catch (error) {}
    } else {
        radioButton.checked = true; // This radio button is now the currently selected one
        removeRadioFalseAttack(radioButton);
        addOnRadioAttack(radioButton);
        revertRerrangeAttack();
        rearrangeTeacherRefreshAttack();
        showOccupiedSlots();
        updateLocalForage();
    }
}

function slotOccupiedTheoryLab() {
    var allSlots = [];
    var attackData = activeTable.attackData;
    var activeQuick = activeTable.attackQuick;
    for (var i = 0; i < attackData.length; i++) {
        allSlots = allSlots.concat(attackData[i].slots);
    }
    var thSlots = new Set();
    var labSlots = new Set();
    allSlots.forEach((slot) => {
        if (slot.includes('L')) {
            labSlots.add(slot);
            if (slot in clashMap) {
                clashMap[slot].forEach((lec) => {
                    thSlots.add(lec);
                });
            }
        } else {
            thSlots.add(slot);
            if (slot in clashMap) {
                clashMap[slot].forEach((lec) => {
                    labSlots.add(lec);
                });
            }
        }
    });
    if (
        document.getElementById('quick-toggle').getAttribute('data-state') ===
        'enabled'
    ) {
        activeQuick.forEach((el) => {
            var rows = document
                .getElementById('timetable')
                .getElementsByTagName('tr');
            var cells = rows[el[0]].getElementsByTagName('td');
            const x = cells[el[1]].innerText.split(' / ');
            if (el.length == 3) {
                if (x.length == 1) {
                    if (x[0].includes('L')) {
                        labSlots.add(x[0]);
                    } else {
                        thSlots.add(x[0]);
                        if (x[0] in clashMap) {
                            clashMap[x[0]].forEach((lec) => {
                                labSlots.add(lec);
                            });
                        }
                    }
                } else {
                    thSlots.add(x[0]);
                    if (x[0] in clashMap) {
                        clashMap[x[0]].forEach((lec) => {
                            labSlots.add(lec);
                        });
                    }
                }
            } else {
                if (x.length == 1) {
                    if (x[0].includes('L')) {
                        labSlots.add(x[0]);
                        if (x[0] in clashMap) {
                            clashMap[x[0]].forEach((lec) => {
                                thSlots.add(lec);
                            });
                        }
                    } else {
                        thSlots.add(x[0]);
                    }
                } else {
                    labSlots.add(x[1].split('\n')[0]);
                    if (x[1].split('\n')[0] in clashMap) {
                        clashMap[x[1].split('\n')[0]].forEach((lec) => {
                            thSlots.add(lec);
                        });
                    }
                }
            }
        });
    }
    const thSlotsArray = Array.from(thSlots).sort();
    const labSlotsArray = Array.from(labSlots).sort();
    return [thSlotsArray, labSlotsArray];
}
function showOccupiedSlots() {
    const slotsThLab = slotOccupiedTheoryLab();
    const thSlots = slotsThLab[0];
    const labSlots = slotsThLab[1];
    var h6Th = document
        .getElementById('div-for-attack-slot')
        .querySelectorAll('h6')[0];
    var h6Lab = document
        .getElementById('div-for-attack-slot')
        .querySelectorAll('h6')[1];
    h6Th.innerText = thSlots.join(' ,  ');
    h6Lab.innerText = labSlots.join(' ,  ');
}

// ------------------ Attack Mode Function Ends Here ------------------

// ================== File Processing ==================

// on upload tt file it process the file and update the activeTable
// and updates front end
function processFile(file) {
    var reader = new FileReader();
    reader.onload = function (event) {
        // Extract the data from the Data URL
        var base64Data = event.target.result;

        // Decode the base64 string back into a URI-encoded string
        var uriEncodedData = atob(base64Data);

        // Decode the URI-encoded string back into a JSON string
        var jsonStr = decodeURIComponent(uriEncodedData);

        // Parse the JSON string back into an object
        var activeTableUpdate = JSON.parse(jsonStr);
        activeTableUpdate.id = activeTable.id;
        activeTableUpdate.name = activeTable.name;
        timetableStoragePref[activeTable.id] = activeTableUpdate;
        updateLocalForage();
        switchTable(activeTable.id);
        updateCredits();

        // Update the UI to reflect the new activeTable
        // ...
    };
    reader.readAsText(file);
}

// ------------------ File Processing Ends Here ------------------

// ================== Misslenious ==================

// Function to be executed on page load'
// Add event listener for DOMContentLoaded event
// show teacher view + refresh and build the course select input
function showAddTeacherDiv() {
    document.getElementById('div-for-edit-teacher').style.display = 'none';
    var addCourseDiv = document.getElementById('div-for-add-course');
    var addTeacherDiv = document.getElementById('div-for-add-teacher');
    addCourseDiv.style.display = 'none';
    addTeacherDiv.style.display = 'block';
    const courseSelect = document.getElementById('course-select-add-teacher');
    document.getElementById('slot-input').value = '';
    courseSelect.innerHTML = '';
    if (
        !timetableStoragePref[window.activeTable.id].hasOwnProperty('subject')
    ) {
        courseSelect.innerHTML =
            '<option selected>You need to add courses</option>';
    } else {
        if (
            Object.keys(timetableStoragePref[window.activeTable.id].subject)
                .length === 0
        ) {
            courseSelect.innerHTML =
                '<option selected>You need to add courses</option>';
        } else {
            courseSelect.innerHTML = '<option selected>Select Course</option>';
            Object.keys(
                timetableStoragePref[window.activeTable.id].subject,
            ).forEach((key) => {
                const option = document.createElement('option');
                option.value = key;
                option.text = key;
                courseSelect.appendChild(option);
            });
        }
    }
}

function onPageLoad() {
    // if window size is less then 630 show mobile_message
    if (window.innerWidth < 631) {
        document.getElementById('mobile_message').style.display = 'block';
    }
    var addMultipleTeacherButton =
        document.getElementById('addMultipleTeacher');
    addMultipleTeacherButton.addEventListener(
        'click',
        openModalConditionallyForMultipleTeacher,
    );

    var addConfirmMultipleTeacherButton = document.getElementById(
        'confirm-multiple-button',
    );
    addConfirmMultipleTeacherButton.addEventListener(
        'click',
        addMultipleTeacher,
    );
    const userOptDiv = document.getElementById('user-opt');
    userOptDiv.style.display = 'none';
}

// replace all dots with empty string in input field
function removeDotsLive(inputElement) {
    let inputValue = inputElement.value;
    let cleanedValue = inputValue.replace(/\./g, '');
    cleanedValue = inputValue.replace(/\--/g, '-');
    cleanedValue = cleanedValue.replace(/\  /g, ' ');
    cleanedValue = cleanedValue.replace(/[^a-zA-Z0-9+ \-()]/g, '');
    inputElement.value = cleanedValue;
}

// replace all dots with empty string in input field
function removeSlotSplCharLive(inputElement) {
    let inputValue = inputElement.value;
    let cleanedValue = inputValue.replace(/\./g, '');
    cleanedValue = cleanedValue.replace(/[^a-zA-Z0-9+-]/g, '');
    inputElement.value = cleanedValue;
}

function trimSign(slotString, sign) {
    while (slotString.startsWith(sign)) {
        slotString = slotString.slice(1);
    }
    while (slotString.endsWith(sign)) {
        slotString = slotString.slice(0, -1);
    }
    return slotString;
}

function removeDuplicateSlots(slotString) {
    // Split the string into an array
    slotString = slotString.toUpperCase();
    slotString = trimSign(slotString, '+');
    slotString = cleanSlotString(slotString);
    var slotsArray = slotString.split('+');

    // Create a new array to store unique slots
    var uniqueSlotsArray = [];

    // Iterate over the original array
    slotsArray.forEach(function (slot) {
        // If the slot is not already in the uniqueSlotsArray, add it
        if (!uniqueSlotsArray.includes(slot)) {
            uniqueSlotsArray.push(slot);
        }
    });

    // Join the array back into a string
    var uniqueSlotString = uniqueSlotsArray.join('+');

    return uniqueSlotString;
}

function cleanSlotString(slotString) {
    // Remove consecutive plus signs
    var cleanedSlotString = slotString.replace(/\++/g, '+');

    // Remove spaces
    cleanedSlotString = cleanedSlotString.replace(/\s/g, '');

    return cleanedSlotString;
}

// document.getElementById('saveTeacherModal').addEventListener('click', function () {
//     var inputElementSave = document.getElementById('slot-input');
//     inputElementSave.value = cleanSlotString(inputElementSave.value);
//     inputElementSave.value = removeDuplicateSlots(inputElementSave.value);
// }, true);

// document.getElementById('saveTeacherEdit').addEventListener('click', function () {
//     var inputElement = document.getElementById('slot-input-edit');
//     inputElement.value = cleanSlotString(inputElement.value);
//     inputElement.value = removeDuplicateSlots(inputElement.value);
// }, true);
// ------------------ Misslenious Ends Here ------------------

window.removeSlotSplCharLive = removeSlotSplCharLive;
window.editPrefCollapse = editPrefCollapse;
window.toggleDropdown = toggleDropdown;
window.closeAllDropdowns = closeAllDropdowns;
window.openAllDropdowns = openAllDropdowns;
window.removeInputFieldsInSection = removeInputFieldsInSection;
window.removeDotsLive = removeDotsLive;
window.editPrefAddOn = editPrefAddOn;
window.closeEditPref1 = closeEditPref1;

/*
 *  This file contains the events and functions applied to
 *  the timetable
 */
/*
 *  This file contains the events and functions applied to
 *  the course list
 */

$(() => {
    /*
        Click event to sort the course list
     */
    $('#course-list th:not(:last)').on('click', function () {
        var isAscending = false;
        var isDescending = false;
        var $items = retrieveColumnItems($(this));

        if ($(this).hasClass('ascending')) {
            isAscending = true;
        } else if ($(this).hasClass('descending')) {
            isDescending = true;
        }

        $('#course-list th').removeClass('ascending descending');

        // Sort the course list in ascending, descending or the default order
        if (!isAscending && !isDescending) {
            $items.sort(function (a, b) {
                return $(a).text() > $(b).text() ? 1 : -1;
            });

            $(this).addClass('ascending');
        } else if (isAscending && !isDescending) {
            $items.sort(function (a, b) {
                return $(a).text() < $(b).text() ? 1 : -1;
            });

            $(this).addClass('descending');
        } else {
            $items.sort(function (a, b) {
                return $(a).parent().data('course') >
                    $(b).parent().data('course')
                    ? 1
                    : -1;
            });
        }

        var sortedRows = $items.map(function (i, item) {
            return $(item).parent()[0];
        });

        $('#course-list tbody tr').remove();
        $('#course-list tbody').append(sortedRows);
    });

    /*
        Click event to delete a course from the course list
     */
    $('#course-list').on('click', '.close', function () {
        const tr = $(this).closest('tr');
        var course = tr.attr('data-course');

        //var teacherLi = getTeacherLiInSubjectArea(courseName, facultyName);
        removeCourseFromCourseList(course);
        removeCourseFromTimetable(course);
        updateLocalForage();
        //teacherLi.querySelector('input[type="radio"]').checked = false;

        if ($('#attack-toggle').is(':checked')) {
            var courseId = Number(course.split(/(\d+)/)[1]);
            for (var i = 0; i < activeTable.attackData.length; ++i) {
                if (activeTable.attackData[i].courseId == courseId) {
                    activeTable.attackData.splice(i, 1);
                    break;
                }
            }
            revertRerrangeAttack();
            rearrangeTeacherRefreshAttack();
            showOccupiedSlots();
        } else {
            var courseId = Number(course.split(/(\d+)/)[1]);
            for (var i = 0; i < activeTable.data.length; ++i) {
                if (activeTable.data[i].courseId == courseId) {
                    activeTable.data.splice(i, 1);
                    break;
                }
            }

            if (editSub === true || editTeacher === true) {
            } else {
                revertRerrange();
                rearrangeTeacherRefresh();
            }
        }
    });
});

/*
    Function to get a columns index from the course list
 */
function getColumnIndex(column) {
    var columns = Array.from($('#course-list th'), function (el) {
        return el.innerText;
    });

    return columns.indexOf(column.innerText || column);
}

/*
    Function to retrive items from a column in the course list
 */
function retrieveColumnItems($column) {
    var index = getColumnIndex($column.text());

    var $rows = $('#course-list tbody tr');

    var items = $rows.map(function (i, row) {
        return $(row).find('td')[index];
    });

    return items;
}

/*
    Function to update the total credits
 */
function updateCredits() {
    var totalCredits = 0;

    $('#course-list tbody tr').each(function () {
        totalCredits += Number(
            $(this).children('td').eq(getColumnIndex('Credits')).text(),
        );
    });

    $('#total-credits').text(totalCredits);
}

/*
    Function to insert a course into the course list
 */
window.addCourseToCourseList = (courseData) => {
    var $courseListItem = $(
        `<tr
            data-course="course${courseData.courseId}"
            data-is-project="${courseData.isProject}"
        >
            <td>${courseData.slots.join('+')}</td>
            <td>${courseData.courseCode}</td>
            <td>${courseData.courseTitle}</td>
            <td>${courseData.faculty}</td>
            <td>${courseData.venue}</td>
            <td>${courseData.credits}</td>
            <td><i class="fas fa-times close"></i></td>
        </tr>`,
    );

    var nextRow = null;
    var sortedColumn =
        $('#course-list th.ascending')[0] || $('#course-list th.descending')[0];
    var isAscending = $('#course-list th.ascending')[0] != undefined;

    /*
        If the course list is sorted, the course should be
        inserted at the appropriate position
     */
    if (sortedColumn != undefined) {
        var index = getColumnIndex(sortedColumn);
        var $items = retrieveColumnItems($(sortedColumn));
        var currentItem = $courseListItem.find('td')[index];

        for (var i = 0; i < $items.length; i++) {
            var item = $items[i];

            if (isAscending) {
                if ($(currentItem).text() <= $(item).text()) {
                    nextRow = $(item).parent();
                    break;
                }
            } else {
                if ($(currentItem).text() >= $(item).text()) {
                    nextRow = $(item).parent();
                    break;
                }
            }
        }
    }

    if (nextRow === null) {
        $('#course-list tbody').append($courseListItem);
    } else {
        nextRow.before($courseListItem);
    }
    var courseList = document.querySelector('#course-list tbody');

    // Process each 'tr' before activating the Sortable
    [].forEach.call(courseList.getElementsByTagName('tr'), function (tr) {
        [].forEach.call(tr.getElementsByTagName('td'), function (td) {
            // Store the original width
            td.dataset.originalWidth = getComputedStyle(td).width;
            // Set the width to the original width
            td.style.width = td.dataset.originalWidth;
        });
    });
    addEventListnerToCourseList();
    updateCredits();
};

/*
    Function to remove a course
 */
function removeCourseFromCourseList(course) {
    $(`#courseList-tbody tr[data-course="${course}"]`).remove();
    updateCredits();
}

/*
    Function to clear the course list from the body but not delete it's data
 */
window.clearCourseList = () => {
    if ($('#course-list tbody tr[data-course]')) {
        $('#course-list tbody tr[data-course]').remove();
    }

    updateCredits();
};

import localforage from 'localforage/dist/localforage';
import html2canvas from 'html2canvas/dist/html2canvas';
import { parse, isValid, add } from 'date-fns';
import { fi, is, te, th } from 'date-fns/locale';
import { get } from 'jquery';

var timetableStoragePref = [
    {
        id: 0,
        name: 'Default Table',
        data: [],
        subject: [],
        quick: [],
        attackData: [],
        attackQuick: [],
    },
];

window.activeTable = timetableStoragePref[0];
window.timetableStoragePref=timetableStoragePref;
$(() => {
    /*
        Click event for the add table button
     */
    $('#tt-picker-add').on('click', function () {
        var newTableId =
            timetableStoragePref[timetableStoragePref.length - 1].id + 1;
        var newTableName = 'Table ' + newTableId;

        timetableStoragePref.push({
            id: newTableId,
            name: newTableName,
            data: [],
            quick: [],
            subject: [],
            attackData: [],
            attackQuick: [],
        });

        addTableToPicker(newTableId, newTableName);
        switchTable(newTableId);
        updateLocalForage();
        fillLeftBoxInCoursePanel();
    });

    /*
        Click event for the timetable picker dropdown labels
     */
    $('#tt-picker-dropdown').on('click', '.tt-picker-label', function () {
        var selectedTableId = Number($(this).children('a').data('table-id'));
        switchTable(selectedTableId);
    });

    /*
        Click event to set the data attribute before opening the rename modal
     */
    $('#tt-picker-dropdown').on('click', '.tt-picker-rename', function () {
        var $a = $(this).closest('li').find('a:first');

        var tableId = Number($a.data('table-id'));
        var tableName = $a.text();

        $('#table-name').val(tableName).trigger('focus');
        $('#rename-tt-button').data('table-id', tableId);
    });

    /*
        Click event for the rename button in the rename modal
     */
    $('#rename-tt-button').on('click', function () {
        var tableId = $(this).data('table-id');
        var tableName = $('#table-name').val().trim();

        if (tableName == '') {
            tableName = 'Untitled Table';
        }

        renameTable(tableId, tableName);
    });

    /*
        Keydown event for the input table name field in the rename modal
     */
    $('#table-name').on('keydown', function (e) {
        if (e.key == 'Enter') {
            $('#rename-tt-button').trigger('click');
        }
    });

    /*
        Click event to set the data attribute before opening the delete modal
     */
    $('#tt-picker-dropdown').on('click', '.tt-picker-delete', function () {
        var tableId = Number(
            $(this).closest('li').find('a:first').data('table-id'),
        );

        $('#delete-tt-button').data('table-id', tableId);
    });

    /*
        Click event for the delete button in the delete modal
     */
    $('#delete-tt-button').on('click', function () {
        var tableId = $(this).data('table-id');
        deleteTable(tableId);

        if (timetableStoragePref.length == 1) {
            $('#tt-picker-dropdown .tt-picker-delete').first().remove();
            fillLeftBoxInCoursePanel();
        }
    });

    /*
        Click event for the download timetable button in the download modal
     */
    $('#download-tt-button').on('click', function () {
        var buttonText = $(this).html();
        $(this)
            .html(
                `<span
                    class="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                ></span>&nbsp;&nbsp;Please Wait`,
            )
            .attr('disabled', true);

        const width = $('#timetable')[0].scrollWidth;
        var $layout = $('<div></div>').css({
            padding: '2rem',
            position: 'absolute',
            top: 0,
            left: `calc(-${width}px - 4rem)`,
        });

        $layout = appendHeader($layout, width);

        const $timetableClone = $('#timetable').clone().css({
            width: width,
        });
        $('table', $timetableClone).css({
            margin: 0,
        });
        $('tr', $timetableClone).css({
            border: 'none',
        });

        $layout.append($timetableClone);
        $('body').append($layout);

        html2canvas($layout[0], {
            scrollX: -window.scrollX,
            scrollY: -window.scrollY,
        }).then((canvas) => {
            $layout.remove();
            $(this).html(buttonText).attr('disabled', false);

            var $a = $('<a></a>')
                .css({
                    display: 'none',
                })
                .attr('href', canvas.toDataURL('image/jpeg'))
                .attr(
                    'download',
                    `FFCS Planner ${activeTable.name} (Timetable).jpg`,
                );

            $('body').append($a);
            $a[0].click();
            $a.remove();
        });
    });

    /*
        Click event for the download course list button in the download modal
     */
    $('#download-course-list-button').on('click', function () {
        var buttonText = $(this).html();
        $(this)
            .html(
                `<span
                    class="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                ></span>&nbsp;&nbsp;Please Wait`,
            )
            .attr('disabled', true);

        const width = $('#course-list')[0].scrollWidth;
        var $layout = $('<div></div>').css({
            padding: '2rem',
            position: 'absolute',
            top: 0,
            left: `calc(-${width}px - 4rem)`,
        });

        $layout = appendHeader($layout, width);

        const $courseListClone = $('#course-list').clone().css({
            width: width,
            border: '1px solid var(--table-border-color)',
            'border-bottom': 'none',
        });
        $('table', $courseListClone).css({
            margin: 0,
        });
        $('tr', $courseListClone)
            .css({
                border: 'none',
            })
            .each(function () {
                if ($(this).children().length == 1) {
                    return;
                }

                $('th:last-child', this).remove();
                $('td:last-child', this).remove();
            });

        $layout.append($courseListClone);
        $('body').append($layout);

        html2canvas($layout[0], {
            scrollX: -window.scrollX,
            scrollY: -window.scrollY,
        }).then((canvas) => {
            $layout.remove();
            $(this).html(buttonText).attr('disabled', false);

            var $a = $('<a></a>')
                .css({
                    display: 'none',
                })
                .attr('href', canvas.toDataURL('image/jpeg'))
                .attr(
                    'download',
                    `FFCS Planner ${activeTable.name} (Course List).jpg`,
                );

            $('body').append($a);
            $a[0].click();
            $a.remove();
        });
    });

    /*
        Click event for the quick visualization button
     */
    $('#quick-toggle').on('click', function () {
        var activeQuick;
        if ($('#attack-toggle').is(':checked')) {
            var attackData = activeTable.attackData;
            var activeQuick = activeTable.attackQuick;
            var slots = [];
            for (var i = 0; i < attackData.length; i++) {
                slots = slots.concat(attackData[i].slots);
            }
            slots = updateSlots(slots);
            activeTable.attackQuick = activeQuick.filter((el) => {
                var rows = document
                    .getElementById('timetable')
                    .getElementsByTagName('tr');
                var cells = rows[el[0]].getElementsByTagName('td');
                const x = cells[el[1]].innerText.split(' / ');
                if (x.length == 1) {
                    if (!slots.includes(x[0])) {
                        return true;
                    }
                } else {
                    if (!slots.includes(x[1].split('\n')[0])) {
                        return true;
                    }
                }
                return false;
            });
        } else {
            activeQuick = activeTable.quick;
        }

        if ($(this).attr('data-state') == 'enabled') {
            $('i', this).prop('class', 'fas fa-eye');
            $('span', this).html('&nbsp;&nbsp;Enable Quick Visualization');
            $(this).attr('data-state', 'disabled');

            $('#timetable .highlight:not(:has(div))').removeClass('highlight');
        } else {
            $('i', this).prop('class', 'fas fa-eye-slash');
            $('span', this).html('&nbsp;&nbsp;Disable Quick Visualization');
            $(this).attr('data-state', 'enabled');

            activeQuick.forEach((el) =>
                $('#timetable')
                    .find('tr')
                    .eq(el[0])
                    .find('td')
                    .eq(el[1])
                    .addClass('highlight'),
            );
        }
        $('.quick-buttons').slideToggle();
        if (document.getElementById('attack-toggle').checked) {
            revertRerrangeAttack();
            rearrangeTeacherRefreshAttack();
            showOccupiedSlots();
        }
    });

    /*
        Click event for the reset button in the reset modal
     */
    $('#reset-tt-button').on('click', function () {
        resetPage();
        activeTable.data = [];
        activeTable.attackData = [];
        activeTable.quick = [];
        activeTable.attackQuick = [];
        activeTable['subject'] = {};
        updateLocalForage();
        fillLeftBoxInCoursePanel();
    });
});

/*
    Function to add a header to the images
 */
function appendHeader($layout, width) {
    const $header = $('<div></div>')
        .css({
            width: width,
            'margin-bottom': '1rem',
        })
        .append(
            $('<h3>FFCS Planner</h3>').css({
                margin: 0,
                display: 'inline',
                color: '#005c5c',
                'font-weight': 'bold',
            }),
        )
        .append(
            $(`<h3>${campus} Campus</h3>`).css({
                margin: 0,
                display: 'inline',
                color: '#707070',
                float: 'right',
            }),
        )
        .append(
            $('<hr>').css({
                'border-color': '#000000',
                'border-width': '2px',
            }),
        );
    const $title = $(`<h4>${activeTable.name}</h4>`).css({
        'margin-bottom': '1rem',
        width: width,
        'text-align': 'center',
    });

    return $layout.append($header).append($title);
}

// Function to update the saved data
function updateLocalForage() {
    localforage
        .setItem('timetableStoragePref', timetableStoragePref)
        .catch(console.error);
    console.log(timetableStoragePref);
    updateUserData(timetableStoragePref);
}

// Function to get the table index
function getTableIndex(id) {
    return timetableStoragePref.findIndex((el) => el.id == id);
}

/*
    Function to fill the timetable and course list
 */
function fillPage() {
    // there is attackData in activeTable then do nothing else add it
    // same for attackQuick
    if (!activeTable.hasOwnProperty('attackData')) {
        activeTable['attackData'] = [];
    }
    if (!activeTable.hasOwnProperty('attackQuick')) {
        activeTable['attackQuick'] = [];
    }
    if (document.getElementById('attack-toggle').checked) {
        var activeData = activeTable.attackData;
        var activeQuick = activeTable.attackQuick;
    } else {
        var activeData = activeTable.data;
        var activeQuick = activeTable.quick;
    }
    $.each(activeData, function (index, courseData) {
        addCourseToCourseList(courseData);
        addCourseToTimetable(courseData);
    });

    $.each(activeQuick, function (index, el) {
        var $el = $('#timetable').find('tr').eq(el[0]).find('td').eq(el[1]);
        var slot = $el.get(0).classList[1];

        $(`.quick-buttons .${slot}-tile`).addClass('highlight');

        if ($('#quick-toggle').attr('data-state') == 'enabled') {
            $el.addClass('highlight');
        }
    });
}

/*
    Function to change the active table
 */
function switchTable(tableId) {
    if (document.getElementById('attack-toggle').checked) {
        document.getElementById('attack-toggle').click();
    }
    resetPage();
    activeTable = timetableStoragePref[getTableIndex(tableId)];
    updatePickerLabel(activeTable.name);
    fillPage();
    fillLeftBoxInCoursePanel();
    revertRerrange();
    closeEditPref();
    closeEditPref1();
}

/*
    Function to rename the timetable picker label
 */
function updatePickerLabel(tableName) {
    $('#tt-picker-button').text(tableName);
}

/*
    Function to delete a table
 */
function deleteTable(tableId) {
    var tableIndex = getTableIndex(tableId);
    timetableStoragePref.splice(tableIndex, 1);
    updateLocalForage();

    // Check if the active table is deleted
    if (activeTable.id == tableId) {
        if (tableIndex == 0) {
            switchTable(timetableStoragePref[0].id);
        } else {
            switchTable(timetableStoragePref[tableIndex - 1].id);
        }
    }

    // Removing the timetable picker item
    $('#tt-picker-dropdown .tt-picker-label')
        .find(`[data-table-id="${tableId}"]`)
        .closest('li')
        .remove();
}

/*
    Function to rename a table
 */
function renameTable(tableId, tableName) {
    var tableIndex = getTableIndex(tableId);
    timetableStoragePref[tableIndex].name = tableName;
    updateLocalForage();
    // Check if the active table is renamed
    if (activeTable.id == tableId) {
        updatePickerLabel(tableName);
    }

    // Renaming the timetable picker item
    $('#tt-picker-dropdown .tt-picker-label')
        .find(`[data-table-id="${tableId}"]`)
        .text(tableName);
}

/*
    Function to add a table to the timetable picker
 */
function addTableToPicker(tableId, tableName) {
    $('#tt-picker-dropdown').append(
        `<li>
            <table class="dropdown-item">
                <td class="tt-picker-label">
                    <a href="JavaScript:void(0);" data-table-id="${tableId}"
                        >${tableName}</a
                    >
                </td>
                <td>
                    <a
                        class="tt-picker-rename"
                        href="JavaScript:void(0);"
                        data-bs-toggle="modal"
                        data-bs-target="#rename-modal"
                        ><i class="fas fa-pencil-alt"></i
                    ></a
                    ><a
                        class="tt-picker-delete"
                        href="JavaScript:void(0);"
                        data-bs-toggle="modal"
                        data-bs-target="#delete-modal"
                        ><i class="fas fa-trash"></i
                    ></a>
                </td>
            </table>
        </li>`,
    );

    if (timetableStoragePref.length == 2) {
        $('#tt-picker-dropdown .tt-picker-rename')
            .first()
            .after(
                `<a
                    class="tt-picker-delete"
                    href="JavaScript:void(0);"
                    data-bs-toggle="modal"
                    data-bs-target="#delete-modal"
                    ><i class="fas fa-trash"></i
                ></a>`,
            );
    }
    showAddTeacherDiv();
}

/*
    Function to check if slots are clashing
 */
function checkSlotClash() {
    $('#timetable tr td').removeClass('clash');
    $('#course-list tr').removeClass('table-danger');

    const $theoryHours = $('#theory td:not(.lunch)');
    const $labHours = $('#lab td:not(.lunch)');

    $('#timetable tr').each(function () {
        $('.highlight', this).each(function () {
            const index = $(this).index();
            var currentEnd, nextStart;

            if ($('div', this).data('is-lab')) {
                currentEnd = parse(
                    $labHours.eq(index).data('end'),
                    'h:mm aa',
                    new Date(),
                );

                if (!isValid(currentEnd)) {
                    currentEnd = parse(
                        $labHours.eq(index).data('end'),
                        'HH:mm',
                        new Date(),
                    );
                }
            } else if ($('div', this).data('is-theory')) {
                currentEnd = parse(
                    $theoryHours.eq(index).data('end'),
                    'h:mm aa',
                    new Date(),
                );

                if (!isValid(currentEnd)) {
                    currentEnd = parse(
                        $theoryHours.eq(index).data('end'),
                        'HH:mm',
                        new Date(),
                    );
                }
            }

            if ($('div', $(this).next()).data('is-lab')) {
                nextStart = parse(
                    $labHours.eq(index + 1).data('start'),
                    'h:mm aa',
                    new Date(),
                );

                if (!isValid(nextStart)) {
                    nextStart = parse(
                        $labHours.eq(index + 1).data('start'),
                        'HH:mm',
                        new Date(),
                    );
                }
            } else if ($('div', this).data('is-theory')) {
                nextStart = parse(
                    $theoryHours.eq(index + 1).data('start'),
                    'h:mm aa',
                    new Date(),
                );

                if (!isValid(nextStart)) {
                    nextStart = parse(
                        $theoryHours.eq(index + 1).data('start'),
                        'HH:mm',
                        new Date(),
                    );
                }
            }

            if ($('div', this).length > 1) {
                $(this).addClass('clash');

                $('div', this).each(function () {
                    const dataCourse = $(this).data('course');
                    $(`#course-list tr[data-course=${dataCourse}]`).addClass(
                        'table-danger',
                    );
                });
            }

            if (nextStart && nextStart < currentEnd) {
                $(this).addClass('clash');
                $(this).next().addClass('clash');

                const dataCourse = $('div', this).data('course');
                $(`#course-list tr[data-course=${dataCourse}]`).addClass(
                    'table-danger',
                );

                $('div', $(this).next()).each(function () {
                    const dataCourse = $(this).data('course');
                    $(`#course-list tr[data-course=${dataCourse}]`).addClass(
                        'table-danger',
                    );
                });
            }
        });
    });
}

/*
    Function to initialize quick visualization
 */
function initializeQuickVisualization() {
    /*
        Click event for the quick visualization buttons
     */

    $('.quick-buttons *[class*="-tile"]').on('click', function () {
        var activeQuick;
        // Get the theory text in button
        var theoryText = [];
        theoryText.push($(this).text());
        theoryText = theoryText;

        var slot = this.classList[0].split('-')[0];
        var isHighlighted = $(this).hasClass('highlight');
        if (
            !isCommonSlot(theoryText, slotsForAttack()) ||
            isHighlighted ||
            !$('#attack-toggle').is(':checked')
        ) {
            if ($('#attack-toggle').is(':checked')) {
                activeQuick = activeTable.attackQuick;
            } else {
                activeQuick = activeTable.quick;
            }

            if (
                !$(`#timetable .${slot}`).hasClass('clash') &&
                $(`#timetable .${slot}`).children('div').length == 0
            ) {
                var slots = [];

                $(`#timetable .${slot}`).each((i, el) => {
                    var row = $(el).parent().index();
                    var column = $(el).index();

                    slots.push([row, column, true]);
                });

                if (isHighlighted) {
                    $(`#timetable .${slot}`).removeClass('highlight');
                    if ($('#attack-toggle').is(':checked')) {
                        activeTable.attackQuick =
                            activeTable.attackQuick.filter((el) => {
                                for (var i = 0; i < slots.length; ++i) {
                                    if (
                                        el[0] == slots[i][0] &&
                                        el[1] == slots[i][1]
                                    ) {
                                        return false;
                                    }
                                }

                                return true;
                            });
                    } else {
                        activeTable.quick = activeTable.quick.filter((el) => {
                            for (var i = 0; i < slots.length; ++i) {
                                if (
                                    el[0] == slots[i][0] &&
                                    el[1] == slots[i][1]
                                ) {
                                    return false;
                                }
                            }

                            return true;
                        });
                    }
                } else {
                    $(`#timetable .${slot}`).addClass('highlight');
                    activeQuick.push(...slots);
                }

                $(this).toggleClass('highlight');

                updateLocalForage();
            }

            if (document.getElementById('attack-toggle').checked) {
                revertRerrangeAttack();
                rearrangeTeacherRefreshAttack();
                showOccupiedSlots();
            }
        }
    });

    /*
        Click event for the periods when quick visualization is enabled
     */
    $('#timetable .period:not([disabled])').on('click', function () {
        if ($('#attack-toggle').is(':checked')) {
            var activeQuick = activeTable.attackQuick;
        } else {
            var activeQuick = activeTable.quick;
        }

        var slot = this.classList[0].split('-')[0];

        var textContent = $(this).text();
        var slots = textContent.split(' / ');
        var labSlots = slots.filter((slot) => slot.startsWith('L'));
        var isHighlighted = $(this).hasClass('highlight');
        if (
            isCommonSlot(labSlots, slotsForAttack()) &&
            !isHighlighted &&
            $('#attack-toggle').is(':checked')
        ) {
            return;
        }

        if (
            $('#quick-toggle').attr('data-state') == 'enabled' &&
            !$(this).hasClass('clash') &&
            $(this).children('div').length == 0
        ) {
            var slot = this.classList[1];
            var row = $(this).parent().index();
            var column = $(this).index();

            $(this).toggleClass('highlight');

            if (!$(this).hasClass('highlight')) {
                if ($('#attack-toggle').is(':checked')) {
                    activeTable.attackQuick = activeTable.attackQuick.filter(
                        (el) => el[0] != row || el[1] != column,
                    );
                } else {
                    activeTable.quick = activeTable.quick.filter(
                        (el) => el[0] != row || el[1] != column,
                    );
                }
            } else {
                activeQuick.push([row, column]);
            }

            if ($(`#timetable .${slot}`).not('.highlight').length == 0) {
                $(`.quick-buttons .${slot}-tile`).addClass('highlight');
            } else {
                $(`.quick-buttons .${slot}-tile`).removeClass('highlight');
            }

            updateLocalForage();
        }
        if (document.getElementById('attack-toggle').checked) {
            revertRerrangeAttack();
            rearrangeTeacherRefreshAttack();
            showOccupiedSlots();
        }
    });
}

/*
    Function to initialize the timetable
 */
window.initializeTimetable = () => {
    var timetable;
    $('#timetable tr').slice(2).hide();
    $('#timetable tr td:not(:first-child)').remove();

    if (window.campus == 'Chennai') {
        timetable = require('../schemas/chennai.json');
    } else {
        timetable = require('../schemas/vellore.json');
    }

    var theory = timetable.theory,
        lab = timetable.lab;
    var theoryIndex = 0,
        labIndex = 0;
    var $quickButtons = $('.quick-buttons').eq(0); // Morning slot quick buttons

    while (theoryIndex < theory.length || labIndex < lab.length) {
        const theorySlots = theory[theoryIndex];
        const labSlots = lab[labIndex];

        if (theorySlots && labSlots && !theorySlots.days && !labSlots.days) {
            $('#timetable tr:first').append(
                '<td class="lunch" style="width: 8px;" rowspan="9">L<br />U<br />N<br />C<br />H</td>',
            );
            $quickButtons = $('.quick-buttons').eq(1); // Afternoon slot quick buttons
            ++theoryIndex;
            ++labIndex;

            continue;
        }

        const $theoryHour = $('<td class="theory-hour"></td>');
        const $labHour = $('<td class="lab-hour"></td>');

        if (theorySlots && theorySlots.start && theorySlots.end) {
            $theoryHour.html(
                `${theorySlots.start}<br />to<br />${theorySlots.end}`,
            );
            $theoryHour.data('start', theorySlots.start);
            $theoryHour.data('end', theorySlots.end);
        }

        if (labSlots && labSlots.start && labSlots.end) {
            $labHour.html(`${labSlots.start}<br />to<br />${labSlots.end}`);
            $labHour.data('start', labSlots.start);
            $labHour.data('end', labSlots.end);
        }

        $('#theory').append($theoryHour);
        $('#lab').append($labHour);

        const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        for (var i = 0; i < days.length; ++i) {
            const $period = $('<td class="period"></td>');
            const day = days[i];

            if (theorySlots && theorySlots.days && day in theorySlots.days) {
                const slot = theorySlots.days[day];
                $period.text(slot);
                $period.addClass(slot);
                $(`#${day}`).show();

                // Add quick buttons for theory slots
                if (!$(`.${slot}-tile`).get(0)) {
                    var index = slot.replace(/[^A-Z]/gi, '').length - 1;

                    while (index >= $quickButtons.find('tr').length) {
                        $quickButtons.find('table').append('<tr></tr>');
                    }

                    $quickButtons
                        .find('tr')
                        .eq(index)
                        .append(
                            `<button class="${slot}-tile btn quick-button">${slot}</button>`,
                        );
                }
            }

            if (labSlots && labSlots.days && day in labSlots.days) {
                const slot = labSlots.days[day];
                $period.text(
                    ($period.text() != '' ? $period.text() + ' / ' : '') + slot,
                );
                $period.addClass(slot);
                $(`#${day}`).show();
            }

            if ($period.text() == '') {
                $period.attr('disabled', true);
            }

            $(`#${day}`).append($period);
        }

        if (theorySlots && !theorySlots.lunch) {
            ++theoryIndex;
        }

        if (labSlots && !labSlots.lunch) {
            ++labIndex;
        }
    }
    initializeQuickVisualization();

    /*
        Getting saved data from localforage
     */
    localforage
        .getItem('timetableStoragePref')
        .then(function (storedValue) {
            timetableStoragePref = storedValue || timetableStoragePref;
            activeTable = timetableStoragePref[0];

            updatePickerLabel(activeTable.name);
            fillPage();
            fillLeftBoxInCoursePanel();
            showAddTeacherDiv();
            activateSortableForCourseList();
            addEventListnerToCourseList();
            console.log(lastMerge);
            // Renaming the 'Default Table' option
            $('#tt-picker-dropdown .tt-picker-label a')
                .first()
                .attr('data-table-id', activeTable.id)
                .text(activeTable.name);

            timetableStoragePref.slice(1).forEach(function (table) {
                addTableToPicker(table.id, table.name);
            });
            
        })
        .catch(console.error);
};

/*
    Function to add a course to the timetable
 */
window.addCourseToTimetable = (courseData) => {
    courseData.slots.forEach(function (slot) {
        if (courseData.courseCode == '') {
            var $divElement = $(
                `<div 
                    data-course="course${courseData.courseId}"
                    >${courseData.courseCode}${
                    courseData.venue != '' ? '' + courseData.venue : ''
                }</div
                >`,
            );
        } else {
            var $divElement = $(
                `<div 
                    data-course="course${courseData.courseId}"
                    >${courseData.courseCode}${
                    courseData.venue != '' ? '-' + courseData.venue : ''
                }</div
                >`,
            );
        }
        if (courseData.slots[0][0] == 'L') {
            $divElement.data('is-lab', true);
        } else {
            $divElement.data('is-theory', true);
        }

        $(`#timetable tr .${slot}`).addClass('highlight').append($divElement);

        $(`.quick-buttons .${slot}-tile`).addClass('highlight');
    });
    checkSlotClash();
    updateLocalForage();
};

/*
    Function to remove a course from the timetable
 */
window.removeCourseFromTimetable = (course) => {
    $(`#timetable tr td div[data-course="${course}"]`)
        .parent()
        .each(function () {
            var activeQuick;

            if ($('#attack-toggle').is(':checked')) {
                activeQuick = activeTable.attackQuick;
            } else {
                activeQuick = activeTable.quick;
            }
            if ($(this).children().length != 1) {
                return;
            }

            $(this).removeClass('highlight');
            var slot = this.classList[1];

            if (!$(`.quick-buttons .${slot}-tile`).hasClass('highlight')) {
                return;
            }

            var row = $(this).parent().index();
            var column = $(this).index();

            for (var i = 0; i < activeQuick.length; ++i) {
                var el = activeQuick[i];

                if (el[0] == row && el[1] == column) {
                    if ($('#quick-toggle').attr('data-state') == 'enabled') {
                        $(this).addClass('highlight');
                    }

                    return;
                }
            }

            $(`.quick-buttons .${slot}-tile`).removeClass('highlight');
        });

    $(`#timetable tr td div[data-course="${course}"]`).remove();
    checkSlotClash();
};

/*
    Function to clear the timetable from the body but not delete it's data
 */

window.clearTimetable = () => {
    $('#timetable .period').removeClass('highlight clash');
    $('.quick-buttons *[class*="-tile"]').removeClass('highlight');

    if ($('#timetable tr div[data-course]')) {
        $('#timetable tr div[data-course]').remove();
    }
};

// Add event listener to the toggle checkbox
document
    .querySelector('#tt-sub-edit-switch')
    .addEventListener('change', function () {
        // Update the value of editSub based on the checkbox state
        editSub = this.checked;
        if (this.checked) {
            closeAllDropdowns();
            document.getElementById('div-for-edit-teacher').style.display =
                'none';
            document.getElementById('edit_msg_').style.display = 'block';
            document.getElementById('edit_msg_').innerText =
                'Click on the Course to edit it.';
        } else {
            document.getElementById('div-for-edit-course').style.display =
                'none';
            document.getElementById('div-for-edit-teacher').style.display =
                'none';
            document.getElementById('edit_msg_').style.display = 'block';
            document.getElementById('edit_msg_').innerText =
                'Click on the Teacher to edit it.';
            selectBackgroundRemovalOfPreviousH2s();
            selectBackgroundRemovalOfPreviousLi();
        }
    });

// Add new course on click of add button
document
    .getElementById('saveSubjectModal')
    .addEventListener('click', function () {
        var courseName = document
            .getElementById('course-input_remove')
            .value.trim();

        courseName = processRawCourseName(courseName);
        const credits = parseCreditValue(
            document.getElementById('credits-input').value.trim(),
        );

        function addSubDiv(subjectName, credits) {
            const div = document.createElement('div');
            div.classList.add('dropdown');
            div.classList.add('dropdown-teacher');
            const divHeading = document.createElement('div');
            divHeading.classList.add('dropdown-heading');
            divHeading.setAttribute('onclick', 'toggleDropdown(this)');
            const divH2s = document.createElement('div');
            divH2s.classList.add('h2s');
            divH2s.style.display = 'flex';
            divH2s.style.flexDirection = 'row';
            const h2 = document.createElement('h2');
            const spanCname = document.createElement('span');
            spanCname.classList.add('cname');
            spanCname.textContent = subjectName;

            const pArrow = document.createElement('p');
            pArrow.classList.add('arrow');

            const h4 = document.createElement('h4');
            h4.textContent = `[${credits}]`;
            divH2s.appendChild(h2);
            divH2s.appendChild(h4);
            h2.appendChild(spanCname);
            h2.appendChild(pArrow);
            divHeading.appendChild(divH2s);
            div.appendChild(divHeading);
            const ul = document.createElement('ul');
            ul.classList.add('dropdown-list');
            div.appendChild(ul);
            document.getElementById('subjectArea').appendChild(div);
        }
        // <div class="dropdown dropdown-teacher"><div class="dropdown-heading" onclick="toggleDropdown(this)"><div class="h2s" style="display: flex; flex-direction: row;"><h2><span class="cname">sss</span><p class="arrow"></p></h2><h4>[1]</h4></div></div><ul class="dropdown-list"></ul></div>

        const spanCourseAddSuccess = document.getElementById('span-course-add');
        var spanMsg = '';
        var spanMsgColor = '';

        if (
            courseName === '' ||
            isNaN(credits) ||
            credits < 0 ||
            credits > 30
        ) {
            if (courseName === '' && isNaN(credits)) {
                spanMsg = 'Course Name and Credits are empty';
                spanMsgColor = 'red';
            } else if (courseName === '' || courseName === undefined) {
                spanMsg = 'Course Name is empty';
                spanMsgColor = 'red';
            } else if (isNaN(credits)) {
                spanMsg = 'Credits is empty';
                spanMsgColor = 'red';
            } else {
                spanMsg = 'Credits should be between 0 and 30';
                spanMsgColor = 'red';
            }
        } else {
            if (
                !timetableStoragePref[window.activeTable.id].hasOwnProperty(
                    'subject',
                )
            ) {
                timetableStoragePref[window.activeTable.id]['subject'] = {};
                const subject = { teacher: {}, credits: credits };
                timetableStoragePref[window.activeTable.id].subject[
                    courseName
                ] = subject;
                spanMsg = 'Course Added Successfully';
                spanMsgColor = 'green';
                document.getElementById('course-input_remove').value = '';
                document.getElementById('credits-input').value = '';
                addSubDiv(courseName, credits);
            } else if (
                !Object.keys(
                    timetableStoragePref[window.activeTable.id].subject,
                )
                    .map((key) => key.toLowerCase())
                    .includes(courseName.toLowerCase())
            ) {
                const subject = { teacher: {}, credits: credits };
                timetableStoragePref[window.activeTable.id].subject[
                    courseName
                ] = subject;
                spanMsg = 'Course Added Successfully';
                spanMsgColor = 'green';
                document.getElementById('course-input_remove').value = '';
                document.getElementById('credits-input').value = '';
                addSubDiv(courseName, credits);
            } else {
                spanMsg = 'Course Already Exists';
                spanMsgColor = 'orange';
            }
            updateLocalForage();
        }
        document.getElementById('hide_br').style.display = 'none';
        spanCourseAddSuccess.style.color = spanMsgColor;
        spanCourseAddSuccess.style.fontWeight = 'bolder';
        spanCourseAddSuccess.textContent = spanMsg;
        setTimeout(() => {
            spanCourseAddSuccess.textContent = '';
            document.getElementById('hide_br').style.display = 'inline';
        }, 5000);
    });

// load teacher view
document
    .getElementById('tt-teacher-add')
    .addEventListener('click', function () {
        showAddTeacherDiv();
    });

document
    .getElementById('tt-subject-done')
    .addEventListener('click', closeEditPref);

// Add New teacher
document
    .getElementById('saveTeacherModal')
    .addEventListener('click', function () {
        var inputElementSave = document.getElementById('slot-input');
        document.getElementById('slot-input').value = cleanSlotString(
            inputElementSave.value,
        );
        document.getElementById('slot-input').value = removeDuplicateSlots(
            document.getElementById('slot-input').value,
        );
        const courseName = document.getElementById(
            'course-select-add-teacher',
        ).value;
        const teacherName = document
            .getElementById('teacher-input_remove')
            .value.trim();
        var slotsInput = document
            .getElementById('slot-input')
            .value.trim()
            .trim('+')
            .toUpperCase();
        var venueInput = document
            .getElementById('venue-input')
            .value.trim()
            .toUpperCase();
        const colorInput = document.getElementById('color1-select').value;
        const spanTeacherAddSuccess =
            document.getElementById('span-teacher-add');
        var spanMsg = '';
        var spanMsgColor = '';
        if (courseName === 'Select Course' || teacherName === '') {
            if (courseName === 'Select Course' && teacherName === '') {
                spanMsg = 'Course Name and Teacher Name are empty';
                spanMsgColor = 'red';
            } else if (courseName === 'Select Course') {
                spanMsg = 'Course Name is empty';
                spanMsgColor = 'red';
            } else if (teacherName === '') {
                spanMsg = 'Teacher Name is empty';
                spanMsgColor = 'red';
            }
        } else {
            if (
                !timetableStoragePref[window.activeTable.id].hasOwnProperty(
                    'subject',
                ) ||
                Object.keys(timetableStoragePref[window.activeTable.id].subject)
                    .length === 0
            ) {
                spanMsg = 'You need to add courses first';
                spanMsgColor = 'red';
            } else if (
                !Object.keys(
                    timetableStoragePref[window.activeTable.id].subject,
                )
                    .map((key) => key.toLowerCase())
                    .includes(courseName.toLowerCase())
            ) {
                spanMsg = 'Course Does Not Exist';
                spanMsgColor = 'red';
            } else {
                if (isSlotExist(slotsInput) === false) {
                    spanMsg = 'Slot Does Not Exist';
                    spanMsgColor = 'red';
                } else {
                    let x = addTeacher(
                        courseName,
                        teacherName,
                        slotsInput,
                        venueInput,
                    );
                    if (x == null) {
                        spanMsg = 'Slot error';
                        spanMsgColor = 'red';
                    } else if (x == true) {
                        spanMsg = 'Teacher Added Successfully';
                        spanMsgColor = 'green';
                        document.getElementById('teacher-input_remove').value =
                            '';
                    } else {
                        spanMsg = 'Teacher Already Exists';
                        spanMsgColor = 'orange';
                    }
                }
            }
            updateDataJsonFromCourseList();
            revertRerrange();
            rearrangeTeacherRefresh();
            updateLocalForage();
        }
        document.getElementById('hide_br').style.display = 'none';
        spanTeacherAddSuccess.style.color = spanMsgColor;
        spanTeacherAddSuccess.style.fontWeight = 'bolder';
        spanTeacherAddSuccess.textContent = spanMsg;
        setTimeout(() => {
            spanTeacherAddSuccess.textContent = '';
            document.getElementById('hide_br').style.display = 'inline';
        }, 5000);
        addEventListeners();
    });

// On click of edit button
document.getElementById('tt-subject-edit').addEventListener('click', editPref);

// Load the subjectArea show all info
document.addEventListener('DOMContentLoaded', onPageLoad);

// Edit course/Subject Save button cliuck event
document
    .getElementById('saveSubjectEditModal')
    .addEventListener('click', function () {
        let courseDiv = document.getElementById('div-for-edit-course');
        var courseName = processRawCourseName(
            courseDiv.querySelector('#course-input_edit').value.trim(),
        );
        var credits = parseCreditValue(
            courseDiv.querySelector('#credits-input-edit').value,
        );
        var courseNamePre = courseDiv.querySelector(
            '#course-input-edit-pre',
        ).innerText;
        var courseNamePreDiv = courseDiv.querySelector(
            '#course-input-edit-pre',
        );
        const courseTr = getCourseTrInCourseList(courseNamePre);

        let subjectArea = document.getElementById('subjectArea');
        let allSpan = subjectArea.querySelectorAll('.cname');
        var spanMsg = 'Course not updated';
        var spanMsgColor = 'red';
        var creditsInput = courseDiv.querySelector('#credits-input-edit').value;
        if (courseName === '') {
            spanMsg = 'Course name cannot be empty';
            spanMsgColor = 'red';
        } else if (
            courseDiv.querySelector('#credits-input-edit').value.trim() ===
                '' ||
            creditsInput === '' ||
            isNaN(creditsInput) ||
            creditsInput < 0 ||
            creditsInput > 30
        ) {
            if (creditsInput === '' || isNaN(creditsInput)) {
                spanMsg = 'Credits cannot be empty';
                spanMsgColor = 'red';
            } else if (creditsInput < 0 || creditsInput > 30) {
                spanMsg = 'Credits should be between 0 and 30';
                spanMsgColor = 'red';
            }
        } else {
            allSpan.forEach((span) => {
                if (
                    span.innerText.toLowerCase() === courseNamePre.toLowerCase()
                ) {
                    var tempSwitchToPassUpdates = 1;
                    var countSameCourseName = 0;
                    // check if there is a course with same name

                    allSpan.forEach((span2) => {
                        if (
                            span2.innerText.toLowerCase() ===
                            courseName.toLowerCase()
                        ) {
                            countSameCourseName += 1;
                        }
                    });
                    if (
                        countSameCourseName > 0 &&
                        courseName.toLowerCase() !== courseNamePre.toLowerCase()
                    ) {
                        tempSwitchToPassUpdates = 0;
                    }
                    if (
                        courseName.toLowerCase() ===
                            courseNamePre.toLowerCase() &&
                        courseDiv.querySelector('#credits-input-edit').value ===
                            courseDiv.querySelector('#credit-input-edit-pre')
                                .innerText
                    ) {
                        spanMsg = 'No changes made';
                        spanMsgColor = 'orange';
                    } else if (tempSwitchToPassUpdates === 1) {
                        span.innerText = courseName;
                        courseNamePreDiv.innerText = span.innerText;
                        courseDiv.querySelector(
                            '#credit-input-edit-pre',
                        ).innerText = courseDiv
                            .querySelector('#credits-input-edit')
                            .value.trim();
                        span.parentElement.parentElement.querySelector(
                            'h4',
                        ).innerText =
                            '[' +
                            courseDiv
                                .querySelector('#credits-input-edit')
                                .value.trim() +
                            ']';
                        spanMsg = 'Course updated succesfully';
                        spanMsgColor = 'green';
                        if (courseTr) {
                            updateCourseList(courseTr, courseName, credits);
                        }
                        updateAttackDataOnCourseSave(
                            courseNamePre,
                            courseName,
                            credits,
                        );
                        createSubjectJsonFromHtml();
                    } else {
                        spanMsg = 'Course already exists';
                        spanMsgColor = 'orange';
                    }
                }
            });
        }

        var spanMsgDiv = document.getElementById('span-course-edit');
        spanMsgDiv.innerText = spanMsg;
        spanMsgDiv.style.color = spanMsgColor;
        spanMsgDiv.style.display = 'block';
        spanMsgDiv.style.fontWeight = 'bolder';
        var hrHide = document.getElementById('hide_br-edit');
        hrHide.style.display = 'none';
        setTimeout(function () {
            spanMsgDiv.style.display = 'none';
            hrHide.style.display = 'inline';
        }, 4000);
    });

// Edit Teacher Save button click event
document
    .getElementById('saveTeacherEdit')
    .addEventListener('click', function () {
        var inputElementEdit = document.getElementById('slot-input-edit');
        inputElementEdit.value = cleanSlotString(inputElementEdit.value);
        inputElementEdit.value = removeDuplicateSlots(inputElementEdit.value);
        const courseName = document.getElementById('teacher-edit-course').value;
        const teacherNamePre = document.getElementById(
            'teacher-input_remove-edit-pre',
        ).value;
        const trElementCourseList = getCourseTrInCourseList(
            courseName,
            teacherNamePre,
        );
        const teacherName = document
            .getElementById('teacher-input_remove-edit')
            .value.trim();
        var slotsInput = document
            .getElementById('slot-input-edit')
            .value.trim()
            .trim('+')
            .toUpperCase();
        var venueInput = document
            .getElementById('venue-input-edit')
            .value.trim()
            .toUpperCase();
        if (slotsInput === '') {
            slotsInput = 'SLOTS';
        }
        if (venueInput === '') {
            venueInput = 'VENUE';
        }

        const colorInput = document.getElementById('color1-select-edit').value;
        const spanTeacherMsg = document.getElementById('span-teacher-edit');
        const brHideTeacher = document.getElementById('hide_br_teacher-edit');
        var subjectArea = document.getElementById('subjectArea');
        var allSpan = subjectArea.querySelectorAll('.cname');
        var spanMsg = 'Not Updated';
        var spanMsgColor = 'red';
        for (const span of allSpan) {
            if (span.innerText.toLowerCase() === courseName.toLowerCase()) {
                if (teacherName === '') {
                    spanMsg = 'Teacher name cannot be empty';
                    spanMsgColor = 'red';
                } else if (
                    teacherNamePre.toLowerCase() === teacherName.toLowerCase()
                ) {
                    var allLi =
                        span.parentElement.parentElement.parentElement.nextElementSibling.querySelectorAll(
                            'li',
                        );
                    if (isSlotExist(slotsInput) === false) {
                        spanMsg = 'Slot Does Not Exist';
                        spanMsgColor = 'red';
                    } else {
                        for (const li of allLi) {
                            const allDiv = li.querySelectorAll('div');
                            if (
                                allDiv[0].innerText.toLowerCase() ===
                                teacherNamePre.toLowerCase()
                            ) {
                                allDiv[0].innerText = teacherName;
                                allDiv[1].innerText = slotsInput;
                                allDiv[2].innerText = venueInput;
                                li.style.backgroundColor = colorInput;
                                document.getElementById(
                                    'teacher-input_remove-edit-pre',
                                ).value = teacherName;
                                spanMsg = 'Teacher updated successfully';
                                createSubjectJsonFromHtml();
                                spanMsgColor = 'green';
                                if (trElementCourseList) {
                                    updateTeacherInCourseList(
                                        trElementCourseList,
                                        teacherName,
                                        slotsInput,
                                        venueInput,
                                    );
                                }
                                updateTeacherInAttackDataOnTeacherSave(
                                    courseName,
                                    teacherNamePre,
                                    teacherName,
                                    slotsInput,
                                    venueInput,
                                );
                                break;
                            }
                        }
                    }
                } else {
                    var allLi =
                        span.parentElement.parentElement.parentElement.nextElementSibling.querySelectorAll(
                            'li',
                        );
                    var editTeacherSwitch = 1;
                    for (const li of allLi) {
                        const allDiv = li.querySelectorAll('div');
                        if (
                            allDiv[0].innerText.toLowerCase() ===
                            teacherName.toLowerCase()
                        ) {
                            spanMsg = 'Teacher already exists';
                            spanMsgColor = 'orange';
                            editTeacherSwitch = 0;
                            break;
                        }
                    }
                    if (editTeacherSwitch === 1) {
                        if (isSlotExist(slotsInput) === false) {
                            spanMsg = 'Slot Does Not Exist';
                            spanMsgColor = 'red';
                        } else {
                            for (const li of allLi) {
                                const allDiv = li.querySelectorAll('div');
                                if (
                                    allDiv[0].innerText.toLowerCase() ===
                                    teacherNamePre.toLowerCase()
                                ) {
                                    allDiv[0].innerText = teacherName;
                                    allDiv[1].innerText = slotsInput;
                                    allDiv[2].innerText = venueInput;
                                    li.style.backgroundColor = colorInput;
                                    document.getElementById(
                                        'teacher-input_remove-edit-pre',
                                    ).value = teacherName;
                                    spanMsg = 'Teacher updated successfully';
                                    spanMsgColor = 'green';
                                    if (trElementCourseList) {
                                        updateTeacherInCourseList(
                                            trElementCourseList,
                                            teacherName,
                                            slotsInput,
                                            venueInput,
                                        );
                                    }
                                    updateTeacherInAttackDataOnTeacherSave(
                                        courseName,
                                        teacherNamePre,
                                        teacherName,
                                        slotsInput,
                                        venueInput,
                                    );
                                    rearrangeTeacherRefresh();
                                    createSubjectJsonFromHtml();
                                    break;
                                }
                            }
                        }

                        break;
                    }
                }
            }
        }
        spanTeacherMsg.innerText = spanMsg;
        spanTeacherMsg.style.color = spanMsgColor;
        spanTeacherMsg.style.display = 'block';
        spanTeacherMsg.style.fontWeight = 'bolder';
        brHideTeacher.style.display = 'none';
        setTimeout(function () {
            spanTeacherMsg.style.display = 'none';
            brHideTeacher.style.display = 'inline';
        }, 4000);
        return;
    });

// Delete Teacher button click event
document
    .getElementById('deleteTeacherEdit')
    .addEventListener('click', function () {
        const courseName = document.getElementById('teacher-edit-course').value;
        const teacherName = document.getElementById(
            'teacher-input_remove-edit-pre',
        ).value;
        var spanMsg = '';
        var spanMsgColor = '';

        // Confirmation popup
        if (
            !confirm(
                `Are you sure you want to delete ${teacherName} from ${courseName}?`,
            )
        ) {
            spanMsg = 'Teacher not deleted';
            spanMsgColor = 'red';
            const spanTeacherMsg = document.getElementById('span-teacher-edit');
            const brHideTeacher = document.getElementById(
                'hide_br_teacher-edit',
            );
            spanTeacherMsg.innerText = spanMsg;
            spanTeacherMsg.style.color = spanMsgColor;
            spanTeacherMsg.style.display = 'block';
            brHideTeacher.style.display = 'none';
            setTimeout(function () {
                spanTeacherMsg.style.display = 'none';
                brHideTeacher.style.display = 'inline';
            }, 4000);
            return;
        }
        const li = getTeacherLiInSubjectArea(courseName, teacherName);
        if (li) {
            li.remove();
            courseRemove(courseName);
            createSubjectJsonFromHtml();
            if (true) {
                document.getElementById('div-for-edit-teacher').style.display =
                    'none';
                document.getElementById('edit_msg_').innerText =
                    'Click on the Teacher to edit it.';
                document.getElementById('edit_msg_').style.display = 'block';
            }
        }
    });

// Delete for Subject Edit
document
    .getElementById('deleteSubjectEdit')
    .addEventListener('click', function () {
        const courseName = document
            .getElementById('course-input-edit-pre')
            .innerText.trim();
        var subjectArea = document.getElementById('subjectArea');
        var allSpan = subjectArea.querySelectorAll('.cname');
        if (!confirm(`Are you sure you want to delete ${courseName}?`)) {
            var spanMsg = 'Course not deleted';
            var spanMsgColor = 'red';
            const spanCourseMsg = document.getElementById('span-course-edit');
            const brHideCourse = document.getElementById('hide_br-edit');
            spanCourseMsg.innerText = spanMsg;
            spanCourseMsg.style.color = spanMsgColor;
            spanCourseMsg.style.display = 'block';
            brHideCourse.style.display = 'none';
            setTimeout(function () {
                spanCourseMsg.style.display = 'none';
                brHideCourse.style.display = 'inline';
            }, 4000);
            return;
        }
        for (const span of allSpan) {
            if (span.innerText.toLowerCase() === courseName.toLowerCase()) {
                span.parentElement.parentElement.parentElement.parentElement.remove();
                courseRemove(span.innerText);
                document.getElementById('div-for-edit-course').style.display =
                    'none';
                document.getElementById('edit_msg_').innerText =
                    'Click on the Course to edit it.';
                document.getElementById('edit_msg_').style.display = 'block';
                createSubjectJsonFromHtml();
                break;
            }
        }
    });

// ==================== Attack Mode ====================
//contruct course Data Again for attack mode
function constructCourseDataAttack() {
    const courseL = getCourseListFromSubjectArea();
    courseL.forEach((courseName) => {
        var ul = getUlInSubjectArea(courseName);
        var radio = ul.querySelectorAll('input[type="radio"]');
        radio.forEach((rad) => {
            if (rad.checked === true) {
            }
        });
    });
}

// Add event listener to the toggle checkbox
document
    .querySelector('#attack-toggle')
    .addEventListener('change', function () {
        // Update the value of editSub based on the checkbox state
        if (this.checked) {
            activateSortable();
            revertRerrange();
            closeEditPref();
            closeEditPref1();
            document.getElementById('div-for-edit-teacher').style.display =
                'none';
            document.getElementById('edit_msg_').style.display = 'block';
            document.getElementById('edit_msg_').innerText =
                'Live FFCS Mode Enabled.';
            document.getElementById('tt-subject-edit').style.display = 'none';
            document.getElementById('tt-subject-add').style.display = 'none';
            document.getElementById('tt-teacher-add').style.display = 'none';
            document.getElementById('tt-subject-collapse').style.display =
                'block';
            document.getElementById('tt-subject-done').style.display = 'none';
            document.getElementById('div-for-add-teacher').style.display =
                'none';
            document.getElementById('tt-sub-edit-switch-div').style.display =
                'none';
            document.getElementById('tt-sub-edit-switch').checked = false;
            document.getElementById('div-for-edit-course').style.display =
                'none';
            document.getElementById('div-for-edit-teacher').style.display =
                'none';
            document.getElementById('div-auto-focus').style.display = 'block';
            closeAllDropdowns();
            try {
                document.querySelector('.dropdown-list').classList.add('show');
                document
                    .querySelector('.dropdown-list')
                    .previousElementSibling.classList.add('open');
            } catch (error) {}

            revertRerrangeAttack();
            rearrangeTeacherRefreshAttack();
            removeEventListeners();
            makeRadioFalseOnNeed();
            document.getElementById('div-for-attack-slot').style.display =
                'flex';
            showOccupiedSlots();
            clearTimetable();
            clearCourseList();
            makeRadioTrueAttack();
            fillPage();
        } else {
            document.getElementById('div-auto-focus').style.display = 'none';

            document.getElementById('edit_msg_').innerText =
                'Click on the Teacher to edit it.';
            document.getElementById('edit_msg_').style.display = 'none';
            removeEventListenersAttack();
            revertRerrange();
            closeEditPref();
            activateSortable();
            closeEditPref1();
            document.getElementById('div-for-attack-slot').style.display =
                'none';
            clearTimetable();
            clearCourseList();
            fillPage();
        }
    });
document
    .getElementById('save-panel-button')
    .addEventListener('click', function () {
        // Convert the activeTable to a JSON string
        if (editTeacher == true || editSub == true) {
            document.getElementById('tt-subject-done').click();
        }
        var jsonStr = JSON.stringify(activeTable);
        var utf8Str = btoa(encodeURIComponent(jsonStr));
        var blob = new Blob([utf8Str], { type: 'application/octet-stream' }); // Set MIME type as octet-stream
        var url = URL.createObjectURL(blob); // Create a URL for the Blob object
        var dlAnchorElem = document.createElement('a'); // Create a new 'a' element
        // Set its attributes
        dlAnchorElem.setAttribute('href', url);
        dlAnchorElem.setAttribute(
            'download',
            activeTable.name + '.ffcsplanner',
        );
        document.body.appendChild(dlAnchorElem); // Append it to the body (this is necessary for Firefox)
        dlAnchorElem.click();
        // Remove the element from the body after the download starts
        document.body.removeChild(dlAnchorElem);
        // Release the created URL
        URL.revokeObjectURL(url);
    });

// id of the upload button is 'load-panel-button'
// Upload button click event (Upload TT)
document
    .getElementById('load-panel-button')
    .addEventListener('click', function () {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = '.ffcsplanner, .txt, .ffcsonthego';
        input.onchange = function (event) {
            processFile(event.target.files[0]);
        };
        input.click();
    });

// onclick clear with id 'clear-course-button' the courselist get cleared
document
    .getElementById('clear-course-button')
    .addEventListener('click', function () {
        // Ask for confirmation

        if (document.getElementById('attack-toggle').checked) {
            if (
                !confirm(
                    'Are you sure you want to clear the course list and Quick Visualization?',
                )
            ) {
                return;
            }
            clearTimetable();
            clearCourseList();
            activeTable.attackQuick = [];
            activeTable.attackData = [];
            showOccupiedSlots();
            makeRadioTrueAttack();
            makeRadioFalseOnNeed();
            revertRerrangeAttack();
            rearrangeTeacherRefreshAttack();
        } else {
            if (!confirm('Are you sure you want to clear the course list?')) {
                return;
            }
            clearTimetable();
            getCourseListFromSubjectArea().forEach((courseName) => {
                courseRemove(courseName);
            });
            revertRerrange();
            rearrangeTeacherRefresh();
        }
    });

// onclick of div with class 'c_pref' close all dropdowns
document.querySelectorAll('.c_pref').forEach((div) => {
    div.addEventListener('click', function () {
        closeAllDropdowns();
    });
});

// Slot input removal of duplicate slots
document
    .getElementById('slot-input-edit')
    .addEventListener('input', function (event) {
        event.target.value = cleanSlotString(event.target.value);
    });

document
    .getElementById('slot-input')
    .addEventListener('input', function (event) {
        event.target.value = cleanSlotString(event.target.value);
    });

// Not for parcel bundler
// if use other bundler which supports routing
// then uncomment this code
// and remove the hidden tag from the element with id 'switchButton' in index.html

// document.addEventListener('DOMContentLoaded', () => {
//     const switchButton = document.getElementById('switchButton');

//     switchButton.addEventListener('click', () => {
//         // Open pref_index.html in a new window
//         window.open('./pref_index.html', '_blank');
//     });
// });
