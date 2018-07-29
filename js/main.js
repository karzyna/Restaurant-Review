let restaurants, neighborhoods, cuisines;
var map, refreshing, markers = [];
document.addEventListener("DOMContentLoaded", e => {
    fetchNeighborhoods(), fetchCuisines()
}), fetchNeighborhoods = (() => {
    DBHelper.fetchNeighborhoods((e, t) => {
        e ? console.error(e) : (self.neighborhoods = t, fillNeighborhoodsHTML())
    })
}), fillNeighborhoodsHTML = ((e = self.neighborhoods) => {
    const t = document.getElementById("neighborhoods-select");
    e.forEach(e => {
        const r = document.createElement("option");
        r.innerHTML = e, r.value = e, t.append(r)
    })
}), fetchCuisines = (() => {
    DBHelper.fetchCuisines((e, t) => {
        e ? console.error(e) : (self.cuisines = t, fillCuisinesHTML())
    })
}), fillCuisinesHTML = ((e = self.cuisines) => {
    const t = document.getElementById("cuisines-select");
    e.forEach(e => {
        const r = document.createElement("option");
        r.innerHTML = e, r.value = e, t.append(r)
    })
}), window.initMap = (() => {
    self.map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: {
            lat: 40.722216,
            lng: -73.987501
        },
        scrollwheel: !1
    }), updateRestaurants()
}), window.setTimeout(() => {
    document.querySelectorAll("#map iframe").forEach(e => {
        e.setAttribute("title", "Google maps iframe")
    }), DBHelper.removeMapsTabOrder()
}, 1e3), updateRestaurants = (() => {
    const e = document.getElementById("cuisines-select"),
        t = document.getElementById("neighborhoods-select"),
        r = e.selectedIndex,
        n = t.selectedIndex,
        s = e[r].value,
        o = t[n].value;
    DBHelper.fetchRestaurantByCuisineAndNeighborhood(s, o, (e, t) => {
        e ? console.error(e) : (resetRestaurants(t), fillRestaurantsHTML())
    })
}), resetRestaurants = (e => {
    self.restaurants = [], document.getElementById("restaurants-list").innerHTML = "", self.markers.forEach(e => e.setMap(null)), self.markers = [], self.restaurants = e
}), fillRestaurantsHTML = ((e = self.restaurants) => {
    const t = document.getElementById("restaurants-list");
    if (0 == e.length) {
        const e = document.createElement("h2");
        e.append("No results"), e.setAttribute("id", "noResults"), t.append(e), t.setAttribute("role", "list")
    } else e.forEach(e => {
        t.append(createRestaurantHTML(e))
    }), addMarkersToMap();
    new LazyLoad
}), createRestaurantHTML = (e => {
    const t = document.createElement("li"),
        r = document.createElement("picture"),
        n = document.createElement("source");
    n.setAttribute("srcset", "/img/small_" + e.photograph + ".jp2 500w, /img/" + e.photograph + ".jp2 1000w "), n.setAttribute("type", "image/jp2"), r.append(n);
    const s = document.createElement("source");
    s.setAttribute("srcset", "/img/small_" + e.photograph + ".webp 500w, /img/" + e.photograph + ".webp 1000w "), s.setAttribute("type", "image/webp"), r.append(s);
    const o = document.createElement("img");
    o.className = "restaurant-img", o.setAttribute("data-src", "/img/" + e.photograph + ".jpg"), o.alt = DBHelper.altTextForRestaurant(e), r.append(o), t.append(r);
    const a = document.createElement("h2");
    a.innerHTML = e.name, t.append(a);
    const i = document.createElement("p");
    i.innerHTML = e.neighborhood, t.append(i);
    const l = document.createElement("p");
    l.innerHTML = e.address, t.append(l);
    const c = document.createElement("a");
    return c.innerHTML = "View Details", c.href = DBHelper.urlForRestaurant(e), t.append(c), t.setAttribute("role", "listitem"), t
}), addMarkersToMap = ((e = self.restaurants) => {
    e.forEach(e => {
        const t = DBHelper.mapMarkerForRestaurant(e, self.map);
        google.maps.event.addListener(t, "click", () => {
            window.location.href = t.url
        }), self.markers.push(t)
    })
}), navigator.serviceWorker.register("/sw.js").then(function (e) {
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