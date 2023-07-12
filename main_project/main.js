// DOM
document.addEventListener('DOMContentLoaded', function () { //페이지가 로드되고 HTML 문서가 완전히 파싱된 후
    // DOM
    var calendarEl = document.getElementById('calendar');
    // ajax // fullcalendar API
    var calendar = new FullCalendar.Calendar(calendarEl, {
        timeZone: 'UTC',
        initialView: 'dayGridMonth',
        events: getSavedEvents(),
        headerToolbar: {
            center: 'addEventButton' // headerToolbar에 버튼을 추가
        },
        customButtons: {
            addEventButton: { // 추가 버튼 설정
                text: "일정 추가",  // 버튼 내용
                click: function () { // 버튼 클릭 시 이벤트 추가
                    // DOM jquery
                    $("#calendarModal").modal("show"); // modal 나타내기
                    // 입력된 값 초기화
                    $("#calendar_content").val("");
                    $("#calendar_start_date").val("");
                    $("#calendar_end_date").val("");
                }
            }
        },
        editable: true, // false로 변경 시 draggable 작동 x
        displayEventTime: false, // 시간 표시 x
        eventClick: function (info) { // 일정 클릭 시 이벤트
            try{ // 에러 핸들링
                if (confirm("일정을 삭제하시겠습니까?")) {
                info.event.remove(); // 일정 삭제
                saveEvents(); // 일정 저장
                }
            } catch(err){
                alert(err.message);
            }
        },
        dateClick: function (info) { // 날짜 클릭 시 이벤트
            var date = info.dateStr;
            window.location.href = "reminder.html?date=" + date;
        }
    });

    calendar.render();
    
    // json
    function getSavedEvents() { // 저장된 일정을 가져옴
        var savedEvents = localStorage.getItem('events');
        if (savedEvents) {
            return JSON.parse(savedEvents);
        } else {
            return [];
        }
    }
    function saveEvent(eventObj) { // 일정을 저장함
        var savedEvents = getSavedEvents();
        savedEvents.push(eventObj);
        localStorage.setItem('events', JSON.stringify(savedEvents));
    }
    function saveEvents() { // 현재 달력의 모든 일정을 저장함
        var events = calendar.getEvents().map(function (event) {
            return {
                title: event.title,
                start: event.startStr,
                end: event.endStr
            };
        });
        localStorage.setItem('events', JSON.stringify(events));
    }

    // DOM, jquery
    $("#addCalendar").on("click", function () {  // modal의 추가 버튼 클릭 시
        // 에러 핸들링
        try{
            // DOM, jquery
            var content = $("#calendar_content").val();
            var start_date = $("#calendar_start_date").val();
            var end_date = $("#calendar_end_date").val();

            //내용 입력 여부 확인 //입력 format 에러 처리
            if (content == null || content == "") {
                throw new Error("내용을 입력하세요.");
            } else if (start_date == "" || end_date == "") {
                throw new Error("날짜를 입력하세요.");
            } else if (new Date(end_date) - new Date(start_date) < 0) { // date 타입으로 변경 후 확인
                throw new Error("종료일이 시작일보다 먼저입니다.");
            } else { // 정상적인 입력 시
                // json
                var eventObj = {
                    "title": content,
                    "start": start_date + " 00:00:00",
                    "end": end_date + " 24:00:00"
                }; //전송할 객체 생성

                // 달력에 일정 추가
                calendar.addEvent(eventObj);
                saveEvent(eventObj); // 일정 저장

                // 모달 창 닫기 // DOM
                $("#calendarModal").modal("hide");
            }
        } catch(err){
            alert(err.message);
        }
    });
});