'use strict';

window.addEventListener('DOMContentLoaded', function() {
    //slider

    let slideItems  = document.querySelectorAll('.price__item');
    let prev = document.querySelector('.slider-btn--prev');
    let next = document.querySelector('.slider-btn--next');
    let price = document.querySelector('.price__row');
    let index = 0;

    function clearSlider() {
        for (let i = 0; i < slideItems.length; i++) {
            slideItems[i].style.display = 'none';
        }
    }

    function showSlide() {
        if (index < 0) {
            index = slideItems.length - 1;
        }

        if (index >= slideItems.length) {
            index = 0;
        }
        slideItems[index].style.display = 'flex';
    }

    // function moveSlide(way) {
    //     return new Promise (resolve => {
    //         let start = Date.now();
    //         let timer = setInterval(function() {
    //             let timePassed = Date.now() - start;
    //             slideItems[index].style[way] = timePassed / 0.3 + 'px';
    //             if (timePassed > 50) slideItems[index].style.opacity = '0.5';
    //             if (timePassed > 70) slideItems[index].style.opacity = '0.1';
    //             if (timePassed > 2000) clearInterval(timer);
    //         }, 20);
    //         console.log('promise Done')
    //         resolve();
    //     });
    // }

    clearSlider();
    showSlide();
    
   
    next.addEventListener('click', function() {
        //moveSlide('left')
        clearSlider();
        console.log('clear-worked');
        showSlide(++index);
    });

    prev.addEventListener('click', function() {
        // moveSlide('right');
        clearSlider();
        showSlide(--index);
    });



    
    //modal basket

    let basketBtn = document.querySelector('.navigation__menu-item--last');
    let popup = document.querySelector('.popup');
    let popupClose = document.querySelector('.popup__close');
    let menuModals = document.querySelectorAll('.delightful__modal');

    function fillMenuModal() {
        menuModals.forEach((item) => {
            item.innerHTML = `<p class="subtitle subtitle--s">${item.parentNode.dataset.name}</p><br>
            <p class="subtitle subtitle--s">$${item.parentNode.dataset.price}</p><br>
            <button class="btn btn--s">добавить</button> `;
       });
    }

    fillMenuModal();

    basketBtn.addEventListener('click', function() {
        showPopup();
    });
    popupClose.addEventListener('click', function() {
        popup.style.display = 'none';
    });

    function showPopup() {
        document.querySelector('.popup').style.display = 'block';
        document.querySelector('.popup').style.top = event.target.parentNode.getBoundingClientRect().top + 'px';
    }




    //modal buy
    
    let formBasket = document.querySelector('.basket');
    let basketEmpty = document.querySelector('.basket__message');
    let basketHiddenItems = document.querySelectorAll('.basket--hidden');
    let basketList = document.querySelector('.basket__list');
    let btnS = document.querySelectorAll('.btn--s');
    let basket = {}; //объект с заказом
    let orderNames = {};
    let orderPrices = {};
    let delightfulItem = document.querySelectorAll('.delightful__item');
    let basketItemAddBtns = document.querySelectorAll('.basket__item-add');
    let basketItemDelBtns = document.querySelectorAll('.basket__item-del');
    let orderSum = 0;

    fillObj();
    fillObjPrices();
    changeBasketClear();
    checkBasket();
    fillBasket();
        
    btnS.forEach((i) => {

        i.addEventListener('click', function(event) {
            if (basket[event.target.parentNode.parentNode.dataset.code]) {
                basket[event.target.parentNode.parentNode.dataset.code]++;
            } else {
                basket[event.target.parentNode.parentNode.dataset.code] = 1;
            }
            orderSum += +event.target.parentNode.parentNode.dataset.price;
            console.log(orderSum);
            loadTOlocalStorage();
            checkBasket();
            changeBasket();
            fillBasket();
            console.log(basket);
            popup.style.display = 'block';
        });

    });

    function loadTOlocalStorage() {
        localStorage.setItem('serBasket', JSON.stringify(basket));  // json для добавления в localstorge
        basket =  JSON.parse(localStorage.getItem('serBasket'));

        localStorage.setItem('sum', orderSum);
        orderSum = +localStorage.getItem('sum');
    }

    function fillBasket() {
        basketList.innerHTML = '';
        for (let key in basket) {
            let newOrder = document.createElement('li');
            newOrder.classList.add("basket__item");
            newOrder.innerHTML = `<li class ="basket__item" data-code = '${key}' data-price = '${orderPrices[key]}'>
            <input type ="text" class="basket__item-name" value="${orderNames[key]}" disabled>
            <button class ="basket__item-btn  basket__item-del">-</button>
            <input type ="text" class="basket__item-count" value="${basket[key]}" disabled>
            <button class ="basket__item-btn  basket__item-add">+</button></li>`;
            basketList.prepend(newOrder);
        }

        document.querySelector('.basket__price').innerHTML = `Общая сумма $${orderSum}`;

        document.querySelectorAll('.basket__item-add').forEach((i) => {
            i.addEventListener('click', function(event) {
               basket[event.target.parentNode.dataset.code]++;
               orderSum += +event.target.parentNode.dataset.price;
               loadTOlocalStorage();
               checkBasket();
               changeBasket();
               fillBasket();
            });
        });

        document.querySelectorAll('.basket__item-del').forEach((i) => {
            i.addEventListener('click', function(event) {
               basket[event.target.parentNode.dataset.code]--;
               orderSum -= +event.target.parentNode.dataset.price;
               if (basket[event.target.parentNode.dataset.code] <= 0) {
                   delete basket[event.target.parentNode.dataset.code];
               }
               loadTOlocalStorage();
               checkBasket();
               changeBasket();
               fillBasket();
    
               if ( Object.keys(basket).length == 0 ) {
                    changeBasketClear();
               }
            });
        });
    }

    function changeBasket() {
        basketHiddenItems.forEach((el) => el.style.display = 'block');
        basketEmpty.style.display = 'none';
    }

    function changeBasketClear() {
        basketHiddenItems.forEach((el) => el.style.display = 'none');
        basketEmpty.style.display = 'block';
    }

    function checkBasket() {
        if (localStorage.getItem('serBasket')) {
            basket =  JSON.parse(localStorage.getItem('serBasket'));
            if ( Object.keys(basket).length == 0 ) {
                localStorage.clear();
            } else {
                changeBasket();
            }
            console.log(basket);
        }

        if (localStorage.getItem('sum')) {
            orderSum = +localStorage.getItem('sum');
        }
    }

    
    function fillObj() {
        for (let key of delightfulItem) {
            orderNames[key.dataset.code] = key.dataset.name;
       }
       console.log(orderNames);
    }

    function fillObjPrices() {
        for (let key of delightfulItem) {
            orderPrices[key.dataset.code] = key.dataset.price;
       }
       console.log(orderPrices);
    }


    //nav

    let menuLink = document.getElementById('priceLink');
    let spesialLink = document.getElementById('specialLink');
    let deliveryLink = document.getElementById('deliveryLink');
    let adoutLink = document.getElementById('adoutLink');

    menuLink.addEventListener('click', function() {
        window.scrollTo({
            top: document.querySelector('.price').getBoundingClientRect().top,
            behavior: "smooth" // плавно
        });
    });

    spesialLink.addEventListener('click', function() {
        window.scrollTo({
            top: document.querySelector('.special').getBoundingClientRect().top,
            behavior: "smooth" // плавно
        });
    });

    deliveryLink.addEventListener('click', function() {
        window.scrollTo({
            top: document.querySelector('.delightful').getBoundingClientRect().top,
            behavior: "smooth" // плавно
        });
    });

    adoutLink.addEventListener('click', function() {
        window.scrollTo({
            top: document.querySelector('.about').getBoundingClientRect().top,
            behavior: "smooth" // плавно
        });
    });


    //dragNDror

    popup.addEventListener('mousedown', function(event) {

        let shiftX = event.clientX - popup.getBoundingClientRect().left;
        let shiftY = event.clientY - popup.getBoundingClientRect().top;
      
        popup.style.position = 'absolute';
        popup.style.zIndex = 1000;

        moveAt(event.pageX, event.pageY);
      
        function moveAt(pageX, pageY) {
          popup.style.left = pageX - shiftX + 'px';
          popup.style.top = pageY - shiftY + 'px';
        }
      
        function onMouseMove(event) {
          moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);
    
        popup.addEventListener('mouseup', function() {
          document.removeEventListener('mousemove', onMouseMove);
          popup.addEventListener('mouseup', () => null);
        });
      });
      
      popup.addEventListener('dragstart', function() {
        return false;
      });


      //табы

      let mainContantElems = document.querySelectorAll('.main__content');
      let tabElemHome = document.getElementById('tabElemHome');
      let tabElemNews = document.getElementById('tabElemNews');

      hideMainBlock();
      mainContantElems[0].style.display = 'flex';

      tabElemHome.addEventListener('click', function() {
        mainContantElems[0].style.display = 'flex';
        mainContantElems[1].style.display = 'none';
      });

      tabElemNews.addEventListener('click', function() {
        mainContantElems[1].style.display = 'flex';
        mainContantElems[0].style.display = 'none';
      });

      function hideMainBlock() {
        mainContantElems.forEach(el => el.style.display = 'none');
      }

      //отправка формы с корзиной на сервер

    let message = {
        success: 'Спасибо! Скоро мы с вами свяжемся!',
        failure: 'Что-то пошло не так'
    };

    
    let input = formBasket.getElementsByTagName('input');
    let statusMessage = document.createElement('div');
    statusMessage.classList.add('status');

    formBasket.addEventListener('submit', async function(event) {
        event.preventDefault();

        let response = await fetch('server.php', {
            method: 'POST',
            body: new FormData(formBasket)
        });

        //let result = await response.json;

        formBasket.appendChild(statusMessage);
        
        if (response.ok) {
            statusMessage.innerHTML = message.success;
        } else {
            statusMessage.innerHTML = message.failure;
        }
        setTimeout(() => statusMessage.remove(), 5000);

        localStorage.clear();

        for (let el in basket) {
            delete basket[el];
        }

        changeBasketClear();
        checkBasket();
        fillBasket();

        document.querySelectorAll('.basket__item').forEach(el => el.remove());
        console.log(basket);
    
    
        for (let i = 0; i < input.length; i++) {
            input[i].value = '';
        }
        
    });

});