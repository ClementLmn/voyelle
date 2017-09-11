'use strict';

var $ = require('jquery');
var ScrollReveal = require('scrollreveal');
require('froala-editor/js/froala_editor.min.js')($);
require('froala-editor/js/plugins/link.min.js')($);
require('froala-editor/js/plugins/image.min.js')($);

$(function(){

    window.requestAnimFrame = require('./requestAnimFrame.js');
    var throttle = require('./throttle.js');

    // window.outerWidth returns the window width including the scroll, but it's not working with $(window).outerWidth
    var windowWidth = window.outerWidth, windowHeight = $(window).height();
    var header = $('#header');
    var scrollTop = $(document).scrollTop();
    var inputFile = $('#thumbFile'), imgPreview = $("#imgPreview");
    window.sr = new ScrollReveal({ reset: true, scale: 1, rotate: { z: 3 }, distance: '30px', duration: 600, viewFactor: 0.3 });


    // Rajoute une class sur le header au scroll
    function scrollHandler() {
        scrollTop = $(document).scrollTop();
        if(scrollTop > 80 && header.hasClass('big')){
            header.addClass('small').removeClass('big');
        }else if(scrollTop < 80 && header.hasClass('small')) {
            header.addClass('big').removeClass('small');
        }
    }

    // Fonction qui récupère l'image de l'input file et l'affiche
    function imagePreview(e){
        $('#nameFile').html(inputFile.val().split(/(\\|\/)/g).pop());
        var file    = document.getElementById('thumbFile').files[0];
        var reader  = new FileReader();
        reader.addEventListener("load", function () {
            imgPreview.css('background-image', 'url(' + reader.result + ')');
        }, false);
        
        if (file) {
            reader.readAsDataURL(file);
        }
    }

    function resizeHandler(){

    }

    sr.reveal($('.post'));
    sr.reveal($('.wrapper-comment'));

    inputFile.on('change', function(e){
        imagePreview(e);
    });

    $('#burger, #overlay').on('click', function(e){
        header.toggleClass('open');
    });


    //WYSIWYG
    $('#contentArticle').froalaEditor({
        height: '450',
        placeholderText: 'Rédigez votre article',
        language: 'fr',
        toolbarButtons: ['undo', 'redo', '|', 'bold', 'italic', 'underline', 'strikeThrough','subscript', 'superscript','|','outdent', 'indent','|','insertLink', 'insertImage','|', 'insertHR', 'selectAll', 'clearFormatting' ],
        toolbarButtonsSM: ['undo', 'redo', '|', 'bold', 'italic', 'underline', '|','insertLink', 'insertImage', 'clearFormatting' ],
        toolbarButtonsXS: ['undo', 'redo', '|', 'bold', 'italic', 'underline', '|','insertLink', 'insertImage']
    });

    $(window).on('resize', throttle(function () {
        requestAnimFrame(resizeHandler);
    }, 60));

    $(document).on('scroll', throttle(function(){
        requestAnimFrame(scrollHandler);
    }, 10));

});