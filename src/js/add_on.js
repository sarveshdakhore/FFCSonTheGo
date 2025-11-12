document.getElementById('hide_br').style.display = 'inline';
window.addEventListener('resize', function () {
    // if mobile phone in portrait mode show div with id 'mobile_message'
    // Process each 'tr' before activating the Sortable
    var courseList = document.querySelector('#course-list tbody');

    [].forEach.call(courseList.getElementsByTagName('tr'), function (tr) {
        [].forEach.call(tr.getElementsByTagName('td'), function (td) {
            // Store the original width

            td.dataset.originalWidth = getComputedStyle(td).width;
            // Set the width to the original width
            td.style.width = td.dataset.originalWidth;
        });
    });
    if (window.innerWidth < 631) {
        document.getElementById('mobile_message').style.display = 'block';
    }
    // if mobile phone in landscape mode hide div with id 'mobile_message'
    else {
        document.getElementById('mobile_message').style.display = 'none';
    }
});

document
    .getElementById('tt-subject-add')
    .addEventListener('click', function () {
        var addCourseDiv = document.getElementById('div-for-add-course');
        var addTeacherDiv = document.getElementById('div-for-add-teacher');
        addCourseDiv.style.display = 'block';
        addTeacherDiv.style.display = 'none';
    });

document
    .getElementById('course_link')
    .addEventListener('click', function (event) {
        event.preventDefault();
        var addCourseDiv = document.getElementById('div-for-add-course');
        var addTeacherDiv = document.getElementById('div-for-add-teacher');
        addCourseDiv.style.display = 'block';
        addTeacherDiv.style.display = 'none';
    });

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

// all the form elements under section with class right-box should not do anything means no request on submit
document.querySelectorAll('.right-box form').forEach((form) => {
    form.addEventListener('submit', (event) => {
        event.preventDefault();
    });
});

// Event listener for teacher sort dropdown
document.getElementById('teacher-sort-dropdown').addEventListener('change', function() {
    const sortValue = this.value;
    if (window.setTeacherSortPreference) {
        window.setTeacherSortPreference(sortValue);
    }
});

// Event listener for teacher search input
let searchTimeout;
// Track which dropdowns were opened by search
let searchOpenedDropdowns = new Set();

document.getElementById('teacher-search-input').addEventListener('input', function() {
    const searchQuery = this.value.toLowerCase().trim();

    // Debounce the search to avoid too many DOM updates
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        searchTeachersInDOM(searchQuery);
    }, 300);
});

// Function to search teachers in the DOM
function searchTeachersInDOM(query) {
    const allTeacherLists = document.querySelectorAll('.dropdown-teacher');

    // If starting a new search, record which dropdowns are already open
    if (query !== '' && searchOpenedDropdowns.size === 0) {
        allTeacherLists.forEach(dropdown => {
            const dropdownList = dropdown.querySelector('.dropdown-list');
            if (dropdownList && dropdownList.classList.contains('show')) {
                const courseName = dropdown.querySelector('.cname').textContent;
                // Mark as already open (not opened by search)
                searchOpenedDropdowns.add('existing:' + courseName);
            }
        });
    }

    allTeacherLists.forEach(dropdown => {
        const teacherItems = dropdown.querySelectorAll('.dropdown-list li');
        const dropdownList = dropdown.querySelector('.dropdown-list');
        const dropdownHeading = dropdown.querySelector('.dropdown-heading');
        const courseName = dropdown.querySelector('.cname').textContent;
        let hasVisibleTeacher = false;

        teacherItems.forEach(li => {
            const teacherName = li.querySelectorAll('div')[0]?.textContent.toLowerCase() || '';
            const slots = li.querySelectorAll('div')[1]?.textContent.toLowerCase() || '';
            const venue = li.querySelectorAll('div')[2]?.textContent.toLowerCase() || '';

            if (query === '' ||
                teacherName.includes(query) ||
                slots.includes(query) ||
                venue.includes(query)) {
                li.style.display = '';
                hasVisibleTeacher = true;
            } else {
                li.style.display = 'none';
            }
        });

        // Show/hide the entire dropdown based on whether it has visible teachers
        if (query !== '' && !hasVisibleTeacher) {
            dropdown.style.display = 'none';
        } else {
            dropdown.style.display = '';
        }

        // Open/close dropdown based on search state
        if (query !== '') {
            // If searching and has results, open the dropdown
            if (hasVisibleTeacher && !dropdownList.classList.contains('show')) {
                dropdownList.classList.add('show');
                dropdownHeading.classList.add('open');
                searchOpenedDropdowns.add('search:' + courseName);
            }
        } else {
            // If search cleared, restore all teachers' visibility
            teacherItems.forEach(li => {
                li.style.display = '';
            });

            // Only close dropdowns that were opened by search
            if (searchOpenedDropdowns.has('search:' + courseName)) {
                dropdownList.classList.remove('show');
                dropdownHeading.classList.remove('open');
            }
            // Clear the tracking set
            searchOpenedDropdowns.clear();
        }
    });
}

// Export the search function to be accessible from timetable.js
window.searchTeachersInDOM = searchTeachersInDOM;
