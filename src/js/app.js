const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const app = (() => {
   return {
      handleEvent() {
         // Input start
         const minusBtn = $$('.product__input-control')[0];
         const plusBtn = $$('.product__input-control')[1];
         minusBtn.onclick = () => {
            const inputValue = Number(
               $('.product__input input[type="number"]').value
            );
            $('.product__input input[type="number"]').value =
               inputValue > 0 ? inputValue - 1 : inputValue;
         };
         plusBtn.onclick = () => {
            const inputValue = Number(
               $('.product__input input[type="number"]').value
            );
            $('.product__input input[type="number"]').value = inputValue + 1;
         };
         // Input end

         // Image event start
         const updateProductImage = (clickedThumbElement) => {
            const productImgContainer =
               clickedThumbElement.closest('.product__imgs');
            const productImg =
               productImgContainer.querySelector('.product__img');
            const activedThumbElement = productImgContainer.querySelector(
               '.product__thumbnail-container--active'
            );
            if (clickedThumbElement.parentNode !== activedThumbElement) {
               clickedThumbElement.parentNode.classList.add(
                  'product__thumbnail-container--active'
               );
               activedThumbElement.classList.remove(
                  'product__thumbnail-container--active'
               );
               productImg.src = clickedThumbElement.src.replace(
                  '-thumbnail',
                  ''
               );
            }
         };

         const handleChangeProductImg = (e) => {
            const clickedThumbContainer = e.target.closest(
               '.product__thumbnail-container'
            );
            if (clickedThumbContainer) {
               updateProductImage(
                  clickedThumbContainer.querySelector('.product__thumbnail')
               );
            }
         };
         document.body.addEventListener('click', handleChangeProductImg);

         const productImgContainer = $('.product__imgs');
         const productImg = $('.product__img');
         const modal = $('.modal');
         const modalBody = $('.modal__body');

         const getThumbnail = (productImgContainer, options) => {
            const activedThumbElement = productImgContainer.querySelector(
               '.product__thumbnail-container--active'
            );
            if (options === 'next') {
               return (
                  activedThumbElement.nextElementSibling ||
                  activedThumbElement.parentNode.firstElementChild
               );
            }
            if (options === 'prev') {
               return (
                  activedThumbElement.previousElementSibling ||
                  activedThumbElement.parentNode.lastElementChild
               );
            }
         };
         const createControlBtn = (parentContainer) => {
            const nextBtn = document.createElement('div');
            const prevBtn = document.createElement('div');
            nextBtn.className = 'product__imgs-control';
            prevBtn.className = 'product__imgs-control';
            nextBtn.classList.add('next-btn');
            prevBtn.classList.add('prev-btn');

            nextBtn.innerHTML = `
            <svg class="icon" width="13" height="18" xmlns="http://www.w3.org/2000/svg"><path d="m2 1 8 8-8 8"  stroke-width="3" fill="none" fill-rule="evenodd"/></svg>
            `;
            prevBtn.innerHTML = `<svg class="icon" width="12" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M11 1 3 9l8 8"  stroke-width="3" fill="none" fill-rule="evenodd"/></svg>`;
            nextBtn.onclick = () => {
               const nextEle = getThumbnail(
                  parentContainer,
                  'next'
               ).querySelector('.product__thumbnail');
               if (nextEle) {
                  updateProductImage(nextEle);
               }
            };

            prevBtn.onclick = () => {
               const prevEle = getThumbnail(
                  parentContainer,
                  'prev'
               ).querySelector('.product__thumbnail');
               if (prevEle) {
                  updateProductImage(prevEle);
               }
            };
            return { nextBtn, prevBtn };
         };
         productImg.onclick = () => {
            const clientWidth = document.documentElement.clientWidth;
            if (clientWidth > 375) {
               const lightbox = productImgContainer.cloneNode(true);
               const { nextBtn, prevBtn } = createControlBtn(lightbox);
               modalBody.appendChild(lightbox);
               lightbox.appendChild(nextBtn);
               lightbox.appendChild(prevBtn);
               modal.classList.add('d-flex');

               const closeModalBtn = $('.modal__body-close-btn');
               closeModalBtn.onclick = () => {
                  lightbox.remove();
                  nextBtn.remove();
                  prevBtn.remove();
                  modal.classList.remove('d-flex');
               };
            }
         };
         // Image event end

         // Add to cart start
         const inputElement = $('.product__input input[type="number"]');
         const addToCartBtn = $('.product__add-btn');
         const cartContainer = $('.cart__container');
         const cartBody = $('.cart__body');
         const checkoutBtn = $('.cart__checkout-btn');
         const cartCount = $('.cart__count');

         const getProductInfo = (productContainer) => {
            const $$$ = productContainer.querySelector.bind(productContainer);
            const productNameElement =
               $$$('.info__name') || $$$('.order-product__name');
            const productImgElement =
               $$$('.product__img') || $$$('.order-product__img');
            const productPriceElement =
               $$$('.sale-price') || $$$('.order-product__price');
            const productAmount = $$$('.product__input input[type="number"]')
               ? $$$('.product__input input[type="number"]').value
               : 0;
            return {
               name: productNameElement.innerText,
               img: productImgElement.src,
               price: Number(
                  productPriceElement.firstChild.textContent
                     .trim()
                     .replace('$', '')
               ),
               amount: Number(productAmount),
            };
         };

         const addToCart = (product) => {
            const orderProducts = $$('.order-product');
            const existedProducts = Array.from(orderProducts).find(
               (orderProduct) =>
                  getProductInfo(orderProduct).name === product.name &&
                  getProductInfo(orderProduct).price === product.price
            );
            if (existedProducts) {
               const curAmount = Number(
                  existedProducts.querySelector('.order-product__amount')
                     .innerText
               );
               const totalCostElement = existedProducts.querySelector(
                  '.order-product__total-cost'
               );
               const newAmount = curAmount + product.amount;
               existedProducts.querySelector(
                  '.order-product__amount'
               ).innerText = newAmount;
               totalCostElement.innerText = `$${(
                  newAmount * product.price
               ).toFixed(2)}`;
            } else {
               // cartContainer.classList.remove('empty');
               // cartBody.classList.add('d-block');
               const newOrderProduct = document.createElement('div');

               cartBody.insertBefore(newOrderProduct, checkoutBtn);

               newOrderProduct.className = 'order-product';
               newOrderProduct.innerHTML = `
               <img src="${product.img}" class="order-product__img"></img>
               <div class="order-product__info">
                  <h5 class="order-product__name">${product.name}</h5>
                  <div class="order-product__cost">
                     <span class="order-product__price">$${product.price.toFixed(
                        2
                     )}</span>
                     <span class="order-product__multiplier">x</span>
                     <span class="order-product__amount">${
                        product.amount
                     }</span>
                     <span class="order-product__total-cost">$${(
                        product.price * product.amount
                     ).toFixed(2)}</span>
                  </div>
               </div>
               <div class="order-product__delete-btn">
                  <svg class="order-product__delete-btn-icon" width="14" height="16" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="M0 2.625V1.75C0 1.334.334 1 .75 1h3.5l.294-.584A.741.741 0 0 1 5.213 0h3.571a.75.75 0 0 1 .672.416L9.75 1h3.5c.416 0 .75.334.75.75v.875a.376.376 0 0 1-.375.375H.375A.376.376 0 0 1 0 2.625Zm13 1.75V14.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 1 14.5V4.375C1 4.169 1.169 4 1.375 4h11.25c.206 0 .375.169.375.375ZM4.5 6.5c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Z" id="a"/></defs><use  fill-rule="nonzero" xlink:href="#a"/></svg>
               </div>`;
            }
            updateTotalOrderProductAmount();
         };

         const updateTotalOrderProductAmount = () => {
            const orderProductAmountElement = $$('.order-product__amount');
            const totalOrderProductAmount = Array.from(
               orderProductAmountElement
            ).reduce((acc, item) => acc + Number(item.innerText), 0);
            const isEmpty = totalOrderProductAmount === 0;
            cartCount.querySelector('.cart__count-number').innerText =
               totalOrderProductAmount;

            cartContainer.classList.toggle('empty', isEmpty);
            cartCount.classList.toggle('d-none', isEmpty);
            cartBody.classList.toggle('d-none', isEmpty);
         };
         addToCartBtn.onclick = () => {
            const productContainer = $('.product');

            const productAmount = Number(inputElement.value);
            if (productAmount > 0) {
               const product = getProductInfo(productContainer);
               addToCart(product);
               inputElement.value = 0;
            }
         };
         updateTotalOrderProductAmount();

         const removeFromCart = (e) => {
            const deleteProductBtn = e.target.closest(
               '.order-product__delete-btn'
            );

            if (deleteProductBtn) {
               deleteProductBtn.closest('.order-product').remove();
               updateTotalOrderProductAmount();
            }
         };
         cartContainer.addEventListener('click', removeFromCart);
         // Add to cart end

         // Handle nav mobile start
         const navOpenMobileBtn = $('.nav-mobile-icon');
         const navCloseMobileBtn = $('.nav__mobile-close-btn');
         const nav = $('.nav');
         navOpenMobileBtn.onclick = () => {
            nav.classList.add('d-inline-flex');
            modal.classList.add('d-flex');
            $('.modal__body-close-btn').classList.add('d-none');
         };
         navCloseMobileBtn.onclick = () => {
            nav.classList.remove('d-inline-flex');
            modal.classList.remove('d-flex');
            $('.modal__body-close-btn').classList.remove('d-none');
         };
         // Handle nav mobile end

         // Responsive start
         const { nextBtn, prevBtn } = createControlBtn(productImgContainer);
         productImgContainer.appendChild(nextBtn);
         productImgContainer.appendChild(prevBtn);

         // Responsive end
      },
      init() {
         this.handleEvent();
      },
   };
})();

app.init();
