let store = {
    user: { name: "mars friends" },
    rovers: ['Curiosity', 'Opportunity', 'Spirit']
}

// add our markup to the page
const root = document.getElementById('root')

let immutable = Immutable.Map({test:"test"})

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
    return Object.values(newState)[0]
}

const updateDate = (newDate) =>{
	store = Object.assign(store,{date:newDate})
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
	date = new Date()
	updateDate(date)
	getRoversData()
})

// ------------------------------------------------------  COMPONENTS



// This part used to print information related to the rover


const createDataOfRoverImages = (index) =>{	
		const createImageGallery =(index)=>{
			return store.rovers[index].images.toJS().map(
			(image) =>{return `<img src="${image}" class="roverImage" />`}
			).join('')
		}
		rover = store.rovers[index]
    return `rover "${rover.name}" has been launched in ${rover.launch_date}<br>
Rover's maximum solar days are ${rover.max_sol} and it has captured ${rover.total_photos} since landing date in ${rover.landing_date}<br>
rover's last images were in date ${rover.max_date} and it's current status is <b>${rover.status}</b><br>
rover "${rover.name}" has ${rover.cameras.length} cameras<br>
some of rover's images:<br><br><br>
<div class="roverPictures">
${createImageGallery(index)}
</div>
`
}


const roverInfoPrint = (index) => {
		document.getElementById("roverInfo").innerHTML = createDataOfRoverImages(index)
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
    const rovers = store.rovers
	const date = new Date();
	//in case images is created for first time it will call the API and save it in immutable in case  
	//it could reduce the number of calls to API which will reduce as well risk of reaching max call
	//date is to ensure that images revealed in the same day for any chance of new images with new day
	if(store.rovers[currentIndex].images==undefined || date.getDay()!=store.date.getDay()){	
	document.getElementById("roverInfo").innerHTML = `we are calling ${rovers[currentIndex].name}, please wait for it's response `;
		const promise = await fetch(`http://localhost:3000/rovers/${rovers[currentIndex].name}`)
			.then(res => res.json())
		storePhotos(rovers[currentIndex],{images:Immutable.List(promise.pics.latest_photos.map(photo=>{return photo.img_src}))})
roverInfoPrint(currentIndex)
updateDate(date)
}
else{
document.getElementById("roverInfo").innerHTML = createDataOfRoverImages(currentIndex)
}
}