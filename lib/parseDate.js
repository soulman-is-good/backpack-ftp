module.exports = function parseDate () {
	function zero(i) {
		return i<10?"0" + i:String(i);
	}
  var D = new Date();
  return [D.getFullYear(), D.getMonth() + 1, D.getDate()].map(zero).join('/') + " " + 
		[D.getHours(), D.getMinutes(), D.getSeconds()].map(zero).join(':') + "." + D.getMilliseconds();
};