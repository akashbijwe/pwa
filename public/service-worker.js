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

//For Installation
let installPromptEvent;

window.addEventListener('beforeinstallprompt', (event) => {
  // Prevent Chrome <= 67 from automatically showing the prompt
  event.preventDefault();
  // Stash the event so it can be triggered later.
  installPromptEvent = event;
  // Update the install UI to notify the user app can be installed
  document.querySelector('#install-button').disabled = false;
});

btnInstall.addEventListener('click', () => {
  // Update the install UI to remove the install button
  document.querySelector('#install-button').disabled = true;
  // Show the modal add to home screen dialog
  installPromptEvent.prompt();
  // Wait for the user to respond to the prompt
  installPromptEvent.userChoice.then((choice) => {
    if (choice.outcome === 'accepted') {
      console.log('User accepted the A2HS prompt');
    } else {
      console.log('User dismissed the A2HS prompt');
    }
    // Clear the saved prompt since it can't be used again
    installPromptEvent = null;
  });
});