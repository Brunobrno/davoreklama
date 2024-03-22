/*let carousel = document.querySelector('.carousel');

let carouselInner = document.querySelector('.carousel-inner');

let prev = document.querySelector('.carousel-controls .prev');

let next = document.querySelector('.carousel-controls .next');

let slides =  document.querySelectorAll('.carousel-inner .carousel-item');

let totalSlides = slides.length;

let step = 100 / totalSlides;

let activeSlide = 0;

let activeIndicator = 0;

let direction = -1;

let jump = 1;

let interval = 3000;

let time;



//Init carousel
carouselInner.style.minWidth = (totalSlides * 100) + '%';
loadIndicators();
loop(true);


//Carousel events

next.addEventListener('click',()=>{

    console.log("next");
    slideToNext();
});

prev.addEventListener('click',()=>{
    console.log("prev");
    slideToPrev();
});

carouselInner.addEventListener('transitionend',()=>{
    if(direction === -1){
        if(jump > 1){
            for(let i = 0; i < jump; i++){
                activeSlide++;
                carouselInner.append(carouselInner.firstElementChild);
            }
        }else{
            activeSlide++;
            carouselInner.append(carouselInner.firstElementChild);
        }
    }else if(direction === 1){
        if(jump > 1){
            for(let i = 0; i < jump; i++){
                activeSlide--;
                carouselInner.prepend(carouselInner.lastElementChild);
            }
        }else{
            activeSlide--;
            carouselInner.prepend(carouselInner.lastElementChild);
        }
    };

    carouselInner.style.transition = 'none';
    carouselInner.style.transform = 'translateX(0%)';
    setTimeout(()=>{
        jump = 1;
        carouselInner.style.transition = 'all ease .5s';
    });
    updateIndicators();
});

document.querySelectorAll('.carousel-indicators span').forEach(item=>{
    item.addEventListener('click',(e)=>{
        let slideTo = parseInt(e.target.dataset.slideTo);
        
        let indicators = document.querySelectorAll('.carousel-indicators span');

        indicators.forEach((item,index)=>{
            if(item.classList.contains('active')){
                activeIndicator = index
            }
        })

        if(slideTo - activeIndicator > 1){
            jump = slideTo - activeIndicator;
            step = jump * step;
            slideToNext();
        }else if(slideTo - activeIndicator === 1){
            slideToNext();
        }else if(slideTo - activeIndicator < 0){

            if(Math.abs(slideTo - activeIndicator) > 1){
                jump = Math.abs(slideTo - activeIndicator);
                step = jump * step;
                slideToPrev();
            }
                slideToPrev();
        }
        step = 100 / totalSlides; 
    })
});

carousel.addEventListener('mouseover',()=>{
    loop(false);
})

carousel.addEventListener('mouseout',()=>{
    loop(true);
})

//Carousel functions

function loadIndicators(){
    slides.forEach((slide,index)=>{
        if(index === 0){
            document.querySelector('.carousel-indicators').innerHTML +=
            `<span data-slide-to="${index}" class="active"></span>`;
        }else{
            document.querySelector('.carousel-indicators').innerHTML +=
            `<span data-slide-to="${index}"></span>`;
        }
    }); 
};

function updateIndicators(){
    if(activeSlide > (totalSlides - 1)){
        activeSlide = 0;
    }else if(activeSlide < 0){
        activeSlide = (totalSlides - 1);
    }
    document.querySelector('.carousel-indicators span.active').classList.remove('active');
    document.querySelectorAll('.carousel-indicators span')[activeSlide].classList.add('active');
};

function slideToNext(){
    if(direction === 1){
        direction = -1;
        carouselInner.prepend(carouselInner.lastElementChild);
    };
    
    carousel.style.justifyContent = 'flex-start';
    carouselInner.style.transform = `translateX(-${step}%)`;
};

function slideToPrev(){
    if(direction === -1){
        direction = 1;
        carouselInner.append(carouselInner.firstElementChild);
    };
    carousel.style.justifyContent = 'flex-end'
    carouselInner.style.transform = `translateX(${step}%)`;
};

function loop(status){
    if(status === true){
        time = setInterval(()=>{
            slideToNext();
        },interval);
    }else{
        clearInterval(time);
    }
}*/

$(document).ready(function() {
    let carousel = $('.carousel');
    let carouselInner = $('.carousel-inner');
    let prev = $('.carousel-controls .prev');
    let next = $('.carousel-controls .next');
    let totalSlides = $('.carousel-inner .carousel-item').length;
    let step = 100 / totalSlides;
    let activeSlide = 0;
    let activeIndicator = 0;
    let direction = -1;
    let jump = 1;
    let interval = 3000;
    let time;

    // Init carousel
    carouselInner.css('minWidth', totalSlides * 100 + '%');
    loadIndicators();
    loop(true);

    // Carousel events
    next.on('click', function() {
        console.log("next");
        slideToNext();
    });

    prev.on('click', function() {
        console.log("prev");
        slideToPrev();
    });

    carouselInner.on('transitionend', function() {
        if (direction === -1) {
            if (jump > 1) {
                for (let i = 0; i < jump; i++) {
                    activeSlide++;
                    carouselInner.append(carouselInner.children().first());
                }
            } else {
                activeSlide++;
                carouselInner.append(carouselInner.children().first());
            }
        } else if (direction === 1) {
            if (jump > 1) {
                for (let i = 0; i < jump; i++) {
                    activeSlide--;
                    carouselInner.prepend(carouselInner.children().last());
                }
            } else {
                activeSlide--;
                carouselInner.prepend(carouselInner.children().last());
            }
        }

        carouselInner.css({
            transition: 'none',
            transform: 'translateX(0%)'
        });

        setTimeout(function() {
            jump = 1;
            carouselInner.css('transition', 'all ease .5s');
        });
        updateIndicators();
    });

    $(document).on('click', '.carousel-indicators span', function() {
        let slideTo = parseInt($(this).data('slide-to'));
        let indicators = $('.carousel-indicators span');
        indicators.each(function(index) {
            if ($(this).hasClass('active')) {
                activeIndicator = index;
            }
        });

        if (slideTo - activeIndicator > 1) {
            jump = slideTo - activeIndicator;
            step = jump * step;
            slideToNext();
        } else if (slideTo - activeIndicator === 1) {
            slideToNext();
        } else if (slideTo - activeIndicator < 0) {
            if (Math.abs(slideTo - activeIndicator) > 1) {
                jump = Math.abs(slideTo - activeIndicator);
                step = jump * step;
                slideToPrev();
            }
            slideToPrev();
        }
        step = 100 / totalSlides;
    });

    carousel.on('mouseover', function() {
        loop(false);
    });

    carousel.on('mouseout', function() {
        loop(true);
    });

    // Carousel functions
    function loadIndicators() {
        for (let index = 0; index < totalSlides; index++) {
            if (index === 0) {
                $('.carousel-indicators').append('<span data-slide-to="' + index + '" class="active"></span>');
            } else {
                $('.carousel-indicators').append('<span data-slide-to="' + index + '"></span>');
            }
        }
    }

    function updateIndicators() {
        if (activeSlide > (totalSlides - 1)) {
            activeSlide = 0;
        } else if (activeSlide < 0) {
            activeSlide = totalSlides - 1;
        }
        $('.carousel-indicators span.active').removeClass('active');
        $('.carousel-indicators span').eq(activeSlide).addClass('active');
    }

    function slideToNext() {
        if (direction === 1) {
            direction = -1;
            carouselInner.prepend(carouselInner.children().last());
        }

        carousel.css('justifyContent', 'flex-start');
        carouselInner.css('transform', 'translateX(-' + step + '%)');
    }

    function slideToPrev() {
        if (direction === -1) {
            direction = 1;
            carouselInner.append(carouselInner.children().first());
        }
        carousel.css('justifyContent', 'flex-end');
        carouselInner.css('transform', 'translateX(' + step + '%)');
    }

    function loop(status) {
        if (status === true) {
            time = setInterval(function() {
                slideToNext();
            }, interval);
        } else {
            clearInterval(time);
        }
    }
});
