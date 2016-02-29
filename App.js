// https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=[api_key]&photoset_id=[photoset_id]&user_id=[user_id]&format=json&per_page=21&page=1&extras=url_o,url_m,url_l,url_c
// https://github.com/neptunian/react-photo-gallery
import React from 'react';
import ReactDOM from 'react-dom';
import Gallery from 'react-photo-gallery';
import $ from 'jquery';
import _ from 'lodash';

class App extends React.Component {
  //https://github.com/neptunian/react-photo-gallery
  constructor(){
    super();
    this.state = {photos:null, pageNum:1, totalPages:1, loadedAll: false};
    this.handleScroll = this.handleScroll.bind(this);
    this.loadMorePhotos = this.loadMorePhotos.bind(this);
    this.flickrurl = 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=372ef3a005d9b9df062b8240c326254d&photoset_id=72157631971715898&user_id=57933175@N08&format=json&per_page=21&page='
    this.flickrurlParam = '&extras=url_o,url_m,url_l,url_c'
    console.debug(this.flickrurl)
    console.debug(this.flickrurlParam)
  } // constructor

  componentDidMount() {
      this.loadMorePhotos();
      this.loadMorePhotos = _.debounce(this.loadMorePhotos, 200);
      window.addEventListener('scroll', this.handleScroll);
  } // componentDidMount
  handleScroll(){
      if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 50)) {
          this.loadMorePhotos();
      }
  } // handleScroll

  loadMorePhotos(e){
      if (e){
          e.preventDefault();
      }
      if (this.state.pageNum > this.state.totalPages){
        this.setState({loadedAll: true});
        return;
      }
      $.ajax({
        url: this.flickrurl+this.state.pageNum+this.flickrurlParam,
        dataType: 'jsonp',
        jsonpCallback: 'jsonFlickrApi',
        cache: false,
        success: function(data) {
          let photos = data.photoset.photo.map(function(obj,i){
              let aspectRatio = parseFloat(obj.width_o / obj.height_o);
              return {
                  src: (aspectRatio >= 3) ? obj.url_c : obj.url_m,
                  width: parseInt(obj.width_o),
                  height: parseInt(obj.height_o),
                  aspectRatio: aspectRatio,
                  src: obj.url_l
              };
          });
          this.setState({
            photos: this.state.photos ? this.state.photos.concat(photos) : photos,
            pageNum: this.state.pageNum + 1,
            totalPages: data.photoset.pages
          });
        }.bind(this),
          error: function(xhr, status, err) {
            console.error(status, err.toString());
          }.bind(this)
        });
  }  // loadMorePhotos

  renderGallery(){
    return(
        <Gallery photos={this.state.photos}/>
    );
  } // renderGallery

  render(){
      // no loading sign if its all loaded
        if (this.state.photos && this.state.loadedAll){
            return(
              <div>
                  {this.renderGallery()}
              </div>
            );
        }
      else if (this.state.photos){
          return(
              <div>
                  {this.renderGallery()}
                <div className="loading-msg" id="msg-loading-more">Loading photos</div>
              </div>
          );
      }
      else{
          return(
              <div>
                <div id="msg-app-loading" className="loading-msg">Loading <span class="one">.</span><span class="two">.</span><span class="three">.</span></div>
              </div>
          );
      }
  } // render

}
export default App
