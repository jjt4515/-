// DOM
document.addEventListener("DOMContentLoaded", function() { //페이지가 로드되고 HTML 문서가 완전히 파싱된 후 getWeatherData()호출
    getWeatherData();
});

// 날씨 정보 가져와서 웹페이지에 출력
function getWeatherData() {
    // DOM
    var citySelect = document.getElementById("citySelect");
    var selectedCity = citySelect.value;

    // openweathermap의 One Call API 3.0
    var apiURI = "http://api.openweathermap.org/data/2.5/forecast?q=" + selectedCity + "&appid=cc636d400da422c12b1d301ab1c13f97";

    // ajax, json
    $.ajax({
        url: apiURI,
        dataType: "json",
        type: "GET",
        async: false,
        success: function(resp) {
        // 지역 선택시 table 날씨 정보 초기화 후 새로 가져옴 // DOM
        const tableBody = document.querySelector("#weatherTable tbody");
        tableBody.innerHTML = "";

        for (var i = 0; i < resp.list.length; i += 8) {
            const newRow = tableBody.insertRow();

            const date = resp.list[i].dt_txt.split(' ')[0];
            const data = [
            date,
            (resp.list[i].main.temp - 273.15).toFixed(3),
            resp.list[i].main.humidity,
            resp.list[i].weather[0].main,
            resp.list[i].weather[0].description,
            resp.list[i].wind.speed,
            resp.city.country,
            resp.city.name,
            resp.list[i].clouds.all
            ];

            data.forEach(dataText => {
            const newDataCell = newRow.insertCell();
            newDataCell.textContent = dataText;
            });
        }
        }
    });
}

// 이전으로 되돌아가기
function goBack() {
    window.history.back();
}