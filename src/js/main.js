/*
HELPS TO PLAN YOUR TIMETABLE
Copyright (C) 2024  Sarvesh Dakhore

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>. 
*/

/*
 *  This file contains the events and functions applied to
 *  the document body that is common to all sections or
 *  that doesn't fit into any particular section
 */

import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import '../scss/main.scss';
import '../scss/course-panel.scss';
import '../scss/timetable.scss';
import '../scss/course-list.scss';
import '../css/add-on.css';

import localforage from 'localforage/dist/localforage';

import './attacher';
import './course-panel';
import './add_on';
import './timetable';

import * as Utils from './utils';

const lastUpdate = require('../../package.json')['lastUpdate'];


$(function () {
    /*
        Remove focus from quick buttons once clicked
     */
    $('.quick-buttons .btn').on('click', function () {
        $(this).trigger('blur');
    });

    localforage.getItem('campus').then((campus) => {
        window.location.hash = campus || '#Vellore';
        switchCampus();

        /*
            Event to listen for hash changes
         */
        $(window).on('hashchange', () => {
            if (window.location.hash === `#${window.campus}`) {
                return;
            }

            new bootstrap.Modal($('#switch-campus-modal').get(0)).show();
        });
    });

    Utils.removeTouchHoverCSSRule();
});

/*
    Function to switch campuses
 */
window.switchCampus = () => {
    if (window.location.hash.toLowerCase() === '#chennai') {
        $('#campus').text('Chennai Campus');
        $('#last-update').text(lastUpdate.chennai);
        window.location.hash = '#Chennai';
        window.campus = 'Chennai';
    } else if (window.location.hash.toLowerCase() === '#vellore') {
        $('#campus').text('Vellore Campus');
        $('#last-update').text(lastUpdate.vellore);
        window.location.hash = '#Vellore';
        window.campus = 'Vellore';
    } else {
        window.location.hash = `#${window.campus}`;
    }

    localforage.getItem('campus').then((campus) => {
        localforage.setItem('campus', window.campus).catch(console.error);

        if (campus && campus != window.campus) {
            localforage
                .removeItem('timetableStorage')
                .then(window.location.reload());
            return;
        }

        getCourses();
        initializeTimetable();
    });
};

/*
    Redirect to the GitHub page when Ctrl + U is clicked
    instead of showing the page source code
 */
document.onkeydown = function (e) {
    if (e.ctrlKey && e.key == 'u') {
        window.open('https://github.com/vatz88/FFCSonTheGo');
        return false;
    } else {
        return true;
    }
};

/*
    Function to clear all sections
 */
window.resetPage = () => {
    clearPanel();
    clearTimetable();
    clearCourseList();
};

/*
    Prompt add to home screen
 */
window.addEventListener('beforeinstallprompt', (e) => {
    ga('send', {
        hitType: 'event',
        eventCategory: 'A2H',
        eventAction: 'Seen',
        eventLabel: `A2H Shown`,
    });

    e.userChoice.then((choiceResult) => {
        ga('send', {
            hitType: 'event',
            eventCategory: 'A2H',
            eventAction: 'click',
            eventLabel: `A2H ${choiceResult.outcome}`,
        });
    });
});
