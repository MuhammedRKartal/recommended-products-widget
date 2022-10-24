import data from "./mock/product-list.json"
import './index.scss'
import './styles/product/index.scss'
import './styles/popup/index.scss'
import './styles/slider/index.scss'
import './styles/tabs/index.scss'
import './styles/recommendedProducts/index.scss'


class HomeJS {
    constructor(){
        this.tabsSection = document.querySelector(".js-tabs-section"); 
        this.tabContentsSection = document.querySelector('.js-tab-contents-section');

        this.clearData = data.responses[0][0].params;
        this.categories = this.clearData.categories;
        this.recommendedProducts = this.clearData.recommendedProducts;

        this.fillTabTitles();
        this.createTabContents();

        this.tabs = document.querySelectorAll('.js-tab-links')
        this.tabContents = this.tabContentsSection.querySelectorAll('.js-tab-content');
        this.currentVisibleContent;

        this.fillTabContents();
        this.handleTabs();
        this.handleDefaultTabOnLoad();

        this.prevButton = document.querySelector('.js-prev-button');
        this.nextButton = document.querySelector('.js-next-button');

        this.product;
        this.setCurrentSliderVariables();
        this.createSliderButtons();    
        
    }

    fillTabTitles() {
        const categories = this.clearData.userCategories;

        this.tabsSection.innerHTML = `
            ${categories.map((category)=>{
                const categoryName = category.split('>')[0];
                return `<div class="tabs__links js-tab-links" data-tabName="${category}">${categoryName}</div>`
            }).join('')} 
        `
    }
    
    createTabContents() {
        const categories = this.clearData.userCategories;

        this.tabContentsSection.innerHTML = `
            <button class="slide-arrow slide-arrow__prev js-prev-button">
                &#8249;
            </button>
            <button class="slide-arrow slide-arrow__next js-next-button">
                &#8250;
            </button>
            ${categories.map((category)=>{
                return `<div id="${category}" class="tab-contents__container js-tab-content"></div>`
            }).join('')}
        `
    }

    fillTabContents() {
        const recommendedProducts = this.clearData.recommendedProducts;
        
        const textReducer = (text) =>{
            if(text.split('').length > 45){
                text = text.substring(0,42) + "..."
                return text
            }
            return text
        }
        
        this.tabContents.forEach((tab)=>{
            const products = recommendedProducts[tab.id]

            tab.innerHTML = products.map((product)=>{
                return `
                <div class="product" key=${product.productId}>
                    <img class="product-image" src='${product.image}' loading="lazy" alt="${product.name}">
                    <div class="product-body">
                        <div class="product-body__name">${textReducer(product.name)}</div>
                        <div class="product-body__price">${product.priceText}</div>
                        ${product.params.shippingFee.toLowerCase() === "free" ? 
                            `<div class="product-body__shipping">
                                ${window.screen.width < 992 ? `<span>*</span>`: `<i class="fa-solid fa-truck"></i>`}
                                <span>Ücretsiz Kargo</span>
                            </div>` : '<div class="product-body__shipping"></div>'}
                        ${window.screen.width < 992 ? 
                            `<div class="product-body__add-to-chart js-add-to-chart">
                                Sepete Ekle
                            </div>` : ''}
                    </div>
                </div>`
            }).join('')
        })

        document.querySelectorAll('.js-add-to-chart').forEach((btn)=>{
            btn.addEventListener('click', (e)=>{
                let addedToBasket = document.querySelector('.js-added-to-basket-popup');
                if(addedToBasket){
                    document.body.removeChild(addedToBasket)
                }
                document.body.appendChild(this.addedToBasket());

                addedToBasket = document.querySelector('.js-added-to-basket-popup');
                document.querySelector('.js-remove-added-to-basket-popup').addEventListener('click', ()=>{
                    document.body.removeChild(addedToBasket)
                })
            })

            
        })
        
    }
 
    handleDefaultTabOnLoad() {
        this.tabs[0].classList.add('-tab-link-focused');
        this.tabContents[0].classList.add('-tab-content-visible');
    }

    hideContents() {
        this.tabContents.forEach((content) => {
            content.classList.remove('-tab-content-visible');
        })

        this.tabs.forEach((tab)=>{
            tab.classList.remove('-tab-link-focused');
        })
    }

    handleTabs() {
        this.tabs.forEach((tab)=>{
            const tabName = tab.getAttribute('data-tabName');

            tab.addEventListener('click', () => {
                const visibleTabContent = document.getElementById(tabName);

                this.hideContents();
                visibleTabContent.classList.add('-tab-content-visible');
                tab.classList.add('-tab-link-focused');
                this.setCurrentSliderVariables();
            })
        })
       
    }

    setCurrentSliderVariables() {
        this.currentVisibleContent = Object.values(this.tabContents).find((tab)=>tab.classList.contains('-tab-content-visible'));
        this.product = this.currentVisibleContent.querySelector('.product');

        if(this.currentVisibleContent.scrollLeft === 0) this.prevButton.disabled = true;
        else this.prevButton.disabled = false;

        if(this.currentVisibleContent.scrollLeft >= this.currentVisibleContent.scrollWidth-this.currentVisibleContent.offsetWidth) this.nextButton.disabled = true;
        else this.nextButton.disabled = false;

        this.currentVisibleContent.addEventListener("scroll", e => {
            if(this.currentVisibleContent.scrollLeft <= 0) this.prevButton.disabled = true;
            else this.prevButton.disabled = false;

            if(this.currentVisibleContent.scrollLeft >= this.currentVisibleContent.scrollWidth-this.currentVisibleContent.offsetWidth) this.nextButton.disabled = true;
            else this.nextButton.disabled = false;
        })
        
    }

    createSliderButtons(){
        const onClickEvent= (isNext) => {
            const slideWidth = this.product.clientWidth*2;

            if(isNext) this.currentVisibleContent.scrollLeft += slideWidth;
            else this.currentVisibleContent.scrollLeft -= slideWidth;

            this.nextButton.classList.add('-disable-pointer-events');
            this.prevButton.classList.add('-disable-pointer-events');

            setTimeout(()=>{
                this.nextButton.classList.remove('-disable-pointer-events');
                this.prevButton.classList.remove('-disable-pointer-events');
            },500)
        }

        this.nextButton.addEventListener("click", ()=> onClickEvent(true));
        this.prevButton.addEventListener("click", ()=> onClickEvent(false));
    }

    addedToBasket(){
        const addedPopUp = document.createElement("div");
        addedPopUp.classList.add('added-div', "js-added-to-basket-popup");
        addedPopUp.innerHTML = `
            <div class="added-div__left">
                <div class="added-div__left-icon"><i class="fa-solid fa-circle-check"></i></div>
                <div class="added-div__left-text">
                    <span class="add">Ürün sepete eklendi.</span>
                    <a class="goToBasket" href="#">Sepete git</a>
                </div>
            </div>
            <div class="added-div__right js-remove-added-to-basket-popup"><i class="fa-solid fa-xmark"></i></div>
        `
        return addedPopUp
    }
}

new HomeJS()