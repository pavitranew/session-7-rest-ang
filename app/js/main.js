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

// 1 build the navbar dynamically from database

fetchLab( (content) => {
  const markup =
  `<ul>
  ${content.map(
    listItem => `<li><a href="#${listItem._id.$oid}">${listItem.title}</a></li>`
  ).join('')}
  </ul>`;
  navbar.innerHTML = markup;
})

// 2 set the content when the user navigates

function init() {
  // let newloc = location.hash.substr(1);
  fetchLab((content) => {
    let generatedContent = '';
    for (let i = 0; i < content.length; i++){
      generatedContent += `
        <div>
        <h2>${content[i].title}</h2>
        <img src="/img/recipes/${content[i].image}" />
        ${content[i].description}<span>X</span> 
        </div>
        `
    }
    siteWrap.innerHTML = generatedContent;
  })
}

// NEW function for getting data - uses fetch and promises

function fetchLab(callback) {
  fetch('https://api.mlab.com/api/1/databases/recipes-dd/collections/recipes?apiKey=oZ92RXFzah01L1xNSWAZWZrm4kn6zF0n')
  // .then( res => console.log(res) )
  .then( res => res.json() )
  // .then( res => console.log(res) )
  .then( data => callback(data) )
}

init();

window.addEventListener('scroll', fixNav);
// window.addEventListener('hashchange', navigate);