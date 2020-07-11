//E-mail Ajax Send
$("form").submit(function() { //Change
  var th = $(this);
  $.ajax({
    type: "POST",
    url: "mail.php", //Change
    data: th.serialize()
  }).done(function() {

    $(".popup-block").hide();
    $("#popup-success").show();
    $(".popup").addClass("popup--show");
    setTimeout(function() {
      // Done Functions
      th.trigger("reset");
    }, 1000);
  });
  return false;
});

Storage.prototype.setObj = function(key, value) {
    this.setItem(key, JSON.stringify(value));
  }
  Storage.prototype.getObj = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
  }

  //массив товаров в корзине
  var productArray=[];
  var summCart = 0;
  function calcCartSumm() {
    var summ = 0;
    $.each(productArray,function(i,e){
      summ += parseInt(e.count) * parseInt(e.price);
    });
    return summ;
  }
  function formatSumm(summ) {
    return summ.toString().replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1.');
  }  
  function showAlert() {
    if (summCart > 5000) {
      $(".cart-alert").hide(100);
      $(".cart-form").slideDown(100);
    } else {
      $(".cart-alert").show(100);
      $(".cart-form").slideUp(100);
    }
  }
  function countInCart() {
    var count = 0;
    $.each(productArray,function(i,e){
      count += parseInt(e.count);
    });
    return count;
  }

  function productArraySerialize() {
    var productContent = "";
      productContent += '<table>'+
                              '<tr>'+
                                '<th>Id</th>'+
                                '<th>Название</th>'+
                                '<th>Количество</th>'+
                                '<th>Стоимость</th>'+
                              '</tr>';
    $.each(productArray,function(i,e){
      productContent+='<tr>'+
                        '<td>'+e.id+'</td>'+
                        '<td>'+e.name+'</td>'+
                        '<td>'+e.count+'</td>'+
                        '<td>'+formatSumm(parseInt(e.count) * parseInt(e.price))+'</td>'+
                      '</tr>';
    });

    productContent += '<tr>'+
                        '<td></td>'+
                        '<td></td>'+
                        '<td>Итого</td>'+
                        '<td>'+summCart+'</td>'+
                      '</tr>'
                      '</table>';
    return productContent;
  }

  



$(window).scroll(function(){
  if ($(this).scrollTop() > 0) {
    $(".header").addClass("active");
  } else {
    $(".header").removeClass("active");
  }
  var blockTop = $('.header').innerHeight();
  var top = $(this).scrollTop();
  if (top >= (blockTop - 125)) {
    $(".header").addClass("active-menu");
  } else {
    $(".header").removeClass("active-menu");
  }
});


$(document).ready(function(){
  if(localStorage.getObj('product')!==null){
    productArray=localStorage.getObj('product');
    summCart = calcCartSumm();
    $(".js-cart-count").show().text(countInCart());
    $(".js-getcart").addClass("active");
  } else {
    $(".js-cart-count").hide();
    $(".js-getcart").removeClass("active");
  }
  $(".js-summ-cart").text(formatSumm(summCart));


  $(".js-item").each(function(j,elem){
    $.each(productArray,function(i,e){
      if (e.id == $(elem).attr("data-id")) {
        $(elem).addClass("in-cart");
        $(elem).find(".js-counter-input").val(e.count);
        $(elem).find(".js-itemAddCart").addClass("in-cart");
      }
    });
  });


  
  //cart
  $(document).on('click touchstart', '.js-item-remove', function(){
    var idRemove = $(this).parents(".cart-item").attr("data-id");
    $(this).parents(".cart-item").hide('200', function(){ $(this).parents(".cart-item").remove(); });
    $.each(productArray,function(i,e){
      if (e.id == idRemove) {
        idRemove = i;
        return;
      }
    });
    productArray.splice(idRemove, 1);
    if (productArray.length > 0) {
      localStorage.setObj('product', productArray);

      summCart = calcCartSumm();
      $(".js-summ-cart").text(formatSumm(summCart));
      $(".js-cart-count").text(countInCart());

      $("#tovars").val(productArraySerialize());
      
    } else {
      localStorage.clear();
      $(".cart-empty").show();
      $(".cart-full").hide();
      $(".js-cart-count").hide();
      $(".js-getcart").removeClass("active");
    }
    showAlert();
  });

  $(".js-itemAddCart").click(function(e){
    

    if ($(this).hasClass("in-cart")) {

    } else {
      var that = $(this).closest('.js-item').find('img');
    var bascket = $(".bottom-cart-btn");
    var w = that.width();
    
        that.clone()
            .css({'width' : w,
      'position' : 'absolute',
      'z-index' : '9999',
      top: that.offset().top,
      left:that.offset().left})
            .appendTo("body")
            .animate({opacity: 0.05,
                left: bascket.offset()['left'],
                top: bascket.offset()['top'],
                width: 20}, 1000, function() {	
          $(this).remove();
        });
      var productOwner = $(this).parents(".js-item");
      var productJSON={"id":$(productOwner).attr('data-id'), "name":$(productOwner).attr('data-name'), "price":$(productOwner).attr('data-price'), "image":$(productOwner).attr('data-img'), "count":$(productOwner).attr('data-count')};
      if(localStorage.getObj('product')!==null){
        productArray=localStorage.getObj('product');
        productArray.push(productJSON);  
        localStorage.setObj('product', productArray);  
      }
      else{
        productArray.push(productJSON);  
        localStorage.setObj('product', productArray);  
      }
      summCart = calcCartSumm();
      $(".js-summ-cart").text(formatSumm(summCart));
      $(".js-cart-count").show().text(countInCart());
      $(".js-getcart").addClass("active");
      $(this).parents(".item").addClass("in-cart");
      $(this).addClass("in-cart");
    }
  });

  $(".js-getcart").click(function(){
    if (localStorage.getObj('product')!==null) {
      $(".cart-empty").hide();
      $(".cart-full").show();
      
      var productContainer=$('#productContainer');
      productContainer.empty();
      var productContent="";
      $.each(productArray ,function(i,e){        
        productContent+='<div class="cart-item js-item" data-id="'+e.id+'" data-price="'+e.price+'">'+
                          '<div class="cart-item__img"><img src="'+e.image+'" alt=""></div>'+
                          '<a href="" target="_blank" class="cart-item__title">'+e.name+'</a>'+
                          '<div class="counter counter--cart js-counter-incart">'+
                            '<span class="counter-btn js-counter-minus">-</span>'+
                            '<input type="text" class="counter-input js-counter-input" value="'+e.count+'">'+
                            '<span class="counter-btn js-counter-plus">+</span>'+
                          '</div>'+
                          '<strong class="cart-item__price"><span>'+formatSumm(parseInt(e.count) * parseInt(e.price))+'</span> руб.</strong>'+
                          '<a class="close cart-item-remove js-item-remove">x</a>'+
                        '</div>'
      });
      productContainer.html(productContent);
      $("#tovars").val(productArraySerialize());
      showAlert();
    } else {
      $(".cart-empty").show();
      $(".cart-full").hide();
    }

    $(".popup-block").hide();
    $("#cart").show();
    $(".popup").addClass("popup--show");
  });






  $(".js-getcall").click(function(){
    $(".popup-block").hide();
    $("#popup-call").show();
    $(".popup").addClass("popup--show");
  });
  
  $(".js-close").click(function(){
    $(".popup").removeClass("popup--show");
  });

  $(".butter").click(function(){
    $(this).next().slideToggle(200);
  });

  $(".menu-item-drop > a").click(function(){
    $(this).next().slideToggle(200);
  });

  
  //counter
  $(document).on('click touchstart', '.js-counter-minus', function(){
    let inputCount = $(this).parents(".counter").find(".js-counter-input");
    let count = parseInt($(inputCount).val());
    count--;
    if (count < 1) count = 1;
    $(inputCount).val(count);

    if ($(this).parents(".counter").hasClass("js-counter-incart")) {
      //в корзине
      var id = $(this).parents(".js-item").attr("data-id");
      var price = parseInt($(this).parents(".js-item").attr("data-price"));
      $(this).parents(".js-item").find(".cart-item__price span").text(formatSumm(count * price));
      $.each(productArray ,function(i,e){
        if (e.id == id) {
          e.count = count;
          return;
        }
      });
      summCart = calcCartSumm();

      $(".js-summ-cart").text(formatSumm(summCart));
      $(".js-cart-count").show().text(countInCart());
      $(".js-getcart").addClass("active");
      localStorage.setObj('product', productArray);
      $("#tovars").val(productArraySerialize());
    } else {
      //на странице
      $(this).parents(".js-item").attr("data-count", count);
    }
    showAlert();
  });
  $(document).on('click touchstart', '.js-counter-plus', function(){
    let inputCount = $(this).parents(".counter").find(".js-counter-input");
    let count = parseInt($(inputCount).val());
    count++;
    $(inputCount).val(count);
    if ($(this).parents(".counter").hasClass("js-counter-incart")) {
      //в корзине
      var id = $(this).parents(".js-item").attr("data-id");
      var price = parseInt($(this).parents(".js-item").attr("data-price"));
      $(this).parents(".js-item").find(".cart-item__price span").text(formatSumm(count * price));
      $.each(productArray ,function(i,e){
        if (e.id == id) {
          e.count = count;
        }
      });
      summCart = calcCartSumm();
      $(".js-summ-cart").text(formatSumm(summCart)); 
      $(".js-cart-count").show().text(countInCart());
      $(".js-getcart").addClass("active");
      localStorage.setObj('product', productArray);
      $("#tovars").val(productArraySerialize());

    } else {
      //на странице
      $(this).parents(".js-item").attr("data-count", count);
    }
    showAlert();
  });
  $(".js-counter-input").on("keyup",function(){
    $(this).val($(this).val().replace (/[^0-9+]/g, ''));
    if (!($(this).val())) {
      $(this).val("1");
    }
  });



  $('.js-slider-for').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: true,
    asNavFor: '.js-slider-nav'
  });
  $('.js-slider-nav').slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    asNavFor: '.js-slider-for',
    dots: false,
    arrows: false,
    focusOnSelect: true
  });

  $("a[href^='#']").click(function(){
    var _href = $(this).attr("href");
    $("html, body").animate({scrollTop: $(_href).offset().top});
    return false;
  });
  
  
  $(function() {
    $("[type=tel]").mask("+7 (999) 999-99-99");
  });

  $('form input[type="checkbox"]').change(function () {
    if ($(this).is(":checked")) {
        $(this).parents("form").find("input[type='submit']").attr("disabled", false);
    } else {
        $(this).parents("form").find("input[type='submit']").attr("disabled", true);
    }
  });

  
  ymaps.ready(function () {
    if ($("#map").length != 0) {
      var myMap = new ymaps.Map('map', {
          center: [56.315580, 43.938487],
          zoom: 17,
          controls: []
        }),
        myPlacemark = new ymaps.Placemark([56.315580, 43.938487], {
          hintContent: 'г. Нижний Новгород, ул. Обухова, д. 6, офис П10',
          balloonContent: 'г. Нижний Новгород, ул. Обухова, д. 6, офис П10'
        }, {
          iconLayout: 'default#image',
          iconImageHref: 'images/pin.png',
          iconImageSize: [36, 50],
          iconImageOffset: [-18, -70]
        });
        myMap.geoObjects.add(myPlacemark);
    }
    
  });
});