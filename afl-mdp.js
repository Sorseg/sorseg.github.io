jQuery(function(){
    var dateFormat = 'yy.mm.dd';
    var lastFocused = $("#date1");
    var calendar = $('#cal');
    var inputs = $("#date1, #date2, #date3, #date4");
    
    var input_dates = [];
    var dates_time_array = [];
    var dates_min = 0;
    var dates_max = 0;
    
    function isValid(input){
        var tempDate = calendar.datepicker('getDate');
        
        try{
            calendar.datepicker('setDate', input);
            return input == $.datepicker.formatDate(dateFormat, calendar.datepicker('getDate'));
        } catch(e){
            return false;
        } finally {
            calendar.datepicker('setDate', tempDate);
        }
    };
    
    inputs.change(function(event){
        
        //Validate:
        var targ = event.target;
        if(!isValid(targ.value)){
            $(targ).addClass('invalid');
        } else {
            $(targ).removeClass('invalid');
        }
        
        //Sort:
        dates = jQuery.map(inputs.not('.invalid'), function(i,e){
            if(i.value){
                return i.value;
            }
        });
        dates.sort()
        inputs.not('.invalid').each(function(i,e){
            e.value = dates[i] || '';
        });
        input_dates = jQuery.map(inputs.not('.invalid'),
                                 function(i,e){return $.datepicker.parseDate(dateFormat, i.value)});
        dates_time_array = jQuery.map(input_dates, function(i){ return i.getTime()});
        dates_min = Math.min.apply(null, dates_time_array);
        dates_max = Math.max.apply(null, dates_time_array);
        
        calendar.datepicker('refresh');
    });
    
    inputs.focusout(function(){
        lastFocused = this;
    });
    
    calendar.datepicker(
        {
            onSelect:
                function(date){
                    $(lastFocused).val(date).focus();
                    inputs.filter('[value=""]').first().focus();
                    inputs.change();
                },
            
            dateFormat: dateFormat,
            minDate: 0,
            maxDate: 330,
            numberOfMonths: 2,
            beforeShowDay: function(date){
                var datetime = date.getTime();
                i = dates_time_array.indexOf(datetime);
                if(i != -1){
                    return [true, 'sel_date date_'+(i+1)];
                } else if(dates_time_array.length > 1
                          && datetime > dates_min
                          && datetime < dates_max){
                    return [true, 'sel_date'];
                } else {
                    return [true, ''];
                }
            }
        }
    );
});