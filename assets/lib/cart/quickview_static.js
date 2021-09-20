$(window).on('load',function(){
	var arrList = $('.page').find('.item__list__id');
	var arrPid = '';
	var flg = 0;
	for(i=0;i < arrList.length;i++){
		var link = $(arrList[i]).find('a').attr('href');
		if(link !== ''){
			flg ++;
			link = link.split('product_id=')[1];
			if(flg == 1 ){
				arrPid += link;
			}else{
				arrPid += ',' + link;
			}
		}
	}
	var transactionid = $('input[name="transactionid"]').val();
	Quick_View_Ascon(arrPid,transactionid,arrList);
});
function addCartIn(elm,id){
	let pcid = $(elm).find('select').val();
	let setid = id;
	let pid = '#'+id;
	let pmaker = $(pid).find('[data-name="maker"]').text();
	let pname = $(pid).find('[data-name="name"]').text();
	let size = $(elm).find('option:selected').text();
	console.log(pcid+':'+pmaker+':'+pname+':'+size);
	let modal = "<div id='ajax_modal_wrapper'>";
		modal += "<div class='modal_inner'>";
			modal +="<p class='maker'>";
			modal += pmaker;
			modal += "</p>";
			modal +="<p class='name'>";
			modal += pname;
			modal += "</p>";
			modal += "<p class='size'>サイズ："+size+"</p>";
			modal += "<p class='select_txt'>本当にこの商品をカートに入れますか？</p>";
			modal += "<div class='set_btn_area'>";
				modal += "<a href='javascript:void(0);' class='cancel_btn' onclick='fnAddSubmit(0)'>";
					modal += "キャンセル";

				modal += "</a>";
				modal += "<a href='javascript:void(0);' class='add_btn' onclick='fnAddSubmit(1,"+setid+","+pcid+")'>";
					modal += "カートに入れる";

				modal += "</a>";
			modal += "</div>";
		modal += "</div>";
	modal += "</div>";
	if(pcid !=="" && pcid !== null && pcid !== undefined){
		$("body").append(modal);
		$("#ajax_modal_wrapper").fadeIn();
	}else{
		$("#ajax_modal_wrapper").remove();
	}
}

function fnAddSubmit(flg,setid,pcid){
	if(flg == 0){
		$("#ajax_modal_wrapper").fadeOut(200);
		setTimeout(function(){
			$("#ajax_modal_wrapper").remove();
		},350);
	}else if (flg == 1){
		let url1 = "https://"+location.host+"/ajax/cart.php";
		let url2 = "https://"+location.host+"/ajax/cart_view_ajax.php";
		let tid = $('input[name="transactionid"]').val();
		add_cart_nonreloadEx(setid, pcid, url1, tid, name,url2);
	}
}
function add_cart_nonreloadEx(setid, pcid,url1,tid,name,url2){
	$('#ajax_modal_wrapper').find('.select_txt').html('');
	$('#ajax_modal_wrapper').find('.select_txt').append('<img src="/user_data/packages/store/images/bx_loader.gif" />');
	if (typeof setid === "undefined") {
		return false;
	}
	$.ajax({
		type: "POST",
		url: url1,
		data: {
			transactionid: tid,
			product_id: setid,
			product_class_id: pcid
		},
		dataType: 'text',
		success: function (data) {
			var no = 0;
			var target = $('header').find('.m-badge').find('.m-badge_text');
			if (data!=1) {
				if(target.length > 0){
					//console.log('exist');
					no = no + parseInt($(target).html());
					no = parseInt(no)+1;
					$(target).html(no);
				}else{
					//console.log('no exist');
					$('header').find('.m-badge').append('<span class="m-badge_inner"><span class="m-badge_text m-font_futura">1</span></span>');
				}
				$('#ajax_modal_wrapper').find('.select_txt').text('カートに入れました。');
				noReloadCartIn_newItems(tid,url2);
				setTimeout(function(){
					console.log(no);
					if(parseInt(no) > 1){
						setTimeout(function(){
							$('#dropdownCart_contents_wrap').find('.bx-viewport').css('height','219px');
						},1000);
					}
					$("#ajax_modal_wrapper").remove();
				},500);
            } else {
                alert('在庫が足りないため'+name+'はカートに入れれませんでした。');
            }
        },
        error: function (req, status, err) {
            alert(err);
        }
    });
}

function Quick_View_Ascon(id,tid,target){
	if (tid === "undefined" || !tid) {
		return false;
	}
	$.ajax({
		method: "POST",
		url: "https://"+ location.host +"/ajax/asconpreset.php",
		data: {
			transactionid: tid,
			product_id : id
		},
		dataType: 'json',
		success: function (data, dataType) {
			//console.log('success');
			//console.log(data);
			for(i=0;i<data.length;i++){
				if(data[i].info !== null){
					$(target[i]).find('.ajax_area').append(SetPrice(data[i].info.price01,data[i].info.price02));
					$(target[i]).find('.ajax_area').append(SetStockFlg(data[i].matrix.arrMatrixData,data[i].id,i));
					if(data[i].matrix.arrMatrixData.stock_total){
						$(target[i]).find('.ajax_area').append('<a href="javascript:void(0);" onclick="addCartIn(\'#select_'+data[i].id+'_'+i+'\','+data[i].id+');" class="cartinbtn">カートへ入れる</a>');
					}
					if(data[i].info.function_icons !== null){
						//$(target[i]).find('.ajax_area').append(SetIcons(data[i].info.function_icons));
					}
				}
			}
			$('.ajax_area').slideToggle(500).css('display','flex');
		},
		error: function (data, dataType) {
			console.log('error');
		}
	});
}

function SetPrice(p1,p2){
p1 = Math.floor(p1*1.1)
p2 = Math.floor(p2*1.1)
	var html = '';
	html += '<div class="preset_price_area">';
	if(p1 !== null){
		if(parseInt(p1) == parseInt(p2)){
			html += priceSeparate(p1)+'円';
		}else if (parseInt(p1) > parseInt(p2)){
			html += '<span class="preset_price_mini">'+priceSeparate(p1)+'<span class="smaller">円</span></span>';
			html += priceSeparate(p2)+'円';
		}else if(parseInt(p2) == null){
			html += priceSeparate(p1)+'円';
		}else if(parseInt(p1) == 0 && parseInt(p2) > 0){
			html += priceSeparate(p2)+'円';
		}
	}else{
		if(p2 !== null){
			html += priceSeparate(p2)+'円';
		}
	}
	html += '</div>';
	return html;
}
function priceSeparate(num){
    return String(num).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}
function SetIcons(icons){
	var iconhtml = '<ul class="iconlist">';
	for(iiii=0;iiii<icons.length;iiii++){
		iconhtml += '<li>';
			iconhtml += '<img src="'+icons[iiii]+'" />';
		iconhtml += '</li>';
	}
	iconhtml += '</ul>';
	return iconhtml;
}
function SetStockFlg(flg,pid,cnt){
	var stockhtml = '';
	if(flg.stock_total){
		stockhtml += '<span class="stock_exist" id="select_'+pid+'_'+cnt+'">';
		stockhtml += flg.html;
		stockhtml += '</span>';
	}else{
		stockhtml += '<span class="no_stock">× 在庫なし</span>';
	}

	return stockhtml;
}
