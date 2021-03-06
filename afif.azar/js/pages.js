
const ListPage = async(d=0) => {

	if (!d) d = await query({
		type:"animals_by_user_id",
		params:[sessionStorage.userId]
	})



	$("#list-page .animallist").html(
			d.result.length ?
			makeAnimalList(d.result) :
			"Add unicorns first"
		);
    


    $("#list-page .list-filters").html(listFilters(d.result));


	$("list-add-form .inputs").html(makeAnimalProfileInputs({
		name:'',
		type:'',
		trait:'',
		description:'',
	}))
}



const RecentPage = async(d=0) => {
	if (!d) d = await query({
		type:"recent_locations",
		params:[sessionStorage.userId]});

	let map_el = await makeMap("#recent-page .map");

	let valid_animals = d.result.reduce((r,o)=>{
		o.icon = o.img;
		if(o.lat && o.lng) r.push(o);
		return r;
	},[]);

	makeMarkers(map_el,valid_animals);

	map_el.data("markers").forEach((o,i)=>{
		o.addListener("click",function(){
			// INFOWINDOW EXAMPLE
			map_el.data("infoWindow").open(map_el.data("map"),o);
			map_el.data("infoWindow").setContent(makeRecentProfile(valid_animals[i]))

			// SIMPLE NAVIGATION
			// sessionStorage.animalId = valid_animals[i].animal_id;
			// $.mobile.navigate("#animal-profile-page");

			//DRAWER EXAMPLE
			//$("#recent-profile-drawer")
			//.toggle
			//.find(".modal-body").html(makeRecentProfile(valid_animals[i]))
		})
	});
}

const ProfilePage = async() => {
	let user = await query({type:"user_by_id",params:[sessionStorage.userId]});
	let animals = await query({type:"animals_by_user_id",params:[sessionStorage.userId]});
	let locations = await query({type:"locations_by_user_id",params:[sessionStorage.userId]});

	$("#profile-page .profile")
		.html(makeUserProfile(user.result[0],animals.result,locations.result));
}

const AnimalProfilePage = async() => {
	if(sessionStorage.animalId===undefined) throw("No animal ID in Storage");

	let animal = await query({type:"animal_by_id",params:[sessionStorage.animalId]})
	let locations = await query({type:"locations_by_animal_id",params:[sessionStorage.animalId]})
	
	$("#animal-profile-page h1").html(animal.result[0].name)

	$("#animal-profile-page .profile-head").removeClass("active")
		.html(makeAnimalProfile(animal.result[0],locations.result));

	let map_el = await makeMap("#animal-profile-page .map");

	makeMarkers(map_el,locations.result);
}



const SettingsProfilePage = async() => {
	let d = await query({
		type:"user_by_id",
		params:[sessionStorage.userId]
	});

	$("settings-profile-id").val(sessionStorage.userId);
	$("#settings-profile-page .inputs")
		.html(makeSettingsProfileInputs(d.result[0]));
}

const SettingsAnimalProfilePage = async() => {
	let d = await query({
		type:"animal_by_id",
		params:[sessionStorage.animalId]
	});


    $("settings-animal-profile-id").val(sessionStorage.animalId);
	$("#settings-animal-profile-page .inputs")
		.html(makeSettingsAnimalProfileInputs(d.result[0],'settings-animal-profile'));
}


const AddLocationPage = async() => {
	let map_el = await makeMap("#add-location-page .map");

	map_el.data("map").addListener("click",function(e) {
		$("#add-location-lat").val(e.latLng.lat())
		$("#add-location-lng").val(e.latLng.lng())
		makeMarkers(map_el,[{
			lat:e.latLng.lat(),
			lng:e.latLng.lng(),
			icon:'https://via.placeholder.com/40?text=PIN'
		}])
	})
}



const SettingsProfileUploadPage = async() => {
	let d = await query({type:"user_by_id",params:[sessionStorage.userId]});

	$("#settings-profile-upload-form .image-uploader")
		.css('background-image',`url('${d.result[0].img}')`);
}

const ChooseAnimalPage = async () => {
	let animals = await query({type:'animals_by_user_id',params:[sessionStorage.userId]});

	$("#add-location-animal-id").html(makeSelectOptions(animals.result.map(o=>([o.id,o.name]))));
}

const AddAnimalPage = async(d=0) => {
	$("#add-animal-form .inputs").html(makeAnimalProfileInputs({
		name:'',
		type:'',
		trait:'',
		description:''
	},'add-animal'))
}
