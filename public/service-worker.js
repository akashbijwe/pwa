console.log('sw');

const STATIC_CACHE = "1.1";
const DYNAMIC_CACHE = "1.1";

var urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/scripts/material.min.js',
    '/offline.html',
    '/images/offline.gif'
  ];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
        .then((cache) => {
            console.log('cache opened...');
            return cache.addAll(urlsToCache);
        })
    )
})

/* getting the pages up offline 
self.addEventListener('fetch',(event) => {
    event.respondWith(
        caches.match(event.request)
        .then((response)=> {
            if(response){
                return response;
            }
            return fetch(event.request);
        })
    )
})
*/

self.addEventListener('fetch',(event) => {
    event.respondWith(
        caches.match(event.request)
        .then((response)=> {
            if(response){
                return response;
            }
            else{
                return fetch(event.request)
                .then((response) => {
                    return response;
                })
            }
        }).catch((err)=>{
            return caches.open(STATIC_CACHE)
            .then(function(cache){
            return cache.match('/offline.html');
          })
        })
    )
})

// self.addEventListener('fetch', function(e) {
//     var request = e.request;
//       e.respondWith(
//         fetch(request)
//         .then(function(res){
//         return caches.open(DYNAMIC_CACHE)
//           .then(function(cache){
//             cache.put(request.url, res.clone());
//             return res;
//           })
//       })
//      .catch(function(err){
//         return caches.match(request);
        
//         })
//    )
//   }) 
