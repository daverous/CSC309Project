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
	var del = $( '#delUser' + id);
	alert(del.attr('id'));
	if(del.val() == 0){
		mod.del(1);
	}else{
		mod.del(0);
	}
}

function toggleModUser(id){
	var mod = $( '#modUser' + id);
	alert(user.attr('id'));
	if(mod.val() == 0){
		mod.val(1);
	}else{
		mod.val(0);
	}
}
function toggleBtn(id){
	var btn = $( '#btn' );
	btn.toggleClass('hidden');
}