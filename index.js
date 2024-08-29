var globalDB = [];
var allRecords = [];

function initializeDB() {
    // const request = window.indexedDB.open("MyTestDatabase", 3);
    loadData();
}

function toggleArrowUp(event) {
    console.log("Hello");
    $(event).removeClass('gg-chevron-double-up').addClass('gg-chevron-double-down');
    $(event).parent().next().hide();
    $(event).attr('onclick', 'toggleArrowDown(this)');
}

function toggleArrowDown(event) {
    console.log("Hello");
    $(event).removeClass('gg-chevron-double-down').addClass('gg-chevron-double-up');
    $(event).parent().next().show();
    $(event).attr('onclick', 'toggleArrowUp(this)');
}

function textCount(event, totalCharacters) {
    console.log("Checking");
    var remaining = totalCharacters - $(event).val().length;
    $(event).nextAll()[0].children[0].innerHTML = remaining + '/' + totalCharacters + ' Characters left';
}

function addData(event) {
    var chooseDate = $(event).prevAll()[4].children[1].value;
    var eventName = $(event).prevAll()[3].children[1].value;
    var startTime = $(event).prevAll()[2].children[1].value;
    var endTime = $(event).prevAll()[1].children[1].value;
    var description = $(event).prevAll()[0].children[1].value;

    if (endTime <= startTime) {
        alert('Select correct Start time and End Time.');
        return;
    }

    var singleRecord = [];
    singleRecord.push(chooseDate);
    singleRecord.push(eventName);
    singleRecord.push(startTime);
    singleRecord.push(endTime);
    singleRecord.push(description);

    globalDB.push(singleRecord);

    // Session Storage
    var allRecord = []; // Load Previous Data + Add New Data (singleRecord)
    try {
        var prevRecord = sessionStorage.getItem("Record").split(',');
        allRecord.push(prevRecord);
    } catch (err) {

    }
    allRecord.push(singleRecord);
    sessionStorage.setItem("Record", allRecord);

    loadData();

}

function loadData() {
    if (sessionStorage.getItem("Record") == null) {
        $('#eventList').html('No Records found.');
        return;
    } else {
        var x = sessionStorage.getItem("Record").split(',');
        if (x.length % 5 != 0)
            x.splice(0, 1);
        if (x.length == 0) {
            $('#eventList').html('No Records found.');
            return;
        }
        allRecords = [];
        for (let i = 0; i < x.length; i += 5) {
            allRecords.push(x.slice(i, i + 5));
        }
        console.log(allRecords);

        var boxValue = '';

        for (let i = 0; i < allRecords.length; i++) {
            var eventDate = allRecords[i][0];
            var eventName = allRecords[i][1];
            var startTime = allRecords[i][2];
            var endTime = allRecords[i][3];
            var description = allRecords[i][4];

            if (description != '') {
                boxValue += '<div class="eventBox" id="box1"><div id="title"><font id="ft3"><b>' +
                    eventDate + ' | ' + startTime + '-' + endTime +
                    '</b></font><br><font id="ft4">' + eventName + '</font><div id="icons"><div id="edit" onclick="editCard(' + i + ')"><i class="gg-pen"></i> &nbsp;</div><div id="delete" onclick="deleteCard(' + i + ')"><i class="gg-trash-empty"></i> &nbsp;</div></div></div><div id="details"><p id="downArrow" align="center"><i class="gg-chevron-double-up" onclick="toggleArrowUp(this) "></i></p><p class="description">' + description + '</p></div></div>';
                console.log(boxValue);
            } else {
                boxValue += '<div class="eventBox" id="box1"><div id="title"><font id="ft3"><b>' +
                    eventDate + ' | ' + startTime + '-' + endTime +
                    '</b></font><br><font id="ft4">' + eventName + '</font><div id="icons"><div id="edit" onclick="editCard(' + i + ')"><i class="gg-pen"></i> &nbsp;</div><div id="delete" onclick="deleteCard(' + i + ')"><i class="gg-trash-empty"></i> &nbsp;</div></div></div><div id="details"><p id="downArrow" align="center"><i class="gg-chevron-double-up" onclick="toggleArrowUp(this) "></i></p><p class="description" style="font-size: small;">No Description given.</p></div></div>';
                console.log(boxValue);
            }

            $('#eventList').html(boxValue);
        }
    }
}

function deleteCard(index) {
    allRecords.splice(index, 1);
    $('#eventList').html('');
    sessionStorage.setItem("Record", allRecords);
    if (allRecords.length != 0)
        loadData();
    else
        $('#eventList').html('No Records found.');
}

function dateFilter(event) {
    var date = $(event).parent()[0].previousElementSibling.children[0].children[0].value;
    var y = allRecords.filter(arr => arr.includes(date));
    $('#eventList').html('');

    var boxValue = '';
    for (let i = 0; i < y.length; i++) {
        var eventDate = y[i][0];
        var eventName = y[i][1];
        var startTime = y[i][2];
        var endTime = y[i][3];
        var description = y[i][4];

        if (description != '') {
            boxValue += '<div class="eventBox" id="box1"><div id="title"><font id="ft3"><b>' +
                eventDate + ' | ' + startTime + '-' + endTime +
                '</b></font><br><font id="ft4">' + eventName + '</font><div id="icons"><div id="edit" onclick="editCard(' + i + ')"><i class="gg-pen"></i> &nbsp;</div><div id="delete" onclick="deleteCard(' + i + ')"><i class="gg-trash-empty"></i> &nbsp;</div></div></div><div id="details"><p id="downArrow" align="center"><i class="gg-chevron-double-up" onclick="toggleArrowUp(this) "></i></p><p class="description">' + description + '</p></div></div>';
            console.log(boxValue);
        } else {
            boxValue += '<div class="eventBox" id="box1"><div id="title"><font id="ft3"><b>' +
                eventDate + ' | ' + startTime + '-' + endTime +
                '</b></font><br><font id="ft4">' + eventName + '</font><div id="icons"><div id="edit" onclick="editCard(' + i + ')"><i class="gg-pen"></i> &nbsp;</div><div id="delete" onclick="deleteCard(' + i + ')"><i class="gg-trash-empty"></i> &nbsp;</div></div></div><div id="details"><p id="downArrow" align="center"><i class="gg-chevron-double-up" onclick="toggleArrowUp(this) "></i></p><p class="description" style="font-size: small;">No Description given.</p></div></div>';
            console.log(boxValue);
        }

        $('#eventList').html(boxValue);
    }

}


function editCard(index) {
    // Retrieve the event data using the index
    let eventToEdit = allRecords[index];

    // Populate the form fields with the existing event data using jQuery
    $('#startDate').val(eventToEdit[0]); // Date
    $('#eventName').val(eventToEdit[1]); // Event Name
    $('#startTime').val(eventToEdit[2]); // Start Time
    $('#endTime').val(eventToEdit[3]); // End Time
    $('#exampleFormControlTextarea1').val(eventToEdit[4]); // Description

    // Change the button text to 'Update Event' and set the click handler to update the event
    $('#addEvent').text('Update Event').off('click').on('click', function (e) {
        e.preventDefault(); // Prevent default form submission
        updateEvent(index);
    });
}




function updateEvent(index) {
    // Retrieve updated values from the form using jQuery
    let updatedDate = $('#startDate').val();
    let updatedEventName = $('#eventName').val();
    let updatedStartTime = $('#startTime').val();
    let updatedEndTime = $('#endTime').val();
    let updatedDescription = $('#exampleFormControlTextarea1').val();

    // Validate the input as needed
    if (updatedEndTime <= updatedStartTime) {
        alert('Select correct Start time and End Time.');
        return;
    }

    // Update the event in allRecords
    allRecords[index] = [updatedDate, updatedEventName, updatedStartTime, updatedEndTime, updatedDescription];

    // Update session storage
    sessionStorage.setItem("Record", allRecords.flat());

    // Refresh the event list
    loadData();

    //Delete the duplicate card which is added  at last
    deleteCard(allRecords.length - 1);

    // Reset the form and button
    $('#addEvent').text('Add Event').off('click').on('click', function (e) {
        e.preventDefault(); // Prevent default form submission
        addData(this);
    });

    // Clear the form fields
    $('#startDate, #eventName, #startTime, #endTime, #exampleFormControlTextarea1').val('');
}