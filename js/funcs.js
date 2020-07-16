/* function status(msg) {
document.getElementById("statusline").innerHTML = msg;
console.log(msg);
}
window.applicationCache.onchecking = function() {
status("Saytning yangi versiyasi izlanmoqda...");
jQuery("#statusline").addClass('loading');
return false;
};
window.applicationCache.onnoupdate = function() {
status("Siz internet tarmog'iga ulangansiz va saytning eng so'ngi versiyasidan foydalanmoqdasiz.")
jQuery("#statusline").addClass('up2date');
return false;
};
window.applicationCache.ondownloading = function() {
status("Saytning yangi versiyasi yuklab olinmoqda...");
jQuery("#statusline").addClass('loading');
window.progresscount = 0;
return false;
};
window.applicationCache.onprogress = function(e) {
var progress = "";
if (e && e.lengthComputable)
progress = " " + Math.round(100*e.loaded/e.total) + "%"
else
progress = " (" + ++progresscount + ")"
status("Yangi versiya yuklanmoqda:" + progress);
jQuery("#statusline").addClass('loading');
return false;
};
window.applicationCache.oncached = function() {
status("Ushbu sayt saqlab olindi. Endi siz undan internet tarmog'iga ulanmagan holda ham foydalanishingiz mumkin.");
jQuery("#statusline").addClass('up2date');
return false;
};
window.applicationCache.onupdateready = function() {
status("Saytning yangi versiyasi yuklab olindi. Uni ochish uchun, sahifani qayta yuklang.");
jQuery("#statusline").addClass('attention');
return false;
};
window.applicationCache.onerror = function() {
status("Saytning yangi versiyasini izlashda xatolik yuz berdi. Saytning saqlab olingan versiyasidan foydalanishingiz mumkin.");
jQuery("#statusline").addClass('loading');
return false;
};
window.applicationCache.onobsolete = function() {
status("Sayt mahalliy xotiradan o'chirildi. " + 
"Tarmoqdan so'ngi versiyaga o'tish uchun, sahifani qayta yuklang.");
jQuery("#statusline").addClass('attention');
return false;
}; */

var parsed = Papa.parse(raw_words);
//var retranslit = Papa.parse(raw_words);
var wcount = parsed.data.length;
//var rcount = retranslit.data.length;
var latin_words = [];
var cyril_words = [];
for(var i = 0; i < wcount; i++) {
	latin_words[i] = parsed.data[i][0];
	cyril_words[i] = parsed.data[i][1];
}

/* var rl_words = [];
var rc_words = [];
for(var i = 0; i < rcount; i++) {
	rl_words[i] = retranslit.data[i][0];
	rc_words[i] = retranslit.data[i][1];
} */

$(function(){
	$("#searchid").keyup(function(e){     
		var str = $.trim( $(this).val() );
		if( str!=''){
			var regx = /^[\u0600-\u06ff]|[\u0750-\u077f]|[\ufb50-\ufc3f]|[\ufe70-\ufefc]|[A-Za-z\‘’'-]+$/;
			if (!regx.test(str)){
				jQuery("#result").html("<li class='result_word input_error'>So'zni lotin harflaridan foydalanib kiriting</li>").fadeIn();
			} else {
				var keyword_raw = str.toLowerCase();
				var keyword_g = keyword_raw.replace("g'","g‘");
				var keyword_g2 = keyword_g.replace("g’","g‘");
				var keyword_o = keyword_g2.replace("o'","o‘");
				var keyword_o2 = keyword_o.replace("o’","o‘");
				var keyword = keyword_o2.replace("'","’");
				var keyword2 = keyword.replace("h","x");
				var keyword3 = keyword.replace("x","h");

				var key_leng = keyword.length;
				var found_words_raw1 = latin_words.filter(function(x) { return x.substring(0,key_leng) ==  keyword || x.substring(0,key_leng) ==  keyword2 || x.substring(0,key_leng) ==  keyword3 });
				var found_words_raw2 = cyril_words.filter(function(x) { return x.substring(0,key_leng) ==  keyword || x.substring(0,key_leng) ==  keyword2 || x.substring(0,key_leng) ==  keyword3 });
				var found_words_raw = found_words_raw1.concat(found_words_raw2);
				var found_words = [];
				for(var i = 0; i < found_words_raw.length; i++) {
					found_words[i] = '<a class="result_word" onclick="showWord(this.textContent)">' + found_words_raw[i] + '</a>';
				}

				jQuery("#result").html('<div id="result_grid" class="uk-grid uk-grid-width-1-2 uk-text-center">' + found_words.slice(0,6).join("") + '</div>').fadeIn();
			}
		} else {
			jQuery("#result").fadeOut();
		}
	});
});
function hideNumbers(text) {
	for(var i = 0; i < hide_n.length; i++) {
		var pat = new RegExp(hide_n[i], "g");
		text = text.replace(pat, show_n[i]);
	}
	return text;
}

function showNumbers(text) {
	for(var i = 0; i < show_n.length; i++) {
		var pat = new RegExp(show_n[i], "g");
		text = text.replace(pat, hide_n[i]);
	}
	return text;
}

function replaceArray(text,a1,a2) {
	for(var i = 0; i < a1.length; i++) {
		var pat = new RegExp(a1[i], "g");
		text = text.replace(pat, a2[i]);
	}
	return text;
}
function replaceWordArray(text,a1,a2) {
	for(var i = 0; i < a1.length; i++) {
		var wrapped = "\\b"+a1[i];
		var pat = new RegExp(wrapped, "g");
		text = text.replace(pat, a2[i]+"2");
	}
	return text;
}


$(function(){
	$("#l2c_button").click(function(e){
		var str = $.trim( $("#lat").val() );
		if( str!=''){
			var text = str.toLowerCase();
			
			var text = hideNumbers(text);
			
			var text = text.replace(/[\'ʻ]/g,"’");
			var text = text.replace(/g’/g,"g‘");
			var text = text.replace(/o’/g,"o‘");

			//console.log(text); بای2سونغاو2ر
			var text = replaceWordArray(text, latin_words, cyril_words);
			
			var text = text.replace(/’/g,"dZ");
			var text = text.replace(/g‘/g,"gZ");
			var text = text.replace(/o‘/g,"oZ");
			var text = text.replace(/\bo0/g,"1oZ"); //E (Э) 
			var text = text.replace(/\bi/g, "1i"); //E (Э) 
			var text = text.replace(/\be/g, "1e"); //E (Э) 
			var text = text.replace(/\bu/g, "1u"); //E (Э) 
			var text = text.replace(/\bo/g, "1o"); //E (Э) 
			var text = text.replace(/\ba/g, "1a"); //E (Э)
			var text = text.replace(/a\b/g, "a0"); //E (Э)
			//console.log(text);
			var text = replaceArray(text, l_letters_l2c, c_letters_l2c);	//harfma-harf o'girish
			//console.log(text);
			
			//var text = text.replace(/([\u0600-\u06ff\u0750-\u077f\ufb50-\ufc3f\ufe70-\ufefc])ای2/g,"$1ی");
			//var text = text.replace(/([\u0600-\u06ff\u0750-\u077f\ufb50-\ufc3f\ufe70-\ufefc])اۉ2/g,"$1ۉ");
			//var text = text.replace(/([\u0600-\u06ff\u0750-\u077f\ufb50-\ufc3f\ufe70-\ufefc])اې2/g,"$1ې");
			//var text = text.replace(/([\u0600-\u06ff\u0750-\u077f\ufb50-\ufc3f\ufe70-\ufefc])او2/g,"$1و");
			//var text = text.replace(/([\u0600-\u06ff\u0750-\u077f\ufb50-\ufc3f\ufe70-\ufefc])ا2/g,"$1ه‌");
			//var text = text.replace(/([\u0600-\u06ff\u0750-\u077f\ufb50-\ufc3f\ufe70-\ufefc])آ/g,"$1ا");
			//console.log(text);
			var text = text.replace(/0|1|2/g,"");
			
			var text = showNumbers(text);
			
			$("#cyr").val(text);
		} else {
			$("#cyr").val('');
		}
	});

});

$(function(){
	$("#clear_c").click(function(e){     
		$("#cyr").val('');
	});

	$("#clear_l").click(function(e){     
		$("#lat").val('');
	});
});

function showWord(x) {
	var word = x;
	if (latin_words.indexOf(word) > -1) {
		var word_index = latin_words.indexOf(word);
		var cyr_word = cyril_words[word_index];
		jQuery("#word_found").html('<div class="found_word"><h1><strong>' + word + ' | ' + cyr_word + '</strong></h1></div><hr />').fadeIn();
		jQuery("#result").fadeOut();
	} else {
		var word_index = cyril_words.indexOf(word);
		var lat_word = latin_words[word_index];
		jQuery("#word_found").html('<div class="found_word"><h1><strong>' + lat_word + ' | ' + word + '</strong></h1></div><hr />').fadeIn();
		jQuery("#result").fadeOut();
	}
}

$(document).ready(function(){
    $('.search').on('focus', function(){
        $('html,body').animate({scrollTop: $(this).offset().top}, 800);
    }); 
});
$(document).ready(function(){
	var width = document.getElementById('search_box').offsetWidth - 6;
	var top = document.getElementById('header').offsetHeight + 16;
    $("#result").css({'width':(width+'px')});
	$("#result").css({'top':(top+'px')});
});
$( window ).resize(function() {
	var width = document.getElementById('search_box').offsetWidth - 6;
	var top = document.getElementById('header').offsetHeight + 16;
    $("#result").css({'width':(width+'px')});
	$("#result").css({'top':(top+'px')});
});