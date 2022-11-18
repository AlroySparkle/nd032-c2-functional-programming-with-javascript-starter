let store = {
    user: { name: "mars friends" },
    rovers: ['Curiosity', 'Opportunity', 'Spirit']
}

// add our markup to the page
const root = document.getElementById('root')


const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
    return Object.values(newState)[0]
}

const storePhotos=(store,images)=>{
	store= Object.assign(store,images)
}

const render = async(root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    let { rovers, apod } = state

    return `
        <header></header>
        <main>
            ${Greeting(store.user.name)}
			<p>Welcome to the dashboard of mars rovers, please feel free to view below rovers<br>
			<section>
				<div class="buttonContainer">
					<div class="roverButton" onClick='getNewestImages(0)'>Curiosity</div>
					<div class="roverButton" onClick='getNewestImages(1)'>Spirit</div>
					<div class="roverButton" onClick='getNewestImages(2)'>Opportunity</div>
				</div>
                <div id="roverInfo" class="roverInfo" >
                
                </div>
            </section>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
	getRoversData()
})

// ------------------------------------------------------  COMPONENTS

// This part used to print information related to the rover
const roverInfoPrint = async(index) => {
		
		const createImageGallery =(index)=>{
			images =store.rovers[index].images.map(
			(image) =>{return `<img src="${image}" class="roverImage" />`}
			).join('')
			return images
		}
		rover = store.rovers[index]
    document.getElementById("roverInfo").innerHTML = `rover "${rover.name}" has been launched in ${rover.launch_date}<br>
Rover's maximum solar days are ${rover.max_sol} and it has captured ${rover.total_photos} since landing date in ${rover.landing_date}<br>
rover's last images were in date ${rover.max_date} and it's current status is <b>${rover.status}</b><br>
rover "${rover.name}" has ${rover.cameras.length} cameras<br>
some of rover's images:<br><br><br>
<div class="roverPictures">
${createImageGallery(index)}
</div>
`
}


// ------------------------------------------------------  Controlling style

const resetClasses=()=>{
	const selectedButtons = document.getElementsByClassName("roverButtonSelected")
	if(selectedButtons.length==0){return}
	selectedButtons[0].classList.replace("roverButtonSelected","roverButton")
}

const setSelectedClass=(index)=>{
	const btn = document.getElementsByClassName("roverButton")[index].classList;
	btn.replace("roverButton","roverButtonSelected")
}

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}

// ------------------------------------------------------  API CALLS
// Responsible to update current rovers into fully detailed rovers data
const getRoversData = () => {
    fetch(`http://localhost:3000/rovers`)
        .then(res => res.json())
        .then(rovers => updateStore(store, rovers.rovers))
}

const getNewestImages = async(currentIndex) => {
	resetClasses()
	setSelectedClass(currentIndex)
    rovers = store.rovers	
	document.getElementById("roverInfo").innerHTML = `we are calling ${rovers[currentIndex].name}, please wait for it's response `;
		const promise = await fetch(`http://localhost:3000/rovers/${rovers[currentIndex].name}`)
			.then(res => res.json())
		storePhotos(rovers[currentIndex],{images:promise.pics.latest_photos.map(photo=>{return photo.img_src})})
		roverInfoPrint(currentIndex)
}