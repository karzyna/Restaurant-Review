let restaurant;
let reviews;
var map, refreshing;
window.initMap = (() => {
    fetchRestaurantFromURL((e, t) => {
        e ? console.error(e) : (self.map = new google.maps.Map(document.getElementById("map"), {
            zoom: 16,
            center: t.latlng,
            scrollwheel: !1
        }), fillBreadcrumb(), DBHelper.mapMarkerForRestaurant(self.restaurant, self.map))
    })
}), fetchRestaurantFromURL = (e => {
    if (self.restaurant) return void e(null, self.restaurant);
    const t = getParameterByName("id");
    t ? DBHelper.fetchRestaurantById(t, (t, r) => {
        self.restaurant = r, r ? (fillRestaurantHTML(), e(null, r)) : console.error(t) 
    }) : (error = "No restaurant id in URL", e(error, null))
}), fillRestaurantHTML = ((e = self.restaurant) => {
    document.getElementById("restaurant-name").innerHTML = e.name, 
    document.getElementById("restaurant-address").innerHTML = e.address;


    const s = document.getElementById("restaurant-img");
    s.className = "restaurant-img", s.srcset = "/img/small_" + e.photograph + ".jpg 500w, /img/" + e.photograph + ".jpg 1000w, ", 
    s.src = DBHelper.imageUrlForRestaurant(e), 
    s.alt = DBHelper.altTextForRestaurant(e), 
    s.setAttribute("aria-label", "restaurant: " + e.name), 
    document.getElementById("restaurant-cuisine").innerHTML = e.cuisine_type,
     e.operating_hours && fillRestaurantHoursHTML(), favRestaurant()


    // kopiowane
    DBHelper.fetchReviewsByRestaurantId(e.id, (error, reviews) => {
        self.reviews = reviews;
        if (!reviews) {
            console.error(error);
            return;
        }
        fillReviewsHTML();
    });

    //  , fetchReviews() //createReviewsForm(),
}), // modyfikowane, z main.js
    favRestaurant = ((e= self.restaurant)  => {
        console.log(e);
        console.log("id: ", e.id, "isfav: ", e.is_favorite);
        const b = document.getElementsByClassName('wrapper')[0];
        b.classList.add('overlay');
        const g = document.getElementsByTagName('span');
        g.innerHTML = 'Add to your favorites';
        
        if(e.is_favorite) {
            b.classList.remove('overlay')
            g.innerHTML = '';
            b.classList.add('favourite');
        } else {
            g.innerHTML = 'Add to your favorites';
            b.classList.add('overlay');
        }
        
        b.onclick =  function() {
            this.classList.toggle('overlay');

            if (this.classList.toggle('favourite')){
                this.getElementsByTagName('span')[0].innerHTML = '';
            }
            else {
                this.getElementsByTagName('span')[0].innerHTML= 'Add to your favourites';
            }
            
            const isFavNow = !e.is_favorite;
            DBHelper.updateFavouriteStatus(e.id, isFavNow);
            e.is_favorite = !e.is_favorite
        }
    }
),
    //kopiowane 
    addReview = (event) => {
        event.preventDefault();
        console.log("cickcick")
        let restaurantId = getParameterByName('id');
        let name = document.getElementById('review-author').value;
        let rating;
        let opinion = document.getElementById('review-opinion').value;
        rating = document.querySelector('#rating_select option:checked').value;
        const review = [name, rating, opinion, restaurantId];
        console.log(review);
        const frontEndReview = {
            restaurant_id: parseInt(review[3]),
            rating: parseInt(review[1]),
            name: review[0],
            opinion: review[2].substring(0, 300),
            createdAt: new Date()
        };
        console.log("log", frontEndReview);
        DBHelper.addReview(frontEndReview);
        createReviewHTML(frontEndReview);
        document.getElementById('review-form').reset();
    },
    // kopiowane
    createReviewHTML = (review) => {
        const li = document.createElement('li'); 
       if (!navigator.onLine) {
        const connection_status = document.createElement('p');
        connection_status.classtist.add('offLine_label')
        connection_status.innerHTML = "Offline"
        li.classList.add("reviews_offline")
        li.appendChild(connection_status);
       }
       const name = document.createElement('p');
       name.innerHTML = `Name: ${review.name}`;
       li.appendChild(name); 
       
       const date = document.createElement('p');
       date.innerHTML = `Date: ${new Date(review.createdAt).toLocaleString()}`;
       li.appendChild(date); 
       
       const rating = document.createElement('p');
       rating.innerHTML = `Rating: ${review.rating}`;
       li.appendChild(rating); 
       
       const opinion = document.createElement('p');
       opinion.innerHTML = review.opinion;
       li.appendChild(opinion);
       return li; 
    },
       

  fillRestaurantHoursHTML = ((e = self.restaurant.operating_hours) => {
    const t = document.getElementById("restaurant-hours");
    for (let r in e) {
        const n = document.createElement("tr"),
            a = document.createElement("td");
        a.innerHTML = r, n.appendChild(a);
        const o = document.createElement("td");
        o.innerHTML = e[r], n.appendChild(o), t.appendChild(n)
    }
}), fillReviewsHTML = ((e = self.reviews) => {
    console.log(e);
    const t = document.getElementById("reviews-container"),
        r = document.createElement("h2");
    if (r.innerHTML = "Reviews", t.appendChild(r), !e) {
        const e = document.createElement("p");
        return e.innerHTML = "No reviews yet!", void t.append(e)
    }
    const n = document.getElementById("reviews-list");
    e.forEach(e => {
        n.appendChild(createReviewHTML(e))
    }), t.appendChild(n)
}),// createReviewsForm = ((e = this.restaurant) => {
    //     const form = document.getElementById("commentForm");
    //     console.log(form);
    //     const restId = document.createElement("input");
    //     restId.innerHTML=`<type='text' value=${e.id} "`; //style="display:none;
    //     form.appendChild(restId);
    //     const nameInput = document.createElement("input");
    //     nameInput.setAttribute('type', 'text');
    //     nameInput.setAttribute('name', 'name');
    //     nameInput.setAttribute('required', 'required');
    //     form.appendChild(nameInput);
    //     return form;
    //  }), 


 createReviewHTML = (e => {
    const t = document.createElement("li"),
        r = document.createElement("p");
    r.innerHTML = e.name, t.appendChild(r);
    const n = document.createElement("p");

    console.log("review", e);
    n.innerHTML = e.createdAt, t.appendChild(n);
    const a = document.createElement("p");
    a.innerHTML = `RATING: ${e.rating}`, t.appendChild(a);
    const o = document.createElement("p");
    return o.innerHTML = e.comments, t.appendChild(o), t
}), fillBreadcrumb = ((e = self.restaurant) => {
    const t = document.getElementById("breadcrumb"),
        r = document.createElement("li");
    r.innerHTML = e.name, r.setAttribute("aria-current", "page"), t.appendChild(r)
}), getParameterByName = ((e, t) => {
    t || (t = window.location.href), e = e.replace(/[\[\]]/g, "\\$&");
    const r = new RegExp(`[?&]${e}(=([^&#]*)|&|#|$)`).exec(t);
    return r ? r[2] ? decodeURIComponent(r[2].replace(/\+/g, " ")) : "" : null
}), window.setTimeout(() => {
    document.querySelectorAll("#map iframe").forEach(e => {
        e.setAttribute("title", "Google maps iframe")
    }), DBHelper.removeMapsTabOrder()
}, 1e3), navigator.serviceWorker.register("/sw.js").then(function (e) {
    console.log("Registration worked."), navigator.serviceWorker.controller && (e.waiting && navigator.serviceWorker.controller.postMessage({
        action: "skipWaiting"
    }), e.installing && navigator.serviceWorker.addEventListener("statechange", function () {
        "installed" == navigator.serviceWorker.controller.state && navigator.serviceWorker.controller.postMessage({
            action: "skipWaiting"
        })
    }), e.addEventListener("updatefound", function () {
        navigator.serviceWorker.addEventListener("statechange", function () {
            "installed" == navigator.serviceWorker.controller.state && navigator.serviceWorker.controller.postMessage({
                action: "skipWaiting"
            })
        })
    }))
}).catch(function () {
    console.log("Registration failed")
}), navigator.serviceWorker.addEventListener("controllerchange", function () {
    refreshing || (window.location.reload(), refreshing = !0)
});

const toggle_map = () => {
    console.log("toggle")
    if (document.getElementById('map').style.display === 'none') {
      document.getElementById('map').style.display = 'block';
      document.getElementById('collapsible').style.display =" none";
    } else {
      document.getElementById('map').style.display = 'none'
    }
    
}