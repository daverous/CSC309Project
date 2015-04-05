function toggleDelHouse(id) {
    var del = $('#delHouse' + id);
    alert(del.attr('id'));
    if (del.val() == 0) {
        mod.del(1);
    } else {
        mod.del(0);
    }
}

function toggleDelUser(id) {
    var mod = $('#modUser' + id);
    var del = $('#delUser' + id);
    alert(mod.attr('id'));
    alert(del.attr('id'));
    if (mod.val() == 0) {
        mod.val(1);
    }
    if (del.val() == 0) {
        del.val(1);
    } else {
        del.val(0);
    }
}

function modifyUser(id) {
    var mod = $('#modUser' + id);
    mod.val(1);
}

function showBtn(id) {
    var btn = $('#btn');
    btn.removeClass('hidden');
}

function toggleDivs(ids) {
    for (var i = 0; i < ids.length; i++) {
        $('#' + ids[i]).toggleClass('hidden');
    }
}

function genChart(url){
    $.ajax({
        dataType: "json",
        url: url,
        success: function(data){
            var chart = AmCharts.makeChart("chartdiv", {
            "type": "serial",
            "theme": "none",
            "pathToImages": "http://www.amcharts.com/lib/3/images/",
            "dataProvider": JSON.parse(data),
            "valueAxes": [{
                "axisAlpha": 0.2,
                "dashLength": 1,
                "position": "left"
            }],
            "mouseWheelZoomEnabled":true,
            "graphs": [{
                "id":"g1",
                "balloonText": "[[category]]<br/><b><span style='font-size:14px;'>value: [[value]]</span></b>",
                "bullet": "round",
                "bulletBorderAlpha": 1,
                "bulletColor":"#FFFFFF",
                "hideBulletsCount": 50,
                "title": "red line",
                "valueField": "visits",
                "useLineColorForBulletBorder":true
            }],
            "chartScrollbar": {
                "autoGridCount": true,
                "graph": "g1",
                "scrollbarHeight": 40
            },
            "chartCursor": {
                "cursorPosition": "mouse"
            },
            "categoryField": "date",
            "categoryAxis": {
                "parseDates": true,
                "axisColor": "#DADADA",
                "dashLength": 1,
                "minorGridEnabled": true
            },
            "exportConfig":{
              menuRight: '20px',
              menuBottom: '30px',
              menuItems: [{
              icon: 'http://www.amcharts.com/lib/3/images/export.png',
              format: 'png'   
              }]  
            }
        });

        chart.dataDateFormat="YYYY-MM-DD";
        }
    });
}