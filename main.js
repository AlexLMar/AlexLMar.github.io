import { GENInternationalData, AHisStoryData, NextGENData } from "./data.js";

// Variables
const filteredData = {
    "title": {},
    "events": []
}

let filteredDataCopy;

let startDate = {
  "month": 1,
  "year": 1977
};
let endDate = {
  "month": 1,
  "year": 2023
};

const writtenTags = [];

// Accessing HTML elements
const addKeywordButton = document.getElementById("add-keyword");
const inputField = document.getElementById("written-tag-input");
const generateButton = document.getElementById("generate-button");
const radioInputs = document.getElementsByName("database-selection");
const selectedStartYear = document.getElementById("start-year");
const selectedEndYear = document.getElementById("end-year");
const keywordsList = document.getElementById("keywords-list");

// Functions
const removeKeyword = function(keyword) {
    const index = writtenTags.indexOf(keyword);
    if (index > -1) {
        writtenTags.splice(index, 1);
    }
    renderKeywords();
};

const addKeyword = function () {
    const inputValue = inputField.value.trim();
    if (inputValue && !writtenTags.includes(inputValue)) {
        writtenTags.push(inputValue);
        inputField.value = '';
        renderKeywords();
    }
    inputField.focus();
};

const renderKeywords = function() {
    keywordsList.innerHTML = '';
    writtenTags.forEach(tag => {
        const keywordTag = document.createElement('span');
        keywordTag.classList.add('keyword-tag');
        keywordTag.innerHTML = `
            ${tag}
            <span class="remove-keyword">×</span>
        `;
        keywordTag.addEventListener('click', () => removeKeyword(tag));
        keywordsList.appendChild(keywordTag);
    });
};

const setDateRange = function(allData) {
    const yearOfFirstEvent = allData.events[0].start_date.year;
    const LastEvent = allData.events[allData.events.length-1];
    
    if (selectedStartYear.value >= yearOfFirstEvent && selectedStartYear.value <= LastEvent.start_date.year) {
        startDate.year = parseInt(selectedStartYear.value);
    } else if (selectedStartYear.value <= yearOfFirstEvent) {
        startDate.year = yearOfFirstEvent;
    } else {
        startDate.year = -1;
    }

    if (selectedEndYear.value >= yearOfFirstEvent && selectedEndYear.value <= LastEvent.start_date.year) {
        endDate.year = parseInt(selectedEndYear.value);
    } else if (selectedEndYear.value >= LastEvent.start_date.year) {
        endDate.year = LastEvent.start_date.year;
    } else {
        endDate.year = -1;
    }
};

const filterFunction = function(allData) {
    filteredData.title = allData.title;
    filteredData.events = [];

    setDateRange(allData);
    
    if (startDate.year < 0 || endDate.year < 0) {
        document.getElementById('no-events').hidden = false;
        return;
    }

    allData.events.forEach(event => {
        if (event.start_date.year >= startDate.year && event.start_date.year <= endDate.year) {
            if (writtenTags.length === 0 || writtenTags.some(tag => 
                event.text.headline.toLowerCase().includes(tag.toLowerCase()) ||
                event.text.text.toLowerCase().includes(tag.toLowerCase())
            )) {
                filteredData.events.push(event);
            }
        }
    });
};

const generateTimeline = function() {
    document.getElementById('no-events').hidden = true;

    const selectedData = Array.from(radioInputs).find(input => input.checked).value;
    filterFunction(eval(selectedData));

    if (filteredData.events.length === 0) {
        document.getElementById('no-events').hidden = false;
        return;
    }

    filteredDataCopy = JSON.parse(JSON.stringify(filteredData));

    const timelineEmbed = document.getElementById("timeline-embed");
    timelineEmbed.innerHTML = '';

    var options = {
        font: 'lustria-lato',
        scale_factor: 0.5,
        timenav_position: "top"
    };

    new TL.Timeline('timeline-embed', filteredDataCopy, options);
};

// Update the updateEndYearOptions function
const updateEndYearOptions = function() {
    const startYear = parseInt(selectedStartYear.value);
    selectedEndYear.innerHTML = ''; // Clear existing options

    const currentYear = new Date().getFullYear();

    // Add new options
    for (let year = startYear; year <= currentYear; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        selectedEndYear.appendChild(option);
    }

    // If the previously selected end year is still valid, keep it selected
    if (endDate.year >= startYear && endDate.year <= currentYear) {
        selectedEndYear.value = endDate.year;
    } else {
        // Otherwise, default to the current year
        selectedEndYear.value = currentYear;
        endDate.year = currentYear;
    }
};

// Event listeners
window.onload = function() {
    inputField.focus();
    
    // Set the default start year to 1977
    selectedStartYear.value = 1977;
    startDate.year = 1977;

    // Set the default end year to the current year
    const currentYear = new Date().getFullYear();
    selectedEndYear.value = currentYear;
    endDate.year = currentYear;

    updateEndYearOptions(); // Initialize end year options
};

selectedStartYear.addEventListener('change', function() {
    startDate.year = parseInt(this.value);
    updateEndYearOptions();
});

selectedEndYear.addEventListener('change', function() {
    endDate.year = parseInt(this.value);
});

addKeywordButton.onclick = addKeyword;
inputField.addEventListener('keypress', function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent form submission
        addKeyword();
    }
});

generateButton.onclick = generateTimeline;


