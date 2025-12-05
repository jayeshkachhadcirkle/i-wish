console.log('iWish Embed App script loaded...');


document.addEventListener('DOMContentLoaded', function () {
    // console.log('DOM is fully loaded and parsed!');

    // script for wishlist load on page load
    document.getElementById('wish-count').innerText = localStorage.getItem("likedProducts") && JSON.parse(localStorage.getItem("likedProducts")).length > 0 ? JSON.parse(localStorage.getItem("likedProducts")).length : '';
    if (window.shopCustomer.id != '') {
        fetch(`/apps/wishlist?action=getall`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "x-shopify-customer-id": window.shopCustomer.id,
                "x-shopify-store": Shopify.shop
            },
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => {
                console.log("Wishes On Load: ", data)
                let apiHandles = data.map(item => item.handle).reverse()

                let localWishes = localStorage.getItem('likedProducts');
                localStorage.setItem("likedProducts", JSON.stringify(apiHandles))
                window.dispatchEvent(new Event("wishlist-updated"));
            });

    }
});



// find if template variable is declared in global scope

if (typeof template === 'undefined') {
    let template = "not set";
}

// const template = "not set"

class MyLike extends HTMLElement {
    constructor() {
        super();
        let liked = JSON.parse(localStorage.getItem("likedProducts") || "[]");
        let handle = this.getElementsByClassName('pro-like')[0].getAttribute('handle');
        // console.log("is liked :", handle);
        this.getElementsByTagName('path')[0].setAttribute('fill', liked.includes(handle) ? 'red' : 'black');

    }
    connectedCallback() {
        let pro = this.closest('.product-widget');
        if (this._isBound) return;
        this._isBound = true;

        this.addEventListener('click', (e) => {
            const likeBtn = e.target.closest('.pro-like');
            if (!likeBtn) return;
            const handle = likeBtn.getAttribute('handle');
            let liked = JSON.parse(localStorage.getItem("likedProducts") || "[]");
            const path = likeBtn.querySelector('path');
            if (liked.includes(handle)) {
                path.setAttribute('fill', 'black');
                liked = liked.filter(h => h !== handle);
                if (template == 'page.wishlist') {
                    pro.remove();
                }
                this.removeToWish(handle);
            } else {
                path.setAttribute('fill', 'red');
                liked.push(handle);
                this.addToWish(handle);
            }
            document.getElementById('wish-count').innerText = liked.length || '';
            localStorage.setItem("likedProducts", JSON.stringify(liked));
            window.dispatchEvent(new Event("wishlist-updated"));
        });

        window.addEventListener("wishlist-updated", () => {
            this.refreshLikeStatus();
        });

    }

    refreshLikeStatus() {
        let liked = JSON.parse(localStorage.getItem("likedProducts") || "[]");
        const likeBtn = this.querySelector('.pro-like');
        const handle = likeBtn?.getAttribute('handle');
        const path = likeBtn?.querySelector('path');
        if (handle && path) {
            this.getElementsByTagName('path')[0].setAttribute('fill', liked.includes(handle) ? 'red' : 'black');
            document.getElementById('wish-count').innerText = liked.length || '';
        }
    }

    addToWish(handle) {
        if (window.shopCustomer.id != '') {
            fetch(`/apps/wishlist?action=add&handle=${handle}`, {
                "headers": {
                    "accept": "application/json",
                    "x-shopify-customer-id": window.shopCustomer.id || 'no-customer',
                    "x-shopify-store": Shopify.shop
                },
                "body": null,
                "method": "POST",
                "credentials": "include"
            }).then(res => res.text()).then(data => {
                console.log("Wish Added", data)
            })
        } else {
            console.log("Please Login to Save Wishlist");
        }
    }

    removeToWish(handle) {
        if (window.shopCustomer.id != '') {
            fetch(`/apps/wishlist?action=remove&handle=${handle}`, {
                "headers": {
                    "accept": "application/json",
                    "x-shopify-customer-id": window.shopCustomer.id || 'no-customer',
                    "x-shopify-store": Shopify.shop
                },
                "body": null,
                "method": "POST",
                "credentials": "include"
            }).then(res => res.json()).then(data => {
                console.log("Wish Removed", data)
            })
        } else {
            console.log("Please Login to Save Wishlist");
        }
    }

}
customElements.define("like-button", MyLike);