// URL의 쿼리 매개변수에서 날짜 정보 가져오기
const urlParams = new URLSearchParams(window.location.search);
const date = urlParams.get('date');
const pageIdentifier = 'reminder-' + date; // 고유한 식별자 생성

// 날짜 정보 표시 // DOM
const dateElement = document.getElementById('selectedDate');
dateElement.textContent = `${date}`;

// 돌아가기 
function goBack() {
    window.history.back();
}

// DOM
var eventInput = document.getElementById('eventInput');
eventInput.addEventListener('keydown', function(event) { //input적고 enter누를 경우 addReminder()호출
    if (event.key === 'Enter') {
        addReminder();
    }
});

// 리마인더 추가
function addReminder() {
    // 리마인더 추가시 발생하는 에러 핸들링
    try{
        var event = eventInput.value;

        // 입력값 없을시 에러 처리
        if (!event) {
            throw new Error("내용을 입력해주세요");
        }

        if (event) {
            // DOM
            var reminderList = document.getElementById('reminderList');

            // 리마인더 내용 출력, 리스트활용(동적으로 생성) // DOM
            var reminder = document.createElement('li');
            reminder.className = 'reminder';
            
            // DOM
            var eventElement = document.createElement('div');
            eventElement.className = 'event';
            eventElement.textContent = event;
            eventElement.setAttribute('contentEditable', 'true'); // 이미 적힌 리마인더 내용을 사용자가 수정가능

            // DOM
            eventElement.addEventListener('keydown', function (e) { // 엔터를 누르면 편집 모드를 종료하고 변경된 내용을 저장
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.blur(); // 편집모드종료
                    saveReminders();
                }
            });

            // DOM
            var deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete'
            deleteButton.onclick = function() { // 리마인더 내용 삭제(한 줄)
                reminderList.removeChild(reminder);
                saveReminders();
            };
            
            // DOM
            reminder.appendChild(eventElement);
            reminder.appendChild(deleteButton);
            reminderList.appendChild(reminder);
            eventInput.value = '';

            saveReminders();
        }
    } catch(err){
        alert(err.message);
    }
   
}

// 리마인더 로컬저장소에 저장
function saveReminders() {
    // DOM
    var reminderList = document.getElementById('reminderList');
    var reminders = [];
    for (var i = 0; i < reminderList.children.length; i++) {
        var reminder = reminderList.children[i];
        // DOM
        var event = reminder.querySelector('.event').textContent;
        reminders.push(event);
    }
    // DOM, json
    localStorage.setItem(pageIdentifier, JSON.stringify(reminders)); // 고유한 식별자로 저장
}

// 리마인더 로컬저장소에서 불러오기
function loadReminders() {
    // DOM
    var reminderList = document.getElementById('reminderList');
    // json
    var reminders = JSON.parse(localStorage.getItem(pageIdentifier)); // 고유한 식별자로 로드
    if (reminders) {
        reminders.forEach(function(event) {
            // 리마인더 내용 출력 list 활용 // DOM
            var reminder = document.createElement('li');
            reminder.className = 'reminder';

            // DOM
            var eventElement = document.createElement('div');
            eventElement.className = 'event';
            eventElement.textContent = event;

            // DOM
            eventElement.addEventListener('click', function() { // 리마인더 수정가능
                eventElement.contentEditable = true;
                eventElement.focus();
            });

            // DOM
            var deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete'
            deleteButton.onclick = function() { // 리마인더 내용 삭제(한 줄)
                reminderList.removeChild(reminder);
                saveReminders(); 
            };

            // DOM
            reminder.appendChild(eventElement);
            reminder.appendChild(deleteButton);
            reminderList.appendChild(reminder);
        });
    }
}

loadReminders();