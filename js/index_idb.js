const dbPromise = idb.open("keyval-store", 1, e => {
    e.createObjectStore("objs", {
        keyPath: "id"
    })
});