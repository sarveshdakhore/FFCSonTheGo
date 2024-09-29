// ********************* Assigning Global Variables *********************

var editSub = false; // edit subject (course edit toggle)
var editTeacher = false; // edit teacher (course edit false, edit clicked, then true)
var sortableIsActive = false; // sortable is activated or not
var attackData = []; // attack data for the temp usage
var attackQuick = [];

// This data structure is used to store the timetable slots
// to convert them into one format(Lecture To Theory)
// for proceesing in rearrangement

var slotsExistInNonLectureFormat = new set([
    'L1',
    'A1',
    'L2',
    'F1',
    'L3',
    'D1',
    'L4',
    'TB1',
    'L5',
    'TG1',
    'L6',
    'L31',
    'A2',
    'L32',
    'F2',
    'L33',
    'D2',
    'L34',
    'TB2',
    'L35',
    'TG2',
    'L36',
    'V3',
    'L7',
    'B1',
    'L8',
    'G1',
    'L9',
    'E1',
    'L10',
    'TC1',
    'L11',
    'TAA1',
    'L12',
    'L37',
    'B2',
    'L38',
    'G2',
    'L39',
    'E2',
    'L40',
    'TC2',
    'L41',
    'TAA2',
    'L42',
    'V4',
    'L13',
    'C1',
    'L14',
    'A1',
    'L15',
    'F1',
    'L16',
    'V1',
    'L17',
    'V2',
    'L18',
    'L43',
    'C2',
    'L44',
    'A2',
    'L45',
    'F2',
    'L46',
    'TD2',
    'L47',
    'TBB2',
    'L48',
    'V5',
    'L19',
    'D1',
    'L20',
    'B1',
    'L21',
    'G1',
    'L22',
    'TE1',
    'L23',
    'TCC1',
    'L24',
    'L49',
    'D2',
    'L50',
    'B2',
    'L51',
    'G2',
    'L52',
    'TE2',
    'L53',
    'TCC2',
    'L54',
    'V6',
    'L25',
    'E1',
    'L26',
    'C1',
    'L27',
    'TA1',
    'L28',
    'TF1',
    'L29',
    'TD1',
    'L30',
    'L55',
    'E2',
    'L56',
    'C2',
    'L57',
    'TA2',
    'L58',
    'TF2',
    'L59',
    'TDD2',
    'L60',
    'V7',
]);

// ##################### Exporting Global Variables #####################

var clashMap = {
    A1: ['L1', 'L14'],
    B1: ['L7', 'L20'],
    C1: ['L13', 'L26'],
    D1: ['L3', 'L19', 'L4'],
    E1: ['L9', 'L25', 'L10'],
    F1: ['L2', 'L15', 'L16'],
    G1: ['L8', 'L21', 'L22'],
    TA1: ['L27', 'L28'],
    TB1: ['L4', 'L5'],
    TC1: ['L10', 'L11'],
    TD1: ['L29', 'L30'],
    TE1: ['L22', 'L23'],
    TF1: ['L28', 'L29'],
    TG1: ['L5', 'L6'],
    TAA1: ['L11', 'L12'],
    TCC1: ['L23', 'L24'],

    A2: ['L31', 'L44'],
    B2: ['L37', 'L50'],
    C2: ['L43', 'L56'],
    D2: ['L33', 'L49', 'L34'],
    E2: ['L39', 'L55', 'L40'],
    F2: ['L32', 'L45', 'L46'],
    G2: ['L38', 'L51', 'L52'],
    TA2: ['L57', 'L58'],
    TB2: ['L34', 'L35'],
    TC2: ['L40', 'L41'],
    TD2: ['L46', 'L47'],
    TE2: ['L52', 'L53'],
    TF2: ['L58', 'L59'],
    TG2: ['L35', 'L36'],
    TAA2: ['L41', 'L42'],
    TBB2: ['L47', 'L48'],
    TCC2: ['L53', 'L54'],
    TDD2: ['L59', 'L60'],

    L1: ['A1'],
    L2: ['F1'],
    L3: ['D1'],
    L4: ['TB1', 'D1'],
    L5: ['TG1', 'TB1'],
    L6: ['TG1'],
    L7: ['B1'],
    L8: ['G1'],
    L9: ['E1'],
    L10: ['TC1', 'E1'],
    L11: ['TAA1', 'TC1'],
    L12: ['TAA1'],
    L13: ['C1'],
    L14: ['A1'],
    L15: ['F1'],
    L16: ['V1', 'F1'],
    L17: ['V2', 'V1'],
    L18: ['V2'],
    L19: ['D1'],
    L20: ['B1'],
    L21: ['G1'],
    L22: ['TE1', 'G1'],
    L23: ['TCC1', 'TE1'],
    L24: ['TCC1'],
    L25: ['E1'],
    L26: ['C1'],
    L27: ['TA1'],
    L28: ['TF1', 'TA1'],
    L29: ['TD1', 'TF1'],
    L30: ['TD1'],
    L31: ['A2'],
    L32: ['F2'],
    L33: ['D2'],
    L34: ['TB2', 'D2'],
    L35: ['TG2', 'TB2'],
    L36: ['V3', 'TG2'],
    L37: ['B2'],
    L38: ['G2'],
    L39: ['E2'],
    L40: ['TC2', 'E2'],
    L41: ['TAA2', 'TC2'],
    L42: ['V4', 'TAA2'],
    L43: ['C2'],
    L44: ['A2'],
    L45: ['F2'],
    L46: ['TD2', 'F2'],
    L47: ['TBB2', 'TD2'],
    L48: ['V5', 'TBB2'],
    L49: ['D2'],
    L50: ['B2'],
    L51: ['G2'],
    L52: ['TE2', 'G2'],
    L53: ['TCC2', 'TE2'],
    L54: ['V6', 'TCC2'],
    L55: ['E2'],
    L56: ['C2'],
    L57: ['TA2'],
    L58: ['TF2', 'TA2'],
    L59: ['TDD2', 'TF2'],
    L60: ['V7', 'TDD2'],
    V1: ['L16', 'L17'],
    V2: ['L17', 'L18'],
    V3: ['L36'],
    V4: ['L42'],
    V5: ['L48'],
    V6: ['L54'],
    V7: ['L60'],
};

export var globalVars = {
    editSub: editSub,
    editTeacher: editTeacher,
    sortableIsActive: sortableIsActive,
    attackData: attackData,
    slotsExistInNonLectureFormat: slotsExistInNonLectureFormat,
    attackQuick: attackQuick,
    clashMap: clashMap,
};

// Tried to do so and failed
// ************************* Exporting Function *************************

// export {
//     // ================== Basic ==================
//     toggleDropdown,
//     removeInputFieldsInSection,
//     closeAllDropdowns,
//     openAllDropdowns,
//     editPrefCollapse,
//     // ------------------ Basic Ends Here ------------------

//     // ================== Get From Something ==================
//     getCourseListFromSubjectArea,
//     getCourseDivInSubjectArea,
//     getUlInSubjectArea,
//     getTeacherLiInSubjectArea,
//     getCreditsFromCourseName,
//     getCourseCodeAndCourseTitle,
//     getCourseNameFromCourseData,
//     getCourseTrInCourseList,
//     getCourseNameAndFacultyFromTr,
//     processRawCourseName,
//     // ------------------ Get From Something Ends Here ------------------

//     // ================== Sortables ==================
//     activateSortable,
//     deactivateSortable,
//     activateSortableForCourseList,
//     // ------------------ Sortables Ends Here ------------------

//     // ------------------ Slots ------------------
//     updateSlots,
//     slotsProcessingForCourseList,
//     getSlotsOfCourse,
//     getSlots,
//     subtractArray,
//     isCommonSlot,
//     // ------------------ Slots Ends Here -----------------

//     // ------------------ Build / Update ------------------
//     makeRadioTrueOnPageLoad,
//     makeRadioFalseOnNeed,
//     fillLeftBoxInCoursePanel,
//     createSubjectDropdown,
//     createTeacherLI,
//     constructTeacherLi,
//     createSubjectJsonFromHtml,
//     updateDataJsonFromCourseList,
//     updateTeacherInCourseList,
//     addSubDiv,
//     // ------------------ Build / Update Ends Here ------------------

//     // ------------------ Add / Remove ------------------
//     doubleClickOnTrOfCourseList,
//     addEventListnerToCourseList,
//     addEventListeners,
//     addOnRadioTrue,
//     removeEventListeners,
//     removeCourseFromSubject,
//     courseRemove,
//     removeRadioFalse,
//     selectBackgroundRemovalOfPreviousH2s,
//     selectBackgroundRemovalOfPreviousLi,
//     // ------------------ Add / Remove Ends Here ------------------

//     // ------------------ Click ------------------
//     editPrefAddOn,
//     editPref,
//     closeEditPref1,
//     closeEditPref,
//     liClick,
//     // ------------------ Click Ends Here ------------------

//     // ------------------ Arrange ------------------
//     rearrangeTeacherLiInSubjectArea,
//     rearrangeTeacherRefresh,
//     revertRerrange,
//     // ------------------ Arrange Ends Here ------------------

//     // ------------------ Attack Mode Function ------------------
//     rearrangeTeacherRefreshAttack,
//     rearrangeTeacherLiInSubjectAreaAttack,
//     makeRadioTrueAttack,
//     revertRerrangeAttack,
//     slotsForAttack,
//     getcourseSlotsAttack,
//     removeRadioFalseAttack,
//     addOnRadioAttack,
//     removeEventListenersAttack,
//     attackLiClick,
//     // ------------------ Attack Mode Function Ends Here ------------------

//     // ------------------ File Processing ------------------
//     processFile,
//     // ------------------ File Processing Ends Here ------------------

//     // ------------------ Misslenious ------------------
//     showAddTeacherDiv,
//     onPageLoad,
//     // ------------------ Misslenious Ends Here ------------------
// };
