/*   
 *   A   JavaScript   implementation   of   the   Secure   Hash   Algorithm,   SHA-1,   as   defined   
 *   in   FIPS   PUB   180-1   
 *   Version   2.1-BETA   Copyright   Paul   Johnston   2000   -   2002.   
 *   Other   contributors:   Greg   Holt,   Andrew   Kepert,   Ydnar,   Lostinet   
 *   Distributed   under   the   BSD   License   
 *   See   http://pajhome.org.uk/crypt/md5   for   details.   
 */
/*   
 *   Configurable   variables.   You   may   need   to   tweak   these   to   be   compatible   with   
 *   the   server-side,   but   the   defaults   work   in   most   cases.   
 */
var hexcase = 0; /*   hex   output   format.   0   -   lowercase;   1   -   uppercase                 */
var b64pad = ""; /*   base-64   pad   character.   "="   for   strict   RFC   compliance       */
var chrsz = 8; /*   bits   per   input   character.   8   -   ASCII;   16   -   Unicode             */

/*   
 *   These   are   the   functions   you'll   usually   want   to   call   
 *   They   take   string   arguments   and   return   either   hex   or   base-64   encoded   strings   
 */
function hex_sha1(s) {
    return binb2hex(core_sha1(str2binb(s), s.length * chrsz));
}

function b64_sha1(s) {
    return binb2b64(core_sha1(str2binb(s), s.length * chrsz));
}

function str_sha1(s) {
    return binb2str(core_sha1(str2binb(s), s.length * chrsz));
}

function hex_hmac_sha1(key, data) {
    return binb2hex(core_hmac_sha1(key, data));
}

function b64_hmac_sha1(key, data) {
    return binb2b64(core_hmac_sha1(key, data));
}

function str_hmac_sha1(key, data) {
    return binb2str(core_hmac_sha1(key, data));
}

/*   
 *   Perform   a   simple   self-test   to   see   if   the   VM   is   working   
 */
function sha1_vm_test() {
    return hex_sha1("abc") == "a9993e364706816aba3e25717850c26c9cd0d89d";
}

/*   
 *   Calculate   the   SHA-1   of   an   array   of   big-endian   words,   and   a   bit   length   
 */
function core_sha1(x, len) {
    /*   append   padding   */
    x[len >> 5] |= 0x80 << (24 - len % 32);
    x[((len + 64 >> 9) << 4) + 15] = len;

    var w = Array(80);
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;
    var e = -1009589776;

    for (var i = 0; i < x.length; i += 16) {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;
        var olde = e;

        for (var j = 0; j < 80; j++) {
            if (j < 16) w[j] = x[i + j];
            else w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
            var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
            e = d;
            d = c;
            c = rol(b, 30);
            b = a;
            a = t;
        }

        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
        e = safe_add(e, olde);
    }
    return Array(a, b, c, d, e);

}

/*   
 *   Perform   the   appropriate   triplet   combination   function   for   the   current   
 *   iteration   
 */
function sha1_ft(t, b, c, d) {
    if (t < 20) return (b & c) | ((~b) & d);
    if (t < 40) return b ^ c ^ d;
    if (t < 60) return (b & c) | (b & d) | (c & d);
    return b ^ c ^ d;
}

/*   
 *   Determine   the   appropriate   additive   constant   for   the   current   iteration   
 */
function sha1_kt(t) {
    return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514;
}

/*   
 *   Calculate   the   HMAC-SHA1   of   a   key   and   some   data   
 */
function core_hmac_sha1(key, data) {
    var bkey = str2binb(key);
    if (bkey.length > 16) bkey = core_sha1(bkey, key.length * chrsz);

    var ipad = Array(16),
        opad = Array(16);
    for (var i = 0; i < 16; i++) {
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }

    var hash = core_sha1(ipad.concat(str2binb(data)), 512 + data.length * chrsz);
    return core_sha1(opad.concat(hash), 512 + 160);
}

/*   
 *   Add   integers,   wrapping   at   2^32.   This   uses   16-bit   operations   internally   
 *   to   work   around   bugs   in   some   JS   interpreters.   
 */
function safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
}

/*   
 *   Bitwise   rotate   a   32-bit   number   to   the   left.   
 */
function rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
}

/*   
 *   Convert   an   8-bit   or   16-bit   string   to   an   array   of   big-endian   words   
 *   In   8-bit   function,   characters   >255   have   their   hi-byte   silently   ignored.   
 */
function str2binb(str) {
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < str.length * chrsz; i += chrsz)
    bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
    return bin;
}

/*   
 *   Convert   an   array   of   big-endian   words   to   a   string   
 */
function binb2str(bin) {
    var str = "";
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < bin.length * 32; i += chrsz)
    str += String.fromCharCode((bin[i >> 5] >>> (24 - i % 32)) & mask);
    return str;
}

/*   
 *   Convert   an   array   of   big-endian   words   to   a   hex   string.   
 */
function binb2hex(binarray) {
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i++) {
        str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) + hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
    }
    return str;
}

/*   
 *   Convert   an   array   of   big-endian   words   to   a   base-64   string   
 */
function binb2b64(binarray) {
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i += 3) {
        var triplet = (((binarray[i >> 2] >> 8 * (3 - i % 4)) & 0xFF) << 16) | (((binarray[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4)) & 0xFF) << 8) | ((binarray[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4)) & 0xFF);
        for (var j = 0; j < 4; j++) {
            if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;
            else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
        }
    }
    return str;
}
var qhblist= 'http://luck.dxt.cn/v2/luck/yydb/qhb?sign=fbb1db2b970efda8e613df59e5e66fbebb47ea7e&mobile_type=40';
var roburl = 'http://luck.dxt.cn/v2/luck/happy/rob';
var data = [];
var sign = [];
var luck_id = [];
var user_id ='1011174';
var minutesecond = [];
var token = '4EAFZADVQtiCogNLg05PMg';
//           MjAxNi0wNi0xMDoxMDExMTc0
var param = {};
//hex_sha1('luck_id='+result.luck_id+'&user_id='+result.user_id+'&token='+param.token);Content-Type:application/x-www-form-urlencoded
var moneyroburl='http://luck.dxt.cn/game/yydb/luck/join';
var moneykeyurl = 'http://luck.dxt.cn/v2/luck/yydb/qhb?mobile_type=1';

function robmoney(){
	try{
		now = new Date();
	minute = now.getUTCMinutes();
	hours = now.getUTCHours();
	tmphours = hours+8;
	day = now.getDate();
		token = checkDates[day]['token']
		res = HTTP.get('http://luck.dxt.cn/v2/luck/yydb/qhb?mobile_type=1');
		list = res.data.data.luck_yydb;
		console.log(list)
		_.each(list,function(ele,index){
                                hash=hex_sha1('user_id='+user_id+'&yydb_id='+ele.yydb_id+'&token='+token);
                                console.log(ele.yydb_id,"===",hash)
				try{
					r = HTTP.get('http://luck.dxt.cn/game/yydb/luck/join',{params:{user_id:user_id,yydb_id:ele.yydb_id,sign:hash}});
					console.log(r);
				}catch(e){
                    console.log('rob error');
				}
		})
		Meteor.setTimeout(robmoney,3600000);
	}catch(e){
		robmoney();
	}
}
var getData = function(){
	var result;
	result = HTTP.get('http://luck.dxt.cn/v2/luck/qhb');
	return result.data.data;
}
 function visit(){
	//console.log(111);
	HTTP.get('http://mydemotest.meteor.com',function(error,result){
		if(error){
		console.log('error');
		visit();
		}
	});
	var interval = Math.random()*1000*180+1000*300;
	Meteor.setTimeout(visit,interval);
	
}
var checkDates = [];
function getCheckDate(day){
	checkDates[day] = [];
	token = login();
	checkDates[day]['token'] = token;
	for(var i=0;i<=23;i++){
		checkDates[day][i] = false;
	}
}

var login = function(){
	robres = HTTP.post('http://user.dxt.cn/v2/login/phone',{params:{phone:'13585884436',password:'123456'},headers:{'Content-Type':'application/x-www-form-urlencoded','cookie':'JSESSIONID=045379D36B62BDEAC8C32B1ECEB80006'}});
	console.log(robres.data.data.token,"====");
	return robres.data.data.token
}
var rob = function(start){
	now = new Date();
	minute = now.getUTCMinutes();
	hours = now.getUTCHours();
	tmphours = hours+8;
	day = now.getDate();
	if(tmphours > 24){
		day = day+1;
		hours = tmphours-24;
	}else{
		hours = tmphours;
	}
	if(hours < 10){
		hours = '0'+hours;
	}
	if(typeof(checkDates[day]) == 'undefined' || checkDates[day].length == 0){
		getCheckDate(day);
	}
	token = checkDates[day]['token'];
	if(typeof(data) == 'undefined' || data.length == 0){
		data = getData();
		while(!data.length){
			data = getData();
		}
	}else{
		//if(typeof(checkDates[day-1])!='undefined' && checkDate[day].length>0){
		//	checkDates = [];
		//}
        tmphhours = parseInt(hours);
        //console.log(typeof(checkDates[day]));
		
        if(tmphhours<9){
            //console.log(day)
        }
        //console.log(checkDates[day]);
		if(tmphhours < 9 && checkDates[day][tmphhours] == false){
			console.log('before data');
			data = getData();
			console.log('after data');
			checkDates[day][tmphhours] = true;
			param = {};
		}
	}
	if(param['dealed'] !== true){
	_.each(data,function(ele,index){
		var lid = ele.qhb_time.luck_id;
		minutesecond.push(ele.qhb_time.start_time);

		tmpsign = hex_sha1('luck_id='+lid+'&token='+token+'&user_id='+user_id+'&token='+token);
		tmptime = ele.qhb_time.start_time.split(':');
		param[tmptime[0]] = {};
		param[tmptime[0]]['luck_id'] = lid;
		param[tmptime[0]]['sign'] = tmpsign;
		param[tmptime[0]]['user_id'] = user_id;
		param[tmptime[0]]['minute'] = tmptime[1];
		param['dealed'] = true
	});
	}
	if(typeof(param[hours]) != 'undefined' && param[hours]['success'] != 1){
		console.log(hours,'robed once');
        try{
		robres = HTTP.post('http://luck.dxt.cn/v2/luck/happy/rob',{params:{luck_id:param[hours]['luck_id'],sign:param[hours]['sign'],user_id:param[hours]['user_id'],token:token},headers:{'Content-Type':'application/x-www-form-urlencoded','cookie':'JSESSIONID=045379D36B62BDEAC8C32B1ECEB80006'}});
		robdata = robres.data;
		console.log(robdata);
		if(robdata.status == 0){
			param[hours]['success'] = 1
			Meteor.setTimeout(rob,100);
		}else if(robdata.status == 412){
			param[hours]['success'] = 1
			Meteor.setTimeout(rob,100);
		}else if(robdata.status == 409){
			data = getData();
			param = {};
			rob();
		}else if(robdata.status == 403){
			getCheckDate();
			Meteor.setTimeout(rob,1000);
		}else if(robdata.status == 500){
			console.log(robdata);
			Meteor.setTimeout(rob,100);
		}else{
			Meteor.setTimeout(rob,100);
		}
        }catch(e){
            rob();
        }
	}else{
		Meteor.setTimeout(rob,100);
	}

}
//console.log(hex_sha1("luck_id=1283798&token=ElCyKjJTSnaeU8tfTiBLZA&user_id=1011174&token=ElCyKjJTSnaeU8tfTiBLZA"),"===","7d43fcb2b9e968870981737416e295c93fed6ff7");
//console.log(hex_sha1("user_id=1011174&yydb_id=1446604304491&token=4EAFZADVQtiCogNLg05PMg"),"===","d27b6790ae3dc7cb4b3fddb44cc71414f1566d6f");
//login();
rob(1);
//visit();
robmoney();
//sign=8571ebefe82745da28f834260d9df92638c6796f&token=6P3qKBPzQG6B10Bz_pgQ1A&luck_id=1283798&user_id=4191616
//console.log(hex_sha1('luck_id=1283798&user_id=4191616&token=6P3qKBPzQG6B10Bz_pgQ1A'));
