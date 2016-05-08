function Calendar(){
	
	var self = this;
	var gMonth = ko.observable();
	var gYear = ko.observable();
	var monthes = ['January','February','March','April','May','June','July','Augus','September','October','November','December'];
	
	this.weekdays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
	this.grid = ko.observableArray();
	this.name = ko.computed(function(){return monthes[gMonth()] + ' ' + gYear();});
	
	this.goLeft = function(){
		if (gMonth() - 1 < 0) {
			init(gYear() - 1, 11);
		} else {
			init(gYear(), gMonth() - 1);
		}
	};
	
	this.goRight = function(){
		if (gMonth() + 1 > 11) {
			init(gYear() + 1, 0);
		} else {
			init(gYear(), gMonth() + 1);
		}
	};
	
	var lastSchedule = null;
	
	this.clickout = function(){
		if(lastSchedule) lastSchedule.sheduleShow(false);
		lastSchedule = null;
	};
	this.setLastSchedule = function(schedule){
		lastSchedule = schedule;
	};
	
	function init(year, month){
		var today = new Date();
		year = year || today.getFullYear();
		month = (month === undefined) ? today.getMonth() : month;
		
		gYear(year);
		gMonth(month);
		self.grid.removeAll();
		
		var firstDay = new Date(year, month, 1);
		var prevMonthLength = new Date(year, month, 0).getDate();
		var monthLength = new Date(year, month + 1, 0).getDate();
		var weekInMonth = Math.ceil((firstDay.getDay() + monthLength)/7);
		var d = prevMonthLength - firstDay.getDay();
		var thisMonth = false;
		
		for (var i = 0; i < weekInMonth; i++) { // TODO determine week number
			
			week = [];
			
			for (var j = 0; j < 7; j++) {
				
				if(self.grid().length === 0){ // firs week of the month
					if(d < prevMonthLength){
						d++;
					} else {
						d = 1;
						thisMonth = true;
					}
				} else {
					if(d < monthLength){
						d++;
					} else {
						d = 1;
						thisMonth = false;
					}
				}
				
				week.push(new Day(year, month, d, thisMonth, j == 6, self));
				
			}
			
			self.grid.push(week);
		}
	}
	init();
}