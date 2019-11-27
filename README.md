# frontend-data

<img width="1280" alt="Screenshot 2019-11-27 at 12 58 42" src="https://user-images.githubusercontent.com/45425087/69721740-cc6e7d80-1115-11ea-8ed6-b4a19bab2eb3.png">


## Het concept

Ik ga een overziecht maken van de data. Ik wil de alle categorieën in een pie-chart laten zien en als je op de pie-chart hovert krijg je dan de naam van de categorie en hoeveel objecten erin zijn die aan een locatie zijn toegewezen. Daarnaast kan de gebruiker op een van de categorieën klikken. Zodat de gebruiker de bar-chart kan updaten. De bar-chart bevat de continenten en aantal objecten per continent van de gekozen categorie. Bovendien kan de gebruiker klikken op een van de continenten zodat de pie-chart aangepast wordt en laat objecten zien van de continenet die de gebruieker erop heeft geklikt. Ik heb deze concept gekozen omdat ik het leuk vindt om Rik te helpen en zijn werk makkelijker maken door een overzicht aan hem te geven van alle objecten die de musea hebben en waar deze objecten vandaan komen zodat hij makkelijker een tentoonstelling kan maken.

### De Opdrachtgever is Rick en mijn eindgebruiker is ook Rik.

## Features 
* Animation
* Giving information on hover
* Connected charts

## Functional programming pattren
[click here](https://github.com/MohamadAlGhorani/functional-programming/wiki/Data-opschonen) 

## D3 update pattren
[click here]() 

## API reference

I used SPARQL in this app to retrieve data from the museum's database. For more information about SPARQL [click here](https://nl.wikipedia.org/wiki/SPARQL)

Om mijn concept tot leven te brengen heb ik de volgende data variabelen nodig: alle categorieën van de collectie 
en het aantal objecten per collectie, per categorieën heb ik de continenten en he aantal objecten daarin. Daardoor moet ik een query schrijven die de categorieën ophaalt met het aantal objecten erin. En omdat er 19 hoofdcategorieën zijn heb ik dan per categorie een query moeten schrijven die de continenten van de categorie kan ophalen. 

[Hie kun je de queries bekijken die ik geschreven heb om de juiste data binnen te halen](https://github.com/MohamadAlGhorani/frontend-data/wiki/Data-en-SPARQUL-query).

## installiation

These instructions will get you a copy of the project up and running on your local machine.
* If you dont have node js on your device download it first from [here](https://nodejs.org/en/).
* Download the project.
* Open the terminal and navigate to the project folder and run ```npm install``` to install the node modules. 
* Run in your terminal ``` npm start ``` to open the project in your favorite browser.


## Deployment
I used Netlify te deploy my project more information about Netlify [click hier](https://www.netlify.com)

[![Netlify Status](https://api.netlify.com/api/v1/badges/0e963bb2-7d04-48ff-89bd-0c927b04a952/deploy-status)](https://app.netlify.com/sites/frontend-data-cmd/deploys)


## Credits

Thanks to the museum of volkenkunde for sharing their data and hosting us at the museum. And thanks to my teachers and colleagues for their help and sharing their knowledge. Thanks to Karthik Thota for the [tutorial](https://www.youtube.com/watch?v=kK5kKA-0PUQ) and thanks to David Buezas for his [transition function](http://bl.ocks.org/dbuezas/9306799) of the pie-chart on update.


## Authors

**Mohamad Al Ghorani** 


## License

Code is [MIT](https://github.com/MohamadAlGhorani/functional-programming/blob/master/LICENSE)
