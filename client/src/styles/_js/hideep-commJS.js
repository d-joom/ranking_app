jQuery(function () {		
	//전체메뉴햄버거버튼
	function sitemapToggle(){
		$('.sm_btn').toggleClass('on');            
	};
	
	$('#search').on("click",function(){
		$('#hideep-header').addClass('search_pop-open');                
	});

	$('#login').on("click",function(){
		$('#hideep-header').addClass('login_pop-open');                
	});

	//회원가입
	$('#btn-join_pop').on("click",function(){
		
		$('#hideep-header').removeClass('login_pop-open')
			.addClass('join_pop-open');              
	});

	//이미 아이디가 있는 경우
	$('.alreay_member').on("click",function(){
		$('#hideep-header').removeClass('join_pop-open')
			.removeClass('join-step2_pop-open')
			.addClass('login_pop-open');         
	});


	//회원가입 2단계로 넘어가기
	$('#join-next_step').on("click",function(){
		$('#hideep-header').removeClass('join_pop-open')
			.addClass('join-step2_pop-open');          
	});

	//회원가입 마지막단계로 넘어가기
	$('#join-final_step').on("click",function(){
		$('#hideep-header').removeClass('join-step2_pop-open')
			.addClass('join-final_pop-open');              
	});


	//모달팝업닫기
	$('.btn-pop_closed').on("click",function(){
		$('#hideep-header').removeClass('search_pop-open')
			.removeClass('login_pop-open')
			.removeClass('join_pop-open')
			.removeClass('join-step2_pop-open')
			.removeClass('join-final_pop-open');
	}); 

	//모달팝업닫기
	$('.item_information').on("click",function(){
		$('.more_info').toggleClass('show');
		$('.descriptions').toggleClass('show');
	}); 
	
	//상세페이지 폴딩
	$('.informaion_list__wrap .title').on("click",function(){
        $(this).parent().find('.cont').slideToggle(100);
        $(this).toggleClass('open_cont');
    });
	
	var section2Offset = $('#detail_information').offset();
	
    $(window).scroll(function () {
        if ($('#product_detail-body').scrollTop() <= section2Offset.top) {
            $('this').attr("style", "position:relative");
        } else {
            $('.progress-bar').attr("style", "position:sticky");
        }
    });
});

 setTimeout(function () {
        $("#mainSlide .mainSwiper").addClass("on")
    }, 200, 'easeOutQuad');

    var swiper = new Swiper(".mainSwiper", {
        parallax: true,
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        grabCursor: true,
        loop: true,
        effect: 'slide',
        direction: "horizontal",
        allowTouchMove: true,
        slidesPerView: '1',
        spaceBetween: 0,
        speed: 1200,
        // autoplay: {
        //     delay: 3500,
        //     disableOnInteraction: false,
        // },
        pagination: {
            el: ".mainSwiper .swiper-pagination",
            clickable: true,
                renderBullet: function (index, className) {
                return  '<span class="' + className + '">'+'<svg class="fp-arc-loader" width="30" height="30" viewBox="0 0 30 30">'+
                        '<circle class="path" cx="10" cy="10" r="9" fill="none" transform="rotate(-90 10 10)" stroke="#FFF"'+
                        'stroke-opacity="1" stroke-width="2px"></circle>'+
                        '<circle class="path2" cx="10" cy="10" r="4.5" fill="#FFF"></circle>'+
                        '</svg></span>';
            },
        },
      });