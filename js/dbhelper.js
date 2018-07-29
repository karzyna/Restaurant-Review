class DBHelper {
    static get DATABASE_URL() {
        return `http://localhost:${1337}/restaurants`
    }
    static fetchRestaurants(a) {
        fetch(DBHelper.DATABASE_URL).then(function (b) {
            if (!b.ok) {
                dbPromise.then(d => {
                    return d.transaction('objs').objectStore('objs').get('restaurant_list')
                }).then(d => a(null, d.data))
            }
            return b.json()
        }).then(function (b) {
            dbPromise.then(c => {
                const d = c.transaction('objs', 'readwrite');
                return d.objectStore('objs').put({
                    id: 'restaurant_list',
                    data: b
                }), d.complete
            }), a(null, b)
        }).catch(() => {
            dbPromise.then(d => {
                return d.transaction('objs').objectStore('objs').get('restaurant_list')
            }).then(d => a(null, d.data))
        })
    }
    static fetchRestaurantById(a, b) {
        DBHelper.fetchRestaurants((c, d) => {
            if (c) b(c, null);
            else {
                const f = d.find(g => g.id == a);
                f ? b(null, f) : b('Restaurant does not exist', null)
            }
        })
    }
    static fetchRestaurantByCuisine(a, b) {
        DBHelper.fetchRestaurants((c, d) => {
            if (c) b(c, null);
            else {
                const f = d.filter(g => g.cuisine_type == a);
                b(null, f)
            }
        })
    }
    static fetchRestaurantByNeighborhood(a, b) {
        DBHelper.fetchRestaurants((c, d) => {
            if (c) b(c, null);
            else {
                const f = d.filter(g => g.neighborhood == a);
                b(null, f)
            }
        })
    }
    static fetchRestaurantByCuisineAndNeighborhood(a, b, c) {
        DBHelper.fetchRestaurants((d, f) => {
            if (d) c(d, null);
            else {
                let g = f;
                'all' != a && (g = g.filter(h => h.cuisine_type == a)), 'all' != b && (g = g.filter(h => h.neighborhood == b)), c(null, g)
            }
        })
    }
    static fetchNeighborhoods(a) {
        DBHelper.fetchRestaurants((b, c) => {
            if (b) a(b, null);
            else {
                const d = c.map((g, h) => c[h].neighborhood),
                    f = d.filter((g, h) => d.indexOf(g) == h);
                a(null, f)
            }
        })
    }
    static fetchCuisines(a) {
        DBHelper.fetchRestaurants((b, c) => {
            if (b) a(b, null);
            else {
                const d = c.map((g, h) => c[h].cuisine_type),
                    f = d.filter((g, h) => d.indexOf(g) == h);
                a(null, f)
            }
        })
    }
    static urlForRestaurant(a) {
        return `./restaurant.html?id=${a.id}`
    }
    static imageUrlForRestaurant(a) {
        return `/img/${a.photograph}.jpg`
    }
    static altTextForRestaurant(a) {
        return `${a.name} Restaurant`
    }
    static mapMarkerForRestaurant(a, b) {
        const c = new google.maps.Marker({
            position: a.latlng,
            title: a.name,
            url: DBHelper.urlForRestaurant(a),
            map: b,
            animation: google.maps.Animation.DROP
        });
        return c
    }
    static removeMapsTabOrder() {
        document.querySelectorAll('#map div, #map iframe, #map area, #map a, #map button').forEach(a => {
            a.setAttribute('tabindex', '-1')
        })
    }
}