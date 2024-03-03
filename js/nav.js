$(document).ready(function(){
    var toggleNav = false;
    $("#nav-buton-js").click(function(){
        // Your code to be executed when the button is clicked
        $(".nav-links").toggleClass("nav-links-expanded");
        
        console.log("Button clicked!");
    });
    $("#drop-act").click(function(){
        // Your code to be executed when the button is clicked
        $(".dropdown-content").toggleClass("dropdown-active");
        console.log("Button clicked!");
    });
});
