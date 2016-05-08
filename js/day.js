/*TODO
+ подробности свернуть/развернуть
+ deactivateAll подробности
+ удаление событий
+ сделать список в таблице из той же переменной (this.schedule)
+ разные заголовки для таблицы и попапа
+ подправить span с количеством событий
+ сделать расположение попапа
+ сделать уголок
+ сделать левый попап для последних дней
x анимация
- mixins-prefixes
+ выделить сегдняшний день
*/

function Day(year, month, date, isThisMonth, invert, calendar){
	var self = this;
	var key = year+'.'+month+'.'+date;
	var sheduleList = [];
	var scheduleElement = null;
	
	this.date = date;
	
	this.text = ko.observable('');
	this.schedule = ko.observableArray();
	this.sheduleShow = ko.observable(false);
	
	this.classString =  ko.computed(function(){
		var today = new Date();
		var str = isThisMonth ? 'thisMonth' : 'notThisMonth';
		if(today.getFullYear() === year && today.getMonth() === month && today.getDate() === date){
			str += ' thisDay';
		}
		if(invert) str += ' invert';
		return str;
	});
	
	this.eventCount = ko.computed(function(){
		var c = self.schedule().length;
		if(c){
			if(c > 1){
				return c + ' events';
			}
			return '1 event';
		}
	});
	
	this.scheduleShort = ko.computed(function(){
		return self.schedule.slice(0,3);
	});
	
	this.getSchedule = function(o,e){
		calendar.clickout();
		if(!isThisMonth) return;
		calendar.setLastSchedule(self);
		self.sheduleShow(true);
		scheduleElement = e.currentTarget.querySelector('.schedule');
		centerScheduleElement();
	};
	
	this.checkInput = function(o, e){
		if(e.which == 13 && e.ctrlKey === true){
			addEvent(self.text());
			localforage.setItem(key, sheduleList);
			self.text('');
			centerScheduleElement();
		}
	};
	
	this.removeEvent = function(event){
		sheduleList.splice(sheduleList.indexOf(event.text),1);
		localforage.setItem(key, sheduleList);
		self.schedule.remove(event);
		centerScheduleElement();
	};
	
	this.toggleEventDetails = function(event){
		if(event.show()){
			event.show(false);
		} else {
			for (var i = 0, l = self.schedule().length; i < l; i++) {
				self.schedule()[i].show(false);
			}
			event.show(true);
		}
		centerScheduleElement();
	};
	
	function addEvent(event){
		
		function Event(event){
			
			function shorten(str, len){
				var arr = str.split(' ');
				var rStr = '';
				for (var i = 0, l = arr.length; i < l; i++) {
					if((rStr + arr[i]).length >= len){
						return rStr + '...';
					}
					rStr = rStr + ' ' + arr[i];
				}
				return rStr;
			}
			
			var self = this;
			
			this.title = shorten(event, 30);
			this.shortTitle = shorten(event, 15);
			this.text = event;
			this.show =  ko.observable(false);
			this.details =  ko.computed(function(){
				return self.show() ? 'active' : '';
			});
			
		}

		sheduleList.push(event);
		self.schedule.push(new Event(event));
	}
	
	function centerScheduleElement(){
		if(scheduleElement) scheduleElement.style.marginTop = (- scheduleElement.offsetHeight/2) + 'px';
	}
	
	if(isThisMonth){
		localforage.getItem(key).then(function(schedule){
			for (var i = 0, l = schedule.length; i < l; i++) {
				addEvent(schedule[i]);
			}
		});
	}
}