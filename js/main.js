jQuery(document).ready(function($){
	var itemInfoWrapper = $('.cd-single-item'),
		slides = $('.cd-slider li'),
		slidesWrapper = $('.cd-slider'),
		// create slider pagination
		sliderPagination = createSliderPagination(slides);
		
	
	slidesWrapper.on('click', function(event){
		//enlarge slider images 
		if( !itemInfoWrapper.hasClass('cd-slider-active') && $(event.target).is('.cd-slider')) {
			itemInfoWrapper.addClass('cd-slider-active').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
				$('body,html').animate({'scrollTop':slidesWrapper.offset().top}, 200);
			});
		}
	});
	$('.cd-slider-wrapper .cd-close').on('click', function(){
		//shrink slider images 
		itemInfoWrapper.removeClass('cd-slider-active');
	});

	//update visible slide
	$('.cd-next').on('click', function(){
		nextSlide();
	});

	$('.cd-prev').on('click', function(){
		prevSlide();
	});

	$(document).keyup(function(event){
		if(event.which=='37' && itemInfoWrapper.hasClass('cd-slider-active') && !$('.cd-slider .selected').is(':first-child')) {
			prevSlide();
		} else if( event.which=='39' && itemInfoWrapper.hasClass('cd-slider-active') && !$('.cd-slider .selected').is(':last-child')) {
			nextSlide();
		} else if(event.which=='27') {
			itemInfoWrapper.removeClass('cd-slider-active');
		}
	});

	slidesWrapper.on('swipeleft', function(){
		var bool = enableSwipe();
		if(!$('.cd-slider .selected').is(':last-child') && bool) {nextSlide();}
	});

	slidesWrapper.on('swiperight', function(){
		var bool = enableSwipe();
		if(!$('.cd-slider .selected').is(':first-child') && bool) {prevSlide();}
	});

	sliderPagination.on('click', function(){
		var selectedDot = $(this);
		if(!selectedDot.hasClass('selected')) {
			var selectedPosition = selectedDot.index(),
				activePosition = $('.cd-slider .selected').index();
			if( activePosition < selectedPosition) {
				nextSlide(selectedPosition);
			} else {
				prevSlide(selectedPosition);
			}
		}
	});

	function createSliderPagination($slides){
		var wrapper = $('<ul class="cd-slider-pagination"></ul>').insertAfter('.cd-slider-navigation');
		$slides.each(function(index){
			var dotWrapper = (index == 0) ? $('<li class="selected"></li>') : $('<li></li>'),
				dot = $('<a href="#0"></a>').appendTo(dotWrapper);
			dotWrapper.appendTo(wrapper);
			dot.text(index+1);
		});
		return wrapper.children('li');
	}

	function nextSlide($n){
		var visibleSlide = $('.cd-slider .selected'),
			navigationDot = $('.cd-slider-pagination .selected');
		if(typeof $n === 'undefined') $n = visibleSlide.index() + 1;
		visibleSlide.removeClass('selected');
		slides.eq($n).addClass('selected').prevAll().addClass('move-left');
		navigationDot.removeClass('selected')
		sliderPagination.eq($n).addClass('selected');
		updateNavigation(slides.eq($n));
	}

	function prevSlide($n){
		var visibleSlide = $('.cd-slider .selected'),
			navigationDot = $('.cd-slider-pagination .selected');
		if(typeof $n === 'undefined') $n = visibleSlide.index() - 1;
		visibleSlide.removeClass('selected')
		slides.eq($n).addClass('selected').removeClass('move-left').nextAll().removeClass('move-left');
		navigationDot.removeClass('selected');
		sliderPagination.eq($n).addClass('selected');
		updateNavigation(slides.eq($n));
	}

	function updateNavigation($active) {
		$('.cd-prev').toggleClass('inactive', $active.is(':first-child'));
		$('.cd-next').toggleClass('inactive', $active.is(':last-child'));
	}

	function enableSwipe() {
		var mq = window.getComputedStyle(document.querySelector('.cd-slider'), '::before').getPropertyValue('content');
		return ( mq=='mobile' || itemInfoWrapper.hasClass('cd-slider-active'));
	}
});