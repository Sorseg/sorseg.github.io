jQuery(function(){
    var dateFormat = 'yy.mm.dd';
    var lastFocused = $("#date1");
    var calendar = $('#cal');
    var inputs = $("#date1, #date2, #date3, #date4");
    
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
                    inputs.filter('[value=""]').first().focus()
                    inputs.change();
                    
                },
            dateFormat: dateFormat,
            minDate: 0,
            numberOfMonths: 2,
            beforeShowDay: function(date){
                var input_dates = jQuery.map(inputs, function(i,e){return i.value})
                date = $.datepicker.formatDate(dateFormat, date);
                i = input_dates.indexOf(date)
                if(i != -1){
                    return [true, 'sel_date date_'+(i+1)]
                } else {
                    return [true, '']
                }
            }
        }
    );
});