// Add- on js
var editSub = false;
var editTeacher = false;
function toggleDropdown(dropdownHeading) {
    if (editSub === false) {
        var dropdownList = dropdownHeading.nextElementSibling;
        dropdownList.classList.toggle('show');
        dropdownHeading.classList.toggle('open');
    }
}

document.getElementById('hide_br').style.display = 'inline';

// Function to remove the click event listener from each list item
function removeRadioClickEvent() {
    for (var i = 0; i < listItems.length; i++) {
        listItems[i].removeEventListener('click', function () {
            // Get the radio button inside this list item
            var radioButton = this.querySelector('input[type="radio"]');
            // Remove the click event listener
            radioButton.removeEventListener('click', null);
        });
    }
}

// Call the function to remove the click event listener

function removeInputFieldsInSection(sectionId) {
    var section = document.getElementById(sectionId);
    var listItems = section.querySelectorAll('li');

    listItems.forEach(function (item) {
        var inputField = item.querySelector('input');
        inputField.style.display = 'none';
    });
}

function addInputFieldsInSection(sectionId) {
    var section = document.getElementById(sectionId);
    var listItems = section.querySelectorAll('li');

    listItems.forEach(function (item) {
        var inputField = item.querySelector('input');
        inputField.style.display = 'block';
    });
}

// Rest of the code...

function editPrefCollapse() {
    closeAllDropdowns();
}

function showAddCourseDiv() {
    var addCourseDiv = document.getElementById('div-for-add-course');
    var addTeacherDiv = document.getElementById('div-for-add-teacher');
    addCourseDiv.style.display = 'block';
    addTeacherDiv.style.display = 'none';
}

document.getElementById('tt-subject-collapse').addEventListener('click', () => {
    closeAllDropdowns();
});
document.getElementById('tt-subject-add').addEventListener('click', () => {
    showAddCourseDiv();
});

document.getElementById('tt-subject-done').addEventListener('click', () => {
    closeEditPref1();
});
document.getElementById('tt-subject-edit').addEventListener('click', () => {
    editPrefAddOn();
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

function activateSortable(params) {
    var leftBox = document.querySelector('.left-box');
    Sortable.create(leftBox, {
        animation: 150,
        delay: 5,
        chosenClass: 'sortable-chosen',
    });

    var dropdownLists = document.querySelectorAll('.dropdown-list');
    dropdownLists.forEach((dropdownList) => {
        Sortable.create(dropdownList, {
            animation: 150,
            delay: 5,
            chosenClass: 'sortable-chosen',
        });
    });
}

function deactivateSortable() {
    var leftBox = document.querySelector('.left-box');
    Sortable.get(leftBox).destroy();

    var dropdownLists = document.querySelectorAll('.dropdown-list');
    dropdownLists.forEach((dropdownList) => {
        Sortable.get(dropdownList).destroy();
    });
}

function closeEditPref1() {
    editTeacher = false;
    deactivateSortable();
    document.getElementById('edit_msg_').style.display = 'none';
    document.getElementById('div-for-edit-teacher').style.display = 'none';
}
function editPrefAddOn() {
    activateSortable();
    document.getElementById('edit_msg_').style.display = 'block';
    document.getElementById('div-for-edit-teacher').style.display = 'none';
}

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
        }
    });

// Functions for rearrangements

var attackData = [];
var ttDataStructureInLFormat = {
    L1: 'A1',
    L2: 'F1',
    L3: 'D1',
    L4: 'TB1',
    L5: 'TG1',
    L6: 'L6',
    L31: 'A2',
    L32: 'F2',
    L33: 'D2',
    L34: 'TB2',
    L35: 'TG2',
    L36: 'L36',
    V3: 'V3',
    L7: 'B1',
    L8: 'G1',
    L9: 'E1',
    L10: 'TC1',
    L11: 'TAA1',
    L12: 'L12',
    L37: 'B2',
    L38: 'G2',
    L39: 'E2',
    L40: 'TC2',
    L41: 'TAA2',
    L42: 'L42',
    V4: 'V4',
    L13: 'C1',
    L14: 'A1',
    L15: 'F1',
    L16: 'V1',
    L17: 'V2',
    L18: 'L18',
    L43: 'C2',
    L44: 'A2',
    L45: 'F2',
    L46: 'TD2',
    L47: 'TBB2',
    L48: 'L48',
    V5: 'V5',
    L19: 'D1',
    L20: 'B1',
    L21: 'G1',
    L22: 'TE1',
    L23: 'TCC1',
    L24: 'L24',
    L49: 'D2',
    L50: 'B2',
    L51: 'G2',
    L52: 'TE2',
    L53: 'TCC2',
    L54: 'L54',
    V6: 'V6',
    L25: 'E1',
    L26: 'C1',
    L27: 'TA1',
    L28: 'TF1',
    L29: 'TD1',
    L30: 'L30',
    L55: 'E2',
    L56: 'C2',
    L57: 'TA2',
    L58: 'TF2',
    L59: 'TDD2',
    L60: 'L60',
    V7: 'V7',
};

// make the list of all slots in the activeTabe.data
function getSlots() {
    var slots = [];
    activeTable.data.forEach((el) => {
        el.slots.forEach((slot) => {
            slots.push(slot);
        });
    });
    slots = updateSlots(slots);
    return slots;
}

// function to update the array of slots if slot is in key of getCourseTTDataObject it will be replaced with its value
function updateSlots(slots) {
    var newSlots = [];
    slots.forEach((slot) => {
        if (slot in ttDataStructureInLFormat) {
            newSlots.push(ttDataStructureInLFormat[slot]);
        } else {
            newSlots.push(slot);
        }
    });
    return newSlots;
}

// from this function we got the ttDataStructureInLFormat
function getCourseTTDataObject() {
    const timetableTable = document.querySelector('.table-bordered');
    const rows = timetableTable.querySelectorAll('tr');

    const timetable = {};

    rows.forEach((row) => {
        const cells = row.querySelectorAll('td.period'); // Only select cells with class 'period'

        if (cells.length > 0) {
            // Check if cells array is not empty
            const day = cells[0].textContent.trim();

            for (let i = 0; i < cells.length; i++) {
                // Start from 0 to include all periods
                const period = cells[i].textContent.trim();
                if (period) {
                    const [course, lab] = period.split('/');
                    const courseTrimmed = course ? course.trim() : '';
                    const labTrimmed = lab ? lab.trim() : '';

                    if (labTrimmed) {
                        timetable[labTrimmed] = courseTrimmed;
                    } else {
                        timetable[courseTrimmed] = courseTrimmed;
                    }
                }
            }
        }
    });

    return timetable;
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
                if (!slots.includes(slot)) {
                    slots.push(slot);
                }
            });
        }
    });
    slots = updateSlots(slots);
    return slots;
}

// find the subtraction of two arrays
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

function getAllTeacherLiInSubjectArea(courseName) {
    var subjectArea = document.getElementById('subjectArea');
    var allSpan = subjectArea.querySelectorAll('.cname');
    for (const span of allSpan) {
        if (span.innerText.toLowerCase() === courseName.toLowerCase()) {
            allLi =
                span.parentElement.parentElement.parentElement.nextElementSibling.querySelectorAll(
                    'li',
                );
            return allLi;
        }
    }
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

// function to get the courseName from subject area
function getCourseListFromSubjectArea() {
    var subjectArea = document.getElementById('subjectArea');
    var allSpan = subjectArea.querySelectorAll('.cname');
    var courseList = [];
    for (const span of allSpan) {
        courseList.push(span.innerText);
    }
    return courseList;
}

function getUlInSubjectArea(courseName) {
    var subjectArea = document.getElementById('subjectArea');
    var allSpan = subjectArea.querySelectorAll('.cname');
    for (const span of allSpan) {
        if (span.innerText.toLowerCase() === courseName.toLowerCase()) {
            return span.parentElement.parentElement.parentElement.parentElement.querySelector(
                'ul',
            );
        }
    }
}

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
        var isAscending = (isDescending = false);
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
        const allTd = tr.find('td');
        console.log(allTd[2].innerText);
        if (allTd[1].innerText == '') {
            var courseName = allTd[2].innerText;
        } else {
            var courseName = allTd[1].innerText + '-' + allTd[2].innerText;
        }
        var facultuName = allTd[3].innerText;
        var teacherLi = getTeacherLiInSubjectArea(courseName, facultuName);
        teacherLi.querySelector('input[type="radio"]').checked = false;
        revertRerrange();
        rearrangeTeacherRefresh();
        removeCourseFromCourseList(course);
        removeCourseFromTimetable(course);
        var courseId = Number(course.split(/(\d+)/)[1]);
        for (var i = 0; i < activeTable.data.length; ++i) {
            if (activeTable.data[i].courseId == courseId) {
                activeTable.data.splice(i, 1);
                break;
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
import { fi, te } from 'date-fns/locale';

var timetableStoragePref = [
    {
        id: 0,
        name: 'Default Table',
        data: [],
        subject: [],
        quick: [],
    },
];

window.activeTable = timetableStoragePref[0];

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
        });

        addTableToPicker(newTableId, newTableName);
        switchTable(newTableId);
        updateLocalForage();
        fillPage1();
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
            fillPage1();
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
                    `FFCS On The Go ${activeTable.name} (Timetable).jpg`,
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
                    `FFCS On The Go ${activeTable.name} (Course List).jpg`,
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
        if ($(this).attr('data-state') == 'enabled') {
            $('i', this).prop('class', 'fas fa-eye');
            $('span', this).html('&nbsp;&nbsp;Enable Quick Visualization');
            $(this).attr('data-state', 'disabled');

            $('#timetable .highlight:not(:has(div))').removeClass('highlight');
        } else {
            $('i', this).prop('class', 'fas fa-eye-slash');
            $('span', this).html('&nbsp;&nbsp;Disable Quick Visualization');
            $(this).attr('data-state', 'enabled');

            activeTable.quick.forEach((el) =>
                $('#timetable')
                    .find('tr')
                    .eq(el[0])
                    .find('td')
                    .eq(el[1])
                    .addClass('highlight'),
            );
        }

        $('.quick-buttons').slideToggle();
    });

    /*
        Click event for the reset button in the reset modal
     */
    $('#reset-tt-button').on('click', function () {
        resetPage();
        activeTable.data = [];
        activeTable.quick = [];
        activeTable['subject'] = {};
        updateLocalForage();
        fillPage1();
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
            $('<h3>FFCS On The Go</h3>').css({
                margin: 0,
                display: 'inline',
                color: '#9c27b0',
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

/*
    Function to update the saved data
 */
function updateLocalForage() {
    localforage
        .setItem('timetableStoragePref', timetableStoragePref)
        .catch(console.error);
}

/*
    Function to get the table index
 */
function getTableIndex(id) {
    return timetableStoragePref.findIndex((el) => el.id == id);
}

/*
    Function to fill the timetable and course list
 */
function fillPage() {
    $.each(activeTable.data, function (index, courseData) {
        addCourseToCourseList(courseData);
        addCourseToTimetable(courseData);
    });

    $.each(activeTable.quick, function (index, el) {
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
    resetPage();
    activeTable = timetableStoragePref[getTableIndex(tableId)];
    updatePickerLabel(activeTable.name);
}

/*
    Function to rename the timetable picker label
 */
function updatePickerLabel(tableName) {
    $('#tt-picker-button').text(tableName);
    fillPage();
    fillPage1();

    closeEditPref();
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
    console.log(timetableStoragePref);

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
        var slot = this.classList[0].split('-')[0];

        if (
            !$(`#timetable .${slot}`).hasClass('clash') &&
            $(`#timetable .${slot}`).children('div').length == 0
        ) {
            var slots = [];

            $(`#timetable .${slot}`).each((i, el) => {
                var row = $(el).parent().index();
                var column = $(el).index();

                slots.push([row, column]);
            });

            if ($(this).hasClass('highlight')) {
                $(`#timetable .${slot}`).removeClass('highlight');

                activeTable.quick = activeTable.quick.filter((el) => {
                    for (var i = 0; i < slots.length; ++i) {
                        if (el[0] == slots[i][0] && el[1] == slots[i][1]) {
                            return false;
                        }
                    }

                    return true;
                });
            } else {
                $(`#timetable .${slot}`).addClass('highlight');
                activeTable.quick.push(...slots);
            }

            $(this).toggleClass('highlight');
            updateLocalForage();
        }
    });

    /*
        Click event for the periods when quick visualization is enabled
     */
    $('#timetable .period:not([disabled])').on('click', function () {
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
                activeTable.quick = activeTable.quick.filter(
                    (el) => el[0] != row || el[1] != column,
                );
            } else {
                activeTable.quick.push([row, column]);
            }

            if ($(`#timetable .${slot}`).not('.highlight').length == 0) {
                $(`.quick-buttons .${slot}-tile`).addClass('highlight');
            } else {
                $(`.quick-buttons .${slot}-tile`).removeClass('highlight');
            }

            updateLocalForage();
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

            for (var i = 0; i < activeTable.quick.length; ++i) {
                var el = activeTable.quick[i];

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
    updateLocalForage();
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

function generateCourseName(courseInput) {
    var courseListStr = courseInput.split('-');
    for (i = 0; i < courseListStr.length; i++) {
        courseListStr[i] = courseListStr[i].trim();
    }
    if (courseListStr.length > 1) {
        var part2 = '';
        for (var i = 1; i < courseListStr.length; i++) {
            part2 += '-' + courseListStr[i];
        }
        courseName = courseListStr[0] + part2;
    } else {
        courseName = courseListStr[0];
    }
    return courseName;
}
// save added course
document
    .getElementById('saveSubjectModal')
    .addEventListener('click', function () {
        var courseName = document
            .getElementById('course-input_remove')
            .value.trim();

        courseName = generateCourseName(courseName);
        const credits = parseInt(
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
        if (courseName === '' || isNaN(credits)) {
            if (courseName === '' && isNaN(credits)) {
                spanMsg = 'Course Name and Credits are empty';
                spanMsgColor = 'red';
            } else if (courseName === '') {
                spanMsg = 'Course Name is empty';
                spanMsgColor = 'red';
            } else if (isNaN(credits)) {
                spanMsg = 'Credits is empty';
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
            console.log(timetableStoragePref);
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

// show teacher view + refresh and build the course select input
function showAddTeacherDiv() {
    document.getElementById('div-for-edit-teacher').style.display = 'none';
    var addCourseDiv = document.getElementById('div-for-add-course');
    var addTeacherDiv = document.getElementById('div-for-add-teacher');
    addCourseDiv.style.display = 'none';
    addTeacherDiv.style.display = 'block';
    const courseSelect = document.getElementById('course-select-add-teacher');
    courseSelect.innerHTML = '';
    if (
        !timetableStoragePref[window.activeTable.id].hasOwnProperty('subject')
    ) {
        courseSelect.innerHTML =
            '<option selected>You need to add courses</option>';
        console.log('No subject');
    } else {
        if (
            Object.keys(timetableStoragePref[window.activeTable.id].subject)
                .length === 0
        ) {
            courseSelect.innerHTML =
                '<option selected>You need to add courses</option>';
        } else {
            courseSelect.innerHTML = '<option selected>Select Course</option>';
            console.log(timetableStoragePref[window.activeTable.id].subject);
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

// course name from course data
function getCourseNameFromCourseData(courseData) {
    var courseName = '';
    if (courseData.courseCode === '') {
        courseName = courseData.courseTitle;
    } else {
        courseName = courseData.courseCode + '-' + courseData.courseTitle;
    }
    return courseName;
}

// load teacher view
document
    .getElementById('tt-teacher-add')
    .addEventListener('click', function () {
        showAddTeacherDiv();
        console.log(
            JSON.stringify(timetableStoragePref[window.activeTable.id]),
        );
    });

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
    showAddTeacherDiv();
    createSubjectJsonFromHtml();
    addEventListeners();
    revertRerrange();
    rearrangeTeacherRefresh();
}
document
    .getElementById('tt-subject-done')
    .addEventListener('click', closeEditPref);

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

// Save teacher
document
    .getElementById('saveTeacherModal')
    .addEventListener('click', function () {
        const courseName = document.getElementById(
            'course-select-add-teacher',
        ).value;
        const teacherName = document
            .getElementById('teacher-input_remove')
            .value.trim();
        var slotsInput = document
            .getElementById('slot-input')
            .value.trim()
            .toUpperCase();
        var venueInput = document
            .getElementById('venue-input')
            .value.trim()
            .toUpperCase();
        const colorInput = document.getElementById('color1-select').value;
        const spanTeacherAddSuccess =
            document.getElementById('span-teacher-add');
        console.log(colorInput);
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
                if (
                    !Object.keys(
                        timetableStoragePref[window.activeTable.id].subject[
                            courseName
                        ].teacher,
                    )
                        .map((key) => key.toLowerCase())
                        .includes(teacherName.toLowerCase())
                ) {
                    timetableStoragePref[window.activeTable.id].subject[
                        courseName
                    ].teacher[teacherName] = {
                        slots: 'SLOTS',
                        venue: 'VENUE',
                        color: '',
                    };
                    if (slotsInput === '') {
                        slotsInput = 'SLOTS';
                    }
                    if (venueInput === '') {
                        venueInput = 'VENUE';
                    }

                    timetableStoragePref[window.activeTable.id].subject[
                        courseName
                    ].teacher[teacherName]['venue'] = venueInput;
                    timetableStoragePref[window.activeTable.id].subject[
                        courseName
                    ].teacher[teacherName]['slots'] = slotsInput;
                    timetableStoragePref[window.activeTable.id].subject[
                        courseName
                    ].teacher[teacherName]['color'] = colorInput;
                    spanMsg = 'Teacher Added Successfully';
                    spanMsgColor = 'green';
                    document.getElementById('slot-input').value = '';
                    document.getElementById('teacher-input_remove').value = '';
                    var teacherData = {
                        courseName: courseName,
                        slots: slotsInput,
                        venue: venueInput,
                        color: colorInput,
                        teacherName: teacherName,
                    };
                    const li = createTeacherLI(teacherData);
                    li.addEventListener('click', liClick);
                    const dropdownDivs = document.querySelectorAll('.dropdown');
                    for (let dropdownDiv of dropdownDivs) {
                        const cname = dropdownDiv.querySelector('.cname');
                        if (cname && cname.textContent === courseName) {
                            const ul = dropdownDiv.querySelector('ul');
                            if (ul && ul.tagName === 'UL') {
                                ul.appendChild(li);
                            }
                            // Exit the loop once we've found the matching element
                        }
                    }
                } else {
                    console.log('else if');

                    spanMsg = 'Teacher Already Exists';
                    spanMsgColor = 'orange';
                }
            }
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
        console.log(timetableStoragePref);
        addEventListeners();
    });

// On click of edit button
document.getElementById('tt-subject-edit').addEventListener('click', editPref);
function editPref() {
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
                credit = parseInt(credit);
                let courseDiv = document.getElementById('div-for-edit-course');
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
                allDivInLi = this.querySelectorAll('div');
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

// Targets the li to make it toggable when clicked anywhere on the li element eg the teacher name list
function addEventListeners() {
    var listItems = document.querySelectorAll('.dropdown li');
    for (var i = 0; i < listItems.length; i++) {
        listItems[i].addEventListener('click', liClick);
    }
}

// Function to remove all event listeners
function removeEventListeners() {
    var listItems = document.querySelectorAll('.dropdown li');
    for (var i = 0; i < listItems.length; i++) {
        listItems[i].removeEventListener('click', liClick);
    }
}

// What happens after cliking on li element anywhere
function liClick() {
    // Get the radio button inside this list item
    var radioButton = this.querySelector('input[type="radio"]');
    if (radioButton.checked) {
        try {
            radioButton.checked = false;
            removeRadioFalse(radioButton);
            updateDataJsonFromCourseList();
            revertRerrange();
            rearrangeTeacherRefresh();
        } catch (error) {
            console.log('error');
        }
    } else {
        radioButton.checked = true; // This radio button is now the currently selected one
        console.log(true, activeTable.data);
        addOnRadioTrue(radioButton);
        console.log(true, activeTable.data);
        updateDataJsonFromCourseList();
        revertRerrange();
        rearrangeTeacherRefresh();
        console.log('after update', activeTable.data);
    }
}

// delete from subject
function removeCourseFromSubject(dataCourseValue) {
    var courseId = Number(dataCourseValue.split(/(\d+)/)[1]);
    for (var i = 0; i < activeTable.data.length; ++i) {
        if (activeTable.data[i].courseId == courseId) {
            activeTable.data.splice(i, 1);
            break;
        }
    }
}
// get course from tr
function getCourseNameAndFacultyFromTr(trElement) {
    var td = trElement.querySelectorAll('td');
    if (td[1].innerText === '') {
        var courseII = td[2].innerText;
    } else {
        var courseII = td[1].innerText + '-' + td[2].innerText;
    }

    return [courseII, td[3].innerText];
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

// slots processing for course list
function slotsProcessingForCourseList(slotString) {
    var slots = (function () {
        var arr = [];

        try {
            slotString.split(/\s*\+\s*/).forEach(function (el) {
                if (el && $('.' + el)) {
                    arr.push(el);
                }
            });
        } catch (error) {
            arr = [];
        }

        return arr;
    })();
    return slots;
}
//function to get courseCode and Course Title from courseName
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

// Function to create the HTML for subject dropdown
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

// Function to fill the timetable and course list/ subjectArea
function fillPage1() {
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

// Function to be executed on page load'
// Load the subjectArea show all info
document.addEventListener('DOMContentLoaded', onPageLoad);
function onPageLoad() {
    fillPage();
    fillPage1();
    activateSortableForCourseList();
}
// Add event listener for DOMContentLoaded event

//function to save the json format of current state of the subject area
function createSubjectJsonFromHtml() {
    let result = {};
    let dropdowns = document.querySelectorAll('.dropdown-teacher');
    console.log(dropdowns);

    dropdowns.forEach((dropdown) => {
        let courseNameElement = dropdown.querySelector('h2 .cname');
        let courseName = courseNameElement
            ? courseNameElement.textContent
            : null;
        let credits = parseInt(
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

// Edit Subject Save button cliuck event
document
    .getElementById('saveSubjectEditModal')
    .addEventListener('click', function () {
        console.log('Save button clicked');
        let courseDiv = document.getElementById('div-for-edit-course');
        var courseName = generateCourseName(
            courseDiv.querySelector('#course-input_edit').value.trim(),
        );
        var credits = parseInt(
            courseDiv.querySelector('#credits-input-edit').value,
        );
        var courseNamePre = courseDiv.querySelector(
            '#course-input-edit-pre',
        ).innerText;
        const courseTr = getCourseTrInCourseList(courseNamePre);
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
            courseIdNum = Number(courseIdNum.split(/(\d+)/)[1]);
            for (var i = 0; i < activeTable.data.length; ++i) {
                if (activeTable.data[i].courseId == courseIdNum) {
                    addCourseToTimetable(activeTable.data[i]);
                    break;
                }
            }
            updateCredits();
        }

        let subjectArea = document.getElementById('subjectArea');
        let allSpan = subjectArea.querySelectorAll('.cname');
        spanMsg = 'Course not updated';
        spanMsgColor = 'red';
        if (
            courseDiv.querySelector('#credits-input-edit').value.trim() ===
                '' ||
            courseDiv.querySelector('#credits-input-edit').value < 0
        ) {
            spanMsg = 'Credits cannot be empty';
            spanMsgColor = 'red';
        } else if (courseName === '') {
            spanMsg = 'Course name cannot be empty';
            spanMsgColor = 'red';
        } else {
            allSpan.forEach((span) => {
                if (
                    span.innerText.toLowerCase() === courseNamePre.toLowerCase()
                ) {
                    var tempSwitchToPassUpdates = 1;
                    var countSameCourseName = 0;
                    console.log(allSpan);
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
                        courseNamePre.innerText = span.innerText;
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
                        createSubjectJsonFromHtml();
                        courseNamePre.innerText = courseDiv.querySelector(
                            '#credits-input-edit',
                        ).value;
                    } else {
                        spanMsg = 'Course already exists';
                        spanMsgColor = 'red';
                    }
                }
            });
        }

        spanMsgDiv = document.getElementById('span-course-edit');
        spanMsgDiv.innerText = spanMsg;
        spanMsgDiv.style.color = spanMsgColor;
        spanMsgDiv.style.display = 'block';
        hrHide = document.getElementById('hide_br-edit');
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
        const slotsInput = document
            .getElementById('slot-input-edit')
            .value.trim()
            .toUpperCase();
        const venueInput = document
            .getElementById('venue-input-edit')
            .value.trim()
            .toUpperCase();
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
            courseIdNum = Number(courseIdNum.split(/(\d+)/)[1]);
            for (var i = 0; i < activeTable.data.length; ++i) {
                if (activeTable.data[i].courseId == courseIdNum) {
                    addCourseToTimetable(activeTable.data[i]);
                    break;
                }
            }
        }
        const colorInput = document.getElementById('color1-select-edit').value;
        const spanTeacherMsg = document.getElementById('span-teacher-edit');
        const brHideTeacher = document.getElementById('hide_br_teacher-edit');
        var subjectArea = document.getElementById('subjectArea');
        var allSpan = subjectArea.querySelectorAll('.cname');
        var spanMsg = 'Not Updated';
        var spanMsgColor = 'red';
        for (const span of allSpan) {
            console.log(span.innerText);
            if (span.innerText.toLowerCase() === courseName.toLowerCase()) {
                if (teacherName === '') {
                    spanMsg = 'Teacher name cannot be empty';
                    spanMsgColor = 'red';
                } else if (
                    teacherNamePre.toLowerCase() === teacherName.toLowerCase()
                ) {
                    allLi =
                        span.parentElement.parentElement.parentElement.nextElementSibling.querySelectorAll(
                            'li',
                        );
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
                            break;
                        }
                    }
                } else {
                    allLi =
                        span.parentElement.parentElement.parentElement.nextElementSibling.querySelectorAll(
                            'li',
                        );
                    editTeacherSwitch = 1;
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
                                createSubjectJsonFromHtml();
                                break;
                            }
                        }

                        break;
                    }
                }
            }
        }
        console.log('TEST 1 PASS', spanMsg);
        spanTeacherMsg.innerText = spanMsg;
        spanTeacherMsg.style.color = spanMsgColor;
        spanTeacherMsg.style.display = 'block';
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
            spanMsg = 'Teacher deleted successfully';
            spanMsgColor = 'green';
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

// Function to find the li element of the teacher
function getTeacherLiInSubjectArea(courseName, teacherName) {
    var subjectArea = document.getElementById('subjectArea');
    var allSpan = subjectArea.querySelectorAll('.cname');
    for (const span of allSpan) {
        if (span.innerText.toLowerCase() === courseName.toLowerCase()) {
            allLi =
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

//function to create sunject json from the course list
function updateDataJsonFromCourseList() {
    let courseList = document.getElementById('courseList-tbody');
    let trElements = courseList.querySelectorAll('tr');
    activeTable.data = [];
    trElements.forEach((trElement) => {
        let td = trElement.querySelectorAll('td');
        let courseName = td[2].innerText;
        let faculty = td[3].innerText;
        let courseCode = td[1].innerText;
        let slots = slotsProcessingForCourseList(td[0].innerText);
        let venue = td[4].innerText;
        let credits = parseInt(td[5].innerText);
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
        activeTable.data.push(courseData);
        console.log(activeTable.data);
    });
    updateLocalForage();
}

// Sortable for course list after dropping should do something
function activateSortableForCourseList() {
    var courseList = document.querySelector('#course-list tbody');
    Sortable.create(courseList, {
        animation: 150,
        chosenClass: 'sortable-chosen',
        onEnd: function (evt) {
            updateDataJsonFromCourseList();
            console.log(activeTable.data);
        },
    });
}

// function to get credits from course name in subject area
function getCreditsFromCourseName(courseName) {
    var subjectArea = document.getElementById('subjectArea');
    var allSpan = subjectArea.querySelectorAll('.cname');
    for (const span of allSpan) {
        if (span.innerText.toLowerCase() === courseName.toLowerCase()) {
            return parseInt(
                span.parentElement.parentElement
                    .querySelector('h4')
                    .innerText.replace('[', '')
                    .replace(']', ''),
            );
        }
    }
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
function makeRadioFalseOnNeed() {
    activeTable.data.forEach((courseData) => {
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
            spanMsg = 'Course not deleted';
            spanMsgColor = 'red';
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

//rearrange the teacherli within the subjectArea if slots are clashing
function rearrangeTeacherRefresh() {
    const courseList = getCourseListFromSubjectArea();
    courseList.forEach((courseName) => {
        rearrangeTeacherLiInSubjectArea(courseName);
    });
    addEventListeners();
}
function rearrangeTeacherLiInSubjectArea(courseName) {
    var ul = getUlInSubjectArea(courseName);
    var allTeacherLi = getAllTeacherLiInSubjectArea(courseName);
    var slotsOfCourse = getSlotsOfCourse(courseName);
    var activeSlots = getSlots();
    var consideredSlots = subtractArray(slotsOfCourse, activeSlots);
    var nonActiveTeacherLi = [];
    var activeTeacherLi = [];
    allTeacherLi.forEach((teacherLi) => {
        const teacherSlot = updateSlots(
            slotsProcessingForCourseList(
                teacherLi.querySelectorAll('div')[1].innerText,
            ),
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
    ul.innerHTML = '';
    activeTeacherLi.forEach((teacherLi) => {
        ul.appendChild(teacherLi);
    });
    nonActiveTeacherLi.forEach((teacherLi) => {
        ul.appendChild(teacherLi);
    });
}

function revertRerrange() {
    var allSubject = activeTable.subject;
    Object.keys(allSubject).forEach((subjectName) => {
        const subjectNameStr = subjectName.toString();
        const ulToUpdate = getUlInSubjectArea(subjectNameStr);
        const TeacherLi = constructTeacherLi(
            subjectNameStr,
            allSubject[subjectNameStr],
        );
        ulToUpdate.innerHTML = '';
        TeacherLi.forEach((li) => {
            ulToUpdate.appendChild(li);
        });
        makeRadioTrueOnPageLoad();
    });
}

// Attack Mode Code

function rearrangeTeacherRefreshAttack() {
    const courseList = getCourseListFromSubjectArea();
    courseList.forEach((courseName) => {
        rearrangeTeacherLiInSubjectAreaAttack(courseName);
    });
}

function rearrangeTeacherLiInSubjectAreaAttack(courseName) {
    var ul = getUlInSubjectArea(courseName);
    var allTeacherLi = getAllTeacherLiInSubjectArea(courseName);
    var slotsOfCourse = getcourseSlotsAttack(courseName);
    var activeSlots = slotsForAttack();
    var consideredSlots = subtractArray(slotsOfCourse, activeSlots);
    var nonActiveTeacherLi = [];
    var activeTeacherLi = [];
    allTeacherLi.forEach((teacherLi) => {
        const teacherSlot = updateSlots(
            slotsProcessingForCourseList(
                teacherLi.querySelectorAll('div')[1].innerText,
            ),
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
    ul.innerHTML = '';
    activeTeacherLi.forEach((teacherLi) => {
        ul.appendChild(teacherLi);
    });
    nonActiveTeacherLi.forEach((teacherLi) => {
        ul.appendChild(teacherLi);
    });
}
// Make input radio true on the basis of attackData values
function makeRadioTrueAttack() {
    attackData.forEach((courseData) => {
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
function revertRerrangeAttack() {
    var allSubject = activeTable.subject;
    Object.keys(allSubject).forEach((subjectName) => {
        const subjectNameStr = subjectName.toString();
        const ulToUpdate = getUlInSubjectArea(subjectNameStr);
        const TeacherLi = constructTeacherLi(
            subjectNameStr,
            allSubject[subjectNameStr],
        );
        ulToUpdate.innerHTML = '';
        TeacherLi.forEach((li) => {
            ulToUpdate.appendChild(li);
        });
        makeRadioTrueAttack();
    });
}

function addEventListenersAttack() {
    var listItems = document.querySelectorAll('.dropdown li');
    for (var i = 0; i < listItems.length; i++) {
        listItems[i].addEventListener('click', attackLiClick);
    }
}
function removeEventListenersAttack() {
    var listItems = document.querySelectorAll('.dropdown li');
    for (var i = 0; i < listItems.length; i++) {
        listItems[i].removeEventListener('click', attackLiClick);
    }
}

function slotsForAttack() {
    var slots = [];
    for (var i = 0; i < attackData.length; i++) {
        slots = slots.concat(attackData[i].slots);
    }
    slots = updateSlots(slots);
    return slots;
}
function getcourseSlotsAttack(courseName) {
    var slots = [];
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
    var courseToRemove =
        radioButton.parentElement.parentElement.parentElement.querySelector(
            'h2 .cname',
        ).innerText;
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
    var dropdownUlRemoveShow = current.parentElement.parentElement;
    console.log(dropdownUlRemoveShow);
    var dropdownDivRemoveOpen = dropdownUlRemoveShow.previousElementSibling;
    console.log(dropdownDivRemoveOpen);
    try {
        var dropdownDivAddOpen =
            dropdownDivRemoveOpen.parentElement.nextElementSibling;
        var dropdownUlAddShow = dropdownDivAddOpen.querySelector('ul');
        var dropdownDivAddOpen =
            dropdownDivRemoveOpen.parentElement.nextElementSibling;
        var dropdownUlAddShow = dropdownDivAddOpen.querySelector('ul');
        dropdownUlRemoveShow.classList.remove('show');
        dropdownDivRemoveOpen.classList.remove('open');
        dropdownDivAddOpen.classList.add('open');
        dropdownUlAddShow.classList.add('show');
    } catch (error) {}

    var faculty = current.parentElement.querySelectorAll('div')[0].innerText;
    var slotString = current.parentElement.querySelectorAll('div')[1].innerText;
    var venue = current.parentElement.querySelectorAll('div')[2].innerText;
    var credits = getCreditsFromCourseName(courseToRemove);

    var isProject = false;

    var slots = slotsProcessingForCourseList(slotString);
    var courseId = 0;
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
    attackData.push(courseData);
}

function attackLiClick() {
    // Get the radio button inside this list item
    var radioButton = this.querySelector('input[type="radio"]');
    if (radioButton.checked) {
        try {
            radioButton.checked = false;
            removeRadioFalseAttack(radioButton);
            console.log(false, attackData);
            revertRerrangeAttack();
            rearrangeTeacherRefreshAttack();
        } catch (error) {
            console.log('error');
        }
    } else {
        radioButton.checked = true; // This radio button is now the currently selected one
        removeRadioFalseAttack(radioButton);
        addOnRadioAttack(radioButton);

        revertRerrangeAttack();
        rearrangeTeacherRefreshAttack();
    }
}

// Add event listener to the toggle checkbox
document
    .querySelector('#attack-toggle')
    .addEventListener('change', function () {
        // Update the value of editSub based on the checkbox state
        attackMode = this.checked;
        if (this.checked) {
            closeEditPref();
            activateSortable();
            closeEditPref1();
            document.getElementById('div-for-edit-teacher').style.display =
                'none';
            document.getElementById('edit_msg_').style.display = 'block';
            document.getElementById('edit_msg_').innerText =
                'Attack Mode Enabled.';
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
            closeAllDropdowns();
            document.querySelector('.dropdown-list').classList.add('show');
            document
                .querySelector('.dropdown-list')
                .previousElementSibling.classList.add('open');
            attackData = [];
            revertRerrangeAttack();
            rearrangeTeacherRefreshAttack();
            removeEventListeners();
            makeRadioFalseOnNeed();
        } else {
            document.getElementById('edit_msg_').innerText =
                'Click on the Teacher to edit it.';
            document.getElementById('edit_msg_').style.display = 'none';
            removeEventListenersAttack();
            closeEditPref();
            activateSortable();
            closeEditPref1();
        }
    });

document
    .getElementById('save-panel-button')
    .addEventListener('click', function () {
        // Convert the activeTable to a JSON string
        var jsonStr = JSON.stringify(activeTable);

        // Encode the JSON string in base64
        var dataStr = 'data:text/plain;base64,' + btoa(jsonStr);

        // Create a new 'a' element
        var dlAnchorElem = document.createElement('a');

        // Set its attributes
        dlAnchorElem.setAttribute('href', dataStr);
        dlAnchorElem.setAttribute(
            'download',
            activeTable.name + '.ffcsOnTheGo',
        );

        // Append it to the body (this is necessary for Firefox)
        document.body.appendChild(dlAnchorElem);

        // Simulate a click on the element
        dlAnchorElem.click();

        // Remove the element from the body after the download starts
        document.body.removeChild(dlAnchorElem);
    });

function processFile(file) {
    var reader = new FileReader();
    reader.onload = function (event) {
        // Extract the base64 data from the Data URL
        var base64Data = event.target.result.split(',')[1];

        // Decode the base64 string back into a JSON string
        var jsonStr = atob(base64Data);
        // Parse the JSON string back into an object
        var activeTableUpdate = JSON.parse(jsonStr);
        activeTableUpdate.id = activeTable.id;
        activeTableUpdate.name = activeTable.name;
        timetableStoragePref[activeTable.id] = activeTableUpdate;
        updateLocalForage();
        switchTable(activeTable.id);
        updateDataJsonFromCourseList();
        updateCredits();

        // Update the UI to reflect the new activeTable
        // ...
    };
    reader.readAsDataURL(file);
}

// on click on the load data and on upload of json file the data should be loaded to the activeTable
// and the page should be refreshed the data should be loaded to the activeTable and check the structure is matching or not
// id of the upload button is 'load-panel-button'
document
    .getElementById('load-panel-button')
    .addEventListener('click', function () {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = '.ffcsonthego';
        input.onchange = function (event) {
            processFile(event.target.files[0]);
        };
        input.click();
    });

// onclick clear with id 'clear-course-button' the courselist should get cleared
// and all radio button should turned into false
document
    .getElementById('clear-course-button')
    .addEventListener('click', function () {
        // Ask for confirmation
        if (!confirm('Are you sure you want to clear the course list?')) {
            return;
        }

        getCourseListFromSubjectArea().forEach((courseName) => {
            courseRemove(courseName);
        });
        revertRerrange();
        rearrangeTeacherRefresh();
    });
