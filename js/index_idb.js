  //KOPIOWANE
const dbPromise = idb.open("keyval-store", 1, upgradeDb => {
    switch (upgradeDb.oldVersion) {
        case 0:
            upgradeDb.createObjectStore("objs", {
                keyPath: "id"
            })
        case 1:
            const reviews = upgradeDb.createObjectStore('reviews', {
                keyPath: 'id'
            })
        reviews.createIndex('restaurant', 'restaurant_id');
    };
});