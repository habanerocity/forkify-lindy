import View from './view.js';

class SearchView extends View {
  _parentEl = document.querySelector('.search');

  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  //publisher
  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function(e) {
      e.preventDefault();
      handler();
    });
  }
}

//exporting an instance of the SearchView() object
export default new SearchView();
