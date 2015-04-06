function toggleDelHouse(id) {
    var del = $('#delHouse' + id);
    alert(del.attr('id'));
    if (del.val() == 0) {
        mod.del(1);
    } else {
        mod.del(0);
    }
}

function showBtn(id) {
    var btn = $('#' + id);
    btn.removeClass('hidden');
}

function toggleDivs(ids) {
    for (var i = 0; i < ids.length; i++) {
        $('#' + ids[i]).toggleClass('hidden');
    }
}