 let JsonArray = []
 let wpJSON;
 let myJson;
 let dest = document.querySelector(".data-container");
 let eventFilter = "Menu";
 document.addEventListener("DOMContentLoaded", hentJson);
 async function hentJson() {

     let myJsonMusik = await fetch("https://imkennykennedy.com/kea/2_semester/tema_7/huset/wordpress/wp-json/wp/v2/musikevent");
     wpJSON = await myJsonMusik.json()
     JsonArray = wpJSON;


     let myJsonAndre = await fetch("https://imkennykennedy.com/kea/2_semester/tema_7/huset/wordpress/wp-json/wp/v2/andreevent");
     wpJSON = await myJsonAndre.json()
     wpJSON.forEach(event => {
         JsonArray.push(event)
     })

     //JsonArray.push(myJsonAndre);


     let myJsonOrd = await fetch("https://imkennykennedy.com/kea/2_semester/tema_7/huset/wordpress/wp-json/wp/v2/ordevent");
     wpJSON = await myJsonOrd.json()
     wpJSON.forEach(event => {
         JsonArray.push(event)
     })

     let myJsonFilm = await fetch("https://imkennykennedy.com/kea/2_semester/tema_7/huset/wordpress/wp-json/wp/v2/filmevent");
     wpJSON = await myJsonFilm.json()
     wpJSON.forEach(event => {
         JsonArray.push(event)
     })

     let myJsonScene = await fetch("https://imkennykennedy.com/kea/2_semester/tema_7/huset/wordpress/wp-json/wp/v2/sceneevent");
     wpJSON = await myJsonScene.json();
     wpJSON.forEach(event => {
         JsonArray.push(event)
     })
     console.log(JsonArray)
     visJson();
 }


 function visJson() {
     let myTemplate = document.querySelector(".data-template");

     JsonArray.forEach(post => {
         let klon = myTemplate.cloneNode(true).content;
         klon.querySelector(".data-dato").textContent = post.acf.dato;
         klon.querySelector(".data-tid").textContent = "Kl. " + post.acf.tid;
         klon.querySelector(".data-title").textContent = post.acf.title;
         klon.querySelector(".data-sted").textContent = post.acf.sted;
         klon.querySelector(".data-billede").src = post.acf.billede;



         // Lang og kort beskrivelse Start

         /* klon.querySelector("[data-kort-beskrivelse]").textContent = post.acf.kort_beskrivelse;

          klon.querySelector("[data-lang-beskrivelse").textContent = post.acf.beskrivelse;

          */


         // Lang og kort beskrivelse Slut

         klon.querySelector(".data-pris").textContent = post.acf.pris + ",-";
         klon.querySelector(".post-container").addEventListener("click", () => {
             window.location.href = "singleview.html?id=" + post.id;
         });

         dest.appendChild(klon);
     })
 }



 function goBack() {
     window.history.back();
 }
