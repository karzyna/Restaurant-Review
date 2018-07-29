let restaurant;
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
    document.getElementById("restaurant-name").innerHTML = e.name, document.getElementById("restaurant-address").innerHTML = e.address;
    const t = document.getElementById("restaurant-img");
    t.className = "restaurant-img", t.srcset = "/img/small_" + e.photograph + ".jpg 500w, /img/" + e.photograph + ".jpg 1000w, ", t.src = DBHelper.imageUrlForRestaurant(e), t.alt = DBHelper.altTextForRestaurant(e), t.setAttribute("aria-label", "restaurant: " + e.name), document.getElementById("restaurant-cuisine").innerHTML = e.cuisine_type, e.operating_hours && fillRestaurantHoursHTML(), fillReviewsHTML()
}), fillRestaurantHoursHTML = ((e = self.restaurant.operating_hours) => {
    const t = document.getElementById("restaurant-hours");
    for (let r in e) {
        const n = document.createElement("tr"),
            a = document.createElement("td");
        a.innerHTML = r, n.appendChild(a);
        const o = document.createElement("td");
        o.innerHTML = e[r], n.appendChild(o), t.appendChild(n)
    }
}), fillReviewsHTML = ((e = self.restaurant.reviews) => {
    const t = document.getElementById("reviews-container"),
        r = document.createElement("h2");
    if (r.innerHTML = "Reviews", t.appendChild(r), !e) {
        const e = document.createElement("p");
        return e.innerHTML = "No reviews yet!", void t.appendChild(e)
    }
    const n = document.getElementById("reviews-list");
    e.forEach(e => {
        n.appendChild(createReviewHTML(e))
    }), t.appendChild(n)
}), createReviewHTML = (e => {
    const t = document.createElement("li"),
        r = document.createElement("p");
    r.innerHTML = e.name, t.appendChild(r);
    const n = document.createElement("p");
    n.innerHTML = e.date, t.appendChild(n);
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