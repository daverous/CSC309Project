function toggleDelHouse(id){
	var del = $( '#delHouse' + id);
	alert(del.attr('id'));
	if(del.val() == 0){
		mod.del(1);
	}else{
		mod.del(0);
	}
}

function toggleDelUser(id){
	var mod = $( '#modUser' + id);
	var del = $( '#delUser' + id);
	alert(mod.attr('id'));
	alert(del.attr('id'));
	if(mod.val() == 0){
		mod.val(1);
	}
	if(del.val() == 0){
		del.val(1);
	}else{
		del.val(0);
	}
}

function modifyUser(id){
	var mod = $( '#modUser' + id);
	mod.val(1);
}

function showBtn(id){
	var btn = $( '#btn' );
	btn.removeClass('hidden');
}

function toggleDivs(ids){
	for(var i = 0; i < ids.length; i++){
		$( '#' + ids[i]).toggleClass('hidden');
	}
}