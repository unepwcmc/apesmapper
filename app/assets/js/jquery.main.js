// page init
jQuery(function(){
	initOpenClose();
	initDropDisable();

  $('.view-panel a').click(function(e) {
    e.preventDefault();

    $('#graph, #main_map, #table').addClass('hide');
    if($(this).parent().hasClass('graph')) {
      $('#graph').removeClass('hide');
    } else if($(this).parent().hasClass('map')) {
      $('#main_map').removeClass('hide');
      $('#main_map').css('position', 'relative');
      $('#main_map').css('left', '0');
    } else {
      $('#table').removeClass('hide');
    }

    $(this).parent().siblings().removeClass('active');
    $(this).parent().addClass('active');
  });

  $('.range input').change(function() {
    $(this).parent('.range').find('.ui-slider').slider('values', [$(this).parent('.range').find('.min-value').val(), $(this).parent('.range').find('.max-value').val()]).trigger('slidestop', {values: [$(this).parent('.range').find('.min-value').val(), $(this).parent('.range').find('.max-value').val()]});
  });

  $('form.range-form').bind('reset', function() {
    $(this).find('input').change();
  });

  $("a.filter_by").click(function(){
    $(this).toggleClass('active');
    window.carbon.species_ials.allSpeciesIals.fetch();
  });
});

// open-close init
function initOpenClose() {
	jQuery('div.slide-block').OpenClose({
		activeClass:'active',
		opener:'a.open-close',
		slider:'div.block',
		effect:'slide',
		animSpeed:300
	});
};

// disable drop init
function initDropDisable(){
	var inactiveClass = 'inactive';
	jQuery('form.select-form').each(function(){
		var hold = jQuery(this);
		var boxes = hold.find('div.slide-block');
		boxes.each(function(i){
			var box = jQuery(this);
			var counter = box.find('span.count');
			var checkboxes = box.find('input:checkbox');
			checkboxes.change(function(){
				refreshStatus();
			}).change();
			function refreshStatus(){
				var numChecked = 0;
				checkboxes.each(function(){
					if (jQuery(this).is(':checked')) numChecked ++;
				})
				counter.text(numChecked);
				if (box.hasClass('first')) {
					if (numChecked > 0) boxes.filter('.last').removeClass(inactiveClass)
					else boxes.filter('.last').addClass(inactiveClass)
				}
			};
		});
	});
};

// open-close plugin
jQuery.fn.OpenClose = function(_options){
	// default options
	var _options = jQuery.extend({
		activeClass:'active',
		opener:'.opener',
		slider:'.slide',
		animSpeed: 400,
		animStart:false,
		animEnd:false,
		effect:'fade',
		event:'click'
	},_options);

	return this.each(function(){
		// options
		var _holder = jQuery(this);
		var _slideSpeed = _options.animSpeed;
		var _activeClass = _options.activeClass;
		var _opener = jQuery(_options.opener, _holder);
		var _slider = jQuery(_options.slider, _holder);
		var _animStart = _options.animStart;
		var _animEnd = _options.animEnd;
		var _effect = _options.effect;
		var _event = _options.event;
		if(_slider.length) {
			_opener.bind(_event,function(){
				if(!_slider.is(':animated')) {
					if(typeof _animStart === 'function') _animStart();
					if(_holder.hasClass(_activeClass)) {
						_slider[_effect=='fade' ? 'fadeOut' : 'slideUp'](_slideSpeed,function(){
							if(typeof _animEnd === 'function') _animEnd();
						});
						_holder.removeClass(_activeClass);
					} else {
						_holder.addClass(_activeClass);
						_slider[_effect=='fade' ? 'fadeIn' : 'slideDown'](_slideSpeed,function(){
							if(typeof _animEnd === 'function') _animEnd();
						});
					}
				}
			});
			if(_holder.hasClass(_activeClass)) _slider.show();
			else _slider.hide();
		}
	});
}
