# functional-programming

![Screenshot 2019-11-13 at 22 03 01](https://user-images.githubusercontent.com/45425087/68804355-d7c7a080-0661-11ea-8dbb-e96810ed0acd.jpg)


## Het concept

Ik ga een overziecht maken van de data ik wil de alle categorieën in een piechart laten zien en als je op de piechart hovert krijg je dan de naam van de categorie en hoeveel objecten erin die aan een locatie toegewezen zijn. wat ik nog ga doen is dat als je op een van de categorieën klikt krijg je dan een andere chart te zien met de continenten en aantal objecten per continent van de gekozen categorie. Ik heb deze concept gekozen omdat ik het leuk vindt om Rik te helpen en zijn werk makkelijker maken door een overzicht aan hem te geven van alle objecten die de musea hebben en waar deze objecten vandaan komen zodat hij makkelijker een tentoonstelling kan maken.

## Features 
* animatie
* informatie geven on hover

## Functional programming pattren
[click here](https://github.com/MohamadAlGhorani/functional-programming/wiki/Data-opschonen) 

## API reference

I used SPARQL in this app to retrieve data from the museum's database. For more information about SPARQL [click here](https://nl.wikipedia.org/wiki/SPARQL)

Om mijn concept tot leven te brengen heb ik de volgende data variabelen nodig: alle categorieën van de collectie 
en het aantal objecten per collectie, per categorieën heb ik de continenten en he aantal objecten daarin. Daardoor moet ik een query schrijven die de categorieën ophaalt met het aantal objecten erin. En omdat er 19 hoofdcategorieën zijn heb ik dan per categorie een query moeten schrijven die de continenten van de categorie kan ophalen. 

[Hie kun je de queries bekijken die ik geschreven heb om de juiste data binnen te halen](https://github.com/MohamadAlGhorani/frontend-data/wiki/Data-en-SPARQUL-query).

## Getting Started

These instructions will get you a copy of the project up and running on your local machine.
* If you dont hav node js on your device download it first from [here](https://nodejs.org/en/).
* Download the project.
* Open the folder with your favorite code editor.
* open the terminal and navigate to the project folder and run ```npm install```. 
* Run in your terminal ``` npm start ```That wil keep your css file in the dist updated for later deploy.
* Open the index.html with live review in your code editor if you dont have it you can always download the extintion.
* Or open the index.html in your browser.


## Deployment
I used Netlify te deploy my project more information about Netlify [click hier](https://www.netlify.com)

[![Netlify Status](https://api.netlify.com/api/v1/badges/0e963bb2-7d04-48ff-89bd-0c927b04a952/deploy-status)](https://app.netlify.com/sites/frontend-data-cmd/deploys)


## Credits

Thanks to the museum of volkenkunde for sharing their data and hosting us at the museum. And thanks to my teachers and colleagues for their help and sharing their knowledge. Thanx to Karthik Thota for the [tutorial](https://www.youtube.com/watch?v=kK5kKA-0PUQ).


## Authors

**Mohamad Al Ghorani** 


## License

Code is[MIT](https://github.com/MohamadAlGhorani/functional-programming/blob/master/LICENSE)
