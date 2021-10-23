import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import ResultsView from './views/resultsView.js';
import PaginationView from './views/paginationView.js';
import BookmarksView from './views/bookmarksView.js';
import AddRecipeView from './views/addRecipeView';

//polyfilling es6 features and async/await
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView';
// import resultsView from './views/resultsView.js';
// import paginationView from './views/paginationView.js';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function() {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    //0) Update resultsView to mark selected search result
    ResultsView.update(model.getSearchResultsPage());

    //1)Updating bookmarks View
    BookmarksView.update(model.state.bookmarks);

    //2) Loading recipe
    await model.loadRecipe(id);

    //3)rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    alert(err);
    recipeView.renderError();
    console.error(err);
  }
};

//subscriber
const controlSearchResults = async function() {
  try {
    ResultsView.renderSpinner();
    //1.) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2.) Load search results
    await model.loadSearchResults(query);

    //3.) Render results
    ResultsView.render(model.getSearchResultsPage());

    //4.) Render initial pagination buttons
    PaginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function(goToPage) {
  //1.) Render new results
  ResultsView.render(model.getSearchResultsPage(goToPage));

  //2.) Render new pagination buttons
  PaginationView.render(model.state.search);
};

const controlServings = function(newServings) {
  //Update the recipe servings (in state)
  model.updateServings(newServings);

  //Update the recipe View
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function() {
  //1) add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else {
    model.deleteBookmark(model.state.recipe.id);
  }

  //2) update recipeView
  recipeView.update(model.state.recipe);

  //3)Render bookmarks
  BookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function() {
  BookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function(newRecipe) {
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();

    //Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    //Render recipe
    recipeView.render(model.state.recipe);

    //Success message
    addRecipeView.renderMessage();

    //Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //Change ID in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //Close form window
    setTimeout(function() {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('👎🏼', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function() {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  PaginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();

// window.addEventListener('hashchange', showRecipe);
// window.addEventListener('load', showRecipe);
