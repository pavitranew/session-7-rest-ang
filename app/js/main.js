const nav = document.getElementById('main');
const navbar = nav.querySelector('.navitems');
const siteWrap = document.querySelector('.site-wrap');

// fix the navigation to the top of the page

let topOfNav = nav.offsetTop;

function fixNav() {
  if(window.scrollY >= topOfNav) {
    document.body.style.paddingTop = nav.offsetHeight + 'px';
    document.body.classList.add('fixed-nav');
  } else {
    document.body.classList.remove('fixed-nav');0000001
    document.body.style.paddingTop = 0;
  }
}

// Show and hide the navigation

const logo = document.querySelector('.logo')

logo.addEventListener('click', showMenu);

function showMenu(e) {
  document.body.classList.toggle('show');
  const navLinks = document.querySelectorAll('.navitems a');
  navLinks.forEach(link => link.addEventListener('click', dump))
  e.preventDefault();
}

function dump(){
  document.body.classList.toggle('show');
}

// CONTENT

function init() {
  // let newloc = location.hash.substr(1);
  fetchLab((content) => {

    const markup =
    `<ul>
    ${content.map(
      listItem => `<li><a href="#${listItem._id.$oid}">${listItem.title}</a></li>`
    ).join('')}
    </ul>`;
    navbar.innerHTML = markup;

    let generatedContent = '';
    for (let i = 0; i < content.length; i++){
      generatedContent += `
        <div class="recipe-preview">
        <h2><a href="${content[i]._id}">${content[i].title}</a></h2>
        <img src="/img/recipes/${content[i].image}" />
        <p>${content[i].description}</p>
        <span onclick="deleteme('${content[i]._id}')">✖︎</span>
        </div>
        `
    }
    siteWrap.innerHTML = generatedContent;

    const newLinks = document.querySelectorAll('.site-wrap h2 a')
    console.log(newLinks)
    newLinks.forEach( link => link.addEventListener('click', detailme) )
  })
}

function detailme(){
  // console.log(this.getAttribute('href'))
  fetch('/api/recipes/' + this.getAttribute('href'), {
    method: 'get'
  })
  .then(res => res.json())
  .then(res => console.log(res))
  event.preventDefault();
}

// NEW function for getting data - uses fetch and promises

function fetchLab(callback) {
  // fetch('https://api.mlab.com/api/1/databases/recipes-dd/collections/recipes?apiKey=oZ92RXFzah01L1xNSWAZWZrm4kn6zF0n')
  fetch('/api/recipes')
  // .then( res => console.log(res) )
  .then( res => res.json() )
  // .then( res => console.log(res) )
  .then( data => callback(data) )
}

init();

window.addEventListener('scroll', fixNav);
// window.addEventListener('hashchange', navigate);

function deleteme(thingtodelete){
  fetch('/api/recipes/'+thingtodelete, {
    method: 'delete'
  })
  .then(init())
  .catch( () => console.log("error"))
}

