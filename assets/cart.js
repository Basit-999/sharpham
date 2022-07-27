class CartRemoveButton extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('click', (event) => {
      event.preventDefault();
      this.closest('cart-items').updateQuantity(this.dataset.index, 0);
    });
  }
}
customElements.define('cart-remove-button', CartRemoveButton);
class CartItems extends HTMLElement {
  constructor() {
    super();
    this.lineItemStatusElement = document.getElementById('shopping-cart-line-item-status');
    this.currentItemCount = Array.from(this.querySelectorAll('[name="updates[]"]'))
        .reduce((total, quantityInput) => total + parseInt(quantityInput.value), 0);
    this.debouncedOnChange = debounce((event) => {
      this.onChange(event);
    }, 300);
    this.addEventListener('change', this.debouncedOnChange.bind(this));
  }
  onChange(event) {
    this.updateQuantity(event.target.dataset.index, event.target.value, document.activeElement.getAttribute('name'));
  }
  getSectionsToRender() {
    return [
      {
        id: 'main-cart-items',
        section: document.getElementById('main-cart-items').dataset.id,
        selector: '.js-contents',
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section'
      },
      {
        id: 'cart-live-region-text',
        section: 'cart-live-region-text',
        selector: '.shopify-section'
      },
      {
        id: 'main-cart-footer',
        section: document.getElementById('main-cart-footer').dataset.id,
        selector: '.js-contents',
      }
    ];
  }
  updateQuantity(line, quantity, name) {
  
    this.enableLoading(line);
    var isTour = false;
    if ($(".cart_product_json")[0]) {
      var availability = $(".cart_product_json").text();
      availability = JSON.parse(availability);
      let start_date = $(".cart_product_json").data('start');
      let end_date = $(".cart_product_json").data('end');
      let id = $(".cart_product_json").data('id');
      var available = 0;
      
      for(var i=0; i < availability.length; i++){
        if(start_date === availability[i].start){
          available = availability[i].Available;
          $("#Quantity-" + line + "").attr('max', available);
          break
        }
      }
      
      if (id == line) {
        isTour = true;
        quantity = parseInt(quantity);
        available = parseInt(available);
        if (quantity > available) {
          quantity = available;
          $("#Quantity-" + line + "").val(available);
        }
      }
    }
    
    let body = {
      line,
      quantity,
      sections: this.getSectionsToRender().map((section) => section.section),
      sections_url: window.location.pathname
    }
    
    if (isTour) {
      var properties = $(".cart_product_properties").text();
      properties = JSON.parse(properties);
      var props = {};
      properties.map(item => {
        props[item[0]] = item[1]
      })
      
      props.Persons = `${quantity} Adults`
      body.properties = props
    }
    body = JSON.stringify(body)
    
    fetch(`${routes.cart_change_url}`, {...fetchConfig(), ...{ body }})
        .then((response) => {
          return response.text();
        })
        .then((state) => {
          const parsedState = JSON.parse(state);
          this.classList.toggle('is-empty', parsedState.item_count === 0);
          const cartFooter = document.getElementById('main-cart-footer');
          if (cartFooter) cartFooter.classList.toggle('is-empty', parsedState.item_count === 0);
          this.getSectionsToRender().forEach((section => {
            const elementToReplace =
                document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);
            elementToReplace.innerHTML =
                this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);
          }));

          var cart_items = $(".cart_items_json").text();
          cart_items = JSON.parse(cart_items);
          let found = false
          cart_items.map(item => {
            if(item.product_type !== 'Tour' and item.product_type !== 'voucher'){
              found = true
            }
          })
          
          if(!found){
            $(".terms_and_conditions").remove();
            $("#checkout").removeClass('notAllowed');
          }
          
          this.updateLiveRegions(line, parsedState.item_count);
          const lineItem =  document.getElementById(`CartItem-${line}`);
          if (lineItem && lineItem.querySelector(`[name="${name}"]`)) lineItem.querySelector(`[name="${name}"]`).focus();
          this.disableLoading();
        }).catch(() => {
      this.querySelectorAll('.loading-overlay').forEach((overlay) => overlay.classList.add('hidden'));
      document.getElementById('cart-errors').textContent = window.cartStrings.error;
      this.disableLoading();
    });
  }
  updateLiveRegions(line, itemCount) {
    if (this.currentItemCount === itemCount) {
      document.getElementById(`Line-item-error-${line}`)
          .querySelector('.cart-item__error-text')
          .innerHTML = window.cartStrings.quantityError.replace(
          '[quantity]',
          document.getElementById(`Quantity-${line}`).value
      );
    }
    this.currentItemCount = itemCount;
    this.lineItemStatusElement.setAttribute('aria-hidden', true);
    const cartStatus = document.getElementById('cart-live-region-text');
    cartStatus.setAttribute('aria-hidden', false);
    setTimeout(() => {
      cartStatus.setAttribute('aria-hidden', true);
    }, 1000);
  }
  getSectionInnerHTML(html, selector) {
    return new DOMParser()
        .parseFromString(html, 'text/html')
        .querySelector(selector).innerHTML;
  }
  enableLoading(line) {
    document.getElementById('main-cart-items').classList.add('cart__items--disabled');
    this.querySelectorAll(`#CartItem-${line} .loading-overlay`).forEach((overlay) => overlay.classList.remove('hidden'));
    document.activeElement.blur();
    this.lineItemStatusElement.setAttribute('aria-hidden', false);
  }
  disableLoading() {
    document.getElementById('main-cart-items').classList.remove('cart__items--disabled');
  }
}
customElements.define('cart-items', CartItems);