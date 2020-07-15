const baseURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json'; //1
const key = '0KEpk6Xl5TFwGg3oPQsg9fuD8fZY40QL'; //2
let url; //3

//SEARCH FORM
const searchTerm = document.querySelector('.search');
//This holds the text input in our search box

const startDate = document.querySelector('.start-date');
//This holds the start date selector for the search form

const endDate = document.querySelector('.end-date');
//This holds the end date selector for the search form

const searchForm = document.querySelector('form');
//This holds the entire form

const submitBtn = document.querySelector('.submit');
//This holds our submit button

//RESULTS NAVIGATION
const nextBtn = document.querySelector('.next');
//Pagination for the next 10

const previousBtn = document.querySelector('.prev');
//Pagination for the previous 10

const nav = document.querySelector('nav');

//RESULTS SECTION
const section = document.querySelector('section');

nav.style.display = 'none';
// ^We do this to hide the "Previous"/"Next" navigation when the page loads, before we do a search. 
// We don't want it turned on immediately when there are no results to page through.

let pageNumber = 0;
let displayNav = false;
// ^Set the pageNumber to 0 by default, and set displayNav to false to further 
// ensure that it won't be visible until we want it to be

  //1                     //2   
  searchForm.addEventListener('submit', fetchResults); 
  nextBtn.addEventListener('click', nextPage); //3
  previousBtn.addEventListener('click', previousPage); //3

  // 1 => When this event happens (the form is submitted by pressing the submit button),
  // we will fire off a function called fetchResults, the second parameter in the function.

  // 2 => The same is true for the other two items, except that they called are click events.
  // When we click on the next button, we fire off a function called nextPage.

  // 3 => When we click on the previous button, we run previousPage.

 

                      //1
  function fetchResults(e) {
    e.preventDefault(); //6
    console.log(e); //2
    // Assemble the full URL
    url = baseURL + '?api-key=' + key + '&page=' + pageNumber + '&q=' + searchTerm.value; //3
    console.log(url); //4

    if(startDate.value !== '') { //If the value is strictly not empty
        console.log(startDate.value)
      url += '&begin_date=' + startDate.value;
      console.log('URL', url);
    };
  
    if(endDate.value !== '') {
      url += '&end_date=' + endDate.value;
      console.log(endDate.value)
    };

     //1a
    fetch(url)
    .then(function(result) { //Whenever the fetch is done
        console.log(result) //Log the result
        return result.json(); //2a => And return the result in json
    }).then(function(json) {
        console.log(json); //3a
        displayResults(json);
    });
  }

  function displayResults(json) {
    while (section.firstChild) {
        section.removeChild(section.firstChild);  
    }
    let articles = json.response.docs;
  
    if(articles.length === 10) {
        nav.style.display = 'block'; //shows the nav display if 10 items are in the array
      } else {
        nav.style.display = 'none'; //hides the nav display if less than 10 items are in the array
      }

    if(articles.length === 0) {
      console.log("No results");
    } else { //display data
      for(let i = 0; i < articles.length; i++) { //The articles variable contains an array of articles, so we can iterate over that array in the else
                                                 //As long as the length of the articles is less than the index, iterate up by one
         let article = document.createElement('article'); 
         let heading = document.createElement('h2');
         let link = document.createElement('a');
        //We create a link variable that is going to use the a element, the anchor tag which will allow us to create an 'href' link.

        let img = document.createElement('img');
        //We add an img variable that will create an image element

         let para = document.createElement('p');
        //We've declared a paragraph variable that will append a p tag to the DOM to be used for some of our JSON data

         let clearfix = document.createElement('div');
        //We're declaring a clearfix variable that will later on append a div to the DOM. More on that later

          let current = articles[i];
        //We create a current variable that holds the data of the current article as we iterate.

          console.log("Current:", current);
        //We log the current data so that we can see it in the console.
  
          link.href = current.web_url;
        //Since link is an a element, we need to attach an href property to it. current.web_url grabs the hyperlink for 
        //the current article out of the json result. This will set the value for the link.href each time we iterate.

          link.textContent = current.headline.main;
        //The text that we'll use in link.textContent is set to the value of current.headline.main, 
        //which is part of the json object from the NYT API
  
          para.textContent = 'Keywords: ';
        //We are adding the textContent attribute to our para variable. 
        //Each result will show this at the start of the p tag that is created by para

      for(let j = 0; j < current.keywords.length; j++) {
        //Now, we have a for loop inside of our for loop. We are using this nested loop to iterate over the current object, 
        //specifically the keywords array for that object. If you look through the JSON results, 
        //you'll see that keywords is a property of the entire object, and it's an array. 
        //Here, we iterate through the length of the array for the current result object
        
        let span = document.createElement('span');   
        //s we iterate, we create a <span> for each keyword. If you don't already know, 
        //a <span> will be an element that will end when the item ends. 
        //So, the <span> of Pizza will start at the P and end at the a. If we were to use a p tag here, 
        //it would cover the entirity of the parent object

        span.textContent += current.keywords[j].value + ' ';   
        //The textContent for each <span> will be the value found inside the keywords array inside the JSON object

        para.appendChild(span);
        //We append each <span> to the para node
      }

      if (current.multimedia.length > 0) {
        //We use a conditional to check the JSON for data. There is a multimedia property in the JSON
        //If that has anything in it (if the length is greater than 0), then, we'll do some stuff in the next steps

        img.src = 'http://www.nytimes.com/' + current.multimedia[0].url;
        //If there is an object, we want to concatenate a string with the url for the html src value. 
        //We will add the first item in the multimedia array: current.multimedia[0].url

        img.alt = current.headline.main;
      }

      clearfix.setAttribute('class','clearfix');
      //Remember that we still have an outer loop and printing the results. 
      //Here, we're using the setAttribute method to target our clearfix class. It's a class in the CSS file

        article.appendChild(img);

        article.appendChild(heading);
        //This will create a child node on that element.
        //We pass in heading to the appendChild method. 
        //This means that there will be an h2 element created inside each article element.

        heading.appendChild(link);

        article.appendChild(para);
        article.appendChild(clearfix);
        //We add clearfix & para as children of article

        section.appendChild(article);
        //Since we have a section in our original html file, we call the appendChild() method on the section element.
        // We pass in the article to that. This way, the article is a child of section, 
        //and the h2 is a grandchild of section.
    
      }
    }
  };
  
   function nextPage(e) {
    pageNumber++; //1 We first increase the value of the pageNumber variable
    fetchResults(e);  //2 We rerun the fetchResults function
    console.log("Page number:", pageNumber); //3 We print the pageNumber variable so that we can see it increment
 };

 function previousPage(e) {
  if(pageNumber > 0) { //1
    pageNumber--; //2
  } else {
    return; //3
  }
  fetchResults(e); //4
  console.log("Page:", pageNumber); //5

};

  // 1 => The little (e) is part of something in Javascript called an event handling function.
  // Every event handling function receives an event object. For the purpose of this discussion,
  // think of an object as a "thing" that holds a bunch of properties (variables) and methods (functions).
  // The handle, the e, is similar to a variable that allows you to interact with the object.

  // 2 => We are logging the event object so that you can look at it in the console for learning purposes.

  // 3 => We are creating a versatile query string. The url variable is loaded with other variables and url requirements.
  // We have our base for the API, our key, the page number that corresponds to the results array,
  // and our specific value. Something to study on your own might be: ?, &, and &q= in a URL string.
  
  // 4 => We log the string so that we can see it. Later on, you can try another search and see how it changes.

  // 5 => We add in a few basic functions to define nextPage and previousPage and log them.
  // If you leave out this step, your app will get an error.

  // 6 => We add the preventDefault method to make sure that a request isn't actually sent.
  // In other words, even though we tell our code to submit the data, we don't actually want
  // data to be submitted anywhere. This isn't a form where we are signing up for something
  // or filling out data to be saved in a database. That is the default nature of a
  // form element: to submit data, to send a POST request.

  // Endpoints => Remember that when we fetch data from an API, we make a request for
  // some kind of data to a specific point. That point is called an endpoint and comes in the form of a URL.
  // That URL is the gateway to the server, which ultimately does the logic of looking for the proper data
  // in the database. In the code above, we use the endpoint, the baseURL, and add our query string to it
  // so that it can access the proper data.

  // 1a => Remember that fetch is a reserved keyword in JavaScript that allows us to
  // make a request for information, similar to using a GET request with HTTP.
  // The url is given to fetch as a parameter, which sends the request to the url.

  // 2a => Meanwhile, it creates a promise containing a result object.
  // This is our response. Remember that we use promises when we have asynchronous,
  // long-running operations. The fetch gets the network resource,
  // which might take a long time to resolve. It will convert the response into a json object
  // by returning the result.json function.

  // 3a => That json object is used in another promise (set off by the second .then)
  // to send the information received to another function.
  // For now, we'll use console.log(json) to see the json data.

// -We make the fetch request.
// -We pass in the NYT url.
// -We create a promise .then that returns a response object called result.
// -The promise asynchronously returns a function that converts the result into usable
// json format - result.json() is that function call.
// -We create a second promise that has a function that takes in the json object.
// -We log the json object for now.